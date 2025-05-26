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

Mojo also has other integer types with different sizes in bits, such as `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `Int256` and their unsigned counterparts `UInt8`, `UInt16`, `UInt32`, `UInt64`, `UInt128`, `UInt256`. The instance of each type will be stored on the stack with exactly the bits specified by the name of the type.

The table below summarizes the integer types in Mojo and corresponding integer types in Python:

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

::: tip Exercise

Now we want to calculate the $12345^5$. Since the result is big (around 20 digits), we use `Int128` to avoid overflow. Try to run the following code in Mojo and see what happens. Explain why the result is unexpected and how to fix it.

```mojo
def main():
    var a: Int128 = 12345 ** 5
    print(a)
```

:::

::: details Answer

The result is `-8429566654717360231`. It is a negative number, which is unexpected. The correct answer should be `286718338524635465625`. Usually, when we see a negative value, we know that it is probably due to an overflow.

The reason is that, when we write `12345 ** 5` in the right-hand side of the assignment, we did not explicitly specify the type of the values. As mentioned above, if we do not explicitly specify the type of the integer literal, the compiler will infer it as `Int` by default. Thus, `12345` and `5` will be both saved as an `Int` type (64-bit signed integer on a 64-bit system).

Since the result of `12345 ** 5` exceeds the maximum value of `Int` type (`2^63 - 1`), an overflow occurs. And value of `12345 ** 5` becomes `-8429566654717360231`. This wrong value is then assigned to the variable `a` of type `Int128`.

To fix this, we need to explicitly specify the type of the integer literals in the right-hand side of the assignment. We can do this by using the `Int128` constructor, like this:

```mojo
def main():
    var a = Int128(12345) ** Int128(5)
    print(a)
```

Now the result will be `286718338524635465625`, which is the correct answer.

:::

### Floating-point number

Compared to integer types, floating-point numbers in Mojo share more similarities with Python. The table below summarizes the floating-point types in Mojo and corresponding types in Python:

| Mojo Type | Python Type     | Description                                                                     |
| --------- | --------------- | ------------------------------------------------------------------------------- |
| `Float64` | `float`         | 64-bit double-precision floating-point number. Default type for floats in Mojo. |
| `Float32` | `numpy.float32` | 32-bit single-precision floating-point number.                                  |
| `Float16` | `numpy.float16` | 16-bit half-precision floating-point number.                                    |

To construct a floating-point number in Mojo, you can do that in three ways:

1. Simply assign a floating-point literal to a variable without type annotations. A floating-point literal is a number with a decimal point or in scientific notation, e.g, `3.14` or `1e-10`. Mojo will automatically use `Float64` as the default type.
1. Use type annotations to specify the type of the floating-point number, e.g., `var a: Float32 = 3.14`.
1. Use the corresponding constructor, e.g., `Float64(3.14)`, `Float32(2.718)`, or `Float16(1.414)`.

See the following examples.

```mojo
def main():
    var a = 3.14                # Float64 by default
    var b: Float32 = 2.718      # Float32 with type annotation
    var c = Float16(1.414)      # Float16 with constructor
    print(a, b, c)
