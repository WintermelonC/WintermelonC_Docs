# 3 Inheritance and Polymorphism

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Inheritance

语法：

```java linenums="1"
class SubclassName extends SuperclassName {
    // ... fields and methods
}
```

在 Java 中，如果一个类没有显式地 `extends` 任何其他类，它会默认继承 `java.lang.Object` 类

因此，`Object` 类是 Java 所有类的最终父类，所有对象都拥有 `Object` 类的方法，如 `toString()`、`equals()`、`hashCode()` 等

构造方法与继承：

1. 构造方法不会被继承
2. 子类的构造过程总是会先调用父类的构造方法，以确保父类部分被正确初始化

### 1.1 `super`

`super` 关键字用于引用直接父类的成员

1. 调用父类构造方法：`super()`

    1. 必须是子类构造方法中的第一条语句
    2. 如果子类构造方法中没有显式调用 `super()`，Java 会自动调用父类的无参构造方法。如果父类没有无参构造方法，则必须在子类中显式调用 `super()` 并传入相应参数

2. 访问父类成员：`super.methodName()` 或 `super.fieldName`

    1. 当子类重写了父类的方法或定义了同名字段时，可以用 `super` 来明确调用父类的版本

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

### 1.2 Name Hiding

**1.字段隐藏**

当子类定义了与父类同名的字段时，会发生字段隐藏：

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

**2.静态方法隐藏**

当子类定义了与父类同名的静态方法时，会发生静态方法隐藏：

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

    - Java：使用基于方法签名的重载解析，子类不会隐藏父类中签名不同的方法
    - C++：一旦子类定义了同名方法，就会隐藏所有父类的同名方法（无论参数是否相同）

### 1.3 Method Overriding

子类可以提供一个与父类方法具有相同方法签名（方法名、参数列表）和返回类型（或其子类型）的新实现

`@Override` 注解：一个推荐使用的注解，用于告诉编译器该方法意图重写父类方法。如果拼写错误或参数不匹配，编译器会报错

规则：

1. 访问修饰符的限制不能更严格（例如，父类是 `public`，子类不能是 `protected`）
2. 不能重写 final 或 static 方法

### 1.4 Upcast

与 C++ 类似

#### 1.4.1 `instanceof`

一个操作符。返回一个 `boolean` 值，表示对象是否是指定类型或其子类型的实例

```java linenums="1"
object instanceof Type
```

```java linenums="1"
String str = "Hello";
System.out.println(str instanceof String);  // 输出：true

Object obj = "World";
System.out.println(obj instanceof String);  // 输出：true
System.out.println(obj instanceof Integer); // 输出：false
```

### 1.5 继承类型

1. 单继承
2. 多层继承：一个类可以继承一个已经是子类的类，形成继承链
3. 层级继承：一个父类可以被多个子类继承

无多重继承，这是为了避免“菱形问题”带来的复杂性和歧义。Java 通过 Interface 来变相实现多重继承的好处。一个类可以实现多个接口

### 1.6 `abstract`

#### 1.6.1 抽象方法

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

#### 1.6.2 抽象类

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

