# Modules, packages, and imports

> Keep things in order!
> Yuhao Zhu, *Gate of Heaven*

The package system in Mojo is very similar to Python's, with modules and packages. When we want to use a module or package, we can import it into the current file using the `import` statement. This chapter will introduce the concepts of modules and packages in Mojo, how to create them, and how to use them in your code.

For Pythonistas, you can quickly scan this chapter and skip some sections because the concepts in this chapter are very similar to Python's modules and packages.

[[toc]]

## Modules and packages

When you are working on a larger project, you may write hundreds or even thousands of functions, structs, and traits. Putting all of them in a single file would make it hard to read and maintain. Putting one function per file would create too many files, making it hard to navigate the project.

A solution is to put several related functions, structs, and traits in a single file. When you want to use them, you can import this file into another program. This way, you can make your code more organized, easier to read, easier to maintain, and easier to collaborate with others.

This philosophy is known as **modular programming**. As Python-style programming language, Mojo supports modular programming through two main concepts: **modules** and **packages**. To use the packages, modules, and functions defined in them, you can use the `import` statement.

Mojo also provides some built-in functions and types, which are organized into modules, for you to use in your code. These built-in modules provide a wide range of functionality and are essential for writing Mojo program, such as `int`, `string`, `list`, *etc.*. Some types and functions are **automatically imported** into your Mojo program, such as `print`, `Int`, `Float64`, `String`, *etc.*. Some types and functions are **not automatically imported** and need to be explicitly imported using the `import` statement, such as `math`, `memory`, *etc.*.

::: tip Modules and packages

In short:

- Module is just a Mojo file.
- Package is just a folder containing at least one Mojo file named `__init__.mojo`.
- You can import a module or package using the `import` statement.

Interestingly, the company that created Mojo is called **Modular**.

:::

## Import statement

### import

The `import` statement is used to import modules, packages, and functions from them into the current file. For example, if we want to use the `math` module, which provides many basic mathematical functions, we can write:

```mojo
import math
```

After doing this, the functions, types, and constants defined in the module can be accessed using the `math.` prefix **in the current file**. For example, to use the `sqrt` function from the `math` module, we can write:

```mojo
import math
fn main() raises:
    var x: Float64 = 16.0
    var result = math.sqrt(x)
    print("The square root of", x, "is", result)
```

### import from

You can also import specific functions or types from a module using the `from` keyword. For example, if we only want to use the `sqrt` function from the `math` module, we can write:

```mojo
from math import sqrt
fn main():
    var x: Float64 = 16.0
    var result = sqrt(x)
    print("The square root of", x, "is", result)
```

Comparing the two examples, the first one imports the entire `math` module, so you have to use the `math.` prefix to access the `sqrt` function. The second one imports only the `sqrt` function, so you can use it directly without the prefix, just like that you defined it in the current file.

### import as

You can also import a module and give it a different name using the `as` keyword. For example, if we want to import the `math` module and give it a more unique name, we can write:

```mojo
import math as math_of_stdlib

fn main():
    var x: Float64 = 16.0
    var result = math_of_stdlib.sqrt(x)
    print("The square root of", x, "is", result)
```

Since the `math` module is renamed as `math_of_stdlib`, we **have to use the new name** to access the `sqrt` function. If you use `math.sqrt(x)`, Mojo compiler will not recognize it and will raise an error.

### from import as

You can even combine the `from` and `as` keywords to import a specific function or type from a module and give it a different name. For example, if we want to import the `sqrt` function from the `math` module and give it a more unique name, we can write:

```mojo
from math import sqrt as builtin_square_root

fn main():
    var x: Float64 = 16.0
    var result = builtin_square_root(x)
    print("The square root of", x, "is", result)
```

### import *

Finally, you can use the `from ... import *` statement to import all functions and types from a module into the current file. For example, if we want to import all functions and types from the built-in `math` module, we can write:

```mojo
from math import *

fn main():
    var x: Float64 = 16.0
    print("The square root of", x, "is", sqrt(x))
    print("The sin of", x, "is", sin(x))
    print("The cos of", x, "is", cos(x))
    print("The cosh of", x, "is", cosh(x))
```

In the code, the functions `sqrt`, `sin`, `cos`, and `cosh` are all imported from the `math` module, so we can use them directly without the `math.` prefix.

However, please note that using `import *` is generally discouraged in Python and Mojo. This is because has several drawbacks:

1. It can lead to **name conflicts** if two modules have functions or types with the same name.
1. It makes it harder for readers to understand where a function or type comes from, especially in larger files.
1. It makes LSPs (Language Server Protocols) less effective, as they cannot track where a function or type is defined.

## Namespace

You may have heard about the term **namespace** before. This term, in programming languages, refers to a container (space) that holds a set of identifiers (names), so that:

1. The objects can be organized in a more structured way. For example, all mathematical functions can be put in a `math` namespace, all system-related functions can be put in a `system` namespace, *etc.*.
1. The objects of the same name will be placed in different namespaces (containers), so that they will not conflict with each other. For example, you can have a `abs` function in the `math` namespace and a `abs` function in the `complex_number` space. Then you can use `math.abs` to call the mathematical absolute value function, and `complex_number.abs` to call the absolute value function for complex numbers. There will be no conflicts or overrides.

This brings us to a practical question: when we want to use a specific function from a module, should we import the entire module or just the specific function?

The answer is that it depends on the situation. If you only need one or two functions from a module, it might be better to use `from ... import ...` to make your code cleaner. If you need many functions from a module, it might be better to use `import ...` to avoid importing too many functions and causing potential conflicts with other functions in your code.

Nevertheless, the syntax `from ... import *` is generally discouraged. The reason has been explained above. When we see that someone uses `from ... import *` a lot, we may remaind them that:

"Stop contaminating the namespace!"

## Write modules

A module is a single file containing a set of type alias, global variables, functions, structs, and traits. The **file name** is the module name and serves as the unique identifier for the module. According to the Mojo's naming convention, the module name must be in **snake_case**, namely all letters are lowercase, and words are separated by underscores (`_`). For example, `point.mojo`, `math_library.mojo`, `complex_number_2d_array.mojo`, *etc.*, are all valid module names. Sometimes, the module name may be highly related to the main struct defined in the module. For example, in the Mojo standard library, the module for the `Int` type is named `int.mojo`, and the module for the `String` type is named `string.mojo`.

Let's start with a simple example. Suppose we want to define a `Point` struct that represents a point in 2D space, along with some functions and methods to manipulate it. We write our code in a file named `point.mojo` as follows:

```mojo
# src/miji/basic/modules/point.mojo
"""
A example module containing a `Point` struct and related structs and functions.
"""

# ===----------------------------------------------------------------------=== #
# Imports
# ===----------------------------------------------------------------------=== #
from memory import UnsafePointer
import math

# ===----------------------------------------------------------------------=== #
# Aliases (known at compiled time)
# ===----------------------------------------------------------------------=== #
alias FourByteFloat = SIMD[DType.float64, 1]
"""Alias for a 4-byte float (double precision)."""
alias PI = 3.14159
"""Alias for the mathematical constant pi (π)."""

# ===----------------------------------------------------------------------=== #
# Functions
# ===----------------------------------------------------------------------=== #


fn print_address(a: Point):
    var ptr = UnsafePointer(to=a)
    print("Memory address of the point:", String(ptr))


fn distance[T: Distanceable](item: T) -> FourByteFloat:
    """Calculates the distance."""
    return item.__distance__()


# ===----------------------------------------------------------------------=== #
# Traits
# ===----------------------------------------------------------------------=== #
trait Distanceable:
    fn __distance__(self) -> Float64:
        ...


# ===----------------------------------------------------------------------=== #
# Structs
# ===----------------------------------------------------------------------=== #
struct Point(Distanceable):
    """A point in 2D space."""

    var x: FourByteFloat
    var y: FourByteFloat

    fn __init__(out self, x: FourByteFloat, y: FourByteFloat):
        self.x = x
        self.y = y

    fn __distance__(self) -> FourByteFloat:
        """Calculates the distance from the origin (0, 0)."""
        return math.sqrt(self.x * self.x + self.y * self.y)

    fn area(self) -> FourByteFloat:
        """Calculates the area of a circle with this point as the radius."""
        return PI * distance(self) * distance(self)
```

---

We can then import this module in another file, for example, `main.mojo`, and use the `Point` struct and its methods:

```mojo
fn main() raises:
    var x: Float64 = 3.0
    var y: Float64 = 4.0
    var p = Point(x, y)

    print_address(p)
    print("Distance between the point and the origin:", distance(p))
    print(
        "Area of the circle with radius equal to the distance from the origin:",
        p.area(),
    )
```

---

::: danger Global variables

You can also define global variables in a module, for example,

```mojo
# Variables (global scope)
var x: Int = 10
var y: Float = 1.41421
var z: String = "Hello, Mojo!"
```

Then you can import the module and access these variables in another file:

```mojo
import point
from point import z

def main():
    print("x =", point.x)
    print("y =", point.y)
    print("z =", z)
```

However, please note that global variables are **not fully supported** in Mojo yet. Using them may lead to unexpected behavior, especially when you import global variables from a mojo package (`.mojopkg` file).

:::

## Write packages

A package is a directory containing an `__init__.mojo` file, which can contain multiple modules. The package can be imported using the `import` statement, just like in Python.

Notably, you **cannot define** a `main()` function in a package.

## Imports within your own package

When you write your own package, you can import other modules or packages within the package. A question arises: when there are multiple layers of directories, i.e., there are my sub-packages, how do you import modules from them?

The answer is that we can use either relative imports or absolute imports.

### Relative imports

### Absolute imports