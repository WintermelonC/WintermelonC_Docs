# UCharacterMovementComponent

`UCharacterMovementComponent`（简称 CMC）是 UE 角色移动的核心组件，它把「输入 → 加速度 → 速度 → 碰撞滑动 → 位置」这一整套运动学计算封装起来，并内置了完整的 **客户端预测 + 服务器权威 + 平滑纠错** 的网络同步机制。可以说它是 UE 网络同步设计最精妙的模块之一

## 1 组件概览

继承链：

```text linenums="1"
UActorComponent
└── UMovementComponent        // 通用移动基类
    └── UPawnMovementComponent // 与 Pawn 关联，处理输入向量
        └── UCharacterMovementComponent
```

`ACharacter` 在构造时自动创建一个 CMC：

```cpp
// Character.cpp（简化）
ACharacter::ACharacter(const FObjectInitializer& ObjectInitializer)
{
    CapsuleComponent = CreateDefaultSubobject<UCapsuleComponent>(TEXT("CapsuleComponent"));
    CharacterMovement = CreateDefaultSubobject<UCharacterMovementComponent>(TEXT("CharMoveComp"));
}

UCharacterMovementComponent* ACharacter::GetCharacterMovement() const { return CharacterMovement; }
```

职责：

- 处理输入的加速度与速度积分
- 地面检测、台阶上下、可站立面判定
- 重力、跳跃、下落、游泳、飞行
- **网络预测、复制与纠错**

## 2 移动模式 MovementMode

CMC 用一个状态机表示当前运动状态，定义于 `Engine/Source/Runtime/Engine/Classes/GameFramework/CharacterMovementComponent.h`：

```cpp
// CharacterMovementComponent.h（节选）
UENUM(BlueprintType)
enum EMovementMode
{
    MOVE_None,
    MOVE_Walking,      // 在地面上行走
    MOVE_NavWalking,   // 导航网格行走
    MOVE_Falling,      // 下落（含跳跃）
    MOVE_Swimming,     // 游泳
    MOVE_Flying,       // 飞行
    MOVE_Custom,       // 自定义模式
    MOVE_MAX,
};
```

每种模式对应一个 `Phys*` 函数：

| 模式 | 物理函数 |
| --- | --- |
| `MOVE_Walking` | `PhysWalking()` |
| `MOVE_Falling` | `PhysFalling()` |
| `MOVE_Swimming` | `PhysSwimming()` |
| `MOVE_Flying` | `PhysFlying()` |
| `MOVE_Custom` | `PhysCustom()` |

```cpp
// 切换模式
CharacterMovement->SetMovementMode(MOVE_Flying);
```

!!! tip "自定义移动模式"

    设 `MOVE_Custom` 并配合 `CustomMovementMode`（一个 `uint8`），再重写 `PhysCustom(float DeltaTime, int32 Iterations)`，就能在不改引擎的前提下实现爬墙、绳索、贴墙跑等特殊移动，且仍然享受 CMC 的网络同步

## 3 核心移动参数

常用参数（均在 `CharacterMovementComponent.h` 中）：

| 参数 | 作用 |
| --- | --- |
| `MaxWalkSpeed` | 最大行走速度 |
| `MaxAcceleration` | 最大加速度 |
| `BrakingDecelerationWalking` | 停止时的减速度 |
| `GroundFriction` | 地面摩擦 |
| `JumpZVelocity` | 跳跃初速度 |
| `AirControl` | 空中控制力 |
| `GravityScale` | 重力缩放 |
| `MaxStepHeight` | 可跨越的台阶高度 |
| `WalkableFloorAngle` | 可站立的坡面角度 |

```cpp
// 设置最大速度（注意：应在服务器上改，见第 6 节）
CharacterMovement->MaxWalkSpeed = 600.0f;
```

## 4 每帧移动流程

`TickComponent` 是所有逻辑的入口，它根据 **网络角色** 决定走哪条路径：

