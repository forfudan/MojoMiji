# Things that are different

The last chapter of the Miji showed you how much Mojo is similar to Python. In
most situations, you can safely rely on your Python knowledge and experience to
write Mojo code. This chapter continues to show you the differences between the
two languages, so that you won't be surprised when you encounter error messages
or strange results.

[[toc]]

## Data types

In previous chapter, we introduced common data types in Mojo and Python, such as
`int`, `float`, `str`, `list`, `tuple`, `set`, and `dict`. In this chapter, we
will focus on the differences (nuances) between these data types in Mojo and
Python.

A table is better than hundreds of words. Let's first summarize the differences
in the following table:

| Python type  | Default Mojo type  | Be careful that                                                                                                                           |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `numpy.intp` | `Int`              | Integers in Mojo has ranges. Be careful of overflow.                                                                                      |
| `int`        | `decimo.BInt`      | Arbitrary-precision integer type not supported by Mojo's stdlib, need to import third-party [Decimo](https://github.com/forfudan/decimo). |
| `float`      | `Float64`          | Almost same behaviors. You can safely use it.                                                                                             |
| `str`        | `String`           | Similar behaviors. Note that `String` in Mojo is rapidly evolving.                                                                        |
| `bool`       | `Bool`             | Same.                                                                                                                                     |
| `list`       | `List`             | Elements in `List` in Mojo must be of the same data type.                                                                                 |
| `tuple`      | `Tuple`            | Very similar, but you cannot iterate over a `Tuple` in Mojo.                                                                              |
| `set`        | `collections.Set`  | Elements in `Set` in Mojo must be of the same data type.                                                                                  |
| `dict`       | `collections.Dict` | Keys and values in `Dict` in Mojo must be of the same data type, respectively.                                                            |

### Integer

In Mojo, there are multiple types for representing integers, but the most common
integer type (or integral type) is `Int`, which is either a 32-bit or 64-bit
signed integer depending on your system. It is ensured to cover the range of
addresses on your system. It is similar to the `numpy.intp` type in Python and
the `isize` type in Rust. Mojo also has other integer types with different sizes
in bits, such as `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `Int256` and their
unsigned counterparts.

You may think that this `Int` type is the same as the `int` type in Python, but
it is not true. The `int` type in Python is an arbitrary-precision integer type,
which means it can grow as large as the memory allows ,e.g., 1 followed by 1000
zeros. In contrast, the `Int` type in Mojo is a fixed-size integer type, which
means it has a limited range of values. On a 64-bit system, the range of `Int`
of Mojo is from `-2^63` to `2^63 - 1`. If you try to conduct operations that
exceed this range, you will encounter an overflow.

Thus, you need to always be careful when you are doing big integer calculations
in Mojo. If you really need to work on big integers that are larger than the
capacity of `Int`, you can consider using the `BigInt` type in the
[decimo package](../extend/decimo.md), which has the similar functionality as
the `int` type in Python.

::: info More on integers

We will discuss integral types in more detail in Section
[Integer](../basic/types#integers) of Chapter [Data Types](../basic/types.md).

:::

### Floating-point number

In Mojo, there are several types for representing floating-point numbers. They
differ in the number of bits they use to store the value, such as `Float16`,
`Float32`, `Float64`, and `Float128`. The most commonly used type is `Float64`,
which is a double-precision floating-point number. It is similar to the `float`
type in Python. In you do not specify the type of a floating-point number, Mojo
will automatically use `Float64` as the default type.

In short, Mojo's `Float64` type is almost the same as Python's `float` type. You
can safely use it without worrying about the differences. Mojo also provides
other floating-point types with different sizes. You can wisely choose the
appropriate type based on your needs (desired precision and range).

::: info More on floats

We will discuss floating-point types in more detail in Section
[Floating-point number](../basic/types#floating-point-numbers) of Chapter
[Data Types](../basic/types.md).

:::

### String

::: warning String is changing rapidly

The behavior of `String` has been changing rapidly since Mojo version 24.5. Some
of the features mentioned in this section may be deprecated or removed in future
versions.

:::

::: info More on string

We will discuss the string type in more detail in Chapter
[String](../basic/string).

:::

Mojo's `String` type is similar to Python's `str` type, representing a sequence
of Unicode characters. However, there are some key differences that you should
be aware of:

| Functionality                           | Python `str`                              | Mojo `String`                                                   |
| --------------------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| Constructed string from string literals | Use `str()` constructor                   | Use `String()` constructor                                      |
| Use string methods on string literals   | Yes, string literals are coerced to `str` | Yes, string literals are automatically materialized to `String` |
| Non-owning view into a string           | N.A.                                      | `StringSpan`, and `StaticString` for constants                  |
| Print string with `print()`             | Yes.                                      | Yes.                                                            |
| Format string with `format()`           | Yes, use `{}`.                            | Yes, use `{}`.                                                  |
| Named fields and formatting styles      | Yes, e.g., `{name}` and `{:.2f}`.         | Not supported.                                                  |
| f-strings                               | Yes.                                      | Not supported, but there are t-strings, e.g., `t"{name}"`.      |
| Iteration over characters               | Yes, use `for i in s:` directly.          | Yes, use `for i in s:` directly.                                |
| Length of a string                      | `len(s)`, counted in code points.         | `s.byte_length()` or `s.count_graphemes()`, and no `len(s)`.    |
| UTF8-assured indexing and slicing       | Yes, use `s[i]` or `s[i:j]` directly.     | Yes, but you must say which unit, e.g., `s[codepoint=i]`.       |

A string literal in Mojo is materialized into a `String` as soon as your program
needs it at run time, so you can call string methods on it directly, just as you
would in Python:

```mojo
def main():
    var a = 18
    print("The value of a is {}".format(a))  # This works
