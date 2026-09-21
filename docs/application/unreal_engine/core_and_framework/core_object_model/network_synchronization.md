# 网络同步

多人游戏的核心难题是：每个玩家在自己的设备上看到的世界如何保持一致。网络同步就是解决"多台设备上的游戏状态如何对齐"的机制。本文先讲游戏层面通用的网络同步概念，再讲 UE5 的具体实现

## 1 什么是网络同步

在单人游戏里，所有逻辑都跑在一台设备上，状态是唯一的。而在多人游戏里，每个玩家设备（客户端）各自运行一份游戏逻辑，如果互不通信，大家看到的世界就会各不相同。网络同步的目标，就是让 **所有玩家看到的世界尽量一致**

```text linenums="1"
玩家 A 的客户端 ──── 网络 ──── 服务器 ──── 网络 ──── 玩家 B 的客户端
```

## 2 同步的挑战

网络同步面临三个根本性挑战：

- **延迟**：数据在网络中传输需要时间，不同玩家看到的世界存在时间差
- **带宽**：同步全部状态数据量巨大，必须压缩与裁剪
- **丢包**：网络不可靠，数据可能丢失或乱序

此外还要在 **一致性** 与 **流畅性** 之间取舍：完全一致意味着等待最慢的数据，体验卡顿；过于流畅则可能出现瞬移、穿透

## 3 常见同步方案

游戏行业有两大主流同步方案：

| 方案 | 原理 | 代表 |
| --- | --- | --- |
| 状态同步 | 服务器同步对象状态，客户端插值渲染 | FPS、MMO |
| 帧同步 | 客户端同步输入，各自确定性演算 | RTS、格斗 |

### 3.1 状态同步

服务器是权威，客户端只上传输入，服务器计算后把结果状态广播给所有客户端。客户端用插值/预测隐藏延迟

### 3.2 帧同步

所有客户端按相同的输入序列、用确定性的逻辑逐帧演算，因此状态天然一致。要求逻辑完全确定，且需等待所有玩家的输入

## 4 两种方案的取舍

| 维度 | 状态同步 | 帧同步 |
| --- | --- | --- |
| 权威方 | 服务器 | 各客户端（确定性） |
| 带宽 | 同步状态（较大） | 同步输入（较小） |
| 一致性 | 强一致（服务器裁决） | 依赖确定性 |
| 延迟敏感度 | 可插值隐藏 | 等待最慢玩家 |
| 防作弊 | 强 | 弱（客户端可算） |

UE5 内置的是 **状态同步**（客户端-服务器 + 服务器权威）模型

## 5 UE5 的网络架构：NetDriver 与连接

UE5 采用 **客户端-服务器（Client-Server）** 模型，且 **服务器是权威**：

```text linenums="1"
客户端（Client）
    │  输入、RPC 请求
    ▼
服务器（Server，权威）
    │  广播状态、RPC 调用
    ▼
所有客户端
```

网络子系统由三个核心类组成，定义于 `Engine/Source/Runtime/Engine/Classes/Engine/NetDriver.h` 与 `NetConnection.h`：

| 类 | 职责 |
| --- | --- |
| `UNetDriver` | 网络会话总管，每帧驱动复制、管理所有连接 |
| `UNetConnection` | 服务器与某个客户端的单条连接，持有通道与视图目标 |
| `UChannel` / `UActorChannel` | 一条连接上的数据通道，每个被复制的 Actor 占一个 `UActorChannel` |

```text linenums="1"
UNetDriver
├── UNetConnection（每个客户端一条）
│     ├── UControlChannel（控制通道）
│     ├── UVoiceChannel（语音）
│     └── UActorChannel（每个同步 Actor 一个）
│           └── FObjectReplicator（属性复制执行者）
```

`NetMode` 区分运行角色：

| 模式 | 说明 |
| --- | --- |
| `NM_Standalone` | 单机，无网络 |
| `NM_DedicatedServer` | 专用服务器，无本地玩家 |
| `NM_ListenServer` | 监听服务器（主机既是服务器又是玩家） |
| `NM_Client` | 客户端 |

