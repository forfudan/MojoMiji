# Structs

> You exist as a free spirit until you join a group, whereupon you are rechristened as a ***Spirit von der Gruppe***.  
> -- Yuhao Zhu, *Gate of Heaven*

Though Python does not has the concept of "struct", it has a similar concept called "class". In many cases, you can use a struct to achieve the same functionality as a class in Python. These, I put the struct in the "basic" part of this Miji Book.

::: info Compatible Mojo version

This chapter is compatible with Mojo v25.4 (2025-06-18).

:::

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

First, you need to use the `struct` keyword and provide a name for the struct.

Then, optionally, you can define parameters in square brackets `[]`. We will discuss this in the later Chapter [Parametrization](../advanced/parameterization).

The struct can also implement one or more traits, which is a way to define shared behavior across different types. The traits are defined in parentheses `()`. This syntax is similar to how we define a class that inherits from another class in Python. We will discuss more about this in Chapter [Generic and traits](../advanced/generic.md).

Within the code block of the struct, you can declare the fields (attributes) of the struct using the `var` keyword, followed by the field name and its type. It is just like declaring a normal variable, but this time, **we cannot omit the `var` keyword and the type annotation**. These two things are mandatory for Mojo compiler to know how much memory is needed to store the struct.

You can also define methods (special functions that are defined within structs) using either the `def` keyword or the `fn` keyword. We have already discussed the functions in Chapter [Functions](./functions.md), nothing special here. The only difference is that the first argument of the method is `self`, which means that the function will operate on the instance of the struct.

When we call a method of a struct, we use the dot notation, just like we do in Python. For example, if we have a variable `obj` of the type `StructName` (we also say that `obj` is an instance of `StructName`), we can call its method `method1()` in two ways:

1. `StructName.method1(obj, arg1, arg2)`. This is just like calling a normal function. The variable `obj` is passed as the first argument to the method, the same as the signature of the method.
1. `obj.method1(arg1, arg2)`. This is equivalent and shorter than the first way, but it is more common and elegant. In this way, we can omit the first argument `self` and simply call the method with the remaining arguments.

Similar to Python, we have a special method called `__init__()` that is used to initialize the struct instance. This method allows us to use the name of the struct as a constructor, for example, `var obj = StructName(arg1, arg2)` as we have encountered many times in previous chapters ([Data types](../basic/types.md)). The one minor addition is the keyword `out` is needed before `self` in the `__init__()` method.

## Example struct - complex number

Let's now look at a simple example, a `Complex` struct that represents a complex number with real and imaginary parts. We will define the struct with two fields, `real` and `imag`, and some useful methods to manipulate complex numbers, such as addition and multiplication. For comparison, we will also show the equivalent Python code at the same time.

### Define fields

First, we define the struct with the name `Complex` and two fields, `real` and `imag`. We also use the docstring to describe the struct and its fields, for better documentation and understanding. The Mojo code as well as the Python equivalent are as follows:

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# src/basic/complex_number.mojo
struct Complex:
    """Complex number with real and imaginary parts."""

    var real: Float64
    """Real part of the complex number."""
    var imag: Float64
    """Imaginary part of the complex number."""
```

</td><td>

```python
# src/basic/structs/complex_number.py
class Complex:
    """Complex number with real and imaginary parts."""
    
    # Define fields (attributes)
    # These are not mandatory in Python, but good for documentation.
    real: float  # Real part of the complex number
    imag: float  # Imaginary part of the complex number
```

</td></tr></table>

### Basic methods

Next, we define the `__init__()` method to enable users to use the constructor to initialize the struct instance with the given real and imaginary parts.

We also define a `write_to()` method to to enable `print()` function to work on the struct. The Mojo code is as follows.

```mojo
# src/basic/structs/complex_number.mojo
struct Complex(Writable):
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

It is expected, yet several things to note here:

1. The `__init__()` method is defined with the `out` keyword before `self`, which is required in Mojo to indicate that `self` is the output of the method.
1. We set default values for the `real` and `imag` parameters in the `__init__()` method, so that we can create a complex number without providing any arguments.
1. The `write_to()` method is defined to enable the `print()` function to work on the struct. The `write_to()` method reads in a `Writer` instance, and writes the complex number components and necessary symbols to it. Since the `writer` object needs to be modified, we use the `mut` keyword to indicate that it is mutable.
1. The `write_to()` method is a general method that can be used by many different structs. In Mojo, we call a behavior that can be shared among different types a **trait**. In this case, we say that the `Complex` struct conforms to the `Writable` trait, which means it has a `write_to()` method and can be printed using the `print()`.
1. We need to explicitly declare the traits in the struct definition, i.e., `struct Complex(Writable):`. This syntax is similar to how we define a class that inherits from another class in Python. We will discuss traits in Chapter [Generic and traits](../advanced/generic.md) later.

