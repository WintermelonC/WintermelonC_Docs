# Lab 5: 流水线 CPU

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! warning "注意"

    1. 官方 ppt 部分内容存在错误，请注意辨别
    2. 具体的 verilog 代码请先根据官方 ppt 自行完成，本文档不提供全部的 verilog 代码，仅作参考和提示作用
    3. 本文档为个人经验，具体情况具体分析

## 实验目标

1. 利用课件给的文件先搭建好 Pipeline CPU 的顶层模块（课件给的文件端口位数等有问题，该步骤做不了，等到完成步骤 3，再搭建顶层模块）
2. 设计 IF、ID
3. 设计 EX、MEM、WB
4. 实现冒险处理与 stall

## 5.1 搭建顶层模块

保存文件 `comp_organ/lab5_instr_p_mem.coe`（p 指 pipeline，不含冒险的指令） `comp_organ/lab5_instr_h_mem.coe`（h 指 hazard，包含冒险的指令）

<div class="grid" markdown>

```verilog title="lab5_instr_p_mem.coe" linenums="1"
memory_initialization_radix=16;
memory_initialization_vector=
00100093,
00100113,
00100193,
00100213,
00802283,
00108333,
0020C3B3,
40110433,
05C02483,
00327533,
00502223,
005325B3,
0AA3C613,
0012D6B3,
00147713,
0034E7B3,
00A50833,
0085C8B3,
00402903,
004629B3,
0016DA13,
00677AB3,
40128B33,
00150B93,
00986C33,
00B9CCB3,
0FFA7D13,
00390DB3,
002A5E33,
0AF9EE93,
001A0F33,
00802F83,
F81FF06F,
00000033,
00000033,
00000033;
```

```verilog title="lab5_instr_h_mem.coe" linenums="1"
memory_initialization_radix=16;
memory_initialization_vector=
00000013,
00100093,
00100113,
00100193,
00100213,
00802283,
00128333,
0020C3B3,
40708433,
FFF1E493,
00327533,
00502223,
005325B3,
0AA3C613,
00818663,
00000013,
00000033,
0012D6B3,
00147713,
0034E7B3,
00A50833,
0085C8B3,
00402903,
004629B3,
0016DA13,
00A77AB3,
00C71463,
00000013,
40128B33,
00150B93,
00986C33,
00B9CCB3,
0FFA7D13,
00390DB3,
002A5E33,
0AF9EE93,
001A0F33,
00802F83,
F69FF06F,
001A8A93,
001B8B93,
001C8C93;
```

</div>

## 5.2 设计 IF、ID

在目录 `comp_organ/project` 下，创建工程文件，命名为 `lab5_pipeline_CPU`

### 原理

根据 ppt 内容了解 IF、ID 的构造

### IF

新建 `IF.v` 源文件，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc1.pdf" type="application/pdf" width="100%" height="500" />

### IF_reg_ID

新建 `IF_reg_ID.v` 源文件，根据 ppt 内容，编写 verilog 代码

### ID

新建 `ID.v` 源文件，根据连接图调用相关模块，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc2.pdf" type="application/pdf" width="100%" height="500" />

### ID_reg_EX

新建 `ID_reg_EX.v` 源文件，根据 ppt 内容，编写 verilog 代码

## 5.3 设计 EX、MEM、WB

### 原理

根据 ppt 内容，了解 EX、MEM、WB 的构造

### EX

新建 `EX.v` 源文件，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc3.pdf" type="application/pdf" width="100%" height="500" />

### EX_reg_MEM

新建 `EX_reg_MEM.v` 源文件，根据 ppt 内容，编写 verilog 代码

### MEM

新建 `MEM.v` 源文件，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc4.pdf" type="application/pdf" width="100%" height="500" />

### MEM_reg_WB

新建 `MEM_reg_WB.v` 源文件，根据 ppt 内容，编写 verilog 代码

### WB

新建 `WB.v` 源文件，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc5.pdf" type="application/pdf" width="100%" height="500" />

### Pipeline_CPU

新建 `Pipeline_CPU.v` 源文件，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc6.pdf" type="application/pdf" width="100%" height="500" />

### 仿真验证

和 lab 4 仿真时一样，搭建仿真平台后，进行仿真

### 上板验证

!!! warning "注意"

    还是和 lab 4 一样

    由于未知原因，上板验证时，凡是涉及 RAM 的指令（如 `lw` `sw` 等）均运行不正确。如果遇到此问题无法解决，可以尝试将 RAM 替换为一个模块，此模块通过创建一个大数组以达到类似 RAM 的效果

    > 我们验收可以仿真验收，也可以上板验收，我也遇到了这个问题，懒得弄了，就仿真验收了

封装为 IP 核后，可以选择复制一份 lab 2 的工程文件

lab 5 的 VGA 内容和 lab 4 的不太一样，保存课件中的 `font_8x16.mem` `vga_debugger.mem` 到 `comp_organ/new_font_8x16.mem` `comp_organ/new_vga_debugger.mem`，和 [lab 2](./lab2.md#vgadisplay){:target="_blank"} 相同，更改相关的模块内容

---

修改 `CSSTE.v`，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc7.pdf" type="application/pdf" width="100%" height="500" />

上板验证

## 5.4 冒险与 stall

### 原理

根据 ppt 内容，了解冒险与 stall 的相关原理和实现方法。==本实验统一采用 stall 的方式解决冒险==

### stall

新建 `stall.v` 源文件，根据 ppt 内容和冒险的检测条件，编写 verilog 代码

> ppt 上默认数据冒险时 WB 阶段和 ID 阶段可以在同一周期内运行（前半段写回，后半段取值），但我在实现时，不知道哪里写的有问题还是怎么样，这样做有问题。经过仿真调试，我在 stall 模块中，又添加了一个冒险检测条件，即 `Rd_addr_out_MemWB == Rs1_addr_ID` `Rd_addr_out_MemWB == Rs2_addr_ID`（也就是 CPU 要额外再 stall 一个周期），之后，仿真运行正常
>
> 同学们可以根据具体情况，根据仿真波形图，来调整模块内容

### IF_reg_ID

修改 `IF_reg_ID.v`，根据 ppt 内容，增加相关变量

> 由于我的实现有上述的问题，所以这里我不好给出提示

### ID

修改 `ID.v`，根据 ppt 内容，增加相关变量

### ID_reg_EX

修改 `IF_reg_EX.v`，根据 ppt 内容，增加相关变量

### EX_reg_MEM

修改 `EX_reg_MEM.v`，根据 ppt 内容，增加相关变量

### MEM_reg_WB

修改 `MEM_reg_WB.v`，根据 ppt 内容，增加相关变量

### Pipeline_CPU

修改 `Pipeline_CPU.v`，根据连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab5/lab5_doc8.pdf" type="application/pdf" width="100%" height="500" />

### 仿真验证

### 上板验证