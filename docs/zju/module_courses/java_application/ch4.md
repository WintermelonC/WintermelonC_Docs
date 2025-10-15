# 4 Classes of Other Kinds

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Interface

接口是一个完全抽象的类，用于定义一组行为规范

- 目的：实现多重继承
- 核心思想：定义做什么，而不关心怎么做，具体实现由实现接口的类来完成

在 Java 中，接口只能使用 `public` 或包级私有（默认访问权限）修饰符。不允许使用 `private` 或 `protected` 修饰符来修饰顶层的接口

1. `private`：如果一个接口被声明为 `private`，它将无法被任何其他类访问或实现，这完全违背了接口作为"契约"或"规范"的设计目的。接口的存在就是为了被实现，`private` 访问级别使其失去意义
2. `protected`：`protected` 意味着只有同一包内的类或其子类可以访问。但是接口本身不能被继承（只能被实现），而且接口的"子类"概念不适用于 `protected` 的语义。因此 `protected` 修饰符对接口没有意义

### 1.1 基本语法和特性

!!! info "Java 版本"

    Java 7 及以前

接口只能包含以下两种成员：

1. 常量：

    1. 默认是 `public static final` 的，即使不写这些修饰符，编译器也会自动加上
    2. 必须被显式初始化

2. 抽象方法

    1. 默认是 `public abstract` 的，同样可以省略这些修饰符
    2. 没有方法体（即没有 `{}`）

定义接口：

```java linenums="1"
// 定义一个“开关”接口
public interface Switchable {
    // 常量
    String TYPE = "Electrical Device"; // 等同于 public static final String TYPE = ...;

    // 抽象方法
    void turnOn();  // 等同于 public abstract void turnOn();
    void turnOff(); // 等同于 public abstract void turnOff();
}
```

实现接口：一个类使用 `implements` 关键字来实现一个或多个接口，并必须重写接口中的所有抽象方法

```java linenums="1"
// 灯泡类实现Switchable接口
public class LightBulb implements Switchable {
    // 必须实现（重写）所有抽象方法
    @Override
    public void turnOn() {
        System.out.println("LightBulb is now ON.");
    }

    @Override
    public void turnOff() {
        System.out.println("LightBulb is now OFF.");
    }
}

// 风扇类也实现Switchable接口
public class Fan implements Switchable {
    @Override
    public void turnOn() {
        System.out.println("Fan is spinning.");
    }

    @Override
    public void turnOff() {
        System.out.println("Fan has stopped.");
    }
}
```

使用接口：体现了多态性

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        // 接口引用可以指向实现它的任何类的对象
        Switchable device1 = new LightBulb();
        Switchable device2 = new Fan();

        operateDevice(device1); // 输出：LightBulb is now ON.
        operateDevice(device2); // 输出：Fan is spinning.
    }

    // 方法接收接口类型，任何实现了该接口的对象都可以传入
    public static void operateDevice(Switchable device) {
        device.turnOn();
    }
}
```

### 1.2 高级特性

!!! info "Java 版本"

    Java 8+

Java 8 引入了 **默认方法** 和 **静态方法**，Java 9 引入了 **私有方法**

#### 1.2.1 默认方法

- 目的：在接口中添加新方法时，避免破坏所有已有的实现类。已有的类无需修改也能正常工作
- 语法：使用 `default` 关键字修饰，必须有方法体
- 可以被实现类重写，也可以直接调用

```java linenums="1"
public interface Vehicle {
    void run(); // 传统抽象方法

    // 默认方法
    default void honk() {
        System.out.println("Vehicle is honking!");
    }
}

public class Car implements Vehicle {
    @Override
    public void run() {
        System.out.println("Car is running...");
    }
    // 可以选择不重写honk()方法
}

public class Test {
    public static void main(String[] args) {
        Car car = new Car();
        car.run();  // 输出：Car is running...
        car.honk(); // 输出：Vehicle is honking! (直接使用接口的默认实现)
    }
}
```

#### 1.2.2 静态方法

- 目的：提供与接口相关的工具方法，这些方法不属于任何实例
- 语法：使用 `static` 关键字修饰，必须有方法体
- 调用方式：通过 `接口名.静态方法名` 直接调用，==不能被实现类继承或重写==

```java linenums="1"
public interface MathUtility {
    static int max(int a, int b) {
        return a > b ? a : b;
    }
}

