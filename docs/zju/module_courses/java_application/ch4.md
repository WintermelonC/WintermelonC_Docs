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

!!! tip "原因"

    1. `private`：如果一个接口被声明为 `private`，它将无法被任何其他类访问或实现，这完全违背了接口作为"契约"或"规范"的设计目的。接口的存在就是为了被实现，`private` 访问级别使其失去意义
    2. `protected`：`protected` 意味着只有同一包内的类或其子类可以访问。但是接口本身不能被继承（只能被实现），而且接口的"子类"概念不适用于 `protected` 的语义。因此 `protected` 修饰符对接口没有意义

!!! info "Java 版本"

    Java 7 及以前接口只能包含以下两种成员：
    
    1. 常量：
    
        1. 默认是 `public static final` 的，即使不写这些修饰符，编译器也会自动加上
        2. 必须被显式初始化
    
    2. 抽象方法
    
        1. 默认是 `public abstract` 的，同样可以省略这些修饰符
        2. 没有方法体（即没有 `{}`）

```java linenums="1" title="接口定义"
// 接口声明
interface Animal {
    // 抽象方法（隐式是 public abstract）
    void makeSound();
    void eat();
    
    // 常量（隐式是 public static final）
    String TYPE = "动物";
}

// 类实现接口
class Dog implements Animal {
    private String name;
    
    public Dog(String name) {
        this.name = name;
    }
    
    // 必须实现接口中的所有抽象方法
    @Override
    public void makeSound() {
        System.out.println(name + "汪汪叫");
    }
    
    @Override
    public void eat() {
        System.out.println(name + "在吃狗粮");
    }
}

class Cat implements Animal {
    private String name;
    
    public Cat(String name) {
        this.name = name;
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + "喵喵叫");
    }
    
    @Override
    public void eat() {
        System.out.println(name + "在吃鱼");
    }
}
```

```java linenums="1" title="接口使用"
public class InterfaceDemo {
    public static void main(String[] args) {
        // 使用接口类型引用具体实现
        Animal dog = new Dog("旺财");
        Animal cat = new Cat("咪咪");
        
        // 多态调用
        dog.makeSound(); // 汪汪叫
        cat.makeSound(); // 喵喵叫
        
        // 访问接口常量
        System.out.println("类型: " + Animal.TYPE); // 类型: 动物
    }
}
```

!!! info "Java 版本"

    Java 8 引入了 **默认方法** 和 **静态方法**

**默认方法**：

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

**静态方法**：

- 目的：提供与接口相关的工具方法，这些方法不属于任何实例
- 语法：使用 `static` 关键字修饰，必须有方法体
- 调用方式：通过 `interfaceName.staticMethodName` 直接调用，==不能被实现类继承或重写==

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
    }
}
```

!!! info "Java 版本"

    Java 9 引入了 **私有方法**

**私有方法**：

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

!!! tip "与抽象类的区别"

    | 特性 | 接口 | 抽象类 |
    | :--: | :--: | :--: |
    | **实例化** | 不能 | 不能 |
    | **字段** | 可以有实例字段 | 只能是常量 |
    | **构造方法** | 有 | 没有 |
    | **方法实现** | 可以有具体和抽象方法 | Java 8 前只能有抽象方法 |
    | **多继承** | 单继承 | 多实现 |
    | **设计目的** | 代码复用 + 规范 | 定义契约 + 多态 |

### 1.1 多实现

Java 类可以实现多个接口，解决了单继承的限制

```java linenums="1"
// 多个接口
interface Swimmable {
    void swim();
}

interface Flyable {
    void fly();
}

interface Runnable {
    void run();
}

// 类实现多个接口
class Duck implements Swimmable, Flyable, Runnable {
    private String name;
    
    public Duck(String name) {
        this.name = name;
    }
    
    @Override
    public void swim() {
        System.out.println(name + "在水中游泳");
    }
    
    @Override
    public void fly() {
        System.out.println(name + "在空中飞翔");
    }
    
    @Override
    public void run() {
        System.out.println(name + "在地上奔跑");
    }
}

