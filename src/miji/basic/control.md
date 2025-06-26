# Control flows

> I shouldn't need to remind you of the same task every day.  
> -- Yuhao Zhu, *Gate of Heaven*

It would be interesting to imagine a world where most of the programming languages are line-oriented where you have to write "go back to Line 10" to repeat a task, or "advance to Line 20" to skip a task. Luckily, we have control flows where you can encapsulate the logic of repeating or skipping tasks in a more human-readable way.

There are three main types of control flows in Python: loops, conditionals, and exceptions. Mojo, being a Python-like language, also supports these control flows with almost the same logic and syntax. In this section, we will cover the first two types of control flows: loops and conditionals. Exceptions will be covered in a later chapter.

For Pythonistas, you can quickly scan this chapter and jump to the exercises because the concepts in this chapter are very similar to Python's control flows. You may still need to pay attention to some blocks marked in yellow or red colors, which indicate the differences between Mojo and Python.

::: info Compatible Mojo version

This chapter is compatible with Mojo v25.4 (2025-06-18).

:::

[[toc]]

## Conditionals

### if-elif-else syntax

Conditionals are used to execute a block of code only if a certain condition is met. In Mojo, conditionals are implemented with the `if ... elif ... else ...` syntax, which is **identical** to Python's syntax. The complete syntax of a conditional in Mojo is as follows:

```mojo
if condition1:
    # do something if condition1 is True
    ...
elif condition2:
    # do something if condition2 is True
    ...
elif condition3:
    # do something if condition3 is True
    ...
...
else:
    # do something if both conditions are False
    ...
```

Here are some key points to note about the syntax:

1. The `condition1`, `condition2`, `condition3`, etc., should be **expressions** that evaluate to a boolean value, i.e., `True` or `False`. Of course, they can also be boolean values directly, e.g., `if True:`.
1. The conditions do not need to be mutually exclusive, meaning that multiple conditions can be `True` at the same time. In this case, the first `True` condition will be executed, and the rest will be skipped.
1. If no conditions are `True`, then the final `else:` block will be executed.
1. The `if` keyword is mandatory, while the `elif` and `else` keywords are optional. You can have an `if` statement without any `elif` or `else` blocks, or you can have multiple `elif` blocks without an `else` block, or you can have an `else` block without any `elif` blocks.

Let's see several examples of conditionals in both Mojo and Python. The first example is a simple program that checks if a number is positive, negative, or zero:

::: code-group

```mojo
def judge_sign(number: Int) -> None:
    if number > 0:
        print(number, "is a positive.")
    elif number < 0:
        print(number, "is a negative.")
    else:
        print("The number is zero.")

def main():
    judge_sign(10)
    judge_sign(-5)
    judge_sign(0)
```

```python
def judge_sign(number: int) -> None:
    if number > 0:
        print(number, "is a positive.")
    elif number < 0:
        print(number, "is a negative.")
    else:
        print("The number is zero.")

def main():
    judge_sign(10)
    judge_sign(-5)
    judge_sign(0)

main()
```

:::

---

The next example is a program that checks if a string is either `a`, `b`, or `c`. If yes, then it prints the string. For this example, we need use an `if` statement and two `elif` statements, but no `else` statement:

::: code-group

```mojo
# src/basic/controls/conditional_without_else.mojo
def check_string(s: String) -> None:
    if s == "a":
        print("The string is 'a'.")
    elif s == "b":
        print("The string is 'b'.")
    elif s == "c":
        print("The string is 'c'.")

def main():
    check_string("a")
    check_string("b")
    check_string("c")
    check_string("d")

# End of the code
```

```python
# src/basic/controls/conditional_without_else.py
def check_string(s: str) -> None:
    if s == "a":
        print("The string is 'a'.")
    elif s == "b":
        print("The string is 'b'.")
    elif s == "c":
        print("The string is 'c'.")

def main():
    check_string("a")
    check_string("b")
    check_string("c")
    check_string("d")

main()
```

:::

Running the above code will give you the output:

```console
The string is 'a'.
The string is 'b'.
The string is 'c'.
```

Since there is no `else` statement, the program does not print anything for the string `"d"` because it does not match any of the conditions.

---

The final example is a program that checks if a number is even or odd. If the number is even, it prints the number and the message "is an even number". If the number is odd, it prints the number and the message "is an odd number". In this case, we only need an `if` statement and an `else` statement, while the `elif` statement is not needed:

:::code-group

```mojo
# src/basic/controls/conditional_without_elif.mojo
def check_even_or_odd(number: Int) -> None:
    if number % 2 == 0:
        print(number, "is an even number.")
    else:
        print(number, "is an odd number.")

def main():
    check_even_or_odd(24123)
    check_even_or_odd(1982)
    check_even_or_odd(-123)

# End of the code
```

```python
# src/basic/controls/conditional_without_elif.py
def check_even_or_odd(number: int) -> None:
    if number % 2 == 0:
        print(number, "is an even number.")
    else:
        print(number, "is an odd number.")

def main():
    check_even_or_odd(24123)
    check_even_or_odd(1982)
    check_even_or_odd(-123)

main()
```

:::

Running the above code will give you the output:

```console
24123 is an odd number.
1982 is an even number.
-123 is an odd number.
```

### Non-exhaustive conditionals

::: warning Non-exhaustive conditionals - Mojo vs Python

Python is a dynamically typed language, so it does not require that the type of function return value is consistent with the function's return type annotation. Thus, conditionals in Mojo is more stricter than Python's conditionals. This may occasionally lead to compilation errors in Mojo when you do not handle all possible cases in a conditional statement. You should be aware of this difference so that you won't be surprised by the compilation errors in Mojo when the similar code in Python runs without any issues.

:::

In the example above where we check if a string is either `a`, `b`, or `c`, we did not handle the case where the string is **not** one of these three values. This is called a **non-exhaustive conditional**, meaning that there are some cases that are not handled by the conditional statements.

While it is not a problem in the case above, however, it may cause issues in other cases, especially when you are writing a function that is supposed to return a value. If you do not exhaustively handle all possible cases, the function may return `None` implicitly, which is in consistent with the function's return type. This can lead to unexpected behavior and bugs in your code.

For example, if we modify the `check_string` function to **return a string** instead of printing it, the code would be as follows:

```mojo
# src/basic/controls/conditional_without_else.mojo
# This code will not compile
def check_string(s: String) -> String:
    if s == "a":
        return "The string is 'a'."
    elif s == "b":
        return "The string is 'b'."
    elif s == "c":
        return "The string is 'c'."


def main() -> None:
    print(check_string("a"))
    print(check_string("b"))
    print(check_string("c"))
    print(check_string("d"))
```

This code will not compile and will give you an error message like this:

```console
error: return expected at end of function with results
def check_string(s: String) -> String:
    ^
```

This is because the function `check_string` is expected to return a `String` value, but it does not handle the case where the input string is not one of `a`, `b`, or `c`. Therefore, the compiler raises an error to remind you that you need to handle all possible cases.

To fix this issue, you can add an `else` statement at the end of the conditional to handle the case where the input string is not one of `a`, `b`, or `c`. The modified code would be as follows:

```mojo
# src/basic/controls/conditional_without_else_fix.mojo
def check_string(s: String) -> String:
    if s == "a":
        return "The string is 'a'."
    elif s == "b":
        return "The string is 'b'."
    elif s == "c":
        return "The string is 'c'."
    else:
        return "The string is not 'a', 'b', or 'c'."

def main() -> None:
    print(check_string("a"))
    print(check_string("b"))
    print(check_string("c"))
    print(check_string("d"))

# End of the code
```

This time, the code will compile and run successfully, giving you the output:

```console
The string is 'a'.
The string is 'b'.
The string is 'c'.
The string is not 'a', 'b', or 'c'.
```

Therefore, this is a good practice to ensure that your function handles all possible cases and returns a consistent type of value. **Do not omit the `else` statement** if you are writing a function that is supposed to return a value, even if you think it is not necessary.

---

If you are a Pythonista, you may find that the example above is not a problem in Python. Yes, indeed, if we run the same code in Python, it will run without any issues. Let's try:

```py
# src/basic/controls/conditional_without_else.py
def check_string(s: str) -> str:
    if s == "a":
        return "The string is 'a'."
    elif s == "b":
        return "The string is 'b'."
    elif s == "c":
        return "The string is 'c'."

def main():
    print(check_string("a"))
    print(check_string("b"))
    print(check_string("c"))
    print(check_string("d"))

main()
```

This code will run successfully and give you the output:

```console
The string is 'a'.
The string is 'b'.
The string is 'c'.
None
```

Note that the last line prints `None`. This is because the function `check_string` does not handle the case where the input string is not one of `a`, `b`, or `c`, so it implicitly returns the `None` value. As Python is a dynamically typed language, it does not require that the return type of the function is consistent with the function's return type annotation. If there is inconsistency, the actual return type will prevail over the type annotation, and the function will return `None` for `check_string("d")`.

Thus, in the above Python code, you actually provided a wrong type annotation for the return type of the function `check_string`. It should be `str | None` instead of `str`, because there is a case where the function does not return a string, but `None`.

This is the disadvantage of Python's dynamic typing system. On the one hand, it allows you to write code more flexibly without worrying about errors during runtime. On the other hand, it may lead to unexpected behavior and bugs in your code if you do not handle all possible cases properly. In this example, Python fails to warn you that you would get something that is not what you expected.

Mojo, being a statically typed language, requires that the return type of the function is consistent with the function's return type annotation. Although this may seem a bit strict, it actually helps you to catch potential bugs and errors early during compile time, rather than tolerate them and pass them down to the next steps until the issue finally triggers some big problems.

Maybe next time you program in Python, you will think about this example and realize that you should **handle all possible cases** in your code, even if Python does not require you to do so. You can also use some **type checkers** like `mypy` to help you catch such issues in Python code. This is after all a good practice to ensure that your code is robust and reliable.

### One-liner conditionals

In Mojo, you can also write conditionals in a single line that will evaluate to a value. This is called a **one-liner conditional expression**. The syntax is similar to Python's one-liner expression:

```mojo
value_when_true if condition else value_when_false
```

This expression is equivalent to the following `if ... else ...` statement:

```mojo
if condition:
    value_when_true
else:
    value_when_false
```

Note that the `value_when_true` and `value_when_false` can be any valid Mojo **expression**, including variables, literals, or function calls. The `condition` should also be a valid Mojo expression that evaluates to a **boolean** value.

Moreover, when you use a one-liner conditional expression, you cannot use the `elif` statement.

Below is an example of a one-liner conditional expression in both Mojo and Python.

::: code-group

```mojo
# one_liner_conditional_expression.mojo
def main():
    var a = 10
    var b = "sunny"
    var c = "apple"

    var judge_sign = "negative" if a < 0 else "non-negative"
    var judge_weather = "nice" if b == "sunny" else "not nice"
    print(judge_sign)
    print(judge_weather)

    print("I am apple") if c == "apple" else print("I am not apple")

# End of the code
```

```python
# one_liner_conditional_expression.py
def main():
    a = 10
    b = "sunny"

    judge_sign = "negative" if a < 0 else "non-negative"
    judge_weather = "nice" if b == "sunny" else "not nice"

    print(judge_sign)
    print(judge_weather)

    print("I am apple") if c == "apple" else print("I am not apple")

main()
```

:::

Running the above code will give you the output:

```console
non-negative
nice
I am apple
```

In this example, we use a one-liner conditional expression to determine whether the variable `a` is negative or non-negative, and whether the variable `b` is sunny or not. The results of the one-liners are assigned to the variables `judge_sign` and `judge_weather`, respectively. We then print these variables to see the results.

Moreover, we also use a one-liner conditional expression to print a message based on the value of the variable `c`. This is because the `print()` function implicitly returns the `None` value, and thus it is a valid expression to be used in a one-liner conditional.

## For loops

Loops are used to repeat a block of code for a finite (or indefinite) number of times. Mojo supports two types of loops: `for` loops and `while` loops.

In a for loop, we **iterate** over an iterable object, and each time, we execute a block of code. Several points to note:

1. **Iterate** means to go through each element of something one by one.
1. **Iterable** is an object that is able to be iterated. Usually, it contains a finite number of elements and can be sequentially accessed, such as a list, tuple, or string.
1. When you iterate over an iterable, an **iterator** is created behind the scenes. This iterator will give you one element at a time from the iterable until there are no more elements left.

It sounds like a lot of jargon, but don't worry, we will explain iterables and iterators in detail in a [later section below](#iterables-and-iterators). For now, you can use the metaphors in the following table to understand these three terms:

| Term     | Description                                                  | Metaphor                                                   |
| -------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Iterate  | Go through each element of an object one by one              | **Inspecting** each product as it arrives at your location |
| Iterable | An object with some elements that is able to be gone through | The **warehouse** of products waiting to be processed      |
| Iterator | A tool that give you one element at a time from the iterable | The **conveyor belt** that delivers one item at a time     |

The complete syntax of a for loop in Mojo is as follows:

```mojo
for item in iterable:
    # do something (with or without the item)
    ...
    # Under some conditions
    break # optional, to exit the loop early
    ...
    # Under some conditions
    continue # optional, to skip the rest of the loop and continue with the next iteration
    ...
else:
    # optional, this block will be executed if the loop is not exited early
    ...
```

### for-in syntax

Let's begin with the `for ... in ...` syntax. The `for in` syntax is used to iterate over an iterable object, such as a list, tuple, or string. It can be used to simplify the code block that is repeated for several times. The syntax is **identical** to Python's `for ... in ...` syntax, so it should be familiar to you.

For example, let's say you want to calculate the sum of all items in a list of floating-point numbers, `[1.1, 2.2, 3.3, 4.4, 5.5]`. If you do not use a for loop, you need to write the following code:

::: code-group

```mojo
# src/basic/controls/sum_of_list_of_floats_without_loop.mojo
def main():
    var total = 0.0
    var numbers = [1.1, 2.2, 3.3, 4.4, 5.5]

    total += numbers[0]
    total += numbers[1]
    total += numbers[2]
    total += numbers[3]
    total += numbers[4]

    print("The sum of all items = ", total)
```

```py
# src/basic/controls/sum_of_list_of_floats_without_loop.py
def main():
    total = 0.0
    numbers = [1.1, 2.2, 3.3, 4.4, 5.5]

    total += numbers[0]
    total += numbers[1]
    total += numbers[2]
    total += numbers[3]
    total += numbers[4]

    print("The sum of all items = ", total)

main()
```

:::

This code is not very efficient and is not scalable. If you want to sum up a list with 1000 items, you will have to write 1000 lines of code, which is not practical.

Since we are iterating over the list of numbers and taking out each element one by one, we can then use a for loop to simplify the code. Below is the equivalent code using a for loop in both Mojo and Python:

::: code-group

```mojo
# src/basic/controls/sum_of_list_of_floats.mojo
def main():
    var total = 0.0
    var numbers = [1.1, 2.2, 3.3, 4.4, 5.5]
    for number in numbers:
        total += number
    print("The sum of all items = ", total)

# End of the code
```

```python
# src/basic/controls/sum_of_list_of_floats.py
def main():
    total = 0.0
    numbers = [1.1, 2.2, 3.3, 4.4, 5.5]
    for number in numbers:
        total += number
    print("The sum of all items = ", total)

main()
```

:::

Running the above code will give you the output: ```The sum of all items =  16.5```

Let's break down the Mojo code and see how it works in Mojo internally:

1. `var total = 0.0` initializes a variable with the name `total`, the type `Float64` (default type for floating-point numbers in Mojo), and the initial value `0.0`. The [life time](../advanced/lifetimes.md) (valid scope) of this variable is from this line to the last line of the main function.
1. `var numbers = [1.1, 2.2, 3.3, 4.4, 5.5]` initializes a variable with the name `numbers`, the type `List[Float64]`, and the initial value `[1.1, 2.2, 3.3, 4.4, 5.5]`. The type of the list is inferred from the literal values  in the list. The life time of this variable is also from this line to the second last line of the main function because we do not use it after the for loop.
1. `for number in numbers:` means three things:
    1. Create an **iterator** from the `numbers` list in the background. This iterator is of the `ListIterator` type. It is able to return one element of the list at a time.
    1. Define a local variable `number` as a immutable **reference** to the current element of the iterator. The variable `number` shares the same type, same memory address, and same value as the current element of the list.
    1. Start the iteration until all elements of the list are iterated over.