```cpp linenums="1"
bool bIsServer = GetNetMode() != NM_Client;
bool bAuth = HasAuthority();   // 是否有服务器权威
```

## 6 网络角色与所有权

每个 Actor 的 `Role` 与 `RemoteRole` 字段定义于 `Engine/Source/Runtime/Engine/Classes/GameFramework/Actor.h`，表示它在当前机器与对端的身份：

```cpp linenums="1"
// Actor.h（简化）
UCLASS()
class ENGINE_API AActor : public UObject
{
    // ...
    UPROPERTY(Replicated)
    ENetRole Role;          // 本机身份

    UPROPERTY(Replicated)
    ENetRole RemoteRole;    // 对端身份
};
```

`Role` 本身就是被复制的属性，服务器通过它告诉客户端"你在这台机器上是什么身份"：

| Role | 含义 |
| --- | --- |
| `ROLE_Authority` | 权威端（服务器） |
| `ROLE_AutonomousProxy` | 本地玩家控制的代理（客户端） |
| `ROLE_SimulatedProxy` | 其他玩家/对象的代理（客户端） |
| `ROLE_None` | 不参与网络 |

```cpp linenums="1"
// Actor.h（简化）
FORCEINLINE ENetRole AActor::GetLocalRole() const { return Role; }
FORCEINLINE bool AActor::HasAuthority() const { return (Role == ROLE_Authority); }
```

所有权由 `SetOwner` 建立，它同时设置 `Owner` 与所属连接的信息：

```cpp linenums="1"
// Actor.cpp（简化）
void AActor::SetOwner(AActor* NewOwner)
{
    Owner = NewOwner;
    // 同步 Owner 与所属 PlayerController 的连接信息
}
```

## 7 属性复制的底层机制

属性复制是状态同步的核心，其实现分三层：注册（`DOREPLIFETIME`）、执行（`FObjectReplicator` / `FRepLayout`）、触发（`OnRep`）

### 7.1 注册：DOREPLIFETIME 宏

`GetLifetimeReplicatedProps` 把要复制的属性收集成 `FLifetimeProperty` 列表。宏定义于 `Engine/Source/Runtime/Engine/Public/Net/UnrealNetwork.h`：

```cpp linenums="1"
// UnrealNetwork.h（简化）
#define DOREPLIFETIME(c, v) \
    { \
        static const bool bEvenIfNotSelected = true; \
        GetLifetimeReplicatedProps(OutLifetimeProps).Add( \
            FLifetimeProperty(c::ENetFields_Private::v, COND_None, REPNOTIFY_OnChanged, bEvenIfNotSelected)); \
    }

#define DOREPLIFETIME_CONDITION(c, v, cond) \
    { \
        static const bool bEvenIfNotSelected = true; \
        GetLifetimeReplicatedProps(OutLifetimeProps).Add( \
            FLifetimeProperty(c::ENetFields_Private::v, cond, REPNOTIFY_OnChanged, bEvenIfNotSelected)); \
    }
```

`c::ENetFields_Private::v` 是 UHT 为每个 `UPROPERTY(Replicated)` 生成的静态 `FProperty*`，宏据此把属性指针、条件、通知方式登记进列表

`AActor` 自己的复制属性就是走这个入口注册的：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/ActorReplication.cpp（节选）
void AActor::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);

    DOREPLIFETIME(AActor, Owner);
    DOREPLIFETIME(AActor, Role);
    DOREPLIFETIME(AActor, RemoteRole);
    DOREPLIFETIME(AActor, bReplicateMovement);
    DOREPLIFETIME_CONDITION(AActor, ReplicatedMovement, COND_SimulatedOnly);
    DOREPLIFETIME_CONDITION(AActor, AttachmentReplication, COND_Custom);
}
```

### 7.2 执行：FObjectReplicator 与 FRepLayout

真正做同步的是 `FObjectReplicator` 与它持有的 `FRepLayout`，定义于 `Engine/Source/Runtime/Engine/Public/Net/DataReplication.h` 与 `RepLayout.h`。每个被复制的 `UObject` 在一条连接上都有一个 `FObjectReplicator`：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/DataReplication.cpp（简化）
bool FObjectReplicator::ReplicateProperties(UObject* Object, UClass* Class,
                                            UActorChannel* Channel, FOutBunch& Bunch,
                                            FReplicationFlags RepFlags)
{
    // FRepLayout 根据注册的属性列表，比对当前值与上次发送值，只写出变化项
    return RepLayout->ReplicateProperties(
        RepState->GetSendingRepState(),        // 已发送的"影子状态"
        RepState->GetRepChangelistState(),     // 变化列表
        (const uint8*)Object,                  // 当前对象内存
        Class, Channel, Bunch, RepFlags);
}
```

