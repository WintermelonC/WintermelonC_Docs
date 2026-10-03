# GAS

GAS（Gameplay Ability System，游戏能力系统）是 Epic 为 RPG / MOBA / 联机动作类游戏提供的框架，它把 **技能、属性、Buff、冷却、消耗、表现** 抽象成可组合的组件，并内置了完整的 **服务器权威 + 客户端预测** 网络模型。用 UE 官方的话说：如果你的游戏有技能、有属性、有 Buff，就应该考虑 GAS

## 1 GAS 是什么

在没有 GAS 的项目里，技能往往是"一堆 if-else + 计时器 + 手改血量的代码"，一旦要加冷却、要联机预测、要 Buff 叠加，就会失控。GAS 用几个正交的概念把这些需求拆开：

| 概念 | 解决的问题 |
| --- | --- |
| `UGameplayAbility` | 技能本身（施法流程、消耗、冷却） |
| `UGameplayEffect` | 属性怎么变（加血、减速、DOT） |
| `UAttributeSet` | 数据是什么（血量、蓝量、攻击力） |
| `FGameplayTag` | 用标签描述状态（`State.Stunned`） |
| `UGameplayCue` | 表现层（特效、音效） |
| `UAbilityTask` | 异步流程（等动画播完、等按键） |

GAS 由三个插件模块组成：

```text linenums="1"
GameplayAbilities   // 核心：ASC / Ability / Effect / Cue
GameplayTasks       // 异步任务框架（AbilityTask 的基类）
GameplayTags        // 层级标签系统
```

!!! tip "什么时候该用 GAS"

    有技能树、天赋、Buff / Debuff、属性成长、需要联机预测的战斗系统，用 GAS 收益最大。反之，如果只是"跳跃 + 开门"这种简单交互，GAS 反而过重，直接用 C++ 更划算

## 2 核心组件总览

```text linenums="1"
AActor（Character / PlayerState）
└── UAbilitySystemComponent（ASC，能力系统的心智中心）
    ├── SpawnedAttributes        // 持有的 UAttributeSet 列表
    │     └── UAttributeSet      // Health / Mana / Attack ...
    ├── ActivatableAbilities     // 已授予的技能（FGameplayAbilitySpec 数组）
    │     └── UGameplayAbility   // 技能
    └── ActiveGameplayEffects    // 正在生效的效果
          └── UGameplayEffect    // 效果（Buff / Debuff / DOT）
```

| 类 | 定义位置 | 职责 |
| --- | --- | --- |
| `UAbilitySystemComponent` | `Plugins/.../Public/AbilitySystemComponent.h` | 总控：授予技能、激活、应用效果、属性读写 |
| `UAttributeSet` | `Plugins/.../Public/AttributeSet.h` | 属性容器 |
| `UGameplayAbility` | `Plugins/.../Public/Abilities/GameplayAbility.h` | 技能逻辑 |
| `UGameplayEffect` | `Plugins/.../Public/GameplayEffect.h` | 属性修改规则（数据驱动） |
| `UGameplayCueNotify` | `Plugins/.../Public/GameplayCueNotify_Actor.h` | 表现 |
| `FGameplayTag` | `Runtime/GameplayTags/Classes/GameplayTagContainer.h` | 标签 |

## 3 AbilitySystemComponent（ASC）

ASC 是整套系统的入口，它继承自 `UGameplayTasksComponent`，负责挂载属性集、管理技能与效果：

```cpp
// AbilitySystemComponent.h（简化）
UCLASS(ClassGroup = AbilitySystem)
class GAMEPLAYABILITIES_API UAbilitySystemComponent : public UGameplayTasksComponent
{
    GENERATED_UCLASS_BODY()

public:
    // 绑定 OwnerActor 与 AvatarActor（必须在服务器与客户端都调用）
    void InitAbilityActorInfo(AActor* InOwnerActor, AActor* InAvatarActor);

    // 授予 / 移除技能
    FGameplayAbilitySpecHandle GiveAbility(const FGameplayAbilitySpec& AbilitySpec);
    void ClearAbility(FGameplayAbilitySpecHandle Handle);

    // 激活技能
    bool TryActivateAbility(FGameplayAbilitySpecHandle AbilityToActivate, bool bAllowRemoteActivation = true);
    bool TryActivateAbilitiesByTag(const FGameplayTagContainer& GameplayTagContainer, bool bAllowRemoteActivation = true);

    // 应用效果
    FActiveGameplayEffectHandle ApplyGameplayEffectSpecToSelf(const FGameplayEffectSpec& GameplayEffect, ...);
    FActiveGameplayEffectHandle ApplyGameplayEffectSpecToTarget(const FGameplayEffectSpec& GameplayEffect,
                                                                UAbilitySystemComponent* Target, ...);

    // 属性读写
    float GetNumericAttribute(const FGameplayAttribute& Attribute) const;
    void SetNumericAttributeBase(const FGameplayAttribute& Attribute, float NewBaseValue);
};
```

