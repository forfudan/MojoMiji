# Data types

[[toc]]

Types of data are the foundation of programming languages. They define how one and zeros in the memory are interpreted as human-readable values. Mojo's data types are similar to Python's, but with some differences due to Mojo's static compilation nature.

In this chapter, we will discuss the most common data types in Mojo.

## Type annotations

Python is a dynamic, strongly-typed language. When we say that it is strongly-typed, we mean that Python enforces type checking at runtime and there are less implicit type conversions. When we say that it is dynamic, we mean that Python does not require you to declare the type of a variable before using it. You can assign any value to a variable, and Python will determine its type at runtime. From Python 3.5 onwards, Python also supports type hints, which allows you to annotate the types of variables and function arguments, but these are optional and do not affect the runtime behavior and performance of the code. Giving incorrect type hints will not cause any errors. The Python's type hints are primarily for static analysis tools and IDEs to help you catch potential errors before running the code, and it also helps other developers (or yourself in future) understand your code better.

Python's type hints are primarily for IDE static checks and readability, and are not mandatory, having no impact on performance^[Compilers like Cython and mypyc may use type hints for partial optimization.].

In contrast, Mojo is statically compiled. Therefore, data types of variables must be explicitly declared so that the compiler can allocate appropriate memory space. Sometimes, the type of the variables can be ***inferred*** by the compiler based on the assigned literals, expressions, and the returns of functions. However, it is still recommended to provide type annotations (or use explicit constructors) for clarity and to avoid ambiguity. We will see in later chapters that absence of type annotations can lead to unintended behavior. For example,

```mojo
fn main():
    var a: Float64 = 120.0            # Use type annotations for literals
    var b: Int = 24                   # Use type annotations for literals
    var c = String("Hello, world!")   # Use explicit constructors
    var d = Int128(100) ** Int128(2)  # Use explicit constructors
```

::: tip Inlay hints

Some IDEs provides inlay hints that show the inferred types of variables. You can use it to check whether the compiler has inferred the data type correctly. For example, the Rust and Python extensions of Visual Studio Code provide inlay hints. Mojo does not yet provide this feature. Thus, I recommend you to always provide type annotations, particularly for literals.

:::

## Numeric types

### Integer

In Mojo, the most common integer type is `Int`, which is either a 32-bit or 64-bit signed integer depending on your system. It is ensured to cover the range of addresses on your system. It is similar to the `numpy.intp` type in Python and the `isize` type in Rust. Note that it is different from the `int` type in Python, which is an arbitrary-precision integer type.

Mojo also has other integer types with different sizes in bits, such as `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `Int256` and their unsigned counterparts `UInt8`, `UInt16`, `UInt32`, `UInt64`, `UInt128`, `UInt256`. The table below summarizes the integer types in Mojo and corresponding integer types in Python:

| Mojo Type              | Python Type        | Description                                               |
| ---------------------- | ------------------ | --------------------------------------------------------- |
| `Int`                  | `numpy.intp`       | 32-bit or 64-bit signed integer, depending on the system. |
| `Int8`                 | `numpy.int8`       | 8-bit signed integer. Range: -128 to 127.                 |
| `Int16`                | `numpy.int16`      | 16-bit signed integer. Range: -32768 to 32767.            |
| `Int32`                | `numpy.int32`      | 32-bit signed integer. Range: -2147483648 to 2147483647.  |
| `Int64`                | `numpy.int64`      | 64-bit signed integer. Range: -2^63 to 2^63-1.            |
| `Int128`               | `decimojo.Int128`  | 128-bit signed integer. Range: -2^127 to 2^127-1.         |
| `Int256`               | `decimojo.Int256`  | 256-bit signed integer. Range: -2^256 to 2^256-1.         |
| `UInt8`                | `numpy.uint8`      | 8-bit unsigned integer. Range: 0 to 255.                  |
| `UInt16`               | `numpy.uint16`     | 16-bit unsigned integer. Range: 0 to 65535.               |
| `UInt32`               | `numpy.uint32`     | 32-bit unsigned integer. Range: 0 to 4294967295.          |
| `UInt64`               | `numpy.uint64`     | 64-bit unsigned integer. Range: 0 to 2^64-1.              |
| `UInt128`              | `decimojo.UInt128` | 128-bit unsigned integer. Range: 0 to 2^128-1.            |
| `UInt256`              | `decimojo.UInt256` | 256-bit unsigned integer. Range: 0 to 2^256-1.            |
| `SIMD[DType.index, 1]` | `numpy.intp`       | 32-bit or 64-bit signed integer, depending on the system. |
| `decimojo.BigInt`      | `int`              | Arbitrary-precision. 9^10-based internal representation.  |

You can create a integer variable in decimal, binary, hexadecimal, or octal format. If we do not explicitly specify the type of the integer literal, the compiler will infer it as `Int` by default. If we explicitly specify the type of the integer, or we use the constructor of the integer type, the compiler will use that type. The following example shows how to create integer variables in different formats:

```mojo
def main():
    var a = 0x1F2D         # Hexadecimal
    var b = 0b1010         # Binary
    var c = -0o17          # Octal
    var d = 1234567890     # Decimal
    var e: UInt32 = 184    # 32-bit unsigned Integer
    var f = Int128(12345)  # 128-bit Integer from constructor
    var g: Int8 = Int8(12) # 8-bit Integer from constructor and with type annotation
    var h = SIMD[DType.index, 1](10)  # Integer with index type
    print(a, b, c, d, e, f, g, h)
