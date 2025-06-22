# Data types

> If we were to have the same ancestor with horses instead of apes, we would have been able to invent computers much earlier.  
> -- Yuhao Zhu, *Gate of Heaven*

::: info Compatible Mojo version

This chapter is compatible with Mojo v25.4 (2025-06-18).

:::

[[toc]]

Types of data are the foundation of programming languages. They define how one and zeros in the memory are interpreted as human-readable values. Mojo's data types are similar to Python's, but with some differences due to Mojo's static compilation nature.

In this chapter, we will discuss the most common data types in Mojo. They can be categorized into several categories: numeric types (integer, floats), composite types (list, tuple), and others types (boolean). The string type and the Mojo-featured SMID type will be further discussed in separate chapters [String](../basic/string.md) and [SIMD](../advanced/simd.md). You can easily find the corresponding types in Python. The following table summarizes these data types:

| Python type | Default Mojo type  | Be careful that                                                                |
| ----------- | ------------------ | ------------------------------------------------------------------------------ |
| `int`       | `Int`              | Integers in Mojo has ranges. Be careful of **overflow**.                       |
| `float`     | `Float64`          | Almost same behaviors. You can safely use it.                                  |
| `bool`      | `Bool`             | Same.                                                                          |
| `list`      | `List`             | Elements in `List` in Mojo must be of the same data type.                      |
| `tuple`     | `Tuple`            | Very similar, but you cannot iterate over a `Tuple` in Mojo.                   |
| `set`       | `collections.Set`  | Elements in `Set` in Mojo must be of the same data type.                       |
| `dict`      | `collections.Dict` | Keys and values in `Dict` in Mojo must be of the same data type, respectively. |
| `str`       | `String`           | Similar behaviors. Note that `String` in Mojo is rapidly evolving.             |

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

### Create an integer

You can create a integer variable in decimal, binary, hexadecimal, or octal format. If we do not explicitly specify the type of the integer literal, the compiler will infer it as `Int` by default. If we explicitly specify the type of the integer, or we use the constructor of the integer type, the compiler will use that type. The following example shows how to create integer variables in different formats:

```mojo
# src/basic/types/integers.mojo
def main():
    var a = 0x1F2D  # Hexadecimal
    var b = 0b1010  # Binary
    var c = -0o17  # Octal
    var d = 1234567890  # Decimal
    var e: UInt32 = 184  # 32-bit unsigned Integer
    var f = Int128(12345)  # 128-bit Integer from constructor
    var g: Int8 = Int8(
        12
    )  # 8-bit Integer from constructor and with type annotation
    var h = SIMD[DType.index, 1](10)  # Integer with index type
    print(a, b, c, d, e, f, g, h)
```

---

To allow Mojo to **infer the type of an integer literal** without explicit type annotation, you can use the following rules:

1. If the integer literal is a decimal number without any prefix or decimal point, Mojo will infer it as `Int` by default.
1. If the integer literal starts with `0x` without dot, Mojo will infer it as a hexadecimal number and use `Int` as the type.
1. If the integer literal starts with `0b` without dot, Mojo will infer it as a binary number and use `Int` as the type.
1. If the integer literal starts with `0o` without dot, Mojo will infer it as an octal number and use `Int` as the type.

### Integer overflow

Integral typIes in Mojo are of fixed size, meaning that they can only hold values within a specific range. If the value assigned to an integer variable exceeds the range of the specified type, you may encounter either an error or an overflow. For example, if you try to assign the value 256 to a variable of type `UInt8`, you will encounter an overflow.

```mojo
def main():
    var overflow: UInt8 = 256
    print(overflow)
# Output: 0
```

This is because `UInt8` can only hold values from 0 to 255. When you assign 256 to it, it wraps around and becomes 0, which is the result of the overflow. This behavior is similar to that in most programming languages, except Python, which has arbitrary-precision integers.

Note that there is no error message printed in this case. This is because Mojo does not perform runtime checks for integer overflows by default. We need to be very careful when using integer types in Mojo compared to Python. If you really need to work on big integers that are larger than the capacity of `Int`, you can consider using the `BigInt` type, which has the similar functionality as the `int` type in Python.

