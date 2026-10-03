# 动画系统

UE5 的动画系统是一套从 **资源** 到 **运行时求值** 的完整管线：骨骼资源（`USkeleton`）定义骨架，`USkeletalMesh` 引用骨架与蒙皮数据，`UAnimSequence` 存储关键帧，`UAnimInstance` 与动画蓝图在运行时把多个动画源混合成最终姿势，最后由 `USkeletalMeshComponent` 驱动蒙皮渲染

## 1 动画系统概览

核心组成：

| 层次 | 类型 | 职责 |
| --- | --- | --- |
| 骨骼 | `USkeleton` | 定义骨骼层级与命名，是动画的共享契约 |
| 网格 | `USkeletalMesh` | 蒙皮网格，引用 `USkeleton` |
| 动画数据 | `UAnimSequence` / `UAnimMontage` / `UBlendSpace` | 关键帧、蒙太奇、混合空间 |
| 运行时 | `UAnimInstance` / `FAnimInstanceProxy` | 每帧求值动画图 |
| 求值框架 | `FAnimNode_Base` | 动画图的节点 |
| 组件 | `USkeletalMeshComponent` | 驱动求值并更新骨骼矩阵 |

## 2 核心资产体系

### 2.1 USkeleton

`USkeleton` 定义骨骼层级（名称 + 父子关系 + 参考姿势），本身不含几何数据，是所有动画资源的共享契约。动画序列只存"骨骼名 → 关键帧"，运行时再映射到具体网格

### 2.2 USkeletalMesh

`USkeletalMesh` 是蒙皮网格，引用一个 `USkeleton`，保存顶点、蒙皮权重与材质。同一个骨架可以被多个网格复用

### 2.3 动画资产

| 资产 | 类型 | 用途 |
| --- | --- | --- |
| 动画序列 | `UAnimSequence` | 单条关键帧动画 |
| 蒙太奇 | `UAnimMontage` | 可分段的组合动画（攻击、受击） |
| 混合空间 | `UBlendSpace` / `UBlendSpace1D` | 按参数插值多条动画（站立→走→跑） |
| 叠加空间 | `UAimOffsetBlendSpace` | 叠加型瞄准偏移 |
| 复合动画 | `UAnimComposite` | 按时间串联多条序列 |

## 3 AnimInstance：运行时宿主

`UAnimInstance` 是动画的运行时宿主，定义于 `Engine/Source/Runtime/Engine/Classes/Animation/AnimInstance.h`。它依附于 `USkeletalMeshComponent`（注意 `Within` 限定符）：

```cpp
// AnimInstance.h（简化）
UCLASS(transient, Blueprintable, BlueprintType, Within = SkeletalMeshComponent)
class ENGINE_API UAnimInstance : public UObject
{
    GENERATED_BODY()

public:
    // 每帧调用，C++ 侧更新逻辑（读输入、算参数）
    virtual void NativeUpdateAnimation(float DeltaSeconds) {}

    // 生命周期回调
    virtual void NativeInitializeAnimation() {}
    virtual void NativeBeginPlay() {}

    // 蓝图可重写的事件
    UFUNCTION(BlueprintImplementableEvent, meta = (DisplayName = "Blueprint Update Animation"))
    void BlueprintUpdateAnimation(float DeltaTimeX);

    // 蒙太奇接口
    UFUNCTION(BlueprintCallable, Category = "Animation|Montage")
    float Montage_Play(UAnimMontage* MontageToPlay, float InPlayRate = 1.0f, ...);

    UFUNCTION(BlueprintCallable, Category = "Animation|Montage")
    void Montage_Stop(float InBlendOutTime, const UAnimMontage* Montage = nullptr);
};
```

!!! question "NativeUpdateAnimation 和 BlueprintUpdateAnimation 的关系"

    切到动画蓝图后，`UAnimInstance` 会被替换成 `UAnimBlueprintGeneratedClass` 的实例。引擎每帧调用 `NativeUpdateAnimation`（C++ 侧），蓝图侧的 `BlueprintUpdateAnimation`（事件图 Update Animation）也会被调用，两者职责相同、只是语言不同，通常只用其一

## 4 动画蓝图与 AnimGraph

动画蓝图编译后会生成一个 `UAnimBlueprintGeneratedClass`，其中的动画图（AnimGraph）被编译成一棵 **`FAnimNode_Base` 结构体树**，节点以 `FStructProperty` 的形式存放在生成类里

