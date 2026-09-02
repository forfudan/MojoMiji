# Arbitrary-precision numbers

As discussed in Chapter [What are different](../move/different.md) and Chapter
[Data Types](../basic/types#integers), Mojo's built-in integer types are
fixed-width integers, while Python's built-in `int` type is an
arbitrary-precision integer. This means that you need to be careful when using
Mojo's built-in integer types, as they can overflow and lead to unexpected
results.

Sometimes, you may still need to use arbitrary-precision integers or decimals in
Mojo, especially for financial calculations or scientific computing where
precision is crucial. During migrating my Python code to Mojo, I found that I
need such numeric types, so I implemented them in the `decimo` package. The
`decimo` package provides a comprehensive library for arbitrary-precision
decimal and integer mathematics in Mojo.

[[toc]]

## Overflow of integers

The built-in integral types in Mojo may overflow if the result of an operation
exceeds the minimum or maximum value that the type can hold. Let's use a simple
example to illustrate the overflow issue of integral types in Mojo:

```mojo
def main():
    var a = Int(1234567890123456789)
    var b = Int(12)
    print(a, "*", b, "=", a * b)
```

```output mojo
1234567890123456789 * 12 = -3631929392228070148
```

This does not make any sense, two positive integers multiplied together should
not yield a negative integer. The only reason is that the result of the
multiplication (14814814681481481468) exceeds the maximum value that a 64-bit
signed integer can hold (9223372036854775807).

This error is quite common, yet detrimental. Why? Because it is not caught by
the compiler or during the run time. You may never notice it if, for example, it
is one of the ten thousands of intermediate steps in a long calculation.

There are three ways to avoid this issue:

1. Use even larger integer types, such as `Int128` or `Int256`, which can hold
   larger values without overflow. However, this is not always useful, as these
   types still have a maximum value.
1. Add more checks in your code to ensure that the values do not exceed the
   maximum value of the integer type you are using. This can be cumbersome and
   error-prone, especially for complex calculations.
1. Use an arbitrary-precision integer type that can hold any value without
   overflow. This is the safest solution, but may be slower than using
   fixed-width integers.

Python chooses the third option. The built-in `int` type in Python is an
arbitrary-precision integer type, which means it can hold any value without
overflow. This is why you can run the above code in Python and get the correct
result:

```python
def main():
    a = 1234567890123456789
    b = 12
    print(a, "*", b, "=", a * b)

main()
```

```output python
1234567890123456789 * 12 = 14814814681481481468
```

This kind of arbitrary-precision integer type is usually called a
**"big integer"** or **"big number"**. It is a common feature in many
programming languages, including Python, Java, and C#.

If you want to use arbitrary-precision integers in Mojo, then you should
implement you own big integer type or use a third-party library that provides
such functionality. `decimo` is one such library that provides
arbitrary-precision integers. We can re-write the above example using the
`decimo.BigInt` type as follows:

```mojo norun
from decimo import BigInt


def main():
    var a = Int(1234567890123456789)
    var b = Int(12)
    print(a, "*", b, "=", BigInt(a) * BigInt(b))
```

This will give you the correct result:

```console
1234567890123456789 * 12 = 14814814681481481468
```

You can actually work on more extreme cases, for example, calculating the power
of `a` to `b`:

```mojo norun
from decimo import BigInt

def main() raises:
    var a = Int(1234567890123456789)
    var b = Int(12)
    print(a, "**", b, "=", BigInt(a) ** BigInt(b))
```

When you run this code, you will get the following result:

```console
1234567890123456789 ** 12 = 12536598767934098837011289671595456457885541576391566217874996122697055512637259324480105568130484327376910432118088483145279663445798477902348851871108361672220924450351951840609761138957964307683784160819562366959121
```

## Inexact floating-point numbers

We are living in a world of decimal numbers. Some theories suggest that the
decimal system is more natural for humans, as we have ten fingers. However,
computers are built on binary systems, which means they use base-2 numbers. This
leads to some interesting challenges when it comes to representing decimal
numbers in binary. More specifically, some decimal numbers cannot be represented
exactly in binary, which leads to inexact floating-point numbers.

Why would this happen? A quick answer is the following rule:

"In a base-N system, fractions can be represented exactly if and only if the
denominator of the fraction is a product of the prime factors of N."

I am not going to provide a mathematical proof here. You can read
[this page](https://en.wikipedia.org/wiki/Decimal_representation) if you are
interested. This rule has the following implications:

1. In base-10 (decimal) system, fractions can be represented exactly if and only
   if the denominator is a product of the prime factors of 10, which are 2 and
   5.
1. In base-2 (binary) system, fractions can be represented exactly if and only
   if the denominator is a product of the prime factors of 2, which is just 2
   itself.

This means that some finite decimal numbers cannot be represented exactly in
binary. For example, the decimal number `0.1` is a fraction of `1/10`. Since the
denominator `10` is a product of the prime factors `2` and `5`, it can be
represented exactly in decimal. However, it cannot be represented exactly in
binary due to the existence of the prime factor `5` in the denominator.

If you want to store the decimal value `0.1` in the binary format, you can only
approximate it. In binary, the decimal value `0.1` is represented as an infinite
repeating fraction
`0b0.00011001100110011001100110011001100110011001100110011...`, which cannot be
represented exactly in a finite number of bits.

This leads to rounding errors when you perform arithmetic operations with such
numbers. Usually, the errors are very small and can be ignored in most cases.
However, as the intermediate results accumulate, these errors can grow and lead
to significant inaccuracies in the final result.

---

On the other hand, floating-point numbers are represented in **fixed-width**
binary formats. Thus, it also have a limited range and a limited precision:

1. A limited range means that floating-point numbers can only represent a finite
   set of values. For example, the `Float64` type in Mojo can represent numbers
   from approximately `-1.7976931348623157e+308` to `1.7976931348623157e+308`.
1. A limited precision means that floating-point numbers can only represent a
   finite number of significant digits. For example, the `Float64` type in Mojo
   can represent numbers with up to 15-17 significant digits. The larger the
   number is, the fewer significant digits it can represent.

---

These two factors combined lead to the inexactness of floating-point numbers.
Let's use a simple example to illustrate the inexactness of floating-point
numbers in Mojo:

```mojo
def main():
    var a: Float64 = 1.23456789  # Cannot be represented exactly in binary
    var b: Float64 = 3.1415926

    print(
        a, "* 10.0**8 =", a * 10.0**8
    )  # The correct result should be 123456789.0
    print(
        b, "** 10 =", b**10
    )  # The correct result should have around 70 digits after the decimal point
```

```output mojo
1.23456789 * 10.0**8 = 123456788.99999999
3.1415926 ** 10 = 93648.03150144957
```

The result suggests that the multiplication operation has lost some precision,
and the result is not exact as expected.

---

Usually, we can ignore these small errors in most cases, as they are negligible
compared to the magnitude of the numbers involved. However, in some cases, such
as financial calculations or scientific computing, these errors can accumulate
and lead to significant inaccuracies in the final result.

To avoid these issues, we can use arbitrary-precision decimal types that can
represent decimal numbers exactly without rounding errors. The decimal types
usually store the decimal numbers as a list of digits ranging from 0 to 9, along
with a scale factor that indicates the position of the decimal point. It
conducts arithmetic operations on the digits directly, just like how we do it in
elementary school, which avoids the rounding errors caused by floating-point
numbers.

In Python, this decimal type is provided by the built-in `decimal` module as the
`Decimal` type. In Mojo, you can use the `BigDecimal` type from the `decimo`
package, which is an arbitrary-precision decimal type that can represent decimal
numbers exactly without rounding errors. For example, the above example can be
rewritten using the `decimo.BigDecimal` type as follows:

```mojo norun
# src/extend/decimo/decimal_type.mojo
from decimo import BigDecimal


def main() raises:
    var a = BigDecimal("1.23456789")
    var b = BigDecimal("3.1415926")

    print(
        a, "* 10**8 =", a * BigDecimal("10") ** BigDecimal("8")
    )  # The correct result should be 123456789.0
    print(
        b, "** 10 =", b.power(BigDecimal(10), precision=100)
    )  # The correct result should have around 70 digits after the decimal point
```

When you run this code, you will get the following result:

```console
1.23456789 * 10**8 = 123456789.00000000
3.1415926 ** 10 = 93648.0315014495481723968473176551378255326155968781378537537925281032037376
```

You can see that the result is exact as expected, and there are no rounding
errors.

## Decimo library

[Decimo](https://github.com/forfudan/decimo) provides an arbitrary-precision
decimal and integer mathematics library for Mojo, delivering exact calculations
for financial modeling, scientific computing, and applications where
floating-point approximation errors are unacceptable. Beyond basic arithmetic,
the library includes advanced mathematical functions with guaranteed precision.

The core types are:

- A base-10 arbitrary-precision signed integer type (`BigInt`) and a base-10
  arbitrary-precision unsigned integer type (`BigUInt`) supporting unlimited
  digits[^integer]. It features comprehensive arithmetic operations, comparison
  functions, and supports extremely large integer calculations efficiently.
- An arbitrary-precision decimal implementation `BigDecimal` allowing for
  calculations with unlimited digits and decimal places[^arbitrary].
- A 128-bit fixed-point decimal implementation (`Decimal128`) supporting up to
  29 significant digits with a maximum of 28 decimal places[^fixed]. It features
  a complete set of mathematical functions including logarithms, exponentiation,
  roots, etc.

| type         | alias             | information                          | internal representation             |
| ------------ | ----------------- | ------------------------------------ | ----------------------------------- |
| `BigUInt`    | `BUInt`           | arbitrary-precision unsigned integer | `List[UInt32]`                      |
| `BigInt`     | `BInt`, `Integer` | arbitrary-precision integer          | `BigUInt`, `Bool`                   |
| `BigDecimal` | `BDec`, `Decimal` | arbitrary-precision decimal          | `BigUInt`, `Int`, `Bool`            |
| `Decimal128` | `Dec128`          | 128-bit fixed-precision decimal      | `UInt32`,`UInt32`,`UInt32`,`UInt32` |
| `BigFloat`   | `Float`           | arbitrary-precision floating-point   | MPFR/GMP                            |

::: warning `Decimal` means something different now

If you are coming from an older version of decimo, note that the names have
shifted. `Decimal` used to be the 128-bit fixed-point type; it is now an
**alias for `BigDecimal`**, the arbitrary-precision one. The 128-bit type is
called `Decimal128` (short alias `Dec128`), and the old `Dec` and `RM` aliases
are gone. Where you used to write `RM`, write `RoundingMode`.

:::

---

Decimo is available in the
[modular-community](https://repo.prefix.dev/modular-community) package
repository. You can install it by adding a line to the dependency section of
your `pixi.toml` file, and then running `pixi install`:

::: code-group

```toml
[dependencies]
decimo = ">=0.12.0, <0.13.0"
```

:::

Version 0.12.0 is the release that works with Mojo v1.0.0. Pinning a range like
this, rather than writing `decimo = "*"`, keeps a future release of the library
from quietly breaking your project.

## Core types

### BigInt type

The BigInt implementation uses a base-10 representation for users (maintaining
decimal semantics), while internally using an optimized base-10^9 storage system
for efficient calculations. This approach balances human-readable decimal
operations with high-performance computing. It provides both floor division
(round toward negative infinity) and truncate division (round toward zero)
semantics, enabling precise handling of division operations with correct
mathematical behavior regardless of operand signs.

The `BigInt` type is similar to the `int` type in Python.

Here is a comprehensive quick-start guide showcasing each major function of the
`BigInt` type.

```mojo norun
from decimo import BigInt, BInt
# BInt is an alias for BigInt

def main() raises:
    # === Construction ===
    var a = BigInt("12345678901234567890")     # From string
    var b = BInt(12345)                        # From integer

    # === Basic Arithmetic ===
    print(a + b)                               # 12345678901234580235
    print(a - b)                               # 12345678901234555545
    print(a * b)                               # 152407406035740740602050

    # === Division Operations ===
    print(a // b)                              # Floor division: 1000054994024671
    print(a.truncate_divide(b))                # Truncate division: 1000054994024671
    print(a % b)                               # Modulo: 4395

    # === Power Operation ===
    print(BInt(2).power(10))                   # Power: 1024
    print(BInt(2) ** 10)                       # Power with `**`: 1024

    # === Comparison ===
    print(a > b)                               # Greater than: True
    print(a == BInt("12345678901234567890"))   # Equality: True
    print(a.is_zero())                         # Check for zero: False

    # === Type Conversions ===
    print(String(a))                           # To string: 12345678901234567890

    # === Sign Handling ===
    print(-a)                                  # Negation: -12345678901234567890
    print(abs(BInt("-12345678901234567890")))  # Absolute value
    print(a.is_negative())                     # Check if negative: False
```

### BigDecimal type

The `BigDecimal` type can represent arbitrary-precision decimal values. It is
similar to the `decimal` type in the Python's built-in `decimal` module.

Here are some examples showcasing the arbitrary-precision feature of the
`BigDecimal` type.

```mojo norun
from decimo import BDec


def main() raises:
    var PRECISION = 100
    var a = BDec("123456789.123456789")
    var b = BDec("1234.56789")
    print(a.sqrt(precision=PRECISION))
    # 11111.11106611111096943055498174930232833813065468909453818857935956641682120364106016272519460988485
    print(a.power(b, precision=PRECISION))
    # 3.346361102419080234023813540078946868219632448203078657310495672766009862564151996325555496759911131748170844123475135377098326591508239654961E+9989
    print(a.log(b, precision=PRECISION))
    # 2.617330026656548299907884356415293977170848626010103229392408225981962436022623783231699264341492663671325580092077394824180414301026578169909
```

### Decimal128 type

The `Decimal` type can represent values with up to 29 significant digits and a
maximum of 28 digits after the decimal point. When a value exceeds the maximum
representable value (`2^96 - 1`), Decimo either raises an error or rounds the
value to fit within these constraints. For example, the significant digits of
`8.8888888888888888888888888888` (29 eights total with 28 after the decimal
point) exceeds the maximum representable value (`2^96 - 1`) and is automatically
rounded to `8.888888888888888888888888889` (28 eights total with 27 after the
decimal point). Decimo's `Decimal` type is similar to `System.Decimal`
(C#/.NET), `rust_decimal` in Rust, `DECIMAL/NUMERIC` in SQL Server, etc.

Here is a comprehensive quick-start guide showcasing each major function of the
`Decimal` type.

```mojo norun
from decimo import Decimal128, RoundingMode
# Dec128 is an alias for Decimal128

def main() raises:
    # === Construction ===
    var a = Decimal128("123.45")                       # From string
    var b = Decimal128(123)                            # From integer
    var c = Decimal128(123, 2)                         # Integer with scale: 1.23
    var d = Decimal128.from_float(3.14159)             # From floating-point

    # === Basic Arithmetic ===
    print(a + b)                                       # 246.45
    print(a - b)                                       # 0.45
    print(a * b)                                       # 15184.35
    print(a / b)                                       # 1.0036585365853658536585365854

    # === Rounding & Precision ===
    print(a.round(1))                                  # 123.4
    print(a.quantize(Decimal128("0.01")))              # 123.45
    print(a.round(0, RoundingMode.ROUND_DOWN))         # 123

    # === Comparison ===
    print(a > b)                                       # True
    print(a == Decimal128("123.45"))                   # True
    print(a.is_zero())                                 # False
    print(Decimal128("0").is_zero())                   # True

    # === Type Conversions ===
    print(Float64(a))                                  # To float: 123.45
    print(Int(a))                                      # To integer: 123
    print(String(a))                                   # To string: 123.45
    print(a.coefficient())                             # Coefficient: 12345
    print(a.scale())                                   # Scale: 2

    # === Mathematical Functions ===
    print(Decimal128("2").sqrt())                      # 1.4142135623730950488016887242
    print(Decimal128("100").root(3))                   # 4.641588833612778892410076351
    print(Decimal128("2.71828").ln())                  # 0.9999993273472820031578910056
    print(Decimal128("10").log10())                    # 1
    print(Decimal128("16").log(Decimal128("2")))       # 3.9999999999999999999999999999
    print(Decimal128("10").exp())                      # 22026.465794806716516957900645
    print(Decimal128("2").power(10))                   # 1024

    # === Sign Handling ===
    print(-a)                                          # -123.45
    print(abs(Decimal128("-123.45")))                  # 123.45
    print(Decimal128("123.45").is_negative())          # False

    # === Special Values ===
    print(Decimal128.PI())                             # 3.1415926535897932384626433833
    print(Decimal128.E())                              # 2.7182818284590452353602874714
    print(Decimal128.ONE())                            # 1
    print(Decimal128.ZERO())                           # 0
    print(Decimal128.MAX())                            # 79228162514264337593543950335

    # === Convenience Methods ===
    print(Decimal128("123.400").is_integer())          # False
    print(a.number_of_significant_digits())            # 5
    print(Decimal128("12.34").to_string(scientific=True))  # 1.234E+1
```

## Main changes in this chapter

- 2026-08-19: Update to accommodate the changes in Mojo v1.0.0 and decimo
  v0.12.0. The 128-bit fixed-point type is renamed from `Decimal` to
  `Decimal128`, and `Decimal` is now an alias for `BigDecimal`. The `RM` alias
  and the `to_str()` / `to_int()` methods are gone. Every code example is re-run
  against decimo v0.12.0 and its output comments corrected.