同步"只发变化"的原理：

- `FRepLayout` 为每个对象维护一份 **影子状态（Shadow State）**，记录上次已发送的值
- 每帧把当前值与影子状态比对，只有不同的属性才写入 `Bunch`（网络数据包）
- 发送后更新影子状态，下次再比对

这就是为什么属性复制是增量的，而不是每帧全量发送

### 7.3 触发：OnRep 与条件复制

属性变化在客户端触发回调用 `ReplicatedUsing`：

```cpp linenums="1"
UPROPERTY(ReplicatedUsing = OnRep_Health)
float Health;

UFUNCTION()
void OnRep_Health();   // 客户端收到同步后调用
```

条件复制只同步给特定客户端：

```cpp linenums="1"
DOREPLIFETIME_CONDITION(AMyActor, Health, COND_OwnerOnly);   // 仅同步给拥有者
```

常见条件（`ELifetimeCondition`）：

| 条件 | 含义 |
| --- | --- |
| `COND_None` | 无条件，同步给所有 |
| `COND_OwnerOnly` | 仅拥有者客户端 |
| `COND_SkipOwner` | 除拥有者外 |
| `COND_SimulatedOnly` | 仅模拟代理 |
| `COND_InitialOnly` | 仅初始创建时 |
| `COND_Custom` | 自定义条件 |

!!! tip "Push Model（推送模型）"

    UE4.27 起提供推送模型，用 `MARK_PROPERTY_DIRTY_FROM_NAME` 手动标记属性"变脏"，跳过每帧的属性比对，减少大对象（如大量 `TArray`）的复制开销。默认的比对模式仍适合大多数场景

### 7.4 客户端如何监听到属性变化

客户端能收到通知，靠的是 `ReplicatedUsing` 加上引擎在收到数据后自动调用 `CallRepNotifies`。整条链路如下：

```text linenums="1"
UActorChannel::ReceivedBunch()
└── FObjectReplicator::ReceivedBunch()
    ├── FRepLayout::ReceiveProperties()   // 把收到的值写入对象内存
    └── FRepLayout::CallRepNotifies()     // 触发 RepNotify
        └── UObject::ProcessEvent()       // 调用 OnRep_Xxx
```

对应的源码：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/DataReplication.cpp（简化）
void FObjectReplicator::ReceivedBunch(FInBunch& Bunch, const FReplicationFlags& RepFlags)
{
    // 1. 解析 Bunch，把收到的属性值应用到对象内存
    RepLayout->ReceiveProperties(
        Connection, Object, RepState->GetReceivingRepState(),
        RepState->GetRepChangelistState(), Bunch, RepFlags);

    // 2. 触发本次发生变化的 RepNotify 回调
    RepLayout->CallRepNotifies(RepState->GetReceivingRepState(), false);
}
```

`CallRepNotifies` 内部取出属性上登记的 RepNotify 函数并调用：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/RepLayout.cpp（简化）
void FRepLayout::CallRepNotifies(FRepState* RepState, bool bKeepState)
{
    for (int32 i = 0; i < RepNotifies.Num(); ++i)
    {
        // RepNotifyFunc 来自 UPROPERTY(ReplicatedUsing = OnRep_Xxx)
        UFunction* Func = ...;                 // 反射查找得到的 UFunction
        Object->ProcessEvent(Func, nullptr);   // 触发 OnRep_Xxx
    }
}
```