```cpp
// CharacterMovementComponent.cpp（简化）
void UCharacterMovementComponent::TickComponent(float DeltaTime, ...)
{
    const ENetRole LocalRole = CharacterOwner->GetLocalRole();

    if (LocalRole == ROLE_Authority)
    {
        // 服务器：直接执行移动并处理客户端请求
        PerformMovement(DeltaTime);
    }
    else if (LocalRole == ROLE_AutonomousProxy)
    {
        // 本地玩家：预测 + 上报服务器
        ReplicateMoveToServer(DeltaTime, Acceleration);
    }
    else if (LocalRole == ROLE_SimulatedProxy)
    {
        // 其他玩家：平滑插值到服务器发来的位置
        SimulatedTick(DeltaTime);
    }
}
```

单次移动的实际计算在 `PerformMovement` 里：

```cpp
// CharacterMovementComponent.cpp（简化）
void UCharacterMovementComponent::PerformMovement(float DeltaSeconds)
{
    // 1. 应用根运动（动画驱动位移）
    // 2. 计算加速度（输入向量 × MaxAcceleration）
    // 3. 按当前 MovementMode 调用对应 Phys* 函数
    //    PhysWalking / PhysFalling / ...
    // 4. 碰撞检测与滑动（MoveAlongFloor / SafeMoveUpdatedComponent）
    // 5. 更新 MovementMode（落地、掉出边缘、进入水中）
}
```

## 5 地面检测与步进

行走模式的两个关键机制：

- **地面检测**：`FindFloor` 从胶囊体向下 `Sweep`，用 `WalkableFloorAngle` 判断法线是否可站立
- **台阶处理**：`StepUp` / `StepDown` 让角色能走上小台阶而不是被挡住；`MaxStepHeight` 决定多高算台阶

```cpp
// CharacterMovementComponent.cpp（简化）
bool UCharacterMovementComponent::IsWalkable(const FHitResult& Hit) const
{
    // 法线角度小于 WalkableFloorAngle 才算可站立面
}
```

## 6 网络同步机制

### 6.1 三种角色与三条路径

CMC 的网络同步完全围绕 `Role` 展开：

| 角色 | 所在端 | 同步策略 |
| --- | --- | --- |
| `ROLE_Authority` | 服务器 | 权威计算，广播结果 |
| `ROLE_AutonomousProxy` | 本地玩家客户端 | **客户端预测** + 服务器校验 |
| `ROLE_SimulatedProxy` | 其他玩家客户端 | 接收复制并 **平滑插值** |

核心思想：**本地玩家不能等服务器回包**（否则操作有延迟），所以先本地预测；但预测可能错，所以服务器要能纠错；其他玩家不需要响应输入，只需要平滑地"跟着走"

### 6.2 客户端预测：ReplicateMoveToServer

本地玩家（AutonomousProxy）每帧走这条路径：

```text linenums="1"
TickComponent
└── ReplicateMoveToServer(DeltaTime, Acceleration)
    ├── 1. 本地立即执行 PerformMovement()          // 预测，操作零延迟
    ├── 2. 把本次移动存进 SavedMoves（FSavedMove_Character）
    ├── 3. 尝试合并可合并的移动，减少 RPC 次数
    ├── 4. 发送 ServerMove RPC（携带时间戳、加速度、位置、压缩标志）
    └── 5. 处理待处理的服务器响应（ClientAdjustPosition / ClientAckGoodMove）
```

```cpp
// CharacterMovementComponent.cpp（简化）
void UCharacterMovementComponent::ReplicateMoveToServer(float DeltaTime, const FVector& NewAcceleration)
{
    // 1. 本地预测移动
    PerformMovement(DeltaTime);

    // 2. 保存本次移动，供服务器确认后回放对比
    FSavedMove_Character* const NewMove = ClientData->CreateSavedMove();
    NewMove->SetMoveFor(CharacterOwner, DeltaTime, NewAcceleration, *ClientData);

    // 3. 送到服务器
    ClientData->SavedMoves.Add(NewMove);
    // ... 发送 ServerMove
}
```

**为什么保存 `SavedMoves`**：服务器回包时，客户端把"已确认之前的移动"重新执行一遍（replay），从而把位置校正为"服务器结果 + 尚未确认的本地预测"，避免闪回

### 6.3 输入复制与数据压缩

客户端的移动数据被打包成 `FCharacterNetworkMoveData`，并对浮点做定点量化以省带宽：

