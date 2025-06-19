# Arbitrary-precision numbers

As discussed in Chapter [What are different](../move/different.md) and Chapter [Data Types](../basic/types#integer), Mojo's built-in integer types are fixed-width integers, while Python's built-in `int` type is an arbitrary-precision integer. This means that you need to be careful when using Mojo's built-in integer types, as they can overflow and lead to unexpected results.

Sometimes, you may still need to use arbitrary-precision integers or decimals in Mojo, especially for financial calculations or scientific computing where precision is crucial. During migrating my Python code to Mojo, I found that I need such numeric types, so I implemented them in the `decimojo` package. The `decimojo` package provides a comprehensive library for arbitrary-precision decimal and integer mathematics in Mojo.

[[toc]]

## Overflow of integers

Let's use a simple example to illustrate the overflow issue of integral types in Mojo:

```mojo
def main():
    var a = Int(1234567890123456789)
    var b = Int(12)
    print(a, "*", b, "=", a * b)
```

When you run this code, you will get the following result:

```console
1234567890123456789 * 12 = -3631929392228070148
```

This does not make any sense, two positive integers multiplied together should not yield a negative integer. The only reason is that the result of the multiplication (14814814681481481468) exceeds the maximum value that a 64-bit signed integer can hold (9223372036854775807).

This error is quite common, yet detrimental. Why? Because it is not caught by the compiler or during the run time. You may never notice it if, for example, it is one of the ten thousands of intermediate steps in a long calculation.

There are three ways to avoid this issue:

1. Use even larger integer types, such as `Int128` or `Int256`, which can hold larger values without overflow. However, this is not always useful, as these types still have a maximum value.
1. Add more checks in your code to ensure that the values do not exceed the maximum value of the integer type you are using. This can be cumbersome and error-prone, especially for complex calculations.
1. Use an arbitrary-precision integer type that can hold any value without overflow. This is the safest solution, but may be slower than using fixed-width integers.

Python chooses the third option. The built-in `int` type in Python is an arbitrary-precision integer type, which means it can hold any value without overflow. This is why you can run the above code in Python and get the correct result:

```python
def main():
    a = 1234567890123456789
    b = 12
    print(a, "*", b, "=", a * b)

main()
# Output:
# 1234567890123456789 * 12 = 14814814681481481468
```

This kind of arbitrary-precision integer type is usually called a **"big integer"** or **"big number"**. It is a common feature in many programming languages, including Python, Java, and C#.

If you want to use arbitrary-precision integers in Mojo, then you should implement you own big integer type or use a third-party library that provides such functionality. `decimojo` is one such library that provides arbitrary-precision integers. We can re-write the above example using the `decimojo.BigInt` type as follows:

```mojo
from decimojo import BigInt


def main():
    var a = Int(1234567890123456789)
    var b = Int(12)
    print(a, "*", b, "=", BigInt(a) * BigInt(b))
```

This will give you the correct result:

```console
1234567890123456789 * 12 = 14814814681481481468
```

You can actually work on more extreme cases, for example, calculating the power of `a` to `b`:

```mojo
from decimojo import BigInt

def main():
    var a = Int(1234567890123456789)
    var b = Int(12)
    print(a, "**", b, "=", BigInt(a) ** BigInt(b))
```

When you run this code, you will get the following result:

```console
1234567890123456789 ** 12 = 12536598767934098837011289671595456457885541576391566217874996122697055512637259324480105568130484327376910432118088483145279663445798477902348851871108361672220924450351951840609761138957964307683784160819562366959121
```


## Inexact floating-point numbers

Let's also use a simple example to illustrate the inexactness of floating-point numbers in Mojo:

(to be worked on)

## DeciMojo library

DeciMojo provides an arbitrary-precision decimal and integer mathematics library for Mojo, delivering exact calculations for financial modeling, scientific computing, and applications where floating-point approximation errors are unacceptable. Beyond basic arithmetic, the library includes advanced mathematical functions with guaranteed precision.

The core types are:

- A 128-bit fixed-point decimal implementation (`Decimal`) supporting up to 29 significant digits with a maximum of 28 decimal places[^fixed]. It features a complete set of mathematical functions including logarithms, exponentiation, roots, etc.
- An arbitrary-precision decimal implementation `BigDecimal` allowing for calculations with unlimited digits and decimal places[^arbitrary].
- A base-10 arbitrary-precision signed integer type (`BigInt`) and a base-10 arbitrary-precision unsigned integer type (`BigUInt`) supporting unlimited digits[^integer]. It features comprehensive arithmetic operations, comparison functions, and supports extremely large integer calculations efficiently.

| type         | alias   | information                          | internal representation             |
| ------------ | ------- | ------------------------------------ | ----------------------------------- |
| `BigUInt`    | `BUInt` | arbitrary-precision unsigned integer | `List[UInt32]`                      |
| `BigInt`     | `BInt`  | arbitrary-precision integer          | `BigUInt`, `Bool`                   |
| `Decimal`    | `Dec`   | 128-bit fixed-precision decimal      | `UInt32`,`UInt32`,`UInt32`,`UInt32` |
| `BigDecimal` | `BDec`  | arbitrary-precision decimal          | `BigUInt`, `Int`, `Bool`            |

## Installation

DeciMojo is available in the [modular-community](https://repo.prefix.dev/modular-community) package repository. You can install it using any of these methods:

From the `magic` CLI, simply run ```magic add decimojo```. This fetches the latest version and makes it immediately available for import.

For projects with a `mojoproject.toml`file, add the dependency ```decimojo = ">=0.3.0"```. Then run `magic install` to download and install the package.

For the latest development version, clone the [GitHub repository](https://github.com/forfudan/decimojo) and build the package locally.

| `decimojo` | `mojo`        |
| ---------- | ------------- |
| v0.1.0     | ==25.1        |
| v0.2.0     | ==25.2        |
| v0.3.0     | ==25.2        |
| v0.3.1     | >=25.2, <25.4 |

## Quick start

Here is a comprehensive quick-start guide showcasing each major function of the `Decimal` type.

```mojo
from decimojo import Decimal, RoundingMode

fn main() raises:
    # === Construction ===
    var a = Decimal("123.45")                        # From string
    var b = Decimal(123)                             # From integer
    var c = Decimal(123, 2)                          # Integer with scale (1.23)
    var d = Decimal.from_float(3.14159)              # From floating-point
    
    # === Basic Arithmetic ===
    print(a + b)                                     # Addition: 246.45
    print(a - b)                                     # Subtraction: 0.45
    print(a * b)                                     # Multiplication: 15184.35
    print(a / b)                                     # Division: 1.0036585365853658536585365854
    
    # === Rounding & Precision ===
    print(a.round(1))                                # Round to 1 decimal place: 123.5
    print(a.quantize(Decimal("0.01")))               # Format to 2 decimal places: 123.45
    print(a.round(0, RoundingMode.ROUND_DOWN))       # Round down to integer: 123
    
    # === Comparison ===
    print(a > b)                                     # Greater than: True
    print(a == Decimal("123.45"))                    # Equality: True
    print(a.is_zero())                               # Check for zero: False
    print(Decimal("0").is_zero())                    # Check for zero: True
    
    # === Type Conversions ===
    print(Float64(a))                                # To float: 123.45
    print(a.to_int())                                # To integer: 123
    print(a.to_str())                                # To string: "123.45"
    print(a.coefficient())                           # Get coefficient: 12345
    print(a.scale())                                 # Get scale: 2
    
    # === Mathematical Functions ===
    print(Decimal("2").sqrt())                       # Square root: 1.4142135623730950488016887242
    print(Decimal("100").root(3))                    # Cube root: 4.641588833612778892410076351
    print(Decimal("2.71828").ln())                   # Natural log: 0.9999993273472820031578910056
    print(Decimal("10").log10())                     # Base-10 log: 1
    print(Decimal("16").log(Decimal("2")))           # Log base 2: 3.9999999999999999999999999999
    print(Decimal("10").exp())                       # e^10: 22026.465794806716516957900645
    print(Decimal("2").power(10))                    # Power: 1024
    
    # === Sign Handling ===
    print(-a)                                        # Negation: -123.45
    print(abs(Decimal("-123.45")))                   # Absolute value: 123.45
    print(Decimal("123.45").is_negative())           # Check if negative: False
    
    # === Special Values ===
    print(Decimal.PI())                              # π constant: 3.1415926535897932384626433833
    print(Decimal.E())                               # e constant: 2.7182818284590452353602874714
    print(Decimal.ONE())                             # Value 1: 1
    print(Decimal.ZERO())                            # Value 0: 0
    print(Decimal.MAX())                             # Maximum value: 79228162514264337593543950335
    
    # === Convenience Methods ===
    print(Decimal("123.400").is_integer())           # Check if integer: False
    print(a.number_of_significant_digits())          # Count significant digits: 5
    print(Decimal("12.34").to_str_scientific())      # Scientific notation: 1.234E+1
```

[Click here for 8 key examples](https://zhuyuhao.com/decimojo/docs/examples) highlighting the most important features of the `Decimal` type.

Here are some examples showcasing the arbitrary-precision feature of the `BigDecimal` type.

```mojo
from decimojo import BDec, RM


fn main() raises:
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

Here is a comprehensive quick-start guide showcasing each major function of the `BigInt` type.

```mojo
from decimojo import BigInt, BInt
# BInt is an alias for BigInt

fn main() raises:
    # === Construction ===
    var a = BigInt("12345678901234567890")         # From string
    var b = BInt(12345)                            # From integer
    
    # === Basic Arithmetic ===
    print(a + b)                                   # Addition: 12345678901234580235
    print(a - b)                                   # Subtraction: 12345678901234555545
    print(a * b)                                   # Multiplication: 152415787814108380241050
    
    # === Division Operations ===
    print(a // b)                                  # Floor division: 999650944609516
    print(a.truncate_divide(b))                    # Truncate division: 999650944609516
    print(a % b)                                   # Modulo: 9615
    
    # === Power Operation ===
    print(BInt(2).power(10))                     # Power: 1024
    print(BInt(2) ** 10)                         # Power (using ** operator): 1024
    
    # === Comparison ===
    print(a > b)                                   # Greater than: True
    print(a == BInt("12345678901234567890"))     # Equality: True
    print(a.is_zero())                             # Check for zero: False
    
    # === Type Conversions ===
    print(a.to_str())                              # To string: "12345678901234567890"
    
    # === Sign Handling ===
    print(-a)                                      # Negation: -12345678901234567890
    print(abs(BInt("-12345678901234567890")))    # Absolute value: 12345678901234567890
    print(a.is_negative())                         # Check if negative: False

    # === Extremely large numbers ===
    # 3600 digits // 1800 digits
    print(BInt("123456789" * 400) // BInt("987654321" * 200))
```

[^fixed]: The `Decimal` type can represent values with up to 29 significant digits and a maximum of 28 digits after the decimal point. When a value exceeds the maximum representable value (`2^96 - 1`), DeciMojo either raises an error or rounds the value to fit within these constraints. For example, the significant digits of `8.8888888888888888888888888888` (29 eights total with 28 after the decimal point) exceeds the maximum representable value (`2^96 - 1`) and is automatically rounded to `8.888888888888888888888888889` (28 eights total with 27 after the decimal point). DeciMojo's `Decimal` type is similar to `System.Decimal` (C#/.NET), `rust_decimal` in Rust, `DECIMAL/NUMERIC` in SQL Server, etc.
[^integer]: The BigInt implementation uses a base-10 representation for users (maintaining decimal semantics), while internally using an optimized base-10^9 storage system for efficient calculations. This approach balances human-readable decimal operations with high-performance computing. It provides both floor division (round toward negative infinity) and truncate division (round toward zero) semantics, enabling precise handling of division operations with correct mathematical behavior regardless of operand signs.
[^arbitrary]: Built on top of our completed BigInt implementation, BigDecimal will support arbitrary precision for both the integer and fractional parts, similar to `decimal` and `mpmath` in Python, `java.math.BigDecimal` in Java, etc.
