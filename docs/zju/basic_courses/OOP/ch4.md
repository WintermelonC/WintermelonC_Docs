# 4 Inside Object

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. Homework 的部分答案由 AI 生成

## 1 访问权限

在 C++ 中，类的成员（包括成员变量和成员函数）可以有三种访问权限：`public`、`protected` 和 `private`。这些访问权限控制了类的成员在类的外部和派生类中的可见性和可访问性

- `public` 访问权限：公有成员可以在类的外部和派生类中访问
- `protected` 访问权限：受保护成员只能在类的内部和派生类中访问，不能在类的外部访问
- `private` 访问权限：私有成员只能在类的内部访问，不能在类的外部和派生类中访问
      1. 类成员的缺省访问权限是 `private`
      2. 在结构体（struct）中，默认的访问权限是 `public`

### 1.1 `public`

- 说明: 公有成员可以在类的外部和派生类中访问
- 用途: 通常用于定义类的接口，使得类的用户可以访问和使用这些成员

```cpp linenums="1"
class MyClass {
public:
    int publicVar;

    void publicMethod()
    {
        // 公有成员函数
    }
};

int main()
{
    MyClass obj;
    obj.publicVar = 10; // 可以在类的外部访问公有成员变量
    obj.publicMethod(); // 可以在类的外部调用公有成员函数
    return 0;
}
```

### 1.2 `protected`

- 说明: 受保护成员只能在类的内部和派生类中访问，不能在类的外部访问
- 用途: 通常用于定义类的实现细节，使得派生类可以访问和使用这些成员，但类的用户不能直接访问

```cpp linenums="1"
class Base {
protected:
    int protectedVar;

    void protectedMethod()
    {
        // 受保护成员函数
    }
};

class Derived : public Base {
public:
    void accessProtectedMembers()
    {
        protectedVar = 20; // 可以在派生类中访问受保护成员变量
        protectedMethod(); // 可以在派生类中调用受保护成员函数
    }
};

int main()
{
    Derived obj;
    obj.accessProtectedMembers();
    // obj.protectedVar = 10; // 错误：不能在类的外部访问受保护成员变量
    // obj.protectedMethod(); // 错误：不能在类的外部调用受保护成员函数
    return 0;
}
```

### 1.3 `private`

<div class="annotate" markdown>

- 说明: 私有成员只能在类的内部（边界是类，而不是对象 (1)）访问，不能在类的外部和派生类中访问
- 用途: 通常用于定义类的实现细节，使得这些成员只能在类的内部使用，不能在类的外部和派生类中直接访问

</div>

1. 意味着同一个类的不同对象可以互相访问私有变量

```cpp linenums="1"
class MyClass {
private:
    int privateVar;

    void privateMethod()
    {
        // 私有成员函数
    }

public:
    void accessPrivateMembers()
    {
        privateVar = 30; // 可以在类的内部访问私有成员变量
        privateMethod(); // 可以在类的内部调用私有成员函数
    }
};

int main()
{
    MyClass obj;
    obj.accessPrivateMembers();
    // obj.privateVar = 10; // 错误：不能在类的外部访问私有成员变量
    // obj.privateMethod(); // 错误：不能在类的外部调用私有成员函数
    return 0;
}
```

#### 1.3.1 友元

## 2 作用域

### 2.1 Local Object

- fields：字段
- parameters：参数
- local variables：本地/局部变量

### 2.2 Global Object

### 2.3 Static

#### 静态（普通）函数

#### 静态全局变量

#### 静态局部变量

#### 静态成员变量

#### 静态成员函数