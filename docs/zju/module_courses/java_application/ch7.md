# 7 Optional and IO

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Optional

`Optional` 是 Java 8 引入的一个容器类，用于表示一个值可能存在也可能不存在。它主要解决空指针异常（`NullPointerException`）问题

应该使用 `Optional` 的情况：

1. 方法返回值，明确表示可能没有结果
2. 在流式操作中处理可能为空的值
3. 需要链式调用且中间步骤可能为空的场景

不应该使用 `Optional` 的情况：

1. 不要作为方法参数
2. 不要作为类字段
3. 不要用在集合中：例如 `List<Optional<String>>`

### 1.1 Optional 方法

| 方法 | 功能 | 说明 |
| -- | -- | -- |
| `empty()` | 返回一个空的 `Optional` 实例 | 该实例不包含任何值，常用于表示“无结果” |
| `of(T value)` | 返回一个包含指定非空值的 `Optional` 实例 | 若传入 `null`，会立即抛出 `NullPointerException` |
| `ofNullable(T value)` | 返回一个包含指定值的 `Optional` 实例，若值为 `null` 则返回空 `Optional` | 安全地包装可能为 `null` 的值 |
| `boolean isPresent()` | 判断 `Optional` 是否包含值 | 如果有值返回 `true`，否则返回 `false` |
| `boolean isEmpty()` | 判断 `Optional` 是否值为空 | 如果值为空返回 `true`，否则返回 `false` |
| `T get()` | 获取 `Optional` 中的值 | 如果值不存在（即为空），会抛出 `NoSuchElementException` |
| `T orElse(T other)` | 如果存在值则返回该值，否则返回指定的默认值 | 常用于提供备选值 |
| `T orElseGet(Supplier)` | 如果存在值则返回该值，否则调用 `supplier` 获取默认值 | 与 `orElse` 不同，`supplier` 是惰性求值的 |
| `T orElseThrow()` | 如果存在值则返回该值，否则抛出 `NoSuchElementException` | 可以抛出自定义异常类型 |
| `ifPresent(Consumer)` | 如果存在值，则执行给定的消费操作 | 用于替代 `if (value != null)` 的写法 |
| `ifPresentOrElse(Consumer, Consumer)` | 如果存在值，执行第一个消费操作，否则执行第二个 | 用于替代 `if (value != null) else` 的写法 |
| `map(Function)` | 如果存在值，则对其应用映射函数，并返回包装结果的 `Optional` | 若映射结果为 `null`，则返回空 `Optional` |
| `flatMap(Function)` | 如果存在值，则对其应用映射函数，该函数必须返回 `Optional`，并直接返回该结果 | 用于链式调用，避免嵌套 `Optional<Optional<T>>` |
| `filter(Predicate)` | 如果存在值且满足断言条件，则返回当前 `Optional`，否则返回空 `Optional` | 用于条件过滤 |

?? example "创建 `Optional` 对象"

    ```java linenums="1"
    // 创建空的 Optional
    Optional<String> emptyOptional = Optional.empty();
    // 创建包含非空值的 Optional
    String value = "Hello";
    Optional<String> optional = Optional.of(value); // 如果value为null会抛NPE
    // 创建可能为空的 Optional
    String possibleNullValue = getPossibleNullValue();
    Optional<String> optional = Optional.ofNullable(possibleNullValue);
    ```

??? example "检查值是否存在"

    ```java linenums="1"
    Optional<String> optional = Optional.of("Hello");
    if (optional.isPresent()) {
        System.out.println("值存在: " + optional.get());
    }
    
    Optional<String> optional = Optional.empty();
    if (optional.isEmpty()) {
        System.out.println("值为空");
    }
    ```

??? example "获取值的方法"

    ```java linenums="1"
    Optional<String> optional = Optional.of("Hello");
    String value = optional.get(); // 如果为空会抛NoSuchElementException
    
    Optional<String> optional = Optional.empty();
    String value = optional.orElse("默认值"); // 返回"默认值"
    
    Optional<String> optional = Optional.empty();
    String value = optional.orElseGet(() -> "生成的默认值");
    
    // 抛出默认异常
    Optional<String> optional = Optional.empty();
    String value = optional.orElseThrow();
    // 抛出自定义异常
    String value = optional.orElseThrow(() -> new IllegalArgumentException("值不能为空"));
    ```