```

Where Mojo still differs from Python is in the details of formatting. You cannot
name your fields inside the curly brackets, and you cannot indicate a formatting
style such as `.2f` for floating-point numbers or `.3%` for percentages.

Mojo also has no f-strings. It has **t-strings** instead, which you write with a
`t` prefix. They look the same as Python's f-strings, but they only assemble the
text at the moment it is actually needed:

```mojo
def main():
    var name = "Mojo"
    print(t"Hello, {name}!")
```

```output mojo
Hello, Mojo!
```

To iterate over the characters of a `String`, you write the same `for` loop as
in Python. The difference is what one step of the loop gives you: Python gives
you one **code point**, while Mojo gives you one **grapheme cluster**, which is
what a human being would call "one character" on the screen. For plain text the
two are the same thing, and you will not notice any difference:

```python
def main():
    s: str = "Hello, world! 你好，世界！"
    for c in s:
        print(c, end="")
main()
```

```output python
Hello, world! 你好，世界！
```

```mojo
def main():
    var my_string = String("Hello, world! 你好，世界！")
    for char in my_string:
        print(char, end="")
```

```output mojo
Hello, world! 你好，世界！
```

Indexing and slicing also work, but Mojo makes you say which unit you are
counting in, because a position in a UTF-8 string can mean a byte, a code point,
or a grapheme cluster. Instead of Python's `s[i]`, you write `s[byte=i]`,
`s[codepoint=i]`, or `s[grapheme=i]`. For the same reason, `len(s)` does not
exist in Mojo at all; you choose between `s.byte_length()`,
`s.count_codepoints()`, and `s.count_graphemes()`.

::: info Byte, code point, grapheme cluster

These three words will keep coming back. Sections
[Unicode and code points](../basic/string#unicode-and-code-points) and
[Grapheme clusters](../basic/string#grapheme-clusters) of Chapter
[String](../basic/string) explain them with figures. Sections
[Which unit are you iterating over?](../basic/string#which-unit-are-you-iterating-over),
[String length](../basic/string#string-length), and
[String indexing and slicing](../basic/string#string-indexing-and-slicing) then
show the three units at work.

:::

### List

In Python, a `list` is a mutable sequence type that can hold Python objects of
**any type**. In Mojo, a `List` is also a mutable sequence type but can only
hold objects of the **same type**. Here are some key differences between
Python's `list` and Mojo's `List`:

| Functionality      | Mojo `List`            | Python `list`      |
| ------------------ | ---------------------- | ------------------ |
| Type of elements   | Homogeneous type       | Heterogenous types |
| Inialization       | `List[Type]()` or `[]` | `list()` or `[]`   |
| Printing           | Use `print()`          | Use `print()`      |
| Iterating          | Use `for` loop         | Use `for` loop     |
| Slicing            | Return `Span`          | Return a `list`    |
| Iterator returns   | Reference to element   | Copy of element    |
| List comprehension | Partially supported    | Supported          |

The following things are common between `List` in Mojo and `list` in Python:

- You can retrieve the elements of a `List` in Mojo using **indexing**.
- You can also **append** elements to a `List` in Mojo using the `append()`
  method.
- You can use the `+` operator to concatenate two `List` objects.

The other functionalities of `List` in Mojo would be different. Your knowledge
of Python's `list` may not always help you in Mojo. For example, to construct a
`List` in Mojo, you need to, sometimes, specify the type of the elements in the
list. See the following code:

```mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    var my_list_of_floats: List[Float64] = [0.125, 12.0, 12.625, -2.0, -12.0]
    var my_list_of_strings: List[String] = ["Mojo", "is", "awesome"]
    var my_list_of_8bit_uint: List[UInt8] = [0, 255, 128]

    var an_array = [1, 2, 3, 4, 5]  # No annotation: this is an `Array[Int, 5]`
