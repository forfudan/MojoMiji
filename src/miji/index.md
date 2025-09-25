---
layout: doc
nav: false
---

# Mojo Miji - A Guide to Mojo Programming Language from A Pythonista's Perspective

by ***Yuhao Zhu 朱宇浩***

::: warning Notes

This Miji is compatible with Mojo v0.25.6 (2025-09-22).

For the example programs featured in this Miji, you can find them in the [GitHub repository](https://github.com/forfudan/my-first-mojo-project).

:::

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
  - [Variables](./basic/variables)
  - [Copy and move](./basic/copy)
  - [Data types - basic](./basic/types) (Int, float, bool, etc.)
  - [Data types - composite](./basic/composite) (List et al.)
  - [Data type - string](./basic/string) (similar to `str` in Python)
  - [Literals and type inference](./basic/literal)
  - [Functions](./basic/functions)
  - [Operators and assignment expressions](./basic/operators)
  - [Control flows](./basic/control) (Loops and conditionals)
  - [Error handling and raises](./basic/errors) (Exceptions)
  - [Structs](./basic/structs) (Similar to classes in Python)
  - [Modules and packages](./basic/packages) (Modular programming)
- [PART IV: ADVANCED MOJO](./advanced/advanced)
  - [Data type - SIMD](./advanced/simd) (The first-class `SIMD` type)
  - [Parameterization](./advanced/parameterization)
  - [Generic and traits](./advanced/generic)
  - [Ownership](./advanced/ownership) (The ownership system)
  - [References and pointers](./advanced/references) (The borrowing system)
  - [Lifetimes and origins](./advanced/lifetimes) (The lifetime system)
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
  <!-- - [Wishes for extra features](./misc/wishes) (Some features I wish Mojo could have) -->
  - [About the author](./misc/author) (A brief introduction of the author)
  <!-- - [Further readings] -->