关键点：

- `ReplicatedUsing = OnRep_Health` 会把函数名写入 `FProperty::RepNotifyFunc`（一个 `FName`）
- 服务器发送时，`FLifetimeProperty` 的 `RepNotifyCondition`（如 `REPNOTIFY_OnChanged`）决定"值变化才通知"还是"每次都通知"
- 客户端应用新值后，`CallRepNotifies` 通过反射找到 `OnRep_Xxx` 并 `ProcessEvent` 调用
- `OnRep` 必须是 `UFUNCTION()`；若声明一个与属性同类型的参数，会收到 **变化前的旧值**
- 引擎内建回调走同一机制，如 `AActor::OnRep_ReplicateMovement`、`AActor::OnRep_Owner`、`AActor::OnRep_ReplicatedMovement`

```cpp linenums="1"
// 带旧值参数的 RepNotify
UPROPERTY(ReplicatedUsing = OnRep_Health)
float Health;

UFUNCTION()
void OnRep_Health(float OldHealth)   // 参数可选，收到变化前的旧值
{
    // 播受伤特效、更新 UI 等
}
```

!!! tip "RepNotify 与 PostNetReceive*"

    `OnRep` 针对具体属性；移动/物理等内建同步还有另一条通知路径——`PostNetReceive*` 系列虚函数（如 `USceneComponent::PostNetReceiveLocationAndRotation`、`AActor::PostNetReceiveVelocity`），在收到网络数据后由引擎调用，供组件做插值

## 8 RPC 的底层机制

RPC 本质上是被 UHT 打上网络标志的 `UFunction`。标志位定义于 `Engine/Source/Runtime/CoreUObject/Public/UObject/ObjectMacros.h`：

```cpp linenums="1"
// ObjectMacros.h（节选）
enum EFunctionFlags : uint32
{
    // ...
    FUNC_Net          = 0x00000040,   // 网络函数
    FUNC_NetReliable  = 0x00000080,   // 可靠传输
    FUNC_NetRequest   = 0x00000100,   // 服务器请求
    FUNC_NetMulticast = 0x00004000,   // 多播
    FUNC_NetServer    = 0x00200000,   // Server RPC
    FUNC_NetClient    = 0x01000000,   // Client RPC
    FUNC_NetValidate  = 0x80000000,   // 需要校验
};
```

声明 RPC 时：

```cpp linenums="1"
UFUNCTION(Server, Reliable, WithValidation)
void ServerFire(int32 Ammo);

bool ServerFire_Validate(int32 Ammo);        // 客户端校验，返回 false 则不发送
void ServerFire_Implementation(int32 Ammo);  // 服务器实际执行
```

UHT 会生成对应的 `_Validate` 与 `_Implementation`，并给该 `UFunction` 打上 `FUNC_NetServer | FUNC_NetReliable | FUNC_NetValidate` 标志

当调用一个网络函数时，`UObject::ProcessEvent` 检测到 `FUNC_Net` 标志，转交给 `UNetDriver::ProcessRemoteFunction`：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/NetDriver.cpp（简化）
void UNetDriver::ProcessRemoteFunction(UNetConnection* Connection, AActor* Target,
                                       UFunction* Function, void* Parms, ...)
{
    if (Function->FunctionFlags & FUNC_NetMulticast)
    {
        // 广播给所有连接
        for (UNetConnection* Conn : ClientConnections) { /* 发送 */ }
    }
    else if (Function->FunctionFlags & FUNC_NetServer)
    {
        // 在服务器上本地执行（并校验）
    }
    else if (Function->FunctionFlags & FUNC_NetClient)
    {
        // 发送给拥有该 Actor 的客户端
    }
}
```

可靠性由通道缓冲实现：

- `Reliable`：写入可靠通道，带确认（ACK）与重传，保证按序到达
- `Unreliable`：写入不可靠通道，丢失不重发，用于高频表现

!!! warning "WithValidation 的校验在客户端执行"

    带 `WithValidation` 的 Server RPC 会先在 **客户端** 调用 `_Validate`，返回 false 则根本不发送，从源头拦截明显作弊；真正的逻辑在服务器端的 `_Implementation` 里再执行一次

## 9 网络底层：ServerReplicateActors 与 Channel

每帧网络复制的主流程是 `UNetDriver::TickFlush` → `ServerReplicateActors`：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/NetDriver.cpp（简化）
void UNetDriver::ServerReplicateActors()
{
    for (UNetConnection* Connection : ClientConnections)
    {
        // 对每条连接，遍历所有可能相关的 Actor
        for (FNetworkObjectInfo* ActorInfo : ConsiderList)
        {
            AActor* Actor = ActorInfo->Actor;

            // 相关性过滤：只为与该玩家相关的 Actor 建立通道
            if (!Actor->IsNetRelevantFor(Connection->ViewTarget, ...))
            {
                continue;
            }

            UActorChannel* Channel = Connection->FindOrCreateChannelForActor(Actor);
            Channel->ReplicateActor();
        }
    }
}
```