We will discuss about integer overflow and Big Integer type in detail in Chapter [Arbitrary-precision numbers](../extend/decimojo.md).

### Integer conversion

If you want to add up two `Int32` numbers, you can simply use the `+` operator. The resulting value will be `Int32` as well. However, in Mojo, you are not allowed to add up two integers of different types, such as `Int32` and `Int64`. In other words, Mojo does not support implicit conversion between integer types. The only exception is the `Int` type, which allows implicit conversion.

For example, the following code will raise an error:

```mojo
# src/basic/types/integer_operations_on_incompatible_types.mojo
# This code will not compile
def main():
    var a: UInt8 = 12
    var b: Int8 = 23
    var c: Int128 = 1234

    print("a + b =", a + b)
    print("a - c =", a - c)
    print("b * c =", b * c)
```

Some of the errors you will see are:

```console
note: failed to infer parameter #0, parameter inferred to two different values: 'uint8' and 'int8'
    print("a + b =", a + b)
                         ^
note: failed to infer parameter #0, parameter inferred to two different values: 'uint8' and 'si128'
    print("a - c =", a - c)
                         ^
note: failed to infer parameter #0, parameter inferred to two different values: 'int8' and 'si128'
    print("b * c =", b * c)
                         ^
```

To fix this, you need to explicitly convert the integer types to the same type before performing the operation. You can do this by using the **constructor**, which is a special method that initializes a new instance of a specific type. The constructors are usually of **the same as the name of the corresponding type**, e.g., `Int8()`, `UInt16()`, `Int128()`, etc. You can use the constructor to convert an integer to another type, like this:

```mojo
# src/basic/types/integer_operations_with_type_conversion.mojo
def main():
    var a: UInt8 = 12
    var b: Int8 = 23
    var c: Int128 = 1234

    print("a + b =", UInt16(a) + UInt16(b))  # Type conversion to UInt16
    print("a - c =", Int128(a) - c)  # Type conversion to Int128
    print("b * c =", Int64(b) * Int64(c))  # Type conversion to Int64
```

The code will now compile and run successfully, producing the expected output:

```console
a + b = 35
a - c = -1222
b * c = 28382
```

::: danger Downward conversion may lose precision

In Mojo, you can convert an integer to a smaller integer type with narrower range, e.g., from `Int128` to `Int64` in the previous example. However, you should be careful when doing this, as it may lead to loss of precision or overflow. In some other programming languages, such downward conversion may raise an error or warning.

:::

### Exercises - integer types

Now we want to calculate the $12345^5$. Since the result is big (around 20 digits), we use `Int128` to avoid overflow. Try to run the following code in Mojo and see what happens. Explain why the result is unexpected and how to fix it.

```mojo
def main():
    var a: Int128 = 12345 ** 5
    print(a)
```

::: details Answers

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

Please fix the following code to make it work correctly, as well as to avoid potential overflow issues.

```mojo
# src/basic/types/integer_exercise_fix_operations.mojo
def main():
    var a: Int128 = 0x1F2D
    var b: UInt32 = 23941
    var c: Int8 = 3
    var d: UInt8 = 255
    var e: Int64 = -123456789
    var f: Int16 = 1032512358647127389

    print("a + b =", a + b)
    print("c + d =", c + d)
    print("d + e =", d + e)
    print("f - d =", f - d)
```

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

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
def main():
    # Float64 by default
    var a = 3.14
    # Float32 with type annotation
    var b: Float32 = 2.718
    # Float16 with constructor
    var c = Float16(1.414)
    
    print(a, b, c)
# Output: 3.14 2.718 1.4140625
```

</td><td>

```python
def main():
    # 64-bit float by default
    a = 3.14
    # Create a 64-bit float with type annotation
    b: float = 2.718
    # Create a 16-bit float with constructor
    c = float(1.414)

    print(a, b, c)

