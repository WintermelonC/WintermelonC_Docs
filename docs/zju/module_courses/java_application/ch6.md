# 6 Exception and RTTI

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Exception

Java 的异常机制旨在提供一种结构化的、可维护的方式来处理运行时错误。其核心优势是：

1. 将错误处理代码与业务逻辑代码分离，提高程序的可读性和可维护性
2. 提供调用栈信息，便于调试
3. 可以强制调用者处理异常，提高程序的健壮性

Java 中所有异常和错误的根类是 `java.lang.Throwable`

```text linenums="1"
java.lang.Object
    └── java.lang.Throwable
        ├── java.lang.Error
        └── java.lang.Exception
            ├── RuntimeException (Unchecked Exception)
            └── 其他 Exception (Checked Exception，除了 RuntimeException 以外的 Exception 子类)
```

!!! tip "Error"

    指程序无法处理的严重错误，通常与 JVM 或系统资源相关。应用程序不应试图捕获和处理它们。特点是非检查异常
    
    常见例子：
    
    1. `OutOfMemoryError`：内存耗尽
    2. `StackOverflowError`：栈溢出
    3. `VirtualMachineError`：虚拟机错误

Exception：程序本身可以处理的异常。它是异常处理的核心。分为检查异常和非检查异常

| 特性 | 检查异常 | 非检查异常 |
| :--: | -- | -- |
| 继承自 | `Exception` 的直接子类（不包括 `RuntimeException`） | `RuntimeException` 及其子类，以及 `Error` 及其子类 |
| 编译器检查 | 强制检查。编译器要求必须被捕获 (`try-catch`) 或声明抛出 (`throws`) | 不强制检查。编译器不要求必须处理，可以自由选择是否捕获 |
| 处理要求 | 必须显式处理，否则编译不通过 | 可处理可不处理 |
| 设计理念 | 表示程序可预见、可恢复的问题，通常与外部资源有关（如文件不存在、网络中断）。调用者应该有能力处理 | 表示程序逻辑错误或编程错误，通常应由程序员修复代码而不是捕获处理（如空指针、数组越界）|
| 常见例子 | `IOException`, `SQLException`, `ClassNotFoundException`, `FileNotFoundException` | `NullPointerException`, `ArrayIndexOutOfBoundsException`, `IllegalArgumentException`, `ClassCastException` |

### 1.1 自定义异常

- 继承 `Exception`：创建检查异常（必须处理）
- 继承 `RuntimeException`：创建非检查异常（可选处理）

通常需要实现以下 4 个标准构造方法：

```java linenums="1"
public class MyBusinessException extends Exception {
    // 无参构造方法
    public MyBusinessException() {
        super();
    }

    // 带有详细消息的构造方法
    public MyBusinessException(String message) {
        super(message);
    }
    
    // 带有详细消息和原因的构造方法（异常链）
    public MyBusinessException(String message, Throwable cause) {
        super(message, cause);
    }
    
    // 带有原因的构造方法
    public MyBusinessException(Throwable cause) {
        super(cause);
    }
}
```

??? example "示例"

    ```java linenums="1"
    public class UserNotFoundException extends Exception {
        
        private String userId;
        private String searchCriteria;
        
        // 基本构造方法
        public UserNotFoundException(String message) {
            super(message);
        }
        
        // 带用户ID的构造方法
        public UserNotFoundException(String message, String userId) {
            super(message);
            this.userId = userId;
        }
        
        // 完整的构造方法
        public UserNotFoundException(String message, String userId, String searchCriteria) {
            super(message);
            this.userId = userId;
            this.searchCriteria = searchCriteria;
        }
        
        // 带异常链的构造方法
        public UserNotFoundException(String message, String userId, Throwable cause) {
            super(message, cause);
            this.userId = userId;
        }
        
        // Getter 方法
        public String getUserId() {
            return userId;
        }
        
        public String getSearchCriteria() {
            return searchCriteria;
        }
        
        // 重写getMessage以包含额外信息
        @Override
        public String getMessage() {
            String baseMessage = super.getMessage();
            if (userId != null) {
                return baseMessage + " [用户ID: " + userId + "]";
            }
            return baseMessage;
        }
    }
    ```

