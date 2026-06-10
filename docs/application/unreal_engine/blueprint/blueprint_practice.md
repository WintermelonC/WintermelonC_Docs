# 蓝图实战

## 1 创建项目并导入素材

创建一个空白项目，在项目根目录的 content 文件夹下导入素材

## 2 实现基础操作及动画

创建 IA_Look，IA_Move，IMC_Challenge。添加 WSAD 和鼠标映射

创建 BP_ChallengeMode，BP_ChallengeCharacter。BP_ChallengeCharacter 的网络体选择 SK_Adventure

打开 BP_ChallengeCharacter，添加弹簧体和摄像机组件

编辑 BP_ChallengeCharacter 事件图表蓝图，添加映射上下文

<figure markdown="span">
  ![Img 1](../../../img/unreal_engine/bp_practice/ue_bp_practice_img1.png){ width="600" }
</figure>

添加移动逻辑

<figure markdown="span">
  ![Img 2](../../../img/unreal_engine/bp_practice/ue_bp_practice_img2.png){ width="600" }
</figure>

添加视角朝向逻辑

<figure markdown="span">
  ![Img 3](../../../img/unreal_engine/bp_practice/ue_bp_practice_img3.png){ width="600" }
</figure>

创建 ABP_ChallengeCharacter，混合空间 1D BS1D_Challenge

打开 BS1D_Challenge，创建从静止到跑动状态的动画

打开 ABP_ChallengeCharacter，编辑事件图表蓝图

<figure markdown="span">
  ![Img 4](../../../img/unreal_engine/bp_practice/ue_bp_practice_img4.png){ width="600" }
</figure>

编辑 AnimGraph 蓝图

<figure markdown="span">
  ![Img 5](../../../img/unreal_engine/bp_practice/ue_bp_practice_img5.png){ width="600" }
</figure>

## 3 实现跳跃功能及 BUG 调试

创建 IA_Jump，在 IMC_Challenge 添加空格键的映射

打开 BP_ChallengeCharacter，编辑跳跃蓝图

<figure markdown="span">
  ![Img 6](../../../img/unreal_engine/bp_practice/ue_bp_practice_img6.png){ width="600" }
</figure>

打开 ABP_ChallengeCharacter，编辑 AnimGraph，添加一个状态机 Basic

<figure markdown="span">
  ![Img 7](../../../img/unreal_engine/bp_practice/ue_bp_practice_img7.png){ width="600" }
</figure>

进入事件图表，编辑蓝图

<figure markdown="span">
  ![Img 17](../../../img/unreal_engine/bp_practice/ue_bp_practice_img17.png){ width="800" }
</figure>

进入 Basic，编辑跳跃状态

<figure markdown="span">
  ![Img 8](../../../img/unreal_engine/bp_practice/ue_bp_practice_img8.png){ width="600" }
</figure>

=== "Locomotion"

    <figure markdown="span">
      ![Img 9](../../../img/unreal_engine/bp_practice/ue_bp_practice_img9.png){ width="600" }
    </figure>

=== "JumpStart"

    <figure markdown="span">
      ![Img 10](../../../img/unreal_engine/bp_practice/ue_bp_practice_img10.png){ width="600" }
    </figure>

=== "JumpLoop"

    <figure markdown="span">
      ![Img 11](../../../img/unreal_engine/bp_practice/ue_bp_practice_img11.png){ width="600" }
    </figure>

=== "JumpEnd"

    <figure markdown="span">
      ![Img 12](../../../img/unreal_engine/bp_practice/ue_bp_practice_img12.png){ width="600" }
    </figure>

编辑状态之间转移的条件

=== "Locomotion -> JumpStart"

    <figure markdown="span">
      ![Img 13](../../../img/unreal_engine/bp_practice/ue_bp_practice_img13.png){ width="600" }
    </figure>

=== "JumpStart -> JumpLoop"

    <figure markdown="span">
      ![Img 14](../../../img/unreal_engine/bp_practice/ue_bp_practice_img14.png){ width="600" }
    </figure>

