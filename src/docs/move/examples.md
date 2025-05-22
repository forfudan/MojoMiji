# From Python to Mojo

In this chapter, we will look at some simple examples of Python and Mojo code. The goal is to help you have a image of how Mojo looks like and how it is similar to or different from Python.

## Multiplication table

The first example is about multiplication table ([Wiki page](https://en.wikipedia.org/wiki/Multiplication_table)). The multiplication table is a table of numbers that shows the result of multiplying two integral numbers together. When I am kid, before going to the elementary school, I was already able to memorize the Chinese multiplication table (九九乘法表 / Nine-nine song). It is a powerful tool for learning multiplication and finding the product of two numbers quickly.

So the first example is to print a multiplication table from 1 to 9. Each element would be of the form `i * j = k`. All the elements in the same row are separated by a tab character. Since the multiplication is symmetric, we do not need to repeat the calculation. For example, we skip `3 * 1 = 1` and `3 * 2 = 6` but continue with `3 * 3 = 9`.

We do this first in Python. We create a file in the `src` directory called `multiplication_table.py` and write the following code in it:

```python
def main():
    print("Nine-nine Multiplication Table")
    for i in range(1, 10):
        for j in range(i, 10):
            print("{} * {} = {}".format(i, j, i*j), end="\t")
        print()

main()
```

Then we run the code with `python src/multiplication_table.py`. The output is:

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

Now we do the same in Mojo. Let's do it quickly: just copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()` because it is not needed.

Let's compile and run this Mojo code by `magic run mojo src/multiplication_table.mojo`. You may see the following error message:

```console
error: 'StringLiteral["{} * {} = {}"]' value has no attribute 'format'
            print("{} * {} = {}".format(i, j, i*j), end="\t")
                  ~~~~~~~~~~~~~~^
```

Here we see the a difference: `format` is not a method of the string literal in Mojo. To solve this, we have to explicitly convert the string literal to a String object by enclosing the string literal with `String()` constructor. So we change the lines to:

```mojo
def main():
    print("Nine-nine Multiplication Table")
    for i in range(1, 10):
        for j in range(i, 10):
            print(String("{} * {} = {}").format(i, j, i*j), end="\t")  # Add String()
        print()
```

Now you run the code again. You will see the same output as in Python.

Great! We see that we can migrate our Python code to Mojo easily with very little modification. But we enjoy the performance of Mojo. How big is the performance gain? Let's check it out using the next example.

## Fibonacci sequence

To demonstrate the gain in speed, we use Fibonacci sequence as an example. The Fibonacci sequence is a sequence of numbers in which each number is the sum of the two preceding ones, usually starting with 0 and 1.

What we want to do is to calculate the first 40 Fibonacci numbers and print them out (also print the index). Although there is a more efficient way to implement this, I will use the recursive method so that we can see the performance difference between Python and Mojo.

Let's create a file in the `src` directory called `fibonacci.py` and write the following code in it:

```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(40):
        print(fib(i), end=", ")

main()
```

Let's run the code with the command `python src/fibonacci.py`. The output is:

```console
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986,
```

On my machine (Apple M4 Pro), it takes about ***24 seconds*** to run the code. This is because the recursive method is very inefficient. The time complexity is exponential. Let's migrate the code to Mojo and see how fast it is.

Just like what we did in the previous example, we copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()`.

Now you will see that the Mojo linter is complaining about the first line of the code. It highlights the type hints `int` and tells you "use of unknown declaration 'int'". Running the code will also give your the same error. This is because Mojo's built-in integral type is called `Int` (with capital "I") which is different from Python. So we need to change the type hints from `int` to `Int`.

```mojo
def fib(n: Int) -> Int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(40):
        print(fib(i), end=", ")
```

Let's run the code again with `magic run mojo src/fibonacci.mojo`. On my machine, it takes around ***0.35*** seconds.

See, a huge performance gain! The Mojo code is more than ***50 times*** faster than the Python code. What we did is just copying-pasting from the Python code and making small modifications, but we gained a performance comparable to C.

::: tip naming convention of Mojo type

In Python, types and classes are usually named with CamelCase. But there are some exceptions: primitive types like `int`, `float`, `str`, etc, are name with lowercase. For consistency, Mojo uses CamelCase for all types and classes. So `int` in Python is `Int` in Mojo, `float` is `Float64`, `str` is `String`, etc.

:::

::: tip Why Mojo is faster than Python?

The main reason is that Mojo is a compiled language which is complied to machine code via LLVM and then executed directly by the CPU. Python, on the other hand, is an interpreted language. It is compiled to bytecode and is then interpreted by the Python virtual machine. This leads to a lot of work at runtime that slows down the execution.

There are some other reasons why Mojo is much faster. In this example. One reason is that the Python's integral type is different from Mojo's integral type. The `int` type in Python is actually a big integer type which can be arbitrarily large. This means that every `int` type requests memory allocation and deallocation on heap. In Mojo, `Int` is a fixed-size integer type (32-bit or 64-bit depending on the system) and it is allocated on stack.

::: info Comparison with C and Rust

Maybe now you are curious about the performance of Mojo code compared to C and Rust. So I also tried to implement the same code in C and Rust.

I also increase the number of Fibonacci numbers to ***50***. The C code is as follows:

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
    let n: i64 = 50;
    for i in 0..n {
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

The reults are as follows:

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

:::

## Sort numbers

The next, and the last example, is to sort an array of numbers. There are many sorting algorithms. We will use the bubble sort algorithm because it is relatively simple and won't take too many lines of code.

The bubble sort algorithm repeatedly scan through the array, compares each pair of adjacent elements and swaps them if they are in the wrong order.

Let's do this first in Python. We create a file in the `src` directory called `sort.py` and write the following code in it:
