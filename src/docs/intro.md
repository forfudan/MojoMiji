# Introduction

Mojo is a new programming language developed by Modular. Announced in 2023, it open-sourced its standard library in early 2024. Mojo is designed to be a superset of the Python programming language, incorporating modern features such as static typing, ownership, traits, and meta-programming. These enhancements allow Python users to transition easily while benefiting from increased execution speed and enhanced safety. Mojo’s long-term goal is to become a superset of Python, fully compatible with Python syntax and ecosystem^[In my opinion, this is quite challenging; a more reasonable expectation is that users will only need to make minor modifications to their Python code so that it can run in Mojo.].

This Miji book introduces the most important features and functionalities of Mojo from a Pythonista's perspective. It is designed to help Python users quickly adapt to Mojo, highlighting the similarities and differences between the two languages. The guide will cover various aspects of Mojo, including its coding style, syntax, data types, control structures, meta-programming,  ownership semantics and third-party packages.

Throughout this Miji Book, I will focus on providing concrete examples in both Python and Mojo, allowing readers to easily compare the two languages. I will also provide some examples and exercises of the pits that I fell into when I used Mojo to write the NuMojo library.

Please be fully aware that Mojo is still in the early stages of development, with significant syntax changes and potential keyword alterations. The Mojo compiler is written in C++, is not yet open-sourced, and has not achieved self-hosting (compiling its own code)^[https://github.com/modularml/mojo/discussions/3049]. The official team has no immediate plans for this.

Therefore, this Miji Book is expected to be updated continuously over a long period (around five years). Many of the examples and explanations in this Miji may become outdated as Mojo evolves. Thank you in advance for your understanding and patience! If you see any errors or inaccuracies in this Miji, please feel free to open an issue on the [GitHub repository](https://github.com/forfudan/MojoMiji). Your feedback is greatly appreciated.

Yuhao Zhu 朱宇浩  
May 2025  
In Rotterdam, the Netherlands

::: info Quick glance at Mojo's syntax

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

:::