??? example "函数式操作"

    ```java linenums="1"
    Optional<String> optional = Optional.of("Hello");
    optional.ifPresent(value -> System.out.println("值: " + value));
    
    Optional<String> optional = Optional.empty();
    optional.ifPresentOrElse(
        value -> System.out.println("值: " + value),
        () -> System.out.println("值为空")
    );
    
    Optional<String> optional = Optional.of("hello");
    Optional<String> upperCase = optional.map(String::toUpperCase);
    // 结果: Optional["HELLO"]
    Optional<String> empty = Optional.<String>empty();
    Optional<String> stillEmpty = empty.map(String::toUpperCase);
    // 结果: Optional.empty
    
    class User {
        private String name;
        private Optional<Address> address;
        
        public Optional<Address> getAddress() {
            return address;
        }
    }
    Optional<User> user = Optional.of(new User());
    Optional<String> street = user.flatMap(User::getAddress)
                                  .map(Address::getStreet);
    
    Optional<String> optional = Optional.of("hello");
    Optional<String> filtered = optional.filter(s -> s.length() > 3);
    // 结果: Optional["hello"]
    Optional<String> shortString = Optional.of("hi");
    Optional<String> empty = shortString.filter(s -> s.length() > 3);
    // 结果: Optional.empty
    ```

## 2 Input and Output

Java 的 I/O API：

1. `InputStream` / `OutputStream`：用于处理以字节为单位的二进制数据。适用于图片、音频、视频等非文本数据
2. `Reader` / `Writer`：用于处理以字符为单位的文本数据。支持字符编码（如 UTF-8），适合处理字符串和文本文件
3. NIO：使用 Channel + Buffer 模型。支持非阻塞、异步访问。主要关注 Socket 网络通信
4. NIO 2.0：引入 `Path`、`Files`、`AsynchronousFileChannel` 等类。更关注文件系统操作和异步文件读写

### 2.1 InputStream and OutputStream

分为两大类：

1. Media Stream（介质流）：代表各种实际介质，处理底层 I/O 操作。是其他流类的底层基础

    - `FileInputStream`：从文件读取字节
    - `ByteArrayInputStream`：从字节数组读取
    - `PipedInputStream`：从管道读取

2. Filter Stream（过滤流）：提供对各类数据的增强读写功能，可以连接 / 堆叠在其他流上。与用户程序的接口，在实际流之上进行数据操作

    - `DataInputStream`：读取基本数据类型（`int`、`double` 等）
    - `ZipInputStream`：读取压缩文件数据
    - `ObjectInputStream`：读取序列化对象

#### 2.1.1 InputStream 方法

| 方法 | 功能 | 说明 |
| -- | -- | -- |
| `int read()` | 读取单个字节，返回 0-255，流末尾返回 -1 | |
| `int read(byte b[])` | 读取字节到数组，返回实际读取字节数 | |
| `int read(byte[] b, int off, int len)` | 读取指定长度的字节到数组的指定位置 | |
| `long skip(long n)` | 跳过并丢弃 n 个字节的数据 | |
| `int available()` | 返回可不受阻塞读取的字节数估计值 | |
| `void mark(int readlimit)` | 在当前位置设置标记 | `readlimit`：标记失效前最大读取字节数 |
| `void reset()` | 重置到最近一次 `mark()` 标记的位置 | |
| `boolean markSupported()` | 判断流是否支持 mark / reset 操作 | |
| `void close()` | 关闭流并释放系统资源 | |

> mark / reset 功能不是所有流都支持，需要先检查 `markSupported()`

编码处理：程序可以从操作系统获取本地文字编码，在用字节数组构造 `String` 对象时可以指定不同的文字编码

```java linenums="1"
byte[] data = inputStream.readAllBytes();
// 使用平台默认编码
String text1 = new String(data);
// 指定 UTF-8 编码
String text2 = new String(data, "UTF-8");
// 使用系统默认编码
String text3 = new String(data, Charset.defaultCharset());
```

#### 2.1.2 OutputStream 方法

| 方法 | 功能 | 说明 |
| -- | -- | -- |
| `write(int b)` | 写入单个字节，高 24 位被忽略 | |
| `write(byte b[])` | 写入整个字节数组的所有内容 | |
| `write(byte[] b, int off, int len)` | 写入字节数组的指定部分 | |
| `flush()` | 刷新输出流，强制将所有缓冲数据写入目标 | |
| `close()` | 关闭流并释放系统资源，自动调用 `flush()` | |

```java linenums="1"
try (OutputStream os = new FileOutputStream("output.txt")) {
    byte[] data = "Hello World".getBytes();
    // 写入单个字节
    os.write('A');
    // 写入整个数组
    os.write(data);
    // 写入数组的一部分
    os.write(data, 0, 5);  // 只写入 "Hello"
    // 强制刷新缓冲区
    os.flush();
} catch (IOException e) {
    e.printStackTrace();
}
```

#### 2.1.3 DataInputStream and DataOutputStream

用于处理基本数据类型的流类