```cpp
// CharacterMovementComponent.h（简化）
USTRUCT()
struct FCharacterNetworkMoveData
{
    UPROPERTY() FVector_NetQuantize10  Acceleration;      // 10 位定点量化
    UPROPERTY() FVector_NetQuantize100 Location;          // 100 位定点量化
    UPROPERTY() FVector_NetQuantize10  ControlRotation;
    UPROPERTY() float TimeStamp;                          // 客户端时间戳
    UPROPERTY() uint8 CompressedFlags;                    // 压缩的输入标志
    UPROPERTY() FRootMotionSourceGroup RootMotionSourceGroup;  // 根运动
};
```

标志位 `CompressedFlags` 把"是否按跳跃""是否想下蹲"等布尔打包进一个字节：

```cpp
// FSavedMove_Character（节选）
enum CompressedFlags
{
    FLAG_JumpPressed   = 0x01,   // 按了跳跃
    FLAG_WantsToCrouch = 0x02,   // 想下蹲
    FLAG_Reserved1     = 0x04,
    FLAG_Reserved2     = 0x08,
    FLAG_Reserved3     = 0x10,
    FLAG_Custom_0      = 0x20,   // 自定义标志
    FLAG_Custom_1      = 0x40,
    FLAG_Custom_2      = 0x80,
};
```

!!! tip "为什么要量化"

    `FVector_NetQuantize10` 表示分量按 10 位精度定点存储，`FVector_NetQuantize100` 是 100 位精度。位置需要更高精度（厘米级）、加速度不需要，这样能在保证手感的前提下显著压缩每个移动包的体积

### 6.4 服务器校验与纠错

服务器收到 `ServerMove` 后执行同样的移动逻辑，然后比对结果：

```text linenums="1"
ServerMove_Implementation(TimeStamp, InAccel, ClientLoc, CompressedFlags, ...)
└── ServerMoveHandleClientError(...)
    ├── 1. 用相同输入执行一次权威移动（MoveAutonomous → PerformMovement）
    ├── 2. 比对服务器位置与客户端上报位置
    ├── 3. 误差 > 阈值 → 发送 ClientAdjustPosition（纠正）
    └── 4. 误差 < 阈值 → 发送 ClientAckGoodMove（确认）
```

```cpp
// CharacterMovementComponent.cpp（简化）
// 位置误差平方超过该阈值（MAXPOSITIONERRORSQUARED）才纠正
void UCharacterMovementComponent::ServerMoveHandleClientError(
    float ClientTimeStamp, float DeltaTime, const FVector& Accel,
    const FVector& RelativeClientLocation, ...)
{
    // 误差超过阈值：告诉客户端"你在正确位置应该是 NewLoc"
    ClientAdjustPosition(ClientTimeStamp, ServerData->ServerLocation, ServerData->ServerVelocity, ...);
}
```

客户端收到 `ClientAdjustPosition` 后：

1. 用服务器给的位置替换当前位置
2. **重新回放** 尚未确认的 `SavedMoves`（replay），把预测的输入重新应用到新起点上
3. 若仍有偏差，用 **平滑纠错** 把视觉网格逐渐拉回，避免画面瞬移

```cpp
// CharacterMovementComponent.cpp（简化）
void UCharacterMovementComponent::ClientAdjustPosition_Implementation(
    float TimeStamp, FVector_NetQuantize NewLoc, FVector_NetQuantize100 NewVel, ...)
{
    // 1. 用服务器结果校正胶囊体位置
    // 2. 回放未确认的移动（replay）
    // 3. 调用 SmoothCorrection 平滑视觉偏移
}
```

!!! question "为什么纠错不会让画面抖动"

    CMC 把纠错分成两层：逻辑位置（胶囊体）**立即** 校正，保证判定正确；视觉网格（Mesh）则保留一个 `MeshTranslationOffset`，随 `NetworkSmoothingMode` 逐帧衰减到零。玩家看到的"被拉回"是平滑的，而游戏逻辑早已是正确位置

### 6.5 模拟代理的平滑：SmoothCorrection

对其他玩家（SimulatedProxy），服务器只按 `NetUpdateFrequency` 发送 `ReplicatedMovement`（位置 + 速度），客户端不宜直接瞬移过去，而是做平滑：

