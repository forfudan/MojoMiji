# Types

Python is a dynamically strongly-typed language. Python's type hints are primarily for IDE static checks and readability, and are not mandatory, having no impact on performance^[Compilers like Cython and mypyc may use type hints for partial optimization.].

In contrast, Mojo is statically compiled. Therefore, each variable must declare its value type before initialization to allocate appropriate memory space. In Mojo, type annotations are mandatory^[Sometimes, the compiler can infer the type of the left-hand side of the equals sign from the right-hand side. In Rust, IDEs even display the inferred type in the code for user inspection. Mojo does not yet have this feature. To avoid ambiguity, it is recommended that users always provide type annotations.].

```mojo
fn main():
    var a: Float64 = 120.0
    var b: Int = 24
    var c: String = "Hello, world!"
    print(a, b, c)
```

```console
120.0 24 Hello, world!
```