public class Test {
    public static void main(String[] args) {
        int result = MathUtility.max(10, 20); // 通过接口名调用
        System.out.println(result); // 输出：20

        // Car car = new Car();
        // car.max(10,20); // 错误！静态方法不能通过对象实例调用
    }
}
```

#### 1.2.3 私有方法

- 目的：作为默认方法或静态方法的辅助方法，用于抽取公共代码，隐藏实现细节
- 分类：

    - 私有实例方法：使用 `private` 修饰，供默认方法调用
    - 私有静态方法：使用 `private static` 修饰，供静态方法或其他私有静态方法调用

- ==不能被实现类访问或重写==

```java linenums="1"
public interface Logger {
    // 默认方法
    default void logInfo(String message) {
        log("INFO", message);
    }

    default void logError(String message) {
        log("ERROR", message);
    }

    // 私有方法，被上面的默认方法共享
    private void log(String level, String message) {
        System.out.println("[" + level + "] " + java.time.LocalDateTime.now() + ": " + message);
    }

    // 静态方法
    static void printVersion() {
        String version = getVersion();
        System.out.println("Logger Version: " + version);
    }

    // 私有静态方法，被上面的静态方法调用
    private static String getVersion() {
        return "v1.0";
    }
}
```

### 1.3 其他重要规则和用法

#### 1.3.1 接口的继承

接口可以继承多个其他接口，使用 `extends` 关键字。这是一种实现接口功能扩展的方式

```java linenums="1"
public interface Animal {
    void eat();
}

public interface Swimmable {
    void swim();
}

// Flyable 接口继承了 Animal 接口
public interface Flyable extends Animal {
    void fly();
}

// 一个类可以实现多个接口
public class Duck implements Flyable, Swimmable {
    @Override
    public void eat() {
        System.out.println("Duck is eating.");
    }

    @Override
    public void fly() {
        System.out.println("Duck is flying.");
    }

    @Override
    public void swim() {
        System.out.println("Duck is swimming.");
    }
}
```

#### 1.3.2 多实现

一个类可以同时实现多个接口，这是 Java 实现多重继承的主要方式

```java linenums="1"
public class Smartphone implements Switchable, Camera, Computer {
    // 必须实现所有接口中定义的抽象方法
    @Override
    public void turnOn() { ... }

    @Override
    public void turnOff() { ... }

    @Override
    public void takePhoto() { ... }

    @Override
    public void compute() { ... }
}
```

#### 1.3.3 默认方法冲突的解决规则

如果一个类实现了多个接口，而这些接口有同名同参数的默认方法，则实现类必须重写这个默认方法来解决冲突

在重写的方法中，可以通过 `接口名.super.方法名()` 来显式调用指定接口的默认方法

```java linenums="1"
public interface InterfaceA {
    default void method() {
        System.out.println("Interface A");
    }
}

public interface InterfaceB {
    default void method() {
        System.out.println("Interface B");
    }
}

public class MyClass implements InterfaceA, InterfaceB {
    // 必须重写，解决冲突
    @Override
    public void method() {
        // 选择调用 InterfaceA 的默认实现
        InterfaceA.super.method();
        // 或者选择调用 InterfaceB 的
        // InterfaceB.super.method();
        // 或者提供全新的实现
    }
}
```

!!! tip "父类和接口类有重名方法"

    A 类继承 B 类，A 类实现 C 接口，而 B 类和 C 接口有重名的方法
    
    Java 在处理这类问题时遵循一个基本原则：类优先于接口。这意味着，如果一个方法在父类中有具体实现，那么在子类中，这个方法的实现默认来自于父类，而不是接口
    
    ```java linenums="1"
    // 接口C
    interface C {
        void sameMethod(); // 抽象方法
    }
    
    // 类B
    class B {
        // 有具体实现的方法
        public void sameMethod() {
            System.out.println("Method from class B");
        }
    }
    
    // 类A 继承B 实现C
    class A extends B implements C {
        // 不需要重写 sameMethod()！
        // 因为从父类B继承的实现已经满足了接口C的契约
    }
    
    public class Test {
        public static void main(String[] args) {
            A a = new A();
            a.sameMethod(); // 输出: "Method from class B"
            
            // 多态测试
            B bRef = new A();
            bRef.sameMethod(); // 输出: "Method from class B"
            
            C cRef = new A(); 
            cRef.sameMethod(); // 输出: "Method from class B" (仍然调用B的实现)
        }
    }
    ```
    
    如果接口的这个重名方法是默认方法的话，依然是类优先，父类 B 的具体实现会覆盖接口 C 的默认方法
    
    如果 B 类是抽象类，重名方法是抽象方法，C 接口的这个也是抽象方法的话，A 类就需要重写这个方法了，因为 B 类和 C 接口都没有提供具体实现

### 1.4 与抽象类的区别

| 特性 | 接口 | 抽象类 |
| :--: | :--: | :--: |
| **方法类型** | Java 8 前只有抽象方法；之后可以有默认、静态、私有方法 | 可以有抽象方法，也可以有具体实现的方法 |
| **变量/常量** | 只能是 `public static final` 常量 | 可以有各种类型的成员变量（常量、实例变量） |
| **构造方法** | **没有** 构造方法 | **有** 构造方法（用于子类初始化） |
| **设计理念** | **"has-a"关系**，定义行为契约、功能 | **"is-a"关系**，表示一种类别 |
| **多重继承** | 一个类可以实现 **多个** 接口 | 一个类只能继承 **一个** 抽象类 |
| **访问修饰符** | 方法默认 `public` | 方法可以是 `public`, `protected`, `private` 等 |

### 1.5 函数式接口

函数式接口是只有一个抽象方法的接口

```java linenums="1"
// 自定义函数式接口
@FunctionalInterface
public interface MyFunction {
    int operate(int a, int b); // 唯一的抽象方法
    
