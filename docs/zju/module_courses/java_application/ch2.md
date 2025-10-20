# 2 Basic

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Data Type and Wrapper Class

### 1.1 Primitive Type

| Type | Storage | Min Value | Max Value |
| -- |  -- |  -- |  -- |
| byte | 1 byte | -128 | 127 |
| short | 2 byte | -32768 | 32767 |
| int | 4 byte | -2147483648 | 2147483647 |
| long | 8 byte | -9,223,372,036,854,775,808 | -9,223,372,036,854,775,808 |
| float | 4 byte | Approximately –3.4E+38 with 7significant digits | Approximately 3.4E+38 with 7significant digits |
| double | 8 byte | Approximately –1.7E+308 with15 significant digits | Approximately 1.7E+308 with15 significant digits |

- `boolean`: `true`, `false`
- `char`: 2 byte, Unicode-16

```java linenums="1" title="特殊格式"
145_345.23  // 可以使用下划线来分割位，便于阅读
0b11001011  // 0b 开头表示二进制数
```

基本数据类型的局部变量存储在 stack 中

!!! tip "`float` 类型"

    初始化 `float` 类型的变量时，必须要在数字后面加上 `f` 后缀，或者显式类型转换。因为如果只是数字的话，其类型是 `double`，将 `double` 赋给 `float` 变量需要显式类型转换
    
    ```java linenums="1"
    float a = 2.0f;
    float b = (float) 2.0;
    ```

### 1.2 Wrapper Class

Wrapper Class 是将基本数据类型封装成对象的类，位于 `java.lang` 包中

| 基本数据类型 | 包装类 |
| -- | -- |
| byte | Byte |
| short | Short |
| int | Integer |
| long | Long |
| float | Float |
| double | Double |
| char | Character |
| boolean | Boolean |

!!! tip "为什么需要 Wrapper Class"

    大多数情况我们需要操作一个对象，而基本类型不是一个对象
    
    ```java linenums="1" title="创建包装类对象"
    // 集合只能存储对象，不能存储基本类型
    List<Integer> list = new ArrayList<>();
    list.add(10);
    ```

!!! quote ""

    所有包裹类型的 `public` 构造器在 JDK 16 中正式移除

```java linenums="1" title="创建包装类对象"
// 构造方法（已过时，不推荐使用）
Integer i1 = new Integer(100);     // 已过时
Integer i2 = new Integer("200");   // 已过时

// 推荐使用valueOf()方法
Integer i3 = Integer.valueOf(100);
Integer i4 = Integer.valueOf("200");
Integer i5 = Integer.valueOf("1010", 2); // 二进制转十进制

// 自动装箱（最常用，语法糖，底层仍调 valueOf）
Integer i6 = 300;
```

Autoboxing 和 Unboxing

```java linenums="1"
// 基本类型自动转换为包装类对象
Integer i = 10;        // 相当于 Integer i = Integer.valueOf(10);
Double d = 3.14;       // 相当于 Double d = Double.valueOf(3.14);
Boolean b = true;      // 相当于 Boolean b = Boolean.valueOf(true);
```

```java linenums="1"
// 包装类对象自动转换为基本类型
Integer i = 100;
int num = i;           // 相当于 int num = i.intValue();

Double d = 2.5;
double value = d;      // 相当于 double value = d.doubleValue();
```

### 1.3 预生成对象

预生成对象是 Java 在类加载时预先创建并缓存的对象实例，主要用于提高性能和减少内存开销

| 包装类 | 预生成对象 |
| -- | -- |
| Integer | -128 ~ 127 |
| Boolean | true, false |
| Character | 0 ~ 127 |
| Byte | 全部 256 个值 |

此外还有：字符串常量池（String Pool）等

