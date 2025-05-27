# Things that are different

The last chapter of the Miji showed you how much Mojo is similar to Python. In most situations, you can safely rely on your Python knowledge and experience to write Mojo code. This chapter continues to show you the differences between the two languages, so that you won't be surprised when you encounter error messages or strange results.

[[toc]]

## Data types

In previous chapter, we introduced common data types in Mojo and Python, such as `int`, `float`, `str`, `list`, `tuple`, `set`, and `dict`. In this chapter, we will focus on the differences (nuances) between these data types in Mojo and Python.

A table is better than hundreds of words. Let's first summarize the differences in the following table:

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

### Integer

In Mojo, there are multiple types for representing integers, but the most common integer type (or integral type) is `Int`, which is either a 32-bit or 64-bit signed integer depending on your system. It is ensured to cover the range of addresses on your system. It is similar to the `numpy.intp` type in Python and the `isize` type in Rust. Mojo also has other integer types with different sizes in bits, such as `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `Int256` and their unsigned counterparts.

You may think that this `Int` type is the same as the `int` type in Python, but it is not true. The `int` type in Python is an arbitrary-precision integer type, which means it can grow as large as the memory allows ,e.g., 1 followed by 1000 zeros. In contrast, the `Int` type in Mojo is a fixed-size integer type, which means it has a limited range of values. On a 64-bit system, the range of `Int` of Mojo is from `-2^63` to `2^63 - 1`. If you try to conduct operations that exceed this range, you will encounter an overflow.

Thus, you need to always be careful when you are doing big integer calculations in Mojo. If you really need to work on big integers that are larger than the capacity of `Int`, you can consider using the `BigInt` type in the [decimojo package](../extensions/decimojo.md), which has the similar functionality as the `int` type in Python.

::: info More on integers

We will discuss integral types in more detail in Section [Integer](../basic/types.md#integer) of Chapter [Data Types](../basic/types.md).

:::

### Floating-point number

In Mojo, there are several types for representing floating-point numbers. They differ in the number of bits they use to store the value, such as `Float16`, `Float32`, `Float64`, and `Float128`. The most commonly used type is `Float64`, which is a double-precision floating-point number. It is similar to the `float` type in Python. In you do not specify the type of a floating-point number, Mojo will automatically use `Float64` as the default type.

In short, Mojo's `Float64` type is almost the same as Python's `float` type. You can safely use it without worrying about the differences. Mojo also provides other floating-point types with different sizes. You can wisely choose the appropriate type based on your needs (desired precision and range).

### String

::: warning String is changing rapidly

The behavior of `String` has been changing rapidly since Mojo version 24.5. Some of the features mentioned in this section may be deprecated or removed in future versions.

:::

::: info More on string

We will discuss the string type in more detail in Section [String](../basic/types.md#string) of Chapter [Data Types](../basic/types.md).

:::

Mojo's `String` type is similar to Python's `str` type, representing a sequence of Unicode characters. However, there are some differences that you should be aware of:

| Functionality                     | Python `str`                           | Mojo `String`                                       |
| --------------------------------- | -------------------------------------- | --------------------------------------------------- |
| Constructed from string literals  | Use of`str()` constructor is optional. | You have to use `String()` constructor.             |
| Print string with `print()`       | Yes.                                   | Yes.                                                |
| Format string with `format()`     | Yes, use `{}`.                         | Yes, but you cannot specify formatting, e.g, `.2f`. |
| f-strings                         | Yes.                                   | Not supported.                                      |
| Iteration over UTF-8 code points  | Yes, use `for i in s:` directly.       | Yes, but more complicated.                          |
| UTF8-assured indexing and slicing | Yes, use `s[i]` or `s[i:j]` directly.  | Not supported.                                      |

If you use only quotation marks to define a string, Mojo will treat it as a string literal type. You format them with `format()`. For example, the following code will raise an error:

```mojo
def main():
    var a = 18
    print("The value of a is {}".format(a))  # This will raise an error
