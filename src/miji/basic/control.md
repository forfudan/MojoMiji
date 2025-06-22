# Control flows

> I shouldn't need to remind you of the same task every day.  
> Yuhao Zhu, *Gate of Heaven*

It would be interesting to imagine a world where most of the programming languages are line-oriented where you have to write "go back to Line 10" to repeat a task, or "advance to Line 20" to skip a task. Luckily, we have control flows where you can encapsulate the logic of repeating or skipping tasks in a more human-readable way.

There are three main types of control flows in Python: loops, conditionals, and exceptions. Mojo, being a Python-like language, also supports these control flows with almost the same logic and syntax. In this section, we will cover the first two types of control flows: loops and conditionals. Exceptions will be covered in a later chapter.

Believe me, this should be the easiest chapter of this Miji for a Pythonista, so let's get started!

[[toc]]

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

### `for in` syntax

Let's begin with the `for ... in ...` syntax. The `for in` syntax is used to iterate over an iterable object, such as a list, tuple, or string. It can be used to simplify the code block that is repeated for several times. The syntax is **identical** to Python's `for ... in ...` syntax, so it should be familiar to you.

For example, let's say you want to calculate the sum of all items in a list of floating-point numbers, `[1.1, 2.2, 3.3, 4.4, 5.5]`. If you do not use a for loop, you need to write the following code:

```mojo
# src/basic/flows/sum_of_list_of_floats_without_loop.mojo
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

This code is not very efficient and is not scalable. If you want to sum up a list with 1000 items, you will have to write 1000 lines of code, which is not practical.

Since we are iterating over the list of numbers and taking out each element one by one, we can then use a for loop to simplify the code. Below is the equivalent code using a for loop in both Mojo and Python:

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# src/basic/flows/sum_of_list_of_floats.mojo
def main():
    var total = 0.0
    var numbers = [1.1, 2.2, 3.3, 4.4, 5.5]
    for number in numbers:
        total += number
    print("The sum of all items = ", total)

# End of the code
```

</td><td>

```python
# src/basic/flows/sum_of_list_of_floats.py
def main():
    total = 0.0
    numbers = [1.1, 2.2, 3.3, 4.4, 5.5]
    for number in numbers:
        total += number
    print("The sum of all items = ", total)

main()
```

</td></tr></table>

Running the above code will give you the output: ```The sum of all items =  16.5```

Let's break down the Mojo code and see how it works in Mojo internally:

1. `var total = 0.0` initializes a variable with the name `total`, the type `Float64` (default type for floating-point numbers in Mojo), and the initial value `0.0`. The [life time](../advanced/lifetime.md) (valid scope) of this variable is from this line to the last line of the main function.
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
# src/basic/flows/sum_of_list_of_floats_without_loop.mojo
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

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# src/basic/flows/break_and_else_statement_in_for_loop.mojo
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

</td><td>

```python
# src/basic/flows/break_and_else_statement_in_for_loop.py
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

</td></tr></table>

Running the above code will give you the output:

```console
1 2 3 4 5 Loop completed without break!
1 2
```

In the first for loop, we iterate over all elements of `my_list` and print them. After the loop, the `else:` block is executed, printing "Loop completed without break!" because the loop was not exited early.

In the second for loop, we iterate over the same list, but when we reach the element `3`, we trigger the `break` statement. This exits the loop early, and the `else:` block is skipped, so "Loop completed without break!" is not printed.

#### `break` in nested loops

You may wonder, what would the `break` keyword behave if we have nested loops? In Mojo, the `break` statement will only exit the **innermost** loop (**current** loop) that contains the `break` statement. This is similar to Python's behavior. Let's see an example:

```mojo
# src/basic/flows/break_and_else_statement_in_for_loop.mojo
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
# src/basic/flows/continue_in_for_loop.mojo
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

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# src/basic/flows/range_function.mojo
def main():
    for i in range(5):
        print(i, "*", i, "=", i * i)

    for _j in range(3):
        print("Important message shall be repeated three times.")

# End of the code
```

</td><td>

```python
# src/basic/flows/range_function.py
def main():
    for i in range(5):
        print(i, "*", i, "=", i * i)

    for _j in range(3):
        print("Important message shall be repeated three times.")

main()
```

</td></tr></table>

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

### Exercises - for loops

Let's try determine whether a number is a prime number or not. A prime number is a natural number that is greater than `1` and has no positive integral divisors other than `1` and itself. For example, `100` is not a prime number because it can be divided by `2`, `4`, `5`, `10`, `20`, and `25`. However, `97` is a prime number because it can only be divided by `1` and `97`.

**You need to write a Mojo program** that checks the numbers from $10^{18}$ (a quintillion) to $10^{18} + 100$ (inclusive) and print whether each number is a prime number or not. If it is a prime number, you should also print the smallest prime factor of that number. For example, `1024 is not a prime number with smallest divisor 2`.

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

::: details Answers

The trick is to use the `break` statement to exit the loop early once you find a divisor. If the loop completes without finding a divisor, then the `else:` block will be executed, indicating that the number is a prime number.

Below is a solution to the exercises in both Mojo and Python. They will generate the same output, but Python will run much slower than Mojo. On my machine (MacBook Pro M4 Pro), the Mojo code takes 1.95 seconds to run, while the Python code takes 109.89 seconds to run.

<table><tr><th>Mojo</th><th>Python</th></tr><tr><td>

```mojo
# src/basic/flows/is_prime_number.mojo
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

</td><td>

```python
# src/basic/flows/is_prime_number.py
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

</td></tr></table>

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

:::

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