1. `total += number` adds the value of `number` to the `total` variable in each iteration.
1. The variable `number` is destroyed after the for loop ends, and the iterator in the background is also destroyed.
1. `print("The sum of all items = ", total)` prints the final value of `total`, which is `16.5`.

Thus, the iterations in the above code can be expanded as follows:

```mojo
# src/basic/controls/sum_of_list_of_floats_without_loop.mojo
def main():
    var total = 0.0
    var numbers = [1.1, 2.2, 3.3, 4.4, 5.5]

    # Expand the for loop to show how it works internally
    var ref number = numbers[0]
    total += number
    number = numbers[1]
    total += number
    number = numbers[2]
    total += number
    number = numbers[3]
    total += number
    number = numbers[4]
    total += number
    # End of the expansion

    print("The sum of all items = ", total)
```

### `break` and `else` keywords

The `break` keyword is used to exit the **current** loop early. When the `break` statement is triggered, the **current** loop will stop immediately and the program will **skip everything** defined in the **current** `for ... in ...:` block and the `else:` block.

The `else` keyword is used to define a block of code that will be executed after the for loop **successfully** iterates over all elements of the iterable and is not exited early by a `break` statement. Let's see an example in both Mojo and Python:

::: code-group

```mojo
# src/basic/controls/break_and_else_statement_in_for_loop.mojo
def main():
    var my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
    else:
        print("Loop completed without break!")

    for i in my_list:
        if i == 3:
            break
        print(i, end=" ")
    else:
        print("Loop completed without break!")

# End of the code
```

```python
# src/basic/controls/break_and_else_statement_in_for_loop.py
def main():
    my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
    else:
        print("Loop completed without break!")

    for i in my_list:
        if i == 3:
            break
        print(i, end=" ")
    else:
        print("Loop completed without break!")

main()
```

:::

Running the above code will give you the output:

```console
1 2 3 4 5 Loop completed without break!
1 2
```

In the first for loop, we iterate over all elements of `my_list` and print them. After the loop, the `else:` block is executed, printing "Loop completed without break!" because the loop was not exited early.

In the second for loop, we iterate over the same list, but when we reach the element `3`, we trigger the `break` statement. This exits the loop early, and the `else:` block is skipped, so "Loop completed without break!" is not printed.

### `break` nested loops

You may wonder, what would the `break` keyword behave if we have nested loops? In Mojo, the `break` statement will only exit the **innermost** loop (**current** loop) that contains the `break` statement. This is similar to Python's behavior. Let's see an example:

```mojo
# src/basic/controls/break_and_else_statement_in_for_loop.mojo
def main():
    var my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        if i == 5:
            break
        for j in my_list:
            if j == 3:
                break
            print("i =", i, "j =", j)
        else:
            print("Inner loop completed without break!")
    else:
        print("Outer loop completed without break!")
```

This code will output:

```console
i = 1 j = 1
i = 1 j = 2
i = 2 j = 1
i = 2 j = 2
i = 3 j = 1
i = 3 j = 2
i = 4 j = 1
i = 4 j = 2
```

In this example, we have two nested for loops. The outer loop iterates over `my_list`, and the inner loop also iterates over `my_list`. When `j` reaches `3`, the inner loop is exited early due to the `break` statement, but the **outer loop continues** to iterate until `i` reaches `5`, at which point the outer loop is exited early as well.

Since the inner loop and the outer loop both exited early, the `else:` blocks for both loops are not executed.

### `continue` keyword

The `continue` keyword is used to skip the rest of the **current** iteration and continue with the next iteration of the loop. It is useful when you want to skip **certain elements** in the iterable without exiting the complete loop. Let's see an example where we calculate the square of each number in a list, but skip the even numbers:

```mojo
# src/basic/controls/continue_in_for_loop.mojo
def main():
    var my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        if (i == 2) or (i == 4):  # Skip even numbers
            continue
        print(i, "*", i, "=", i * i)
    else:
        print("Loop completed successfully without early exit!")
```

Running the above code will give you the output:

```console
1 * 1 = 1
3 * 3 = 9
5 * 5 = 25
Loop completed successfully without early exit!
```

In this example, we iterate over `my_list` and check if the current number is even. If it is, we use the `continue` statement to skip the rest of the loop body for that **single iteration** and go to the next iteration. As a result, only the odd numbers are printed along with their squares.

Note that, the `continue` keyword only skips some iterations of the loop, but not the entire loop. Therefore, the loop is still considered to have completed successfully, and the `else:` block is executed after the loop.

### `range()` function

The `range()` function is a built-in function in Mojo that generates an **iterator** which gives you a number at a time from a sequence of numbers. For example, `range(5)` will generate an iterator that gives you the numbers `0`, `1`, `2`, `3`, and `4` one by one. This is similar to Python's `range()` function.

The `range()` function is helpful when you want to count from `0` to a certain number or you want to repeat a certain task for a specific number of times. An example of the `range()` function in both Mojo and Python is as follows:

::: code-group

```mojo
# src/basic/controls/range_function.mojo
def main():
    for i in range(5):
        print(i, "*", i, "=", i * i)

    for _j in range(3):
        print("Important message shall be repeated three times.")

# End of the code
```

```python
# src/basic/controls/range_function.py
def main():
    for i in range(5):
        print(i, "*", i, "=", i * i)

    for _j in range(3):
        print("Important message shall be repeated three times.")

main()
```

:::

Running the above code will give you the output:

```console
0 * 0 = 0
1 * 1 = 1
2 * 2 = 4
3 * 3 = 9
4 * 4 = 16
Important message shall be repeated three times.
Important message shall be repeated three times.
Important message shall be repeated three times.
```

In the first for loop, we use `range(5)` to generate an iterator that gives us the numbers `0`, `1`, `2`, `3`, and `4`. We then print the square of each number.

In the second for loop, we use `range(3)` to generate an iterator that gives us the numbers `0`, `1`, and `2`. However, we do not use these numbers in the loop body but just use it as a **counter** to repeat the printing task three times. Because the variable `_j` is not used, we attach a underscore `_` to the variable name to indicate that it is a **disposable variable**.

The `range()` function can also take two or three arguments to specify the start, stop, and step values. For example, `range(2, 6)` will generate an iterator that gives you the numbers `2`, `3`, and `6`, and `range(1, 10, 2)` will generate an iterator that gives you the numbers `1`, `3`, `5`, `7`, and `9`. Note that the `stop` value is never included in the generated sequence.

## While loops

A `while` loop is used to repeat a block of code as long as a condition is met. If the condition is not met anymore, the loop will stop and the program will continue to execute the code after the loop. The syntax of a while loop in Mojo is as follows:

```mojo
while condition:
    # do something
    ...
    # Under some conditions
    break # optional, to exit the loop early
    ...
    # Under some conditions
    continue # optional, to skip the rest of the loop and continue with the next iteration
    ...
```

### `while` syntax

Let's begin with the simplest `while` loop syntax:

```mojo
while condition:
    # do something
```

The "condition" after the `while` keyword is a **boolean expression** that evaluates to `True` or `False`. If the expression is `True`, the we say that the condition is **met** and the loop will execute the code block inside the loop body. After the code block is finished, we will come again to the `while` statement and re-evaluate the condition. If the expression is still `True`, the loop will continue to execute the code block again. This process will repeat until the condition becomes `False`.

Let's demonstrate the `while` loop with an example in both Mojo and Python. We will write a program that counts from `0` to `4` and prints each number:

::: code-group

```mojo
# src/basic/controls/print_integers_with_while.mojo
def main():
    var i = 0
    while i < 5:
        print(i)
        i += 1  # Increment i by 1
    print("Loop completed successfully!")

# End of the code
```

```python
# src/basic/controls/print_integers_with_while.py
def main():
    i = 0
    while i < 5:
        print(i)
        i += 1  # Increment i by 1
    print("Loop completed successfully!")

main()
```

:::

Yes, the syntax of the `while` loop in Mojo is identical to Python's `while` loop syntax, so it should be familiar to you. The above code will output:

```console
0
1
2
3
4
Loop completed successfully!
```

### `break`, `continue`, and `else` keywords