public class MultipleInterfaces {
    public static void main(String[] args) {
        Duck duck = new Duck("唐老鸭");
        
        // 可以作为不同类型使用
        Swimmable swimmer = duck;
        Flyable flyer = duck;
        Runnable runner = duck;
        
        swimmer.swim();
        flyer.fly();
        runner.run();
    }
}
```

### 1.2 接口的继承

接口可以继承其他接口，形成接口层次结构

```java linenums="1"
// 基础接口
interface Animal {
    void eat();
    void sleep();
}

// 接口继承
interface Mammal extends Animal {
    void giveBirth();
}

interface Bird extends Animal {
    void layEggs();
}

// 实现继承后的接口
class Bat implements Mammal, Bird {
    // 必须实现所有抽象方法（来自Animal、Mammal、Bird）
    @Override
    public void eat() {
        System.out.println("吃昆虫");
    }
    
    @Override
    public void sleep() {
        System.out.println("倒挂睡觉");
    }
    
    @Override
    public void giveBirth() {
        System.out.println("胎生");
    }
    
    @Override
    public void layEggs() {
        System.out.println("不产卵");
    }
}
```

### 1.3 默认方法冲突

如果一个类实现了多个接口，而这些接口有同名同参数的默认方法，==则实现类必须重写这个默认方法来解决冲突==。在重写的方法中，可以通过 `interfaceName.super.MethodName()` 来显式调用指定接口的默认方法，或者提供全新的实现

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
    }
}
```

!!! tip "父类和接口类有重名方法"

    A 类继承 B 类，A 类实现 C 接口，而 B 类和 C 接口有重名的方法
    
    Java 在处理这类问题时遵循一个基本原则：==类优先于接口==。这意味着，如果一个方法在父类中有具体实现，那么在子类中，这个方法的实现默认来自于父类，而不是接口
    
    - 如果接口的这个重名方法是默认方法，依然是类优先，父类 B 的具体实现会覆盖接口 C 的默认方法
    - 如果 B 类是抽象类，重名方法是抽象方法，C 接口的这个也是抽象方法，A 类就需要重写这个方法了，因为 B 类和 C 接口都没有提供具体实现
    
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

??? tip "POJO"

    **Plain Old Java Object**
    
    一种设计理念，指的是使用普通 Java 语法创建的、不受任何特殊限制和约束的简单 Java 类
    
    1. 不继承特定的类
    2. 不实现特定的接口
    3. 不包含特定的注解
    
    ??? example "示例"
    
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

## 2 Record

一个特殊的类

- 目的：用于创建不可变的数据载体，其核心是透明地持有数据
- 设计动机：为了简化那些只用于保存数据、没有复杂业务逻辑的类的编写，避免编写大量模板代码
- 核心思想：让你声明一个类应该持有哪些数据，然后自动获取一个公共的 API

```java linenums="1"
// 声明一个名为 Point 的 record，它持有 x 和 y 两个数据组件
public record Point(int x, int y) {}
```

??? quote "这一行代码相当于一个包含以下内容的传统类"

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
2. 公共的访问器方法：方法名与组件名相同，而不是传统的 `getX()`
3. 一个公共的规范构造函数：参数列表与 `record` 头部声明的组件列表完全一致
4. `equals()` 和 `hashCode()` 方法：基于所有组件值来判断相等性和计算哈希值
5. `toString()` 方法：返回一个包含 `record` 名称和所有组件名称及值的字符串

