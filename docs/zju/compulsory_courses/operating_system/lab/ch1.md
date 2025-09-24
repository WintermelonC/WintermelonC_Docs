# 1 Linux

<!-- !!! tip "说明"

    本文档正在更新中…… -->

## 1 文件操作

Linux 文件系统是单根结构，一切从 `/`（根目录）开始

### 1.1 目录结构

- `/`：根目录
- `/bin`：存放系统最基本用户命令（二进制可执行文件）
- `/etc`：存放系统的配置文件
- `/home`：普通用户的家目录，每个用户有一个以用户名命名的子目录
- `/root`：超级管理员 root 的家目录
- `/tmp`：临时文件目录
- `/usr`：存放用户安装的应用程序和文件
- `/var`：存放经常变化的文件，如日志、缓存

### 1.2 基本命令

- `pwd`：显示当前所在的工作目录
- `ls`：列出目录内容

```bash linenums="1"
ls          # 列出当前目录文件
ls -l       # 以长格式列出（显示详细信息）
ls -a       # 列出所有文件，包括隐藏文件（以 . 开头的文件）
ls /home    # 列出指定目录的内容
```

- `cd`：切换目录

```bash linenums="1"
cd /path/to/directory  # 切换到绝对路径
cd directory_name      # 切换到当前目录下的子目录（相对路径）
cd ..                  # 切换到上一级目录
cd ~ 或 cd            # 切换到当前用户的家目录
cd -                  # 切换到上一个所在的目录
```

- `mkdir`：创建新目录

```bash linenums="1"
mkdir new_folder
mkdir -p path/to/nested/folder  # 递归创建多级目录
```

- `touch`：创建一个空文件或更新文件的时间戳

```bash linenums="1"
touch new_file.txt
```

- `cp`：复制文件或目录

```bash linenums="1"
cp file1.txt file2.txt          # 复制文件
cp file1.txt /path/to/dest/     # 复制文件到目标目录
cp -r directory1 directory2     # 递归复制整个目录
```

- `mv`：移动文件或目录，也可用于重命名

```bash linenums="1"
mv oldname.txt newname.txt      # 重命名
mv file.txt /path/to/dest/      # 移动文件
```

- `rm`：删除文件或目录

```bash linenums="1"
rm file.txt                     # 删除文件
rm -r directory_name            # 递归删除目录及其内容
rm -f file.txt                  # 强制删除，不提示
# 警告：rm -rf / 会毁灭系统！切勿尝试！
```

- `cat`：查看文件全部内容
- `less` / `more`：分页查看文件内容（推荐用 `less`，可上下滚动）
- `head` / `tail`：查看文件开头或末尾的若干行（默认 10 行）

```bash linenums="1"
tail -f logfile.log            # 实时追踪日志文件的更新
```

### 1.3 vim

```bash linenums="1"
# 编辑文件
vim 文件名.txt

# 或者用 vi（vim 的简化版）
vi 文件名.txt
```

基本操作模式：

1. 正常模式：按 ++i++ 进入插入模式
2. 插入模式：编辑文本（按 ++escape++ 返回正常模式）
3. 命令模式：在正常模式下按 ++colon++ 进入

    1. `:w`: 保存
    2. `:q`: 退出
    3. `:wq` 或 `:x`: 保存并退出
    4. `:q!`: 强制退出不保存

## 2 文件权限与所有权

Linux 是一个多用户系统，每个文件和目录都有权限和所有者

### 2.1 查看权限

`ls -l`

```bash linenums="1"
-rw-r--r-- 1 user group 1234 Sep 21 10:00 file.txt
drwxr-xr-x 2 user group 4096 Sep 21 11:00 folder/
```

- 第 1 个字符：`-` 表示文件，`d` 表示目录
- 后面 9 个字符：每 3 个一组，分别表示所有者、所属组、其他用户的权限
- `r` = 读，`w` = 写，`x` = 执行（对于目录，`x` 表示可以进入）

### 2.2 修改权限

```bash linenums="1" title="符号模式"
chmod u+x script.sh    # 给所有者增加执行权限
chmod go-w file.txt    # 移除组和其他用户的写权限
chmod a+r file.txt     # 给所有用户增加读权限
```

```bash linenums="1" title="数字模式"
# r=4, w=2, x=1。rwx = 4+2+1=7
chmod 755 script.sh    # 所有者：rwx，组和其他：r-x
chmod 644 file.txt     # 所有者：rw-，组和其他：r--
```

### 2.3 修改所有者

```bash linenums="1" title="数字模式"
chown newowner file.txt
chown newowner:newgroup file.txt
chown -R newowner:newgroup /path/to/directory  # 递归修改
```

## 3 文本处理

- `grep`：在文件中搜索文本模式

```bash linenums="1" title="数字模式"
grep "error" logfile.log          # 在文件中搜索 "error"
grep -r "function" /path/to/code/ # 递归搜索目录下的所有文件
grep -i "warning" file.txt        # 忽略大小写
```

- `find`：根据条件查找文件

```bash linenums="1" title="数字模式"
find /home -name "*.txt"          # 在 /home 下查找所有 .txt 文件
find . -type f -size +10M         # 在当前目录查找大于10MB的文件
find /var/log -mtime -7           # 查找 /var/log 下7天内修改过的文件
```

- `sed`：流编辑器，用于对文本进行替换、删除等操作

```bash linenums="1" title="数字模式"
sed 's/foo/bar/g' file.txt        # 将文件中所有的 foo 替换为 bar
```

- `awk`：强大的文本分析工具，擅长处理结构化文本（如日志）

```bash linenums="1" title="数字模式"
awk '{print $1}' file.txt         # 打印每行的第一个字段（默认以空格分隔）
```

## 4 进程管理

- `ps`：查看当前进程快照

```bash linenums="1" title="数字模式"
ps aux                            # 查看系统所有进程的详细信息
```

- `top` / `htop`：动态实时查看进程状态和系统资源占用（htop 更友好）
- `kill`：终止进程

```bash linenums="1" title="数字模式"
kill 1234                         # 终止PID为1234的进程
kill -9 1234                      # 强制终止进程
```

- `&` 和 `nohup`：后台运行程序

```bash linenums="1" title="数字模式"
./long_running_script.sh &        # 在后台运行
nohup ./long_running_script.sh &  # 退出终端后继续运行
```

## 5 软件包管理

不同发行版使用不同的包管理器

Debian/Ubuntu (APT)：

```bash linenums="1" title="数字模式"
sudo apt update                   # 更新软件包列表
sudo apt install package_name     # 安装软件包
sudo apt remove package_name      # 卸载软件包
sudo apt upgrade                  # 升级所有已安装的包
```

## 6 系统信息与监控

- `uname -a`：查看内核版本和系统架构
- `df -h`：查看磁盘空间使用情况（人类可读格式）
- `free -h`：查看内存使用情况
- `uptime`：查看系统运行时间和平均负载

## 7 网络相关

- `ping`：测试网络连通性
- `curl` / `wget`：从网络下载文件
- `ssh`：远程登录
- `scp`：安全地复制文件到远程主机

```bash linenums="1" title="数字模式"
scp file.txt user@remotehost:/path/  # 本地复制到远程
scp user@remotehost:/path/file.txt . # 远程复制到本地
```
