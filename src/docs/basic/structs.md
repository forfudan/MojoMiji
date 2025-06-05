# Structs

Though Python does not has the concept of "struct", it has a similar concept called "class". In many cases, you can use a struct to achieve the same functionality as a class in Python. These, I put the struct in the "basic" part of this Miji Book.

[[toc]]

## What is a struct?

A struct is a composite data structure which contains multiple variables (fields) and functions (methods). The values of the fields are stored in a contiguous block of memory, and the methods are used to manipulate the data of the struct. All types in Mojo are structs, including the built-in types like `Int`, `Float64`, `String`, etc. By defining a struct, you can create your own data types.

Structs are used to represent (with some abstraction) the real-world entities or concepts. For example, a point with two coordinates can be represented two numerical variables, `x` and `y`. But this is not convenient to use. We want a way to access these values with in single namespace (or, we want to access these values with a single pointer). Thus, we group these two variables into a struct, which is called `Pointer`. We can then access the values by means of `Pointer.x` and `Pointer.y`.

These idea of grouping multiple variables into a single namespace can also be extended to functions. For example, if we want to calculate the distance between a point and the origin `(0, 0)`, we can define a function `distance_from_zero()` that takes a `Pointer` as an argument and returns the distance:

```mojo
def distance_from_zero(p: Pointer) -> Float:
    return (p.x ** 2 + p.y ** 2) ** 0.5
```

However, the formulae to calculate the distance can vary among multiple types of arguments, e.g. a pointer, a vector, a complex number, etc. Thus, it is more convenient bind this function to the `Pointer` struct, so that we can access it from a more explicit entry point.

What we do is simply move the function into the `Pointer` struct and take the point itself as the first argument. Then we can use the function with `Pointer.distance_from_zero()`.

You can see that the thing above are very similar to how fields and methods are defined in a Python class. It can also implement the basic philosophy of object-oriented programming (OOP), e.g., encapsulation, abstraction, and polymorphism.

However, Mojo does not support inheritance like Python does, so we cannot define a class that inherits from another class (and thus multiple inheritance is also not possible). In Chapter [Generic and traits](../advanced/generic.md), we will see that you can use traits as a solution. This is a philosophy called "composition over inheritance".

The following table summarizes the similarities and differences between Mojo structs and Python classes:

| Feature                    | Mojo                                    | Python                                                          |
| -------------------------- | --------------------------------------- | --------------------------------------------------------------- |
| Define structs             | `struct StructName[parameters](Trait):` | `class ClassName(ParentClass):`                                 |
| Define fields (attributes) | `var name: Type`                        | No declaration needed, optionally `name: Type` or `name = None` |
| Define methods             | `def method(self):`                     | `def method(self):`                                             |
| Static methods             | `@staticmethod`                         | `@staticmethod`                                                 |
| Initializer method         | `def __init__(out self):` or `fn...`    | `def __init__(self):`                                           |
| Parametrization            | Yes, define parameters in `[]`          | No                                                              |
| Inheritance                | No inheritance                          | Supports hierarchical inheritance.                              |
| Composition                | Yes, via traits                         | Possible                                                        |
| Constructor                | `var obj = StructName(arg1, arg2, ...)` | `var obj = ClassName(arg1, arg2, ...)`                          |
| Call fields (attributes)   | `obj.name`                              | `obj.name`                                                      |
| Call methods               | `obj.method()`                          | `obj.method()`                                                  |

## Define a struct

The keyword `struct` is used to define a struct in Mojo. A general syntax is as follows:

```mojo
struct StructName[para1: Type1, para2: Type2](Trait1, Trait2):

    # Declare fields (attributes)
    var field1: Type1
    var field2: Type2

    # Define methods (struct functions)
    def __init__(out self, arg1: Type1, arg2: Type2):
        """Initialize the struct with given arguments."""
        ...

    def method1(self, arg1: Type1, arg2: Type2) -> ReturnType:
        """Returns something."""
        ...
```

First, you need to provide a name for the struct, and optionally, you can define parameters in square brackets `[]`. The struct can also implement one or more traits, which is a way to define shared behavior across different types. We will discuss this in later chapters [Parametrization](../advanced/parameterization.md) and [Generic and traits](../advanced/generic.md). For now, you can ignore these two features, so that the first row is just `struct StructName:`.

Within the code block of the struct, you can declare the fields (attributes) of the struct using the `var` keyword, followed by the field name and its type. It is just like declaring a normal variable, but this time, **we cannot omit the `var` keyword and the type annotation**. These two things are mandatory for Mojo compiler to know how much memory is needed to store the struct.

You can also define methods (special functions that are defined within structs) using either the `def` keyword or the `fn` keyword. We have already discussed the functions in Chapter [Functions](./functions.md), nothing special here. The only difference is that the first argument of the method is `self`, which means that the function will operate on the instance of the struct.