```text linenums="1"
动画蓝图
├── 事件图（Event Graph）       // NativeUpdateAnimation 的逻辑，算参数
└── 动画图（AnimGraph）         // 节点树：状态机 / 混合 / 序列播放器
    └── 编译为 UAnimBlueprintGeneratedClass 中的 FAnimNode_* 树
```

## 5 FAnimNode 与 FAnimInstanceProxy：求值核心

### 5.1 FAnimNode_Base

所有动画节点继承 `FAnimNode_Base`，定义于 `Engine/Source/Runtime/Engine/Public/Animation/AnimNodeBase.h`。它有四个生命周期函数：

```cpp
// AnimNodeBase.h（简化）
struct ENGINE_API FAnimNode_Base
{
    // 1. 初始化（只调用一次）
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context);

    // 2. 缓存骨骼索引（LOD 变化时调用）
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context);

    // 3. 更新：算权重、推进播放时间、决定状态
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context);

    // 4. 求值：算出最终姿势
    virtual void Evaluate_AnyThread(FPoseContext& Output);
};
```

!!! tip "Update 与 Evaluate 分离的意义"

    这是 UE 动画最重要的设计之一。`Update` 负责"逻辑"（时间、权重、状态机切换），频率可以很低；`Evaluate` 负责"采样混合出姿势"，开销大。分离后可以对远处角色只做 Update、跳过 Evaluate，或用 Update Rate Optimization（URO）降低更新频率，大幅节省 CPU

### 5.2 FAnimInstanceProxy

为支持多线程求值，`UAnimInstance` 被拆成两部分：

| 部分 | 线程 | 职责 |
| --- | --- | --- |
| `UAnimInstance` | 游戏线程 | 蓝图逻辑、参数计算 |
| `FAnimInstanceProxy` | 工作线程 | 保存动画节点树并执行求值 |

```cpp
// Engine/Source/Runtime/Engine/Public/Animation/AnimInstanceProxy.h（简化）
struct ENGINE_API FAnimInstanceProxy
{
    virtual void Initialize(UAnimInstance* InAnimInstance);
    virtual void UpdateAnimation(float DeltaSeconds);        // 更新节点树
    virtual void EvaluateAnimation(FPoseContext& Output);    // 求值出姿势

    FAnimNode_Base* GetRootNode();                           // 根节点
    USkeletalMeshComponent* GetSkelMeshComponent() const;
};
```

## 6 姿势系统：FCompactPose 与 BoneContainer

求值的产物是 **`FCompactPose`**（局部空间骨骼变换数组），定义于 `Engine/Source/Runtime/Engine/Public/BonePose.h`：

```cpp
// BonePose.h（简化）
struct FCompactPose
{
    TArray<FTransform> Bones;   // 每个骨骼的局部变换（紧凑索引）

    void ResetToRefPose();      // 重置为参考姿势
    void NormalizeRotations();  // 归一化旋转，防止累积误差
};
```

求值上下文 `FPoseContext` 把姿势与曲线打包在一起：

```cpp
// AnimInstanceProxy.h（简化）
struct FPoseContext : public FAnimationBaseContext
{
    FCompactPose Pose;      // 局部空间姿势
    FBlendedCurve Curves;   // 动画曲线

    void ResetToRefPose();
};
```

**紧凑索引（Compact Index）** 由 `FBoneContainer` 维护：动画只需处理当前 LOD 下真正用到的骨骼，`FBoneContainer` 负责在"骨骼资产索引"与"紧凑索引"之间做映射，避免遍历整棵骨架

## 7 求值流程

一帧动画求值的完整链路：

```text linenums="1"
USkeletalMeshComponent::TickPose(DeltaTime, bNeedsValidRootMotion)
└── USkeletalMeshComponent::TickAnimation()
    └── UAnimInstance::UpdateAnimation(DeltaSeconds, ...)
        ├── NativeUpdateAnimation()          // C++ 逻辑
        ├── BlueprintUpdateAnimation()       // 蓝图事件图
        └── FAnimInstanceProxy::UpdateAnimation()
            └── 根节点 Update_AnyThread()    // 递归更新节点树
    └── UAnimInstance::EvaluateAnimation(Output)
        └── FAnimInstanceProxy::EvaluateAnimation()
            └── 根节点 Evaluate_AnyThread(Output)   // 递归求值出 FCompactPose
```

求值完成后：

```text linenums="1"
FCompactPose（局部空间）
└── FAnimationRuntime::ConvertPoseToComponentSpace()   // 转组件空间
    └── USkeletalMeshComponent 更新骨骼矩阵
        └── 蒙皮渲染
```