### 1.2 `Throwable` 方法

| 方法 | 描述 |
| -- | -- |
| `String getMessage()` | 返回此 throwable 的详细消息字符串 |
| `String toString()` | 返回此 throwable 的简短描述 |
| `void printStackTrace()` | 将此 throwable 及其堆栈跟踪打印到标准错误流 |
| `void printStackTrace(PrintStream s)` | 将此 throwable 及其堆栈跟踪打印到指定打印流 |
| `Throwable getCause()` | 返回此 throwable 的原因（如果原因不存在，则返回 `null`） |

### 1.3 关键字

Java 提供了 5 个关键字用于异常处理：`try`, `catch`, `finally`, `throw`, `throws`

#### 1.3.1 try-catch-finally

用于捕获和处理异常

1. 有了 `finally` 块，可以没有 `catch` 块
2. 有了 `catch` 块，可以没有 `finally` 块

```java linenums="1"
try {
    // 可能会抛出异常的代码块
    FileInputStream file = new FileInputStream("nonexistent.txt");
} catch (FileNotFoundException e) {
    // 捕获并处理特定的异常
    System.err.println("文件未找到: " + e.getMessage());
} catch (IOException e) {
    // 可以捕获多个异常，更具体的异常应放在前面
    System.err.println("发生IO错误");
} catch (Exception e) {
    // 捕获所有其他异常（兜底）
    System.err.println("发生未知错误");
} finally {
    // 无论是否发生异常，都会执行的代码块
    // 常用于释放资源，如关闭文件、数据库连接等
    System.out.println("finally块始终执行");
}
```

!!! tip "多异常捕获"

    使用 `|` 符号捕获多异常

    ```java linenums="1"
    try {
        // 可能会抛出多种异常的代码
    } catch (ExceptionType1 | ExceptionType2 | ExceptionType3 e) {
        // 处理这些异常的通用代码
    }
    ```

    如果多个异常有继承关系，编译器会报错，因为子类已经被父类包含

!!! tip "try-with-resources"

    可以自动关闭实现了 `AutoCloseable` 接口的资源，比 `finally` 块更简洁安全

    ```java linenums="1"
    try (FileInputStream file = new FileInputStream("file.txt");
         BufferedReader br = new BufferedReader(new InputStreamReader(file))) {
        // 使用资源
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    } catch (IOException e) {
        // 处理异常，资源会自动关闭
        e.printStackTrace();
    }
    ```

##### finally 块

!!! tip "finally 中返回值"

    ```java linenums="1"
    public class FinallyReturnDemo {
        
        public static int testReturn() {
            try {
                System.out.println("try块");
                throw new RuntimeException("异常发生");
            } catch (RuntimeException e) {
                System.out.println("catch块");
                return 1; // 这个返回值会被finally覆盖
            } finally {
                System.out.println("finally块");
                return 2; // finally中的return会覆盖catch中的return
            }
        }
        
        public static void main(String[] args) {
            int result = testReturn();
            System.out.println("返回值: " + result); // 输出: 返回值: 2
        }
    }
    ```

!!! tip "finally 中抛出异常"

    ```java linenums="1"
    public class FinallyThrowDemo {
        
        public static void testFinallyThrow() {
            try {
                System.out.println("try块开始");
                throw new IllegalArgumentException("第一个异常");
            } catch (IllegalArgumentException e) {
                System.out.println("catch块捕获: " + e.getMessage());
                throw new RuntimeException("第二个异常"); // 这个异常会被finally中的异常覆盖
            } finally {
                System.out.println("finally块执行");
                throw new IllegalStateException("finally中的异常"); // 这个会覆盖前面的异常
            }
        }
        
        public static void main(String[] args) {
            try {
                testFinallyThrow();
            } catch (Exception e) {
                System.out.println("main捕获: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                // 输出: main捕获: IllegalStateException: finally中的异常
            }
        }
    }
    ```

