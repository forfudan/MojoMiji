# Literal types and type inference

In this section, we will learn about **literal types** and **type inference** in Mojo. Literals are values that you write in the source code, and type inference is the process by which the Mojo compiler automatically determines the data type of a value based on its context.

[[toc]]

## Literal values

We have used the term "literal" and "literal value" in the previous sections. Literals are values that you write in the source code, *as it is*, such as `0x1F2D`, `1234567890`, `3.14`, or `"I am a sentence."` in the following example:

::: code-group

```mojo
def main():
    var a = 0x1F2D  # 0x1F2D is a literal
    var b = 1234567890  # 1234567890 is a literal
    abs(3.14)  # 3.14 is a literal
    print("I am a sentence.")  # "I am a sentence." is a literal
```

```python
def main():
    a = 0x1F2D  # 0x1F2D is a literal
    b = 1234567890  # 1234567890 is a literal
    abs(3.14)  # 3.14 is a literal
    print("I am a sentence.")  # "I am a sentence." is a literal
```

:::

When can see that a literal has some features:

1. It usually appears in the **right-hand side** of an assignment, or as an argument to a function.
1. It is not linked to a name, so you are not able to re-use it in other parts of the code, nor can you modify it.

Thus, the literal can be seen as a temporary value and is only used once. They are used to construct variables or pass arguments to functions.

::: tip R-value and L-value

Literals are usually **R-values** that does not have a memory address and you cannot use any address-related operations on it. The name "R-value" comes from the fact that they usually appear on the right-hand side of an assignment. On contrary, **L-values** are values that have a memory address and can be assigned to a variable. Although being called "L-value", they can appear on both sides of an assignment.

For example, `var a = 123` is an assignment where `a` is an L-value and `123` is an R-value (as you can use `Pointer(to=a)` to get the address of `a` but you cannot do that for the literal `123`). In the expression `var c = a + b`, `a`, `b`, `c` are all L-values (as you can find the addresses of these variables).

Back to literals again. As said before, literals are usually R-values. However, some literals can be L-values, e.g., string literals. This is because string literals are stored in a memory location at runtime and can be referenced by their address.

:::

## Literal types

What happens to literal values when you run the code?

Mojo will first store these literal values into specific **literal types** according to their values and contexts. For example, `12` will be stored with the type `IntLiteral`, `3.14` will be stored with the type `FloatLiteral` (because there is a decimal point), and `"I am a sentence."` will be stored as a `StringLiteral` (because there are quotation marks), etc.

These literal types are primitive types that are built into the Mojo language or in the standard library and they are **not directly exposed** to users. The instances of these literal types are usually pointing to some locations in the memory where the compiled source code is stored, and thus, they are immutable.

If you follow the correct patterns, prefixes, or formats, your input iterals will always be correctly inferred by the Mojo compiler and transferred into the corresponding literal types.

During compilation, these literals will also be evaluated by the compiler, with some optimizations if possible. For example, in the following code, the string literal is split into multiple lines for better readability. During compilation, the compiler will automatically concatenate these lines into a single string literal:

::: code-group

```mojo
def main():
    print(
        "This is a very long string that will be split into multiple lines for"
        " better readability. But it is still one string literal."
    )
```

:::

## Type inference

The Mojo compiler will infer the type of the literal based on its value and context, including **patterns**, **prefixes**, and **formats**. This is called **type inference**.

The table below summarizes the literal types and their corresponding patterns, prefixes, or formats:

| Literal Type    | Pattern, prefix, or format                                             | Example                            |
| --------------- | ---------------------------------------------------------------------- | ---------------------------------- |
| `IntLiteral`    | Starts with a digit or `0b` (binary), `0o` (octal), `0x` (hexadecimal) | `123`, `0b1010`, `0o755`, `0x1F2D` |
| `FloatLiteral`  | Contains a decimal point or in scientific notation                     | `3.14`, `2.71828e-10`, `1.0`       |
| `StringLiteral` | Enclosed in single quotes, double quotes, or triple quotes             | `"Hello"`, `'World'`, `"""Mojo"""` |
| `ListLiteral`   | Enclosed in square brackets with elements separated by commas          | `[1, 2, 3]`, `["a", "b", "c"]`     |