两个关键概念：

- **OwnerActor**：逻辑拥有者（通常是 `PlayerState`），生命周期长
- **AvatarActor**：实际在场景中的身体（通常是 `Character`），重生会换

!!! question "ASC 应该放在 PlayerState 还是 Character 上"

    联机游戏推荐 **放在 PlayerState 上**，因为角色死亡重生时 `Character` 会被销毁重建，而 `PlayerState` 存活，技能、属性、效果都不会丢。单机游戏放 Character 也够用。也可以两边都放（Avatar 上放一个转发用的），但属性只应有一份，避免同步冲突

实现 `IAbilitySystemInterface` 让外部能拿到 ASC：

```cpp
UCLASS()
class AMyPlayerState : public APlayerState, public IAbilitySystemInterface
{
    GENERATED_BODY()

public:
    virtual UAbilitySystemComponent* GetAbilitySystemComponent() const override { return AbilitySystemComponent; }

private:
    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent;
};
```

## 4 GameplayAbility（技能）

`UGameplayAbility` 描述一个技能从"能否施放"到"结束"的完整生命周期：

```cpp
// GameplayAbility.h（简化）
UCLASS(Blueprintable, BlueprintType)
class GAMEPLAYABILITIES_API UGameplayAbility : public UObject
{
    GENERATED_UCLASS_BODY()

public:
    // 1. 能否激活（检查标签、消耗、冷却）
    virtual bool CanActivateAbility(const FGameplayAbilitySpecHandle Handle,
                                    const FGameplayAbilityActorInfo* ActorInfo,
                                    const FGameplayTagContainer* SourceTags = nullptr,
                                    const FGameplayTagContainer* TargetTags = nullptr, ...) const;

    // 2. 激活：技能主逻辑写在这里
    virtual void ActivateAbility(const FGameplayAbilitySpecHandle Handle,
                                 const FGameplayAbilityActorInfo* ActorInfo,
                                 const FGameplayAbilityActivationInfo ActivationInfo,
                                 const FGameplayEventData* TriggerEventData);

    // 3. 提交：真正扣除消耗、进入冷却
    bool CommitAbility(const FGameplayAbilitySpecHandle Handle, const FGameplayAbilityActorInfo* ActorInfo,
                       const FGameplayAbilityActivationInfo ActivationInfo, ...);

    // 4. 结束：必须调用，否则技能会一直处于激活状态
    virtual void EndAbility(const FGameplayAbilitySpecHandle Handle, const FGameplayAbilityActorInfo* ActorInfo,
                            const FGameplayAbilityActivationInfo ActivationInfo,
                            bool bReplicateEndAbility, bool bWasCancelled);
};
```

### 4.1 实例化策略 InstancingPolicy

| 策略 | 含义 | 适用 |
| --- | --- | --- |
| `NonInstanced` | 不实例化，直接用 CDO，无状态 | 无状态技能（省内存） |
| `InstancedPerActor` | 每个 Actor 一个实例，可保存状态 | 大多数技能（默认推荐） |
| `InstancedPerExecution` | 每次执行一个实例 | 需要多次并行执行（连发） |

```cpp
// GameplayAbility.h（简化）
UENUM()
enum class EGameplayAbilityInstancingPolicy : uint8
{
    NonInstanced,
    InstancedPerActor,
    InstancedPerExecution,
};
```

!!! tip "NonInstanced 的代价"

    `NonInstanced` 用的是 CDO，**不能** 保存成员变量、也不能用 `UAbilityTask`（任务需要实例来承载）。只有在纯"执行一次就结束"的技能上才用它

### 4.2 网络执行策略 NetExecutionPolicy

