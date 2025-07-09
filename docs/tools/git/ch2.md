# 2 基本操作

!!! tip "说明"

    本文档正在更新中……

## 1 GUI 工具

Git 的 GUI 工具（图形用户界面工具）是为 Git 版本控制系统提供的可视化操作界面，可以通过图形化操作代替命令行。但是新手学习还是建议掌握一些基本的命令，再去使用 GUI 工具。不过，本文档为方便演示，使用 VS Code 内置的 Git 的工具以及对应的扩展进行演示。这样可以方便查看分支图形，便于理解。文档中也会指出图形化操作对应的等效命令

[VS Code 教程](../../application/vscode/index.md){:target="_blank"}

本文档使用的扩展：Git Graph

<figure markdown="span">
    ![Img 1](../../img/git/ch2/git_ch2_img1.png){ width="600" }
</figure>

!!! tip "配置 VS Code 为 git 默认编辑器"

    > 之前安装 git 时提到过的东西

    在终端中输入命令：

    ```bash linenums="1"
    $ git config --global core.editor "code --wait"
    ```

## 2 Git 仓库

!!! info "AI 解释"

    Git 仓库是一个特殊的目录（文件夹），它包含：

    1. 项目文件：代码、文档、资源等
    2. 版本历史：所有文件的修改记录（谁、何时、如何修改的）
    3. 配置信息：如分支、远程仓库地址等

    仓库通过隐藏的 `.git` 目录（位于项目根目录下）存储这些元数据

为了练习 git 的使用，可以找一个地方创建文件夹 `git_test`，（用 VS Code）打开这个文件夹

打开终端，使用以下命令来创建一个 git 仓库

```bash linenums="1"
$ git init
Initialized empty Git repository in G:/Project/git_test/.git/
```

<figure markdown="span">
    ![Img 2](../../img/git/ch2/git_ch2_img2.png){ width="600" }
    <figcaption markdown>git 创建了一个 `.git` 文件夹</figcaption>
</figure>

git 仓库的类型：

1. 本地仓库：存储在开发者自己的计算机上，独立工作
2. 远程仓库：托管在服务器（如 GitHub、GitLab、Gitee）上，用于团队协作和备份

远程仓库的相关操作在之后会介绍

## 3 Git 提交

!!! info "AI 解释"
    
    Git 的提交（`git commit`）是版本控制的核心操作，用于将代码的变更 **永久记录** 到本地仓库的历史中。可以将其理解为“保存项目的一个快照”

    > 相当于我们 **备份** 一大堆文件，不过是交给 git 来管理。后续如果我们想回到之前某个保存的备份（或者说版本），可以 ++ctrl+z++ 撤回（对应的是 `git reset` 操作）

在尝试使用 git 提交命令之前，我们先来了解 git 的 3 个区域和文件的 4 种状态

!!! info "AI 解释：Git 的三个核心区域"

    1. 工作区（Working Directory）

        1. 是什么：你直接看到的项目目录（即本地文件系统）
        2. 特点：所有文件的编辑、新增、删除都在这里进行
        3. 操作：直接修改文件（如用 IDE 或文本编辑器）

    2. 暂存区（Staging Area / Index）

        1. 是什么：一个“中间区域”，临时存放准备提交的变更
        2. 作用：选择性提交（例如只提交部分修改的文件）
        3. 操作：通过 `git add` 将工作区的变更添加到暂存区

    3. 本地仓库（Local Repository）

        1. 是什么：Git 的版本历史存储（位于 `.git` 目录中）
        2. 作用：永久保存提交（Commit）的快照
        3. 操作：通过 `git commit` 将暂存区的内容存入仓库

!!! info "AI 解释：文件的四种状态"

    1. 未跟踪（Untracked）

        1. 含义：文件是新创建的，Git 之前未记录过它
        2. 示例：新建的 `index.html` 文件
        3. 如何进入暂存区：`git add <file>`

    2. 已修改（Modified）

        1. 含义：已跟踪的文件被修改，但未暂存
        2. 示例：修改了已有的 `script.js` 文件但未 `git add`
        3. 如何进入暂存区：`git add <file>`

    3. 已暂存（Staged）

        1. 含义：文件的变更已添加到暂存区，等待提交
        2. 示例：执行 `git add README.md` 后的状态
        3. 如何提交到仓库：`git commit`

    4. 未修改（Unmodified）

        1. 含义：文件与仓库中最新提交的版本一致，无变更
        2. 示例：刚克隆仓库或刚提交后的文件状态
        3. 触发变化：编辑文件 → 变为 Modified；删除文件 → 变为 Untracked