```java linenums="1"
Integer a = 100;  // 使用缓存对象
Integer b = 100;  // 使用同一个缓存对象
Integer c = 200;  // 超出缓存范围，新建对象
Integer d = 200;  // 超出缓存范围，新建对象

System.out.println(a == b); // true - 同一个对象
System.out.println(c == d); // false - 不同对象
System.out.println(a.equals(b)); // true - 值相等
```

```java linenums="1"
String s1 = "hello";          // 字符串常量池
String s2 = "hello";          // 同一个常量池对象
String s3 = new String("hello"); // 堆中新对象
String s4 = s3.intern();      // 放入常量池或返回已有对象

System.out.println(s1 == s2); // true
System.out.println(s1 == s3); // false
System.out.println(s1 == s4); // true
```

## 2 String

`String` 是 Java 提供的字符串类，位于 `java.lang` 包中

`String` 对象不可变（immutable）：一旦创建，内容不能更改。任何修改操作都会生成新的字符串对象

字符串常量池：Java 会自动维护一个字符串常量池，相同内容的字符串字面量只会有一份

```java linenums="1" title="创建字符串"
String s1 = "hello";                   // 字面量，存于常量池
String s2 = new String("hello");       // 显式创建新对象，存于堆
```

---

```java linenums="1"
String s;
```

此时，内存中还没有创建一个新的字符串对象，它只是在栈内存中创建了一个名为 `s` 的引用变量，这个引用变量 `s` 的初始值是 `null`，意味着它还没有指向任何有效的字符串对象

要让它变得有用，必须让它指向一个具体的对象

```java linenums="1"
String s = new String("a string");
```

!!! tip "C++"

    ```cpp linenums="1"
    string s;
    ```
    
    这一行代码执行后，一个完整的 `string` 对象已经被构造出来了。内存已经分配，对象已经处于可用的状态
    
    在创建对象 `s` 的同时，C++ 会自动调用 `std::string` 的默认构造函数，默认构造函数会将对象初始化为一个空字符串（即 `""`）

---

String block：起止各一行 `"""`，单独占一行。具体内容自动去掉公共前缀空白，保留相对缩进

```java linenums="1"
String html = """
              <html>
                <body>
                  <p>hello world</p>
                </body>
              </html>
              """;
```

### 2.1 String 方法

| 方法 | 功能 | 说明 |
| -- | -- | -- |
| `int length()` | 获取字符串的长度 | |
| `char charAt(int index)` | 获取指定位置的字符 |  |
| `boolean isEmpty()` | 判断字符串是否为空 |  |
| `String substring(int beginIndex, int endIndex)` | 截取子串 | 左闭右开 |
| `boolean equals(Object another)` | 判断内容是否相等 |  |
| `boolean equalsIgnoreCase(String another)` | 忽略大小写判断内容是否相等 |  |
| `int indexOf(String str)` | 查找子串首次出现的位置 | 如果没有找到，返回 `-1` |
| `int indexOf(String str, int index)` | 查找指定子串在当前字符串中从指定位置开始首次出现的位置 | 如果没有找到，返回 `-1` |
| `int lastIndexOf(String str)` | 查找子串最后一次出现的位置 |  |
| `String toUpperCase()` | 转为大写 |  |
| `String toLowerCase()` | 转为小写 |  |
| `String trim()` | 去除首尾空白字符 |  |
| `boolean startsWith(String prefix)` | 判断是否以指定前缀开头 |  |
| `boolean endsWith(String suffix)` | 判断是否以指定后缀结尾 |  |
| `String replace(CharSequence target, CharSequence replacement)` | 替换子串 |  |
| `String[] split(String regex)` | 按指定规则分割字符串 |  |
| `String join(CharSequence delimiter, CharSequence... elements)` | 合并字符串  | |
| `boolean contains(CharSequence s)` | 判断是否包含子串 |  |
| `String concat(String str)` | 拼接字符串 |  |

#### 2.1.1 字符串拼接

```java linenums="1"
String s = "Hello, " + "World!";       // 编译期优化
int age = 20;
String info = "年龄：" + age;           // 自动转为字符串
```