| 策略 | 服务器 | 客户端（拥有者） | 适用 |
| --- | --- | --- | --- |
| `ServerOnly` | 执行 | 不执行 | 纯服务器逻辑（刷怪、结算） |
| `ServerInitiated` | 执行 | 跟随执行（服务器发起） | 服务器触发的表现（如被击飞） |
| `LocalPredicted` | 执行 | **先预测执行** | 玩家主动技能（默认选择） |
| `LocalOnly` | 不执行 | 只本地执行 | 纯表现（不改状态） |

```cpp
UENUM()
enum class EGameplayAbilityNetExecutionPolicy : uint8
{
    LocalOnly,
    LocalPredicted,
    ServerOnly,
    ServerInitiated,
};
```

## 5 GameplayEffect（效果）

`UGameplayEffect` 是 **数据驱动** 的属性修改规则，它不写代码，只描述"改哪个属性、怎么改、持续多久"：

```cpp
// GameplayEffect.h（简化）
UCLASS(Blueprintable, BlueprintType)
class GAMEPLAYABILITIES_API UGameplayEffect : public UObject
{
    GENERATED_UCLASS_BODY()

public:
    // 持续时间：Instant / Infinite / HasDuration
    UPROPERTY(EditDefaultsOnly, Category = "GameplayEffect")
    EGameplayEffectDurationType DurationPolicy;

    UPROPERTY(EditDefaultsOnly, Category = "GameplayEffect")
    FGameplayEffectModifierMagnitude DurationMagnitude;

    // 修改器：改哪个属性、用什么运算、幅度多少
    UPROPERTY(EditDefaultsOnly, Category = "GameplayEffect")
    TArray<FGameplayModifierInfo> Modifiers;

    // 周期（DOT / HOT）
    UPROPERTY(EditDefaultsOnly, Category = "GameplayEffect")
    float Period;

    // 叠加（层数上限与策略）
    UPROPERTY(EditDefaultsOnly, Category = "GameplayEffect")
    FGameplayEffectStacking StackLimitCount;
};
```

### 5.1 持续时间类型

| 类型 | 说明 | 例子 |
| --- | --- | --- |
| `Instant` | 立即结算一次，不保留 | 直接扣血、加经验 |
| `HasDuration` | 持续一段时间后自动移除 | 10 秒加速 |
| `Infinite` | 一直存在直到手动移除 | 装备提供的攻击力 |

### 5.2 修改运算

| 运算 | 含义 |
| --- | --- |
| `Additive` | 加法（CurrentValue += X） |
| `Multiplicitive` | 乘法（引擎中的拼写） |
| `Division` | 除法 |
| `Override` | 直接覆盖 |

### 5.3 属性计算的顺序

多个效果同时作用时，GAS 按固定顺序聚合：

```text linenums="1"
( BaseValue + Σ Additive ) × Π Multiplicitive / Π Division → 再被 Override 覆盖 → CurrentValue
```

所以 **加法先算、乘法后算、Override 最后**，这是设计数值时的基本约束

### 5.4 GameplayEffectExecutionCalculation

当纯 Modifier 不够用时（比如"伤害 = 攻击力 × 技能倍率 × (1 - 护甲减免)"），可以写自定义计算类：

```cpp
// GameplayEffectExecutionCalculation.h（简化）
UCLASS(abstract)
class GAMEPLAYABILITIES_API UGameplayEffectExecutionCalculation : public UObject
{
    virtual void Execute_Implementation(const FGameplayEffectCustomExecutionParameters& ExecutionParams,
                                        FGameplayEffectCustomExecutionOutput& OutExecutionOutput) const;
};
```

## 6 AttributeSet（属性）

`UAttributeSet` 是属性的容器，属性值用 `FGameplayAttributeData` 表示，它同时保存 **BaseValue** 与 **CurrentValue**：

```cpp
// GameplayEffectTypes.h（简化）
USTRUCT(BlueprintType)
struct GAMEPLAYABILITIES_API FGameplayAttributeData
{
    UPROPERTY(BlueprintReadOnly, Category = "Attribute")
    float BaseValue;      // 基础值（只被 Instant 效果改）

    UPROPERTY(BlueprintReadOnly, Category = "Attribute")
    float CurrentValue;   // 当前值（BaseValue 经过所有修正后）
};
```

这个双值设计是 GAS 的关键：**Buff 只改 CurrentValue，不污染 BaseValue**，Buff 一移除，CurrentValue 自动恢复

### 6.1 定义属性