When we call a method of a struct, we use the dot notation, just like we do in Python. For example, if we have a variable `obj` of the type `StructName` (we also say that `obj` is an instance of `StructName`), we can call its method `method1()` in two ways:

1. `StructName.method1(obj, arg1, arg2)`. This is just like calling a normal function. The variable `obj` is passed as the first argument to the method, the same as the signature of the method.
1. `obj.method1(arg1, arg2)`. This is equivalent and shorter than the first way, but it is more common and elegant. In this way, we can omit the first argument `self` and simply call the method with the remaining arguments.

Similar to Python, we have a special method called `__init__()` that is used to initialize the struct instance. This method allows us to use the name of the struct as a constructor, for example, `var obj = StructName(arg1, arg2)` as we have encountered many times in previous chapters ([Data types](../basic/types.md)). The one minor addition is the keyword `out` is needed before `self` in the `__init__()` method.

## Example struct - complex number

Let's now look at a simple example, a `Complex` struct that represents a complex number with real and imaginary parts. We will define the struct with two fields, `real` and `imag`, and some useful methods to manipulate complex numbers, such as addition and multiplication. For comparison, we will also show the equivalent Python code at the same time.

### Define fields

First, we define the struct with the name `Complex` and two fields, `real` and `imag`. We also use the docstring to describe the struct and its fields, for better documentation and understanding.

```mojo
# src/basic/complex_number.mojo
struct Complex:
    """Complex number with real and imaginary parts."""

    var real: Float64
    """Real part of the complex number."""
    var imag: Float64
    """Imaginary part of the complex number."""
```

::: info Python equivalent

```python
class Complex:
    """Complex number with real and imaginary parts."""
    
    # Define fields (attributes)
    # These are not mandatory in Python, but good for documentation.
    real: float  # Real part of the complex number
    imag: float  # Imaginary part of the complex number
```

:::

### Basic methods

Next, we define the `__init__()` method to enable users to use the constructor to initialize the struct instance with the given real and imaginary parts.

We also define a `write_to()` method to to enable `print()` function to work on the struct.

```mojo
# src/basic/complex_number.mojo
struct Complex:
    """Complex number with real and imaginary parts."""

    var real: Float64
    """Real part of the complex number."""
    var imag: Float64
    """Imaginary part of the complex number."""

    fn __init__(out self, real: Float64 = 0.0, imag: Float64 = 0.0):
        """Initializes a complex number with real and imaginary parts.

        Args:
            real: The real part of the complex number (default is 0.0).
            imag: The imaginary part of the complex number (default is 0.0).
        """
        self.real = real
        self.imag = imag

    fn write_to[T: Writer](self, mut writer: T):
        """Writes the complex number to a writer."""
        if self.imag < 0:
            writer.write(self.real, self.imag, "i")
        else:
            writer.write(self.real, "+", self.imag, "i")


fn main():
    var c1 = Complex(3.0, 4.0)
    var c2 = Complex(1.0, -2.0)
    var c3 = Complex()

    print("Complex number c1:", c1)
    print("Complex number c2:", c2)
    print("Complex number c3:", c3)
```

Running this code will output:

```console
Complex number c1: 3.0+4.0i
Complex number c2: 1.0-2.0i
Complex number c3: 0.0+0.0i
```

It is expected, yet two things to note here:

1. The `__init__()` method is defined with the `out` keyword before `self`, which is required in Mojo to indicate that `self` is the output of the method.
1. We set default values for the `real` and `imag` parameters in the `__init__()` method, so that we can create a complex number without providing any arguments.
1. The `write_to()` method is defined to enable the `print()` function to work on the struct, as it conforms to the `Writer` trait (we will discuss traits in Chapter [Generic and traits](../advanced/generic.md) later). This method reads in a `Writer` instance, and writes the complex number components and necessary symbols to it. Since the `writer` needs to be modified, we use the `mut` keyword to indicate that it is mutable.

::: info Python equivalent

The major difference between Mojo and Python in this part is that Mojo uses the `write_to()` method to enable the `print()` function, while Python uses the `__str__()` method. If you only define a `__str__()` method in Mojo, you can only enable the `String()` constructor to obtain a string representation of the struct, but not the `print()` function. Thus, the Python `__str__()` method can simultaneously achieve two goals (string conversion and printing).

```python
class Complex:
    """Complex number with real and imaginary parts."""
    
    # Define fields (attributes)
    # These are not mandatory in Python, but good for documentation.
    real: float  # Real part of the complex number
    imag: float  # Imaginary part of the complex number

    def __init__(self, real: float = 0.0, imag: float = 0.0):
        """Initialize a complex number with real and imaginary parts."""
        self.real = real
        self.imag = imag

    def __str__(self) -> str:
        """Return a string representation of the complex number."""
        if self.imag < 0:
            return f"{self.real}{self.imag}i"
        else:
            return f"{self.real}+{self.imag}i"
    
def main():
    c1 = Complex(3.0, 4.0)
    c2 = Complex(1.0, -2.0)
    c3 = Complex()
    
    print("Complex Number 1:", c1)
    print("Complex Number 2:", c2)
    print("Complex Number 3:", c3)

main()
```

