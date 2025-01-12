# Lab 4: 单周期 CPU

!!! tip "说明"

    此文档正在更新中……

!!! warning "注意"

    1. 官方 ppt 部分内容存在错误，请注意辨别
    2. 具体的 verilog 代码请先根据官方 ppt 自行完成，本文档不提供全部的 verilog 代码，仅作参考和提示作用

## 实验内容

1. 利用课件给出的 DataPath 和 Controller，构建 CPU 核
2. 设计 DataPath
3. 设计 Controller
4. 实现指令扩展
5. 实现 CPU 中断处理

## 准备工作

将课件中的 `DataPath.edf` `DataPath.v` `SCPU_ctrl.edf` `SCPU_ctrl.v` 保存到 `comp_organ/IP/lab4` 目录下

## 4.1 构建 CPU 核

`comp_organ/project/`，在此目录下创建工程文件，命名为 `lab4_CPU`

---

新建 `SCPU.v` 源文件，导入文件 `DataPath.edf` `DataPath.v` `SCPU_ctrl.edf` `SCPU_ctrl.v`，根据连接图编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab4/lab4_doc1.pdf" type="application/pdf" width="100%" height="500" />

## 4.2 设计 DataPath

### 原理

根据 ppt 的内容，了解 DataPath 的原理

### PC 模块

新建 `PC.v` 源文件，根据 ppt 内容，编写 verilog 代码

### ImmGen 模块

新建 `ImmGen.v` 源文件，根据 ppt 内容和不同格式立即数扩展规则，编写 verilog 代码

| Instr_type | ImmSel |
| :--: | :--: |
| I-type | 00 |
| S-type | 01 |
| B-type | 10 |
| J-type | 11 |

### DataPath 模块

新建 `my_DataPath.v` 源文件，根据连接图调用相关文件，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab4/lab4_doc2.pdf" type="application/pdf" width="100%" height="500" />

## 4.3 设计 Controller

### 原理

根据 ppt 的内容，了解 Controller 的原理

### Controller 模块

新建 `my_SCPU_ctrl.v` 源文件，根据 ppt 内容和下表，编写 verilog 代码

| instr | opcode | fun3 | fun7 |
| :--: | :--: | :--: | :--: |
| add | 0110011 | 000 | 0000000 |
| sub | 0110011 | 000 | 0100000 |
| slt | 0110011 | 010 | 0000000 |
| xor | 0110011 | 100 | 0000000 |
| srl | 0110011 | 101 | 0000000 |
| or | 0110011 | 110 | 0000000 |
| and | 0110011 | 111 | 0000000 |
| sw | 0100011 | 010 | - |
| beq | 1100011 | 000 | - |
| jal | 1101111 | - | - |
| lw | 0000011 | 010 | - |
| addi | 0010011 | 000 | - |
| slti | 0010011 | 010 | - |
| xori | 0010011 | 100 | - |
| ori | 0010011 | 110 | - |
| andi | 0010011 | 111 | - |
| srli | 0010011 | 101 | 0000000 |

---

| Instr | Branch | Jump | ImmSel | ALUSrc_B | ALU_Control | MemRW | RegWrite | MemtoReg |
| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| add | 0 | 0 | * | 0 | 010 | 0 | 1 | 00 |
| sub | 0 | 0 | * | 0 | 110 | 0 | 1 | 00 |
| and | 0 | 0 | * | 0 | 000 | 0 | 1 | 00 |
| or | 0 | 0 | * | 0 | 001 | 0 | 1 | 00 |
| slt | 0 | 0 | * | 0 | 111 | 0 | 1 | 00 |
| xor | 0 | 0 | * | 0 | 011 | 0 | 1 | 00 |
| srl | 0 | 0 | * | 0 | 101 | 0 | 1 | 00 |
| addi | 0 | 0 | 00 | 1 | 010 | 0 | 1 | 00 |
| slti | 0 | 0 | 00 | 1 | 111 | 0 | 1 | 00 |
| xori | 0 | 0 | 00 | 1 | 011 | 0 | 1 | 00 |
| ori | 0 | 0 | 00 | 1 | 001 | 0 | 1 | 00 |
| andi | 0 | 0 | 00 | 1 | 000 | 0 | 1 | 00 |
| srli | 0 | 0 | 00 | 1 | 101 | 0 | 1 | 00 |
| lw | 0 | 0 | 00 | 1 | 010 | 0 | 1 | 01 |
| sw | 0 | 0 | 01 | 1 | 010 | 1 | 0 | * |
| beq | 1 | 0 | 10 | 0 | 110 | 0 | 0 | * |
| jal | 0 | 1 | 11 | 1 | * | 0 | 1 | 10 |