`UActorChannel::ReplicateActor` 再调用各对象的 `FObjectReplicator` 完成属性写入：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/DataChannel.cpp（简化）
bool UActorChannel::ReplicateActor()
{
    // 1. 确保复制器已创建
    // 2. Actor->ReplicateSubobjects() 复制子对象
    // 3. Replicator->ReplicateProperties() 复制属性
}
```

网络数据的最小传输单元是 **Bunch**（`FOutBunch` / `FInBunch`），属性与 RPC 最终都序列化进 Bunch，再由可靠/不可靠通道发送

## 10 相关性、优先级与带宽

服务器不可能把每个 Actor 同步给每个玩家，相关性过滤是第一道闸门。`IsNetRelevantFor` 定义于 `ActorReplication.cpp`：

```cpp linenums="1"
// ActorReplication.cpp（简化）
bool AActor::IsNetRelevantFor(const AActor* RealViewer, const AActor* ViewTarget,
                              const FVector& SrcLocation) const
{
    if (bAlwaysRelevant || IsOwnedBy(ViewTarget) || IsOwnedBy(RealViewer))
    {
        return true;
    }
    if (bNetUseOwnerRelevancy && Owner) { return Owner->IsNetRelevantFor(...); }
    if (bOnlyRelevantToOwner) { return false; }
    if (NetCullDistanceSquared > 0.0)
    {
        return (GetActorLocation() - SrcLocation).SizeSquared() < NetCullDistanceSquared;
    }
    return false;
}
```

带宽相关的三个关键变量（`Actor.h`）：

| 变量 | 作用 |
| --- | --- |
| `NetUpdateFrequency` | 每秒最多同步次数 |
| `NetPriority` | 带宽分配的优先级权重 |
| `NetCullDistanceSquared` | 超出该距离平方则不再相关 |

```cpp linenums="1"
// 构造函数中
NetUpdateFrequency = 30.0f;   // 每秒最多 30 次
NetPriority = 1.0f;           // 优先级权重
bReplicates = true;           // 参与复制
```

## 11 客户端预测与插值

本地玩家（`ROLE_AutonomousProxy`）的操作不能等服务器回包，否则会有明显延迟。`UCharacterMovementComponent` 做了 **客户端预测**：

```text linenums="1"
客户端：输入 → 本地预测移动 → 发送 ServerMove
    │
    ▼
服务器：校验并执行移动 → 回传 ClientAckGoodMove / ClientAdjustPosition
    │
    ▼
客户端：与服务器位置不一致时平滑纠正
```

- 客户端立即执行移动（预测），并缓存输入序列
- 服务器用同一套移动逻辑计算，回传确认或纠正
- 不一致时客户端做 **调和（Reconciliation）**，平滑拉回正确位置

对于其他玩家（`ROLE_SimulatedProxy`），则用 **插值** 在两次同步的旧位置与新位置之间平滑过渡，避免瞬移

!!! tip "预测与插值的目的"

    预测让本地玩家操作即时响应，插值让远端对象运动平滑。两者共同在"延迟存在"的前提下营造流畅手感，这也是状态同步方案能掩盖延迟的原因

## 12 收发协议：Flush 与 Dispatch

**传输层收发流程**，先看清它们在网络栈中的位置：

```text linenums="1"
游戏逻辑（属性复制 / RPC）
    │  FOutBunch / FInBunch（数据单元）
    ▼
