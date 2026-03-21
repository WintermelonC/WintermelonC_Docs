# 2 虚幻中的 C++

## 1 如何创建一个 C++ 类和删除一个 C++ 类

创建一个 C++ 类：

1. 基于 C++ 角色类来创建一个蓝图 BP_PlayerCharacter
2. 创建基于 GameMode 的蓝图 BP_PlayerGameMode
3. 将 BP_PlayerGameMode 设置为游戏的 GameMode
4. 将 BP_PlayerGameMode 的 Default Pawn Class 赋值为 BP_PlayerCharacter

删除一个 C++ 类：

1. 在 VS2022 中项目中删除类的头文件和源文件
2. 进入文件夹中删除头文件和源文件
3. 删除项目目录中的 Binary 和 lntermediate 文件夹
4. 右键项目名 .uproject 文件，选择 Generate Visual Studio project files

## 2 UPROPERTY 和 UFUNCTION C++ 与蓝图的交互

UPROPERTY 是 Unreal Engine 中用于声明属性的宏，它用于标记某个属性是一个 Unreal Engine 托管的属性，并且可以在编辑器中进行访问和操作。UPROPERTY 宏提供了一系列参数，用于定义属性的属性和行为，例如是否可编辑、是否可序列化等

1. EditAnywhere：允许在编辑器中编辑该属性
2. EditDefaultsOnly：实例就不能修改了
3. BlueprintReadWrite：允许在蓝图 (EventGraph) 中读写该属性
4. VisibleAnywhere**：在编辑器中显示该属性，但不允许编辑
5. Transient：该属性不会被序列化保存，通常用于临时数据或不希望被保存的数据
6. Category：指定在编辑器中显示的该属性所属的分类
7. Meta：可以用来设置一些元数据，如文档、关键字等，meta=(AllowPrivateAccess="true") 允许私有属性在编辑器中进行编辑
8. Replicated：属性在网络中进行复制

UFUNCTION 是 Unreal Engine 中用于声明函数的宏，它用于标记某个函数是一个 Unreal Engine 托管的函数，并且可以在编辑器中进行访问和操作。UFUNCTION 宏提供了一系列参数，用于定义函数的属性和行为，例如是否是蓝图可调用的、 是否可在网络中复制等

1. BlueprintCallable：允许在蓝图中调用该函数
2. BlueprintPure：声明该函数为纯函数，即不会修改对象的状态
3. BlueprintImplementableEvent：声明该函数为蓝图可实现的事件，在蓝图中可以实现该事件的具体逻辑
4. Category：指定在编辑器中显示的该函数所属的分类
5. Meta：可以用来设置一些元数据，如文档、关键字等
6. Server**、Client、Reliable：用于网络功能，指定该函数在服务器端、客户端执行，以及指定该函数是否可靠传输

## 3 引入头文件和不完全声明

在 Unreal Engine 开发中，通常建议在源文件 (.cpp 文件) 中包含头文件，而不是在头文件 (.h 文件) 中。这种做法有几个重要原因：

1. 减少编译时间
2. 避免循环依赖
3. 增强可维护型

USpringArmComponent 是 Unreal Engine 中的一种组件，常用于实现摄像机的平滑跟随和碰撞处理。它通过一个虚拟的弹簧臂连接摄像机到一个父物体，并自动处理摄像机与环境的碰撞检测和调整，以保持摄像机不穿过其他物体

UCameraComponent 是 Unreal Engine 中用于实现摄像机视角的组件。它提供了一系列功能，使开发者能够在游戏中设置和控制摄像机的视角和行为。UCameraComponent 通常与其他组件 (如 USpringArmComponent) 配合使用，以实现更复杂的摄像机系统

## 4 虚幻打印的两种方式

UE_LOG 宏是 Unreal Engine 中用于日志记录的标准方式。它可以输出日志信息到控制台和日志文件，支持多种日志级别 (如 Log，Warning，Error)

`UE_LOG(LogCategory, LogVerbosity, Format, ...)`

GEngine->AddOnScreenDebugMessage 可以在游戏屏幕上显示调试信息，通常用于快速查看和调试

`GEngine->AddOnScreenDebugMessage(Key, TimeToDisplay, Color, Message)`