    // 可以有默认方法
    default void printResult(int result) {
        System.out.println("Result: " + result);
    }
    
    // 可以有静态方法
    static String getType() {
        return "Math Operation";
    }
}
```

`@FunctionalInterface` 注解：

1. 不是必须的，但推荐使用
2. 编译器会检查接口是否符合函数式接口的定义
3. 提供文档说明

Java 内置的核心函数式接口

| 接口 | 方法签名 | 用途 |
| :--: | :--: | :--: |
| `Supplier<T>` | `T get()` | 无参返回结果 |
| `Consumer<T>` | `void accept(T t)` | 消费一个参数 |
| `BiConsumer<T, U>` | `void accept(T t, U u)` | 消费两个参数 |
| `Function<T,R>` | `R apply(T t)` | 转换操作 |
| `BiFunction<T, U, R>` | `R apply(T t, U u)` | 双参数转换操作 |
| `Predicate<T>` | `boolean test(T t)` | 条件判断 |
| `BiPredicate<T, U>` | `boolean test(T t, U u)` | 双参数条件判断 |
| `UnaryOperator<T>` | `T apply(T t)` | 一元运算 |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | 二元运算 |

Java 为了性能，提供了对 `int`、`long`、`double` 的专门版本，例如：`IntPredicate` `IntFunction<R>` 等等

## 2 POJO

**Plain Old Java Object**

一种设计理念，指的是使用普通 Java 语法创建的、不受任何特殊限制和约束的简单 Java 类

特点：

1. 不继承特定的类
2. 不实现特定的接口
3. 不包含特定的注解

```java linenums="1"
// 这是一个典型的 POJO
public class User {

    // 私有字段 (Private Fields)
    private String name;
    private int age;
    private String email;

    // 默认构造方法 (No-argument Constructor)
    public User() {
    }

    // 带参数的构造方法
    public User(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    // Getter 和 Setter 方法 (Public Getters and Setters)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // 可以有自己的业务逻辑方法
    public boolean isAdult() {
        return age >= 18;
    }

    // 可以重写 toString, equals, hashCode 等方法
    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", email='" + email + '\'' +
                '}';
    }
}
```

## 3 record

一个特殊的类

- 目的：用于创建不可变的数据载体，其核心是透明地持有数据
- 设计动机：为了简化那些只用于保存数据、没有复杂业务逻辑的类的编写，避免编写大量模板代码
- 核心思想：让你声明一个类应该持有哪些数据，然后自动获取一个公共的 API

```java linenums="1"
// 声明一个名为 Point 的 record，它持有 x 和 y 两个数据组件
public record Point(int x, int y) {}
```

这一行代码相当于一个包含以下内容的传统类：

```java linenums="1"
public final class Point {
    private final int x;
    private final int y;

    // 规范构造函数
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // 获取组件的方法 (不是传统的getX，而是x())
    public int x() { return this.x; }
    public int y() { return this.y; }

    // equals 和 hashCode
    @Override
    public boolean equals(Object o) {...}
    @Override
    public int hashCode() {...}

    // toString
    @Override
    public String toString() {
        return String.format("Point[x=%d, y=%d]", x, y);
    }
}
```

所以，当声明一个 `record` 时，编译器会自动生成：

1. 私有 `final` 字段：对应你声明的每个组件
2. 公共的访问器方法：方法名与组件名相同（例如 `x()`, `y()`），而不是传统的 `getX()`
3. 一个公共的规范构造函数：参数列表与 `record` 头部声明的组件列表完全一致
4. `equals()` 和 `hashCode()` 方法：基于所有组件值来判断相等性和计算哈希值
5. `toString()` 方法：返回一个包含 `record` 名称和所有组件名称及值的字符串

### 3.1 特性

#### 3.1.1 实例化和使用

```java linenums="1"
public record Point(int x, int y) {}

