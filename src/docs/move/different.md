# Things that are different

The last chapter of the Miji showed you how much Mojo is similar to Python. In most situations, you can safely rely on your Python knowledge and experience to write Mojo code. This chapter continues to show you the differences between the two languages, so that you won't be surprised when you encounter error messages or strange results.

[[toc]]

## Data types

In previous chapter, we introduced common data types in Mojo and Python, such as `int`, `float`, `str`, `list`, `tuple`, `set`, and `dict`. In this chapter, we will focus on the differences (nuances) between these data types in Mojo and Python.

A table is better than hundreds of words. Let's first summarize the differences in the following table:

| Python type | Main Mojo type     | Be careful that                                                                |
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

In Mojo, the most common integer type is `Int`, which is either a 32-bit or 64-bit signed integer depending on your system. It is ensured to cover the range of addresses on your system. It is similar to the `numpy.intp` type in Python and the `isize` type in Rust. Mojo also has other integer types with different sizes in bits, such as `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `Int256` and their unsigned counterparts.

You may think that this `Int` type is the same as the `int` type in Python, but it is not true. The `int` type in Python is an arbitrary-precision integer type, which means it can grow as large as the memory allows ,e.g., 1 followed by 1000 zeros. In contrast, the `Int` type in Mojo is a fixed-size integer type, which means it has a limited range of values. On a 64-bit system, the range of `Int` of Mojo is from `-2^63` to `2^63 - 1`. If you try to conduct operations that exceed this range, you will encounter an overflow.

Thus, you need to always be careful when you are doing big integer calculations in Mojo. If you really need to work on big integers that are larger than the capacity of `Int`, you can consider using the `BigInt` type in the [decimojo package](../extensions/decimojo.md), which has the similar functionality as the `int` type in Python.

We will cover this in more detail in Section [Integer](../basic/types.md#integer)
 of Chapter [Data Types](../basic/types.md).
