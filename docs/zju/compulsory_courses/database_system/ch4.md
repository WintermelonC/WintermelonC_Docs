# 4 Advanced SQL

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 4.1 SQL Data Types and Schemas

### 4.1.1 Large-Object Types

- blob（Binary Large Object）：即二进制大对象。它用于存储二进制数据，比如图像、音频文件、视频文件或其他类型的多媒体内容。blob 字段可以存储非常大的数据量，具体大小限制取决于数据库系统的实现
- clob（Character Large Object）：即字符大对象。它用于存储大量的文本数据。clob 适用于存储那些可能超出 VARCHAR 或 TEXT 类型长度限制的大型文本数据，如完整的书籍、长篇文章等。与 blob 类似，clob 的实际最大容量也依赖于具体的数据库系统

```sql linenums="1"
book_review clob(10KB)
image blob(10MB)
movie blob(2GB)
```

### 4.1.2 User-Defined Types

1. distinct types
2. structured data types

使用 `create type` 定义新的数据类型

```sql linenums="1"
create type Dollars as numeric(12, 2);
create type Pounds as numeric(12, 2);

create table department
(
    dept_name varchar(20),
    building varchar(15),
    budget Dollars
);

-- 删除自定义的数据类型
drop type Dollars;
```

尽管 Dollars 和 Pounds 本质上是相同的类型，但是不能将一个 Dollars 类型的值赋给一个 Pounds 类型的变量

使用 `create domain` 创建基于已有基本类型的新的域。一个域本质上是一个有附加约束的基本数据类型，如限制输入值范围或默认值等。使用 `create domain` 可以增加额外的数据验证规则，有助于确保数据的一致性和有效性

!!! tip "domain 和 type 的区别"

    1. 域可以有约束，例如 not null，并且可以为该域类型的变量定义默认值，而用户自定义类型不能在其上指定约束或默认值。用户自定义类型不仅用于指定属性类型，还可以在 SQL 的过程扩展中使用，在这些扩展中可能无法强制执行约束
    2. 域不是强类型的。因此，只要底层类型兼容，一个域类型的值就可以赋给另一个域类型的值

```sql linenums="1"
create domain DDollars as numeric(12, 2) not null;

-- constraint salary_value_test 是可选的
-- 用于给这个限制取个名字
create domain YearlySalary numeric(8, 2)
    constraint salary_value_test check(value >= 29000.00);

-- check 也可以限制特定的值
create domain degree_level varchar(10)
    constraint degree_level_test
        check(value in ('Bachelors', 'Masters', 'Doctorate'));
```