!!! tip "finally 修改返回值（对于引用类型）"

    ```java linenums="1"
    public class FinallyModifyDemo {
        
        static class Data {
            String value;
            Data(String value) { this.value = value; }
        }
        
        public static Data testModify() {
            Data data = new Data("初始值");
            try {
                System.out.println("try块");
                throw new RuntimeException("发生异常");
            } catch (RuntimeException e) {
                System.out.println("catch块");
                data.value = "catch修改";
                return data; // 返回的是引用
            } finally {
                System.out.println("finally块");
                data.value = "finally修改"; // 修改引用指向的对象内容
                // data = new Data("新对象"); // 如果这样写，不会影响返回值
            }
        }
        
        public static void main(String[] args) {
            Data result = testModify();
            System.out.println("返回值: " + result.value); // 输出: 返回值: finally修改
        }
    }
    ```

#### 1.3.2 throw

用于在方法内部主动抛出一个异常对象

```java linenums="1"
public void setAge(int age) {
    if (age < 0 || age > 150) {
        // 抛出一个运行时异常（非检查异常）
        throw new IllegalArgumentException("年龄不合法: " + age);
    }
    this.age = age;
}
```

在捕获一个异常后抛出另一个异常时，应将原始异常作为新异常的 `cause`（通过构造方法传入），保留完整的堆栈信息

```java linenums="1"
catch (IOException e) {
    throw new MyBusinessException("业务处理失败", e); // e 作为 cause
}
```

!!! tip "执行顺序"

    `finally` 块会在 `throw` 执行后、方法返回前被执行

    ```java linenums="1"
    public class ThrowFinallyDemo {

        public static void main(String[] args) {
            try {
                testMethod();
            } catch (Exception e) {
                System.out.println("main中捕获到异常: " + e.getMessage());
            }
        }
        
        public static void testMethod() throws Exception {
            try {
                System.out.println("1. try块开始");
                throw new RuntimeException("测试异常");
            } catch (RuntimeException e) {
                System.out.println("2. catch块开始");
                throw new Exception("重新抛出的异常", e); // 这里不会立即返回！
            } finally {
                System.out.println("3. finally块执行"); // 这行一定会执行
            }
            // System.out.println("这行不会执行"); // 编译错误，不可达代码
        }
    }
    ```

    ```java linenums="1" title="output"
    1. try块开始
    2. catch块开始
    3. finally块执行
    main中捕获到异常: 重新抛出的异常
    ```

#### 1.3.3 throws

用于在方法声明中指明该方法可能抛出的检查异常，将异常抛给方法的调用者处理，==且调用者必须处理==

```java linenums="1"
// 这个方法声明它可能抛出 IOException，调用者必须处理
public void readFile() throws IOException {
    FileReader reader = new FileReader("somefile.txt");
    // ... 操作文件
}
```

1. 子类重写父类方法时，不能抛出比父类方法更宽泛（更多）的检查异常，但可以抛出非检查异常
2. 对于构造函数，子类构造函数的异常声明不受父类构造函数异常声明的限制，但必须在子类构造函数中处理父类构造函数可能抛出的检查异常

??? example "构造函数示例"

    ```java linenums="1" title="编译错误"
    class Parent {
        public Parent() throws FileNotFoundException {
            // Implementation
        }
    }
    
    class Child extends Parent {
        public Child() {
            // Implementation
            // super();  // 编译错误
        }
    }
    ```

    ```java linenums="1" title="编译正确"
    class Parent {
        public Parent() throws FileNotFoundException {
            // Implementation
        }
    }
    
    class Child extends Parent {
        public Child() throws IOException, SQLException {
            // Implementation
            super();
        }
    }
    ```