If your literal does not match any of the patterns, prefixes, or formats, you will get an error message during compilation.

## Conversion of literal types at declaration

When you run the code, these literal types will be converted into common data types depending on the context of the code. There are three scenarios:

### No type annotation

If you **do not explicitly annotate the data type** during variable declaration, the literal types will be **automatically converted** into the default data types shown in the table below.

| Literal Type    | Default Data Type<br>to be converted into | Description                            |
| --------------- | ----------------------------------------- | -------------------------------------- |
| `IntLiteral`    | `Int`                                     | 32-bit or 64-bit signed integer        |
| `FloatLiteral`  | `Float64`                                 | 64-bit double-precision floating-point |
| `ListLiteral`   | `List`                                    | List of elements of the same type      |
| `StringLiteral` | `StringLiteral`                           | No convertion is made automatically    |

Note that `StringLiteral` is a special case, where it is not automatically converted to a `String` type for memory efficiency. For example, the following code will automatically convert the `IntLiteral`, `FloatLiteral`, and `ListLiteral` into `Int`, `Float64`, and `List` respectively, while the `StringLiteral` will remain as `StringLiteral`:

::: code-group

```mojo
def main():
    var a = 42  # `42` is inferred as `IntLiteral` and is converted to `Int` by default
    var b = 0x1F2D  # `0x1F2D` is inferred as `IntLiteral` and is converted to `Int` by default
    var c = 3.14  # `3.14` is inferred as `FloatLiteral` and is converted to `Float64` by default
    var d = 2.71828e-10  # `2.71828e-10` is inferred as `FloatLiteral` and is converted to `Float64` by default
    var e = [1, 2, 3]
    # `e` is inferred as `ListLiteral[IntLiteral]` and is converted to `List[Int]` by default
    var f = [[1.0, 1.1, 1.2], [2.0, 2.1, 2.2]]
    # `f` is inferred as `ListLiteral[ListLiteral[FloatLiteral]]` and
    # is converted to `List[List[Float64]]` by default
    var h = "Hello, World!"  # `e` is inferred as `StringLiteral` and is not converted by default
```

:::

If the literal is too big or too small to fit into the default data type, you will also get an error message. For example, if you try to assign a very large integer literal to a variable without type annotation, you will get an error message like this:

::: code-group

```mojo
def main():
    var a = 10000000000000000000000000000000
    print(a)
```

:::

```console
error: integer value 10000000000000000000000000000000 requires 104 bits to store, but the destination bit width is only 64 bits wide
    print(a)
         ^
```

This is because the default data type for integer literals is `Int`, which is a 64-bit signed integer. The literal `10000000000000000000000000000000` requires 104 bits to store, which exceeds the maximum size of `Int`. This causes an error.

### With type annotation

If you annotate the data type during variable declaration, the literal types will be converted into the **specified** data types.

In the following example, we use type annotations to specify the data type of each variable. The literal types will be converted into the specified data types even though these types are not the default data types.

::: code-group

```mojo
def main():
    var a: UInt8 = 42  # IntLiteral `42` is converted to `UInt8`
    var b: UInt32 = 0x1F2D  # IntLiteral `0x1F2D` is converted to `UInt32`
    var c: Float16 = 3.14  # FloatLiteral `3.14` is converted to `Float16`
    var d: Float32 = (
        2.71828e-10  # FloatLiteral `2.71828e-10` is converted to `Float32`
    )
    var e: List[Float32] = [1, 2, 3]
    # `ListLiteral[IntLiteral]` is converted to `List[Float32]`
    var f: String = "Hello, World!"  # `StringLiteral` is converted to `String`
```

:::

Notably, the variable `e` is annotated as a list of floating-point numbers; even though the literal is a list of integers, it will still be successfully converted to a list of `Float32` numbers. This is because a integer literal is **compatible** with a floating-point type.