### 修改寄存器相关模块

修改这些模块，以实现在 VGA 上显示 32 个寄存器的值的效果

思路就是将 32 个寄存器的值从 regs 模块中一路引出来

```verilog title="regs.v" linenums="1"
module regs (
    -- snip --
    output [31:0] x0,
    output [31:0] ra,
    output [31:0] sp,
    output [31:0] gp,
    output [31:0] tp,
    output [31:0] t0,
    output [31:0] t1,
    output [31:0] t2,
    output [31:0] s0,
    output [31:0] s1,
    output [31:0] a0,
    output [31:0] a1,
    output [31:0] a2,
    output [31:0] a3,
    output [31:0] a4,
    output [31:0] a5,
    output [31:0] a6,
    output [31:0] a7,
    output [31:0] s2,
    output [31:0] s3,
    output [31:0] s4,
    output [31:0] s5,
    output [31:0] s6,
    output [31:0] s7,
    output [31:0] s8,
    output [31:0] s9,
    output [31:0] s10,
    output [31:0] s11,
    output [31:0] t3,
    output [31:0] t4,
    output [31:0] t5,
    output [31:0] t6
);

    reg [31:0] registers [1:31];

    -- snip --

    assign x0 = 32'b0;
    assign ra = registers[1];
    assign sp = registers[2];
    assign gp = registers[3];
    assign tp = registers[4];
    assign t0 = registers[5];
    assign t1 = registers[6];
    assign t2 = registers[7];
    assign s0 = registers[8];
    assign s1 = registers[9];
    assign a0 = registers[10];
    assign a1 = registers[11];
    assign a2 = registers[12];
    assign a3 = registers[13];
    assign a4 = registers[14];
    assign a5 = registers[15];
    assign a6 = registers[16];
    assign a7 = registers[17];
    assign s2 = registers[18];
    assign s3 = registers[19];
    assign s4 = registers[20];
    assign s5 = registers[21];
    assign s6 = registers[22];
    assign s7 = registers[23];
    assign s8 = registers[24];
    assign s9 = registers[25];
    assign s10 = registers[26];
    assign s11 = registers[27];
    assign t3 = registers[28];
    assign t4 = registers[29];
    assign t5 = registers[30];
    assign t6 = registers[31];

    -- snip --

endmodule
```

```verilog title="my_DataPath.v" linenums="1"
module my_DataPath (
    -- snip --
    output [31:0] x0,
    output [31:0] ra,
    output [31:0] sp,
    output [31:0] gp,
    output [31:0] tp,
    output [31:0] t0,
    output [31:0] t1,
    output [31:0] t2,
    output [31:0] s0,
    output [31:0] s1,
    output [31:0] a0,
    output [31:0] a1,
    output [31:0] a2,
    output [31:0] a3,
    output [31:0] a4,
    output [31:0] a5,
    output [31:0] a6,
    output [31:0] a7,
    output [31:0] s2,
    output [31:0] s3,
    output [31:0] s4,
    output [31:0] s5,
    output [31:0] s6,
    output [31:0] s7,
    output [31:0] s8,
    output [31:0] s9,
    output [31:0] s10,
    output [31:0] s11,
    output [31:0] t3,
    output [31:0] t4,
    output [31:0] t5,
    output [31:0] t6
);
    
    -- snip --

    regs regs_0 (
        -- snip --
        .x0(x0),
        .ra(ra),
        .sp(sp),
        .gp(gp),
        .tp(tp),
        .t0(t0),
        .t1(t1),
        .t2(t2),
        .s0(s0),
        .s1(s1),
        .a0(a0),
        .a1(a1),
        .a2(a2),
        .a3(a3),
        .a4(a4),
        .a5(a5),
        .a6(a6),
        .a7(a7),
        .s2(s2),
        .s3(s3),
        .s4(s4),
        .s5(s5),
        .s6(s6),
        .s7(s7),
        .s8(s8),
        .s9(s9),
        .s10(s10),
        .s11(s11),
        .t3(t3),
        .t4(t4),
        .t5(t5),
        .t6(t6)
    );

    -- snip --

endmodule
```