!!! question "为什么分局部空间与组件空间"

    `FCompactPose` 用 **局部空间**（每个骨骼相对父骨骼）存储，混合与插值都在局部空间做，效率最高；但蒙皮需要 **组件空间**（相对组件原点）的矩阵，所以在渲染前由 `FAnimationRuntime::ConvertPoseToComponentSpace` 一次性转换

## 8 状态机与混合

### 8.1 状态机

状态机节点 `FAnimNode_StateMachine` 负责在多个状态间切换：

- **State**：一个状态，通常引用一条动画
- **Transition**：状态间的转移，含条件与混合时长
- **Blend**：切换时用 `FAlphaBlend` 平滑过渡

### 8.2 混合节点

| 节点 | 作用 |
| --- | --- |
| `FAnimNode_BlendListByBool` | 按布尔切换两个姿势 |
| `FAnimNode_BlendListByEnum` | 按枚举切换多个姿势 |
| `FAnimNode_LayeredBoneBlend` | 按骨骼分层混合（上半身射击 + 下半身跑） |
| `FAnimNode_BlendSpacePlayer` | 播放混合空间 |
| `FAnimNode_ApplyAdditive` | 叠加动画（受击抖动、瞄准偏移） |
| `FAnimNode_Slot` | 播放槽，蒙太奇通过它插入 |

分层混合的原理（`FAnimationRuntime::BlendPosesPerBoneFilter`）是：对每根骨骼，根据"是否在混合骨骼列表内"决定取哪个姿势，从而让上下半身各自播放不同动画

## 9 蒙太奇与动画通知

### 9.1 蒙太奇

`UAnimMontage` 定义于 `Engine/Source/Runtime/Engine/Classes/Animation/AnimMontage.h`，它按 **Slot（槽）** 组织动画，并支持分段播放：

```cpp
// AnimMontage.h（简化）
UCLASS(BlueprintType)
class ENGINE_API UAnimMontage : public UAnimCompositeBase
{
    UPROPERTY(EditAnywhere, Category = "Montage")
    TArray<FSlotAnimationTrack> SlotAnimTracks;   // 按槽组织的动画轨道

    UPROPERTY(EditAnywhere, Category = "Montage")
    float BlendInTime;                            // 淡入时间

    UPROPERTY(EditAnywhere, Category = "Montage")
    float BlendOutTime;                           // 淡出时间
};
```

播放与分段控制：

```cpp
// 播放蒙太奇，返回播放时长
float Duration = AnimInstance->Montage_Play(AttackMontage, 1.0f);

// 跳转到指定段落
AnimInstance->Montage_JumpToSection(TEXT("Combo2"), AttackMontage);

// 停止（带淡出时间）
AnimInstance->Montage_Stop(0.2f, AttackMontage);
```

蒙太奇通过"槽"插入动画图：动画图里的 `FAnimNode_Slot` 指定槽名，蒙太奇播放时其姿势就从这个槽进入混合树

### 9.2 动画通知

`UAnimNotify` 与 `UAnimNotifyState` 定义于 `Engine/Source/Runtime/Engine/Classes/Animation/AnimNotifies/AnimNotify.h`：

```cpp
// AnimNotify.h（简化）
UCLASS(abstract, Blueprintable)
class ENGINE_API UAnimNotify : public UObject
{
    // 瞬时触发（如播放音效、生成特效）
    virtual void Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                        const FAnimNotifyEventReference& EventReference);
};

UCLASS(abstract, Blueprintable)
class ENGINE_API UAnimNotifyState : public UObject
{
    // 区间触发：开始 / 每帧 / 结束
    virtual void NotifyBegin(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                             float TotalDuration, const FAnimNotifyEventReference& EventReference);
    virtual void NotifyTick(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                            float FrameDeltaTime, const FAnimNotifyEventReference& EventReference);
    virtual void NotifyEnd(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                           const FAnimNotifyEventReference& EventReference);
};
```

!!! tip "Notify 与 NotifyState 怎么选"

    瞬时事件（放音效、生成粒子、判定命中）用 `UAnimNotify`；有持续区间的效果（拖尾、无敌帧、持续位移）用 `UAnimNotifyState`，它会在区间内每帧回调

## 10 根运动 Root Motion

根运动让动画驱动角色位移，而不是靠代码移动。开关在动画序列上：

```cpp
// AnimSequence.h（简化）
UPROPERTY(EditAnywhere, Category = "Root Motion")
bool bEnableRootMotion;      // 是否启用根运动

UPROPERTY(EditAnywhere, Category = "Root Motion")
bool bForceRootLock;         // 是否锁定根骨骼
```

流程是"动画提取 → 组件消费 → 应用到角色"：