main()
# Output: 3.14 2.718 1.414
```

</td></tr></table>

::: warning Floating-point values are inexact

You may find that the output of `Float16(1.414)` is `1.4140625`, which is not exactly `1.414`. This is because floating-point numbers are inexact representations of real numbers. This is because floating-point numbers are internally represented in binary format, while it is printed in decimal format. Not all decimal numbers can be represented exactly in binary format, and vice versa. Thus, when you create a floating-point number, e.g., `Float16(1.414)`, it may be stored as the closest representable value in binary format, which is `1.4140625` in this case.

This is a common issue in many programming languages, including Python. You can have two methods to avoid or mitigate this issue:

1. Use higher precision floating-point types, such as `Float64` or `Float32`, which can represent more decimal places and reduce the error. Note that the values are still inexact, but the error can be negligible.
1. Use the big decimal type, which is internally presented in base 10. It can represent decimal numbers exactly, but it is slower than floating-point types.

We will discuss more about the inexactness of floating-point numbers and big decimal types in the chapter [Arbitrary-precision numbers](../extend/decimojo.md).

:::

## Boolean

The boolean type is a simple data type that can only have two possible states: true and false (or, yes and no, 1 and 0...). These two states are mutually exclusive and exhaustive, meaning that a boolean value can only be either true or false, and there are no other possible values.

The mojo's boolean type is renamed as `Bool`. The two states are `True` and `False`. It is comparable to the `bool` type in Python, but with the first letter capitalized.

The `Bool` type is saved as a single byte in the memory.

### Implicit conversion

Unlike Python, Mojo's Boolean values cannot be implicitly converted to integers for arithmetic operation, even though the bit representation of `True` is equivalent to `1` and `False` is equivalent to `0`. Thus, the following code will **not work** in Mojo:

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# This code will not compile
def main():
    print(True + False)
# Error
```

</td><td>

```python
def main():
    print(True + False)
main()
# Output: 1
```

</td></tr></table>

## List

In Mojo, a `List` is a mutable, variable-length sequence that can hold a collection of elements of the ***same type***. It is similar to Rust's `Vec` type, but it is different from Python's `list` type that can hold objects of **any type**. Here are some key differences between Python's `list` and Mojo's `List`:

| Functionality      | Mojo `List`            | Python `list`                               |
| ------------------ | ---------------------- | ------------------------------------------- |
| Type of elements   | Homogeneous type       | Heterogenous types                          |
| Mutability         | Mutable                | Mutable                                     |
| Inialization       | `List[Type]()` or `[]` | `list()` or `[]`                            |
| Indexing           | Use brackets `[]`      | Use brackets `[]`                           |
| Slicing            | Use brackets `[a:b:c]` | Use brackets `[a:b:c]`                      |
| Extending by items | Use `append()`         | Use `append()`                              |
| Concatenation      | Use `+` operator       | Use `+` operator                            |
| Printing           | Not supported          | Use `print()`                               |
| Iterating          | Use `for` loop         | Use `for` loop                              |
| Iterator returns   | Reference to element   | Copy of element                             |
| List comprehension | Partially supported    | Supported                                   |
| Memory layout      | Metadata -> Elements   | Pointer -> metadata -> Pointers -> Elements |

### Construct a list

There are two ways to construct a `List` in Mojo.

The first way is to use the **list literal** syntax, which is similar to Python's list syntax. You can create a `List` by using square brackets `[]` and separating the elements with commas. For example, the following code will successfully create a list of integers, floats, strings, and even lists:

```mojo
# src/basic/types/list_creation_from_literals.mojo
def main():
    my_list_of_integers = [1, 2, 3, 4, 5]
    var my_list_of_floats: List[Float64] = [0.125, 12.0, 12.625, -2.0, -12.0]
    var my_list_of_strings: List[String] = ["Mojo", "is", "awesome"]
    var my_list_of_list_of_integers: List[List[Int]] = [[1, 2], [3, 4], [5, 6]]

    print(my_list_of_integers[0])
    print(my_list_of_floats[0])
    print(my_list_of_strings[0])
    print(my_list_of_list_of_integers[0][0])
```

The second way is to use the ***list constructor***, which is a special method that initializes a new instance of the `List` type. The list constructor takes a variable number of arguments, which are the elements of the list. You **must** specify the type of the elements in the list by using square brackets `[]` after the `List` keyword. For example, we can re-write the previous example using the list constructor:

```mojo
# src/basic/types/list_creation_with_constructor.mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    var my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    var my_list_of_strings: List[String] = List[String]("Mojo", "is", "awesome")
    var my_list_of_list_of_integers = List[List[Int]](
        List[Int](1, 2), List[Int](3, 4), [5, 6]
    )

    print(my_list_of_integers[0])
    print(my_list_of_floats[0])
    print(my_list_of_strings[0])
    print(my_list_of_list_of_integers[0][0])
```

The first way is more concise and easier to read, while the second way is more explicit since you have to specify the type of the elements in the list. Both ways are valid and will produce the same result. You can choose either way depending on your preference.

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

### Iterate over a list

We can iterate over a `List` in Mojo using the `for ... in` keywords. This is similar to how we iterate over a list in Python. See the following example:

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# src/basic/types/list_iteration.mojo
def main():
    my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
# Output: 1 2 3 4 5
```

</td><td>

```python
def main():
    my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
main()
# Output: 1 2 3 4 5
```

</td></tr></table>

As a Pythonista, you may find this syntax very familiar. Actually, the above example is **completely identical** to how we iterate over a list in Python.

---

Still, there are some differences between Mojo's `List` and Python's `list` when it comes to iteration. The difference allows you to write some fancy code in Mojo that is not possible in Python.

The trick is about the local variable `i` in the for-loop. In Mojo, `i` is a **immutable reference** to the element in the list, not a copy of the element. We have already discussed the concept of reference in Chapter [Functions](../basic/functions). In short, a reference is just an alias of the variable it refers to. They have the same type, same memory address, and share the same value. You can use the reference directly without de-referencing it. By saying "immutable", we mean that you cannot change the value of the reference. This may protect you from accidentally modifying the original element in the list.

If you, however, want to change the value of the reference, you can use the `ref` keyword before `i` in the for-loop statement. This will make `i` a **mutable reference** to the element in the list, allowing you to change its value. For example, in the following code, we change the elements of the list by adding 1 to each element.

```mojo
# src/basic/types/list_iteration_with_modification.mojo
def main():
    my_list = [1, 2, 3, 4, 5]

    # Change the elements of the list using a for loop
    for ref i in my_list:
        i = i + 1

    # Print the modified list
    for i in my_list:
        print(i, end=" ")
```

The code runs successfully and prints the modified list:

```console
2 3 4 5 6
```

Note that we use `ref` before `i` in the `for ref i in my_list:` to make `i` a mutable reference to the element in the list. If you forget to use `ref`, you will get an error message because you are trying to modify the value via an immutable reference. The error message will look like this:

```console
error: expression must be mutable in assignment
        i = i + 1
        ^
```

Now let's translate the above code into Python. You will find that it does not work as expected:

```python
# src/basic/types/list_iteration_with_modification.py
def main():
    my_list = [1, 2, 3, 4, 5]

    # Change teh variable i inside the loop
    for i in my_list:
        i = i + 1

    # Print the list
    for i in my_list:
        print(i, end=" ")  # Output: 1 2 3 4 5

main()
```

The output is still `1 2 3 4 5`, which is the original list. This is because in Python, `i` is a copy of the element in the list, not a reference to it. When you change `i`, you are only changing the copy, not the original element in the list. Thus, the original list remains unchanged.

---

Returning a reference instead of a copy of the value makes Mojo's iteration more memory-efficient. Imagine that you want to read a list of books in a library. You can either:

- Ask the administrator to copy these books and give your the copies.
- Ask the administrator to give you the locations of these books, and you go to the corresponding shelves to read them.

In the first case, you will have to pay for the cost of copying the books and you have to wait for the copies to be made. In the second case, you can read the books directly without any extra cost.

The same applies to when you want to write something new into the books. In Python, you have to copy the book, make changes to the copy, and the replace the original book with the modified copy. In contrast, in Mojo, you can directly modify the book on the shelf without copying it. This is more efficient in terms of memory usage and performance.

As a Pythonista, I always try to avoid using iteration in Python because it is too slow. Some third-party libraries, such as NumPy, provide optimized functions to perform operations on arrays or matrices without using Python's built-in iteration. Nevertheless, the gain in performance can still be neutralized by the overhead of Python's loop if you still have to iterate over some objects in your code. In Mojo, however, we will never need to worry about the performance of iteration. Just be brave to iterate!

::: info List iteration before Mojo v25.4

Before Mojo v25.4, the iteration over a `List` in Mojo would return **a pointer to the address of the element** instead of the reference to the element. You have to de-reference it to get the actual value of the element. The de-referencing is done by using the `[]` operator. See the following example:

```mojo
# src/basic/types/list_iteration_before_mojo_v25d4.mojo
# This code is valid until Mojo v25.3
# It will not compile in Mojo v25.4 and later versions.
def main():
    my_list = List[Int](1, 2, 3, 4, 5)
    for i in my_list:  # `i` is a safe pointer to the element
        print(i[], end=" ")  # De-referencing the element to get its value
