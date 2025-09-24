# 2 QEMU

<!-- !!! tip "说明"

    本文档正在更新中…… -->

QEMU 是一个开源的、功能强大的硬件虚拟化平台和模拟器

启动 RISC-V 64 位虚拟机的 QEMU 命令：

```bash linenums="1"
qemu-system-riscv64 \
    -nographic \
    -machine virt \
    -kernel path/to/linux/arch/riscv/boot/Image \
    -append "root=/dev/vda ro console=ttyS0" \
    -drive file=rootfs.img,format=raw,id=hd0 \
    -device virtio-blk-device,drive=hd0 \
    -bios default \
    -S -s
```

1. 基本设置

    1. `qemu-system-riscv64`：使用 RISC-V 64 位架构的模拟器
    2. `-nographic`：不使用图形界面，直接在当前终端中显示串口控制台
    3. `-machine virt`：使用 QEMU 的通用 RISC-V 虚拟机器平台

2. 内核配置

    1. `-kernel`：指定要启动的 Linux 内核镜像路径
    2. `-append`：传递给内核的启动参数

        1. `root=/dev/vda`：根文件系统在第一个虚拟磁盘设备
        2. `ro`：以只读模式挂载根文件系统（通常启动后会重新挂载为读写）
        3. `console=ttyS0`：使用第一个串口作为控制台

3. 存储设备

    1. `-drive`：创建一个虚拟硬盘驱动器

        1. `file=rootfs.img`：使用 rootfs.img 文件作为硬盘镜像
        2. `format=raw`：镜像格式为原始格式
        3. `id=hd0`: 给这个驱动器分配标识符 "hd0"

    2. `-device`: 创建一个 VirtIO 块设备并连接到 hd0 驱动器

4. 固件和调试

    1. `-bios default`: 使用默认的 BIOS（OpenSBI）
    2. `-S`: 启动时暂停 CPU 执行（等待调试器连接）
    3. `-s`: 在 TCP 端口 1234 上启动 GDB 调试服务器