```java linenums="1" title="实例化和使用"
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

1. `record` 不能继承其他类，因为其隐式继承 `java.lang.Record`
2. `record` 是隐式 `final` 的，因此不能被显式地声明为 `abstract`，不能被继承
3. `record` 的组件是隐式 `final` 的：不能在实例方法中修改组件字段
4. `record` 是隐式 `static` 的，这意味着它可以嵌套在另一个类中，并且不持有外部类的引用
5. `record` 可以声明静态字段、静态方法、静态初始化块和实例方法，不能声明实例字段，不能声明实例初始化块

### 2.1 自定义构造函数

##### 2.1.1 紧凑构造函数

只有参数列表，没有显式的参数声明。适用于简单的参数验证

```java linenums="1"
public record Person(String name, int age) {
    // 紧凑构造函数 - 在自动生成的构造函数基础上添加验证
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        // 不需要写 this.name = name; this.age = age;
        // 它们会在紧凑构造函数结束时自动赋值
    }
}
```

##### 2.1.2 自定义规范构造函数

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

##### 2.1.3 辅助构造函数

可以创建参数不同的便利构造函数

```java linenums="1"
public record Person(String name, int age) {
    // 辅助构造函数 - 必须首先调用 this() 来委托给规范构造函数
    public Person(String name) {
        this(name, 0); // 调用规范构造函数
    }
}
```

### 2.2 实现接口

`record` 可以实现接口

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

### 2.3 注解

可以对 `record` 的组件应用注解，这些注解会应用到相应的位置

```java linenums="1"
public record Person(
    @NotNull String name,
    @Min(0) int age
) {}
```

## 3 Enums

枚举是一种特殊的类，用于定义一组固定的常量

- 目的：提供类型安全的常量，替代传统的 `public static final int` 常量
- 核心思想：变量的取值只能来自预定义的有限集合

```java linenums="1"
// 枚举定义
public enum Status {
    ACTIVE,      // 枚举实例
    INACTIVE,    // 枚举实例  
    PENDING      // 枚举实例
}

// 使用枚举
public class EnumDemo {
    public static void main(String[] args) {
        Status status = Status.ACTIVE;
        System.out.println("状态: " + status);
        System.out.println("名称: " + status.name());
        System.out.println("序号: " + status.ordinal());
    }
}
```

枚举本质上是类，因此可以有字段、方法、构造函数等

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

可以在枚举中定义抽象方法，这样每个枚举常量都必须实现这个方法

枚举也可以实现一个或多个接口

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

!!! tip "枚举单例模式"

    在枚举中，`INSTANCE` 通常用作单例模式的实现。它是枚举中的一个实例，代表该类型的唯一实例
    
    ??? example "示例"
    
        ```java linenums="1"
        public enum Singleton {
            INSTANCE;  // 这就是单例实例！
            
            // 可以添加字段和方法
            private int counter = 0;
            
            // 业务方法
            public void doSomething() {
                counter++;
                System.out.println("执行操作，计数器: " + counter);
            }
            
            public int getCounter() {
                return counter;
            }
            
            // 可以添加更多业务逻辑
            public void reset() {
                counter = 0;
                System.out.println("计数器已重置");
            }
        }
        
        public class SingletonDemo {
            public static void main(String[] args) {
                // 获取单例实例
                Singleton singleton1 = Singleton.INSTANCE;
                Singleton singleton2 = Singleton.INSTANCE;
                
                // 验证是同一个实例
                System.out.println("是同一个实例吗？ " + (singleton1 == singleton2)); // true
                System.out.println("hashCode相同吗？ " + 
                                  (singleton1.hashCode() == singleton2.hashCode())); // true
                
                // 使用单例
                singleton1.doSomething(); // 执行操作，计数器: 1
                singleton2.doSomething(); // 执行操作，计数器: 2
                singleton1.doSomething(); // 执行操作，计数器: 3
                
                System.out.println("最终计数器: " + singleton1.getCounter()); // 3
            }
        }
        ```

### 3.1 枚举的方法

Java 为所有枚举类型自动提供了一些实用方法：

| 方法 | 作用 |
| -- | -- |
| `EnumType[] values()` | 返回包含所有枚举常量的数组，按声明顺序排序 |
| `EnumType valueOf(String name)` | 根据名称返回枚举常量（名称必须完全匹配） |
| `String name()` | 返回枚举常量的名称 |
| `int ordinal()` | 返回枚举常量的序数（声明时的位置，从 0 开始） |

```java linenums="1"
Day[] days = Day.values();
for (Day day : days) {
    System.out.println(day);
}

Day monday = Day.valueOf("MONDAY"); // 返回 Day.MONDAY

