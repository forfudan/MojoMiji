# Convert Python code into Mojo

In this chapter, we will look at some simple examples of Python and Mojo code. The goal is to help you have a image of how Mojo looks like and how it is similar to or different from Python.

[[toc]]

## Multiplication table

The first example is about multiplication table ([Wiki page](https://en.wikipedia.org/wiki/Multiplication_table)). The multiplication table is a table of numbers that shows the result of multiplying two integral numbers together. When I am kid, before going to the elementary school, I was already able to memorize the Chinese multiplication table (<ruby>九<rt>jǐu</rt>九<rt>jǐu</rt>乘<rt>chéng</rt>法<rt>fǎ</rt>表<rt>biǎo</rt></ruby> / Nine-nine song). It is a powerful tool for learning multiplication and finding the product of two numbers quickly.

So the first example is to print a multiplication table from 1 to 9. Each element would be of the form `i * j = k`. All the elements in the same row are separated by a tab character. Since the multiplication is symmetric, we do not need to repeat the calculation. For example, we skip `3 * 1 = 1` and `3 * 2 = 6` but continue with `3 * 3 = 9`.

We do this first in Python. We create a file in the `src/move/` directory called `multiplication_table.py` and write the following code in it:

```python
# src/move/multiplication_table.py
def main():
    print("Nine-nine Multiplication Table")
    for i in range(1, 10):
        for j in range(i, 10):
            print("{} * {} = {}".format(i, j, i*j), end="\t")
        print()

main()
```

Then we run the code with `python src/move/multiplication_table.py`. The output is:

```console
Nine-nine Multiplication Table
1 * 1 = 1       1 * 2 = 2       1 * 3 = 3       1 * 4 = 4       1 * 5 = 5       1 * 6 = 6       1 * 7 = 7       1 * 8 = 8       1 * 9 = 9
2 * 2 = 4       2 * 3 = 6       2 * 4 = 8       2 * 5 = 10      2 * 6 = 12      2 * 7 = 14      2 * 8 = 16      2 * 9 = 18
3 * 3 = 9       3 * 4 = 12      3 * 5 = 15      3 * 6 = 18      3 * 7 = 21      3 * 8 = 24      3 * 9 = 27
4 * 4 = 16      4 * 5 = 20      4 * 6 = 24      4 * 7 = 28      4 * 8 = 32      4 * 9 = 36
5 * 5 = 25      5 * 6 = 30      5 * 7 = 35      5 * 8 = 40      5 * 9 = 45
6 * 6 = 36      6 * 7 = 42      6 * 8 = 48      6 * 9 = 54
7 * 7 = 49      7 * 8 = 56      7 * 9 = 63
8 * 8 = 64      8 * 9 = 72
9 * 9 = 81
```

Now we program in Mojo. A clever way is to simply copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()` because it is not needed.

Let's compile and run this Mojo code by `magic run mojo src/move/multiplication_table.mojo`. You may see the following error message:

```console
error: 'StringLiteral["{} * {} = {}"]' value has no attribute 'format'
            print("{} * {} = {}".format(i, j, i*j), end="\t")
                  ~~~~~~~~~~~~~~^
```

Here we see another difference between Python and Mojo: `format` is not a method of the string literal in Mojo. This is because, in Python, we do not differentiate between string and string literal. The contents between quotation marks ("") is of `str` type and you can use the `format()` method. However, in Mojo, we do differentiate between string and string literal. I will discuss this in the following chapters.

For now, to fix the error, we have to explicitly convert the string literal to a String object by calling the `String()` constructor. So we change the line to:

```mojo
...
            print(String("{} * {} = {}").format(i, j, i*j), end="\t")
...
```

Now you run the code again. You will see the same output as in Python.

Great! We see that we can migrate our Python code to Mojo easily with very little modification. But we enjoy the performance of Mojo. How big is the performance gain? Let's check it out using the next example.

## Fibonacci sequence

To demonstrate the gain in speed, we use Fibonacci sequence as an example. The Fibonacci sequence is a sequence of numbers in which each number is the sum of the two preceding ones, usually starting with 0 and 1.

What we want to do is to calculate the first 40 Fibonacci numbers and print them out. Although there is a more efficient way to implement this, I will use the recursive method so that we can see the performance difference between Python and Mojo.

Let's create a file in the `src/move/` directory called `fibonacci.py` and write the following code in it:

```python
# src/move/fibonacci.py
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(40):
        print(fib(i), end=", ")

main()
```

Let's run the code with the command `python src/move/fibonacci.py`. The output is:

```console
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986,
```

On my machine (Apple M4 Pro), it takes about ***24 seconds*** to run the code. This is because the recursive method is very inefficient. The time complexity is exponential. Let's migrate the code to Mojo and see how fast it is.

Just like what we did in the previous example, we copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()`.

Now you will see that your IDE is complaining about the first line of the code. It highlights the type hints `int` and tells you `use of unknown declaration 'int'`. Running the code will also give your the same error. This is because Mojo's built-in integral type is called `Int` (with capital "I") which is different from Python. So we need to change the type hints from `int` to `Int`.

```mojo
# src/move/fibonacci.mojo
def fib(n: Int) -> Int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(40):
        print(fib(i), end=", ")
```

Let's run the code again with `pixi run mojo src/move/fibonacci.mojo`. On my machine, it takes around ***0.35*** seconds only.

See, a huge performance gain! The Mojo code is more than ***50 times*** faster than the Python code. What we did is just copying-pasting from the Python code and making small modifications, but we gained a performance comparable to C.

::: tip Naming convention of Mojo type

In Python, types and classes are usually named with CamelCase. But there are some exceptions: primitive types like `int`, `float`, `str`, etc, are name with lowercase. For consistency, Mojo uses CamelCase for all types and classes. So `int` in Python is `Int` in Mojo, `float` is `Float64`, `str` is `String`, etc.

:::

::: tip Why Mojo is faster than Python?

The main reason is that Mojo is a compiled language which is complied to machine code via LLVM and then executed directly by the CPU. Python, on the other hand, is an interpreted language. It is compiled to bytecode and is then interpreted by the Python virtual machine. This leads to a lot of work at runtime that slows down the execution.

There are some other reasons why Mojo is much faster. In this example. One reason is that the Python's integral type is different from Mojo's integral type. The `int` type in Python is actually a big integer type which can be arbitrarily large. This means that every `int` type requests memory allocation and deallocation on heap. In Mojo, `Int` is a fixed-size integer type (32-bit or 64-bit depending on the system) and it is allocated on stack.

:::

::: info Speed comparison with C and Rust

Now you know that Mojo is much faster than Python. You may wonder how the performance of Mojo is compared to C and Rust. So I also implement the same code in C and Rust.

To give some stress to these languages, I increase the number of Fibonacci numbers to ***50*** (Do not do this in Python unless you want to take a long shower 😉).

The C code is as follows:

```c
#include <stdint.h>
#include <stdio.h>

int64_t fib(int n) {
  if (n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

int main() {
  for (int i = 0; i < 50; i++) {
    printf("%lld, ", fib(i));
  }
}
```

The Rust code is as follows:

```rust
fn fib (n: i64) -> i64 {
    if n <= 1 {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

fn main() {
    for i in 0..50 {
        print!("{}, ", fib(i));
    }
}
```

The Mojo code is as follows:

```mojo
def fib(n: Int) -> Int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(50):
        print(fib(i), end=", ")
```

Let's compile the scripts into executables and run them. Here are the results:

```console
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437, 701408733, 1134903170, 1836311903, 2971215073, 4807526976, 7778742049,
```

The time taken to run the code is as follows:

| Language | Time (seconds) |
| -------- | -------------- |
| C        | 72             |
| Rust     | 94             |
| Mojo     | 42             |
| Python   | 3440           |

To be frank, I am also surprised by the performance of Mojo in this case. Maybe it is not always faster, but at least a good sign.

:::

## Sort numbers

In the next example, we will look into more more complex data structure: lists. The goal is to show you more about the differences between Python and Mojo. You have to modify your Python code a bit more than the previous examples so that it can be run in Mojo.

This example is to sort an array of numbers in ascending order in-place. There are many sorting algorithms. We will use the bubble sort algorithm because it is relatively simple and won't take too many lines of code.

The bubble sort algorithm repeatedly scan through the array, compares each pair of adjacent elements and swaps them if they are in the wrong order. For example, the array `5, 2, 9, 1` will be sequentially sorted to `2, 5, 1, 9` -> `2, 1, 5, 9` -> `1, 2, 5, 9` after iterations.

Let's do this first in Python. We create a file in the `src/move` directory called `sort.py` and write the following code in it:

```python
# src/move/sort.py
def bubble_sort(array):    
    n = len(array)
    for i in range(n):
        for j in range(0, n-1-i):
            if array[j] > array[j+1]:
                array[j], array[j+1] = array[j+1], array[j]

def main():
    array = [64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49]
    print("Input array:", array)
    bubble_sort(array)
    print("After sorting:", array)

main()
```

Then we run the code with `python src/move/sort.py`. The output is:

```console
Input array: [64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49]
After sorting: [-12.3, -11.5, 22.0, 25.1, 34.523, 64.1, 90.49]
```

We can visually verify that the array is correctly sorted in ascending order. Now we try to migrate the code to Mojo. Just like what we did in the previous examples, we copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()`.

Now you immediately see that you IDE is complaining more errors than before. The first error message is:

```console
error: argument type must be specified
def bubble_sort(array):
                ^~~~~
```

This is because Mojo is a statically typed language. You have to explicitly specify the type of the argument and the type of the return value, so that the compiler can allocate the correct amount of memory on stack for the function call.

On the other hand, Python is a dynamically typed language. You do not need to specify the type of the argument and the return value. The Python interpreter will infer the type at runtime. If the type is not subscriptable (i.e., you cannot use `[]` to access the element), it will raise an error. You can also add type hints in Python, which is a good practice for static checks, readability and maintainability, but it is not mandatory.

The type hint in Python is something like:

```python
def bubble_sort(array: list[float]):
    ...
```

In Mojo, as mentioned above, the types may have different naming conventions. Beside Camel Case, floating-point type in Mojo is named as `Float64` instead of `float`.

```mojo
def bubble_sort(array: List[Float64]):
    ...
```

We also need to use the list constructor in your `main()` function to construct the list (just like what we did before for string). So we change the first line in the `main()` function to:

```mojo
array = List[Float64](64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49)
```

After the change, you will see that the IDE is still complaining:

```console
error: expression must be mutable in assignment
                array[j], array[j+1] = array[j+1], array[j]
                ~~~~~~~~^~~~~~~~~~~~
```

This is another important and new feature of Mojo: the arguments cannot be modified at will within the body of a function. This is to avoid unintentional changes to the original variable that is passed into the function. If you intend to change the value of the argument within the function, you have to explicitly declare the argument as ***mutable***. This is done via several special keywords in the function signature. We will discuss this more in Chapter [Functions](../basic/functions). For now, we just add the keyword `mutable` in front of the argument `array`. By doing this, we tell Mojo that we want to modify the variable `array` by using this function.

```mojo
def bubble_sort(mut array: List[Float64]):
    ...
```

Now you will see that the errors on the function `bubble_sort()` are gone. We can move forward to deal with the very last error message:

```console
error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
    print("Input array:", array)
    ~~~~~^~~~~~~~~~~~~~~~~~~~~~~
```

Oops! This seems quite annoying! We cannot use the `print()` function to print lists in Mojo, at least not possible at the moment (v25.3). Maybe in future we can do that. For now, we have to work around a little bit. Let's define a helper function to print the list. After all changes, we have our final Mojo code as follows:

```mojo
# src/move/sort.mojo
def bubble_sort(mut array: List[Float64]):
    n = len(array)
    for i in range(n):
        for j in range(0, n-1-i):
            if array[j] > array[j+1]:
                array[j], array[j+1] = array[j+1], array[j]

def print_list(array: List[Float64]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")

def main():
    array = List[Float64](64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49)
    print("Input array:", end=" ")
    print_list(array)
    bubble_sort(array)
    print("After sorting:", end=" ")
    print_list(array)
```

Running the code with `magic run mojo src/sort.mojo` will give you the same output as in Python:

```console
Input array: [64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49]
After sorting: [-12.3, -11.5, 22.0, 25.1, 34.523, 64.1, 90.49]
```

Finally successful!

For this example, we have to change more lines to adapt our Python code to Mojo, including:

- Explicitly specify the type of the arguments of the function.
- Use the list constructor to create a list and specify the type of the elements.
- Use the keyword `mutable` before arguments in function signature if you want to modify their values.
- Printing lists is currently not supported in Mojo. You have to define a helper function to print the list.

If you already use the type-hint system a lot in Python, you will not find these changes too difficult. If you do not use the type-hint system in Python, you may find it a bit annoying and frustrated. But believe me, it is a good practice to declare the types of variables and arguments of functions, in both Mojo and Python. It makes our code more readable and maintainable, and it enables the linter to do static checks and find out potential bugs before you run the code.

## Next step

With these three examples, you should have a good idea of how Mojo code looks like and how it is similar to or different from Python. You also see how powerful Mojo is in terms of performance. In the next chapters, we will investigate the concepts that are in common between Mojo and Python, so that you do not need to change your coding habits.
