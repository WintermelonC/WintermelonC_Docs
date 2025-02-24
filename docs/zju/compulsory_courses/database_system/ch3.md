# 3 Introduction to SQL

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    本文档只涉及部分知识点，仅可用来复习重点知识

## 3.2 SQL Data Definition

### 3.2.1 Basic Types

1. `char(n)`

### 3.2.2 Basic Schema Definition

`create table`：定义一个 relation

```sql linenums="1"
create table department
    (dept_name varchar(20),
    building varchar(15),
    budget numeric(12, 2),
    primary key (dept_name));
```

`drop table`：删除一个 relation

```sql linenums="1"
drop table r;
```

`alter table`：增加、删除或修改 attributes

```sql linenums="1"
alter table r add A D;
alter table r drop A;
```

`create index`：定义索引

## 3.3 Basic Structure of SQL QUeries

### 3.3.1 Select

### 3.3.2 Where

### 3.3.3 From

### 3.3.4 Rename

### 3.3.5 Setting