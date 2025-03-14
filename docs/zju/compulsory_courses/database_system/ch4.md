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

## 4.2 Integrity Constraints

### 4.2.1 Referential Integrity

**参照完整性**

1. 参照完整性：这是数据库设计中的一个重要概念，确保一个表中的外键值必须在另一个表的主键中存在。==这有助于维护数据的一致性和完整性==
2. 关系与主键：在关系数据库中，表被称为关系（relation）。每个关系有一个主键（primary key），它是唯一标识表中每一行的列或列的组合
3. 外键：外键是一个表中的列或列的组合，它引用另一个表的主键。外键的值必须与引用表中的主键值匹配，或者为NULL（如果允许的话）
4. 子集依赖：参照完整性约束可以表示为外键列的值集必须是引用表主键列值集的子集。这意味着外键的值不能随意设置，必须引用已存在的主键值

<figure markdown="span">
  ![Img 1](../../../img/database/ch4/database_ch4_img1.png){ width="600" }
</figure>

在对数据库进行修改时，检查 referential integrity：

1. Insert：在插入新元组时，必须确保外键值在引用表的主键中存在。如果不存在，插入操作将被拒绝
2. Delete：在删除元组时，必须检查是否有其他表中的元组引用该元组。如果有，可以选择拒绝删除或进行级联删除，即同时删除所有引用该元组的元组
3. Update：
      1. 如果更新涉及外键值的修改，必须确保新值在引用表的主键中存在
      2. 如果更新涉及主键值的修改，必须确保没有其他表中的元组引用该主键，或者进行级联更新，即同时更新所有引用该主键的元组

```sql linenums="1"
Create table account (
    account_number char(10), 
    branch_name	char(15), 
    balance	integer, 
    primary key (account_number), 
    -- 外键名和被引用表的逐渐名可以不相同
    foreign key (branch_n) references branch(branch_name)
); 

Create table account (
    -- 简写
    account_number char(10) references branch,  
    branch_name	char(15), 
    balance	integer, 
    primary key (account_number),
); 
```

#### Cascade

**级联**

```sql linenums="1"
create table course (
    ...
    foreign key(dept_name) references department
        on delete cascade
        on update cascade
    ...
);
```

1. Cascade on delete（级联删除）：当在 department 表中删除一个元组时，如果 course 表中有元组的外键引用了被删除的 department 元组，这些 course 表中的元组也会被自动删除
2. cascade on update（级联更新）：当在 department 表中更新一个元组的主键时，如果 course 表中有元组的外键引用了被更新的 department 元组，这些 course 表中的外键值也会被自动更新为新的主键值

注意事项：

1. 外键依赖链：
      1. 当多个表通过外键相互引用时，可能会形成一个依赖链。例如，表 A 引用表 B，表 B 引用表 C，依此类推
      2. 如果在每个外键约束中都指定了 on delete cascade 或 on update cascade，那么在链的一端进行的删除或更新操作会自动传播到整个链
2. 级联操作的传播：
      - 例如，如果在表 C 中删除一个元组，且表 B 和表 A 都通过外键引用表 C 并指定了 on delete cascade，那么删除操作会依次传播到表 B 和表 A，删除所有相关的元组
3. 约束冲突与事务回滚：
      1. 如果级联操作导致无法解决的约束冲突（例如，某个表的外键约束不允许删除或更新操作），系统将中止整个事务
      2. 这意味着事务中的所有操作（包括级联操作）都会被撤销，数据库将回滚到事务开始之前的状态，以确保数据的一致性和完整性

级联操作的替代方案：

1. `on delete set null`：当删除被引用表中的元组时，引用表中的外键值将被设置为 NULL。这意味着引用表中的相关元组将不再指向被删除的元组
2. `on delete set default`：当删除被引用表中的元组时，引用表中的外键值将被设置为默认值。这需要为外键列定义一个默认值