```cpp
UCLASS()
class UMyAttributeSet : public UAttributeSet
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintReadOnly, Category = "Attributes", ReplicatedUsing = OnRep_Health)
    FGameplayAttributeData Health;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, Health)   // 生成 GetHealth / SetHealth 等访问器

    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    UFUNCTION()
    void OnRep_Health(const FGameplayAttributeData& OldHealth);
};
```

```cpp
// AttributeSet.cpp
void UMyAttributeSet::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);

    DOREPLIFETIME_CONDITION_NOTIFY(UMyAttributeSet, Health, COND_None, REPNOTIFY_Always);
}

void UMyAttributeSet::OnRep_Health(const FGameplayAttributeData& OldHealth)
{
    GAMEPLAYATTRIBUTE_REPNOTIFY(UMyAttributeSet, Health, OldHealth);   // 通知 ASC 更新派生值
}
```

### 6.2 三个回调钩子

```cpp
// AttributeSet.h（简化）
UCLASS(DefaultToInstanced, Blueprintable)
class GAMEPLAYABILITIES_API UAttributeSet : public UObject
{
    // 修改 CurrentValue 之前（适合做显示层 clamp）
    virtual void PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue);

    // 修改 BaseValue 之前
    virtual void PreAttributeBaseChange(const FGameplayAttribute& Attribute, float& NewValue) const;

    // GameplayEffect 执行之后（适合结算伤害、触发死亡）
    virtual void PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data);
};
```

!!! warning "clamp 应该写在哪里"

    `PreAttributeChange` 只影响 `CurrentValue`，**不影响 BaseValue**，所以它挡不住"基础血量被扣成负数"。真正可靠的钳制（血量不超过上限、不低于 0、触发死亡）应写在 `PostGameplayEffectExecute` 里，那里能拿到最终结算后的值

## 7 GameplayTags

`FGameplayTag` 是一个 **层级化、层级继承** 的标签，形如 `Ability.Skill.Fire.Fireball`。查询 `Ability.Skill.Fire` 会同时匹配其所有子标签：

```cpp
// GameplayTagContainer.h（简化）
USTRUCT(BlueprintType)
struct GAMEPLAYABILITIES_API FGameplayTagContainer
{
    bool HasTag(const FGameplayTag& TagToCheck) const;
    bool HasAny(const FGameplayTagContainer& ContainerToCheck) const;
    bool HasAll(const FGameplayTagContainer& ContainerToCheck) const;
};
```

在 GAS 中，标签承担了"状态与规则"的表达：

| 用途 | 属性 |
| --- | --- |
| 技能自身标识 | `AbilityTags` |
| 拥有某标签时禁止激活 | `ActivationBlockedTags` |
| 激活时给自身加标签 | `ActivationOwnedTags` |
| 激活时取消其他技能 | `CancelAbilitiesWithTag` |
| 激活时阻塞其他技能 | `BlockAbilitiesWithTag` |

```cpp
// 授予技能时用标签激活
AbilitySystemComponent->TryActivateAbilitiesByTag(FGameplayTagContainer(TAG_Ability_Jump));
```

!!! tip "为什么用标签而不是枚举"

    标签可以 **在编辑器里扩展、支持层级匹配、能跨插件协作**，而枚举是编译期固定的。用 `State.Dead` 这种标签可以让不同模块各自检查"是否死亡"，而不需要互相依赖对方的枚举

## 8 AbilityTask（异步任务）

技能经常需要"等一下再继续"——等动画播完、等按键松开、等 2 秒。`UAbilityTask` 就是 GAS 提供的异步机制，它继承自 `UGameplayTask`：

```cpp
// AbilityTask.h（简化）
UCLASS(Abstract)
class GAMEPLAYABILITIES_API UAbilityTask : public UGameplayTask
{
    GENERATED_BODY()

public:
    virtual void Activate();
    virtual void OnDestroy(bool AbilityEnded);

    void ReadyForActivation();   // 提交任务并开始运行
    void EndTask();

    UPROPERTY()
    TObjectPtr<UGameplayAbility> Ability;
};
```

常用任务：

| 任务 | 作用 |
| --- | --- |
| `UAbilityTask_PlayMontageAndWait` | 播放蒙太奇并等待结束 |
| `UAbilityTask_WaitGameplayEvent` | 等待某个 GameplayEvent |
| `UAbilityTask_WaitDelay` | 等待指定时间 |
| `UAbilityTask_WaitInputPress` | 等待按键按下 |
| `UAbilityTask_WaitTargetData` | 等待目标选择（瞄准） |