UChannel / UActorChannel（通道，负责可靠性与分发）
    │
    ▼
UNetConnection（一条连接）
    ├── FlushNet()                     ← 发送：打包 + 发出
    └── ReceivedPacket() → Dispatch    ← 接收：解析 + 分发
    │
    ▼
Socket（LowLevelSend / 底层收发）
```

### 12.1 Flush：发送方向

`UNetConnection::FlushNet` 负责把本帧累积的待发送 Bunch 变成真正的网络包并发出，做了五件事：

1. 遍历 `Out` 列表（本帧累积的待发送 Bunch）
2. 处理 **可靠性**：需要可靠的 Bunch 记入通道的 `OutRec`，在收到 ACK 前一直保留以便重传
3. 把 Bunch 序列化进包缓冲（`FBitWriter`），受 MTU 限制时拆分或合并
4. 写入 **包头**（PacketId、ACK 信息、时间戳等）
5. 调用 `LowLevelSend()` 交给 Socket 真正发出，并清理已发送的 Bunch

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/NetConnection.cpp（简化）
void UNetConnection::FlushNet(bool bIgnoreSimulation)
{
    // 1. 创建包缓冲
    FBitWriter PacketBuilder(GetMaxPacketSize());

    // 2. 遍历待发送的 Bunch
    for (int32 i = 0; i < Out.Num(); ++i)
    {
        FOutBunch* Bunch = Out[i];

        // 可靠 Bunch 存入通道的 OutRec，等待 ACK
        if (Bunch->bReliable) { /* 记录到可靠缓冲 */ }

        // 序列化进包（写通道索引、序号、标志位）
        // 超出 MTU 则拆到下一个包
    }

    // 3. 写包头（PacketId、ACK、时间等）
    // 4. 真正发出
    LowLevelSend(PacketBuilder.GetData(), PacketBuilder.GetNumBits());
}
```

关键点：

- **打包（packetization）**：把多个小 Bunch 合并进一个包，减少包头开销，受 MTU 限制
- **可靠性由通道维护**：`OutRec` 保存未确认的可靠 Bunch，收到 ACK 后清除
- **ACK 随包携带**：接收方在包头里回复已收到的包序号，发送方据此清理可靠缓冲

### 12.2 Dispatch：接收方向

Dispatch 指收到包后，把包里的数据 **分发** 到对应的通道与对象。链路为：

```text linenums="1"
UNetConnection::Tick()
└── 读取 Socket 数据
    └── UNetConnection::ReceivedPacket(FBitReader& Reader)   // 解析包
        ├── 读包头（PacketId、ACK 等）
        └── 逐个 Bunch：
            ├── 读出通道索引 ChIndex
            ├── 找到对应的 UChannel（Control / Actor / Voice ...）
            └── UChannel::ReceivedNextBunch()                // 分发到通道
                ├── 可靠且乱序 → 暂存 InRec，等前面补齐
                └── 可靠且按序 → UChannel::ReceivedBunch()
                    └── UActorChannel::ReceivedBunch()       // 应用到对象
                        └── FRepLayout::ReceiveProperties()  // 属性写入内存
```

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/NetConnection.cpp（简化）
void UNetConnection::ReceivedPacket(FBitReader& Reader)
{
    // 1. 读包头
    // 2. 循环解析包内的每个 Bunch
    while (/* 还有 Bunch */)
    {
        FInBunch Bunch(this);

        // 3. 按通道索引分发到对应通道
        UChannel* Channel = Channels[Bunch.ChIndex];
        Channel->ReceivedNextBunch(Bunch, bSkipAck);
    }
}
```

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Private/Channel.cpp（简化）
void UChannel::ReceivedNextBunch(FInBunch& Bunch, bool& bOutSkipAck)
{
    if (Bunch.bReliable && Bunch.ChSequence != InReliable + 1)
    {
        // 乱序：暂存到 InRec，等前面到齐再按序处理
        InRec.Add(Bunch);
        return;
    }

    // 按序：直接交给派生通道处理
    ReceivedBunch(Bunch);
}
```

