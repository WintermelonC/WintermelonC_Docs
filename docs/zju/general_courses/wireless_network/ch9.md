# 9 地址解析

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 9.1 MAC 和 IP

### 9.1.1 同一网络中的目的地

有时，主机必须发送消息，但它只知道目的设备的 IP 地址。主机需要知道该设备的 MAC 地址，但是如何才能发现它呢? 这就是地址解析变得至关重要的地方

以太网 LAN 上的设备都配有两个主要地址：

1. 物理地址（MAC 地址）：用于同一网络上的以太网网卡之间的通信
2. 逻辑地址（IP 地址）：用于将数据包从源设备发送到目的设备。目的 IP 地址可能与源地址在同一个 IP 网络上，也可能在远程网络上

第二层物理地址（即以太网 MAC 地址）用于将数据链路层帧从同一网络中一个网卡发送到另一个网卡， IP 数据包就封装在帧中。如果目的 IP 地址在同一网络上，则目的 MAC 地址将是目的设备的 MAC 地址

### 9.1.2 远程网络中的目的地

当目的 IP 地址 (IPv4 或 IPv6) 处于远程网络中时，则目的 MAC 地址为主机的默认网关的地址 (即路由器接口)

路由器通过检查目的 IPv4 地址来确定转发 IPv4 数据包的最佳路径。路由器收到以太网帧后，将解封第 2 层信息。它可借助目的 IPv4 地址确定下一跳设备，然后将 IPv4 数据包封装在发送接口的新数据链路帧中

沿着路径中的每个链路，IP 数据包都被封装在一个帧中。这个帧由该链路的数据链路层技术指定，如以太网。如果下一跳设备为最终目的地，则目的 MAC 地址将是该设备的以太网网卡的 MAC 地址

## 9.2 ARP

### 9.2.1 ARP 概述

如果您的网络使用 IPv4 通信协议，则需要使用地址解析协议 (ARP) 将 IPv4 地址映射到 MAC 址

ARP 提供两个基本功能：

1. 将 IPv4 地址解析为 MAC 地址
2. 维护 IPv4 到 MAC 地址映射表

### 9.2.2 ARP 功能

当数据包发送到要封装入以太网帧的数据链路层时，设备将参照其内存中的表来查找映射至 IPv4 地址的 MAC 地址。此表临时存储在 RAM 内存中，称为 ARP 表或 ARP 缓存

发送设备会在自己的 ARP 表中搜索目的 IPv4 地址和相应的 MAC 地址：

1. 如果数据包的目的 IPv4 地址与源 IPv4 地址处于同一个网络，则设备会在 ARP 表中搜索目的 IPv4 地址
2. 如果目的 IPv4 地址与源 IPv4 地址不在同一个网络中，则设备会在 ARP 表中搜索默认网关的 IPv4 地址

### 9.2.3 ARP 请求

ARP 消息直接封装到以太网帧中。没有 IPv4 报头。ARP 请求使用以下帧头信息封装在以太网帧中：

1. 目的 MAC 地址：这是一种要求 LAN 上的所有以太网网卡接受并处理 ARP 请求的广播地址FF-FF-FF-FF-FF-FF
2. 源 MAC 地址：这是 ARP 请求发送方的 MAC 地址
3. 类型：ARP 消息的类型字段为 0x806。该类型字段会通知接收网卡需要将帧的数据部分传递给 ARP 进程处理

### 9.2.4 ARP 操作 - ARP 应答

只有原始发送 ARP 请求的设备会收到单播 ARP 应答。收到该 ARP 应答后，设备会将 IPv4 地址及相应的 MAC 地址添加到自身的 ARP 表中。该 IPv4 地址的数据包现在便可使用其相应的 MAC 地址封装在帧中

### 9.2.5 ARP 在远程通信中的作用

当目的 IPv4 地址与源 IPv4 地址位于不同网络时，源设备需要将帧发送到其默认网关。这是本地路由器的接口。每当源设备具有 IPv4 地址在其他网络中的数据包时，它会使用路由器的目的 MAC 地址将该数据包封装在帧中

### 9.2.6 从 ARP 表中删除条目

对于每台设备，ARP 缓存定时器将会删除在指定时间内未使用的 ARP 条目。时间根据设备的操作系统不同而不同。例如，较新的 Windows 操作系统将 ARP 表条目存储 15 秒到 45 秒之间

### 9.2.7 网络设备上的 ARP 表

在思科路由器上，`show ip arp` 命令用于显示 ARP 表

在 Windows 10 PC 上，`arp –a` 命令用于显示 ARP 表

## 9.3 IPv6 邻居发现

### 9.3.1 IPv6 邻居发现

如果您的网络使用 IPv6 通信协议，则需要使用邻居发现协议 (ND )将 IPv6 地址与 MAC 地址进行匹配

### 9.3.2 IPv6 邻居发现消息

IPv6 邻居发现协议有时被称为 ND 或 NDP。在本课程中，我们称它为 ND。ND 使用 ICMPv6 为 IPv6 提供地址解析、路由器发现和重定向服务。ICMPv6 ND 使用五种 ICMPv6 消息来执行这些服务：

1. 邻居请求消息
2. 邻居通告消息
3. 路由器请求消息
4. 路由器通告消息
5. 重定向消息

邻居请求和邻居通告消息用于设备到设备的消息传递，例如地址解析（类似于 IPv4 的 ARP）。设备包括主机计算机和路由器

路由器请求和路由器通告消息用于设备和路由器之间的消息传递。通常，路由器发现用于动态地址分配和无状态地址自动配置 (SLAAC)

### 9.3.3 IPv6 邻居发现 - 地址解析

与 IPv4 的 ARP 非常相似，IPv6 设备使用 IPv6 ND 来确定一个已知 IPv6 地址的设备的 MAC 地址