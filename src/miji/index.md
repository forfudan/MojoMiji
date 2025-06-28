# Mojo Miji - A Guide to Mojo Programming Language from A Pythonista's Perspective

by ***Yuhao Zhu 朱宇浩***

::: warning Compatible Mojo version

This Miji is compatible with Mojo v25.4 (2025-06-18).

:::

## Table of Contents

- [INTRODUCTION](./intro)
- [PART I: START WITH MOJO](./start/start)
  <!-- - [Install Magic (being deprecated)](./start/magic) (This will be deprecated in future) -->
  - [Install pixi and extension](./start/pixi) (Package manager and VS Code extension)
  - [Initiate Mojo project](./start/project) (Install Mojo compiler)
  - [My first Mojo program](./start/hello) (Hello, world!)
- [PART II: MOVE INTO MOJO](./move/move)
  - [Convert Python code into Mojo](./move/examples) (Four examples, Python becomes Mojo)
  - [Things that are in common](./move/common) (Similarities between Python and Mojo)
  - [Things that are different](./move/different) (Differences between Python and Mojo)
- [PART III: BASIC MOJO](./basic/basic)
  - [Variables](./basic/variables) (Declare and use variables in Mojo)
  - [Data types - basic](./basic/types) (Int, float, bool, list, literals, etc.)
  - [Data types - composite](./basic/composite) (List, etc)
  - [Data type - string](./basic/string) (`String` in Mojo, similar to `str` in Python)
  - [Literals and type inference](./basic/literal) (Mojo is smart enough to infer types)
  - [Functions](./basic/functions) (Define and use functions in Mojo)
  - [Operators and assignment](./basic/operators) (Operators and assignment expressions)
  - [Control flows](./basic/control) (Loops, conditionals, and some about iterables)
  - [Structs](./basic/structs) (Structs in Mojo, similar to classes in Python)
  - [Modules and packages](./basic/packages) (Modular programming)
  - [Error handling and raises](./basic/errors) (Errors are implicitly returned)
- [PART IV: ADVANCED MOJO](./advanced/advanced)
  - [Data type - SIMD](./advanced/simd) (The first-class `SIMD` type)
  <!-- - [Error handling (Yuhao is working on this)](./advanced/error_handling) -->
  - [Parameterization](./advanced/parameterization) (Shift work from run time to compile time)
  - [Generic and traits](./advanced/generic) (Move to generic programming with traits)
  - [Ownership](./advanced/ownership) (The ownership system in Mojo)
  - [References and pointers](./advanced/references) (The borrowing system in Mojo)
  - [Lifetimes and origins](./advanced/lifetimes) (The lifetime system in Mojo)
  <!-- - [Call Python in Mojo](./advanced/python) -->
- [PART V: APPLY MOJO](./apply/apply.md) (Let's use Mojo to program something useful)
  - [Design of MatMojo library](./apply/design.md) (Preparation for a matrix library)
  - [Make it work](./apply/work.md) (Define and implement the basic functionalities)
- [PART VI: EXTEND MOJO](./extend/extend)
  - [Arbitrary-precision numbers](./extend/decimojo) (A library for arbitrary-precision integers and decimals)
  - [Multi-dimensional arrays](./extend/numojo) (A library for numerical computing and NDArray)
- [PART VII: MISCELLANEOUS](./misc/misc)
  <!-- - [Memory layout of Mojo objects](./misc/layout) (How Mojo objects are stored in memory) -->
  - [Glossary of Mojo terms](./misc/glossary) (Find explanations of key terms and concepts)
  - [Tips and warnings](./misc/tips) (Do not fall into the pits I fell into)
  - [Useful resources and links](./misc/resources) (Online resources and links related to Mojo)
  - [Wishes for extra features](./misc/wishes) (Some features I wish Mojo could have)
  - [About the author](./misc/author) (A brief introduction of the author)
  <!-- - [Further readings] -->