```cpp
// CharacterMovementComponent.h（节选）
UENUM()
enum ENetworkSmoothingMode
{
    Disabled,      // 不平滑（适合瞬移类对象）
    Linear,        // 线性插值
    Exponential,   // 指数平滑（默认，更自然）
};

UPROPERTY(Category = "Character Movement (Networking)", EditAnywhere)
TEnumAsByte<ENetworkSmoothingMode> NetworkSmoothingMode;

UPROPERTY(Category = "Character Movement (Networking)", EditAnywhere)
float NetworkMaxSmoothUpdateDistance;   // 超过该距离就忽略平滑直接跟

UPROPERTY(Category = "Character Movement (Networking)", EditAnywhere)
float NetworkNoSmoothUpdateDistance;    // 超过该距离干脆不平滑
```

```cpp
// CharacterMovementComponent.cpp（简化）
void UCharacterMovementComponent::SmoothCorrection(
    const FVector& OldLocation, const FQuat& OldRotation,
    const FVector& NewLocation, const FQuat& NewRotation)
{
    // 计算"旧位置 → 新位置"的偏差，写入视觉偏移，逐帧衰减
    MeshTranslationOffset = OldLocation - NewLocation;
    bNetworkSmoothingComplete = false;
}
```

模拟代理的每帧逻辑在 `SimulatedTick`：

```text linenums="1"
SimulatedTick(DeltaSeconds)
├── 读取复制来的位置/速度（ReplicatedMovement）
├── 若开启了平滑：向目标位置插值（Linear / Exponential）
├── 用速度外推（extrapolation）填补包间隔
└── 平滑完成后 bNetworkSmoothingComplete = true
```

### 6.6 关键类速查

| 类 | 作用 |
| --- | --- |
| `FSavedMove_Character` | 客户端保存的一次移动（输入 + 结果），用于回放与对比 |
| `FNetworkPredictionData_Client_Character` | 客户端的预测数据（`SavedMoves` / `LastAckedMove` / 时间戳） |
| `FNetworkPredictionData_Server_Character` | 服务器的校验数据（客户端时间戳 / 待处理移动） |
| `FCharacterNetworkMoveData` | 网络上传输的移动数据（量化坐标 + 压缩标志） |
| `FCharacterMoveResponseDataContainer` | 服务器回包的数据容器（纠正 / 确认） |
| `FRootMotionSource` | 根运动源（受击位移、冲刺） |

```cpp
// CharacterMovementComponent.h（简化）
FNetworkPredictionData_Client_Character* GetPredictionData_Client() const;
FNetworkPredictionData_Server_Character* GetPredictionData_Server() const;
```

!!! tip "服务器与客户端的时间戳"

    每个移动都带客户端时间戳，服务器据此丢弃重复包（时间戳倒退）并保证按序处理。服务器回包时把时间戳带回，客户端用它对齐 `SavedMoves`，找到该从哪次移动开始回放

## 7 根运动与移动

根运动（Root Motion）由动画提取、交给 CMC 应用，并且同样走网络同步：

- 客户端把 `RootMotionSourceGroup` 打包进 `FCharacterNetworkMoveData` 一起上报
- 服务器在权威移动中应用根运动，再把结果通过 `ClientAdjustPosition` 同步回客户端
- 受击位移、冲刺这类"由动画/技能驱动的位移"常用 `FRootMotionSource`

## 8 常见陷阱与最佳实践

- 改移动参数（如 `MaxWalkSpeed`）要在 **服务器** 上改，客户端改会被纠错覆盖
- **不要** 直接 `SetActorLocation` 移动角色，用 `AddMovementInput` / `LaunchCharacter` / `AddImpulse`
- 需要 CMC 生效必须 `bReplicates = true`，且 `ACharacter` 的 `Role` 正确
- 不要用 `SimulatedProxy` 的精确位置做判定（它平滑过、会滞后），判定交给服务器
- `MaxSimulationTimeStep`（默认 0.05s）与 `MaxSimulationIterations`（默认 8）限制单帧物理子步数，卡帧时会出现"追帧"移动
- 自定义移动模式记得重写 `PhysCustom`，并让它在服务器与客户端逻辑一致（否则必然被纠错）
- 高频改 `NetworkSmoothingMode` 或把它设为 `Disabled` 会让远端角色瞬移
- 移动相关的 RPC 参数都要校验，客户端输入不可信
