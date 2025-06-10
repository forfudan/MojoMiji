
# Data type - String

> There are a thousand string types in a thousand people's eyes.  
> -- Yuhao Zhu

String is one of the most important concepts in programming languages, but also one of the most controversial ones. On the one hand, the "string" is able to store or represent the texts of almost all human languages. On the other hand, it is also a source of confusion and frustration for many programmers, especially when it comes to how to encode, decode, and manipulate strings. In a thousand people's eyes, there are a thousand different ways to implement a string type as well as its functionalities. Thus, some people even think that the string type should not be a built-in type in programming languages, but rather be in third-party libraries that can be implemented in different ways.

Nevertheless, most programming languages do have a built-in string type. Mojo is no exception. However, the design of `String` in Mojo is, inevitably, changing rapidly, due to the reasons we mentioned above. Even within the development team, there are different opinions on how to design the `String` type. This is why we put string in this standalone chapter.

[[toc]]

## What is a string?

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

## `String` construction

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

## `String` printing and formatting

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

## `String` iteration

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

## `String` indexing and slicing

In Mojo, you cannot directly index or slice a `String` object to access its code points. This feature is still under development.

## Internal representation of `String`

You may wonder, how strings are stored in the memory? Is each character stored as the same number of bytes? If not, how do we determine the start and end of each character?

To answer these questions, let's take a look at the following two things:

1. The encoding schema of characters of Human languages.
1. The internal representation of a `String` in Mojo.

### Unicode and code points

> All characters are equal, but some are more equal than others.  
> -- Yuhao Zhu, *Gate of Heaven*

Characters are the building blocks of texts. They can be letters (Latin, Greek, Slavic, Sanskrit, etc., e.g, "a", "b", "c", "α", "β", "γ", "а", "б", "в", "अ", "आ", "इ"), 漢字 (Hànzì, Kanji, Hanja, e.g., "天", "地", "人"), digits ("1", "2", "3"), punctuation marks ("!", ".", ","), symbols ("@", "#", "$"), or even emojis ("繪文字", literally, "graphic characters", e.g., "😀", "❤️", "🌍").

**"All characters are equal"**, they do not have a certain rank or order. However, when human beings entered into the era of 0s and 1s (like in telegrams, longs and shorts), they find it convenient to assign characters an ordinal number, so that they can be easily transmitted to and processed by other people.

However, this ordering is not universal. Different languages, different organizations, and different governments may have different ways of assigning ordinal numbers to characters. A ordinal number may refer to a different character in different systems. In the trend of internationalization, people realized that they need a unified system to represent characters in a consistent way. This is how the **Unicode** standard was born.

Unicode is a standard that assigns a unique integral number to every character in almost all human languages and scripts, as well as many symbols and emojis. The integral number assigned to characters is called a **code point**. We usually use the prefix "U+" to indicate that it is a Unicode code point. For example, the code point for the letter "a" is U+0061, the code point for the Chinese character "天" is U+5929, and the code point for the emoji "😀" is U+1F600.

But which characters go first? It is a question, but not a difficult one. The makers of the Unicode standard decided to assign code points in a way that is consistent with the order of characters in the most widely used scripts. For example, the ASCII characters, that are so widely used in computer science, receive the first 128 code points, from U+0000 to U+007F. This makes Unicode backward-compatible with ASCII. Then come the other Latin alphabet, the Greek alphabet, symbols, and other scripts.

### Grapheme clusters

For some characters or symbols, they might be composed of multiple code points. For example, "g̈" (U+0067 U+0308), is composed of two code points: the letter "g" (U+0067) and the combining diaeresis (U+0308). This is called a **grapheme cluster**, which is a sequence of one or more code points that are displayed as a single character. This is a way to allow dynamic composition of characters, especially for some languages that are normally written with diacritics or other modifiers.

In this Miji, if there is possible confusion, I will use the term **code-point character** to refer to a character that is represented by a single code point, and **grapheme-cluster character** to refer to a character that is composed of multiple code points.

::: warning Is character a grapheme cluster or a code point?

**A character can both refer to a single code point and a grapheme cluster**, depending on the context. Thus, a character (represented by a grapheme cluster) can be composed of multiple characters (represented code points). You can refer to this article [Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) if you are interested.

This flexibility also introduces ambiguity and confusion when we want to **print**, **count**, or **iterate** characters in a string. For example, the string "g̈" can be considered as one character (a grapheme cluster) or two characters (two code points). Is this string of length 1 or 2? Moreover, should the length also be counted in bytes?

This is a common issue in many programming languages, but the solution is straightforward:

**Be specific**!

Yes, just be more specific about what you want to do. In Mojo, the term "character" is avoided in methods of the string type. When it comes to printing, counting, or iterating, Mojo uses more explicit terms like "bytes", "code points" or "grapheme clusters".

In the old versions of Mojo, there is a `Char` type that represents a single code point, but it is deprecated in the latest versions because it leads to confusion. Some people may think that it is a grapheme cluster, some may think that it is a code point, the rest may think that it is a ASCII character (`char` in C). Thus, from Mojo v25.1, the `Char` type is replaced by the `CodePoint` type, which is more explicit and clear.

:::

### UTF-8 encoding

Each code-point character has a unique code point, but how do we store these code points in the memory? How do we represent them as a sequence of bytes that can be processed by computers?

I think many people may immediately think of a very intuitive, yet simple, solution: we can use a fixed-length encoding schema, where each code point is represented by a fixed number of bytes. The length should be long enough to hold all valid code points. Because the capacity of Unicode is 1,114,112 code points (from U+0000 to U+10FFFF), we should use at least 3 bytes to represent each code point.

This is a valid solution, of course, and it is called **UTF-32** encoding, where each character is represented by 32-bits (4 bytes). This is a fixed-length encoding schema, which means that each character takes the same amount of space in the memory. An alternative proposal is [UTF-24 encoding](https://unicode.org/mail-arch/unicode-ml/y2007-m01/0057.html), with less space wasted, but it is not very compatible with modern computer architectures.

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

### Back to string in Mojo

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
