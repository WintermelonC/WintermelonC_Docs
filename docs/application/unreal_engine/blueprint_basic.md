# 蓝图基础

构造脚本相当于构造函数，事件图表是触发器 + 函数的组合，左下角可以添加变量

<figure markdown="span">
  ![Img 1](../../img/unreal_engine/bp/ue_bp_img1.png){ width="800" }
  <figcaption markdown>事件开始时，打印字符串 `StringTest`</figcaption>
</figure>

框选蓝图节点，按 ++c++ 可以添加注释

## 1 实现玩家移动功能

将默认控制的角色设置为自己的：

1. 创建自己的 BP_Character 和 BP_GameMode
2. 修改 BP_GameMode 的默认 Pawn 类为 BP_Character
3. 修改世界场景设置和项目设置中的默认游戏模式为 BP_GameMode

创建输入操作 IA_MyMove，修改值类型为 Vector2D

创建输入映射情景 IMC_Input，设置 WASD 按键映射

<figure markdown="span">
  ![Img 2](../../img/unreal_engine/bp/ue_bp_img2.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 3](../../img/unreal_engine/bp/ue_bp_img3.png){ width="600" }
</figure>

将 IMC_Input 绑定到 BP_Character 上，让 IMC_Input 控制 BP_Character

<figure markdown="span">
  ![Img 4](../../img/unreal_engine/bp/ue_bp_img4.png){ width="600" }
</figure>

在 BP_Character 中添加移动输入，实现玩家移动功能

<figure markdown="span">
  ![Img 5](../../img/unreal_engine/bp/ue_bp_img5.png){ width="600" }
</figure>

## 2 实现玩家视角移动功能

创建输入操作 IA_MyLook，修改值类型为 Vector2D

在 IMC_Input 中增加 IA_MyLook，设置鼠标的映射

<figure markdown="span">
  ![Img 6](../../img/unreal_engine/bp/ue_bp_img6.png){ width="600" }
</figure>

在 BP_Character 中添加 yaw 和 pitch 输入，实现玩家视角移动功能

<figure markdown="span">
  ![Img 7](../../img/unreal_engine/bp/ue_bp_img7.png){ width="600" }
</figure>

!!! tip "pitch, roll, yaw"

    1. 俯仰（Pitch）：控制沿水平（X）轴的旋转。更改此值会使对象向上或向下旋转，类似于点头
    2. 偏转（Yaw）：控制沿垂直（Y）轴的旋转。更改此值会使对象向左或向右旋转，类似于向左或向右转
    3. 滚动（Roll）：控制沿纵向（Z）轴的旋转。更改此值会使对象左右滚动，类似于将头向左或向右倾斜

    <figure markdown="span">
      ![Img 8](../../img/unreal_engine/bp/ue_bp_img8.png){ width="600" }
    </figure>

## 3 实现自动门功能

在 Fab 中添加 Wooden Door（@kellett66）到项目中

打开门框的网络体，修改视图模式为玩家碰撞，会发现门框中间的部分是实心的。点击碰撞 → 移除碰撞，会发现整个门框都变成了空的。点击碰撞 → 自动凹凸碰撞，ue 会自动帮我们生成碰撞范围

门和玩家是有交互的，不能单纯的拖到场景当中。

1. 创建一个 Actor 蓝图类 BP_Door
2. 组件中添加两个静态网络体组件 Door 和 DoorFrame（两者同级），并在右侧指定对应的模型，调整两者的位置
3. 添加一个 Box Collision，调整盒体范围和位置使其覆盖门，在事件中添加组件开始重叠时、组件结束重叠时触发器

在事件图表中添加“添加时间轴...”组件，打开后添加浮点型轨道，创建关键帧

<figure markdown="span">
  ![Img 9](../../img/unreal_engine/bp/ue_bp_img9.png){ width="600" }
</figure>

在事件图表中调整蓝图

<figure markdown="span">
  ![Img 10](../../img/unreal_engine/bp/ue_bp_img10.png){ width="600" }
</figure>