public class Test {
    public static void main(String[] args) {
        // 实例化
        Point p = new Point(10, 20);
        
        // 使用访问器方法
        System.out.println(p.x()); // 输出: 10
        System.out.println(p.y()); // 输出: 20
        
        // 使用自动生成的 toString
        System.out.println(p); // 输出: Point[x=10, y=20]
        
        // 使用自动生成的 equals 和 hashCode
        Point p2 = new Point(10, 20);
        System.out.println(p.equals(p2)); // 输出: true
    }
}
```

#### 3.1.2 隐式 `final`

`record` 不能被显式地声明为 `abstract`，并且是隐式 `final` 的，不能被继承

#### 3.1.3 可以实现接口

```java linenums="1"
public interface Drawable {
    void draw();
}

public record Point(int x, int y) implements Drawable {
    @Override
    public void draw() {
        System.out.printf("Drawing point at (%d, %d)%n", x, y);
    }
}
```

#### 3.1.4 可以在方法内部声明

record 是隐式 `static` 的，这意味着它们可以嵌套在另一个类中，并且不持有外部类的引用

```java linenums="1"
public class Geometry {
    // 静态嵌套 record
    public static record Point(int x, int y) {}
    
    public void someMethod() {
        // 局部 record (Java 15+)
        record TempData(String name, int value) {}
        
        TempData data = new TempData("test", 42);
        System.out.println(data);
    }
}
```

#### 3.1.5 自定义构造函数

可以自定义构造函数来添加验证逻辑或提供便利

##### 3.5.1 紧凑构造函数

只有参数列表，没有显式的参数声明。适用于简单的参数验证

```java linenums="1"
public record Person(String name, int age) {
    // 紧凑构造函数 - 参数已经隐式存在
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        // 不需要写 this.name = name; this.age = age;
        // 它们会在紧凑构造函数结束时自动赋值
    }
}
```

##### 3.5.2 自定义规范构造函数

参数列表必须与 `record` 组件完全一致

```java linenums="1"
public record Person(String name, int age) {
    // 自定义规范构造函数
    public Person(String name, int age) {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.name = name;
        this.age = age;
    }
}
```

##### 3.5.3 辅助构造函数

可以创建参数不同的便利构造函数

```java linenums="1"
public record Person(String name, int age) {
    // 辅助构造函数 - 必须首先调用 this() 来委托给规范构造函数
    public Person(String name) {
        this(name, 0); // 调用规范构造函数
    }
}
```

#### 3.1.6 自定义方法

可以在 `record` 中添加静态方法、实例方法和静态字段

```java linenums="1"
public record Point(int x, int y) {
    // 静态字段
    private static final Point ORIGIN = new Point(0, 0);
    
    // 静态方法
    public static Point origin() {
        return ORIGIN;
    }
    
