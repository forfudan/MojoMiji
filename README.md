# Mojo Miji

This is the repository of the [Mojo Miji, a guide to Mojo programming language from a Pythonista's perspective](https://mojo-lang.com), written by Yuhao Zhu.

Mojo is a new programming language developed by Modular, a company founded by Chris Lattner, the creator of Swift and LLVM. The language was made known to the public in 2023 and it has been open-sourcing its [standard library](https://github.com/modular/modular) gradually since early 2024. Mojo is initially designed to be a superset of the Python programming language, incorporating modern features such as static typing, ownership, traits, and meta-programming. These enhancements allow Python users to transition easily while benefiting from increased execution speed and enhanced safety. Mojo’s long-term goal is to be fully compatible with Python syntax and ecosystem.

I started to use Mojo at the early stage of its development in early 2024. Later, I participated in the development of the [NuMojo library](https://github.com/Mojo-Numerics-and-Algorithms-group/NuMojo), which is a library for numerical computing similar to NumPy, SciPy in Python. During this process, Mojo is growing, so do I. I learned a lot about Mojo and found it to be a powerful, promising, attractive, and fun programming language. I also encountered many challenges and pitfalls that I had to overcome. Mojo's syntax and features were quite similar to Python, but there were also significant differences that required careful attention.

That is why I decided to write this book, the Mojo Miji, to introduce the most important features and functionalities of Mojo from a Pythonista's perspective. It is designed to help Python users quickly adapt to Mojo, highlighting the similarities and differences between the two languages. The guide will cover various aspects of Mojo, including its coding style, syntax, data types, control structures, meta-programming, ownership semantics, and third-party packages.

The term "Miji" is derived from the Chinese word "<ruby>秘<rt>mì</rt>籍<rt>jí</rt></ruby>", which means "secret book" or "manual". It is often used to refer to a guide or handbook that provides valuable insights, tips, and shortcuts for mastering a particular subject. Since it is called "secret book", it does not necessarily follow the same structure, conceptual models, or definitions as in a conventional tutorial. Instead, it tries to provide **additional** insights, tips, conceptual models that are not present in the official documentation but would be helpful for understanding Mojo from a Pythonista's perspective, e.g., quaternary system of variable, four statuses of ownership, etc. You can read this Miji as a **complementary** resource to the [official Mojo manual](https://docs.modular.com/mojo/manual/).

In that sense, throughout this Miji, I will focus on providing concrete examples and exercises in both Python and Mojo, allowing readers to easily compare the two languages. I will also draw graphs and diagrams to illustrate memory layouts or internal representations of Mojo objects, since Mojo emphasizes the importance of memory safety. Finally, I will tell you about the pits that I fell into when I used Mojo, so that you can avoid them.

You do not need to be an expert in Python to read this Miji, but you should either have a basic understanding of Python, such as data types, control structures, functions, classes, and modules. Or, you have experience in programming with another static-typed programming language, such as C, C++, Rust, or Java. If you are a Pythonista, you will be more comfortable with reading this Miji.

This Miji Book is expected to be updated continuously over a long period (around five years). Many of the examples and explanations in this Miji may become outdated as Mojo evolves. Thank you in advance for your understanding and patience! If you see any errors or inaccuracies in this Miji, please feel free to open an issue. Your feedback is greatly appreciated.

## License

The following license applies to the book Mojo Miji.

```txt
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
International

Copyright (c) 2024-present, Yuhao Zhu (朱宇浩)
```

The following license applies to the template of the website (Vitepress)

```txt
MIT License

Copyright (c) 2019-present, Yuxi (Evan) You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