关键点：

- **分发依据通道索引**：包头里的 `ChIndex` 决定这条 Bunch 属于哪个通道
- **通道类型**：`CHTYPE_Control`（控制）、`CHTYPE_Actor`（Actor 复制）、`CHTYPE_Voice`（语音）
- **可靠性的按序处理**：乱序到达的可靠 Bunch 先缓存，补齐后再按序交付，保证上层看到的顺序一致
- **RPC 与属性共用通道**：`UActorChannel` 的 Bunch 既可能是属性复制，也可能是 RPC，接收端按 Bunch 内的标志区分后分派

### 12.3 一句话对比

| 方向 | 关键函数 | 核心动作 |
| --- | --- | --- |
| 发送 | `UNetConnection::FlushNet` | 打包（packetization）+ 可靠缓冲 + `LowLevelSend` |
| 接收 | `UNetConnection::ReceivedPacket` → `UChannel::ReceivedNextBunch` | 解析包 + 按通道分发 + 按序处理 |

!!! tip "小结"

    把 flush 概括为 **把上层累积的 Bunch 打包成网络包并发出去**（含可靠性缓冲与 ACK 处理），把 dispatch 概括为 **把收到的包解析后按通道分发给对应的处理者**（含乱序缓存与按序交付）。两者一个负责出口、一个负责入口，中间由通道的可靠性与 ACK 机制保证顺序与不丢失

## 13 UE5 网络同步的完整流程

把前面各节的机制串起来，一次完整的属性同步全过程如下：

```text linenums="1"
【服务器端 · 每帧】
UNetDriver::TickFlush()
└── UNetDriver::ServerReplicateActors()
    ├── 收集 ConsiderList（本帧需要检查的 Actor 列表）
    ├── 对每条 UNetConnection：
    │   ├── 取 ViewTarget（该玩家观察的 Actor）
    │   ├── 对每个 Actor 做相关性过滤
    │   │   └── AActor::IsNetRelevantFor()
    │   ├── 按 NetPriority / NetUpdateFrequency 排序与限流
    │   └── UNetConnection::FindOrCreateChannelForActor(Actor)
    │       └── UActorChannel::ReplicateActor()
    │           ├── AActor::PreReplication()        // 复制前钩子
    │           ├── AActor::ReplicateSubobjects()   // 复制子对象
    │           └── FObjectReplicator::ReplicateProperties()
    │               └── FRepLayout::ReplicateProperties()
    │                   ├── 与影子状态比对，把变化的属性写入 FOutBunch
    │                   └── 更新影子状态
    └── UNetConnection::FlushNet()                  // 打包并发出
        ├── 遍历 Out 列表（本帧累积的 FOutBunch）
        ├── 可靠 Bunch 记入通道的 OutRec（等 ACK 才清除）
        ├── 序列化进包缓冲（FBitWriter），按 MTU 拆分/合并
        ├── 写入包头（PacketId、ACK 信息、时间戳）
        └── LowLevelSend() → Socket

【网络传输】
可靠通道：带 ACK 与重传；不可靠通道：丢失不重发

【客户端 · 收到数据】
UNetConnection::Tick()                              // 每帧处理入站数据
└── 从 Socket 读取原始字节
    └── UNetConnection::ReceivedPacket(FBitReader& Reader)   // 解析包
        ├── 读包头，处理对端 ACK
        │   └── UChannel::ReceivedAcks()            // 清理已确认的 OutRec
        └── 逐个 Bunch：
            ├── 读 ChIndex，找到对应 UChannel
            └── UChannel::ReceivedNextBunch()                // 分发到通道
                ├── 可靠且乱序 → 暂存 InRec，等前面补齐
                ├── 可靠且按序 → 推进 InReliable，并处理缓冲中的后续 Bunch
                └── 交付 UChannel::ReceivedBunch()
                    └── UActorChannel::ReceivedBunch()
                        └── FObjectReplicator::ReceivedBunch()
                            ├── FRepLayout::ReceiveProperties()  // 把新值写入对象内存
                            └── FRepLayout::CallRepNotifies()    // 触发 OnRep_Xxx

【客户端 · 表现层】
预测（本地玩家）：ServerMove → ClientAckGoodMove / ClientAdjustPosition → 调和
插值（远端玩家）：在两次同步位置之间平滑过渡
```

