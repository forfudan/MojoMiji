# Data types

[[toc]]

Types of data are the foundation of programming languages. They define how one and zeros in the memory are interpreted as human-readable values. Mojo's data types are similar to Python's, but with some differences due to Mojo's static compilation nature.

In this chapter, we will discuss the most common data types in Mojo. They can be categorized into several categories: numeric types (integer, floats), composite types (list, tuple), and others types (string, boolean). You can easily find the corresponding types in Python. The following table summarizes these data types:

| Python type | Default Mojo type  | Be careful that                                                                |
| ----------- | ------------------ | ------------------------------------------------------------------------------ |
| `int`       | `Int`              | Integers in Mojo has ranges. Be careful of overflow.                           |
| `float`     | `Float64`          | Almost same behaviors. You can safely use it.                                  |
| `str`       | `String`           | Similar behaviors. Note that `String` in Mojo is rapidly evolving.             |
| `bool`      | `Bool`             | Same.                                                                          |
| `list`      | `List`             | Elements in `List` in Mojo must be of the same data type.                      |
| `tuple`     | `Tuple`            | Very similar, but you cannot iterate over a `Tuple` in Mojo.                   |
| `set`       | `collections.Set`  | Elements in `Set` in Mojo must be of the same data type.                       |
| `dict`      | `collections.Dict` | Keys and values in `Dict` in Mojo must be of the same data type, respectively. |

## Integer

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

If you really need to work on big integers that are larger than the capacity of `Int`, you can consider using the `BigInt` type in the [decimojo package](../extend/decimojo.md), which has the similar functionality as the `int` type in Python.

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

## Float

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
1. Use the `Decimal` type, which is internally presented in base 10. It can represent decimal numbers exactly, but it is slower than floating-point types. You can find more information about `Decimal` type in the [decimojo package](../extend/decimojo.md).

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

String is an important type of Mojo and Python, which represents a sequence of UTF-8 encoded code points (aka characters). The coding space is so large that it can present almost all human languages and symbols. It is also flexible as it represents different characters in different lengths, allowing for efficient storage and processing of text data. For example, the English alphabet is represented by one byte per character, while Chinese characters are usually represented by three bytes per character.