    // 实例方法
    public double distanceTo(Point other) {
        int dx = x - other.x;
        int dy = y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 重写自动生成的方法
    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
```

#### 3.1.7 注解的使用

可以对 `record` 的组件应用注解，这些注解会应用到相应的位置

```java linenums="1"
public record Person(
    @NotNull String name,
    @Min(0) int age
) {}
```

### 3.2 限制

1. 不能继承其他类：Record 隐式继承 `java.lang.Record`，而 Java 不支持多重继承
2. 不能被继承：Record 是隐式 `final` 的
3. 组件是隐式 `final` 的：不能在实例方法中修改组件字段
4. 不能声明实例字段：只能使用自动生成的组件字段
5. 不能声明非静态初始化块

### 3.3 适用场景

DTO (Data Transfer Object)

```java linenums="1"
// 用于 API 响应的 DTO
public record ApiResponse<T>(boolean success, String message, T data) {}

// 使用
ApiResponse<User> response = new ApiResponse<>(true, "User found", user);
```

方法返回多个值

```java linenums="1"
public record DivisionResult(int quotient, int remainder) {}

public DivisionResult divide(int dividend, int divisor) {
    return new DivisionResult(dividend / divisor, dividend % divisor);
}
```

复合 Map 键

```java linenums="1"
public record Name(String firstName, String lastName) {}

Map<Name, Person> peopleMap = new HashMap<>();
peopleMap.put(new Name("John", "Doe"), johnDoe);
```

模式匹配（Java 21+）

```java linenums="1"
// 与 instanceof 模式匹配
if (obj instanceof Point(int x, int y)) {
    System.out.println("Point at: " + x + ", " + y);
}

// 与 switch 模式匹配
switch (shape) {
    case Point(int x, int y) -> System.out.println("Point");
    case Circle(Point center, double radius) -> System.out.println("Circle");
    default -> System.out.println("Unknown shape");
}
```

## 4 Enums

枚举是一种特殊的类，用于定义一组固定的常量

- 目的：提供类型安全的常量，替代传统的 `public static final int` 常量
- 核心思想：变量的取值只能来自预定义的有限集合

### 4.1 基本语法和特性

定义一个最简单的枚举

```java linenums="1"
// 定义一个表示星期的枚举
public enum Day {
    SUNDAY,    // 每个常量都是Day的一个实例
    MONDAY,
    TUESDAY, 
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}
```

使用枚举

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        // 声明枚举变量
        Day today = Day.MONDAY;
        
        // 在switch语句中使用（经典用法）
        switch (today) {
            case MONDAY:
                System.out.println("星期一，上班啦！");
                break;
            case FRIDAY:
                System.out.println("星期五，快周末了！");
                break;
            default:
                System.out.println("普通的一天");
        }
        
        // 比较枚举值
        if (today == Day.MONDAY) {
            System.out.println("确实是星期一");
        }
        
        // 获取所有枚举值
        Day[] allDays = Day.values();
        for (Day day : allDays) {
            System.out.println(day);
        }
        
        // 通过名称获取枚举实例
        Day monday = Day.valueOf("MONDAY");
        System.out.println(monday); // 输出: MONDAY
    }
}
```

### 4.2 高级特性

枚举本质上是类，因此可以有字段、方法、构造函数等

#### 4.2.1 带字段和方法的枚举

```java linenums="1"
public enum Planet {
    // 枚举常量必须在第一行，调用构造函数
    MERCURY(3.303e+23, 2.4397e6),
    VENUS(4.869e+24, 6.0518e6),
    EARTH(5.976e+24, 6.37814e6),
    MARS(6.421e+23, 3.3972e6);
    
    // 字段
    private final double mass;   // 质量 (千克)
    private final double radius; // 半径 (米)
    
    // 构造函数 - 必须是私有的(private)或包级私有(package-private)
    private Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }
    
    // 公共方法
    public double getMass() {
        return mass;
    }
    
    public double getRadius() {
        return radius;
    }
    
    // 计算表面重力
    public double surfaceGravity() {
        final double G = 6.67300E-11; // 万有引力常数
        return G * mass / (radius * radius);
    }
    
    // 计算物体在该行星上的重量
    public double surfaceWeight(double otherMass) {
        return otherMass * surfaceGravity();
    }
}
```

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        double earthWeight = 175; // 地球上的体重
        double mass = earthWeight / Planet.EARTH.surfaceGravity();
        
        for (Planet p : Planet.values()) {
            System.out.printf("Your weight on %s is %f%n",
                            p, p.surfaceWeight(mass));
        }
    }
}
```

#### 4.2.2 枚举实现接口

枚举可以实现一个或多个接口

```java linenums="1"
// 定义接口
public interface Describable {
    String getDescription();
}

// 枚举实现接口
public enum Operation implements Describable {
    PLUS {
        public double apply(double x, double y) { return x + y; }
        public String getDescription() { return "加法运算"; }
    },
    MINUS {
        public double apply(double x, double y) { return x - y; }
        public String getDescription() { return "减法运算"; }
    },
    TIMES {
        public double apply(double x, double y) { return x * y; }
        public String getDescription() { return "乘法运算"; }
    },
    DIVIDE {
        public double apply(double x, double y) { return x / y; }
        public String getDescription() { return "除法运算"; }
    };
    
    // 抽象方法 - 每个枚举常量都必须实现
    public abstract double apply(double x, double y);
}
```

#### 4.2.3 枚举中的抽象方法

可以在枚举中定义抽象方法，这样每个枚举常量都必须实现这个方法

```java linenums="1"
public enum HttpStatus {
    OK(200) {
        @Override
        public String getMessage() {
            return "请求成功";
        }
    },
    NOT_FOUND(404) {
        @Override
        public String getMessage() {
            return "资源未找到";
        }
    },
    SERVER_ERROR(500) {
        @Override
        public String getMessage() {
            return "服务器内部错误";
        }
    };
    
    private final int code;
    
    private HttpStatus(int code) {
        this.code = code;
    }
    
    public int getCode() {
        return code;
    }
    