# Output: 3.14 2.718 1.4140625
```

::: warning Floating-point values are inexact

You may find that the output of `Float16(1.414)` is `1.4140625`, which is not exactly `1.414`. This is because floating-point numbers are inexact representations of real numbers. This is because floating-point numbers are internally represented in binary format, while it is printed in decimal format. Not all decimal numbers can be represented exactly in binary format, and vice versa. Thus, when you create a floating-point number, e.g., `Float16(1.414)`, it may be stored as the closest representable value in binary format, which is `1.4140625` in this case.

This is a common issue in many programming languages, including Python. You can have two methods to avoid or mitigate this issue:

1. Use higher precision floating-point types, such as `Float64` or `Float32`, which can represent more decimal places and reduce the error. Note that the values are still inexact, but the error can be negligible.
1. Use the `Decimal` type, which is internally presented in base 10. It can represent decimal numbers exactly, but it is slower than floating-point types. You can find more information about `Decimal` type in the [decimojo package](../extensions/decimojo.md).

:::

## String

::: warning Version 25.3

This section is based on Mojo version 25.3. The behavior of `String` has been changing rapidly since then. Some of the features described here may not be applicable to the latest versions of Mojo, and some of the features may still be changing in future versions.

There are many ongoing discussions about the design of `String` in Mojo. The official team is still working on it. Here are some nice references that we can refer to:

- [Proposal on String Design](https://github.com/modular/modular/blob/main/mojo/proposals/string-design.md
) in the Mojo official repo for more up-to-date information.
- [PR #3984: Un-deprecate `String.__iter__()`](https://github.com/modular/modular/pull/3984).
- [PR #3988: String, ASCII, Unicode, UTF, Graphemes](https://github.com/modular/modular/pull/3988).

:::

::: tip Quick comparison between Mojo and Python

| Functionality                     | Python `str`                           | Mojo `String`                                       |
| --------------------------------- | -------------------------------------- | --------------------------------------------------- |
| Constructed from string literals  | Use of`str()` constructor is optional. | You have to use `String()` constructor.             |
| Print string with `print()`       | Yes.                                   | Yes.                                                |
| Format string with `format()`     | Yes, use `{}`.                         | Yes, but you cannot specify formatting, e.g, `.2f`. |
| f-strings                         | Yes.                                   | Not supported.                                      |
| Iteration over UTF-8 code points  | Yes, use `for i in s:` directly.       | Yes, but more complicated.                          |
| UTF8-assured indexing and slicing | Yes, use `s[i]` or `s[i:j]` directly.  | Not supported.                                      |

This table is referred in Chapter [Differences between Python and Mojo](../move/different#string).

:::

### Internal representation of `String`

String is an important type of Mojo and Python, which represents a sequence of UTF-8 encoded code points (characters). The internal representation of a `String` is actually list of 8-bit unsigned integers (`List[UInt8]`).

::: info UTF-8 encoding

UTF-8 is a variable-length character encoding for Unicode. It can represent every code point in the Unicode character set, which include characters and symbols from many different (existing or dead) languages and scripts. UTF-8 is designed to be backward-compatible with ASCII, meaning that any valid ASCII text is also valid UTF-8 text. UTF-8 uses ***one to four bytes*** to represent each character. For common characters (like those in the ASCII range), only one byte is needed. For less common characters, it uses two, three, or four bytes. For example, most Chinese characters require three bytes, while some rare characters may require four bytes.

A valid UTF-8 character must starts with `0` (1-byte character), `110` (2-byte character), `1110` (3-byte character), `11110` (4-byte character). The non-first bytes of a string must be `10`. This also means that not all slices of 1 bytes to 4 bytes are valid UTF-8 characters.

Since the bytes are continuously stored in the memory, programming languages need some special algorithm to determine where a character starts and ends. If you try to access a character than takes 3 bytes with a slice of 2 bytes, you will get an invalid character.

:::

The following example shows how `"abc"` is stored in the memory as a Mojo's `String` type. Note that "a", "b", and "c" are all ASCII characters, which are represented by one byte each in UTF-8 encoding.

```console
Each cell represent a byte (UInt8).
┌──┬──┬──┐
│97│98│99│
└──┴──┴──┘
Or in raw binary form:
┌────────┬────────┬────────┐
│00111101│00111101│00111101│
└────────┴────────┴────────┘
```

While ASCII codes are always stored as one-byte with UTF-8 encoding, other Characters usually takes more than 2 bytes. For example, common Chinese characters are usually stored as 3 bytes in the memory, even though it is displayed as a single character when it is printed or displayed in a user interface.

For example, "<ruby>你<rt>nǐ</rt>好<rt>hǎo</rt></ruby>", which means "hello" in Chinese, are display as two characters, but it is stored by 6 bytes in the memory. The following figure illustrates how these two Chinese characters are stored in the memory as a Mojo's `String` type. We can see that each character taking 3 bytes (starting with `111`).

```console
Each cell represent a byte (UInt8).
┌───┬───┬───┬───┬───┬───┐
│228│189│160│229│165│189│
└───┴───┴───┴───┴───┴───┘
Or in raw binary form:
┌────────┬────────┬────────┬────────┬────────┬────────┐
│11100100│10111101│10100000│11100101│10100101│10111101│
└────────┴────────┴────────┴────────┴────────┴────────┘
```

We can examine its exact `UInt8` sequence in the memory with the following code:

```mojo
def main():
    var a = String("你好")    
    for i in a.as_bytes():
        print(i[], end=" ")
    # It prints: 228 189 160 229 165 189
```

### `String` construction

In Mojo, you can create a `String` by wrapping a string literal with the `String()` constructor. Analogically, in Python, you can create a `str` by wrapping a string literal with the `str()` constructor. For example:

```mojo
def main():
    var s = String("Hello, world!")
    print(s)
```

```python
def main():
    s = str("Hello, world!")
    print(s)
```

### `String` printing and formatting

In Mojo, you can print a `String` using the `print()` function.

String formatting is partially supported in Mojo. You can use curly brackets `{}` within a `String` object to indicate where to insert values, and then call the `format` methods to replace those placeholders with actual values. You can optionally put numbering in the placeholders to specify the order of the values to be inserted. For example:

```mojo
def main():
    var a = String("Today is {} {} {}").format(1, "Janurary", 2023)
    var b = String("{0} plus {1} equals {2}").format(1.1, 2.34, 3.45)
    print(a)
    print(b)