外键属性中的空值会使参照完整性的语义变得复杂。如果外键的任何部分为 NULL，数据库系统会认为该元组满足外键约束，即使它没有实际引用任何有效的元组。为了防止这种情况，通常建议在外键列上使用 NOT NULL 约束，以确保外键值始终指向有效的元组

---

==参照完整性仅在事务结束时检查==，而不是在事务的每个中间步骤中检查。这意味着在事务执行过程中，数据库可以暂时处于违反参照完整性的状态，只要在事务提交前这些违规被消除

原因：在某些情况下，数据库操作需要暂时违反参照完整性才能完成。例如，插入两个相互引用的元组时，第一个元组插入时可能暂时违反参照完整性，直到第二个元组插入后才满足完整性约束

事务的原子性：确保了所有操作要么全部成功，要么全部失败。如果在事务结束时参照完整性约束未被满足，整个事务将被回滚，数据库将恢复到事务开始前的状态

### 4.2.2 Assertions

**断言**

断言是数据库中的一种约束，用于确保数据库始终满足某些复杂的条件。这些条件可能涉及多个表或复杂的逻辑。断言通常用于表达那些无法通过简单的列级或表级约束来实现的条件

```sql linenums="1"
-- 确保所有员工的工资不为负数
CREATE ASSERTION salary_constraint
CHECK (NOT EXISTS (SELECT * FROM employee WHERE salary < 0));
```

每次可能违反断言的数据库更新操作发生时，系统都会测试断言的有效性。如果谓词为真，更新操作被允许；否则，系统会报告错误并拒绝更新。由于断言可能涉及复杂的条件和多个表，频繁的测试可能会显著增加系统的开销。因此，断言应谨慎使用，特别是在对性能要求较高的系统中

断言适用于那些需要跨多个表或复杂逻辑的约束条件。由于可能带来的性能影响，应优先考虑使用简单的列级或表级约束，只有在必要时才使用断言

**Example 1**：The sum of all loan amounts for each branch must be less than the sum of all account balances at the branch

```sql linenums="1"
-- 每个 branch 的 loan 总和都小于 account 总和
-- 相当于没有一个 branch 的 loan 总和大于 account 总和
create assertion sum_constraint check (
    -- SQL 中没有类似 for all 的语句
    not exists (
        select *
        from branch B
        where (
            select sum(amount)
            from loan
            where loan.branch_name = B.branch_name
        ) > (
            select sum(balance)
            from account
            where account.branch_name = B.branch_name
        )
    )
)
```

**Example 2**：Every loan has at least one borrower who maintains an account with a minimum balance of $1000

```sql linenums="1"
-- 没有这种情况的 loan，它没有一个 borrower 的 balance >= 1000
create assertion balance_constraint check (
    not exists (
        select *
        from loan L
        where not exists (
            select *
            from borrower B, depositor D, account A
            where L.loan_number = B.loan_number
                and B.customer_name = D.customer_name
                and D.account_number = A.account_number
                and A.balance >= 1000
        )
    )
)
```

### 4.2.3 Triggers

**触发器**

触发器是一种特殊的数据库对象，它在特定事件发生时自动执行。这些事件通常是对数据库的修改操作，如插入（INSERT）、更新（UPDATE）或删除（DELETE）。触发器用于在数据修改时自动执行一些操作，以维护数据的完整性、执行业务规则或记录日志等

定义一个触发器，我们必须：

1. 指定触发器何时执行。这分为导致触发器被检查的事件和触发器执行必须满足的条件
2. 指定触发器执行时要采取的操作

触发器的执行是作为数据库修改操作的副作用（side effect）发生的，这意味着它在主要操作（如插入、更新或删除）之后自动触发

**Example：** 假设银行不允许账户余额为负，而是通过以下操作处理透支：1. 将账户余额设为零。2. 创建一个贷款，金额为透支金额，并将该贷款的贷款号设置为透支账户的账号。触发器的执行条件是对 account 关系的更新导致 balance 值为负

