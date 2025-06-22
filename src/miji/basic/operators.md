# Operators and assignment

> Sugar is good, but bad.  
> -- Yuhao Zhu, *Gate of Heaven*

Operators are symbols that perform operations on one or more operands. They are fundamental building blocks of any programming language, including Mojo and Python. Operators allow you to perform calculations, comparisons, logical operations, and more.

The Mojo's operators and assignment expressions are very similar to Python's. If you are already familiar with Python, just scan through this chapter and focus on the differences.

[[toc]]

## Operators

In Python, we have arithmetic operators (`+`, `-`, `*`, `/`, `%`, `**`), comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`), logical operators (`and`, `or`, `not`), bitwise operators (`&`, `|`, `^`, `~`), and assignment operators (`=`, `+=`, `-=`, etc.).

Mojo starts from **exactly the same operator system** from Python (Horary!). The operators have the same meaning and functionality. The **operator precedence and associativity** are also the same in both languages.

Moreover, there some additional operators in Mojo that are not available in Python. These operators are used to support Mojo's unique features.

The following table summarizes the most important operators in Mojo, ranking from highest to lowest precedence. Within the same precedence level, the operators associativity is applied from left to right, except for the exponentiation operator `**`, which is right associative, e.g., `2**3**4` is evaluated as `2**(3**4)`.

| Operator                                                         | Description                                                             | Dunder                                                                       | Notes                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| `()`                                                             | Parentheses                                                             |                                                                              |                                               |
| `x[]`                                                            | De-referencing (a pointer)                                              |                                                                              | **Not in Python**; equivalent to `*x` in Rust |
| `x[i]`, `x[i:j]`, `x[i:j:k]`                                     | Indexing (subscription) and slicing                                     | `__getitem__()`                                                              |                                               |
| `**`                                                             | Power (exponentiation)                                                  | `__pow__()`                                                                  |                                               |
| `-x`, `~x`                                                       | Negative and bitwise not                                                | `__neg__()`, `__invert__()`                                                  |                                               |
| `*`, `@`, `/`, `//`, `%`                                         | Multiplication, matrix multiplication, division, floor division, modulo | `__mul__()`, `__matmul__()`,  `__truediv__()`, `__floordiv__()`, `__mod__()` |                                               |
| `+`, `-`                                                         | Addition and subtraction                                                | `__add__()`, `__sub__()`, `__radd__()`, `__rsub__()`                         |                                               |
| `<<`, `>>`                                                       | Bitwise left and right shift                                            | `__lshift__()`, `__rshift__()`                                               |                                               |
| `&`                                                              | Bitwise and                                                             |                                                                              |                                               |
| `^`                                                              | Bitwise exclusive or                                                    |                                                                              |                                               |
| `\|`                                                             | Bitwise or                                                              |                                                                              |                                               |
| `in`, `not in`, `is`, `is not`, `<`, `<=`, `>`, `>=`, `==`, `!=` | Comparisons                                                             | `__lt__()`, `__le__()`, `__gt__()`, `__ge__()`, `__eq__()`, `__ne__()`       |                                               |
| `not x`                                                          | Boolean not (unary)                                                     |                                                                              |                                               |
| `and`                                                            | Boolean and (binary)                                                    |                                                                              |                                               |
| `or`                                                             | Boolean or (binary)                                                     |                                                                              |                                               |
| `y if x else z`                                                  | Conditional expression (ternary)                                        |                                                                              |                                               |

Similar to Python, Mojo also supports **operator overloading**. You can define custom behavior for operators by implementing the corresponding dunder methods in your structs. We will cover this topic in more detail in Chapter [Structs](../basic/structs) and Chapter [Generic](../advanced/generic.md).

## Chained comparison

In Mojo, you can chain comparison operators (e.g., `>`, `<`, `>=`, `<=`, `==`, `!=`) together, similar to Python. For example, `(a < b) and (b < c)` can be written as `a < b < c`. This feature is known as **chained comparison**.

More specifically, the compiler will do the following transformation when it sees a chained comparison:

`a operator1 b operator2 c` => `(a operator1 b) and (b operator2 c)`

The chained comparison can be extended to even more than operands. The compiler will compare each consecutive pair of operands and then combine the results with `and`s. For example, `a < b < c < d < e` will be transformed into `(a < b) and (b < c) and (c < d) and (d < e)`.

::: danger Chained comparison: Syntax sugar or poison?

I would say that I love almost every piece of Python syntax, except for two things: (1) no optional block ending keyword and (2) chained comparison.

Some people may find chained comparison a very sweet and useful syntax sugar. For example, you can use `a < b < c` instead of writing `(a < b) and (b < c)`, which is more concise. Other people, including me, may find this syntax sugar rather toxic, which may cause confusion and unintended behavior. For example, the following code may not behave as you expect:

```mojo
print(True == False == False)
```

Since the two `==` operators are of the same precedence, you may naturally think that the code will be evaluated from left to right as `(True == False) == False`, which is then evaluated as `False == False`, resulting in `True`.

However, the output is actually `False` (in both Python and Mojo). Why?

This is because `==` is also a comparison operator, and the chained comparison will be applied here. The expression `True == False == False` will first be transformed into `(True == False) and (False == False)`, which is then evaluated as `False and True`, resulting in `False`.

This phenomenon can be confusing, especially when you previously programmed in other languages that do not support chained comparison. So you need to be very careful when using chained comparison in Mojo. If you are not sure, always use parentheses to make the order of evaluation explicit, e.g., `(True == False) == False`.

:::

## Assignment expressions

Mojo's assignment expressions are also similar to Python's, with one more operator for transfer of ownership. Below is a summary of the assignment expressions in Mojo. Note that the dunders for the augmented assignment operators starts with `i`, which stands for "in-place".

| Operator              | Description                           | Dunder            | Notes                                                         |
| --------------------- | ------------------------------------- | ----------------- | ------------------------------------------------------------- |
| `y = x`               | Assignment                            | `__copyinit__()`  | Different from Python. It copies values instead of references |
| `y = x^`, `y = f(x^)` | Assignment with transfer ownership    | `__moveinit__()`  | **Not available in Python**, similar to `x = y` in Rust       |
| `y += x`              | Augmented assignment (addition)       | `__iadd__()`      |                                                               |
| `y -= x`              | Augmented assignment (subtraction)    | `__isub__()`      |                                                               |
| `y *= x`              | Augmented assignment (multiplication) | `__imul__()`      |                                                               |
| `y /= x`              | Augmented assignment (division)       | `__itruediv__()`  |                                                               |
| `y //= x`             | Augmented assignment (floor division) | `__ifloordiv__()` |                                                               |

We can see that Mojo has an additional assignment operator `x = y^`, which is used to transfer ownership of the value from `y` to `x`. This operator is not available in Python, but it is very useful in Mojo especially when we want to avoid excessive copying of large data structures. This is an advanced feature and you do not need to use it in most cases. We will cover this topic in more detail in Section ["copyinit" vs "moveinit"](../advanced/ownership#copyinit-vs-moveinit)
of Chapter [Ownership](../advanced/ownership.md).