```verilog title="SCPU.v" linenums="1"
module SCPU (
    -- snip --
    output [31:0] x0,
    output [31:0] ra,
    output [31:0] sp,
    output [31:0] gp,
    output [31:0] tp,
    output [31:0] t0,
    output [31:0] t1,
    output [31:0] t2,
    output [31:0] s0,
    output [31:0] s1,
    output [31:0] a0,
    output [31:0] a1,
    output [31:0] a2,
    output [31:0] a3,
    output [31:0] a4,
    output [31:0] a5,
    output [31:0] a6,
    output [31:0] a7,
    output [31:0] s2,
    output [31:0] s3,
    output [31:0] s4,
    output [31:0] s5,
    output [31:0] s6,
    output [31:0] s7,
    output [31:0] s8,
    output [31:0] s9,
    output [31:0] s10,
    output [31:0] s11,
    output [31:0] t3,
    output [31:0] t4,
    output [31:0] t5,
    output [31:0] t6
);

    -- snip --

    my_DataPath my_DataPath_0(
        -- snip --
        .x0(x0),
        .ra(ra),
        .sp(sp),
        .gp(gp),
        .tp(tp),
        .t0(t0),
        .t1(t1),
        .t2(t2),
        .s0(s0),
        .s1(s1),
        .a0(a0),
        .a1(a1),
        .a2(a2),
        .a3(a3),
        .a4(a4),
        .a5(a5),
        .a6(a6),
        .a7(a7),
        .s2(s2),
        .s3(s3),
        .s4(s4),
        .s5(s5),
        .s6(s6),
        .s7(s7),
        .s8(s8),
        .s9(s9),
        .s10(s10),
        .s11(s11),
        .t3(t3),
        .t4(t4),
        .t5(t5),
        .t6(t6)
    );

    -- snip --

endmodule
```

### 搭建仿真平台

替换 4.1 中的 DataPath 和 Controller 模块为 4.2 和 4.3 自己设计的

> 原来的几个文件可以右键点击 ^^Disable File^^ 停用，之后若要启用右键点击 ^^Enable File^^ 即可

新建 `SCPU_top.v` 模块，根据连接图生成相应的 IP 核，编写 verilog 代码

<figure markdown="span">
    ![Img 1](../../../../img/computer_organization/lab/lab4/lab4_img1.png){ width="800" }
</figure>

再次说明：

1. ROM 核中存放机器码，即指令
2. RAM 核相当于内存

### 仿真验证

新建 `SCPU_top_tb.v` testbench 文件

```verilog title="SCPU_top_tb.v" linenums="1"
module SCPU_top_tb();
    reg clk;
    reg rst;

    SCPU_top my_SCPU_top (
        .clk(clk),
        .rst(rst)
    );

    always begin
        #5 clk = ~clk;
    end

    initial begin
        clk = 1'b0;
        rst = 1'b1;
        #10;
        rst = 1'b0;
    end

endmodule
```

根据 ppt，仿真后，添加需要的变量到窗口，点击 Relaunch Simulate 按钮

<figure markdown="span">
    ![Img 2](../../../../img/computer_organization/lab/lab4/lab4_img2.png){ width="400" }
</figure>

仿真确认无误后，将 `SCPU_top.v` 文件，ROM 和 RAM 右键停用，封装此工程文件为 IP 核到 `comp_organ/IP/lab4`，但在封装前，建议先综合一下，并检查报错信息（包括黄色的报错），确认没有什么语法错误，端口位数不一样，变量名打错了等等的错误（其实仿真前最好也综合一下，把一些问题先排除掉）

> 即使仿真结果正确，也可能存在一些问题导致后续综合、实现报错

### 上板验证

!!! warning "注意"

    由于未知原因，上板验证时，凡是涉及 RAM 的指令（如 `lw` `sw` 等）均运行不正确。如果遇到此问题无法解决，可以尝试将 RAM 替换为一个模块，此模块通过创建一个大数组以达到类似 RAM 的效果

    > 我们验收可以仿真验收，也可以上板验收，我也遇到了这个问题，懒得弄了，就仿真验收了

打开 lab 2 工程文件，生成调用 lab 4.3 SCPU 的 IP 核，替换掉原来的 SCPU 文件

> 如果觉得封装为 IP 核再调用太麻烦，你可以直接在 lab 2 工程文件里导入 SCPU 的源文件进行编辑

修改 VGA 相关模块，以实现在 VGA 上显示 32 个寄存器的值的效果

