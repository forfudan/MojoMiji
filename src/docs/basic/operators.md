# Operators

Operators are symbols that perform operations on one or more operands. They are fundamental building blocks of any programming language, including Mojo and Python. Operators allow you to perform calculations, comparisons, logical operations, and more.

[[toc]]

## Overview

In Python, we have arithmetic operators (`+`, `-`, `*`, `/`, `%`, `**`), comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`), logical operators (`and`, `or`, `not`), bitwise operators (`&`, `|`, `^`, `~`), and assignment operators (`=`, `+=`, `-=`, etc.). In Mojo, we have **exactly the same operators** as in Python. They have the same meaning and functionality. Moreover, the **operator precedence and associativity** are also the same in both languages.

## Chained comparison

In Mojo, you can chain comparison operators (e.g., `>`, `<`, `>=`, `<=`, `==`, `!=`) together, similar to Python. For example, `(a < b) and (b < c)` can be written as `a < b < c`. This feature is known as **chained comparison**.

More specifically, the compiler will do the following transformation when it sees a chained comparison:

`a operator1 b operator2 c` => `(a operator1 b) and (b operator2 c)`

The chained comparison can be extended to even more than operands. The compiler will compare each consecutive pair of operands and then combine the results with `and`s. For example, `a < b < c < d < e` will be transformed into `(a < b) and (b < c) and (c < d) and (d < e)`.

::: danger Syntax sugar or poison?

Some people may find this syntax sugar very sweet helpful. For example, you can use `a < b < c` instead of writing `(a < b) and (b < c)`, which is more concise. Other people, including me, may find this syntax sugar toxic. It may cause confusion and unintended behavior. For example, the following code may not behave as you expect:

```mojo
print(True == False == False)
```

Since the two `==` operators are of the same precedence, you may naturally think that the code will be evaluated from left to right as `(True == False) == False`, which is then evaluated as `False == False`, resulting in `True`.

However, the output is actually `False` (in both Python and Mojo). Why?

This is because `==` is also a comparison operator, and the chained comparison will be applied here. The expression `True == False == False` will first be transformed into `(True == False) and (False == False)`, which is then evaluated as `False and True`, resulting in `False`.

This phenomenon can be confusing, especially when you previously programmed in other languages that do not support chained comparison. So you need to be very careful when using chained comparison in Mojo. If you are not sure, always use parentheses to make the order of evaluation explicit, e.g., `(True == False) == False`.

:::