    // 抽象方法 - 每个枚举常量都必须实现
    public abstract String getMessage();
}
```

### 4.3 枚举的方法

Java 为所有枚举类型自动提供了一些实用方法：

| 方法 | 作用 |
| :--: | :--: |
| `values()` | 返回包含所有枚举常量的数组，按声明顺序排序 |
| `valueOf(String name)` | 根据名称返回枚举常量（名称必须完全匹配） |
| `name()` | 返回枚举常量的名称（字符串） |
| `ordinal()` | 返回枚举常量的序数（声明时的位置，从 0 开始） |

```java linenums="1"
Day[] days = Day.values();
for (Day day : days) {
    System.out.println(day);
}
```

```java linenums="1"
Day monday = Day.valueOf("MONDAY"); // 返回 Day.MONDAY
// Day wrong = Day.valueOf("monday"); // 抛出 IllegalArgumentException
```

```java linenums="1"
Day day = Day.WEDNESDAY;
System.out.println(day.name());     // 输出: WEDNESDAY
System.out.println(day.ordinal());  // 输出: 3
```

### 4.4 集合框架

#### 4.4.1 EnumSet

专门为枚举设计的高性能 Set 实现

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        // 创建包含指定枚举值的EnumSet
        EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
        
        // 创建包含所有枚举值的EnumSet
        EnumSet<Day> allDays = EnumSet.allOf(Day.class);
        
        // 创建范围EnumSet
        EnumSet<Day> workweek = EnumSet.range(Day.MONDAY, Day.FRIDAY);
        
        // 判断是否包含
        System.out.println(weekend.contains(Day.SATURDAY)); // true
    }
}
```

#### 4.4.2 EnumMap

专门为枚举键设计的 Map 实现

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        // 创建EnumMap，键类型为Day
        EnumMap<Day, String> activities = new EnumMap<>(Day.class);
        
        activities.put(Day.MONDAY, "开会");
        activities.put(Day.FRIDAY, "总结周报");
        activities.put(Day.SATURDAY, "休息");
        
        System.out.println(activities.get(Day.MONDAY)); // 输出: 开会
    }
}
```

### 4.5 最佳实践和注意事项

1.使用枚举代替常量

```java linenums="1"
// 不推荐
public static final int STATUS_ACTIVE = 1;
public static final int STATUS_INACTIVE = 0;