```cpp
// 在 ActivateAbility 中使用
UAbilityTask_PlayMontageAndWait* Task =
    UAbilityTask_PlayMontageAndWait::CreatePlayMontageAndWaitProxy(this, NAME_None, AttackMontage);

Task->OnCompleted.AddDynamic(this, &UMyAbility::OnMontageCompleted);
Task->OnInterrupted.AddDynamic(this, &UMyAbility::OnMontageInterrupted);
Task->ReadyForActivation();
```

!!! question "AbilityTask 在网络上是怎么运行的"

    `AbilityTask` 会 **在服务器与客户端各运行一份**，由 ASC 的复制机制保证生命周期一致。任务的网络行为由 `bSimulatedTask` 与 `NetExecutionPolicy` 决定：例如 `LocalPredicted` 的技能，客户端与服务器都会创建任务，各自推进，靠 `FPredictionKey` 对齐

## 9 GameplayCue（表现）

`UGameplayCue` 专门负责 **表现层**：特效、音效、镜头震动、贴花。它的意义是把"看起来怎样"从"实际发生什么"里彻底分离：

```cpp
// GameplayCueInterface.h（简化）
UENUM(BlueprintType)
enum class EGameplayCueEvent : uint8
{
    OnActive,     // 效果被激活
    WhileActive,  // 持续期间每帧
    Executed,     // 瞬时执行
    Removed,      // 效果被移除
};
```

| 类型 | 特点 |
| --- | --- |
| `UGameplayCueNotify_Static` | 无状态，一次性播放（命中特效） |
| `UGameplayCueNotify_Actor` | 有状态的 Actor，可随效果持续存在（Buff 光环） |

触发方式：

- 在 `GameplayEffect` 上配置 `GameplayCues`（推荐，效果与应用表现自动绑定）
- 代码调用 `ASC->ExecuteGameplayCue(Tag, Params)`

!!! warning "GameplayCue 里不要写判定"

    GameplayCue 可能因为网络原因在客户端 **重复执行或丢失**，它只应该是"看起来对"的表现。伤害、命中、状态变更必须由 `GameplayEffect` / `GameplayAbility` 在服务器上决定

## 10 网络同步机制

GAS 的网络模型建立在「客户端-服务器 + 服务器权威」之上，但它额外提供了一层 **预测与回滚** 能力

### 10.1 ASC 复制了什么

```cpp
// AbilitySystemComponent.cpp（简化）
void UAbilitySystemComponent::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);

    DOREPLIFETIME(UAbilitySystemComponent, SpawnedAttributes);      // 属性集
    DOREPLIFETIME(UAbilitySystemComponent, ActiveGameplayEffects);  // 生效中的效果
    DOREPLIFETIME(UAbilitySystemComponent, ActivatableAbilities);   // 已授予的技能
}
```

`ActiveGameplayEffects` 是一个 `FActiveGameplayEffectsContainer`，它实现了 `NetDeltaSerialize`，用 **快速数组序列化** 只同步增删与变化的字段：

```cpp
// GameplayEffect.h（简化）
struct FActiveGameplayEffectsContainer : public FFastArraySerializer
{
    bool NetDeltaSerialize(FNetDeltaSerializeInfo& DeltaParms);
    void PreReplicatedRemove(const TArrayView<int32>& RemovedIndices, int32 FinalSize);
    void PostReplicatedAdd(const TArrayView<int32>& AddedIndices, int32 FinalSize);
};
```

### 10.2 复制模式 ReplicationMode

```cpp
UENUM()
enum class EGameplayEffectReplicationMode : uint8
{
    Minimal,   // 只复制最小信息（单人 / 纯服务器逻辑）
    Mixed,     // 本地控制的角色复制完整效果，其他角色最小（多人推荐）
    Full,      // 全部复制（观战、回放）
};
```

### 10.3 客户端预测：FPredictionKey

预测的核心是 **预测键**：客户端在本地应用一个效果时，会附上一个自己生成的 `FPredictionKey`，服务器处理后返回同键的确认或拒绝：

```cpp
// PredictionKey.h（简化）
USTRUCT()
struct GAMEPLAYABILITIES_API FPredictionKey
{
    UPROPERTY() int16 Current;   // 客户端生成的序号
    UPROPERTY() int16 Base;      // 依赖的父预测键

    UPROPERTY() TObjectPtr<UPackageMap> PredictiveConnection;

    uint8 bIsStale : 1;             // 是否已过期（应回滚）
    uint8 bIsServerInitiated : 1;   // 是否服务器发起
};
```