## 2 RTTI

RTTI（Run-Time Type Information）即运行时类型信息。它允许程序在运行时发现和使用类型信息

Java 通过以下几种机制实现 RTTI：

1. 传统的类型转换（由 RTTI 确保类型安全）
2. `Class` 对象（代表运行时的类型）
3. `instanceof` 关键字（类型检查）
4. 反射机制（更强大的运行时类型操作）

### 2.1 传统的类型转换

```java linenums="1"
class Animal {
    public void eat() {
        System.out.println("Animal eating");
    }
}

class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("Dog eating");
    }
    
    public void bark() {
        System.out.println("Dog barking");
    }
}

class Cat extends Animal {
    @Override
    public void eat() {
        System.out.println("Cat eating");
    }
}

public class Test {
    public static void main(String[] args) {
        Animal animal = new Dog(); // 向上转型
        
        // 编译时类型：Animal
        // 运行时类型：Dog
        
        animal.eat(); // 输出 "Dog eating" - 多态
        
        // 需要调用Dog特有的方法，必须向下转型
        if (animal instanceof Dog) {
            Dog dog = (Dog) animal; // 向下转型 - RTTI在这里起作用
            dog.bark(); // 输出 "Dog barking"
        }
        
        // 不安全的转型会导致ClassCastException
        Animal animal2 = new Cat();
        // Dog dog2 = (Dog) animal2; // 运行时抛出ClassCastException
    }
}
```

RTTI 的作用：在转型时，Java 会在运行时检查对象的实际类型，确保转型是安全的

### 2.2 Class 对象

在 Java 中，每个类都有一个对应的 `Class` 对象，它包含了该类的所有类型信息

获取 `Class` 对象的 3 种方式

```java linenums="1"
class MyClass {
    // 类定义
}

public class ClassObjectDemo {
    public static void main(String[] args) throws Exception {
        // 方式1: 类字面常量 .class (最安全，编译时检查)
        Class<MyClass> clazz1 = MyClass.class;
        
        // 方式2: Object.getClass() 方法 (需要已有对象实例)
        MyClass obj = new MyClass();
        Class<? extends MyClass> clazz2 = obj.getClass();
        
        // 方式3: Class.forName() (动态加载，可能抛出ClassNotFoundException)
        Class<?> clazz3 = Class.forName("com.example.MyClass");
        
        System.out.println(clazz1 == clazz2); // true
        System.out.println(clazz2 == clazz3); // true
    }
}
```

Class 对象的常用方法

```java linenums="1"
public class ClassMethodsDemo {
    public static void main(String[] args) {
        Class<String> stringClass = String.class;
        
        // 获取类型信息
        System.out.println("类名: " + stringClass.getName());        // java.lang.String
        System.out.println("简单类名: " + stringClass.getSimpleName()); // String
        System.out.println("规范类名: " + stringClass.getCanonicalName()); // java.lang.String
        
        // 类型关系检查
        System.out.println("是否是接口: " + stringClass.isInterface()); // false
        System.out.println("是否是数组: " + stringClass.isArray());     // false
        System.out.println("父类: " + stringClass.getSuperclass());    // class java.lang.Object
        
        // 创建实例
        try {
            String str = stringClass.newInstance(); // 调用无参构造函数
            System.out.println("创建的字符串: '" + str + "'");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 2.3 `instanceof` 关键字

`instanceof` 用于在运行时检查对象是否是特定类型或其子类型的实例

```java linenums="1"
class Vehicle {}
class Car extends Vehicle {}
class Bike extends Vehicle {}
class SportsCar extends Car {}