Day day = Day.WEDNESDAY;
System.out.println(day.name());     // 输出: WEDNESDAY
System.out.println(day.ordinal());  // 输出: 3
```

### 3.2 集合框架

- `EnumSet`：专门为枚举设计的高性能 Set 实现
- `EnumMap`：专门为枚举键设计的 Map 实现

```java linenums="1"
public class EnumCollections {
    public static void main(String[] args) {
        // EnumSet - 高效的枚举集合
        EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
        EnumSet<Day> weekdays = EnumSet.complementOf(weekend);
        
        System.out.println("周末: " + weekend);
        System.out.println("工作日: " + weekdays);
        
        // EnumMap - 高效的枚举映射
        EnumMap<Day, String> schedule = new EnumMap<>(Day.class);
        schedule.put(Day.MONDAY, "团队会议");
        schedule.put(Day.FRIDAY, "代码审查");
        
        System.out.println("周五安排: " + schedule.get(Day.FRIDAY));
    }
}
```

## 4 Inner Classes

内部类是定义在另一个类内部的类。它有四种类型，每种都有不同的特性和使用场景：

1. 成员内部类：作为外部类的成员
2. 静态嵌套类：使用 `static` 修饰的内部类
3. 局部内部类：在方法或作用域内定义
4. 匿名内部类：没有名字的内部类

!!! tip "字节码和内存模型"

    编译后，内部类会生成独立的 `.class` 文件：
    
    1. `Outer.class`
    2. `Outer$Inner.class`（成员内部类）
    3. `Outer$StaticNested.class`（静态嵌套类）
    4. `Outer$1LocalInner.class`（局部内部类，带数字编号）
    5. `Outer$1.class`（匿名内部类，带数字编号）

### 4.1 成员内部类

定义在外部类的成员位置（与字段、方法同级），没有 `static` 修饰

特点：

1. 可以访问外部类的所有成员（包括私有）
2. 不能有静态声明（除非是编译时常量）
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
        
        // 方式 1：通过外部类实例创建内部类实例
        Outer.Inner inner = outer.new Inner();
        inner.display();
        
        // 方式 2：在外部类内部创建（如上面的 createInner 方法）
        outer.createInner();
    }
}
```

### 4.2 静态嵌套类

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

### 4.3 局部内部类

定义在方法、构造器或代码块内部的类

特点：

1. 作用域仅限于定义它的代码块
2. 可以访问外部类的所有成员
3. 只能访问 `final` 或等效 `final` 的局部变量
4. 不能有访问修饰符（`public`, `private`, `protected`）

!!! tip "等效 `final` 局部变量"

    后续没有被修改的局部变量

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

### 4.4 匿名内部类

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

## 5 Lambda

### 5.1 函数式接口

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

推荐使用 `@FunctionalInterface` 注解，编译器会检查接口是否符合函数式接口的定义

Java 内置的核心函数式接口

| 接口 | 方法签名 | 用途 |
| :--: | :--: | :--: |
| `Supplier<T>` | `T get()` | 无参返回结果 |
| `Consumer<T>` | `void accept(T t)` | 消费一个参数 |
| `BiConsumer<T, U>` | `void accept(T t, U u)` | 消费两个参数 |
| `Function<T, R>` | `R apply(T t)` | 转换操作 |
| `BiFunction<T, U, R>` | `R apply(T t, U u)` | 双参数转换操作 |
| `Predicate<T>` | `boolean test(T t)` | 条件判断 |
| `BiPredicate<T, U>` | `boolean test(T t, U u)` | 双参数条件判断 |
| `UnaryOperator<T>` | `T apply(T t)` | 一元运算 |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | 二元运算 |

> Java 为了性能，提供了对 `int`、`long`、`double` 的专门版本，例如：`IntPredicate` `IntFunction<R>` 等等

### 5.2 Lambda 表达式

Lambda 表达式是一个匿名函数，它提供了一种清晰简洁的方式来表示一个方法接口（函数式接口）的实现。==Lambda 表达式本质就是一个函数式接口的实例==

基本语法格式：

1. 参数列表：与方法的参数列表格式相同
2. 箭头符号：`->`
3. Lambda 体：可以是表达式或代码块

```java linenums="1"
(parameters) -> expression
// 或
(parameters) -> { statements; }
```

各种语法变体：

```java linenums="1"
// 无参数，无返回值
() -> System.out.println("Hello Lambda");

// 无参数，有返回值
() -> "返回字符串";

// 单个参数（可省略括号）
name -> System.out.println("Hello " + name);

// 多个参数（必须用括号）
(int a, int b) -> a + b;

// 参数类型可省略（编译器类型推断）
(a, b) -> a + b;

// 代码块形式（需要大括号和 return）
(a, b) -> {
    int sum = a + b;
    return sum;
};
```

