# Introduction

Mojo is a new programming language developed by Modular, a company founded by Chris Lattner, the creator of Swift and LLVM. The language was made known to the public in 2023 and it has been open-sourcing its [standard library](https://github.com/modular/modular) gradually since early 2024. Mojo is initially designed to be a superset of the Python programming language, incorporating modern features such as static typing, ownership, traits, and meta-programming. These enhancements allow Python users to transition easily while benefiting from increased execution speed and enhanced safety. Mojo’s long-term goal is to be fully compatible with Python syntax and ecosystem^[In my opinion, this is quite challenging; a more reasonable expectation is that users will only need to make minor modifications to their Python code so that it can run in Mojo.].

I started to use Mojo at the early stage of its development in early 2024. Later, I participated in the development of the [NuMojo library](https://github.com/Mojo-Numerics-and-Algorithms-group/NuMojo), which is a library for numerical computing similar to NumPy, SciPy in Python. During this process, Mojo is growing, so do I. I learned a lot about Mojo and found it to be a powerful, promising, attractive, and fun programming language. I also encountered many challenges and pitfalls that I had to overcome. Mojo's syntax and features were quite similar to Python, but there were also significant differences that required careful attention.

That is why I decided to write this book, the Mojo Miji, to introduce the most important features and functionalities of Mojo from a Pythonista's perspective. It is designed to help Python users quickly adapt to Mojo, highlighting the similarities and differences between the two languages. The guide will cover various aspects of Mojo, including its coding style, syntax, data types, control structures, meta-programming, ownership semantics, and third-party packages.

The term "Miji" is derived from the Chinese word "<ruby>秘<rt>mì</rt>籍<rt>jí</rt></ruby>", which means "secret book" or "manual". It is often used to refer to a guide or handbook that provides valuable insights and tips for mastering a particular subject. Throughout this Miji, I will focus on providing concrete examples in both Python and Mojo, allowing readers to easily compare the two languages. I will also draw graphs and diagrams to illustrate memory layouts or internal representations of Mojo objects, since Mojo emphasizes the importance of memory safety. Finally, I will provide some examples and exercises of the pits that I fell into when I used Mojo to write the NuMojo library, so that you can avoid them.

You do not need to be an expert in Python to read this Miji Book, but you should either have a basic understanding of Python, such as data types, control structures, functions, classes, and modules. Or, you have experience in programming with another static-typed programming language, such as C, C++, Rust, or Java. If you are a Pythonista, you will be more comfortable with reading this Miji Book.

This Mjji Book will be structured as follows:

1. The first part introduces how set up the Mojo environment on your computer so that you are able to write your [first Mojo program](./start/hello.md) (yes, it is "hello, world!").
1. The second part shows you how to [convert Python code into Mojo code](./move/examples.md), highlighting the [similarities](./move/common.md) and [differences](./move/different.md) between the two languages. If you are familiar with Python, after reading this part, you will be able to write Mojo cond with a certain level of confidence. *If you have no experience in Python, you can skip this part.*
1. The third part covers the basic features of Mojo, starting with a [conceptual model of variables](./basic/variables.md), and then introducing [functions](./basic/functions.md), [data types](./basic/types.md), [operators](./basic/operators.md), modules, etc. These features are also present in Python, but Mojo has some differences that you should be aware of. This part will help you to understand the basic syntax and semantics of Mojo.
1. The fourth part introduces some advanced features of Mojo, such as structs, traits, meta-programming, and ownership. These features are not present in Python, but they are essential for writing efficient and safe Mojo code. This part will help you become a more proficient Mojo programmer, a true Magician.
1. The fifth part introduces several third-party packages that extend the functionality of Mojo. For efficiency, the standard library of Mojo cannot provide all the features. These third-party packages may help fulfill our needs.
1. The sixth part consists of a small case study, in which we use Mojo to build a Matrix type, similar to NumPy's. We will use all the features we have learned in the previous parts to implement this type.
1. The final part covers miscellaneous topics about Mojo, which may be further integrated into the previous parts in the future. This part also includes a [glossary](./misc/glossary.md) of key terms and concepts related to Mojo, as well as a list of [information, tips, and warnings](./misc/tips.md) that are scattered throughout the Miji.

Please be fully aware that Mojo is still in the early stages of development, with significant syntax changes and potential keyword alterations. The Mojo compiler is written in C++, is not yet open-sourced, and has not achieved self-hosting (compiling its own code)^[https://github.com/modularml/mojo/discussions/3049]. The official team has no immediate plans for this.

Therefore, this Miji Book is expected to be updated continuously over a long period (around five years). Many of the examples and explanations in this Miji may become outdated as Mojo evolves. Thank you in advance for your understanding and patience! If you see any errors or inaccuracies in this Miji, please feel free to open an issue on the [GitHub repository](https://github.com/forfudan/MojoMiji). Your feedback is greatly appreciated.

Yuhao Zhu
May 2025
Rotterdam, the Netherlands

::: info Quick glance at Mojo's syntax

Mojo borrows Python’s syntax style, making it very similar to Python code with type annotations. In terms of usage, Mojo allows for easy importation of Python functions and packages. Below are examples of Python and Mojo code, demonstrating their similar styles.

```python
a = str("Hello, world!")
print(a)

b: int = 8
for i in range(10):
    b = b + i
print(b)
```

```mojo
a = String("Hello, world!")
print(a)

b: Int = 8
for i in range(10):
    b = b + i
print(b)
```

:::
