# Introduction

> Everything is about programming except for programming itself. Programming is
> about control.  
> -- Yuhao Zhu, *Gate of Heaven*

Mojo is a new programming language developed by Modular, a company founded by
[Chris Lattner](https://www.nondot.org/sabre/), the creator of Swift and LLVM.
The language was made known to the public in 2023 and it has been open-sourcing
its [standard library](https://github.com/modular/modular) gradually since early
2024. Mojo is initially designed to be a superset of the Python programming
language, incorporating modern features such as static typing, ownership,
traits, and meta-programming. These enhancements allow Python users to
transition easily while benefiting from increased execution speed and enhanced
safety. In the long term, it can be fully compatible with Python syntax and
ecosystem. In early 2025, this objective shifted toward making Mojo a
programming language that uses Python's syntax and interacts seamlessly with
Python code.

I started to use Mojo at the early stage of its development in early 2024.
Later, I participated in the development of the
[NuMojo library](https://github.com/Mojo-Numerics-and-Algorithms-group/NuMojo),
which is a library for numerical computing similar to NumPy and SciPy in Python.
During this process, Mojo kept growing — and so did I. I learned a tremendous
amount about Mojo and found it to be a powerful, promising, attractive, and
genuinely fun programming language. I also encountered many challenges and
pitfalls that I had to overcome. Mojo's syntax and surface style are quite close
to Python's, yet there are significant semantic differences that demand careful
attention.

That is why I decided to write this Miji — to introduce the most important
features and functionalities of Mojo to new users, so that they can quickly get
started with Mojo and avoid the pitfalls that I encountered.

As far as I am concerned, there are broadly two approaches to learning Mojo:

**The Pythonista's path.** For Python users, Mojo's syntax, keywords, style,
conventions, and ecosystem feel immediately familiar. They come to Mojo
primarily to harness the power of static compilation — faster execution and
stronger safety guarantees. However, many Pythonistas are not yet well-versed in
the properties of statically compiled languages, especially concepts at the
memory level. A Pythonista-oriented pedagogy therefore emphasizes
*comparison and intuition*: presenting abundant side-by-side code examples,
mapping the commonalities between Python and Mojo, pointing out the differences,
and gradually guiding the reader into Mojo's deeper, novel features.

**The systems programmer's path.** Experienced programmers who already master
one or more statically compiled languages arrive with solid prior knowledge of
memory management, compilation theory, and type systems. Their semantic
footprint is already large; what they mainly need to learn is the syntactic
side. This approach favors a systematic, structured curriculum in the tradition
of classical static-language tutorials — walking through Mojo's implementation
details step by step and drawing comparisons to established languages such as C
and Rust.

For this Miji, I have chosen the first approach: standing alongside Pythonistas
and guiding them through Mojo one step at a time. The Miji is designed to help
Python users quickly adapt to Mojo by highlighting the similarities and
differences between the two languages. Along the way, the guide covers Mojo's
coding style, syntax, data types, control structures, meta-programming,
ownership semantics, and selected third-party packages.

The term "Miji" is derived from the Chinese word
"<ruby>秘<rt>mì</rt>籍<rt>jí</rt></ruby>", which means "secret book" or
"manual". It is often used to refer to a guide or handbook that provides
valuable insights, tips, and shortcuts for mastering a particular subject. Since
it is called "secret book", it does not necessarily follow the same structure,
conceptual models, or definitions as in a conventional tutorial. Instead, it
tries to provide **additional** insights, tips, conceptual models that are not
present in the official documentation but would be helpful for understanding
Mojo from a Pythonista's perspective, e.g.,
[quaternary system of variable](./basic/variables#conceptual-model-of-mojo-variable),
[four statuses of ownership](./advanced/ownership#four-statuses-of-ownership),
etc. You can read this Miji as a **complementary** resource to the
[official Mojo manual](https://mojolang.org/docs/manual/).

In that sense, throughout this Miji, I will focus on providing concrete examples
and exercises in both Python and Mojo, allowing you to easily compare the two
languages. I will also draw graphs and diagrams to illustrate memory layouts or
internal representations of Mojo objects, since Mojo emphasizes the importance
of memory safety. Finally, I will tell you about the
[pits that I fell into](./misc/tips) when I used Mojo, so that you can avoid
them.

To be as interactive as possible, I put a "run" button at the top right corner
of the code blocks, so you can run the code to see the real output. You can also
edit the sample code to check out anything you like.

You do not need to be an expert in Python to read this Miji, but you should
either have a basic understanding of Python, such as data types, control
structures, functions, classes, and modules. Or, you have experience in
programming with another static-typed programming language, such as C, C++,
Rust, or Java. If you are a Pythonista, you will be more comfortable with
reading this Miji.

This Miji will be structured as follows:

1. [START](./start/start): The first part introduces how set up the Mojo
   environment on your computer so that you are able to write your
   [first Mojo program](./start/hello) (yes, it is "hello, world!").
1. [MOVE](./move/move): The second part shows you how to
   [convert Python code into Mojo code](./move/examples). It starts with 4
   concrete sample programs, then moves to the [similarities](./move/common),
   and finally presents the [differences](./move/different) between the two
   languages. If you are familiar with Python, after reading this part, you will
   be able to write Mojo code with a certain level of confidence.
   *If you have no experience in Python, you can skip this part.*
1. [BASIC](./basic/basic): The third part covers the basic features of Mojo,
   starting with a [conceptual model of variables](./basic/variables), and then
   introducing [functions](./basic/functions), [data types](./basic/types),
   [operators](./basic/operators), [structs](./basic/structs),
   [control flows](./basic/control), [error handling](./basic/errors),
   [modules](./basic/packages), [use Python in Mojo](./basic/py4mojo) etc. These
   features are also present in Python, but Mojo has some differences that you
   should be aware of. This part will help you to understand the basic syntax
   and semantics of Mojo.
1. [ADVANCED](./advanced/advanced): The fourth part introduces some more
   advanced features of Mojo, such as [SIMD](./advanced/simd),
   [parameterization](./advanced/parameterization),
   [generic](./advanced/generic), [ownership](./advanced/ownership),
   [reference system](./advanced/references),
   [lifetime system](./advanced/lifetimes) etc. These features are not present
   in Python, but they are essential for writing efficient and safe Mojo code.
   This part will help you become a more proficient Mojo programmer, a true
   Magician.
1. [APPLY](./apply/apply): The fifth part consists of some small case studies.
   We will apply the features we have learned in the previous parts to implement
   these applications.
1. [EXTEND](./extend/extend): The sixth part introduces several third-party
   packages that extend the functionality of Mojo. For efficiency, the standard
   library of Mojo cannot provide all the features. These third-party packages
   may help fulfill our needs.
1. [MISCELLANEOUS](./misc/misc): The final part covers miscellaneous topics,
   which may be further integrated into the previous parts in the future. This
   part also includes a [glossary](./misc/glossary) of key terms and concepts
   related to Mojo, as well as a list of
   [information, tips, and warnings](./misc/tips) that are scattered throughout
   the Miji. It is particularly helpful if you are already a Magician but want
   to avoid common pitfalls and mistakes that I encountered while using Mojo.

Mojo reached its version 1.0 on 11 August 2026, which means that the core
language is now stable: code that compiles today should keep compiling tomorrow.
One week later, on 18 August 2026, Modular open-sourced the Mojo compiler and
the whole toolchain under the Apache 2.0 license with LLVM
exceptions^[https://www.modular.com/blog/mojo-open-source]. The standard library
had already been open since 2024, so the entire language is now in the open.
Note that the compiler is still written in C++ and does not yet compile itself,
and that Modular does not accept outside contributions to the compiler yet. They
aim to open that door by the end of 2026.

That said, Mojo is still a young language. Parts of it outside the stable core,
such as the standard library and the tooling, will keep changing.

Therefore, this Miji is expected to be updated continuously over a long period
(around five years). Many of the examples and explanations in this Miji may
become outdated as Mojo evolves. Thank you in advance for your understanding and
patience! If you see any errors or inaccuracies in this Miji, please feel free
to open an issue on the
[GitHub repository](https://github.com/forfudan/MojoMiji). Your feedback is
greatly appreciated.

Yuhao Zhu  
First version: May 2025  
Revision: March 2026  
Second revision: August 2026  
Rotterdam, the Netherlands