多次拼接建议用 `StringBuilder` 或 `StringBuffer`，效率更高

```java linenums="1"
StringBuilder sb = new StringBuilder();
sb.append("Hello, ");
sb.append("World!");
String result = sb.toString();
```

!!! tip "拼接顺序"

    ```java linenums="1"
    jshell> 1 + 2 + "age"
    $1 ==> "3age"
    
    jshell> "age" + 1 + 2
    $2 ==> "age12"
    ```

#### 2.1.2 字符串与基本类型转换

基本类型转字符串：

```java linenums="1"
int n = 123;
String s = String.valueOf(n);          // 推荐
String s2 = n + "";                    // 也可
```

字符串转基本类型：

```java linenums="1"
int n = Integer.parseInt("123");
n = Integer.valueOf("123");  // valueOf() 也可以
double d = Double.parseDouble("3.14");
```

#### 2.1.3 字符串比较

`==` 比较的是引用（地址），不是内容

内容比较用 `equals()`

```java linenums="1"
String a = "abc";
String b = new String("abc");
System.out.println(a == b);            // false
System.out.println(a.equals(b));       // true
```

#### 2.1.4 字符串分割与合并

```java linenums="1"
String s = "a,b,c";
String[] arr = s.split(",");           // 分割
String joined = String.join("-", arr); // 合并
```

### 2.2 `toString()`

`toString()` 是 Java 中所有类（包括自定义类）都继承自 `Object` 类的一个方法

`toString()` 方法用于返回对象的字符串表示，常用于调试、打印对象信息等场景

默认实现：`Object` 类中的 `toString()` 返回的是“类名@哈希码”的字符串，不直观

```java linenums="1"
Object obj = new Object();
System.out.println(obj.toString()); // 例如：java.lang.Object@1b6d3586
```

通常会在自定义类中重写 `toString()`，让其输出更有意义的信息

```java linenums="1"
public class Person {
    String name;
    int age;
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}
```

当对象作为参数传递给 `System.out.println()`、字符串拼接等场景时，会自动调用 `toString()` 方法

```java linenums="1"
Person p = new Person();
p.name = "Tom";
p.age = 18;
System.out.println(p); // 自动调用 p.toString()
```

## 3 StringBuffer

`StringBuffer` 是 Java 提供的可变字符串类，位于 `java.lang` 包中

与 `String` 不同，`StringBuffer` 的内容可以修改，适合频繁拼接、插入、删除字符串的场景

线程安全（方法带有同步锁），适合多线程环境


```java linenums="1"
StringBuffer sb1 = new StringBuffer();           // 空缓冲区
StringBuffer sb2 = new StringBuffer("hello");    // 指定初始内容
```

!!! tip "StringBuffer 与 StringBuilder"

    - StringBuffer：线程安全，适合多线程（同步），速度略慢
    - StringBuilder：非线程安全，适合单线程（不同步），速度更快

### 3.1 StringBuffer 方法

| 方法 | 功能 | 说明 |
| -- | -- | -- |
| `int length()` | 获取字符串长度 | |
| `char charAt(int index)` | 获取指定位置字符 | |
| `StringBuffer append(xxx)` | 追加内容到末尾 | 支持多种类型，返回自身 |
| `StringBuffer insert(int offset, xxx)` | 在指定位置插入内容 | 支持多种类型，返回自身 |
| `StringBuffer delete(int start, int end)` | 删除指定区间内容 | 左闭右开，返回自身     |
| `StringBuffer replace(int start, int end, String str)` | 替换指定区间内容 | 左闭右开，返回自身 |
| `StringBuffer reverse()` | 反转字符串内容 | 返回自身 |
| `void setCharAt(int index, char ch)`| 修改指定位置字符 |  |
| `String toString()` | 转为 String 类型  |  |

## 4 Class

```java linenums="1"
class Main {
    public Main(int i) {
        _i = i;
    }

    private int _i;
}
```