# Today is 1 Janurary 2023
# 1.1 plus 2.34 equals 3.45
```

However, the following features are not supported in Mojo:

- **f-strings**: Mojo does not support f-strings like Python does. You cannot use the `f` prefix to format strings.
- **Formatting styles**: You cannot put variables names in curly brackets `{}` and use the `format()` method to format strings.
- **Formatting styles**: You cannot specify formatting styles in curly brackets, e.g., `.2f` for floating-point numbers or `.3%` for percentages.

For example, the following code will not work in Mojo:

```mojo
def main():
    var a = String("Today is {day} {month} {year}").format(day=1, month="Janurary", year=2023)
    var b = String("{0:.2f} plus {1:.2%} equals {2:.3g}").format(1.1, 2.34, 3.45)
print(a)  # Not working in Mojo
print(b)  # Not working in Mojo
```

::: tip Formatting in Python

The above code will work in Python.

```python
def main():
    a = "Today is {day} {month} {year}".format(day=1, month="Janurary", year=2023)
    b = "{0:.2f} plus {1:.2%} equals {2:.3g}".format(1.1, 2.34, 3.45)
    print(a)
    print(b)
main()
```

It will print:

```console
Today is 1 Janurary 2023
1.10 plus 234.00% equals 3.45
```

:::

### `String` iteration

In Mojo, you can iterate over the valid characters (code points) of a `String` using the `codepoints()` method. This method returns an iterable object that contains the UTF-8 code points of the string. You can use a `for` loop to iterate over the code points and print them one by one. Note that it is more complicated than that in Python, where you can directly iterate over a `str` object to print each character.

The following examples compares the iteration of strings in Python and Mojo:

```python
def main():
    my_string: str = "Hello, world! 你好，世界！"
    for char in my_string:
        print(char, end="")
main()
```

```mojo
def main():
    my_string = String("Hello, world! 你好，世界！")
    for char in my_string.codepoints():
        print(String(char), end="")
```

Let me explain the Mojo code in detail. The `codepoints()` methods construct a iterator object over the UTF-8 code points of the string (`CodepointsIter` type).

When you use `for char in my_string.codepoints():`, we iterate over the `CodepointsIter` object, and sequentially get each code point as an `CodePoint` object. Each `CodePoint` object represents a single Unicode code point.

Finally, we use `String(char)` to convert the `CodePoint` object back to a `String` object, which can then be printed with the `print()` function.

Note that you cannot directly print a `CodePoint` object, as it does not implement the `Writable` trait at the moment.

::: info characters vs code points

Do you know that in early versions of Mojo, we use "characters" (`Char` type) to stand for a meaningful unit of text corresponding to a single Unicode code point? However, in the latest versions of Mojo, it is changed to "code points" (`CodePoint` type) to refer to the same concept. This change is made to align with the Unicode terminology because a character can also be composed of multiple code points, such as "grapheme clusters".

You can read more about this change in the article [Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) and [PR #3988: String, ASCII, Unicode, UTF, Graphemes](https://github.com/modular/modular/pull/3988).

:::

### `String` indexing and slicing

In Mojo, you cannot directly index or slice a `String` object to access its code points. This feature is still under development.

## Boolean

The boolean type is a simple data type that can only have two possible states: true and false (or, yes and no, 1 and 0...). These two states are mutually exclusive and exhaustive, meaning that a boolean value can only be either true or false, and there are no other possible values.

The mojo's boolean type is renamed as `Bool`. The two states are `True` and `False`. It is comparable to the `bool` type in Python, but with the first letter capitalized.

The `Bool` type is saved as a single byte in the memory.

::: tip Bool and Int

Just like Python, Boolean values can be implicitly converted to integers. `True` is equivalent to `1` and `False` is equivalent to `0`. Thus, the following code will work in Mojo:

```mojo
def main():
    print(True + False)  
