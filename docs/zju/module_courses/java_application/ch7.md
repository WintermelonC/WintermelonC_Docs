# 7 Optional and IO

!!! tip "说明"

    本文档正在更新中……

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
