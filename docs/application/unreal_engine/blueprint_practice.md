# 蓝图实战

## 1 创建项目并导入素材

创建一个空白项目，在项目根目录的 content 文件夹下导入素材

## 2 实现基础操作及动画

创建 IA_Look，IA_Move，IMC_Challenge。添加 WSAD 和鼠标映射

创建 BP_ChallengeMode，BP_ChallengeCharacter。BP_ChallengeCharacter 的网络体选择 SK_Adventure

打开 BP_ChallengeCharacter，添加弹簧体和摄像机组件

编辑 BP_ChallengeCharacter 事件图表蓝图，添加映射上下文

<figure markdown="span">
  ![Img 1](../../img/unreal_engine/bp_practice/ue_bp_practice_img1.png){ width="600" }
</figure>

添加移动逻辑

<figure markdown="span">
  ![Img 2](../../img/unreal_engine/bp_practice/ue_bp_practice_img2.png){ width="600" }
</figure>

添加视角朝向逻辑

<figure markdown="span">
  ![Img 3](../../img/unreal_engine/bp_practice/ue_bp_practice_img3.png){ width="600" }
</figure>

创建 ABP_ChallengeCharacter，混合空间 1D BS1D_Challenge

打开 BS1D_Challenge，创建从静止到跑动状态的动画

打开 ABP_ChallengeCharacter，编辑事件图表蓝图

<figure markdown="span">
  ![Img 4](../../img/unreal_engine/bp_practice/ue_bp_practice_img4.png){ width="600" }
</figure>

编辑 AnimGraph 蓝图

<figure markdown="span">
  ![Img 5](../../img/unreal_engine/bp_practice/ue_bp_practice_img5.png){ width="600" }
</figure>