If your type annotation is **incompatible** with the type of the literal, things will be different: you will get an error message. For example, you try to assign a float literal to an `Int` variable:

::: code-group

```mojo
# src/basic/types/incompatible_literal_type_and_annotation.mojo
# This code will not compile
def main():
    var a: Int = 42.5
    print(a)
```

:::

Running the code will give you an error message like this:

```console
error: cannot implicitly convert 'FloatLiteral[42.5]' value to 'Int'
    var a: Int = 42.5
                 ^~~~
```

::: warning Incompatible type annotation in Python

Note that the error above will not happen in Python. The type annotation in Python is just a **hint** for users and type checkers, but it does not affect the runtime behavior of the code. In other words, when there are conflicts between the type annotation and the literal type of the value, Python will take the literal type of the value and ignore the type annotation.

If you want to ensure that the type annotation is compatible with the literal type, you can use a type checker like `mypy` to check your code before running it.

:::

### By constructors

The last scenario is when you use a **constructor** to create a variable. In this case, the literal types will be converted into the data types specified in the constructor.

To call a constructor, we can simply use the name of the type followed by parentheses `()`, and then pass the literal into it. The above code can be re-written with constructors as follows:

::: code-group

```mojo
def main():
    var a = UInt8(42)  # IntLiteral `42` is converted to `UInt8`
    var b = UInt32(0x1F2D)  # IntLiteral `0x1F2D` is converted to `UInt32`
    var c = Float16(3.14)  # FloatLiteral `3.14` is converted to `Float16`
    var d = Float32(
        2.71828e-10  # FloatLiteral `2.71828e-10` is converted to `Float32`
    )
    var e = List[Float32](1, 2, 3)
    # `ListLiteral[IntLiteral]` is converted to `List[Float32]`
    var f = String("Hello, World!")  # `StringLiteral` is converted to `String`
```

:::

In Mojo as well as in Python, a constructor is a special method of the corresponding type that initializes a new instance of the type, defined by the method `__init__()`. Calling a constructor by its type name is just a shortcut for calling the `__init__()` method of the type.

For example, the built-in `Int` type has a `__init__()` method that takes a single argument `IntLiteral` and initializes a new instance of `Int`. See the following code from the standard library of Mojo:

```mojo
# Mojo standard library
# https://github.com/modular/modular/blob/main/mojo/stdlib/stdlib/builtin/int.mojo

struct Int:
    ...

    fn __init__(out self, value: IntLiteral):
    """Construct Int from the given IntLiteral value.

    Args:
        value: The init value.
    """
    self = value.__int__()
```

This allows you to create a new instance of `Int` by passing using the syntax `Int(value)`, where `value` is an `IntLiteral`.

You can also define such a `__init__()` method in **your own types** to allow users to create instances from any literal types.

::: tip type coercion

In the code above, `var a: Int = 42.5` will not compile successfully because the literal type `FloatLiteral` is not compatible with the type annotation `Int`. A deeper reason is that the `Int` type does not have a `__init__(out self, value: FloatLiteral)` method defined, so the compiler cannot convert the `FloatLiteral` into `Int` automatically.

However, if you use a constructor to create a variable, such as `var a = Int(42.5)`, it will compile successfully.

```mojo
def main():
    var a = Int(42.5)  # This will compile successfully
    print(a)  # Output: 42
```

Why? This is because, when being passed into a function, the literal type `FloatLiteral` will be **coerced** (automatically converted) into the corresponding default type `Float64`. This means that the following steps will be performed:

1. `42.5` is inferred as `FloatLiteral`.
1. The `FloatLiteral` is coerced into `Float64` by the Mojo compiler.
1. The `Float64` value is passed to the `Int.__init__()` method as an argument.
1. There is a method `__init__[T: Intable](out self, value: T)` defined in the `Int` type. Since [`Float64` conforms to the `Intable` trait](../advanced/generic), the program will compile successfully.

On the contrary, this type coercion will not happen when you use a type annotation during variable declaration. This is why you get an error message when you try to assign a `FloatLiteral` to an `Int` variable with type annotation.
