# Introduction

Mojo is a new programming language developed by Modular. Announced in 2023, it open-sourced its standard library in early 2024. Mojo is designed to be a superset of the Python programming language, incorporating modern features such as static typing, ownership, traits, and meta-programming. These enhancements allow Python users to transition easily while benefiting from increased execution speed and enhanced safety.

Mojo borrows Python’s syntax style, making it very similar to Python code with type annotations. In terms of usage, Mojo allows for easy importation of Python functions and packages. Below are examples of Python and Mojo code, demonstrating their similar styles.

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

Mojo’s long-term goal is to become a superset of Python, fully compatible with Python syntax and ecosystem^[I think this is challenging; a more reasonable expectation is that users will only need to make minor modifications to their Python code to compile it in Mojo.].

This website introduces the basic features, syntax, and functions of Mojo, making it easier for users to understand the language. Since Mojo is positioned within the Python ecosystem, I will compare Python code throughout the explanation, highlighting similarities and differences, and explaining the reasons behind certain Mojo features. Additionally, considering that Mojo borrows many features from Rust, I will also provide relevant notes.

This guide will be written in stages, focusing on key topics. Note that Mojo is still in the early stages of development, with significant syntax changes and potential keyword alterations. The Mojo compiler is written in C++, is not yet open-sourced, and has not achieved self-hosting (compiling its own code)^[https://github.com/modularml/mojo/discussions/3049]. The official team has no immediate plans for this. Therefore, this guide is expected to be updated continuously over a long period (around five years).

Thank you for reading. Due to limited capabilities, and there may be many inaccuracies in the content. Your feedback is greatly appreciated.

Yuhao Zhu 朱宇浩