```text linenums="1"
动画求值 → 提取根骨骼位移（FRootMotionMovementParams）
    │
    ▼
USkeletalMeshComponent::ConsumeRootMotion()   // 取出根运动
    │
    ▼
UCharacterMovementComponent 应用（含网络校正）
```

```cpp
// SkeletalMeshComponent.h（简化）
FRootMotionMovementParams ConsumeRootMotion();   // 取出并清空累积的根运动
bool HasValidRootMotion() const;
```

!!! warning "根运动与网络同步的配合"

    根运动必须在服务器权威下应用：服务器应用真实位移并把结果复制给客户端，客户端做预测与校正。若两端各自提取根运动，容易出现位置不一致

## 11 性能优化

骨骼动画是 CPU 大户，UE 提供了多级优化，其中最重要的两个概念是 LOD 与 URO

### 11.1 LOD 是什么

LOD（Level of Detail，细节层次）指同一个物体准备多份不同精度的版本，按"离相机多远 / 占屏幕多大"切换使用，把算力与显存花在真正看得清的对象上：

```text linenums="1"
LOD0（最近，最精细）→ LOD1 → LOD2 → LOD3（最远，最粗糙）
```

LOD 思想在各系统里的体现：

| 系统 | LOD 的表现 |
| --- | --- |
| 静态网格 | 不同面数的模型 |
| 骨骼网格 | 减少骨骼数量、简化蒙皮、切换材质 |
| 动画 | 降低 Update / Evaluate 频率，甚至跳过求值 |
| 纹理 | Mipmap |
| 材质 | 简化着色 |

骨骼网格 LOD 由 `USkeletalMesh::LODInfo` 描述，切换依据是"预测屏幕尺寸"——引擎算出该网格在当前相机下占屏幕的比例，落在哪个区间就用哪一级 LOD：

```cpp linenums="1"
// Engine/Source/Runtime/Engine/Classes/Engine/SkeletalMesh.h（简化）
UPROPERTY(EditAnywhere, Category = "LOD")
TArray<FSkeletalMeshLODInfo> LODInfo;   // 每一级 LOD 的设置
```

动画的 LOD 由 `FAnimUpdateRateParameters` 描述，定义于 `Engine/Source/Runtime/Engine/Public/Animation/AnimUpdateRateParams.h`：

```cpp linenums="1"
// AnimUpdateRateParams.h（简化）
USTRUCT()
struct FAnimUpdateRateParameters
{
    int32 UpdateRate;               // 每 N 帧 Update 一次（播放时间与权重推进）
    int32 EvaluationRate;           // 每 N 帧 Evaluate 一次（姿势采样）
    bool bSkipEvaluation;           // 完全跳过 Evaluate，复用上一帧姿势
    bool bInterpolateSkippedFrames; // 跳过帧之间插值，避免卡顿
};
```

这正是 **Update 与 Evaluate 分离** 在性能上的直接收益：远处角色可以让 `UpdateRate = 4`（逻辑 1/4 频率推进）、`EvaluationRate = 4`，甚至 `bSkipEvaluation = true`（根本不重算姿势），开销骤降而视觉几乎无差别

!!! tip "URO 与 LOD 的关系"

    URO（Update Rate Optimization）是 **动画层面的 LOD 策略**：它以骨骼网格的 LOD 为基础，为每一级 LOD 配置 `FAnimUpdateRateParameters`，实现"越远更新越少"。所以 URO 不是独立的优化，而是 LOD 思想在动画上的落地

### 11.2 其他优化手段

| 手段 | 说明 |
| --- | --- |
| Update Rate Optimization（URO） | 远处角色降低 `Update` 频率，跳过部分帧 |
| 动画压缩 | `UAnimBoneCompressionSettings` 压缩关键帧 |
| 曲线压缩 | `UAnimCurveCompressionSettings` 压缩曲线 |
| Animation Budget Allocator | 插件，统一调度大量角色的更新预算 |
| Significance Manager | 按"重要性"决定更新频率 |

```cpp
// 组件上开启 URO
SkeletalMeshComponent->bEnableUpdateRateOptimizations = true;
```

## 12 AnimNotifyState 与联机判定

### 12.1 单机为什么没问题

单机只有一个进程，动画求值与游戏逻辑共享同一条时间线：`NotifyBegin` 一触发就开碰撞箱，`NotifyEnd` 就关，判定自然准确

### 12.2 联机下的问题

把"开武器碰撞箱"这种 **游戏判定** 交给 `AnimNotifyState`，在联机环境会踩到几类问题：

