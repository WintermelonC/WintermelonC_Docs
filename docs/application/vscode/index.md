# VS Code

!!! info "AI 介绍"

    Visual Studio Code（简称 VS Code）是一款由微软开发的免费源代码编辑器，支持多种编程语言，并且可以在不同的操作系统上运行，包括 Windows、macOS 和 Linux。VS Code 以其轻量级但功能强大的特性而受到开发者们的喜爱，它结合了现代编辑器的简洁界面与传统 IDE 的强大功能

    主要特点包括：
    
    - **跨平台**：能够在多个主流操作系统上使用
    - **内置 Git 支持**：可以直接在编辑器中进行版本控制操作
    - **智能感知**：根据上下文提供代码补全建议
    - **调试工具**：内置了交互式调试功能
    - **任务自动化**：可以通过配置文件来定义和执行构建任务
    - **扩展性**：拥有庞大的插件市场，允许用户安装各种插件来增加额外的功能，如主题、调试工具、附加语言支持等
    - **多语言支持**：原生支持多种编程语言，同时通过插件可以扩展到更多语言
    - **集成终端**：直接在编辑器内打开命令行接口
    - **实时协作**：支持多人在线协同编辑同一份文档（需通过Live Share插件）
    
    适用场景：
    
    - **Web 开发**：非常适合 HTML, CSS, JavaScript 等前端技术栈
    - **后端开发**：对于 Python, Java, C#, Go 等多种后端语言也提供了良好的支持
    - **云开发**：Azure Functions, AWS Lambda 等功能的开发
    - **移动应用开发**：配合相应的工具链，也可用于 iOS 或 Android 应用开发
    - **游戏开发**：适用于 Unity 等游戏引擎相关的脚本编写
    
    总之，VS Code 是一个非常灵活且高效的开发工具，适合不同类型的开发者使用。由于其高度可定制性和丰富的社区资源，成为了许多程序员日常工作的首选编辑器之一

## 1 下载和安装

!!! info "说明"

    本文档使用 Windows 系统进行演示

