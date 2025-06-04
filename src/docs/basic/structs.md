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

Let's now look at a simple example, a `Complex` struct that represents a complex number with real and imaginary parts. We will define the struct with two fields, `real` and `imag`, and some useful methods to manipulate complex numbers, such as addition and multiplication. For comparison, we will also show the equivalent Python code.

### Basic information


### Dunder methods

`__add__` can overload the `+` operator, and `__mul__` can overload the `*` operator. The `__str__` method is used to convert the struct to a string representation, which is useful for printing the struct instance. We will discuss the mechanism of operator overloading in Chapter [Generic and traits](../advanced/generic.md).

I hope that, at this point, you have been convinced that Mojo's struct almost the same as Python's class. That is great! You can also begin to write your own Mojo structs if case you want to try it out yourself.

<!-- ### Operations

## Memory layout of a struct


## Additional features of Mojo structs

### Static methods

### lifetime methods

(This part maybe moved to Chapter Advanced-Lifetime) -->
