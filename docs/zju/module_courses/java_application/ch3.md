# 3 Inheritance and Polymorphism

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

```java linenums="1"
class SubclassName extends SuperclassName {
    // ... fields and methods
}
```

Java 只支持 **单继承**，一个类只能直接继承一个父类

**`Object` 类** 是所有类的根类。所有对象都拥有 `Object` 类的方法，如 `toString()`、`equals()`、`hashCode()` 等

> 如果一个类没有显式地 `extends` 任何其他类，它会默认继承 `java.lang.Object` 类

**方法重写**：子类可以提供一个与父类方法具有相同方法签名（方法名、参数列表）和返回类型（或其子类型）的新实现

`@Override` 注解：一个推荐使用的注解，用于告诉编译器该方法意图重写父类方法。如果拼写错误或参数不匹配，编译器会报错

!!! tip "重写规则"

    1. 访问修饰符的限制不能更严格（例如，父类是 `public`，子类不能是 `protected`）
    2. 不能重写 `final` 或 `static` 方法

**`super` 关键字** 用于访问父类的成员、方法和构造函数

- 调用父类构造方法：`super()`。必须是子类构造方法中的第一条语句。如果子类构造方法中没有显式调用 `super()`，Java 会自动调用父类的 **无参构造方法**。如果父类没有无参构造方法，则必须在子类中显式调用 `super()` 并传入相应参数，否则编译报错
- 访问父类成员：`super.methodName()` 或 `super.fieldName`。当子类重写了父类的方法或定义了同名字段时，可以用 `super` 来明确调用父类的版本

```java linenums="1"
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
        System.out.println("Animal constructor called.");
    }

    void eat() {
        System.out.println("This animal eats food.");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name); // 必须调用父类带参的构造方法
        System.out.println("Dog constructor called.");
    }

    // 方法重写
    @Override
    void eat() {
        super.eat(); // 调用父类的 eat() 方法
        System.out.println(name + " eats dog food.");
    }
}
```

## 1 Name Hiding

**1.字段隐藏**：当子类定义了与父类同名的字段时，会发生字段隐藏

```java linenums="1"
class Parent {
    String name = "Parent";
}

class Child extends Parent {
    String name = "Child"; // 隐藏了父类的name字段
    
    void printNames() {
        System.out.println(name);        // "Child" - 子类字段
        System.out.println(super.name);  // "Parent" - 父类字段
    }
}
```

**2.静态方法隐藏**：当子类定义了与父类同名的静态方法时，会发生静态方法隐藏

```java linenums="1"
class Parent {
    static void method() {
        System.out.println("Parent static method");
    }
}

class Child extends Parent {
    static void method() { // 隐藏了父类的静态方法
        System.out.println("Child static method");
    }
}
```

!!! tip "与 C++ 的区别"

    - Java：使用基于方法签名的重载解析，==子类不会隐藏父类中签名不同的方法==
    - C++：一旦子类定义了同名方法，就会隐藏所有父类的同名方法（无论参数是否相同）

    在 C++ 中：

    ```cpp linenums="1"
    class Parent {
    public:
        void method(int x) { }
    };
    
    class Child : public Parent {
    public:
        void method() { } // 隐藏了Parent::method(int)
    };
    
    // 使用时：
    Child c;
    c.method(5); // 错误！Parent::method(int) 被隐藏
    ```

    但在 Java 中：

    ```java linenums="1"
    class Parent {
        void method(int x) { }
    }
    
    class Child extends Parent {
        void method() { } // 不会隐藏父类的method(int)
    }
    
    // 使用时：
    Child c = new Child();
    c.method(5); // 正确！可以调用继承的method(int)
    ```

## 2 Upcast

> 与 C++ 类似

Upcast（向上转型）是指将子类类型的引用转换为父类类型的引用。这种转型是安全的，并且通常由编译器隐式执行

向上转型后，只能访问父类中定义的方法和字段，不能访问子类特有的成员

upcast 最重要的价值就是实现运行时多态

```java linenums="1"
class Shape {
    public void draw() {
        System.out.println("绘制形状");
    }
}

class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("绘制圆形");
    }
}

class Rectangle extends Shape {
    @Override
    public void draw() {
        System.out.println("绘制矩形");
    }
}

public class PolymorphismDemo {
    public static void main(String[] args) {
        Shape[] shapes = new Shape[3];
        
        // Upcast: 各种子类对象都被当作Shape处理
        shapes[0] = new Circle();     // Circle -> Shape
        shapes[1] = new Rectangle();  // Rectangle -> Shape
        shapes[2] = new Shape();      // 本身就是Shape
        
        // 多态调用：根据实际对象类型调用相应的方法
        for (Shape shape : shapes) {
            shape.draw();  // 运行时决定调用哪个draw()方法
        }
    }
}
```

## 3 `abstract`

### 3.1 抽象类

作为其他类的父类，提供一个通用的模板。它用于被继承，而不是用于被实例化

```java linenums="1"
public abstract class ClassName {
    // ...
}
```

特点：

1. 不能被实例化：不能使用 `new` 关键字创建抽象类的对象
2. 可以包含抽象方法和非抽象方法：抽象类可以同时拥有带方法体的具体方法和不带方法体的抽象方法。这使得抽象类能提供一些通用实现，同时又保留一些部分让子类去定义
3. 可以有构造方法：抽象类的构造方法不能用来创建实例，但它会在子类实例化时被调用（通过 `super()`），用于初始化父类的成员变量
4. 可以有成员变量、静态方法等：抽象类和普通类一样，可以拥有各种成员
5. 子类的责任：如果一个类继承了抽象类，它必须：

    1. 实现（重写）父类中所有的抽象方法
    2. 或者，如果它没有实现所有抽象方法，那么这个子类也必须被声明为 `abstract`

### 3.2 抽象方法

抽象方法是一个只有方法声明、没有方法体（即没有 `{}` 代码块）的方法。它必须在抽象类中声明

其目的在于强制子类提供该方法的具体实现。它定义了一个“契约”，任何继承这个抽象类的非抽象子类都必须遵守这个契约

```java linenums="1"
public abstract returnType methodName(parameters);
```

特点：

1. 没有方法体，以分号 `;` 结尾
2. 必须存在于一个抽象类中
3. 不能是 `private` 的，因为 `private` 方法不能被子类重写
4. 不能是 `final` 的，因为 `final` 方法不能被重写
5. 不能是 `static` 的，因为 `static` 方法属于类，而抽象方法需要被子类的实例重写