=== "JumpLoop -> JumpEnd"

    <figure markdown="span">
      ![Img 15](../../../img/unreal_engine/bp_practice/ue_bp_practice_img15.png){ width="600" }
    </figure>

=== "JumpEnd -> Locomotion"

    <figure markdown="span">
      ![Img 16](../../../img/unreal_engine/bp_practice/ue_bp_practice_img16.png){ width="600" }
    </figure>

## 4 实现场景机关陷阱的逻辑

创建 BP_Sphere，添加网络体组件 SM_Sphere，添加 Sphere Collision（SM_Sphere 是父类），移动到合适的位置

打开事件图表，编辑蓝图

<figure markdown="span">
  ![Img 19](../../../img/unreal_engine/bp_practice/ue_bp_practice_img19.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 18](../../../img/unreal_engine/bp_practice/ue_bp_practice_img18.png){ width="600" }
</figure>

## 5 实现角色死亡布娃娃效果

打开 BP_ChallengeCharacter，编辑事件图表

<figure markdown="span">
  ![Img 20](../../../img/unreal_engine/bp_practice/ue_bp_practice_img20.png){ width="800" }
</figure>

打开 BP_Sphere，编辑事件图表

<figure markdown="span">
  ![Img 21](../../../img/unreal_engine/bp_practice/ue_bp_practice_img21.png){ width="600" }
</figure>

> 这是实现蓝图之间通信的一种方式，后面会介绍更高效、更专业的方式

打开 SK_Adventurer，选择物理资产 SK_Adventurer_Physics

打开 BP_ChallengeCharacter，修改碰撞预设为 PhysicsActor，将弹簧体组件作为网格体的子类

## 6 实现角色死亡后重生逻辑

打开 BP_ChallengeCharacter，编辑蓝图

<figure markdown="span">
  ![Img 22](../../../img/unreal_engine/bp_practice/ue_bp_practice_img22.png){ width="800" }
</figure>

打开 BP_ChallengeMode，新建 RebirthLocation 变量，设置 Z 轴默认值为 100，编辑蓝图

<figure markdown="span">
  ![Img 23](../../../img/unreal_engine/bp_practice/ue_bp_practice_img23.png){ width="600" }
</figure>

## 7 制作场景检查点蓝图功能

新建 BP_CheckPoint，添加 Box Collision 和箭头组件（Box Collision 是父类）

打开事件图表，编辑蓝图

<figure markdown="span">
  ![Img 24](../../../img/unreal_engine/bp_practice/ue_bp_practice_img24.png){ width="800" }
</figure>

来到视口，可以放置一些标志物

<figure markdown="span">
  ![Img 25](../../../img/unreal_engine/bp_practice/ue_bp_practice_img25.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 26](../../../img/unreal_engine/bp_practice/ue_bp_practice_img26.png){ width="600" }
</figure>

## 8 制作场景中的第二道机关

新建蓝图类 BP_002，添加 SM_Stone_03, SM_WoodenPole_05, SW_WoodenPole_06 静态网络体组件。编辑视口

<figure markdown="span">
  ![Img 27](../../../img/unreal_engine/bp_practice/ue_bp_practice_img27.png){ width="600" }
</figure>

打开事件图表，编辑蓝图

<figure markdown="span">
  ![Img 28](../../../img/unreal_engine/bp_practice/ue_bp_practice_img28.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 29](../../../img/unreal_engine/bp_practice/ue_bp_practice_img29.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 30](../../../img/unreal_engine/bp_practice/ue_bp_practice_img30.png){ width="800" }
</figure>

## 9 实现蓝图逻辑高效复用

新建蓝图类 BP_003，添加 SM_WoodStick_01, SM_WoodStick_01_A, SM_WoodenDisc_01 静态网络体组件，添加一个胶囊体组件

编辑胶囊体组件使得其包裹狼牙棒模型

将刺和胶囊体组件放到狼牙棒主体的子级

编辑事件图表