:::

### Arithmetic operators

Now we have finished the basic IO functionality of the `Complex` struct. The next step is to implement some arithmetic operators to make it more useful, for example, addition via `+` and multiplication via `*`, etc.

In Mojo, you can define the behavior of the arithmetic operators by defining special methods with double underscores, such as:

- `__add__()` for addition (`a + b`)
- `__sub__()` for subtraction (`a - b`)
- `__mul__()` for multiplication (`a * b`)
- `__truediv__()` for division (`a / b`)

It is identical to Python, and we have partially discussed this in Chapter [Operators](../basic/operators.md). For now, we just use our knowledge of Python to define these methods in the `Complex` struct. Later, we will investigate the mechanism behind definement of operators in Chapter [Generic and traits](../advanced/generic.md).

The formulae for basic arithmetic operations on complex numbers are simple. As a Pythonista, you can try to do this yourself before looking at the code below, maybe starting with Python code and then converting it to Mojo.

```mojo
# src/basic/complex_number.mojo
struct Complex:
    """Complex number with real and imaginary parts."""

    var real: Float64
    """Real part of the complex number."""
    var imag: Float64
    """Imaginary part of the complex number."""

    fn __init__(out self, real: Float64 = 0.0, imag: Float64 = 0.0):
        """Initializes a complex number with real and imaginary parts.

        Args:
            real: The real part of the complex number (default is 0.0).
            imag: The imaginary part of the complex number (default is 0.0).
        """
        self.real = real
        self.imag = imag

    fn write_to[T: Writer](self, mut writer: T):
        """Writes the complex number to a writer."""
        if self.imag < 0:
            writer.write(self.real, self.imag, "i")
        else:
            writer.write(self.real, "+", self.imag, "i")

    fn __add__(self, other: Self) -> Self:
        """Adds two complex numbers."""
        return Complex(self.real + other.real, self.imag + other.imag)

    fn __sub__(self, other: Self) -> Self:
        """Subtracts two complex numbers."""
        return Complex(self.real - other.real, self.imag - other.imag)

    fn __mul__(self, other: Self) -> Self:
        """Multiplies two complex numbers."""
        return Complex(
            self.real * other.real - self.imag * other.imag,
            self.real * other.imag + self.imag * other.real,
        )

    fn __truediv__(self, other: Self) raises -> Self:
        """Divides two complex numbers."""
        var denominator: Float64 = other.real * other.real + other.imag * other.imag
        if denominator == 0:
            raise Error("Cannot divide by zero in complex division.")
        return Complex(
            (self.real * other.real + self.imag * other.imag) / denominator,
            (self.imag * other.real - self.real * other.imag) / denominator,
        )


fn main() raises:
    var c1 = Complex(3.0, 4.0)
    var c2 = Complex(1.0, -2.0)
    var c3 = Complex()

    print("Complex number c1:", c1)
    print("Complex number c2:", c2)
    print("Complex number c3:", c3)

    print("c1 + c2 =", c1 + c2)
    print("c1 - c2 =", c1 - c2)
    print("c1 * c2 =", c1 * c2)
    print("c1 / c2 =", c1 / c2)

    print("c1 + c3 =", c1 + c3)
    print("c1 - c3 =", c1 - c3)
    print("c1 * c3 =", c1 * c3)
    print("c1 / c3 =:", c1 / c3)
```

Running this code will output:

```console
Complex number c1: 3.0+4.0i
Complex number c2: 1.0-2.0i
Complex number c3: 0.0+0.0i
c1 + c2 = 4.0+2.0i
c1 - c2 = 2.0+6.0i
c1 * c2 = 11.0-2.0i
c1 / c2 = -1.0+2.0i
c1 + c3 = 3.0+4.0i
c1 - c3 = 3.0+4.0i
c1 * c3 = 0.0+0.0i
Unhandled exception caught during execution: Cannot divide by zero in complex division.
/Users/ZHU/Programs/my-first-mojo-project/.magic/envs/default/bin/mojo: error: execution exited with a non-zero result: 1
```

Great, it provides the expected results for addition, subtraction, and multiplication. It also successfully raises an error when we try to divide `c1` by `c3`, which is a complex number with zero real and imaginary parts (i.e., zero).

Here are some notes:

1. We use `Self` in type annotations. This `Self` is a alias for the type of the struct itself, in this case, `Complex`. It is a convenient way to refer to the type of the struct without explicitly writing it out. If you rename the struct to something else, you do not need to change it everywhere in the code.
1. Since we raise an error in the `__truediv__()` method, we need to add the `raises` keyword after the return type annotation (`-> Self`) to indicate that this method may raise an error. This is similar to Python's `raise` statement, but in Mojo, we need to explicitly declare it in the method signature.
1. Because we used the division operator `/` in the main function, we also need to add the `raises` keyword after the `main()` function signature to indicate that the division may raise an error.

::: info Python equivalent

There are some differences between Mojo and Python in this part:

1. In Mojo, we use `Self` to refer to the type of the struct itself. You can also use the struct name directly. In Python, however, if you want to give a type annotation for the struct, you need to use the struct name directly with quotation marks, e.g., `other: "Complex"`. From Python 3.11, you can also `from typing import Self` and use `Self` in type annotations, which is similar to Mojo's way.
1. In Python, you can call different types of errors, such as `ZeroDivisionError`, `ValueError`, etc. In Mojo, however, you can only raise a generic `Error` type. More specific error types may be added in the future.

```python
# src/basic/complex_number.py
class Complex:
    """Complex number with real and imaginary parts."""
    
    # Define fields (attributes)
    # These are not mandatory in Python, but good for documentation.
    real: float  # Real part of the complex number
    imag: float  # Imaginary part of the complex number

    def __init__(self, real: float = 0.0, imag: float = 0.0):
        """Initializes a complex number with real and imaginary parts."""
        self.real = real
        self.imag = imag

    def __str__(self) -> str:
        """Returns a string representation of the complex number."""
        if self.imag < 0:
            return f"{self.real}{self.imag}i"
        else:
            return f"{self.real}+{self.imag}i"
        
    def __add__(self, other: "Complex") -> "Complex":
        """Adds two complex numbers."""
        return Complex(self.real + other.real, self.imag + other.imag)
    
    def __sub__(self, other: "Complex") -> "Complex":
        """Subtracts two complex numbers."""
        return Complex(self.real - other.real, self.imag - other.imag)
    
    def __mul__(self, other: "Complex") -> "Complex":
        """Multiplies two complex numbers."""
        return Complex(
            self.real * other.real - self.imag * other.imag,
            self.real * other.imag + self.imag * other.real
        )
    
    def __truediv__(self, other: "Complex") -> "Complex":
        """Divides two complex numbers."""
        denominator: float = other.real * other.real + other.imag * other.imag
        if denominator == 0:
            raise ZeroDivisionError("Cannot divide by zero in complex division.")
        return Complex(
            (self.real * other.real + self.imag * other.imag) / denominator,
            (self.imag * other.real - self.real * other.imag) / denominator
        )
    
def main():
    c1 = Complex(3.0, 4.0)
    c2 = Complex(1.0, -2.0)
    c3 = Complex()
    
    print("Complex Number 1:", c1)
    print("Complex Number 2:", c2)
    print("Complex Number 3:", c3)

    print("c1 + c2 =", c1 + c2)
    print("c1 - c2 =", c1 - c2)
    print("c1 * c2 =", c1 * c2)
    print("c1 / c2 =", c1 / c2)

    print("c1 + c3 =", c1 + c3)
    print("c1 - c3 =", c1 - c3)
    print("c1 * c3 =", c1 * c3)
    print("c1 / c3 =:", c1 / c3)

main()
```

Running this code will output:

```console
Complex Number 1: 3.0+4.0i
Complex Number 2: 1.0-2.0i
Complex Number 3: 0.0+0.0i
c1 + c2 = 4.0+2.0i
c1 - c2 = 2.0+6.0i
c1 * c2 = 11.0-2.0i
c1 / c2 = -1.0+2.0i
c1 + c3 = 3.0+4.0i
c1 - c3 = 3.0+4.0i
c1 * c3 = 0.0+0.0i
Traceback (most recent call last):
  File "/Users/ZHU/Programs/my-first-mojo-project/src/advanced/complex_number.py", line 65, in <module>
    main()
  File "/Users/ZHU/Programs/my-first-mojo-project/src/advanced/complex_number.py", line 63, in main
    print("c1 / c3 =:", c1 / c3)
  File "/Users/ZHU/Programs/my-first-mojo-project/src/advanced/complex_number.py", line 40, in __truediv__
    raise ZeroDivisionError("Cannot divide by zero in complex division.")
ZeroDivisionError: Cannot divide by zero in complex division.
```

:::

After implementing this simple `Complex` struct, I hope that, at this moment, you have been convinced that Mojo's struct is not difficult. That is great! You can begin to write your own Mojo structs if case you want to try it out yourself.

<!-- ### Operations

## Memory layout of a struct


## Additional features of Mojo structs

### Static methods

### lifetime methods

(This part maybe moved to Chapter Advanced-Lifetime) -->