::: tip Traits and methods

The concept of traits and how to use them will be covered by this Miji as an advanced topic. However, for now, you just need to remember it in the following way:

Some special dunder methods, such as `write_to()`, `__str__()`, `__int__()`, etc, are corresponding to some traits, such as `Writable`, `Stringable`, `Intable`, etc. If you define these methods in your struct, you have to **explicitly** put the trait name in the struct definition, e.g., `struct Complex(Writable):`.

If you forget to do so, the Mojo compiler will raise an error and remind you which trait you need to add into the parentheses of the struct definition. So, don't worry too much about it for now.

If you are interested in which traits are available in Mojo, you can check Section [Dunder methods and built-in functions](../advanced/generic#dunder-methods-and-built-in-functions).

:::

::: info Python equivalent

The major difference between Mojo and Python in this part is that Mojo uses the `write_to()` method to enable the `print()` function, while Python uses the `__str__()` method. If you only define a `__str__()` method in Mojo, you can only enable the `String()` constructor to obtain a string representation of the struct, but not the `print()` function. Thus, the Python `__str__()` method can simultaneously achieve two goals (string conversion and printing).

```python
# src/basic/structs/complex_number.py
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

It is identical to Python, and we have partially discussed this in Chapter [Operators](../basic/operators.md). For now, we just use our knowledge of Python to define these methods in the `Complex` struct. Later, we will investigate the mechanism behind definement of operators in Section [Dunder methods and operators overloading](../advanced/generic#dunder-methods-and-operators-overloading) of Chapter Generic and traits.

The formulae for basic arithmetic operations on complex numbers are simple. As a Pythonista, you can try to do this yourself before looking at the code below, maybe starting with Python code and then converting it to Mojo.

```mojo
# src/basic/structs/complex_number.mojo
struct Complex(Writable):
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
# src/basic/structs/complex_number.py
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

## Memory layout of struct

You may wonder how Mojo stores the struct in memory. In short, Mojo stores the fields of a struct in a **contiguous block of memory** on stack, and the size of the struct is the **sum of the sizes of all its fields** up to the nearest multiple of 8 bytes. The block of memory on stack is **fixed in size** during the runtime, although it may further point to other blocks of memory on heap for some fields that are composite types, e.g., `List`, `String`, etc (refer to [Memory layout of Mojo objects](../misc/layout.md) for more details).

Let see a concrete example, a `Human` struct that represents a human with a name (string), an age (8-bit unsigned integer ranging from 0 to 255), a height in meter (16-bit floating number), and birth date (list of 16-bit unsigned integers representing year, month, and day). The code is as follows:

```mojo
# src/basic/human.mojo
struct Human:
    """A simple human structure."""

    var name: String
    var age: UInt8
    var height: Float16
    var date: List[UInt16]

    fn __init__(out self, name: String, age: UInt8, height: Float16, date: List[UInt16]):
        """Initializes a human with a name."""
        self.name = name
        self.age = age
        self.height = height
        self.date = date

fn main():
    var human = Human("Yuhao Zihong Xianyong Mengzexianke Zhu", 124, 1.70, List[UInt16](1901, 2, 5))
```

We have four fields in the `Human` struct, and their types are fixed and known at compile time. Note that the `String` and `List` types are composite types, which means that:

1. Their actual data is stored on heap, and the struct only contains a pointer to the data (i.e., `UnsafePointer`).
1. They contain additional metadata (like size and capacity) in addition to the actual data.
1. The size of the unsafe pointer, the size and the capacity are 8 bytes each.
1. Since `String` and `List` are also structs, according to the rule mentioned above, the size of the `String` and `List` fields takes 24 bytes each (summation of the sizes of their own fields).

The size of each field of Human is thus summarized as follows:

| Field    | Type           | Size (bytes) | Note                                                                                       |
| -------- | -------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `name`   | `String`       | 24 (8 * 3)   | Contains three fields: data (`UnsafePointer`), size (`Int`), capacity (`UInt` but encoded) |
| `age`    | `UInt8`        | 1            |                                                                                            |
| `height` | `Float16`      | 2            |                                                                                            |
| `date`   | `List[UInt16]` | 24 (8 * 3)   | Contains three fields: data (`UnsafePointer`), size (`Int`), capacity (`Int`)              |

In total, the total size of all fields of the `Human` struct is `24 + 1 + 2 + 24 = 51` bytes. Mojo then aligns the size of the struct to the nearest multiple of 8 bytes, so the actual size of the `Human` struct is `56` bytes (5 bytes are not used to store any data, not necessarily located at the end).

When you create an instance of the `Human` struct, Mojo allocates a block of memory on stack with size 56 bytes, and stores the values of the fields in this block. 

Below is a brief illustration of how the memory layout of the `Human` struct looks like in memory. Note that the addresses are randomly generated and the capacity of `String` type is encoded and is not a human-readable value.

```console
# Memory layout of Human struct

                    Variable `human: Human`
                     │
                     │  Field `name`                                   Field `age`                  Field `height`                   Field `date`
                     │  │                                              │                            │                                │
                     ↓  ↓                                              ↓                            ↓                                ↓
                 ┌──────────────────────────────────────────────────┬─────────────┬───────────┬───────────────────┬───────────┬──────────────────────────────────────────────────┐
Field            │                name: String                      │  age: UInt8 │  Unused   │  height: Float16  │  Unused   │               date: List[UInt16]                 │
                 ├─────────────────────┬───────────┬────────────────┼─────────────┼───────────┼───────────────────┼───────────┼─────────────────────┬───────────┬────────────────┤
Field in field   │ data: UnsafePointer │ size: Int │ capacity: UInt │             │           │                   │           │ data: UnsafePointer │ size: Int │ capacity: Int  │
                 ├─────────────────────┼───────────┼────────────────┼─────────────┼───────────┼───────────────────┼───────────┼─────────────────────┼───────────┼────────────────┤
Size in byte     │ 8                   │   38      │       8        │   1         │   1       │ 2                 │  4        │ 8                   │   8       │       8        │
                 ├─────────────────────┼───────────┼────────────────┼─────────────┼───────────┼───────────────────┼───────────┼─────────────────────┼───────────┼────────────────┤
Value            │ 0x1000              │   5       │   (encoded)    │   124       │           │ 1.70              │           │ 0x2000              │   3       │       3        │
                 ├─────────────────────┼───────────┼────────────────┼─────────────┼───────────┼───────────────────┼───────────┼─────────────────────┼───────────┼────────────────┤
Address          │ 0x00-0x07           | 0x08-0x0F |   0x10-0x17    │  0x18       │  0x19     │ 0x1a-0x1b         │ 0x1c-0x1f │ 0x20-0x27           │ 0x28-0x2f │ 0x30-0x37      │
                 ├─────────────────────┼───────────┼────────────────┼─────────────┼───────────┼───────────────────┼───────────┼─────────────────────┼───────────┼────────────────┤
Offset           │ 0                   | 8         |   16           │  24         │  25       │ 26                │  28       │ 32                  │ 40        │ 48             │
                 └─────────────────────┴───────────┴────────────────┴─────────────┴───────────┴───────────────────┴───────────┴─────────────────────┴───────────┴────────────────┘
                     │                                                                                                             │
            ┌────────┘                                                                                                             │
            ↓ (points to a continuous memory block that contains the actual data of the String)                                    │
        ┌────────┬────────┬────────┬────────┬────────┐                                                                             │
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │                                                                             │
        ├────────┼────────┼────────┼────────┼────────┤                                                                             │
Value   │   89   │   117  │   104  │   97   │   111  │                                                                             │
        ├────────┼────────┼────────┼────────┼────────┤                                                                             │
Address │ 0x1000 │ 0x1001 │ 0x1002 │ 0x1003 │ 0x1004 │                                                                             │
        └────────┴────────┴────────┴────────┴────────┘                                                                             │
                                                                                                                                   │
            ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
            ↓ (points to a continuous memory block that contains the actual data of the List)
        ┌───────────────┬───────────────┬───────────────┐
Type    │ UInt16        │ UInt16        │ UInt16        │
        ├───────────────┼───────────────┼───────────────┤
Value   │  1901         │   2           │   5           │
        ├───────────────┼───────────────┼───────────────┤
Address │ 0x2000-0x2001 │ 0x2002-0x2003 │ 0x2004-0x2005 │
        └───────────────┴───────────────┴───────────────┘
```

::: tip Fetch value of a field in a struct

This may be beyond the scope of this Miji, but you may wonder how Mojo fetches the value of a field in a struct, e.g., `print(human.name)`. 

The answer is that Mojo fetches this value at the correct address and with the correct type information.

Mojo always remembers the first address of the struct of `human` in memory, which is `0x00` in the above example. It then uses the above memory layout to calculate the distance of the field `name` from the start of the struct's memory block, which is 24 bytes (8 bytes for `data`, 8 bytes for `size`, and 8 bytes for `capacity`). Such distance is called the **offset** of the field. Mojo calculates the address of the `name` field as `0x00 + 24 = 0x18`, and reads the value from this address.

:::

::: danger Verify the memory layout of a struct

You can easily (but not safely) verify whether the above memory layout is correct by casting the values in the memory block to a sequence of bytes or other types. Users of C language may be familiar with this approach. In Mojo, we could use the `bitcast()` method of an unsafe pointer (`UnsafePointer`) to achieve this.

But be warned that this is an unsafe operation! You should not touch this unless you are sure about what you are doing.

```mojo
# src/basic/human.mojo
from memory import UnsafePointer

struct Human:
    # same as above
    ...

fn main():
    var human = Human("Yuhao Zihong Mengzexianke Xianyong Zhu", 124, 1.70, List[UInt16](1901, 2, 5))
    var ptr = UnsafePointer(to=human).bitcast[UInt8]()
    print("Fields of `human: Human` on stack")
    print("Byte 0x00-0x07 should be `data: UnsafePointer`:", end=" ")
    print((ptr + 0).bitcast[UnsafePointer[UInt8]]()[])
    print("Byte 0x08-0x0f should be `size: Int`:", end=" ")
    print((ptr + 8).bitcast[Int]()[])
    print("Byte 0x18 should be `age: UInt8`:", end=" ")
    print((ptr + 24).bitcast[UInt8]()[])
    print("Byte 0x1a-0x1b should be `height: Float16`:", end=" ")
    print((ptr + 26).bitcast[Float16]()[])
    print("Byte 0x20-0x27 should be `data: UnsafePointer`:", end=" ")
    print((ptr + 32).bitcast[UnsafePointer[UInt16]]()[])
    print("Byte 0x28-0x2f should be `size: Int`:", end=" ")
    print((ptr + 40).bitcast[Int]()[])
    print("Byte 0x30-0x37 should be `capacity: Int`:", end=" ")
    print((ptr + 48).bitcast[Int]()[])
    print("========================================")
    print("Data of `date: List[UInt16]` on heap")
    for i in range(0, 3):
        print(((ptr + 32).bitcast[UnsafePointer[UInt16]]()[] + i)[], end=" ")
```

Running this code will output the following, which matches the memory layout we discussed above:

```console
(base) ZHU@MBP-Dr-Yuhao-Zhu basic % magic run mojo run -I ./src human.mojo
Human on stack
Byte 0x00-0x07 should be `data: UnsafePointer`: 0x3180042b0
Byte 0x08-0x0f should be `size: Int`: 38
Byte 0x18 should be `age: UInt8`: 124
Byte 0x1a-0x1b should be `height: Float16`: 1.7001953
Byte 0x20-0x27 should be `data: UnsafePointer`: 0x1083cc008
Byte 0x28-0x2f should be `size: Int`: 3
Byte 0x30-0x37 should be `capacity: Int`: 3
========================================
Data of `date: List[UInt16]` on heap
1901 2 5 %  
```

:::

::: tip Why I use such a long name?

The name of the human in the previous example, "Yuhao Zihong Xianyong Mengzexianke Zhu", is quite long. Why I choose this long name? Because the `String` type in Mojo will optimize the memory layout for short strings (less than 24 bytes) by simply storing the string data in the 24-bit memory block of the `String` struct, without allocating additional memory on heap. To force a heap allocation, I used such a long name.

Actually, this long name is not random. It consists my given name, my courtesy name(s), my art name, and my family name.

:::

<!-- ## Additional features of Mojo structs

### Static methods

### lifetime methods

(This part maybe moved to Chapter Advanced-Lifetime) -->

## Major changes in this chapter

- 2025-06-23: Update to accommodate to the changes in Mojo v24.5.