Lambda 表达式需要与函数式接口配合使用

```java linenums="1"
import java.util.function.*;

public class FunctionalInterfaces {
    public static void main(String[] args) {
        Consumer<String> printUpperCase = s -> System.out.println(s.toUpperCase());
        printUpperCase.accept("hello world");
        
        Supplier<Double> randomSupplier = () -> Math.random();
        System.out.println("随机数: " + randomSupplier.get());

        Predicate<String> isLong = s -> s.length() > 5;
        System.out.println("'Hello' 长度大于5吗? " + isLong.test("Hello"));
        
        Function<String, Integer> stringLength = s -> s.length();
        System.out.println("'Lambda' 长度: " + stringLength.apply("Lambda"));
        
        UnaryOperator<String> addPrefix = s -> "前缀_" + s;
        System.out.println(addPrefix.apply("测试"));
        
        BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;
        System.out.println("最大值: " + max.apply(10, 20));
    }
}
```

### 5.3 方法引用

方法引用是 Lambda 表达式的一种更简洁的写法

| 方法引用形式 | Lambda 表达式 | 方法引用 | 说明 |
| :--: | :--: | :--: | :--: |
| **静态方法引用** | `(args) -> Class.staticMethod(args)` | `Class::staticMethod` | 调用静态方法 |
| **实例方法引用** | `(args) -> instance.method(args)` | `instance::method` | 调用特定实例的方法 |
| **任意对象方法引用** | `(obj, args) -> obj.method(args)` | `ClassName::method` | 调用任意对象的实例方法 |
| **构造方法引用** | `(args) -> new ClassName(args)` | `ClassName::new` | 创建新对象 |

=== "静态方法引用"

    ```java linenums="1"
    // Lambda 表达式
    Function<String, Integer> parser1 = s -> Integer.parseInt(s);
    Function<Integer, Integer> abs1 = n -> Math.abs(n);
    BiFunction<Integer, Integer, Integer> comparator1 = (a, b) -> Integer.compare(a, b);
    
    // 方法引用
    Function<String, Integer> parser2 = Integer::parseInt;
    Function<Integer, Integer> abs2 = Math::abs;
    BiFunction<Integer, Integer, Integer> comparator2 = Integer::compare;
    
    System.out.println(parser2.apply("123"));     // 123
    System.out.println(abs2.apply(-5));          // 5
    System.out.println(comparator2.apply(3, 5)); // -1
    ```

=== "实例方法引用"

    ```java linenums="1"
    String prefix = "Hello ";
    List<String> list = Arrays.asList("A", "B", "C");
    
    // Lambda 表达式
    Function<String, String> concat1 = s -> prefix.concat(s);
    Supplier<Integer> size1 = () -> list.size();
    
    // 方法引用
    Function<String, String> concat2 = prefix::concat;
    Supplier<Integer> size2 = list::size;
    
    System.out.println(concat2.apply("World")); // Hello World
    System.out.println(size2.get());            // 3
    ```

=== "任意对象方法引用"

    ```java linenums="1"
    List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
    
    // Lambda 表达式
    Function<String, Integer> length1 = s -> s.length();
    Function<String, String> upper1 = s -> s.toUpperCase();
    BiFunction<String, String, Integer> compare1 = (s1, s2) -> s1.compareTo(s2);
    
    // 方法引用
    Function<String, Integer> length2 = String::length;
    Function<String, String> upper2 = String::toUpperCase;
    BiFunction<String, String, Integer> compare2 = String::compareTo;
    
    // 在 Stream 中的使用
    List<Integer> lengths1 = names.stream()
        .map(s -> s.length())           // Lambda
        .toList();
    
    List<Integer> lengths2 = names.stream()
        .map(String::length)            // 方法引用
        .toList();
    
    System.out.println(lengths2); // [5, 3, 7]
    ```