1. 最后的 `}` 后面没有 `;`
2. Java 的作用域修饰符和 C++ 不同
3. 构造函数没有初始化列表

在 Java 中，对象赋值实际上是引用（reference）的赋值，而不是对象本身的复制

```java linenums="1"
class Person {
    String name;
    int age;
    
    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

public class ObjectAssignment {
    public static void main(String[] args) {
        // 创建对象，p1指向新创建的Person对象
        Person p1 = new Person("Alice", 25);
        
        // 对象赋值：p2和p1指向同一个对象
        Person p2 = p1;
        
        System.out.println(p1 == p2); // true - 指向同一个对象
        System.out.println(p1.name);  // "Alice"
        System.out.println(p2.name);  // "Alice"
        
        // 通过p2修改对象，p1也会受到影响
        p2.name = "Bob";
        System.out.println(p1.name);  // "Bob" - p1也改变了
    }
}
```

### 4.1 成员变量

Java 中，**成员变量** 如果定义时未手动初始化一个值，会自动初始化（0, `false`, `null` 等等）

**1.直接初始化（显示初始化）**

```java linenums="1"
class Measurement {
    boolean b = true;      // 直接赋初值
    char c = 'x';          // 直接赋初值  
    int i = 47;            // 直接赋初值
}
```

1. 成员变量在声明时直接赋予初始值
2. 在对象创建时立即执行

**2.通过对象初始化**

```java linenums="1"
class Depth {
    // 深度类
}

class Measurement2 {
    Depth d = new Depth();  // 通过创建对象初始化
}
```

1. 成员变量通过 `new` 关键字初始化
2. 在类实例化时创建 `Depth` 对象
3. d 引用指向新创建的 `Depth` 实例

**3.方法调用初始化**

```java linenums="1"
class CInit {
    int i = f();  // 先调用f()方法初始化i
    int k = g(i); // 然后使用i的值调用g()方法初始化k
    // 这是正确的，因为i已经初始化
}

class CInitWrong { // 这是错误的！
    int j = g(i);  // 错误：试图使用未初始化的i
    int i = f();   // i的初始化在j之后
}
```

### 4.2 `this`

`this` 可以作为 delegating constructor

```java linenums="1"
public class Foo {
    Foo(int x) {
        System.out.println("x=" + x);
    }

    Foo(int x, int y) {
        this(x);    // 合法，必须是第一条语句
        System.out.println("y=" + y);
    }
}
```

### 4.3 `finalize()`

当垃圾回收器准备释放对象使用的存储空间时，会首先调用其 `finalize()` 方法。但是 `finalize()` 与 C++ 的析构函数完全不同

1. 垃圾回收不是销毁
2. 你的对象可能不会被垃圾回收
3. 垃圾回收只与内存有关

### 4.4 静态成员

##### 静态成员变量

特点：

1. 共享性：所有类的实例共享同一个静态变量。任何一个实例对该变量的修改，都会影响到其他所有实例
2. 生命周期：随着类的加载而创建，随着类的卸载而销毁。其生命周期长于任何对象
3. 存储位置：存储在 JVM 的方法区（Method Area）中

推荐使用类名访问 `ClassName.variableName`，这能清晰地表明它是一个类变量；不推荐使用对象访问 `object.variableName`，因为这容易让人误解为实例变量

##### 静态成员函数

只能直接访问本类的其他静态成员，不能直接访问本类的实例成员

推荐使用类名调用

##### 静态代码块

执行时机：在类第一次被加载到 JVM 时执行，且只执行一次

```java linenums="1"
class Config {
    public static final String DB_URL;
    public static final String DB_USER;

    // 静态代码块
    static {
        System.out.println("Static block is executing...");
        // 复杂的初始化逻辑
        DB_URL = "jdbc:mysql://localhost:3306/mydb";
        DB_USER = "root";
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Main method started.");
        // 第一次访问 Config 类的静态成员时，会触发静态代码块的执行
        System.out.println("DB URL: " + Config.DB_URL);
        System.out.println("DB URL again: " + Config.DB_URL); // 静态代码块不会再次执行
    }
}
```