> 暂时不理解没关系，本文档会给出状态转移图

使用以下命令来查看 git 仓库的状态

```bash linenums="1"
$ git status
On branch main  # 处于 main 分支上

No commits yet  # 还没提交过

nothing to commit (create/copy files and use "git add" to track)  # 没东西需要提交
```

- `git status`：很有用的命令，可以查看当前 git 仓库的各种状态

### 3.1 第 1 次提交

我们先创建一个文件来尝试使用 git 提交命令，新建文件 `file1.txt`，并写入一些内容

```text linenums="1" title="file1.txt"
这是 file1 的第 1 行
```

!!! question ""

    尝试输入 `git status`，看看此时输出什么信息

这就是我们这个“项目”的第 1 个版本了，现在我们需要提交上去（也就是将此文件存储到本地仓库当中），永久记录这个版本

<figure markdown="span">
    ![Img 3](../../img/git/ch2/git_ch2_img3.png){ width="600" }
    <figcaption>工作区域转移图</figcaption>
</figure>

提交的流程：

1. 修改文件：在工作目录中编辑代码
2. 添加到暂存区：通过 `git add {文件}` 选择要提交的变更
3. 执行提交：`git commit -m "{提交说明}"`

依次执行：

```bash linenums="1"
$ git add .
$ git commit -m "commit #1 on main"
```

- 将文件添加到暂存区

    - `git add {filepath}`：将某个文件添加到暂存区
    - `git add .`：将所有文件添加到暂存区
    - `git add *.txt`：将所有 `.txt` 文件添加到暂存区

- 将文件添加到本地仓库

    - `git commit -m {message}`：将暂存区中的文件添加到本地仓库。`{message}` 是需要输入的提交信息