=== "构造方法引用"

    ```java linenums="1"
    // Lambda 表达式
    Supplier<List<String>> listSupplier1 = () -> new ArrayList<>();
    Function<String, Person> personFactory1 = s -> new Person(s);
    IntFunction<String[]> arrayFactory1 = n -> new String[n];
    
    // 方法引用
    Supplier<List<String>> listSupplier2 = ArrayList::new;
    Function<String, Person> personFactory2 = Person::new;
    IntFunction<String[]> arrayFactory2 = String[]::new;
    
    List<String> list = listSupplier2.get();
    Person person = personFactory2.apply("Alice");
    String[] array = arrayFactory2.apply(5);
    
    System.out.println(list.getClass());   // class java.util.ArrayList
    System.out.println(person.getName());  // Alice
    System.out.println(array.length);      // 5
    ```

### 5.4 Closure

闭包是一个函数与其词法作用域中变量的绑定。在 Java 中，Lambda 表达式可以捕获定义它们的作用域中的变量，即使这些变量在原始作用域中已经不存在了

变量捕获规则：

1. 可以访问实例变量、静态变量、`final` 局部变量和等效 `final` 局部变量
2. 不能访问非 `final` 局部变量
3. 可以修改实例变量和静态变量
4. 不能修改 `final` 局部变量和等效 `final` 局部变量

```java linenums="1"
public class VariableCapture {
    private String instanceVar = "实例变量";
    private static String staticVar = "静态变量";
    
    public void testCapture() {
        final String finalLocalVar = "final 局部变量";
        String effectivelyFinalVar = "等效 final 变量";  // 后续没有修改
        String nonFinalVar = "非 final 变量";  // 后续有修改
        
        Runnable lambda = () -> {
            // 访问实例变量
            System.out.println("实例变量: " + instanceVar);
            // 访问静态变量  
            System.out.println("静态变量: " + staticVar);
            // 访问 final 局部变量
            System.out.println("final 局部变量: " + finalLocalVar);
            // 访问等效 final 局部变量
            System.out.println("等效 final 变量: " + effectivelyFinalVar);
            
            // 不能访问非 final 局部变量
            // System.out.println("非 final 变量: " + nonFinalVar);
            
            // 可以修改实例变量和静态变量
            instanceVar = "修改后的实例变量";
            staticVar = "修改后的静态变量";
        };
        
        nonFinalVar = "修改值";
        
        lambda.run();
    }
    
    public static void main(String[] args) {
        new VariableCapture().testCapture();
    }
}
```

Lambda 表达式可以捕获一个引用，可以修改引用指向的对象，但是不能修改这个引用（这个引用变量是 `final` 局部变量和等效 `final` 局部变量）

```java linenums="1"
public class JavaClosureLimitations {
    public static void main(String[] args) {
        int counter = 0;
        
        Runnable lambda = () -> {
            // 不能修改 `final` 局部变量和等效 `final` 局部变量
            // System.out.println(counter++);
        };
        
        // 解决方法：使用数组或包装类
        int[] counterArray = {0};
        Runnable workingLambda = () -> {
            System.out.println(counterArray[0]++);
        };
        
        workingLambda.run();  // 输出: 0
        workingLambda.run();  // 输出: 1
    }
}
```

### 5.5 Eager Call and Lazy Call

Eager Call：

1. 定义：立即计算并返回结果
2. 时机：在表达式被定义或赋值时立即执行
3. 特点：不管结果是否会被使用，都先计算出来
4. 内存：通常立即占用内存存储结果

Lazy Call

1. 定义：延迟计算，==直到真正需要结果时才执行==
2. 时机：在结果第一次被使用时才触发计算
3. 特点：避免不必要的计算，提高性能
4. 内存：可能节省内存，只在需要时生成数据

```java linenums="1"
import java.util.function.Supplier;

public class SupplierLazyExample {
    public static void main(String[] args) {
        String eagerResult = expensiveOperation();
        System.out.println("立即调用完成");
        
        Supplier<String> lazySupplier = () -> expensiveOperation();
        System.out.println("Supplier 创建完成，但还没计算");
        
        // 直到调用 get() 才执行
        String lazyResult = lazySupplier.get();
        System.out.println("延迟调用完成: " + lazyResult);
    }
    
    private static String expensiveOperation() {
        System.out.println("执行昂贵操作...");
        return "计算结果";
    }
}
```

```java linenums="1" title="output"
执行昂贵操作...
立即调用完成
Supplier 创建完成，但还没计算
执行昂贵操作...
延迟调用完成: 计算结果
```