| 问题 | 说明 |
| --- | --- |
| 动画是表现，不是同步数据 | 动画求值在各端独立进行，触发时机受帧率、动画 LOD、URO 影响，各端并不一致 |
| 服务器可能不跑动画 | Dedicated Server 无渲染，动画可能被跳过或降频，`AnimNotifyState` 在服务器根本不触发或不准确 |
| 客户端不可信 | `AnimNotifyState` 在客户端执行，客户端可改动画速度、直接调用开碰撞箱，形成作弊 |
| 时序不一致 | 客户端本地判定命中，服务器却算不中（或反之），出现"打了没伤害" |
| 重复触发 | 多播或多端各自开碰撞箱，可能产生重复伤害、重复特效 |
| 依赖动画进度 | 触发点取决于动画播放进度，而进度在服务器与客户端因网络更新频率不同而不一致 |

核心矛盾：**动画是表现层（cosmetic），判定必须由服务器权威决定**，两者不能混为一谈

### 12.3 更好的解决思路

**思路一：判定放服务器，动画只做表现**

- 服务器用 `SweepMultiByChannel` / `OverlapMultiByChannel` 做命中检测（由 `UFUNCTION(Server, Reliable, WithValidation)` 触发或在服务器直接执行）
- 客户端只播表现（特效、音效、拖尾）
- 碰撞箱的开关状态用 `UPROPERTY(ReplicatedUsing = OnRep_HitWindow)` 同步，客户端仅用于表现

**思路二：用逻辑时间轴代替动画进度**

把攻击拆成前摇 / 命中窗 / 后摇，由服务器的时间轴（`FTimerHandle` 或组件）推进，不依赖动画播到哪一帧

```cpp linenums="1"
// 服务器权威：由逻辑时间轴驱动命中窗，而不是 AnimNotifyState
UFUNCTION(Server, Reliable, WithValidation)
void Server_Attack();

void AMyCharacter::Server_Attack_Implementation()
{
    SetHitWindowActive(true);   // 开命中窗
    GetWorldTimerManager().SetTimer(
        TimerHandle, this, &AMyCharacter::CloseHitWindow, HitWindowDuration, false);
}

void AMyCharacter::OnHitWindowTick()
{
    if (!HasAuthority()) { return; }   // 只有服务器做判定

    TArray<FHitResult> Hits;
    GetWorld()->SweepMultiByChannel(Hits, Start, End, FQuat::Identity, ECC_Pawn, Params);
    // 命中后应用伤害，伤害结果再复制给客户端
}
```

**思路三：用 Gameplay Ability System（GAS）**

- 用 `UGameplayAbility` + `UAbilityTask_PlayMontageAndWait` 驱动动画
- 命中用 `WaitGameplayEvent` / GameplayEffect 处理
- `NetExecutionPolicy` 设为 `ServerOnly` 或 `LocalPredicted`，由 GAS 处理预测与回滚
- 这是 UE 官方推荐的技能 / 战斗方案

**思路四：让服务器拥有可用的动画时间轴**

- 蒙太奇在服务器播放后会复制到客户端（`UAnimInstance` 复制 `MontageInstances`，`FAnimMontageInstance` 通过 `SaveNetState` / `ApplyNetState` 同步播放位置），但 **不要** 依赖它的 Notify 做判定
- 若服务器确实需要动画进度（如根运动），确保服务器也 `Montage_Play` 并正常推进

**思路五：客户端预测 + 服务器校验**

- 客户端为手感做本地预测表现（立即开特效），服务器判定为准
- 服务器结果与预测不符时回滚或纠正（如血量回滚）
- 预测只做表现，不产生权威结果

!!! tip "结论一句话"

    `AnimNotifyState` 适合驱动 **表现**（特效、音效、拖尾、相机震动）；一旦涉及 **胜负判定**（命中、伤害、碰撞箱），就必须移到服务器权威的逻辑层，用可复制的状态、逻辑时间轴或 GAS 来驱动，动画只负责"看起来对"

## 13 常见陷阱与最佳实践

- 骨骼资源（`USkeleton`）一旦被大量动画引用，**不要** 随意改骨骼名或层级，会导致引用失效
- `NativeUpdateAnimation` 只做轻量逻辑，重计算提前缓存
- 动画蓝图里避免每帧 `GetAllActorsOfClass` 之类的重操作
- 大量角色用 URO 与 Animation Budget Allocator 控制开销
- 根运动要么全用、要么全不用，混用容易位置错乱
- 蒙太奇分段用 `Montage_JumpToSection`，不要手动改播放位置
- `AnimNotify` 里不要做阻塞操作，它在动画求值路径上被调用