The `break` and `continue` keywords in a `while` loop work similarly to those in a `for` loop. The `break` keyword is used to exit the **current** loop early, while the `continue` keyword is used to skip the rest of the **current** iteration and continue with the next iteration.

The `else` keyword in a `while` loop is also similar to that in a `for` loop. It defines a block of code that will be executed after the while loop **successfully** iterates until the **condition is no longer met**. If the loop is exited early by a `break` statement, the `else` block will be skipped.

### When are while loops more suitable

Both `for` loops and `while` loops have their own use cases and advantages, even though for loops can always be replaced by an equivalent while loop. Generally, we have the following guidelines:

- **For loops** are typically better suited if you know the exact number of iterations you want to perform, or if you are iterating over a **finite** iterable (*e.g.*, list, string, range, *etc*). It saves you from manually initializing and incrementing the loop variable.
- **While loops** are typically more appropriate when you do not know the exact number of iterations in advance, or when you are dealing with an interactive situation, or when the loop condition is too complex to fit into an expression.

I will give you three examples to illustrate when to use a `for` loop and when to use a `while` loop.

---

In the first example, we use both a `for` loop and a `while` loop to print the odd numbers from `1` to `10`. Below is an example:

```mojo
# src/print_odd_numbers_with_for_and_while.mojo

def main():
    # for loop
    print("Odd numbers from 1 to 10 using for loop:")
    for i in range(1, 11):
        if i % 2 == 1:
            print(i, end=" ")

    # while loop
    print("\nOdd numbers from 1 to 10 using while loop:")
    var i = 1
    while i < 10:
        if i % 2 == 1:
            print(i, end=" ")
        i += 1  # Increment i by 1
```

This code will output:

```console
Odd numbers from 1 to 10 using for loop:
1 3 5 7 9 
Odd numbers from 1 to 10 using while loop:
1 3 5 7 9
```

Comparing two loops, we can see that, when you use a for loop, the `i` variable is automatically **initialized** and **incremented** until the end of the range is reached. On the contrary, when you use a while loop, you need to manually **initialize** the `i` variable before the loop and **increment** it inside the loop body. Moreover, you need to correctly set the **condition** to ensure that the loop will end at the correct point.

If you forget to increment the `i` variable in the while loop, it will lead to an **infinite loop**, which means that the loop will never end and the program will keep running forever. This is a very common mistake when using while loops, so you **should be careful** to ensure that the condition will eventually become `False` after a certain number of iterations.

Thus, in this case, the `for` loop is more concise and less error-prone than the `while` loop.

---