<figure markdown="span">
  ![Img 31](../../../img/unreal_engine/bp_practice/ue_bp_practice_img31.png){ width="600" }
</figure>

编辑构造脚本，添加一个布尔类型变量 Death，勾选其可编辑实例选项

> 勾选可编辑实例：场景中可以设置 Death 变量的值

<figure markdown="span">
  ![Img 32](../../../img/unreal_engine/bp_practice/ue_bp_practice_img32.png){ width="600" }
</figure>

编辑视口，在 Body 的子级添加一个箭头组件，使其指向狼牙棒旋转的方向，并稍微向天上旋转一些

<figure markdown="span">
  ![Img 33](../../../img/unreal_engine/bp_practice/ue_bp_practice_img33.png){ width="600" }
</figure>

编辑事件图表

<figure markdown="span">
  ![Img 34](../../../img/unreal_engine/bp_practice/ue_bp_practice_img34.png){ width="800" }
</figure>

## 10 制作场景中的第四个机关

新建蓝图类 BP_004，添加 SM_Thorns_01, SM_Track 静态网络体组件，添加一个胶囊体组件作为 SM_Thorns_01 的子级

<figure markdown="span">
  ![Img 35](../../../img/unreal_engine/bp_practice/ue_bp_practice_img35.png){ width="600" }
</figure>

编辑事件图表

<figure markdown="span">
  ![Img 37](../../../img/unreal_engine/bp_practice/ue_bp_practice_img37.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 36](../../../img/unreal_engine/bp_practice/ue_bp_practice_img36.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 38](../../../img/unreal_engine/bp_practice/ue_bp_practice_img38.png){ width="600" }
</figure>

## 11 蓝图实战完结

新建蓝图类 BP_Launch，添加 SM_Trampoline_01 静态网络体组件

添加贴花组件，选择 MI_Decal_02 材质

<figure markdown="span">
  ![Img 39](../../../img/unreal_engine/bp_practice/ue_bp_practice_img39.png){ width="600" }
</figure>

添加 Box 碰撞体组件，使其包裹布的范围

编辑事件图表，勾选 Launch Velocity Z 的可编辑实例

<figure markdown="span">
  ![Img 40](../../../img/unreal_engine/bp_practice/ue_bp_practice_img40.png){ width="600" }
</figure>

来到场景中的最后一个机关，一些简单逻辑的组件我们可以不用单独为其写一个蓝图，可以直接添加一些组件，先删除已有的旋转组件，重新创建

<figure markdown="span">
  ![Img 41](../../../img/unreal_engine/bp_practice/ue_bp_practice_img41.png){ width="600" }
</figure>

添加一个旋转移动组件，设置其 Y 轴旋转速率为 60

使用烟花特效编辑一下终点的特效

<figure markdown="span">
  ![Img 42](../../../img/unreal_engine/bp_practice/ue_bp_practice_img42.png){ width="600" }
</figure>

先将所有的烟花组件的自动启用取消勾选

新建蓝图类 End，添加一个 Box 碰撞体组件，调整盒体范围大一些

打开事件图表，新增一个 Niagara Particle System Actor 对象引用类型的变量 Niagara，并在右侧面板更改其类型为数组，勾选可编辑实例

<figure markdown="span">
  ![Img 43](../../../img/unreal_engine/bp_practice/ue_bp_practice_img43.png){ width="800" }
</figure>

在场景中添加 End 组件，并将所有烟花组件添加到其 Niagara 变量当中

打开 BP_ChallengeCharacter，编辑事件图表

<figure markdown="span">
  ![Img 44](../../../img/unreal_engine/bp_practice/ue_bp_practice_img44.png){ width="800" }
</figure>

打开 BP_ChallengeMode，将 RebirthLocation 设置为地图上出生点的位置

打开 BP_ChallengeCharacter，编辑类默认值，调整跳跃 Z 速度（影响跳跃的高度） 

打开 BP_ChallengeCharacter，可以调整 SpringArm 的目标臂长度