public class InstanceofDemo {
    public static void checkVehicle(Vehicle vehicle) {
        System.out.println("检查车辆: " + vehicle.getClass().getSimpleName());
        
        // instanceof 检查
        if (vehicle instanceof Vehicle) {
            System.out.println("  - 是Vehicle");
        }
        if (vehicle instanceof Car) {
            System.out.println("  - 是Car");
        }
        if (vehicle instanceof SportsCar) {
            System.out.println("  - 是SportsCar");
        }
        if (vehicle instanceof Bike) {
            System.out.println("  - 是Bike");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        checkVehicle(new Vehicle());
        checkVehicle(new Car());
        checkVehicle(new SportsCar());
        checkVehicle(new Bike());
    }
}
```

```java linenums="1" title="output"
检查车辆: Vehicle
  - 是Vehicle

检查车辆: Car
  - 是Vehicle
  - 是Car

检查车辆: SportsCar
  - 是Vehicle
  - 是Car
  - 是SportsCar

检查车辆: Bike
  - 是Vehicle
  - 是Bike
```

### 2.4 Reflection

反射机制允许在运行时检查类的结构（方法、字段、构造函数等）并动态操作

```java linenums="1"
import java.lang.reflect.*;

class Person {
    private String name;
    private int age;
    
    public Person() {}
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void sayHello() {
        System.out.println("Hello, I'm " + name + ", " + age + " years old.");
    }
    
    private void secretMethod() {
        System.out.println("This is a private method!");
    }
    
    // getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        // 获取Class对象
        Class<Person> personClass = Person.class;
        
        // 1. 获取构造函数信息
        System.out.println("=== 构造函数 ===");
        Constructor<?>[] constructors = personClass.getConstructors();
        for (Constructor<?> constructor : constructors) {
            System.out.println("构造函数: " + constructor);
        }
        
        // 2. 获取方法信息
        System.out.println("\n=== 方法 ===");
        Method[] methods = personClass.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println("方法: " + method.getName() + 
                             ", 返回类型: " + method.getReturnType() +
                             ", 修饰符: " + Modifier.toString(method.getModifiers()));
        }
        
        // 3. 获取字段信息
        System.out.println("\n=== 字段 ===");
        Field[] fields = personClass.getDeclaredFields();
        for (Field field : fields) {
            System.out.println("字段: " + field.getName() + 
                             ", 类型: " + field.getType() +
                             ", 修饰符: " + Modifier.toString(field.getModifiers()));
        }
        
        // 4. 动态创建对象并调用方法
        System.out.println("\n=== 动态操作 ===");
        
        // 使用反射创建对象
        Constructor<Person> constructor = personClass.getConstructor(String.class, int.class);
        Person person = constructor.newInstance("Alice", 25);
        
        // 调用公共方法
        Method sayHelloMethod = personClass.getMethod("sayHello");
        sayHelloMethod.invoke(person);
        
        // 调用私有方法（需要设置可访问性）
        Method secretMethod = personClass.getDeclaredMethod("secretMethod");
        secretMethod.setAccessible(true); // 突破封装性！
        secretMethod.invoke(person);
        
        // 访问私有字段
        Field nameField = personClass.getDeclaredField("name");
        nameField.setAccessible(true);
        nameField.set(person, "Bob"); // 修改私有字段的值
        sayHelloMethod.invoke(person); // 再次调用，看到变化
    }
}
```

```java linenums="1" title="output"
=== 构造函数 ===
构造函数: public Person()
构造函数: public Person(java.lang.String,int)

=== 方法 ===
方法: getName, 返回类型: class java.lang.String, 修饰符: public
方法: setName, 返回类型: void, 修饰符: public
方法: sayHello, 返回类型: void, 修饰符: public
方法: secretMethod, 返回类型: void, 修饰符: private
方法: getAge, 返回类型: int, 修饰符: public
方法: setAge, 返回类型: void, 修饰符: public

=== 字段 ===
字段: name, 类型: class java.lang.String, 修饰符: private
字段: age, 类型: int, 修饰符: private

=== 动态操作 ===
Hello, I'm Alice, 25 years old.
This is a private method!
Hello, I'm Bob, 25 years old.
```