```java linenums="1"
// 写入数据
try (DataOutputStream dos = new DataOutputStream(new FileOutputStream("data.bin"))) {
    dos.writeInt(123);           // 写入 int
    dos.writeDouble(3.14);       // 写入 double
    dos.writeUTF("Hello");       // 写入 UTF 字符串
    dos.writeBoolean(true);      // 写入 boolean
}

// 读取数据
try (DataInputStream dis = new DataInputStream(new FileInputStream("data.bin"))) {
    int num = dis.readInt();              // 读取 int
    double value = dis.readDouble();      // 读取 double
    String text = dis.readUTF();          // 读取 UTF 字符串
    boolean flag = dis.readBoolean();     // 读取 boolean
}
```

#### 2.1.4 ZipInputStream and ZipOutputStream

Java 标准库自带的 ZIP 压缩 / 解压包装流

工作方式：

1. 线性处理：必须一个条目一个条目地顺序进行读写
2. 流式处理：类似于磁带，只能从前到后顺序访问

```java linenums="1"
// 压缩文件示例
try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream("archive.zip"))) {
    // 第一个条目
    zos.putNextEntry(new ZipEntry("file1.txt"));
    zos.write("文件1内容".getBytes());
    zos.closeEntry();
    
    // 第二个条目
    zos.putNextEntry(new ZipEntry("file2.txt"));
    zos.write("文件2内容".getBytes());
    zos.closeEntry();
}
```

```java linenums="1"
// 解压文件示例
try (ZipInputStream zis = new ZipInputStream(new FileInputStream("archive.zip"))) {
    ZipEntry entry;
    while ((entry = zis.getNextEntry()) != null) {
        System.out.println("处理文件: " + entry.getName());
        // 读取当前条目内容...
        zis.closeEntry();
    }
}
```

### 2.2 Reader and Writer

Java 中用于处理文本数据的字符流类

!!! tip "文件编码处理"

    理想情况：

    ```java linenums="1"
    // 如果文件本身是 Unicode-16 编码
    FileReader reader = new FileReader("file.txt");
    FileWriter writer = new FileWriter("file.txt");
    ```

    实际情况：需要编码转换

    ```java linenums="1"
    // 大多数情况下需要使用桥接类指定编码
    InputStreamReader reader = new InputStreamReader(
        new FileInputStream("file.txt"), "UTF-8");
    
    OutputStreamWriter writer = new OutputStreamWriter(
        new FileOutputStream("file.txt"), "GBK");
    ```

    `InputStreamReader` / `OutputStreamWriter` 的作用就是字节流与字符流之间的桥接

!!! tip "Java I/O 流的桥接组合"

    ```java linenums="1"
    PrintWriter pw = new PrintWriter(
        new BufferedWriter(
        new OutputStreamWriter(
        new FileOutputStream("abc.txt"), "GBK")));
    ```

    1. `PrintWriter`：提供 `print()`、`println()`、`format()` 等方法
    2. `BufferedWriter`：提供缓冲功能，减少实际 I/O 操作次数，提高性能
    3. `OutputStreamWriter`：将 Unicode 字符转换为 GBK 编码的字节，将字符流转换为字节流
    4. `FileOutputStream`：基础字节流，负责将字节数据写入文件

### 2.3 File

`File` 对象是对文件或目录路径的抽象表示，创建 `File` 对象不验证文件 / 目录是否实际存在

创建 `File` 对象：

```java linenums="1"
// 代表单个文件
File file = new File("document.txt");
// 代表目录
File directory = new File("/path/to/directory");
// 使用父路径和子路径
File fileInDir = new File(directory, "file.txt");
```

常用操作：

```java linenums="1"
File file = new File("test.txt");
// 检查存在性
boolean exists = file.exists();
// 检查是否是文件
boolean isFile = file.isFile();
// 检查是否是目录
boolean isDirectory = file.isDirectory();
// 获取文件名
String fileName = file.getName();
// 删除文件
boolean deleted = file.delete();
// 创建目录
File dir = new File("newFolder");
boolean created = dir.mkdir();
```

## 3 Object Serialization

对象序列化是将 Java 对象转换为字节序列的过程，以便存储到文件中、通过网络传输、在进程间传递。反序列化则是将字节序列重新构造为 Java 对象

会被序列化的内容：

1. 非 `transient` 的实例变量
2. 对象引用（递归序列化整个对象图）
3. 数组元素
4. 集合内容

不会被序列化的内容：

1. `transient` 修饰的字段
2. 静态变量（`static`）
3. 方法（包括构造方法）
4. 类定义本身

使用 `Serializable` 标记接口：

```java linenums="1"
import java.io.Serializable;

public class Person implements Serializable {
    private String name;
    private int age;
    private transient String password;  // transient 字段不会被序列化
    
    // 构造方法、getter、setter...
}
```

对象序列化：