```sql linenums="1"
create trigger overdraft_trigger
after update on account
referencing new row as nrow
for each row
when (nrow.balance < 0)
    begin atomic
        insert into borrower (
            select customer_name, account_number 
            from depositor
            where nrow.account_number = depositor.account_number
        );

        insert into loan
        values (nrow.account_number, nrow.branch_name, - nrow.balance);

        update account
        set balance = 0
        where account.account_number = nrow.account_number;
    end
```

trigger 可以与特定的属性绑定

```sql linenums="1"
create trigger overdraft_trigger
after update of balance on account
```

1. 引用旧行：`referencing old row as` 子句用于引用被更新或删除的行的旧值。这在需要比较更新前后的数据或记录历史数据时非常有用
2. 引用新行：`referencing new row as` 子句用于引用插入或更新后的新行数据。这在需要访问新插入或更新后的数据时非常有用

#### statement-level trigger

**语句级触发器**

与行级触发器（for each row）不同，语句级触发器（for each statement）在整个 SQL 语句执行完毕后触发一次，而不是为每一行触发一次。这种方式适用于需要对整个操作结果进行处理的情况，而不是逐行处理

在语句级触发器中，可以使用 referencing old table 和 referencing new table 来引用临时表（过渡表），这些表包含在 SQL 语句中受影响的所有行

当SQL语句影响大量行时，使用语句级触发器可以显著提高效率，因为它只需要执行一次操作，而不是为每一行执行一次操作。这种方式减少了触发器的执行次数，降低了系统开销

#### External World Actions

外部世界操作指的是那些与数据库系统外部环境交互的操作，例如发送电子邮件、控制硬件设备（如报警灯）或与外部系统通信（如重新订购库存物品）。这些操作通常不能直接在数据库系统中执行，因为它们涉及到外部资源或系统

触发器主要用于在数据库内部执行操作，如更新、插入或删除数据。它们不能直接执行外部世界操作。例如，触发器不能直接发送电子邮件或控制硬件设备

虽然触发器不能直接执行外部世界操作，但它们可以用于记录需要执行的操作。例如，可以在数据库中创建一个表，用于存储需要执行的外部操作（如重新订购物品或打开报警灯）。触发器可以在数据库更新时向该表中插入记录，表示需要执行的外部操作

一个外部进程可以定期扫描这个表，读取需要执行的操作，并实际执行这些外部世界操作（如发送电子邮件或控制硬件设备）。执行完操作后，外部进程可以从表中删除相应的记录，以避免重复执行

**Example：** 当仓库某个物品的容量小于阈值，记录需要订购的数据

```sql linenums="1"
create trigger reorder_trigger
after update of level on inventory
referencing old row as orow, new ro as nrow
for each row
when nrow.level <= (
    select level
    from minlevel
    where minlevel.item = nrow.item    
) and orow.level > (
    select level
    from minlevel
    where minlevel.item = orow.item
)
begin
    insert into orders (
        select item, amount
        from reorder
        where reorder.item = orow.item
    )
end
```

---

何时不使用触发器：

触发器在过去用于以下任务：

1. 维护汇总数据（例如，每个部门的总工资）
2. 通过记录对特殊关系（称为变更或增量关系）的更改来复制数据库，并通过一个单独的进程将这些更改应用到副本中

现在有更好的方法来完成这些任务：

1. 现代数据库提供了内置的物化视图功能来维护汇总数据
2. 数据库提供了内置的复制支持

!!! tip "比较"

    1. 检查（Check）：用于在列级别强制执行简单的约束条件，例如确保某个列的值在特定范围内
    2. 断言（Assertion）：用于在表级别或跨表级别强制执行复杂的约束条件，例如确保某个条件在整个数据库中始终为真
    3. 触发器（Trigger）：用于在数据修改时自动执行复杂的操作，例如更新其他表或执行外部操作

## 4.3 Authorization