其中 `FlushNet` 是发送的最后一环：它把本帧累积的所有 `FOutBunch` **打包** 进网络包，可靠 Bunch 会保留在通道的 `OutRec` 里直到收到 ACK，最后通过 `LowLevelSend` 交给 Socket 发出

客户端收到数据的入口是 `UNetConnection::Tick`，它从 Socket 读取原始字节后，由 `ReceivedPacket` 解析包结构并处理对端 ACK，再按 `ChIndex` 把每个 Bunch **分发** 到对应通道。可靠 Bunch 若乱序会先暂存 `InRec`，等前面的序号补齐后按序交付，最终由 `ReceivedBunch` 应用到对象并触发 `OnRep`

关键函数一览：

| 阶段 | 关键函数 | 作用 |
| --- | --- | --- |
| 驱动 | `UNetDriver::TickFlush` | 每帧网络 tick |
| 筛选 | `UNetDriver::ServerReplicateActors` | 遍历连接与 Actor |
| 判定 | `AActor::IsNetRelevantFor` | 判断是否同步给该玩家 |
| 通道 | `UNetConnection::FindOrCreateChannelForActor` | 找到或创建 Actor 通道 |
| 复制 | `UActorChannel::ReplicateActor` | 复制属性与子对象 |
| 比对 | `FRepLayout::ReplicateProperties` | 与影子状态比对，只发变化 |
| 打包 | `UNetConnection::FlushNet` | 打包 Bunch、维护可靠缓冲、写包头 |
| 发送 | `UNetConnection::LowLevelSend` | 把包交给 Socket 真正发出 |
| 收包 | `UNetConnection::Tick` | 每帧从 Socket 读取入站数据 |
| 解析 | `UNetConnection::ReceivedPacket` | 解析包、处理 ACK、按通道分发 |
| 分发 | `UChannel::ReceivedNextBunch` | 可靠性与按序处理，交付通道 |
| 确认 | `UChannel::ReceivedAcks` | 清理已确认的可靠缓冲 |
| 接收 | `UActorChannel::ReceivedBunch` | 解析 Actor 的 Bunch |
| 应用 | `FRepLayout::ReceiveProperties` | 把新值写入对象内存 |
| 通知 | `FRepLayout::CallRepNotifies` | 触发 `OnRep_Xxx` |

!!! tip "一句话总结"

    服务器每帧 `ServerReplicateActors` 挑选相关 Actor，经 `UActorChannel` 上的 `FObjectReplicator` 增量比对属性、写入 `FOutBunch`，再由 `FlushNet` 打包发出；客户端 `Tick` 收到数据后由 `ReceivedPacket` 按通道分发，`ReceivedBunch` 应用属性、`CallRepNotifies` 触发回调，最后用预测与插值把结果平滑呈现

## 14 常见陷阱与最佳实践

- **不要** 在客户端直接修改游戏状态，一切以服务器裁决为准
- 服务器 RPC 参数 **必须** 校验（`WithValidation`），客户端输入不可信
- 复制属性用 `DOREPLIFETIME` 注册，缺了就不会同步
- 表现类效果用 `Unreliable` RPC，重要逻辑用 `Reliable`
- 频繁变化的位置交给 `Character Movement Component` 的预测与插值，不要自己每帧同步
- 只在服务器调用 `NetMulticast`，客户端调用会失败
- 大量属性、低变化频率的对象考虑推送模型（Push Model）减少比对开销
- 合理设置 `NetCullDistanceSquared` 与 `bOnlyRelevantToOwner` 控制带宽
