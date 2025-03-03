# Lab 2: CPU 调试 SOC 系统设计

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! warning "注意"

    1. 官方 ppt 部分内容存在错误，请注意辨别
    2. 具体的 verilog 代码请先根据官方 ppt 自行完成，本文档不提供全部的 verilog 代码，仅作参考和提示作用
    3. 本文档为个人经验，具体情况具体分析

## 实验目标

完成 SOC 系统设计，便于后续实验 CPU 的调试

## 准备工作

1. 保存课件中的 `I_mem.coe` 到 `comp_organ/lab2_instr_mem.coe`
2. 保存课件中的 `font_8x16.mem` `vga_debugger.mem` 到 `comp_organ/` 目录下
3. 保存课件中的 `Seg7_Dev` 文件夹（此文件夹包含一个 IP 核）到 `comp_organ/IP/lab2/` 目录下
4. 保存课件中的 5 个 VGA 模块文件 `Hex2Ascii.v` `VGA.v` `VgaController.v` `VgaDDebugger.v` `VgaDisplay.v` 到 `comp_organ/VGA` 目录下（不建议调用不含源文件的 IP 核 `VGA.edf`，因为后续我们会修改这些 VGA 源文件）
5. 保存课件中的这些 `.edf` `.v` 文件（两者需配套调用），包括 `clk_div` `Counter_x` `MIO_BUS` `Multi_8CH32` `SAnti_jitter` `SCPU` `SPIO`，到 `comp_organ/IP/lab2` 目录下
6. RAM 和 ROM 建议自行生成，初始化文件详见[下文](#调用模块)

在后续的实验中，我们会替换 SCPU 为我们自己设计的 CPU，进行上板验证

> 注：此工程文件无法进行仿真，因为包含不含源文件的 IP 核

## 2.1 SOC 系统设计

在目录 `comp_organ/project/` 下创建工程文件，命名为 `lab2_CSSTE`

### 调用模块

导入以下文件：

1. `clk_div.v` `clk_div.edf`
2. `SAnti_jitter.v` `SAnti_jitter.edf`
3. `Counter_x.v` `Counter_x.edf`
4. `MIO_BUS.v` `MIO_BUS.edf`
5. `Multi_8CH32.v` `Multi8CH32.edf`
6. `SPIO.v` `SPIO.edf`
7. `SCPU.v` `SCPU.edf`
8. 5 个 VGA 文件：`Hex2Ascii.v` `VGA.v` `VgaController.v` `VgaDDebugger.v` `VgaDisplay.v`
9. `font_8x16.mem` `vga_debugger.mem`

生成以下 IP 核：

1. Seg7_Dev
2. ROM 核（生成方式 lab 0 ppt 中有介绍，初始化文件为 `comp_organ/lab2_instr_mem.coe`）
3. RAM 核（生成方式 lab 0 ppt 中有介绍，初始化文件为 `comp_organ/lab2_data_mem.coe`，自己创建这个文件）

```verilog title="lab2_data_mem.coe" linenums="1"
memory_initialization_radix=16;
memory_initialization_vector=
f0000000,000002AB,80000000,0000003F,00000001,FFF70000,
0000FFFF,80000000,00000000,11111111,22222222,33333333,
44444444,55555555,66666666,77777777,88888888,99999999,
aaaaaaaa,bbbbbbbb,cccccccc,dddddddd,eeeeeeee,FFFFFFFF,
557EF7E0,D7BDFBD9,D7DBFDB9,DFCFFCFB,DFCFBFFF,F7F3DFFF,
FFFFDF3D,FFFF9DB9,FFFFBCFB,DFCFFCFB,DFCFBFFF,D7DB9FFF,
D7DBFDB9,D7BDFBD9,FFFF07E0,007E0FFF,03bdf020,03def820,
08002300;
```

---

模块说明：

1. ROM 核中保存的是机器码，即 RISC-V 指令
2. RAM 核相当于内存，保存着很多数据

### CSSTE 设计

新建 `CSSTE.v` 源文件，作为 top 文件

#### VgaDisplay

修改此模块部分内容，填写正确的 `font_8x16.mem` `vga_debugger.mem` 文件路径

```verilog title="VgaDisplay.v"
-- snip --
initial $readmemh("comp_organ//vga_debugger.mem", display_data);
-- snip --
initial $readmemh("comp_organ//font_8x16.mem", fonts_data);
```

注：具体填入的路径为绝对路径，使用双斜杠 `//`

#### CSSTE

根据模块连接图，编写 verilog 代码

<embed src="../../../../../file/computer_organization/lab2/lab2_doc1.pdf" type="application/pdf" width="100%" height="500" />

简要说明：

1. PC 码为 ROM 核中指令的地址，和平常认为的不同的是，RISC-V 规定，`PC = 0` 表示取第 1 条指令，`PC = 4` 表示取第 2 条指令，`PC = 4(n - 1)` 表示取第 n 条指令。但 Vivado 生成的 ROM 核，输入地址为 n - 1，便是取第 n 条指令。因此观察连接图可以发现，ROM 的输入我们接入的是 `PC[11:2]`，这样就可以正确实现 RISC-V，而且取到的指令也不会错
2. SCPU 每个时钟周期从 ROM 那里读取一个指令，并执行这段指令
3. 如果这段指令是和 RAM 有关的（例如读内存 `lw` 和写内存 `sw`），那么会使用到 RAM 中保存的数据
4. 普通的指令执行完后，SCPU 将 PC 码 + 4，因此下一个时钟周期 SCPU 会读取下一条指令；但如果是跳转指令（如 `bne` `beq` `jal` 等），SCPU 则会计算相应的 PC 码，下一个周期便会读取该 PC 码所对应的指令
5. 若要修改测试代码，可新建 `.coe` 文件并仿照 `comp_organ/lab2_instr_mem.coe` 文件进行编写。之后修改 ROM 的初始化文件即可（或者生成一个新的 ROM）

### 上板验证

说明：

1. 本实验 VGA 上无法显示 32 个寄存器的值，在后续实验中我们将修改 VGA 文件实现此功能
2. 当 `SW[8] = 1` 时，进入手动单步时钟频率模式，拨码 `SW[10]` 输入 STEP，详见 ppt 内容
3. 若自行设计测试代码，注意本实验 SCPU 只能实现以下指令：`add sub and or xor slt sll srl sra sltu addi andi ori xori lw slti sltiu slli srli srai jalr sw beq bne lui jal`