##### 静态内部类

1. 被 `static` 修饰的内部类
2. 它不持有外部类实例的引用
3. 可以像普通类一样拥有自己的静态成员和实例成员
4. 只能访问外部类的静态成员

### 4.5 `Class` 类

> 一个叫 `java.lang.Class` 的类

在 Java 中，每个类在编译后都会生成一个对应的 `Class` 对象。这个 `Class` 对象包含了该类的元数据（如类名、方法、字段、父类等信息），这些信息被存储在磁盘上一个与类同名的 `.class` 文件中

当程序运行时，如果需要创建某个类的实例，Java 虚拟机首先会检查该类的 `Class` 对象是否已经被加载到内存中。如果还没有被加载，JVM 会通过类加载器找到对应的 `.class` 文件，将其加载到内存中，并创建这个 `Class` 对象

### 4.6 初始化顺序

类加载的时机：

1. 创建第一个对象时
2. 访问静态成员时
3. `Class.forName()` 显式加载时

类成员初始化顺序：

1. 静态变量，静态块（类加载时，只一次）
2. 实例变量，实例初始化块（每次创建对象时）
3. 构造函数（每次创建对象时）

```java linenums="1"
class Dog {
    // 1. 静态变量
    private static String staticVar1 = initStatic1();
    private static String staticVar2;
    
    // 2. 静态初始化块
    static {
        System.out.println("静态初始化块执行");
        staticVar2 = "静态变量2";
    }
    
    // 3. 实例变量
    private String name = initName();
    private int age;
    private String breed = "未知品种";
    
    // 4. 实例初始化块
    {
        System.out.println("实例初始化块执行");
        age = 1;  // 默认年龄
    }
    
    // 静态方法
    private static String initStatic1() {
        System.out.println("初始化静态变量1");
        return "静态变量1";
    }
    
    // 实例方法
    private String initName() {
        System.out.println("初始化name字段");
        return "未命名";
    }
    
    // 构造函数
    public Dog() {
        System.out.println("无参构造函数执行");
    }
    
    public Dog(String name, String breed) {
        this();  // 调用无参构造函数（必须第一句）
        System.out.println("有参构造函数执行");
        this.name = name;
        this.breed = breed;
    }
    
    public static void staticMethod() {
        System.out.println("静态方法被调用");
    }
}

public class TestInitializationOrder {
    public static void main(String[] args) {
        System.out.println("=== 第一次创建对象 ===");
        Dog.staticMethod();  // 触发类加载和静态初始化
        
        System.out.println("=== 创建第一个Dog对象 ===");
        Dog dog1 = new Dog("旺财", "金毛");
        
        System.out.println("=== 创建第二个Dog对象 ===");
        Dog dog2 = new Dog("小黑", "拉布拉多");
    }
}
```

```java linenums="1" title="output"
=== 第一次创建对象 ===
初始化静态变量1
静态初始化块执行
静态方法被调用
=== 创建第一个Dog对象 ===
初始化name字段
实例初始化块执行
无参构造函数执行
有参构造函数执行
=== 创建第二个Dog对象 ===
初始化name字段
实例初始化块执行
无参构造函数执行
有参构造函数执行
```

## 5 数据传递

基本数据类型的传递

```java linenums="1"
void f(int n) {
    n = 9;          // 修改的是副本，不影响原始值
}

int k;
k = 10;
f(k);               // 传递的是k的值的副本
```

引用类型的传递

```java linenums="1"
class Number {
    public int i;    // 实例变量
}

void f(Number n) {
    n.i = 9;         // 通过引用修改对象内容
}

Number k = new Number();
k.i = 10;
f(k);               // 传递的是对象引用的副本

// 最后 k.i 等于 9
```

