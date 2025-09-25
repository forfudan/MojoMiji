# Data types

> If we were to have the same ancestor with horses instead of apes, we would have been able to invent computers much earlier.  
> -- Yuhao Zhu, *Gate of Heaven*

Types of data are the foundation of programming languages. They define how one and zeros in the memory are interpreted as human-readable values. Mojo's data types are similar to Python's, but with some differences due to Mojo's static compilation nature.

In the following four chapters, we will discuss the most common data types in Mojo. They can be categorized into several categories: scalar types (integer, floats), composite types (list, tuple, string, SIMD), text types (string), and others types (boolean, literal).

This chapter starts with the scalar types and the boolean type, which are the most basic and simplest data types in Mojo. They represent single values that are stored in the memory with a fixed and relatively small size. The [composite types](../basic/composite), the [string type](../basic/string), the [literal types](../basic/literal), and the Mojo-featured [SMID type](../advanced/simd) will be further discussed in separate chapters.

The following topics will be covered in this chapter:

- Glance of data types in Mojo and their differences from Python
- Integers
- Floating-point numbers
- Boolean
- Exercises

## Glance of data types in Mojo

The following table summarizes the most common data types in Mojo and their corresponding types in Python:

| Python type | Mojo type          | Description                                  | Be careful that                                                                |
| ----------- | ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------ |
| `int`       | `Int`              | [Integer](#integers)                         | Integers in Mojo has ranges. Be careful of **overflow**.                       |
| `float`     | `Float64`          | [Floating-pointing](#floating-point-numbers) | Almost same behaviors. You can safely use it.                                  |
| `bool`      | `Bool`             | [Boolean](#boolean)                          | Same.                                                                          |
| `list`      | `List`             | List                                         | Elements in `List` in Mojo must be of the same data type.                      |
| `tuple`     | `Tuple`            | Tuple                                        | Very similar, but you cannot iterate over a `Tuple` in Mojo.                   |
| `set`       | `collections.Set`  | Set                                          | Elements in `Set` in Mojo must be of the same data type.                       |
| `dict`      | `collections.Dict` | Dictionary (hashmap)                         | Keys and values in `Dict` in Mojo must be of the same data type, respectively. |
| `str`       | `String`           | String (text)                                | Similar behaviors. Note that `String` in Mojo is rapidly evolving.             |

The following table summarizes the behaviors of different types in Mojo when it comes to value assignment between variables.

| Type    | `b = a`           | `b = a.copy()` | `b = a^`         |
| ------- | ----------------- | -------------- | ---------------- |
| Int     | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| Float64 | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| Bool    | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| SIMD    | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| String  | ✅ (Implicit) copy | ✅ Copy         | ✅ Move           |
| List    | ❌ Error           | ✅ Copy         | ✅ Move           |
| Set     | ❌ Error           | ✅ Copy         | ✅ Move           |
| Dict    | ❌ Error           | ✅ Copy         | ✅ Move           |

`String` is somewhat special because it allows both implicit copy and move operations. This is because `String` is so common used while can both be allocated on the stack (small strings) or on the heap (large strings). Thus, it is designed to be both implicitly copyable and movable.

## Integers

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

## Floating-point numbers

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

::: code-group

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

:::

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

::: code-group

```mojo
# This code will not compile
def main():
    print(True + False)
# Error
```

```python
def main():
    print(True + False)
main()
# Output: 1
```

:::

## Exercises

### Exercises on integer types

Now we want to calculate the $12345^5$. Since the result is big (around 20 digits), we use `Int128` to avoid overflow. Try to run the following code in Mojo and see what happens. Explain why the result is unexpected and how to fix it.

```mojo
def main():
    var a: Int128 = 12345 ** 5
    print(a)
```

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

Please fix the following code to make it work correctly, as well as to avoid potential overflow issues.

```mojo
# src/basic/types/integer_exercise_fix_operations.mojo
def main():
    var a: Int128 = 0x1F2D
    var b: UInt32 = -23941
    var c: Int8 = 3
    var d: UInt8 = 256
    var e: Int64 = -123456789
    var f: Int16 = 1032512358647127389

    print("a + b =", a + b)
    print("c + d =", c + d)
    print("d + e =", d + e)
    print("f - d =", f - d)
```

::: details Answer

```mojo
# src/basic/types/integer_exercise_fix_operations_corrected.mojo
def main():
    var a: Int128 = 0x1F2D  # This is okay
    # var b: UInt32 = -23941
    var b: Int32 = -23941  # Corrected to signed integer
    var c: Int8 = 3  # This is okay
    # var d: UInt8 = 256
    var d: UInt16 = 256  # Corrected to avoid overflow
    var e: Int64 = -123456789
    # var f: Int16 = 1032512358647127389
    var f: Int128 = 1032512358647127389  # Corrected to avoid overflow

    print("a + b =", a + Int128(b))  # Ensure type consistency
    print(
        "c + d =",
        Int32(c) + Int32(d)
        # Int32 is superset of Int8 and UInt16
    )
    print("d + e =", Int64(d) + e)  # Ensure type consistency
    print("f - d =", f - Int128(d))  # Ensure type consistency
```

:::

## Major changes in this chapter

- 2025-06-21: Update to accommodate to the changes in Mojo v25.4.
- 2025-06-22: Add a section about the literal types and type inference.
- 2025-06-26: Move the sections of list and literals to standalone chapters.
- 2025-09-25: Update to accommodate to the changes in Mojo v0.25.6.