```verilog title="CSSTE.v" linenums="1"
-- snip --
    wire [31:0] x0;
    wire [31:0] ra;
    wire [31:0] sp;
    wire [31:0] gp;
    wire [31:0] tp;
    wire [31:0] t0;
    wire [31:0] t1;
    wire [31:0] t2;
    wire [31:0] s0;
    wire [31:0] s1;
    wire [31:0] a0;
    wire [31:0] a1;
    wire [31:0] a2;
    wire [31:0] a3;
    wire [31:0] a4;
    wire [31:0] a5;
    wire [31:0] a6;
    wire [31:0] a7;
    wire [31:0] s2;
    wire [31:0] s3;
    wire [31:0] s4;
    wire [31:0] s5;
    wire [31:0] s6;
    wire [31:0] s7;
    wire [31:0] s8;
    wire [31:0] s9;
    wire [31:0] s10;
    wire [31:0] s11;
    wire [31:0] t3;
    wire [31:0] t4;
    wire [31:0] t5;
    wire [31:0] t6;

    -- snip --

    SCPU SCPU_0(
        -- snip --
        .x0(x0),
        .ra(ra),
        .sp(sp),
        .gp(gp),
        .tp(tp),
        .t0(t0),
        .t1(t1),
        .t2(t2),
        .s0(s0),
        .s1(s1),
        .a0(a0),
        .a1(a1),
        .a2(a2),
        .a3(a3),
        .a4(a4),
        .a5(a5),
        .a6(a6),
        .a7(a7),
        .s2(s2),
        .s3(s3),
        .s4(s4),
        .s5(s5),
        .s6(s6),
        .s7(s7),
        .s8(s8),
        .s9(s9),
        .s10(s10),
        .s11(s11),
        .t3(t3),
        .t4(t4),
        .t5(t5),
        .t6(t6)
    );

    -- snip --

    VGA VGA_0(
        -- snip --
        .x0(x0),
        .ra(ra),
        .sp(sp),
        .gp(gp),
        .tp(tp),
        .t0(t0),
        .t1(t1),
        .t2(t2),
        .s0(s0),
        .s1(s1),
        .a0(a0),
        .a1(a1),
        .a2(a2),
        .a3(a3),
        .a4(a4),
        .a5(a5),
        .a6(a6),
        .a7(a7),
        .s2(s2),
        .s3(s3),
        .s4(s4),
        .s5(s5),
        .s6(s6),
        .s7(s7),
        .s8(s8),
        .s9(s9),
        .s10(s10),
        .s11(s11),
        .t3(t3),
        .t4(t4),
        .t5(t5),
        .t6(t6)
    );

    -- snip --
```

```verilog title="VGA.v" linenums="1"
module VGA (
    -- snip --
    input [31:0] x0,
    input [31:0] ra,
    input [31:0] sp,
    input [31:0] gp,
    input [31:0] tp,
    input [31:0] t0,
    input [31:0] t1,
    input [31:0] t2,
    input [31:0] s0,
    input [31:0] s1,
    input [31:0] a0,
    input [31:0] a1,
    input [31:0] a2,
    input [31:0] a3,
    input [31:0] a4,
    input [31:0] a5,
    input [31:0] a6,
    input [31:0] a7,
    input [31:0] s2,
    input [31:0] s3,
    input [31:0] s4,
    input [31:0] s5,
    input [31:0] s6,
    input [31:0] s7,
    input [31:0] s8,
    input [31:0] s9,
    input [31:0] s10,
    input [31:0] s11,
    input [31:0] t3,
    input [31:0] t4,
    input [31:0] t5,
    input [31:0] t6,
    -- snip --
);

    -- snip --

    VgaDebugger vga_debugger(
        -- snip --
        .x0            (x0               ),
        .ra            (ra               ),
        .sp            (sp               ),
        .gp            (gp               ),
        .tp            (tp               ),
        .t0            (t0               ),
        .t1            (t1               ),
        .t2            (t2               ),
        .s0            (s0               ),
        .s1            (s1               ),
        .a0            (a0               ),
        .a1            (a1               ),
        .a2            (a2               ),
        .a3            (a3               ),
        .a4            (a4               ),
        .a5            (a5               ),
        .a6            (a6               ),
        .a7            (a7               ),
        .s2            (s2               ),
        .s3            (s3               ),
        .s4            (s4               ),
        .s5            (s5               ),
        .s6            (s6               ),
        .s7            (s7               ),
        .s8            (s8               ),
        .s9            (s9               ),
        .s10           (s10               ),
        .s11           (s11              ),
        .t3            (t3               ),
        .t4            (t4               ),
        .t5            (t5               ),
        .t6            (t6               ),
        -- snip --
    );

    -- snip --

endmodule
```

---

综合，实现，生成比特流文件，上板验证