## 6 Switch 表达式

```java linenums="1"
public class ModernSwitch {
    public static void main(String[] args) {
        int day = 3;
        
        String dayType = switch (day) {
            case 1, 2, 3, 4, 5 -> "工作日";
            case 6, 7 -> "周末";
            default -> "无效日期";
        };
        
        System.out.println(dayType); // 工作日
    }
}
```

箭头语法 `->`：不需要 `break`

如果需要写复杂逻辑的返回值，使用 `yield` 关键字

```java linenums="1"
public class YieldKeyword {
    public static void main(String[] args) {
        int score = 85;
        
        String grade = switch (score / 10) {
            case 10, 9 -> "A";
            case 8 -> {
                if (score >= 85) {
                    yield "B+";
                } else {
                    yield "B";
                }
            }
            case 7 -> "C";
            case 6 -> "D";
            default -> "F";
        };
        
        System.out.println("成绩等级: " + grade); // 成绩等级: B+
    }
}
```

当然也可以作为语句使用，无返回值

```java linenums="1"
public class VoidSwitch {
    public static void processCommand(String command) {
        // 作为语句使用，不返回值
        switch (command) {
            case "start" -> System.out.println("启动系统");
            case "stop" -> System.out.println("停止系统");
            case "restart" -> {
                System.out.println("停止系统");
                System.out.println("启动系统");
            }
            default -> System.out.println("未知命令");
        }
    }
    
    public static void main(String[] args) {
        processCommand("restart");
    }
}
```

## 7 Package

Package 是 Java 语言中用于组织和管理类与接口的核心机制

主要作用：

1. 避免命名冲突：不同包中可以存在同名类
2. 组织和管理类：将功能相似或相关的类/接口组织在一起，使项目结构更清晰
3. 提供访问控制：配合访问权限修饰符（如 `protected` 和默认包权限），可以控制类成员的可见性
4. 便于部署和维护：良好的包结构是大型项目可维护性的基础

### 7.1 命名

命名规则（必须遵守）：

1. 由小写字母、数字、`_`、`$` 和 `.` 组成
2. 不能以数字或点开头
3. 不能是 Java 的关键字或保留字

命名规范（约定俗成，强烈建议遵守）：

1. 全部使用小写字母
2. 使用公司域名的倒序作为包的前缀，以确保全球唯一性

    - 例如，公司域名为 `google.com`，包前缀应为 `com.google`

3. 后续部分根据项目或模块命名

    - 例如：`com.google.gson`, `org.springframework.boot`

4. 点（`.`）表示层级关系，对应文件系统的目录结构

    - 包 `com.example.util` 对应的目录路径是 `com/example/util/`

### 7.2 声明

在每个 Java 源文件（`.java`）的顶部，使用 `package` 关键字来声明该文件中所有类所属的包

```java linenums="1" title="com/example/math/Calculator.java"
// 声明这个类在 com.example.math 包中
package com.example.math;

public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

1. 一个 `.java` 文件中最多只能有一条 `package` 语句（除注释外必须是第一行）
2. 如果没有 `package` 语句，该类则属于默认包（default package）。在小型测试程序中可以这样做，但在正式项目中强烈不推荐使用默认包

### 7.3 `import` 语句

当需要在一个类中使用其他包中的类时，就需要使用 `import` 语句来引入该类

```java linenums="1" title="com/example/math/Calculator.java"
import 包名.类名;   // 导入单个类
import 包名.*;     // 导入整个包下的所有类（不包含子包）
```

**1.使用完全限定名**

```java linenums="1"
package com.example.app;

public class Main {
    public static void main(String[] args) {
        // 直接使用类的完全限定名
        com.example.math.Calculator calc = new com.example.math.Calculator();
        System.out.println(calc.add(5, 3));
    }
}
```

**2.使用 `import` 导入单个类**（推荐）

```java linenums="1"
package com.example.app;

