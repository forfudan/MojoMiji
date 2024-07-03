# 简介

Mojo 是由 Modular 研发的新一代编程语言, 于 2023 年公开, 并于 2024 年对标准库进行开源. Mojo 的研发初衷是为了成为 Python 语言的超集, 并引入静态编译、所有权、元编程等一系列特征, 旨在保障安全性的基础上增加运行速度, 方便 Python 用户迁移.

Mojo 在语法上借鉴了 Python 风格, 同加了类型标注的 Python 代码极为相近. Mojo 在使用上, 可以方便导入 Python 的函数和包. 以下分别为 Python 和 Mojo 代码. 可见, 两者的风格极为相似.

```python
a: str = "Hello, world!"
print(a)

b: int = 8
for i in range(10):
    b = b + i
print(b)
```

```mojo
var a: String = "Hello, world!"
print(a)

var b: Int = 8
for i in range(10):
    b = b + i
print(b)
```

Mojo 的长期目标是成为 Python 的超集, 完全兼容 Python 语法^[笔者认为这一点有难度, 比较合理的预期是用户只需要对 Python 代码做少量改动即可在 Mojo 中编译.].

本网站介绍 Mojo 的基本特征、语法、功能, 方便使用者了解本语言. 由于 Mojo 自身定位就是基于 Python 的生态圈, 我在讲解过程中将会以 Python 代码对举, 提示相似或不同之处, 说明 Mojo 设置某些特性的原因. 同时, 考虑到 Mojo 语言大量借鉴了 Rust 的特性, 我也会进行提示.

本攻略将会挑选重点主题陆续写成. 注意到, Mojo 尚在开发初期, 语法变化极大, 很多关键字也有可能发生改变. Mojo 的编译器是由 C++ 写成, 目前尚未开源, 也未形成自举(用 Mojo 编译自身代码). 官方也对此亦尚未计划. 因此, 本攻略预计将在一个较长的时间段(五年左右)内不断更新.

感谢大家的阅读. 作者能力有限, 内容中可能有不少不精确之处, 还望大家不吝赐教.