```

To avoid this error, you need to use `String()` constructor to convert the string literal to a `String` type:

```mojo
def main():
    var a = 18
    print(String("The value of a is {}".format(a)))  # This will work
```

Currently, you cannot indicate formatting style for `String`, such as `.2f` for floating-point numbers or `.3%` for percentages.

You cannot use f-strings in Mojo at the moment.

To iterate over the UTF-8 code points in a `String`, you can use a `for` loop, but it is more complicated than in Python. You have to iterate over `String.codepoints()` and then wrap the items with `String()` constructor. See the following comparison:

```python
def main():
    s: str = "Hello, world!"
    for c in s:
        print(c, end="")
main()
# Output: Hello, world! 你好，世界！
```

```mojo
def main():
    my_string = String("Hello, world! 你好，世界！")
    for char in my_string.codepoints():
        print(String(char), end="")
# Output: Hello, world! 你好，世界！
```

To access a code point in a Python `str`, you can just use indexing or slicing, such as `s[i]` or `s[i:j]`. However, in Mojo, you cannot do this directly at the moment. This feature is still under development.

::: info More on integers

We will discuss floating-point types in more detail in Section [Floating-point number](../basic/types.md#floating-point-number) of Chapter [Data Types](../basic/types.md).

:::

### List

In Python, a `list` is a mutable sequence type that can hold Python objects of **any type**. In Mojo, a `List` is also a mutable sequence type but can only hold objects of the **same type**. Here are some key differences between Python's `list` and Mojo's `List`:

| Functionality      | Mojo `List`                     | Python `list`          |
| ------------------ | ------------------------------- | ---------------------- |
| Type of elements   | Homogeneous type                | Heterogenous types     |
| Mutability         | Mutable                         | Mutable                |
| Inialization       | `List[Type]()`                  | `list()` or `[]`       |
| Indexing           | Use brackets `[]`               | Use brackets `[]`      |
| Slicing            | Use brackets `[a:b:c]`          | Use brackets `[a:b:c]` |
| Extending by items | Use `append()`                  | Use `append()`         |
| Concatenation      | Use `+` operator                | Use `+` operator       |
| Printing           | Not supported                   | Use `print()`          |
| Iterating          | Use `for` loop and de-reference | Use `for` loop         |

The following things are common between `List` in Mojo and `list` in Python:

- You can retrieve the elements of a `List` in Mojo using **indexing**.
- You can create another `List` by **slicing** an existing `List`.
- You can also **append** elements to a `List` in Mojo using the `append()` method.
- You can use the `+` operator to concatenate two `List` objects.

The other functionalities of `List` in Mojo would be different. Your knowledge of Python's `list` will not help you much in Mojo. Let's look at them one by one.

To construct a `List` in Mojo, you have to use the ***list constructor***. For example, to create a list of `Int` numbers, you can use the following code:

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    my_list_of_strings = List[String]("Mojo", "is", "awesome")
```

You cannot print the `List` object directly in Mojo for now. You have to write your own function to iterate over the elements of the `List` and print them one by one.

When you iterate over a `List` in Python, you get the elements directly. However, in Mojo, you get references to these elements (pointers to their address in the memory). so you have to de-reference them first before using them. The dereferencing is done via the `[]` operator. See the following comparison:

```python
def main():
    my_list: list[int] = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")  # Directly printing the element
# Output: 1 2 3 4 5

```

```mojo
def main():
    my_list = List[Int](1, 2, 3, 4, 5)
    for i in my_list:
        print(i[], end=" ")  # De-referencing the element to get its value
# Output: 1 2 3 4 5 
```

We will discuss the list type in more detail in Section [List](../basic/types.md#list) of Chapter [Data Types](../basic/types.md). Chapter [Memory Layout of Mojo objects](../misc/layout.md) provides some abstract diagrams to illustrate the memory layouts of a list in Python and Mojo.