# Output: 7981 10 -15 1234567890 184 12345 12 10
```

If the value assigned to an integer variable exceeds the range of the specified type, you may encounter either an error or an overflow. For example, if you try to assign the value 256 to a variable of type `UInt8`, you will encounter an overflow.

```mojo
def main():
    var overflow: UInt8 = 256
    print(overflow)
# Output: 0
```

Note that there is no error message printed in this case. This is because Mojo does not perform runtime checks for integer overflows by default. We need to be very careful when using integer types in Mojo compared to Python.

If you really need to work on big integers that are larger than the capacity of `Int`, you can consider using the `BigInt` type in the [decimojo package](../extensions/decimojo.md), which has the similar functionality as the `int` type in Python.

### Floating-point numbers

Compared to integer types, floating-point numbers in Mojo share more similarities with Python.

## String

::: warning Version 24.5

This section is based on Mojo version 24.5. The behavior of `String` has been changing rapidly since then. Some of the features described here may not be applicable to the latest versions of Mojo, and some of the features may still be changing in future versions.

:::

String is an important type of Mojo and Python, which represents a sequence of UTF-8 encoded characters. String is usually displayed in paired quotation marks, e.g., `'a'`, `"abc"`.

`String` is stored on heap as a sequence of unsigned integers (`UInt8`), and with an `0` at the end. Because UTF-8 encoding is not fixed in bytes, each character may take space from 1 byte to 4 bytes.

The following example shows how `"abc"` is stored in the memory.

```console
Each cell represent a byte (UInt).
┌──┬──┬──┬─┐
│97│98│99│0│
└──┴──┴──┴─┘
Or in raw binary form.
┌────────┬────────┬────────┬────────┐
│00111101│00111101│00111101│00000000│
└────────┴────────┴────────┴────────┘
```

A valid UTF-8 character must starts with `0` (1-byte character), `110` (2-byte character), `1110` (3-byte character), `11110` (4-byte character). The non-first bytes of a string must be `10`.

This also means that not all slices of 1 bytes to 4 bytes are valid UTF-8 characters.

::: info Example

ASCII codes are always stored as one-byte with UTF-8 encoding. Chinese characters usually takes more than 2 bytes. 

For example, "你好", which means "hello", are display as two characters. But it is stored by more than 2 bytes. We can examine its exact `UInt` sequence in the memory with the following code:

```mojo
fn main():
    var a: String = "你好"
    for i in a.as_bytes():
        print(i[], end=" ")
    # It prints: 228 189 160 229 165 189
```

It means that the two characters are actually stored in memory as follows, each character taking 3 bytes (starting with `111`).

```console
Each cell represent a byte (UInt).
┌───┬───┬───┬───┬───┬───┐
│228│189│160│229│165│189│
└───┴───┴───┴───┴───┴───┘
Or in raw binary form.
┌────────┬────────┬────────┬────────┬────────┬────────┐
│11100100│10111101│10100000│11100101│10100101│10111101│
└────────┴────────┴────────┴────────┴────────┴────────┘
Note that the null value at the end is not displayed.
```

:::

::: warning UTF-8 assurance

Python adopts an algorithm to assure that indexing and iterator of a String returns a valid character.

This is not yet completely implemented in Mojo (as of version 24.5). The iterator returns correct characters while indexing does not.

```mojo
fn main():
    var a: String = "你好"
    print(a[0])
    # This prints "�", invalid character. We expect "大".
```

```mojo
fn main():
    var a: String = "你好"
    for i in a:
        print(i)
    # This prints "你" and "好", correct!
```

In future, Mojo will also guarantee that String slicing returns valid UTF-8 characters.

:::