The following table summarizes the differences between `String` in Mojo and `str` in Python. Note that some features are still under development in Mojo, so they may not be available in the current version. This table is also referred in Chapter [Differences between Python and Mojo](../move/different#string).

| Functionality                     | Python `str`                          | Mojo `String`                                       |
| --------------------------------- | ------------------------------------- | --------------------------------------------------- |
| Constructed from string literals  | str literal is coerced to str type.   | You have to use `String()` constructor.             |
| Print string with `print()`       | Yes.                                  | Yes.                                                |
| Format string with `format()`     | Yes, use `{}`.                        | Yes, but you cannot specify formatting, e.g, `.2f`. |
| f-strings                         | Supported.                            | Not supported (yet).                                |
| formatted values                  | Supported, e.g., `{:0.2f}`, `{:0.3%}` | Not supported (yet)                                 |
| Iteration over UTF-8 code points  | Yes, use `for i in s:` directly.      | Yes, but more complicated.                          |
| UTF8-assured indexing and slicing | Yes, use `s[i]` or `s[i:j]` directly. | Not supported.                                      |

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

### Internal representation of `String`

You may wonder, how strings are stored in the memory? Is each character stored as the same number of bytes? If not, how do we determine the start and end of each character?

To answer these questions, let's take a look at the following two things:

1. The encoding schema of characters of Human languages.
1. The internal representation of a `String` in Mojo.

#### Unicode and code points

> All characters are equal, but some are more equal than others. -- Yuhao Zhu, A Story of the Gate of Heaven

Characters are the building blocks of texts. They can be letters (Latin, Greek, Slavic, Sanskrit, etc., e.g, "a", "b", "c", "α", "β", "γ", "а", "б", "в", "अ", "आ", "इ"), 漢字 (Hànzì, Kanji, Hanja, e.g., "天", "地", "人"), digits ("1", "2", "3"), punctuation marks ("!", ".", ","), symbols ("@", "#", "$"), or even emojis ("繪文字", literally, "graphic characters", e.g., "😀", "❤️", "🌍").

**"All characters are equal"**, they do not have a certain rank or order. However, when human beings entered into the era of 0s and 1s (like in telegrams, longs and shorts), they find it convenient to assign characters an ordinal number, so that they can be easily transmitted to and processed by other people.

However, this ordering is not universal. Different languages, different organizations, and different governments may have different ways of assigning ordinal numbers to characters. A ordinal number may refer to a different character in different systems. In the trend of internationalization, people realized that they need a unified system to represent characters in a consistent way. This is how the **Unicode** standard was born.

Unicode is a standard that assigns a unique integral number to every character in almost all human languages and scripts, as well as many symbols and emojis. The integral number assigned to characters is called a **code point**. We usually use the prefix "U+" to indicate that it is a Unicode code point. For example, the code point for the letter "a" is U+0061, the code point for the Chinese character "天" is U+5929, and the code point for the emoji "😀" is U+1F600.

But which characters go first? It is a question, but not a difficult one. The makers of the Unicode standard decided to assign code points in a way that is consistent with the order of characters in the most widely used scripts. For example, the ASCII characters, that are so widely used in computer science, receive the first 128 code points, from U+0000 to U+007F. This makes Unicode backward-compatible with ASCII. Then come the other Latin alphabet, the Greek alphabet, symbols, and other scripts.

#### Grapheme clusters

For some characters or symbols, they might be composed of multiple code points. For example, "g̈" (U+0067 U+0308), is composed of two code points: the letter "g" (U+0067) and the combining diaeresis (U+0308). This is called a **grapheme cluster**, which is a sequence of one or more code points that are displayed as a single character. This is a way to allow dynamic composition of characters, especially for some languages that are normally written with diacritics or other modifiers.

::: warning Is character a grapheme cluster or a code point?

**A character can both refer to a single code point and a grapheme cluster**, depending on the context. Thus, a character (represented by a grapheme cluster) can be composed of multiple characters (represented code points). You can refer to this article [Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) if you are interested.

This flexibility also introduces ambiguity and confusion when we want to **print**, **count**, or **iterate** characters in a string. For example, the string "g̈" can be considered as one character (a grapheme cluster) or two characters (two code points). Is this string of length 1 or 2? Moreover, should the length also be counted in bytes?

This is a common issue in many programming languages, but the solution is straightforward:

**Be specific**!

Yes, just be more specific about what you want to do. In Mojo, the term "character" is avoided. When it comes to printing, counting, or iterating, Mojo uses more explicit terms like "bytes", "code points" or "grapheme clusters".

In the old versions of Mojo, there is a `Char` type that represents a single code point, but it is deprecated in the latest versions because it leads to confusion. Some people may think that it is a grapheme cluster, some may think that it is a code point, the rest may think that it is a ASCII character (`char` in C). Thus, from Mojo v25.1, the `Char` type is replaced by the `CodePoint` type, which is more explicit and clear.

:::

#### UTF-8

Each character now receives a unique code point, but how do we store these code points in the memory? How do we represent them as a sequence of bytes that can be processed by computers?

I think many people may immediately think of a very intuitive, yet simple, solution: we can use a fixed-length encoding schema, where each code point is represented by a fixed number of bytes. The length should be long enough so that it can hold all valid code points. Since the capacity of Unicode is 1,114,112 code points (from U+0000 to U+10FFFF), we can use at least 3 bytes to represent each code point.

Yes, this is a valid solution, and it is called **UTF-32** encoding, where each character is represented by 32-bits (4 bytes). This is a fixed-length encoding schema, which means that each character takes the same amount of space in the memory. An alternative proposal is [UTF-24 encoding](https://unicode.org/mail-arch/unicode-ml/y2007-m01/0057.html), with less space wasted, but it is not very compatible with modern computer architectures.

UTF-32 is intuitive and simple. The time complexity of accessing a character is O(1), because we can calculate the address of a character by multiplying its index by 4.

**"But some characters are more equal than others"**, in the modern world, the most used characters are those in the ASCII range (U+0000 to U+007F), which are the basic Latin letters, digits, and punctuation marks. These characters are used in almost every programming language and are used in the most spoken languages, such as English, Spanish, French, etc. If we use UTF-32 encoding, we will waste a lot of space for these characters, because they only take 1 byte in ASCII encoding.

This makes UTF-32 not a very space-efficient encoding schema.

A solution is to use a **variable-length encoding schema**, where each character is represented by either 1, 2, 3, or 4 bytes. This way, we can use fewer bytes for common characters and more bytes for less common characters. This is how **UTF-8** encoding was brought to the world.

For example, the letter "a" (U+0061) will take 4 bytes in UTF-32, while it only takes 1 byte in ASCII. The Chinese character "天" (U+5929) will take 4 bytes in UTF-32, while it only takes 3 bytes in UTF-8. The emoji "😀" (U+1F600) will take 4 bytes in both UTF-8 and UTF-32.

The advantage of UTF-8 is obvious, the only technical question is **segmentation**. We need some unique patterns to allow us, as well as computers, to quickly determine whether a byte is the start of a character or not. Here are the rules:

- A valid UTF-8 character must starts with `0` (1-byte character), `110` (2-byte character), `1110` (3-byte character), `11110` (4-byte character). 
- The non-first bytes of a string must be `10`.

This means that not all slices of 1 bytes to 4 bytes are valid UTF-8 characters. For more about the encoding schema, you can refer to the [UTF-8 Wikipedia page](https://en.wikipedia.org/wiki/UTF-8).

::: tip Visual checks of valid UTF-8 code points

You can count the number of leading 0 or 1 in the first byte of a UTF-8 character to determine how many bytes it takes. Specifically, **the number of ones is equal to the number of bytes for non-single-byte code point**. For example:

- 1 leading `0`: 1-byte character
- 2 leading `1`: 2-byte character
- 3 leading `1`: 3-byte character
- 4 leading `1`: 4-byte character

:::

In this way, although bytes are contiguously stored in the memory, programming languages are able to determine the start and end of each character. If you try to access a character by passing in a wrong slice, no valid character will be returned.

#### Back to string in Mojo

Now back to the question of how a `String` is stored in the memory in Mojo. `String` is saved contiguously in the memory as a list of bytes (or, a list of 8-bit unsigned integers, `List[UInt8]`). These sequence of bytes are encoded in UTF-8 format, which means that each character can take 1 to 4 bytes depending on the code point of the character.

The following example shows how `"abc"` is stored in the memory as a Mojo's `String` type. Note that "a", "b", and "c" are of the same code in ASCII and Unicode, and each of them is represented by one byte in UTF-8 encoding.

```console
# Mojo Miji - Data types - Internal representation of String "abc"
                    ┌──────────┬──────────┬──────────┐
Character           │    a     │     b    │     c    │
                    ├──────────┼──────────┼──────────┤
Unicode code point  │   97     │    98    │    99    │
                    ├──────────┼──────────┼──────────┤
In memory (binary)  │ 00111101 │ 00111101 │ 00111101 │
                    └──────────┴──────────┴──────────┘
```

Remember that, in the rules, "a valid UTF-8 character must starts with `0` for 1-byte character". So Mojo can easily determine that each of these characters is a valid UTF-8 character, and they are stored as 1 byte each.

While ASCII codes are always stored as one-byte with UTF-8 encoding, other Characters usually takes more than 2 bytes. For example, common Chinese characters are usually stored as 3 bytes in the memory, even though it is **displayed** as a single character on your screen.

For example, the string "你好shìjiè😀🇨🇳" means "hello world 😀🇨🇳" in Chinese (in [hànzì](https://en.wikipedia.org/wiki/Chinese_characters) and [pīnyīn](https://en.wikipedia.org/wiki/Pinyin) forms). It is display as 10 characters in total: 2 Chinese characters, 6 Latin letters with or without signs, 1 Emoji, and 1 national flag.

However, they requires more than 10 bytes to be stored in the memory. Actually, it might be more complicated than you may have thought. Let's take a look at the internal representation of this string in Mojo in the following graphic:

```console
# Mojo Miji - Data types - Internal representation of String "你好shìjiè😀🇨🇳"
                        ┌────────────────────────────────┬────────────────────────────────┬──────────┬──────────┬─────────────────────┬──────────┬──────────┬─────────────────────┬───────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
Grapheme cluster        │                你              │               好               │    s     │    h     │          ì          │    j     │    i     │          è          │                    😀                     │                                          🇨🇳                                           │
                        ├────────────────────────────────┼────────────────────────────────┼──────────┼──────────┼─────────────────────┼──────────┼──────────┼─────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────┬───────────────────────────────────────────┤
Code point (readable)   │                你              │               好               │    s     │    h     │          ì          │    j     │    i     │          è          │                    😀                     │                   🇨                      │                   🇳                      │
                        ├────────────────────────────────┼────────────────────────────────┼──────────┼──────────┼─────────────────────┼──────────┼──────────┼─────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────┤
Unicode (hex)           │               U+4F60           │              U+597D            │  U+0073  │  U+0068  │       U+00EC        │  U+006A  │  U+0069  │        U+00E8       │                 U+1F600                   │                 U+1F1E8                   │                 U+1F1F3                   │
                        ├──────────┬──────────┬──────────┼──────────┬──────────┬──────────┼──────────┼──────────┼──────────┬──────────┼──────────┼──────────┼──────────┬──────────┼──────────┬──────────┬──────────┬──────────┼──────────┬──────────┬──────────┬──────────┼──────────┬──────────┬──────────┬──────────┤
Byte (decimal)          │   228    │    189   │   160    │   229    │   165    │    189   │   115    │   104    │   195    │    172   │    106   │    105   │    195   │    168   │   240    │   159    │   152    │   128    │   240    │    159   │    135   │    168   │    240   │    159   │    135   │    179   │
                        ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
Byte (binary)           │ 11100100 │ 10111101 │ 10100000 │ 11100101 │ 10100101 │ 10111101 │ 01110011 │ 01101000 │ 11000011 │ 10101100 │ 01101010 │ 01101001 │ 11000011 │ 10101000 │ 11110000 │ 10011111 │ 10011000 │ 10000000 │ 11110000 │ 10011111 │ 10000111 │ 10101000 │ 11110000 │ 10011111 │ 10000111 │ 10110011 │
                        └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

Okay, let's explain it from the bottom to the top.

- **Byte (binary)**: This row shows the sequence of bytes in the memory, which is a contiguous sequence of `UInt8` values. Each byte is represented by 8 bits (0s and 1s).
- **Byte (decimal)**: This row shows the decimal values of each byte, which are the `UInt8` values in the memory. For example, the first byte is `228`, which is `11100100` in binary.
- **Unicode (hex)**: This row shows the Unicode code points of each character in hexadecimal format. You can see that each Unicode is composed of one or more bytes from below. The mapping from bytes to Unicode code points is determined by the UTF-8 encoding schema. For example, the first character "你" has a code point of `U+4F60`, which is composed of three bytes; the letter "s" is composed of one byte; the letter "è" is composed of two bytes; and the emoji "😀" is composed of four bytes.
- **Code point**: This row is a human-readable way of the corresponding code points of the Unicode. You can see that, at this point, the most of code points can be represented by a single human-readable character, except for the national flag "🇨🇳".
- **Grapheme cluster**: This row shows the grapheme clusters. A grapheme cluster is a sequence of one or more code points that are displayed as a single character. This enables a more dynamic representation of characters. For example, the national flags are composed of two code points, each one representing a letter of the country code. For example, the country code of China is "CN", and thus, the national flag of China consists of two code points, "🇨" (U+1F1E8) and "🇳" (U+1F1F3). The country code of the United States is "US", and thus, the national flag of the US consists of two code points, "🇺" and "🇸".

So, you can see that there are multiple layers of representation for a `String` in Mojo. Some characters are represented by a single byte, some are represented by a code point, and some are represented by a grapheme cluster. When you use this convenient `String` type in future, you should thank all the people who have worked on this topic.

::: tip Examine the internal representation of a `String`

We can examine its exact `UInt8` sequence in the memory with the following code:

```mojo
# src/basic/string_internal_representation.mojo
fn main():
    var s = String("你好shìjiè😀🇨🇳")
    var idx = 0
    for i in s.as_bytes():
        var byte_dec = Int(i[])
        var byte_bin = bin(byte_dec)
        var byte_hex = hex(byte_dec)
        print(idx, byte_bin, byte_dec, byte_hex)
        idx += 1
```

:::

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

## List

In Mojo, a `List` is a mutable, variable-length sequence that can hold a collection of elements of the ***same type***. It is similar to Rust's `Vec` type, but it is different from Python's `list` type that can hold objects of **any type**. Here are some key differences between Python's `list` and Mojo's `List`:

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

### Construct a list

To construct a `List` in Mojo, you have to use the ***list constructor***. For example, to create a list of `Int` numbers, you can use the following code:

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    var my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    var my_list_of_strings: List[String] = List[String]("Mojo", "is", "awesome")
```

### Index or slice a list

You can retrieve the elements of a `List` in Mojo using **indexing**, just like in Python. For example, you can access the first element of `my_list_of_integers` with `my_list_of_integers[0]`.

You can create another `List` by **slicing** an existing `List`, just like in Python. For example, you can create a new list that contains the first three elements of `my_list_of_integers` with `my_list_of_integers[0:3]`.

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    first_element = my_list_of_integers[0]  # Accessing the first element
    sliced_list = my_list_of_integers[0:3]  # Slicing the first three elements
```

### Extend or concat a list

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

### Print a list

You cannot print the `List` object directly in Mojo (at least at the moment). This is because the `List` type does not implement the `Writable` trait, which is required for printing. To print a `List`, you have to write your own auxiliary function.

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

::: info `print_lists()` function

We have already seen this auxiliary function in Chapter [Convert Python code into Mojo](../move/examples.md). We will use this kinds of functions to print lists in the following chapters as well.

:::

### Iterate over a list

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

### `List` in memory

A Mojo `List` is actually a structure that contains three fields:

- A pointer type `data` that points to a continuous block of memory on the heap that stores the elements of the list contiguously.
- A integer type `_len` which stores the number of elements in the list.
- A integer type `capacity` which represents the maximum number of elements that can be stored in the list without reallocating memory. When `capacity` is larger than `_len`, it means that the memory space is allocated but is fully used. This enable you to append a few new elements to the list without reallocating memory. If you append more elements than the current capacity, the list will request another block of memory on the heap with a larger capacity, copy the existing elements to the new block, and then append the new elements.

Let's take a closer look at how a Mojo `List` is stored in the memory with a simple example: The code below creates a `List` of `UInt8` numbers representing the ASCII code of 5 letters. We can use the `chr()` function to convert them into characters and print them out to see what they mean.

```mojo
def main():
    var me = List[UInt8](89, 117, 104, 97, 111)
    print(me.capacity)
    for i in me:
        print(chr(Int(i[])), end="")
# Output: Yuhao
```

When you create a `List` with `List[UInt8](89, 117, 104, 97, 111)`, Mojo will first allocate a continuous block of memory on **stack** to store the three fields (`data: Pointer`, `_len: Int` and `capacity: Int`, each of which is 8 bytes long on a 64-bit system. Because we passed 5 elements to the `List` constructor, the `_len` field will be set to 5, and the `capacity` field will also be set to 5 (default setting, `capacity = _len`).

Then Mojo will allocate a continuous block of memory on **heap** to store the actual values of the elements of the list, which is 1 bytes (8 bits) for each `UInt8` element, equaling to 5 bytes in total for 5 elements. The `data` field will then store the address of the first byte in this block of memory.

The following figure illustrates how the `List` is stored in the memory. You can see that a continuous block of memory on the heap (from the address `17ca81f8` to `17ca81a2`) stores the actual values of the elements of the list. Each element is a `UInt8` value, and thus is of 1 byte long. The data field on the stack store the address of the first byte of the block of memory on the heap, which is `17ca81f8`.

```console
# Mojo Miji - Data types - List in memory

        local variable `me = List[UInt8](89, 117, 104, 97, 111)`
            ↓  (meta data on stack)
        ┌────────────────┬────────────┬────────────┐
Field   │ data           │ _len       │ capacity   │
        ├────────────────┼────────────┼────────────┤
Type    │ Pointer[UInt8] │  Int       │     Int    │
        ├────────────────┼────────────┼────────────┤
Value   │   17ca81f8     │     5      │     5      │
        ├────────────────┼────────────┼────────────┤
Address │   26c6a89a     │  26c6a8a2  │  26c6a8aa  │
        └────────────────┴────────────┴────────────┘
            │
            ↓ (points to a continuous memory block on heap that stores the list elements)
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  89    │  117   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
```

Now we try to see what happens when we use list indexing to get a specific element from the list, for example, `me[0]`. Mojo will first check the `_len` field to see if the index is valid (i.e., `0 <= index < me._len`). If it is valid, Mojo will then calculate the address of the element by adding the index to the address stored in the `data` field. In this case, it will return the address of the first byte of the block of memory on the heap, which is `17ca81f8`. Then Mojo will de-reference this address to get the value of the element, which is `89` in this case.

If we try `me[2]`, Mojo will calculate address by adding `2` to the address stored in the `data` field, which is `17ca81f8 + 2 = 17ca81fa`. Then Mojo will de-reference this address to get the value of the element, which is `104` in this case.

::: info Index or offset?

You may find that the index starting from `0` in Python or Mojo is a little bit strange. But it will be intuitive if you look at the example above: The index of an element in a list is actually the offset from the address of the first element. When you think of the index as an offset, it will make more sense. Thus, in this Miji, I will sometimes use the term "offset" to refer to the index within the brackets `[]`.

:::

::: tip Memory layout of a list in Python and Mojo

In Mojo, the values of the elements of a list is stored consecutively on the heap. In Python, the pointers to the elements of a list is stored consecutively on the heap, while the actual values of the elements are stored in separate memory locations. This means that a Mojo's list is more memory-efficient than a Python's list, as it does not require additional dereferencing to access the values of the elements.

If you are interested in the difference between the the memory layout of a list in Python and Mojo, you can refer to Chapter [Memory Layout of Mojo objects](../misc/layout.md) for more details, where I use abstract diagrams to compare the memory layouts of a list in Python and Mojo.

:::