```java linenums="1"
// 创建对象
Person person = new Person("张三", 25, "secret123");

try (ObjectOutputStream oos = new ObjectOutputStream(
    new FileOutputStream("person.ser"))) {
    
    oos.writeObject(person);  // 序列化对象到文件
    System.out.println("对象序列化完成");
} catch (IOException e) {
    e.printStackTrace();
}
```

对象反序列化：

```java linenums="1"
try (ObjectInputStream ois = new ObjectInputStream(
    new FileInputStream("person.ser"))) {
    
    Person restoredPerson = (Person) ois.readObject();  // 反序列化
    System.out.println("姓名: " + restoredPerson.getName());
    System.out.println("年龄: " + restoredPerson.getAge());
    System.out.println("密码: " + restoredPerson.getPassword());  // 输出 null
    
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

!!! tip "自定义序列化逻辑"

    ```java linenums="1"
    public class CustomObject implements Serializable {
        private String data;
        
        // 自定义序列化逻辑
        private void writeObject(ObjectOutputStream oos) throws IOException {
            oos.defaultWriteObject();  // 默认序列化
            oos.writeUTF(data.toUpperCase());  // 自定义处理
        }
        
        // 自定义反序列化逻辑
        private void readObject(ObjectInputStream ois) 
            throws IOException, ClassNotFoundException {
            ois.defaultReadObject();  // 默认反序列化
            this.data = ois.readUTF().toLowerCase();  // 自定义处理
        }
    }
    ```

序列化版本标识符 `serialVersionUID` 用于验证序列化对象的发送方和接收方是否兼容，确保反序列化时类的版本匹配

推荐显式声明：

```java linenums="1"
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;  // 显式声明
    
    private String name;
    private int age;
}
```

!!! tip "UID 的作用机制"

    ```java linenums="1" title="序列化时"
    Person person = new Person("张三", 25);
    try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("person.ser"))) {
        
        oos.writeObject(person);  // 写入对象数据和 serialVersionUID
    }
    ```
    ```java linenums="1" title="反序列化时"
    try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("person.ser"))) {
        
        // JVM 检查当前类的 serialVersionUID 与文件中的是否匹配
        Person person = (Person) ois.readObject();
    }
    ```

    如果不显式声明，类结构改变会导致自动生成的 UID 变化，旧版本反序列化到新版本可能会抛出 `InvalidClassException`。而如果显式声明，一些情况下能够自动兼容

    | 修改类型 | 是否兼容 | 说明 |
    | :--: | :--: | :--: |
    | 添加字段 | 兼容 | 反序列化时新字段为默认值 |
    | 删除字段 | 兼容 | 忽略序列化数据中的多余字段 |
    | 修改字段类型 | 不兼容 | 类型不匹配 |
    | 修改类继承关系 | 不兼容 | 类结构重大变化 |
    | 修改 `transient` / `static` | 兼容 | 不影响序列化 |

!!! question "Java 序列化在网络传输中"

    序列化一个对象并通过互联网发送到远程端点，对方能否成功反序列化这个对象？

    答案是不能反序列化。因为类的定义（`class` 文件）不会随对象一起序列化

    解决方案：

    1. 使用共享类文件。双方必须都有相同的类文件
    2. 使用接口和已知类型。定义双方都知道的接口，反序列化到已知类型
    3. 使用标准数据格式替代。使用 JSON 等平台无关格式，接收方只需要知道数据结构，不需要类定义
    4. 动态类加载

### 3.1 Externalizable

`Externalizable` 是 `Serializable` 的一个子接口，允许完全自定义序列化过程

```java linenums="1"
public interface Externalizable extends Serializable {
    void writeExternal(ObjectOutput out) throws IOException;
    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```

可以手动控制字段是否序列化，但必须手动实现序列化逻辑

```java linenums="1"
public class User implements Externalizable {
    private String name;
    private int age;
    
    // 必须提供公共无参构造器
    public User() {
        // 反序列化时会调用此构造器
    }
    
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeUTF(name);
        out.writeInt(age);
    }
    
    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        this.name = in.readUTF();
        this.age = in.readInt();
    }
}
```

### 3.2 ObjectInputFilter

ObjectInputFilter 是 Java 9 引入的反序列化防火墙，在对象被还原之前拦截字节流，根据预设规则直接决定允许、拒绝、未定，将危险的 gadget 攻击链阻挡在外

```java linenums="1"
// RMI、JMX、Socket 接收字节流前设置白名单
ServerSocket serverSocket = new ServerSocket(8080);
Socket socket = serverSocket.accept();

ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());

// 设置反序列化防火墙
ObjectInputFilter filter = ObjectInputFilter.allowFilter(
    clazz -> clazz.getName().startsWith("com.company.safe"),
    ObjectInputFilter.Status.REJECTED
);
ois.setObjectInputFilter(filter);

// 现在可以安全反序列化
Object obj = ois.readObject();
```