软件下载：[Visual Studio Code](https://code.visualstudio.com/){:target="_blank"}

<figure markdown="span">
  ![img 1](../../img/vscode/vscode_img1.png){ width="600" }
</figure>

点击 Download for Windows 按钮

<figure markdown="span">
  ![img 2](../../img/vscode/vscode_img2.png){ width="300" }
</figure>

双击运行下载的文件

<figure markdown="span">
  ![img 3](../../img/vscode/vscode_img3.png){ width="600" }
</figure>

选择 ^^我同意此协议^^，点击下一步

<figure markdown="span">
  ![img 4](../../img/vscode/vscode_img4.png){ width="600" }
</figure>

选择安装位置，==建议安装在非 C 盘目录下==。选择完成后，点击 Next

!!! info "说明"

    本节使用 Windows 虚拟机进行演示，就不更改安装位置了

<figure markdown="span">
  ![img 5](../../img/vscode/vscode_img5.png){ width="600" }
</figure>

保持默认，点击下一步

<figure markdown="span">
  ![img 6](../../img/vscode/vscode_img6.png){ width="600" }
</figure>

- [x] 创建桌面快捷方式：可以勾选
- [x] 将“通过 Code 打开”操作添加到 Windows 资源管理器文件上下文菜单：建议勾选，这样可以很方便的使用 VS Code 打开文件
- [x] 将“通过 Code 打开”操作添加到 Windows 资源管理器目录上下文菜单：建议勾选，这样可以很方便的使用 VS Code 打开文件夹
- [x] 将 Code 注册为受支持的文件类型的编辑器：保持默认的勾选状态
- [x] 添加到 PATH：保持默认的勾选状态

点击下一步

<figure markdown="span">
  ![img 7](../../img/vscode/vscode_img7.png){ width="600" }
</figure>

点击安装，等待安装完成

<figure markdown="span">
  ![img 8](../../img/vscode/vscode_img8.png){ width="600" }
</figure>

若勾选 ^^运行 Visual Studio Code^^，点击完成后会立即启动 VS Code

## 2 面板

打开 VS Code，默认语言是英文，我们先安装汉化扩展

<figure markdown="span">
  ![img 9](../../img/vscode/vscode_img9.png){ width="600" }
</figure>

在界面左侧找到 ^^扩展^^ 面板，在搜索框中输入 `chinese`，安装插件 ^^Chinese (Simplified) (简体中文) Language Pack^^，点击 Install 按钮进行安装

<figure markdown="span">
  ![img 10](../../img/vscode/vscode_img10.png){ width="600" }
</figure>

安装完成后，右下角出现提示：是否切换至中文语言并重启，点击此按钮。重启后，VS Code 的语言切换为中文

<figure markdown="span">
  ![img 11](../../img/vscode/vscode_img11.png){ width="600" }
</figure>

在界面左侧找到 ^^资源管理器^^ 面板，点击 ^^打开文件夹^^，我们打开一个文件夹进行演示

<figure markdown="span">
  ![img 12](../../img/vscode/vscode_img12.png){ width="600" }
</figure>

比如我新建一个 vscode 文件夹，并选择它打开

### 2.1 资源管理器

资源管理器面板就相当于 Windows 的文件资源管理器，能够进行文件的创建、删除、复制、粘贴、重命名等操作

<figure markdown="span">
  ![img 13](../../img/vscode/vscode_img13.png){ width="600" }
</figure>

将鼠标移动至资源管理器面板上，上方会出现 4 个按钮，我们先点击第 1 个按钮新建文件

<figure markdown="span">
  ![img 14](../../img/vscode/vscode_img14.png){ width="600" }
</figure>

输入文件名，比如我们新建一个 `test.txt` 文本文件

!!! tip "提示"

    新建文件时，需要写上文件后缀

在右侧的 ^^编辑^^ 面板中，就会打开此文件，可以进行编辑操作，记得及时保存文件哦，快捷键：++ctrl+s++

<figure markdown="span">
  ![img 15](../../img/vscode/vscode_img15.png){ width="600" }
</figure>

<figure markdown="span">
  ![img 16](../../img/vscode/vscode_img16.png){ width="600" }
</figure>

将鼠标移动至资源管理器面板上，点击第 2 个按钮新建文件夹，命名为 `test_folder`

我们在这个新的文件夹中创建 1 个新的文件 `test.txt`，有两种方法

1. 选中 `test_folder` 文件夹，点击上方第 1 个按钮新建文件
2. 右键 `test_folder` 文件夹，选择新建文件

<figure markdown="span">
  ![img 17](../../img/vscode/vscode_img17.png){ width="600" }
</figure>

之后 `vscode` 文件夹内部布局如下

<figure markdown="span">
  ![img 18](../../img/vscode/vscode_img18.png){ width="600" }
</figure>

同理，可以在某个文件夹下新建文件夹，和 Windows 文件资源管理器的操作类似

这时，使用 Windows 文件资源管理器打开 `vscode` 文件夹，你会发现里面的东西和 VS Code 中的一模一样，在 VS Code 中操作文件就是在操作电脑上的文件

> 感觉我在说废话，但我认为有必要解释清楚这一点，因为可能有些同学没有“编辑器”这一概念

!!! question "为什么你的图标和我的不一样"

    因为我安装了图标美化扩展，下文会介绍

### 2.2 编辑

在编辑面板中，能够对文件进行编辑操作，什么 ++ctrl+c++ ++ctrl+v++ 等等的快捷键都是能够使用的

需要注意的是文件编码格式，一种编码格式的文件使用另一种编码格式打开，可能会出现乱码。在界面右下角会显示当前是使用什么文件编码格式打开文件的

<figure markdown="span">
  ![img 19](../../img/vscode/vscode_img19.png){ width="500" }
</figure>

我们可以设置默认的文件编码格式，建议设置为 UTF-8 格式

<figure markdown="span">
  ![img 20](../../img/vscode/vscode_img20.png){ width="500" }
</figure>

打开设置，保证选择的是 ^^用户^^，在搜索框中输入 `encoding`，找到这个设置选项，并设置为 UTF-8

<figure markdown="span">
  ![img 21](../../img/vscode/vscode_img21.png){ width="500" }
</figure>

!!! question "这个用户和工作区是什么意思"

    下文会介绍

## 3 扩展

## 4 设置