```

If you forget the `[]` operator, you will get an error message because you are trying to print the pointer to the element instead of the element itself.

```console
error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
        print(i,  end=" ")
        ~~~~~^~~~~~~~~~~~~
```

From Mojo v25.4 onwards, the iteration over a `List` will return a reference to the element instead of a pointer. You can directly use the element without de-referencing it.

For the difference between a pointer and a reference, please refer to Chapter [Reference system](../advanced/references#references-are-not-pointers) and Chapter [Ownership](../advanced/ownership#four-statuses-of-ownership).

:::

### Print a list

You cannot print the `List` object directly in Mojo (at least at the moment). This is because the `List` type does not implement the `Writable` trait, which is required for printing. To print a `List`, you have to write your own auxiliary function.

```mojo
# src/basic/types/list_printing.mojo
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

### Memory layout of List type

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

## Literals and type inference

Note that we use the term "literal" in the previous sections. Literals are values that you write in the code, *as it is*, such as `0x1F2D`, `1234567890`, `3.14`, or `"I am a sentence."`. Literals usually appear in the right-hand side of an assignment, or as arguments to a function. They are not variables because they are not linked to a name or, sometimes, a memory address.

The literal values are automatically stored as **specific primitive types** by the compiler according to their patterns, prefixes, or formats. For example, `12` will be stored with the type `IntLiteral`, `3.14` will be stored with the type `FloatLiteral` (a decimal point is detected), and `"I am a sentence."` will be stored as a `StringLiteral` (quotation marks are detected), etc. These literal types are primitive types that are built into the Mojo language or in the standard library and they are **not directly exposed** to users.

During compilation, these literals will be evaluated by the compiler, with some optimizations if possible, and are directly embedded in to the compiled code.

When you run the code, these literal types will be, in most cases, converted (materialized) automatically into the corresponding types. For example, the `IntLiteral` type will be converted to `Int` type and the `FloatLiteral` type will be converted to `Float64` type.

If your type annotation is not compatible with the type of the literal, you will get an error message. For example, you try to assign a float literal to an `Int` variable:

```mojo
# src/basic/types/incompatible_literal_type_and_annotation.mojo
# This code will not compile
def main():
    var a: Int = 42.5
    print(a)
```

Running the code will give you an error message like this:

```console
error: cannot implicitly convert 'FloatLiteral[42.5]' value to 'Int'
    var a: Int = 42.5
                 ^~~~
```

Note that this error will not happen in Python. The type annotation in Python is just a **hint** for users and type checkers, but it does not affect the runtime behavior of the code. In other words, when there are conflicts between the type annotation and the literal type of the value, Python will take the literal type of the value and ignore the type annotation.

::: tip R-value and L-value

Literals are usually **R-values** that does not have a memory address and you cannot use any address-related operations on it. The name "R-value" comes from the fact that they usually appear on the right-hand side of an assignment. On contrary, **L-values** are values that have a memory address and can be assigned to a variable. Although being called "L-value", they can appear on both sides of an assignment.

For example, `var a = 123` is an assignment where `a` is an L-value and `123` is an R-value (as you can use `Pointer(to=a)` to get the address of `a` but you cannot do that for the literal `123`). In the expression `var c = a + b`, `a`, `b`, `c` are all L-values (as you can find the addresses of these variables).

Back to literals again. As said before, literals are usually R-values. However, some literals can be L-values, e.g., string literals. This is because string literals are stored in a memory location at runtime and can be referenced by their address.

:::

## Major changes in this chapter

- 2025-06-21: Update to accommodate to the changes in Mojo v24.5.
- 2025-06-22: Add a section about the literal types and type inference.