// 推荐
public enum Status {
    ACTIVE, INACTIVE
}
```

2.枚举比较使用 `==`

```java linenums="1"
if (status == Status.ACTIVE) {  // 推荐，因为枚举是单例
// if (status.equals(Status.ACTIVE)) {  // 也可以，但不必要
```

3.在 `switch` 中不要使用 `default` 进行错误处理

```java linenums="1"
switch (day) {
    case MONDAY: // 处理周一
        break;
    case TUESDAY: // 处理周二  
        break;
    // 不要用default，让编译器检查是否处理了所有情况
}
```

4.考虑使用枚举作为方法参数，提高类型安全性

```java linenums="1"
public void setStatus(Status status) {  // 类型安全
// public void setStatus(int status) {  // 不安全，可能传入非法值
```

## 5 Inner Classes

内部类是定义在另一个类内部的类

- 目的：逻辑上将有紧密联系的类组织在一起，增强封装性，提高代码可读性和维护性
- 核心思想：如果一个类只对另一个类有用，那么把它定义为内部类
- 分类：四种类型

    1. 成员内部类
    2. 静态嵌套类
    3. 局部内部类
    4. 匿名内部类

### 5.1 分类

#### 5.1.1 成员内部类

定义在外部类的成员位置（与字段、方法同级），没有 `static` 修饰

特点：

1. 可以访问外部类的所有成员（包括私有）
2. 不能有静态声明（static fields/methods，除非是编译时常量）
3. 持有外部类实例的隐式引用（`Outer.this`）

```java linenums="1"
public class Outer {
    private String outerField = "Outer field";
    
    // 成员内部类
    public class Inner {
        private String innerField = "Inner field";
        
        public void display() {
            // 内部类可以直接访问外部类的私有成员
            System.out.println("Accessing: " + outerField);
            System.out.println("Inner field: " + innerField);
        }
    }
    
    // 外部类方法：创建内部类实例
    public void createInner() {
        Inner inner = new Inner();
        inner.display();
    }
}
```

```java linenums="1"
public class Outer {
    private String name = "Outer";
    
    public class Inner {
        private String name = "Inner";
        
        public void printNames() {
            System.out.println("Inner name: " + this.name);           // Inner
            System.out.println("Outer name: " + Outer.this.name);     // Outer
        }
    }
}
```

使用方式：

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        Outer outer = new Outer();
        
        // 方式1：通过外部类实例创建内部类实例
        Outer.Inner inner = outer.new Inner();
        inner.display();
        
        // 方式2：在外部类内部创建（如上面的createInner方法）
        outer.createInner();
    }
}
```

#### 5.1.2 静态嵌套类

使用 `static` 修饰的内部类

特点：

1. 不持有外部类实例的引用
2. 只能访问外部类的静态成员
3. 可以有静态成员
4. 行为上更像一个顶级类，只是逻辑上嵌套在另一个类中

```java linenums="1"
public class Outer {
    private static String staticField = "Static field";
    private String instanceField = "Instance field";
    
    // 静态嵌套类
    public static class StaticNested {
        public void display() {
            // 只能访问外部类的静态成员
            System.out.println("Static field: " + staticField);
            // System.out.println(instanceField); // 编译错误！不能访问实例成员
        }
        
        // 可以有静态方法
        public static void staticMethod() {
            System.out.println("Static method in nested class");
        }
    }
}
```

使用方式：

```java linenums="1"
public class Test {
    public static void main(String[] args) {
        // 不需要外部类实例，直接创建
        Outer.StaticNested nested = new Outer.StaticNested();
        nested.display();
        
        // 调用静态方法
        Outer.StaticNested.staticMethod();
    }
}
```

#### 5.1.3 局部内部类

定义在方法、构造器或代码块内部的类

特点：

1. 作用域仅限于定义它的代码块
2. 可以访问外部类的所有成员
3. 只能访问 `final` 或等效 `final` 的局部变量
4. 不能有访问修饰符（`public`, `private`, `protected`）

```java linenums="1"
public class Outer {
    private String outerField = "Outer field";
    
    public void someMethod() {
        final String localVar = "Local variable"; // 必须是final或等效final
        
        // 局部内部类
        class LocalInner {
            public void display() {
                System.out.println("Outer field: " + outerField);
                System.out.println("Local variable: " + localVar); // 只能访问final局部变量
            }
        }
        
        // 在方法内部使用
        LocalInner local = new LocalInner();
        local.display();
    }
    
    public void anotherMethod() {
        // LocalInner local = new LocalInner(); // 编译错误！超出作用域
    }
}
```

#### 5.1.4 匿名内部类

没有名字的内部类，用于创建一次性使用的类实例

特点：

1. 没有类名
2. 同时完成类的定义和实例化
3. 只能实现一个接口或继承一个类
4. 常见于事件处理、线程创建等场景

```java linenums="1"
// 接口
public interface Greeting {
    void greet(String name);
}

// 抽象类
public abstract class Animal {
    public abstract void makeSound();
}

public class Test {
    public static void main(String[] args) {
        // 基于接口的匿名内部类
        Greeting greeting = new Greeting() {
            @Override
            public void greet(String name) {
                System.out.println("Hello, " + name + "!");
            }
        };
        greeting.greet("Alice");
        
        // 基于抽象类的匿名内部类
        Animal animal = new Animal() {
            @Override
            public void makeSound() {
                System.out.println("Some animal sound");
            }
            
            // 可以添加额外方法（但外部无法调用）
            public void extraMethod() {
                System.out.println("Extra method");
            }
        };
        animal.makeSound();
        // animal.extraMethod(); // 编译错误！
        
        // 基于具体类的匿名内部类（不常见）
        Thread thread = new Thread() {
            @Override
            public void run() {
                System.out.println("Thread running...");
            }
        };
        thread.start();
    }
}
```

### 5.2 字节码和内存模型

编译后，内部类会生成独立的 `.class` 文件：

1. `Outer.class`
2. `Outer$Inner.class`（成员内部类）
3. `Outer$StaticNested.class`（静态嵌套类）
4. `Outer$1LocalInner.class`（局部内部类，带数字编号）
5. `Outer$1.class`（匿名内部类，带数字编号）

## 6 Lambda

Lambda 表达式是一种简洁的表示匿名函数的方法

- 目的：简化函数式接口的实现，使代码更简洁、易读
- 核心思想：将函数作为方法参数传递，或者将代码作为数据来处理
- 本质：Lambda 表达式就是一个函数式接口的实例

语法格式：

1. 参数列表：与方法的参数列表格式相同
2. 箭头符号：`->`
3. Lambda 体：可以是表达式或代码块

```java linenums="1"
(parameters) -> expression
// 或
(parameters) -> { statements; }
```

语法变体：

```java linenums="1"
// 1. 无参数，返回void
() -> System.out.println("Hello Lambda");

// 2. 一个参数，可省略括号，返回void  
name -> System.out.println("Hello " + name);

// 3. 多个参数，必须用括号
(int a, int b) -> a + b;

// 4. 参数类型可省略（类型推断）
(a, b) -> a + b;

// 5. 代码块形式（多条语句，需要大括号和return）
(a, b) -> {
    int sum = a + b;
    return sum;
};

// 6. 无参数，有返回值
() -> 42;
```

### 6.1 使用

1.替代匿名内部类

```java linenums="1"
// 传统方式：匿名内部类
Runnable oldRunnable = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello World");
    }
};

// Lambda 方式
Runnable newRunnable = () -> System.out.println("Hello World");
```

2.集合操作

```java linenums="1"
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// 传统for循环
for (String name : names) {
    System.out.println(name);
}

// Lambda + forEach
names.forEach(name -> System.out.println(name));
// 方法引用更简洁
names.forEach(System.out::println);
```

3.实现函数式接口

```java linenums="1"
Predicate<String> isEmpty = s -> s.isEmpty();
Function<String, Integer> length = s -> s.length();
```

### 6.2 方法引用

方法引用是 Lambda 表达式的更简洁写法

四种方法引用类型：

```java linenums="1"
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// 1. 静态方法引用：ClassName::staticMethod
names.stream().map(String::toUpperCase); // 等价于 s -> s.toUpperCase()

// 2. 实例方法引用：instance::instanceMethod
String prefix = "Hello ";
names.forEach(prefix::concat); // 等价于 s -> prefix.concat(s)

// 3. 特定类型的任意对象方法引用：ClassName::instanceMethod  
names.stream().sorted(String::compareToIgnoreCase);

// 4. 构造方法引用：ClassName::new
names.stream().map(String::new); // 等价于 s -> new String(s)
```

```java linenums="1"
public class MethodReferenceExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // 静态方法引用
        names.forEach(MethodReferenceExample::printWithPrefix);
        
        // 实例方法引用
        MethodReferenceExample example = new MethodReferenceExample();
        names.forEach(example::printWithSuffix);
    }
    
    public static void printWithPrefix(String s) {
        System.out.println("Prefix: " + s);
    }
    
    public void printWithSuffix(String s) {
        System.out.println(s + " - Suffix");
    }
}
```

### 6.3 Closure

闭包是一个函数（或方法）与其引用环境的组合。一个函数“记住”了它被创建时所处的环境（变量、值等），即使它在其原始作用域之外被执行

核心要素：

1. 一个函数（或一段可执行代码）
2. 一个环境：该函数创建时所能访问的所有自由变量（既不是局部变量，也不是函数参数的变量）的引用

特性：

1. 函数是一等公民：函数可以像普通值一样被传递、赋值、返回
2. 词法作用域：函数可以访问其定义时所在的作用域中的变量，而不是执行时的作用域
3. 环境保持：即使外部函数已经执行完毕，其局部变量仍然被内部函数引用，这些变量的生命周期得以延长

闭包可以通过 Lambda 表达式实现，也通过匿名内部类实现：

```java linenums="1"
public class JavaClosure {
    public static void main(String[] args) {
        final int base = 10; // 在 Java 8 之前必须显式声明 final
        
        // 匿名内部类形成闭包
        Runnable closure = new Runnable() {
            @Override
            public void run() {
                System.out.println("Base value: " + base);
            }
        };
        
        closure.run(); // 输出: Base value: 10
    }
}
```

Java 闭包的限制：

```java linenums="1"
public class JavaClosureLimitations {
    public static void main(String[] args) {
        int counter = 0;
        
        // Lambda 表达式
        Runnable lambda = () -> {
            // System.out.println(counter++); // 编译错误！
            // 不能修改捕获的变量
        };
        
        // 解决方法：使用数组或包装类
        int[] counterArray = {0};
        Runnable workingLambda = () -> {
            System.out.println(counterArray[0]++);
        };
        
        workingLambda.run(); // 输出: 0
        workingLambda.run(); // 输出: 1
    }
}
```

### 6.4 Eager Call And Lazy Call

Eager Call：

1. 定义：立即计算并返回结果
2. 时机：在表达式被定义或赋值时立即执行
3. 特点：不管结果是否会被使用，都先计算出来
4. 内存：通常立即占用内存存储结果

Lazy Call

1. 定义：延迟计算，直到真正需要结果时才执行
2. 时机：在结果第一次被使用时才触发计算
3. 特点：避免不必要的计算，提高性能
4. 内存：可能节省内存，只在需要时生成数据

```java linenums="1"
import java.util.function.Supplier;

public class SupplierLazyExample {
    public static void main(String[] args) {
        // 急切版本
        String eagerResult = expensiveOperation();
        System.out.println("急切调用完成");
        
        // 惰性版本
        Supplier<String> lazySupplier = () -> expensiveOperation();
        System.out.println("Supplier创建完成，但还没计算");
        
        // 直到调用 get() 才执行
        String lazyResult = lazySupplier.get();
        System.out.println("惰性调用完成: " + lazyResult);
    }
    
    private static String expensiveOperation() {
        System.out.println("执行昂贵操作...");
        return "计算结果";
    }
}
```

```java linenums="1" title="output"
执行昂贵操作...
急切调用完成
Supplier创建完成，但还没计算
执行昂贵操作...
惰性调用完成: 计算结果
```

Lambda 表达式可以实现 lazy call