The next example is to write a program that continuously calculate $x_i = \frac{x_{i-1} + 1}{2}$ until $x_i$ is sufficiently close to $1$ (let's say with a tolerance of `0.0001`). In this case, we do not know how many iterations we will need to perform, so a `while` loop is more suitable. See the code below:

```mojo
# src/basic/controls/value_convergence.mojo
fn value_convergence(
    owned value: Float64,
    tolerance: Float64 = 0.01,
) -> Float64:
    while abs(value - 1) >= tolerance:
        value = (value + 1) / 2.0
        print("Current value:", value)
    return value

fn main():
    print("Converged value:", value_convergence(100.0, tolerance=0.0001))
```

If we run the above code, it will output:

```console
Current value: 50.5
Current value: 25.75
Current value: 13.375
Current value: 7.1875
Current value: 4.09375
Current value: 2.546875
Current value: 1.7734375
Current value: 1.38671875
Current value: 1.193359375
Current value: 1.0966796875
Current value: 1.04833984375
Current value: 1.024169921875
Current value: 1.0120849609375
Current value: 1.00604248046875
Current value: 1.003021240234375
Current value: 1.0015106201171875
Current value: 1.0007553100585938
Current value: 1.0003776550292969
Current value: 1.0001888275146484
Current value: 1.0000944137573242
Converged value: 1.0000944137573242
```

In total, we have 20 iterations to converge the value to `1.0000944137573242`, which is sufficiently close to `1` with a tolerance of `0.0001`. The `while` loop continues until the absolute difference between the current value and `1` is less than the specified tolerance.

Since we do not know how many iterations we will need to perform, we cannot use a `for` loop here, because a `for` loop requires a finite number of iterations to iterate over. In this case, a `while` loop is more suitable.

---

The last example is to write a program that ask the user to give a command to conduct a certain task, let's say, the user can give the following commands:

- "hi": Mojo will print "Hello, master!"
- "who": Mojo will print "I am Mojo, your loyal assistant!"
- "when": Mojo will print "I was born in the 2020s, and I am still growing!"
- For all other inputs: Mojo will print "I don't understand your command."

A code example may look like this:

```mojo
# src/basic/control/give_commands.mojo
def main():
    var input = input(
        "Please enter one of the following commands:\n(1) hi\n(2) who\n(3)"
        " when\nWaiting for your order: "
    )
    if input == "hi":
        print("Hello, master!")
    elif input == "who":
        print("I am Mojo, your loyal assistant!")
    elif input == "when":
        print("I was born in the 2020s, and I am still growing!")
    else:
        print("I don't understand your command.")
```

You can run the above code and give it a command. It will work as expected. However, there is a problem: the program will exit after you give a command. If you want to give another command, you have to run the program again.

To solve this problem, we can use a `while` loop to continuously ask the user for a command. Each time the user gives a command, we will check the command and execute the corresponding action, and then ask the user for the command again.

Moreover, we can also add some special conditions so that the user can exit the program, such as typing "bye" or "farewell". Below is the modified code:

```mojo
# src/basic/control/give_commands_with_while.mojo
def main():
    while True:
        var input = input(
            "Please enter one of the following commands:\n(1) hi\n(2) who\n(3)"
            " when\nIf you want to quit the program, enter 'bye' or"
            " 'farewell'\nWaiting for your order: "
        )
        print()
        if input == "hi":
            print("Hello, master!")
        elif input == "who":
            print("I am Mojo, your loyal assistant!")
        elif input == "when":
            print("I was born in the 2020s, and I am still growing!")
        elif input == "bye" or input == "farewell":
            print("Goodbye!")
            break
        else:
            print("I don't understand your command. Please try again.")

        print()
```

Running the above code will give you an interactive prompt where you can enter commands.

```console
Please enter one of the following commands:
(1) hi
(2) who
(3) when
If you want to quit the program, enter 'bye' or 'farewell'
Waiting for your order: 
```

If you enter "hi", "who", or "when", Mojo will respond accordingly and ask you for a new order. For example, if you enter "hi", it will output:

```console
Please enter one of the following commands:
(1) hi
(2) who
(3) when
If you want to quit the program, enter 'bye' or 'farewell'
Waiting for your order: hi

Hello, master!

Please enter one of the following commands:
(1) hi
(2) who
(3) when
If you want to quit the program, enter 'bye' or 'farewell'
Waiting for your order: 
```

If you enter "bye" or "farewell", Mojo will say goodbye and exit the program:

```console
Please enter one of the following commands:
(1) hi
(2) who
(3) when
If you want to quit the program, enter 'bye' or 'farewell'
Waiting for your order: farewell

Goodbye!
```

::: tip `while True:`

You may find the statement `while True:` in the above code somewhat strange. But it is a correct syntax in Mojo (and Python). Remember that the condition after the `while` keyword must be a expression that evaluates to `True` or `False`. Therefore, the value `True` is naturally a valid condition.

This condition is a common idiom when you want to create an infinite loop that will only be exited by a `break` statement under certain conditions, for example, in some interactive programs that requires users to give a series of commands until they decide to exit the program.

:::

### Avoid infinite loop with a counter

Sometimes, finding a proper condition to stop a `while` loop can be tricky, especially when you are dealing complex logics or numerical calculations. Your pre-set conditions after the `while` keyword or for the `break` statement may never be met.

For example, if we write a code to continuously calculate $x_i = \frac{x_{i-1} + 1}{2}$ until $x_i$ is sufficiently close to $0$, we may have the following code:

```mojo
# src/basic/control/value_not_converging.mojo
fn value_convergence(
    owned value: Float64, tolerance: Float64 = 0.01
) -> Float64:
    while value >= tolerance:
        value = (value + 1) / 2.0
        print("Current value:", value)
    return value

fn main():
    print("Converged value:", value_convergence(100.0, tolerance=0.0001))
```

Running the above code will causes a **infinite loop** because the value will converge to `1` instead of `0`. The condition `value >= tolerance` will never be met, and the loop will keep running forever.

::: tip Stop a running program

You can stop a running program in the terminal by pressing `Ctrl + C`. This is helpful when you encounter an infinite loop or a running process that you want to terminate immediately.

:::

In practice, we can use a variable to keep track of the number of iterations and stop the loop after a certain number of iterations. For example, we can modify the above code to stop the loop after `100` iterations:

```mojo
# src/basic/control/value_not_converging_but_break_after_some_steps.mojo
fn value_convergence(
    owned value: Float64, tolerance: Float64 = 0.01
) -> Float64:
    var counter = 0
    var max_steps = 100
    while value >= tolerance:
        value = (value + 1) / 2.0
        print("Current value:", value)

        if counter >= max_steps:
            print("Breaking after", max_steps, "steps.")
            break
        counter += 1
    return value


fn main():
    print("Converged value:", value_convergence(100.0, tolerance=0.0001))
```

Running the above code will output:

```console
# Omitting the first 90 lines for brevity
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Current value: 1.0
Breaking after 100 steps.
Converged value: 1.0
```

## More on loops

### For loops are special while loops

Note that every for loop can be replaced by an equivalent while loop. In other words, you can think of a for loop as a syntax sugar for a while loop.

Why? Let's recall what the syntax `for i in some:` does, assuming some is an iterable object with `100` items:

1. It create an **iterator** from the iterable object `some`.
1. It starts the iterations over the iterator. In each iteration:
   - It checks whether the `__has_next__()` method of the iterator returns `True`. If it does, it means there are still more items to iterate over. If it returns `False`, the loop ends.
   - It calls the `__next__()` method of the iterator to get the next item from the iterator and assigns it to the variable `i`.
   - It updates the internal status of the iterator (*e.g.*, a counter of the remaining items, or a counter of the current iteration).
   - It proceeds to the next iteration.

Since there is a **condition** and an **internal counter**, we can then replace the for loop with a while loop that checks the condition and updates the counter accordingly.

Below is an example of how to replace a for loop with a while loop in Mojo.

::: code-group

```mojo
# src/basic/control/
# loop_over_iterators_with_for.mojo
def main():
    var iterator = range(10)

    # You can also use `for i in range(10)`
    # Mojo automatically creates an iterator
    for i in iterator:
        print(i, "at", String(Pointer(to=i)))
```

```mojo
# src/basic/control/
# loop_over_iterators_with_while.mojo
def main():
    var iterator = range(10)

    # Replacement for the for loop
    while iterator.__has_next__():
        i = iterator.__next__()
        print(i, "at", String(Pointer(to=i)))
    # End of the replacement
```

:::

This replacement is **general** and can be applied to **any for loop** that iterates over an iterable object, such as a list, a string, or a range. For example, let's do this replacement for a list:

::: code-group

```mojo
def main():
    var numbers = [1, 2, 3, 4, 5]
    # Create a list iterator
    var iterator = numbers.__iter__()

    # You can also use `for i in numbers:`
    # Mojo automatically creates an iterator
    for i in iterator:
        print(i, "at", String(Pointer(to=i)))
```

```mojo
def main():
    var iterator = range(10)
    # Create a list iterator
    var iterator = numbers.__iter__()

    # Replacement for the for loop
    while iterator.__has_next__():
        ref i = iterator.__next__()
        print(i, "at", String(Pointer(to=i)))
    # End of the replacement
```

:::

### Do-until logic with while loops

Some programming languages provide a `do ... until` (or `repeat ... until`) loop that repeats a block of code until a condition is met. This logic is different from a while loop in that:

1. The condition is a **stopping** condition, meaning that the loop will continue to execute if the condition is **not met** (`False`) and will stop if the condition is **met** (`True`).
1. The condition is checked **after** the code block is executed, meaning that the code block will always be executed at least once.

Some people may find this logic more intuitive than a while loop, especially when a stopping trigger is more natural than a starting trigger.

Mojo, however, **does not** have a built-in `do ... until` loop syntax. Neither does Python. But we can **simulate this logic** using a while loop with a `break` statement. This is because `break` is also a way to exit the loop early.

For example, we want to find the first Fibonacci number that is greater than `1000`. In programming languages that support repeat-until logic, we can write the following code:

::: code-group

```ruby
# src/basic/control/repeat_until_in_ruby.rb
def main
  prev = 0
  curr = 1
  threshold = 1_000_000_000

  begin
    prev, curr = curr, prev + curr
  end until curr > threshold
  puts "First Fibonacci number > #{threshold}: #{curr}"
end

main
```

```perl
# src/basic/control/repeat_until_in_perl.pl
sub main {
    my $prev = 0;
    my $curr = 1;
    my $threshold = 1_000_000_000;

    do {
        ($prev, $curr) = ($curr, $prev + $curr);
    } until ($curr > $threshold);

    print "First Fibonacci number > $threshold: $curr\n";
}

main();
```

:::

In Mojo, we can achieve the same logic using a while loop by doing the following:

1. Use a `while True:` statement to create an infinite loop.
1. Inside the loop, we replace the `until` condition with a `if` statement and a `break` statement.

::: code-group

```mojo
# src/basic/control/repeat_until_with_while.mojo
def main():
    var prev = 0
    var curr = 1
    threshold = 1_000_000_000

    while True:
        prev, curr = curr, prev + curr
        if curr > threshold:
            break

    print("First Fibonacci number > ", threshold, ": ", curr, sep="")
```

```python
# src/basic/control/repeat_until_with_while.py
def main():
    prev = 0
    curr = 1
    threshold = 1_000_000_000

    while True:
        prev, curr = curr, prev + curr
        if curr > threshold:
            break

    print("First Fibonacci number > ", threshold, ": ", curr, sep="")
```

:::

The above code snippets will all output the same result:

```console
First Fibonacci number > 1000000000: 1134903170
```

## Iterables and iterators

::: info Move to a standalone chapter

This section may be moved to a standalone chapter in the advanced part of the Miji. That chapter may also cover the concept of generators and comprehensions in case Mojo **fully** supports them in the future.

:::

An object is an **iterable** if it implements a `__iter__()` method that returns an **iterator**.

The iterator is an instance of such a **type** that satisfies the following conditions:

1. It has a `__next__()` method that returns a value at at time,
1. It has a `__iter__()` method that returns an instance of its own type, and
1. It has a `__has_next__()` method that returns a boolean indicating whether there are more elements to iterate over.

Since a iterator has a `__iter__()` method that returns itself, we say that **an iterator is also an iterable**. This is why you can also use a for loop to iterate over an iterator.

### `range()` generates an iterator

The `range()` function can generates an object that that satisfies the above conditions of an iterator, and therefore, it is also an iterable to be used in a for loop. In Mojo, a `range()` can return one of the following three types of iterators, depending on the arguments passed to it:

1. `_ZeroStartingRange`: An iterator that starts from `0` and goes up by 1 to a specified end value.
1. `_SequentialRange`: An iterator that starts from a specified start value and goes up by 1 to a specified end value.
1. `_StridedRange`: An iterator that starts from a specified start value, goes up by a specified step value, and stops at a specified end value.

They all have a `__next__()` method that returns the next integral number in a range, a `__iter__()` method that returns itself, and a `__has_next__()` method that returns `True` if the end of the range is not reached yet, or `False` if it is.

---

The iterator, such as `_ZeroStartingRange` (the returned type of `range(n)`), could very useful because it does not need to store all numbers in the memory. It stores only **one value** in the memory. In each iteration, it update the value at the address by adding 1 to the current value.

For example, if you run `for i in range(100):`, the following steps will happen:

1. `range(100)` creates an instance of `_ZeroStartingRange`. The `_ZeroStartingRange` instance has two fields: `end` and `curr`, both of type `Int` (64-bit).
1. The field `end` is initialized to `100` and the `curr` field is initialized to `0`.
1. The variable `i` is defined as a **reference** to the `curr` field of the `_ZeroStartingRange` instance. The first iteration starts.
1. The `curr` field is incremented by `1` in the same memory address, so it becomes `1`. The reference `i` also becomes `1`. The second iteration starts.
1. The `curr` field is incremented by `1` in the same memory address, so it becomes `2`. The reference `i` also becomes `2`. The third iteration starts.
1. The iteration continues until the `curr` field reaches `100`.
1. The iteration stops and the loop ends.
1. The `_ZeroStartingRange` instance is destroyed and the memory is freed. The reference `i` is also destroyed.

Note that, this iterator only occupies 128 bits (16 bytes) of memory, which is much less than storing all 100 numbers in a list (which would occupy 800 bytes). This is why iterators are often used to save memory and improve performance when iterating over large ranges or sequences.

## Exercises

### Print Fibonacci sequence

We are going to write a Mojo program that prints the Fibonacci sequence up to a certain number of terms. In Chapter [Migrate Python into Mojo](../move/examples#fibonacci-sequence), we have already implemented the Fibonacci sequence both in Python and Mojo. However, we used a recursive function to calculate the Fibonacci numbers, which is not very efficient.

In this exercise, we will use a for loop to calculate and print the Fibonacci numbers iteratively: we save the last two Fibonacci numbers in two variables, calculate the next Fibonacci number by adding the last two numbers, and then update the two variables accordingly.

The formula for the Fibonacci sequence is as follows:

$$
\begin{equation}
  F_{i} =
    \begin{cases}
      0 & \text{if $i = 0$}\\
      1 & \text{if $i = 1$}\\
      F_{i-2} + F_{i-1} & \text{if $i \geq 2$}
    \end{cases}
\end{equation}
$$

Here is a template for you to complete the `print_fibonacci()` function:

::: code-group

```mojo
def print_fibonacci(n: Int) -> None:
    """Prints the first n Fibonacci numbers."""

def main():
    print_fibonacci(50)

# End of the code
```

```python
def print_fibonacci(n: int) -> None:
    """Prints the first n Fibonacci numbers."""

def main():
    print_fibonacci(50)

main()
```

:::

:::::: details Answer

An example of the Fibonacci sequence in both Mojo and Python is as follows:

::: code-group

```mojo
# src/basic/controls/print_fibonacci_numbers.mojo
def print_fibonacci(n: Int) -> None:
    """Prints the first n Fibonacci numbers."""
    var prev = 0
    var curr = 1
    for _ in range(n):
        print(prev)
        prev, curr = curr, prev + curr

def main():
    print_fibonacci(50)

# End of the code
```

```python
# src/basic/controls/print_fibonacci_numbers.py
def print_fibonacci(n: int) -> None:
    """Prints the first n Fibonacci numbers."""
    prev = 0
    curr = 1
    for _ in range(n):
        print(prev)
        prev, curr = curr, prev + curr

def main():
    print_fibonacci(50)

main()
```

::::::

:::::: danger Overflow

Please be aware that the Fibonacci numbers grow very fast, and the maximum value of an `Int` in Mojo is `9223372036854775807` (which is $2^{63} - 1$). If you try to print more than 93 Fibonacci numbers, you will get an a wrong value for the 94-th number due to integer overflow (`-6246583658587674878`).

We have discussed the integer overflow issue in Chapter [Data types](../basic/types#integer-overflow). If you really want to print more than 93 Fibonacci numbers, you can use the `BigInt` type, which is discussed in Chapter [Arbitrary-precision integers](../extend/decimojo).

To properly this issue, you can raise and error or print a warning message if the input number is greater than 93. For example, you can modify the `print_fibonacci()` function as follows:

::: code-group

```mojo
def print_fibonacci(n: int) -> None:
    """Prints the first n Fibonacci numbers."""
    if n > 93:
        print(
            "Warning: The input number is too large."
            "The Fibonacci numbers will overflow."
        )
        return

    prev = 0
    curr = 1
    for _ in range(n):
        print(prev)
        prev, curr = curr, prev + curr
```

:::

The `return` statement will exit the function early if the input number is greater than 93, so that the users will not get an incorrect result.

Note that this problem will **not** happen in Python, because Python's `int` type can handle arbitrarily large integers.

::::::

### Find prime numbers

Let's try determine whether a number is a prime number or not. A prime number is a natural number that is greater than `1` and has no positive integral divisors other than `1` and itself. For example, `100` is not a prime number because it can be divided by `2`, `4`, `5`, `10`, `20`, and `25`. However, `97` is a prime number because it can only be divided by `1` and `97`.

**You need to write a Mojo program** that checks the numbers from $10^{18}$ (a quintillion) to $10^{18} + 100$ (inclusive) and print whether each number is a prime number or not. If it is a prime number, you should also print the smallest prime factor of that number. For example, `1024 is not a prime number with smallest divisor 2`. The output should look like this:

```console
1000000000000000003 is a prime number
1000000000000000004 is not a prime number with smallest divisor 2
1000000000000000005 is not a prime number with smallest divisor 3
1000000000000000006 is not a prime number with smallest divisor 2
1000000000000000007 is not a prime number with smallest divisor 1370531
```

Two hints for you:

1. You can try dividing the number by all integers from `2` to the square root of the number (inclusive) to check if it is a prime number. That is to say that $10^{9}$ (a billion) is sufficient.
1. Once you find a divisor, you should exit the loop early using the `break` statement. Otherwise, you will keep checking all numbers even after you find a divisor, which is unnecessary and inefficient.

The code below is a template for you to complete.

```mojo
def main():
    var start: Int = 10**18
    var sqrt_of_start: Int = 10**9
    for number in range(start, start + 100 + 1):
        for ... in ...:
            ...
        else:
            ...
```

:::::: details Answer

The trick is to use the `break` statement to exit the loop early once you find a divisor. If the loop completes without finding a divisor, then the `else:` block will be executed, indicating that the number is a prime number.

Below is a solution to the exercises in both Mojo and Python. They will generate the same output, but Python will run much slower than Mojo. On my machine (MacBook Pro M4 Pro), the Mojo code takes 1.95 seconds to run, while the Python code takes 109.89 seconds to run.

::: code-group

```mojo
# src/basic/controls/is_prime_number.mojo
def main():
    var start: Int = 10**18
    var sqrt_of_start: Int = 10**9
    for number in range(start, start + 100):
        for divisor in range(2, sqrt_of_start + 1):
            if number % divisor == 0:
                print(
                    number,
                    "is not a prime number with smallest divisor",
                    divisor,
                )
                break
        else:
            print(number, "is a prime number")

# End of the code
```

```python
# src/basic/controls/is_prime_number.py
def main():
    start: int = 10**18
    sqrt_of_start: int = 10**9
    for number in range(start, start + 100):
        for divisor in range(2, sqrt_of_start + 1):
            if number % divisor == 0:
                print(
                    number,
                    "is not a prime number with smallest divisor",
                    divisor,
                )
                break
        else:
            print(number, "is a prime number")

main()
```

:::

Running the above code will give you the output:

```console
1000000000000000000 is not a prime number with smallest divisor 2
1000000000000000001 is not a prime number with smallest divisor 101
1000000000000000002 is not a prime number with smallest divisor 2
1000000000000000003 is a prime number
1000000000000000004 is not a prime number with smallest divisor 2
1000000000000000005 is not a prime number with smallest divisor 3
1000000000000000006 is not a prime number with smallest divisor 2
1000000000000000007 is not a prime number with smallest divisor 1370531
1000000000000000008 is not a prime number with smallest divisor 2
1000000000000000009 is a prime number
1000000000000000010 is not a prime number with smallest divisor 2
1000000000000000011 is not a prime number with smallest divisor 3
1000000000000000012 is not a prime number with smallest divisor 2
1000000000000000013 is not a prime number with smallest divisor 7
1000000000000000014 is not a prime number with smallest divisor 2
1000000000000000015 is not a prime number with smallest divisor 5
1000000000000000016 is not a prime number with smallest divisor 2
1000000000000000017 is not a prime number with smallest divisor 3
1000000000000000018 is not a prime number with smallest divisor 2
1000000000000000019 is not a prime number with smallest divisor 17
1000000000000000020 is not a prime number with smallest divisor 2
1000000000000000021 is not a prime number with smallest divisor 11
1000000000000000022 is not a prime number with smallest divisor 2
1000000000000000023 is not a prime number with smallest divisor 3
1000000000000000024 is not a prime number with smallest divisor 2
1000000000000000025 is not a prime number with smallest divisor 5
1000000000000000026 is not a prime number with smallest divisor 2
1000000000000000027 is not a prime number with smallest divisor 7
1000000000000000028 is not a prime number with smallest divisor 2
1000000000000000029 is not a prime number with smallest divisor 3
1000000000000000030 is not a prime number with smallest divisor 2
1000000000000000031 is a prime number
1000000000000000032 is not a prime number with smallest divisor 2
1000000000000000033 is not a prime number with smallest divisor 139
1000000000000000034 is not a prime number with smallest divisor 2
1000000000000000035 is not a prime number with smallest divisor 3
1000000000000000036 is not a prime number with smallest divisor 2
1000000000000000037 is not a prime number with smallest divisor 19
1000000000000000038 is not a prime number with smallest divisor 2
1000000000000000039 is not a prime number with smallest divisor 43
1000000000000000040 is not a prime number with smallest divisor 2
1000000000000000041 is not a prime number with smallest divisor 3
1000000000000000042 is not a prime number with smallest divisor 2
1000000000000000043 is not a prime number with smallest divisor 11
1000000000000000044 is not a prime number with smallest divisor 2
1000000000000000045 is not a prime number with smallest divisor 5
1000000000000000046 is not a prime number with smallest divisor 2
1000000000000000047 is not a prime number with smallest divisor 3
1000000000000000048 is not a prime number with smallest divisor 2
1000000000000000049 is not a prime number with smallest divisor 157
1000000000000000050 is not a prime number with smallest divisor 2
1000000000000000051 is not a prime number with smallest divisor 13
1000000000000000052 is not a prime number with smallest divisor 2
1000000000000000053 is not a prime number with smallest divisor 3
1000000000000000054 is not a prime number with smallest divisor 2
1000000000000000055 is not a prime number with smallest divisor 5
1000000000000000056 is not a prime number with smallest divisor 2
1000000000000000057 is not a prime number with smallest divisor 342359
1000000000000000058 is not a prime number with smallest divisor 2
1000000000000000059 is not a prime number with smallest divisor 3
1000000000000000060 is not a prime number with smallest divisor 2
1000000000000000061 is not a prime number with smallest divisor 2017
1000000000000000062 is not a prime number with smallest divisor 2
1000000000000000063 is not a prime number with smallest divisor 3109
1000000000000000064 is not a prime number with smallest divisor 2
1000000000000000065 is not a prime number with smallest divisor 3
1000000000000000066 is not a prime number with smallest divisor 2
1000000000000000067 is not a prime number with smallest divisor 349
1000000000000000068 is not a prime number with smallest divisor 2
1000000000000000069 is not a prime number with smallest divisor 7
1000000000000000070 is not a prime number with smallest divisor 2
1000000000000000071 is not a prime number with smallest divisor 3
1000000000000000072 is not a prime number with smallest divisor 2
1000000000000000073 is not a prime number with smallest divisor 37
1000000000000000074 is not a prime number with smallest divisor 2
1000000000000000075 is not a prime number with smallest divisor 5
1000000000000000076 is not a prime number with smallest divisor 2
1000000000000000077 is not a prime number with smallest divisor 3
1000000000000000078 is not a prime number with smallest divisor 2
1000000000000000079 is a prime number
1000000000000000080 is not a prime number with smallest divisor 2
1000000000000000081 is not a prime number with smallest divisor 61
1000000000000000082 is not a prime number with smallest divisor 2
1000000000000000083 is not a prime number with smallest divisor 3
1000000000000000084 is not a prime number with smallest divisor 2
1000000000000000085 is not a prime number with smallest divisor 5
1000000000000000086 is not a prime number with smallest divisor 2
1000000000000000087 is not a prime number with smallest divisor 11
1000000000000000088 is not a prime number with smallest divisor 2
1000000000000000089 is not a prime number with smallest divisor 3
1000000000000000090 is not a prime number with smallest divisor 2
1000000000000000091 is not a prime number with smallest divisor 47
1000000000000000092 is not a prime number with smallest divisor 2
1000000000000000093 is not a prime number with smallest divisor 79
1000000000000000094 is not a prime number with smallest divisor 2
1000000000000000095 is not a prime number with smallest divisor 3
1000000000000000096 is not a prime number with smallest divisor 2
1000000000000000097 is not a prime number with smallest divisor 7
1000000000000000098 is not a prime number with smallest divisor 2
1000000000000000099 is not a prime number with smallest divisor 1291
1000000000000000100 is not a prime number with smallest divisor 2
```

::::::

### Print calendar of 1991

In this exercise, we will write a Mojo program that prints the calendar of the year 1991. The calendar should look like this:

```console
Feb
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                1       2       3
4       5       6       7       8       9       10
11      12      13      14      15      16      17
18      19      20      21      22      23      24
25      26      27      28
```

Some hints for you:

1. You need to store the number of days in each month of the year 1991 in a list for iteration.
1. You need to store the information on which week day is the current day of the month. The first day of the year 1991 is a Tuesday, so you can start with `which_weekday = 1` (assuming Monday is `0`). At the end of each iteration, you can update it by incrementing it by `1` and taking the modulo `7`.
1. You need to print leading spaces for the first week of each month, so that the first day of the month is aligned with the correct day of the week.
1. Do not forget to print a newline at the end of each week.
1. You can either use Sunday or Monday as the first day of the week, but you need to be consistent throughout the calendar.

The code below is a template for you to complete.

```mojo
def print_calendar(year: Int) -> None:
    """Prints the calendar for the given year.
    """
    var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var which_weekday = 1  # 1991-01-01 is a Tuesday
    ...

def main():
    print_calendar(1991)
```

::: details Answer

Here is a solution to the exercise for your reference.

```mojo
# print_calendar_1991.mojo
def print_calendar(year: Int) -> None:
    """Prints the calendar for the given year.

    Args:
        year: The year for which the calendar is printed.

    Note:
        The calendar is valid for years after 1582.
    """

    var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var which_weekday = 1  # 1991-01-01 is a Tuesday
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    print("Calendar of", year)
    print()

    for m in range(12):
        print(months[m])
        print("Mon\tTue\tWed\tThu\tFri\tSat\tSun")
        # Print leading spaces for the first week of the month
        for _ in range(which_weekday):
            print("  ", end="\t")
        # Print the days of the month
        for d in range(1, days_in_month[m] + 1):
            print(d, end="\t")
            # If it's the last day of the week, print a newline
            if which_weekday == 6:
                print()
            which_weekday = (
                which_weekday + 1
            ) % 7  # Update the day of the week
        print("\n")


def main():
    print_calendar(1991)
```

Running the above code will give you the output:

```console
Calendar of 1991

Jan
Mon     Tue     Wed     Thu     Fri     Sat     Sun
        1       2       3       4       5       6
7       8       9       10      11      12      13
14      15      16      17      18      19      20
21      22      23      24      25      26      27
28      29      30      31

Feb
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                1       2       3
4       5       6       7       8       9       10
11      12      13      14      15      16      17
18      19      20      21      22      23      24
25      26      27      28

Mar
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                1       2       3
4       5       6       7       8       9       10
11      12      13      14      15      16      17
18      19      20      21      22      23      24
25      26      27      28      29      30      31


Apr
Mon     Tue     Wed     Thu     Fri     Sat     Sun
1       2       3       4       5       6       7
8       9       10      11      12      13      14
15      16      17      18      19      20      21
22      23      24      25      26      27      28
29      30

May
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                1       2       3       4       5
6       7       8       9       10      11      12
13      14      15      16      17      18      19
20      21      22      23      24      25      26
27      28      29      30      31

Jun
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                        1       2
3       4       5       6       7       8       9
10      11      12      13      14      15      16
17      18      19      20      21      22      23
24      25      26      27      28      29      30


Jul
Mon     Tue     Wed     Thu     Fri     Sat     Sun
1       2       3       4       5       6       7
8       9       10      11      12      13      14
15      16      17      18      19      20      21
22      23      24      25      26      27      28
29      30      31

Aug
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                        1       2       3       4
5       6       7       8       9       10      11
12      13      14      15      16      17      18
19      20      21      22      23      24      25
26      27      28      29      30      31

Sep
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                                1
2       3       4       5       6       7       8
9       10      11      12      13      14      15
16      17      18      19      20      21      22
23      24      25      26      27      28      29
30

Oct
Mon     Tue     Wed     Thu     Fri     Sat     Sun
        1       2       3       4       5       6
7       8       9       10      11      12      13
14      15      16      17      18      19      20
21      22      23      24      25      26      27
28      29      30      31

Nov
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                1       2       3
4       5       6       7       8       9       10
11      12      13      14      15      16      17
18      19      20      21      22      23      24
25      26      27      28      29      30

Dec
Mon     Tue     Wed     Thu     Fri     Sat     Sun
                                                1
2       3       4       5       6       7       8
9       10      11      12      13      14      15
16      17      18      19      20      21      22
23      24      25      26      27      28      29
30      31
```

:::

### Print calendar with user input

Now, let's extend the previous exercise to allow the user to input a year and print the calendar for that year. We want the following features:

1. The user can input any year after `1582`, which is the year when the Gregorian calendar was introduced. If the user inputs a year before `1582`, we will let the user to input a valid year again.
1. The program should print the calendar for the given year and handle the leap years correctly. A leap year is a year that is divisible by `4`, except for end-of-century years, which must be divisible by `400`. For example, `2000` is a leap year, but `1900` is not.
1. The program should correctly calculate the weekday of the first day of the year. You can use the following formula to calculate the weekday of the first day of the year (`0` for Monday):
    $$
    year - 1 + \left\lfloor \frac{year - 1}{4}\right\rfloor - \left\lfloor \frac{year - 1}{100}\right\rfloor + \left\lfloor \frac{year - 1}{400}\right\rfloor
    $$
1. You can make the calendar prettier by printing the borders and aligning the months and days properly.

A example output of the program is as follows:

```console
Enter a year (after 1582) to print its calendar: 2025
┌─────────────────────────────────────┐
│          Calendar of 2025           │
├─────────────────────────────────────┤
│                 Jan                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│            1    2    3    4    5    │
│  6    7    8    9    10   11   12   │
│  13   14   15   16   17   18   19   │
│  20   21   22   23   24   25   26   │
│  27   28   29   30   31             │
├─────────────────────────────────────┤
│  ...                                │
├─────────────────────────────────────┤
│                 Dec                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│  1    2    3    4    5    6    7    │
│  8    9    10   11   12   13   14   │
│  15   16   17   18   19   20   21   │
│  22   23   24   25   26   27   28   │
│  29   30   31                       │
└─────────────────────────────────────┘
```

::: details Answer

There are some comments for this exercise:

- You need to calculate the leap years and the first day of the year correctly.
- You need to carefully handle the spaces and borders for the calendar so that everything is aligned properly.
- Beside printing the leading spaces for the first week of the month, you also need to print trailing spaces for the last week of the month if the last day is not Sunday.
- Make sure that, if a month ends on a Sunday, you do not print an extra line.
- The `while True` loop is used to keep asking the user for a valid year until they provide one.

Here is a solution to the exercise for your reference.

```mojo
# src/basic/controls/print_calendar.mojo
def print_calendar(year: Int) -> None:
    """Prints the calendar for the given year.

    Args:
        year: The year for which the calendar is printed.

    Note:
        The calendar is valid for years after 1582.
    """

    var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
        days_in_month[1] = 29  # February in a leap year
    var day_of_week = (
        (year - 1) + (year - 1) // 4 - (year - 1) // 100 + (year - 1) // 400
    ) % 7
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    print("┌", "─" * 37, "┐", sep="")
    print("│", " " * 10, "Calendar of ", year, " " * 11, "│", sep="")
    print("├", "─" * 37, "┤", sep="")

    for m in range(12):
        print("│", " " * 17, months[m], " " * 17, "│", sep="")
        print("│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │\n│  ", end="")
        # Print leading spaces for the first week of the month
        for _ in range(day_of_week):
            print("     ", end="")
        for d in range(1, days_in_month[m] + 1):
            if d <= 9:
                print(d, end="    ")
            else:
                print(d, end="   ")
            if day_of_week == 6:
                if d != days_in_month[m]:
                    # If it's Sunday and not the last day of the month
                    print("│\n│  ", end="")  # New line after Sunday
                else:
                    print("│")
            day_of_week = (day_of_week + 1) % 7  # Update
        # Print trailing spaces for the last week of the month
        if day_of_week != 0:  # If the last day is not Sunday
            for _ in range(day_of_week, 7):
                print("     ", end="")
            print("│")
        if m < 11:  # Not the last month
            print("├", "─" * 37, "┤", sep="")
        else:
            print("└", "─" * 37, "┘", sep="")


def main():
    while True:
        var year = Int(
            input("Enter a year (after 1582) to print its calendar: ")
        )
        if year <= 1582:
            print("Year must be after 1582. Please try again.")
            continue
        print_calendar(year)
        break
```

After running the above code, you will be prompted to enter a year:

```console
Enter a year (after 1582) to print its calendar:
```

If you enter an invalid year, you will see the following message:

```console
Enter a year (after 1582) to print its calendar: 200
Year must be after 1582. Please try again.
```

Otherwise, you will see the calendar for the given year. For example, if you enter `2025`, you will see the following output:

```console
Enter a year (after 1582) to print its calendar: 2025
┌─────────────────────────────────────┐
│          Calendar of 2025           │
├─────────────────────────────────────┤
│                 Jan                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│            1    2    3    4    5    │
│  6    7    8    9    10   11   12   │
│  13   14   15   16   17   18   19   │
│  20   21   22   23   24   25   26   │
│  27   28   29   30   31             │
├─────────────────────────────────────┤
│                 Feb                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│                           1    2    │
│  3    4    5    6    7    8    9    │
│  10   11   12   13   14   15   16   │
│  17   18   19   20   21   22   23   │
│  24   25   26   27   28             │
├─────────────────────────────────────┤
│                 Mar                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│                           1    2    │
│  3    4    5    6    7    8    9    │
│  10   11   12   13   14   15   16   │
│  17   18   19   20   21   22   23   │
│  24   25   26   27   28   29   30   │
│  31                                 │
├─────────────────────────────────────┤
│                 Apr                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│       1    2    3    4    5    6    │
│  7    8    9    10   11   12   13   │
│  14   15   16   17   18   19   20   │
│  21   22   23   24   25   26   27   │
│  28   29   30                       │
├─────────────────────────────────────┤
│                 May                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│                 1    2    3    4    │
│  5    6    7    8    9    10   11   │
│  12   13   14   15   16   17   18   │
│  19   20   21   22   23   24   25   │
│  26   27   28   29   30   31        │
├─────────────────────────────────────┤
│                 Jun                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│                                1    │
│  2    3    4    5    6    7    8    │
│  9    10   11   12   13   14   15   │
│  16   17   18   19   20   21   22   │
│  23   24   25   26   27   28   29   │
│  30                                 │
├─────────────────────────────────────┤
│                 Jul                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│       1    2    3    4    5    6    │
│  7    8    9    10   11   12   13   │
│  14   15   16   17   18   19   20   │
│  21   22   23   24   25   26   27   │
│  28   29   30   31                  │
├─────────────────────────────────────┤
│                 Aug                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│                      1    2    3    │
│  4    5    6    7    8    9    10   │
│  11   12   13   14   15   16   17   │
│  18   19   20   21   22   23   24   │
│  25   26   27   28   29   30   31   │
├─────────────────────────────────────┤
│                 Sep                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│  1    2    3    4    5    6    7    │
│  8    9    10   11   12   13   14   │
│  15   16   17   18   19   20   21   │
│  22   23   24   25   26   27   28   │
│  29   30                            │
├─────────────────────────────────────┤
│                 Oct                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│            1    2    3    4    5    │
│  6    7    8    9    10   11   12   │
│  13   14   15   16   17   18   19   │
│  20   21   22   23   24   25   26   │
│  27   28   29   30   31             │
├─────────────────────────────────────┤
│                 Nov                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│                           1    2    │
│  3    4    5    6    7    8    9    │
│  10   11   12   13   14   15   16   │
│  17   18   19   20   21   22   23   │
│  24   25   26   27   28   29   30   │
├─────────────────────────────────────┤
│                 Dec                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun  │
│  1    2    3    4    5    6    7    │
│  8    9    10   11   12   13   14   │
│  15   16   17   18   19   20   21   │
│  22   23   24   25   26   27   28   │
│  29   30   31                       │
└─────────────────────────────────────┘

:::