一次预测施法的时序：

```text linenums="1"
客户端                          服务器
  │  按下技能键
  ├─ 生成本地 PredictionKey
  ├─ 本地预测执行技能（立即播动画、立即扣蓝、立即进冷却）
  ├─ 发送 ServerTryActivateAbility(PredictionKey)
  │                              ├─ 校验（能否激活、消耗够不够）
  │                              ├─ 执行权威逻辑
  │  ◀──── ServerSetReplicatedTargetData / 结果 ────┤
  ├─ 比对预测与权威结果
  │   ├─ 一致 → 确认，丢弃预测键
  │   └─ 不一致 → 回滚预测的修改，应用服务器结果
```

```cpp
// 在技能中开启一个预测窗口：窗口内产生的效果会被记录，便于回滚
FScopedPredictionWindow ScopedPrediction(GetAbilitySystemComponentFromActorInfo(), true);

// 预测性地应用一个效果
FGameplayEffectSpecHandle SpecHandle = MakeOutgoingSpec(HealEffect, 1.0f, MakeEffectContext());
if (SpecHandle.IsValid())
{
    ApplyGameplayEffectSpecToOwner(CurrentSpecHandle, CurrentActorInfo, CurrentActivationInfo, SpecHandle);
}
```

!!! question "为什么可预测的操作不能直接改属性"

    直接 `AttributeSet->SetHealth(50)` 会绕过 ASC 的效果容器，服务器回滚时"无从下手"。所有属性变更都要通过 `GameplayEffect`（或 `ApplyGameplayEffectSpecTo*`），ASC 才能记录、比对与回滚

### 10.4 三种 RPC 在 GAS 中的角色

| RPC | 用途 |
| --- | --- |
| `ServerTryActivateAbility` | 客户端请求激活技能 |
| `ServerSetReplicatedTargetData` | 客户端上报目标选择结果 |
| `ServerEndAbility` | 客户端请求结束技能 |
| `ClientActivateAbilitySucceed` / `Failed` | 服务器回传激活结果 |
| `ClientEndAbility` | 服务器要求客户端结束技能 |

## 11 一次技能的完整生命周期

把前面各节串起来，从按键到生效：

```text linenums="1"
1. 输入
   玩家按键 → ASC->AbilityLocalInputPressed(InputID)
   （或 TryActivateAbility / TryActivateAbilitiesByTag）

2. 激活判定
   UGameplayAbility::CanActivateAbility()
   ├── 检查 ActivationBlockedTags（如正在眩晕）
   ├── 检查冷却是否就绪
   └── 检查消耗是否足够

3. 激活
   UGameplayAbility::ActivateAbility()
   ├── CommitAbility()             // 真正扣消耗、进冷却
   ├── 创建 AbilityTask（播动画 / 等事件）
   └── 通过 GameplayEffect 施加效果
       └── 服务器权威结算属性变化
           └── GameplayCue 播放表现（客户端）

4. 结束
   EndAbility()                     // 必须显式调用
   └── ASC 清理该技能的激活状态与任务
```

## 12 常见陷阱与最佳实践

- 忘记调用 `InitAbilityActorInfo`，或在 `AvatarActor` 变化（重生）后没有重新调用，会导致技能找不到身体而失效
- 联机时把 ASC 放 `Character` 上，重生后技能与属性全部丢失，应放 `PlayerState`
- 直接改属性（`SetHealth`）而不是走 `GameplayEffect`，会让复制、预测、回滚、监听全部失效
- 钳制逻辑写在 `PreAttributeChange` 里挡不住 BaseValue，应写在 `PostGameplayEffectExecute`
- 技能结束时忘记 `EndAbility`，技能会卡在激活态，后续无法再次施放
- 忘记 `CommitAbility`，冷却与消耗不会生效
- `NonInstanced` 技能里用 `UAbilityTask` 会报错，任务需要实例承载
- `GameplayCue` 可能重复或丢失，绝不能在其中做判定
- 属性集必须 `Replicated` 且用 `DOREPLIFETIME_CONDITION_NOTIFY` + `GAMEPLAYATTRIBUTE_REPNOTIFY`，否则客户端派生值不更新
- `GameplayTag` 命名要成体系（`Ability.*` / `State.*` / `Effect.*`），否则后期难以维护