```

Since Mojo v1.0.0, a bare list literal gives you an `Array`, which lives on the
stack and cannot grow. To get a `List`, annotate the variable. See Section
[Arrays](../basic/composite#arrays) for the difference.

We will discuss the list type in more detail in Chapter
[Composite data types](../basic/composite#lists). Chapter
[Memory Layout of Mojo objects](../misc/layout.md) provides some abstract
diagrams to illustrate the memory layouts of a list in Python and Mojo.

## Other difference

In addition to the differences in data types, there are some other differences
(maybe nuances) between Mojo and Python that you should be aware of:

| feature                                     | python                          | mojo                                               |
| ------------------------------------------- | ------------------------------- | -------------------------------------------------- |
| Variable definition                         | No keyword                      | `var` (in some cases optional)                     |
| Variable re-definition possible?            | Yes                             | No                                                 |
| Function definition                         | `def`                           | `def` (looser) or `fn` (stricter)                  |
| Argument behavior depends on?               | Type                            | Modifiers, e.g., `read`, `mut`, `var`              |
| Argument passed by?                         | Reference                       | Value (`var`) or reference (`read`, `mut`)         |
| Default argument mutability                 | Mutable or a new copy           | Immutable (default to `read` modifier)             |
| Raises in the function signature            | No need                         | No need for `def` function, need for `fn` function |
| A main function is needed                   | No                              | Yes                                                |
| Function overloading                        | No                              | Yes                                                |
| Chained comparison                          | Yes                             | Yes                                                |
| `a = b` for lists                           | Copy reference                  | Copy value (deep copy)                             |
| Define a type                               | `class`                         | `struct`                                           |
| Class or struct inheritable?                | Yes                             | No                                                 |
| Define attributes in class / struct         | No, but can use type annotation | Yes, use `var`                                     |
| Compile time parametrization                | No                              | Yes                                                |
| Generic and traits                          | No                              | Yes                                                |
| Dunder methods to access built-in functions | Yes                             | Yes, via traits                                    |
| Operators overloading                       | Yes                             | Yes, via traits                                    |
| Transfer ownership of variables             | No                              | Yes, use `a = b^`                                  |

::: info Where these are explained

Do not try to remember this table. Every row of it gets a chapter of its own
later in the Miji: [Variables](../basic/variables) for `var`, re-definition, and
scopes; [Functions](../basic/functions) for `def` against `fn` and for the
argument modifiers; [Structs](../basic/structs) for `struct` and its fields;
[Ownership](../advanced/ownership) for copying and for the transfer operator
`^`; [Parameterization](../advanced/parameterization) for compile-time
parameters; and [Generic and traits](../advanced/generic) for traits, dunder
methods, and operator overloading.

:::

## Main changes in this chapter

- 2026-08-19: Update to accommodate the changes in Mojo v1.0.0. A bare list
  literal now builds an `Array` rather than a `List`, so the list examples spell
  out their annotations.