# Output: 1
```

:::

## Composite types

### List

In Mojo, a `List` is also a mutable sequence type but can hold objects of the **same type**. This is different from Python, where a `list` can hold objects of **any type**. Here are some key differences between Python's `list` and Mojo's `List`:

| Functionality      | Mojo `List`                     | Python `list`                               |
| ------------------ | ------------------------------- | ------------------------------------------- |
| Type of elements   | Homogeneous type                | Heterogenous types                          |
| Mutability         | Mutable                         | Mutable                                     |
| Inialization       | `List[Type]()`                  | `list()` or `[]`                            |
| Indexing           | Use brackets `[]`               | Use brackets `[]`                           |
| Slicing            | Use brackets `[a:b:c]`          | Use brackets `[a:b:c]`                      |
| Extending by items | Use `append()`                  | Use `append()`                              |
| Concatenation      | Use `+` operator                | Use `+` operator                            |
| Printing           | Not supported                   | Use `print()`                               |
| Iterating          | Use `for` loop and de-reference | Use `for` loop                              |
| Memory layout      | Metadata -> Elements            | Pointer -> metadata -> Pointers -> Elements |

#### Creating a List

To construct a `List` in Mojo, you have to use the ***list constructor***. For example, to create a list of `Int` numbers, you can use the following code:

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    var my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    var my_list_of_strings: List[String] = List[String]("Mojo", "is", "awesome")
```

#### List indexing and slicing

You can retrieve the elements of a `List` in Mojo using **indexing**, just like in Python. For example, you can access the first element of `my_list_of_integers` with `my_list_of_integers[0]`.

You can create another `List` by **slicing** an existing `List`, just like in Python. For example, you can create a new list that contains the first three elements of `my_list_of_integers` with `my_list_of_integers[0:3]`.

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    first_element = my_list_of_integers[0]  # Accessing the first element
    sliced_list = my_list_of_integers[0:3]  # Slicing the first three elements
```

#### Extending and concatenating a list

You can **append** elements to the end of a `List` in Mojo using the `append()` method, just like in Python. For example,

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    my_list_of_integers.append(6)  # Appending a new element
# my_list_of_integers = [1, 2, 3, 4, 5, 6]
```

You can use the `+` operator to concatenate two `List` objects, just like in Python. For example:

```mojo
def main():
    first_list = List[Int](1, 2, 3)
    second_list = List[Int](4, 5, 6)
    concatenated_list = first_list + second_list  # Concatenating two lists
# concatenated_list = [1, 2, 3, 4, 5, 6]
```

#### Printing a list

You cannot print the `List` object directly in Mojo (at least at the moment). This is because the `List` type does not implement the `Writable` trait, which is required for printing. To print a `List`, you have to write your own auxiliary function:

```mojo
def print_list_of_floats(array: List[Float64]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")

def print_list_of_strings(array: List[String]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")

def main():
    var my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    var my_list_of_strings = List[String]("Mojo", "is", "awesome")
    print_list_of_floats(my_list_of_floats)
    print_list_of_strings(my_list_of_strings)
```

::: info

We have already seen this auxiliary function in Chapter [Convert Python code into Mojo](../move/examples.md). We will use this kinds of functions to print lists in the following chapters as well.

:::

#### Iterating over a list

We can iterate over a `List` in Mojo using the `for ... in` keywords. This is similar to how we iterate over a list in Python. But one thing is different:

In Mojo, each item you get from the iteration is **a pointer to the address of the element**. You have to de-reference it to get the actual value of the element. The de-referencing is done by using the `[]` operator. See the following example:

```mojo
def main():
    my_list = List[Int](1, 2, 3, 4, 5)
    for i in my_list:
        print(i[], end=" ")  # De-referencing the element to get its value
# Output: 1 2 3 4 5 
```

If you forget the `[]` operator, you will get an error message because you are trying to print the pointer to the element instead of the element itself.

```console
error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
        print(i,  end=" ")
        ~~~~~^~~~~~~~~~~~~
```

::: info address vs value

You may find this a bit cumbersome, but it is actually a good design. It makes Mojo's `List` more memory-efficient.

Imagine that you want to read a list of books in a library. You can either:

- Ask the administrator to copy these books and give your the copies.
- Ask the administrator to give you the locations of these books, and you go to the corresponding shelves to read them.

In the first case, you will have to pay for the cost of copying the books and you have to wait for the copies to be made. In the second case, you can read the books directly without any extra cost.

This is similar to how Mojo's `List` works: The iterator only returns the address of the element. You go to the address and read the value directly. It does not create of a copy of the element, so no extra memory costs.

:::

::: tip Memory layout of a list in Python and Mojo

In Mojo, the values of the elements of a list is stored consecutively on the heap. In Python, the pointers to the elements of a list is stored consecutively on the heap, while the actual values of the elements are stored in separate memory locations. This means that a Mojo's list is more memory-efficient than a Python's list, as it does not require additional dereferencing to access the values of the elements.

If you are interested in the memory layout of a list in Python and Mojo, you can refer to Chapter [Memory Layout of Mojo objects](../misc/layout.md) for more details, where I drew some abstract diagrams to illustrate the memory layouts of a list in Python and Mojo.

:::
