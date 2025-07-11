# Introduction

> Everything is about programming except for programming itself. Programming is about control.  
> -- Yuhao Zhu, *Gate of Heaven*

Mojo is a new programming language developed by Modular, a company founded by [Chris Lattner](https://www.nondot.org/sabre/), the creator of Swift and LLVM. The language was made known to the public in 2023 and it has been open-sourcing its [standard library](https://github.com/modular/modular) gradually since early 2024. Mojo is initially designed to be a superset of the Python programming language, incorporating modern features such as static typing, ownership, traits, and meta-programming. These enhancements allow Python users to transition easily while benefiting from increased execution speed and enhanced safety. In the long term, it can be fully compatible with Python syntax and ecosystem. In early 2025, this objective shifted toward making Mojo a programming language that uses Python's syntax and interacts seamlessly with Python code.

I started to use Mojo at the early stage of its development in early 2024. Later, I participated in the development of the [NuMojo library](https://github.com/Mojo-Numerics-and-Algorithms-group/NuMojo), which is a library for numerical computing similar to NumPy, SciPy in Python. During this process, Mojo is growing, so do I. I learned a lot about Mojo and found it to be a powerful, promising, attractive, and fun programming language. I also encountered many challenges and pitfalls that I had to overcome. Mojo's syntax and features were quite similar to Python, but there were also significant differences that required careful attention.

That is why I decided to write this book, the Mojo Miji, to introduce the most important features and functionalities of Mojo from a Pythonista's perspective. It is designed to help Python users quickly adapt to Mojo, highlighting the similarities and differences between the two languages. The guide will cover various aspects of Mojo, including its coding style, syntax, data types, control structures, meta-programming, ownership semantics, and third-party packages.

The term "Miji" is derived from the Chinese word "<ruby>秘<rt>mì</rt>籍<rt>jí</rt></ruby>", which means "secret book" or "manual". It is often used to refer to a guide or handbook that provides valuable insights, tips, and shortcuts for mastering a particular subject. Since it is called "secret book", it does not necessarily follow the same structure, conceptual models, or definitions as in a conventional tutorial. Instead, it tries to provide **additional** insights, tips, conceptual models that are not present in the official documentation but would be helpful for understanding Mojo from a Pythonista's perspective, e.g., [quaternary system of variable](./basic/variables#conceptual-model-of-variable), [four statuses of ownership](./advanced/ownership#four-statuses-of-ownership), etc. You can read this Miji as a **complementary** resource to the [official Mojo manual](https://docs.modular.com/mojo/manual/).

In that sense, throughout this Miji, I will focus on providing concrete examples and exercises in both Python and Mojo, allowing readers to easily compare the two languages. I will also draw graphs and diagrams to illustrate memory layouts or internal representations of Mojo objects, since Mojo emphasizes the importance of memory safety. Finally, I will tell you about the [pits that I fell into](./misc/tips) when I used Mojo, so that you can avoid them.

You do not need to be an expert in Python to read this Miji, but you should either have a basic understanding of Python, such as data types, control structures, functions, classes, and modules. Or, you have experience in programming with another static-typed programming language, such as C, C++, Rust, or Java. If you are a Pythonista, you will be more comfortable with reading this Miji.

This Miji will be structured as follows:

1. [START](./start/start): The first part introduces how set up the Mojo environment on your computer so that you are able to write your [first Mojo program](./start/hello) (yes, it is "hello, world!").
1. [MOVE](./move/move): The second part shows you how to [convert Python code into Mojo code](./move/examples). It starts with 4 concrete sample programs, then moves to the [similarities](./move/common), and finally presents the [differences](./move/different) between the two languages. If you are familiar with Python, after reading this part, you will be able to write Mojo code with a certain level of confidence. *If you have no experience in Python, you can skip this part.*
1. [BASIC](./basic/basic): The third part covers the basic features of Mojo, starting with a [conceptual model of variables](./basic/variables), and then introducing [functions](./basic/functions), [data types](./basic/types), [operators](./basic/operators), [structs](./basic/structs), [control flows](./basic/control), [error handling](./basic/errors), [modules](./basic/packages), etc. These features are also present in Python, but Mojo has some differences that you should be aware of. This part will help you to understand the basic syntax and semantics of Mojo.
1. [ADVANCED](./advanced/advanced): The fourth part introduces some more advanced features of Mojo, such as [SIMD](./advanced/simd), [parameterization](./advanced/parameterization), [generic](./advanced/generic), [ownership](./advanced/ownership), [reference system](./advanced/references), [lifetime system](./advanced/lifetimes) etc. These features are not present in Python, but they are essential for writing efficient and safe Mojo code. This part will help you become a more proficient Mojo programmer, a true Magician.
1. [APPLY](./apply/apply): The fifth part consists of a small case study, in which we use Mojo to build a Matrix type, similar to NumPy's. We will apply the features we have learned in the previous parts to implement this type.
1. [EXTEND](./extend/extend): The sixth part introduces several third-party packages that extend the functionality of Mojo. For efficiency, the standard library of Mojo cannot provide all the features. These third-party packages may help fulfill our needs.
1. [MISCELLANEOUS](./misc/misc): The final part covers miscellaneous topics, which may be further integrated into the previous parts in the future. This part also includes a [glossary](./misc/glossary) of key terms and concepts related to Mojo, as well as a list of [information, tips, and warnings](./misc/tips) that are scattered throughout the Miji. It is particularly helpful if you are already a Magician but want to avoid common pitfalls and mistakes that I encountered while using Mojo.

Please be fully aware that Mojo is still in the early stages of development, with significant syntax changes and potential keyword alterations. The Mojo compiler is written in C++, is not yet open-sourced, and has not achieved self-hosting (compiling its own code)^[https://github.com/modularml/mojo/discussions/3049]. The official team has no immediate plans for this.

Therefore, this Miji is expected to be updated continuously over a long period (around five years). Many of the examples and explanations in this Miji may become outdated as Mojo evolves. Thank you in advance for your understanding and patience! If you see any errors or inaccuracies in this Miji, please feel free to open an issue on the [GitHub repository](https://github.com/forfudan/MojoMiji). Your feedback is greatly appreciated.

Yuhao Zhu  
May 2025  
Rotterdam, the Netherlands

::: info Quick glance at Mojo's syntax

Mojo borrows Python’s syntax style, making it very similar to Python code with type annotations. In terms of usage, Mojo allows for easy importation of Python functions and packages. Below are examples of Python and Mojo code, demonstrating their similar styles.

::: code-group

```mojo
a = String("Hello, world!")
print(a)

b: Int = 8
for i in range(10):
    b = b + i
print(b)
```

```python
a = str("Hello, world!")
print(a)

b: int = 8
for i in range(10):
    b = b + i
print(b)
```

:::