> 有关提交信息的规范格式，见 [Git 规则](./index.md#21-提交信息){:target="_blank"}

!!! tip "VS Code"

    也可以使用 VS Code 的 GUI 来进行操作，某些操作与特定的 git 命令等效

    <div class="grid" markdown>
    <div markdown>
    <figure markdown="span">
    ![Img 4](../../img/git/ch2/git_ch2_img4.png){ width="400" }
    </figure>
    </div>
    <div markdown>
    <figure markdown="span">
    ![Img 5](../../img/git/ch2/git_ch2_img5.png){ width="400" }
    </figure>
    </div>
    </div>

这样我们就得到了一个提交版本，记录了这个版本整个项目的状态

### 3.2 第 2 次提交

接下来，我们修改 `file1.txt`

```text linenums="1" title="file1.txt"
这是 file1 的第 1 行
这是 file1 的第 2 行
```

!!! question ""

    尝试输入 `git status`，看看此时输出什么信息

我们再次进行一次提交，不过这次我们使用这条指令

```bash linenums="1"
$ git commit -am "commit #2 on main"
```

- `git commit -am {message}`：将所有已经跟踪过的文件（即那些已经被纳入版本控制、在仓库中存在历史记录的文件）中的修改添加到暂存区，并执行一次提交，并允许你附带提交信息。某些情况下等效于依次执行 `git add` 和 `git commit`

### 3.3 第 3 次提交

修改 `file1.txt`，并新建文件 `file2.txt`

```text linenums="1" title="file1.txt"
这是 file1 的第 1 行
这是 file1 的第 2 行
这是 file1 的第 3 行
```

```text linenums="1" title="file2.txt"
这是 file2 的第 1 行
```

!!! question ""

    尝试输入 `git status`，看看此时输出什么信息

此时提交时，如果直接使用 `git commit -am`，并不会提交 `file2.txt`，因为它之前没有被 git 记录过

所以，我们输入以下指令来执行提交

```bash linenums="1"
$ git add .
$ git commit -m "commit #3 on main"
```

## 4 Git 提交记录

我们已经提交过 3 次了，那么如何查看提交记录呢

使用 `git log` 命令

```bash linenums="1"
$ git log
# 后面一串字符是提交 Hash 码，一个 Hash 码对应一个提交，因此，可以根据 Hash 码来找到某次提交记录
commit eb84d9d5893dc1179b02a05682458ce07923e5e4 (HEAD -> main)
# 这里显示了提交者的信息
Author: WintermelonC <145361960+WintermelonC@users.noreply.github.com>
# 提交日期
Date:   Sun Jun 29 22:43:00 2025 +0800

# 提交信息
    commit #3 on main

commit 1321c62993080f0806c073b73a3f6a92f1029da4
Author: WintermelonC <145361960+WintermelonC@users.noreply.github.com>
Date:   Sun Jun 29 22:38:36 2025 +0800

    commit #2 on main

commit 0c789390b5d43f387284fe12787ff3904d15f8cb
Author: WintermelonC <145361960+WintermelonC@users.noreply.github.com>
Date:   Sun Jun 29 22:29:50 2025 +0800

    commit #1 on main
```

简化输出：

- `git log --oneline`：提交信息一行显示
- `git log --graph --oneline --all`：图形化显示提交记录

```bash linenums="1"
$ git log --oneline
eb84d9d (HEAD -> main) commit #3 on main
1321c62 commit #2 on main
0c78939 commit #1 on main
$ git log --graph --oneline --all
# 这条指令的区别不是很明显，等后面涉及到分支指令后就有区分度了
* eb84d9d (HEAD -> main) commit #3 on main
* 1321c62 commit #2 on main
* 0c78939 commit #1 on main
```

> 但 `git log --graph --oneline --all` 完全可以使用 GUI 工具来替代

!!! tip "VS Code"

    可以在 VS Code 中查看提交记录

    <figure markdown="span">
        ![Img 6](../../img/git/ch2/git_ch2_img6.png){ width="600" }
    </figure>

    <figure markdown="span">
        ![Img 7](../../img/git/ch2/git_ch2_img7.png){ width="600" }
    </figure>

### 4.1 查看某个提交记录

现在，我们想查看当时第 1 次提交时，项目的状态是怎么样的，输入命令

```bash linenums="1"
# 0c78939 是第 1 次提交的 Hash 码的前 7 位
$ git checkout 0c78939
Previous HEAD position was eb84d9d commit #3 on main
HEAD is now at 0c78939 commit #1 on main
```

可以看到，此时我们的项目状态已经转变成第 1 次提交时的版本了

<figure markdown="span">
    ![Img 8](../../img/git/ch2/git_ch2_img8.png){ width="600" }
</figure>

> 此时，可以对项目进行修改。但以我们现在所学的东西，不建议这样做，因为这通常会涉及到分支操作

!!! tip "HEAD 指针"

    在 Git 中，HEAD 是一个特殊的指针，它指向当前所在的提交（commit），也就是你的工作目录所基于的版本。可以把它理解为你“正在查看的位置”或“当前的工作点”

    在 Git Graph 中，提交信息前面的蓝色圆圈就代表 HEAD 指针所在的位置

    所以，我们刚才 checkout 到第 1 次的提交，就是把 HEAD 指针移动到第 1 次提交的位置

    另外，我们把每次提交的那个位置称作一个 **提交节点**。那么，目前我们有 3 个提交节点，HEAD 正处于第 1 个提交节点上

想要回到最新的版本状态，输入

```bash linenums="1"
$ git checkout main
Previous HEAD position was 0c78939 commit #1 on main
Switched to branch 'main'
```

!!! question "为什么不是 `git checkout eb84d9d`"

    如果输入 `git checkout eb84d9d`，也能回到最新的版本状态，但此时 HEAD 指针处于悬空状态，即不在任何分支上。如果在这种状态下提交信息，会发现 main 分支并没有更新，而这个新的提交节点由于处于悬空状态，git 只是临时保存它，很容易丢失

!!! tip "VS Code"

    使用 Git Graph 可以在不输入 `git checkout` 的情况下，查看某个版本的文件内容

    <figure markdown="span">
        ![Img 9](../../img/git/ch2/git_ch2_img9.png){ width="600" }
    </figure>

## 5 Git 回退

## Git 删除

## `.gitignore` 文件