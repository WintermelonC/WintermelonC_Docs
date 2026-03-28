# 5 虚幻与面向对象

## 1 虚幻面向对象概述

单继承：虚幻引擎采用单继承模型，即一个类只能继承自一个父类

接口 (Interfaces)：虚幻引擎支持接口（通过 UInterface, 由虚幻自己实现），允许类实现多个接口，从而实现多重继承的效果

## 2 虚幻中的组合和继承

## 3 AActor, APawn and ACharacter

UObject：基础类 UObject 是所有非 Actor 类的基类，几乎所有的 Unreal Engine 对象都继承自 UObject

AActor：AActor 继承自 UObject，并且是所有场景中对象（例如，角色、道具、灯光等）的基类

APawn：如果你需要一个可以被玩家或 AI 控制的对象，但不需要复杂的运动和动画系统

1. 可控制性：APawn 可以通过玩家输入或AI控制器来操纵
2. 控制器：APawn 通常与 AController 或 APlayerController 关联，以实现移动和交互
3. 不包含骨骼网格和动画：与 ACharacter 不同，APawn 不包含骨骼网格和动画系统

ACharacter 是一种特殊类型的 APawn，它包含用于行走、跳跃、游泳等的运动功能。它是带有骨骼网格和动画系统的高级角色类

1. 骨骼网格和动画：ACharacter 包含 USkeletalMeshComponent 和动画蓝图，用于角色的外观和动画
2. 角色运动：包含 UCharacterMovementComponent, 支持复杂的角色运动（如行走、跑步、跳跃、游泳等）
3. 碰撞和胶囊体：默认包含一个胶囊碰撞体，用于角色的碰撞检测