// 导入特定的类
import com.example.math.Calculator;

public class Main {
    public static void main(String[] args) {
        // 可以直接使用类名
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));
    }
}
```

**3.使用 `import` 导入整个包**（谨慎使用）

```java linenums="1"
package com.example.app;

// 导入 com.example.math 包下的所有类
import com.example.math.*;

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));
    }
}
```

#### 7.3.1 特殊导入

##### 静态导入

用于导入类的静态成员（静态变量和静态方法），之后可以直接使用静态成员名，而无需通过类名调用

```java linenums="1"
package com.example.app;

// 静态导入 Math 类的所有静态成员
import static java.lang.Math.*;

public class StaticImportExample {
    public static void main(String[] args) {
        // 无需写 Math.PI 和 Math.sqrt()
        double radius = 5.0;
        double area = PI * pow(radius, 2);
        System.out.println("面积是: " + area);
    }
}
```

使用静态导入需谨慎，过度使用会降低代码可读性

##### 无需 `import` 的包

1. 同一个包中的类：互相使用无需导入
2. `java.lang` 包：这是 Java 最核心的包，编译器会自动导入

#### 7.3.2 与其他语言的区别

| 编程语言 | 语法示例 | 实现方式 |
| :--: | :--: | :--: |
| **C / C++** | `#include <stdio.h>` | **文本插入**：预处理器直接将头文件内容插入源代码<br/>编译时只检查函数/变量的 **声明（原型）**，链接时再结合编译后的二进制代码 |
| **Java** | `import java.util.Scanner;` | **装载类**：通过反射（RTTI）机制在运行时获取类的信息<br/>编译和运行时都需要编译后的 `.class` 二进制文件，且会自动编译依赖项 |
| **Python** | `import Pandas` | **装载并运行模块文件**：直接加载并执行 `Pandas.py` 文件<br/>需要源代码可见（或已编译的 `.pyc` 文件），依赖源码或字节码 |

### 7.4 `CLASSPATH`

`CLASSPATH` 是告诉 Java 虚拟机（JVM）和 Java 编译器（如 `javac`）去哪里查找用户自定义的类、包和资源文件的环境变量或参数

当 Java 需要加载一个类时，它就会去 `CLASSPATH` 指定的路径列表里寻找对应的 `.class` 文件或包含该类的 `.jar` 文件

## 8 Access Control

默认权限（包权限）：如果一个类或成员没有指定任何修饰符，那么它对同一个包内的其他类是可见的，但对不同包的类是不可见的。这体现了包在封装性中的作用

| 修饰符 | 同一个类 | 同一个包 | 不同包的子类 | 不同包的非子类 |
| -- | -- | -- | -- | -- |
| `public` | ✅ | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| 默认（无修饰符） | ✅ | ✅ | ❌ | ❌ |
| `private` | ✅ | ❌ | ❌ | ❌ |

### 8.1 `final` 关键字

`final` 关键字用于表示"不可变性"

1. final 字段：必须被初始化（可以在声明时或构造方法中）。一旦赋值，就不能再修改。对于基本类型，值不变；对于引用类型，引用指向的对象不变（但对象内部的状态可能可以改变）
2. final 方法：主要目的是防止子类重写该方法以改变其行为，保证父类的某些关键逻辑得以保留。早期版本中，`final` 方法也有助于提高内联调用效率，但现代 JVM 已能自动优化
3. final 类：通常出于安全或设计目的，防止他人通过继承来创建子类，从而可能破坏该类的完整性或设计意图。Java 标准库中的 `String`、`Integer` 等类都是 `final` 的

```java linenums="1"
final int MAX_VALUE = 100;
final StringBuilder sb = new StringBuilder("Hello");
// MAX_VALUE = 200; // 错误：不能修改final基本类型
// sb = new StringBuilder("World"); // 错误：不能修改final引用
sb.append(" World"); // 正确：可以修改对象内部的状态
```