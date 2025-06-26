# Convert Python code into Mojo

In this chapter, we will look at some simple examples of Python and Mojo code. It covers the basic syntax, data types, functions, structs, control flows, error handling, and some common idioms in both languages. The goal is to help you have a image of how Mojo looks like and how it is similar to or different from Python.

[[toc]]

## Case 1: Multiplication table

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

---

Now we program in Mojo. A clever way is to simply copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()` because it is not needed.

Let's compile and run this Mojo code by `magic run mojo src/move/multiplication_table.mojo`. You may see the following error message:

```console
error: 'StringLiteral["{} * {} = {}"]' value has no attribute 'format'
            print("{} * {} = {}".format(i, j, i*j), end="\t")
                  ~~~~~~~~~~~~~~^
```

Here we see another difference between Python and Mojo: `format` is not a method of the string literal in Mojo. This is because, in Python, we do not need differentiate between string and string literal ourselves, because the latter type is coerced to the first type when you call a str method. The contents between quotation marks ("") is of `str` type and you can use the `format()` method. However, in Mojo, we do differentiate between string and string literal. I will discuss more about string in Chapter [String](../basic/string).

For now, to fix the error, we have to explicitly convert the string literal to a String object by calling the `String()` constructor. So we change the line to:

```mojo
...
            print(String("{} * {} = {}").format(i, j, i*j), end="\t")
...
```

Now you run the code again. You will see the same output as in Python.

For your comparison, I put the complete Mojo code as well as the Python code below:

::: code-group

```mojo
# src/move/multiplication_table.mojo
def main():
    print("Nine-nine Multiplication Table")
    for i in range(1, 10):
        for j in range(i, 10):
            print(String("{} * {} = {}").format(i, j, i * j), end="\t")
        print()
```

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

:::

Great! We see that we can migrate our Python code to Mojo easily with very little modification. But we enjoy the performance of Mojo. How big is the performance gain? Let's check it out using the next example.

::: tip Difference between Python and Mojo

The table below summarizes the differences between Python and Mojo in this example.

| Feature           | Python                                | Mojo                                            |
| ----------------- | ------------------------------------- | ----------------------------------------------- |
| `main()` function | Not needed                            | Mandatory as an entry point                     |
| String type       | str literal is coerced to str type    | You have to explicitly use `String` constructor |
| String formatting | `str.format()` method                 | `String().format()` method                      |
| f-strings         | Supported                             | Not supported (yet)                             |
| formatted values  | Supported, e.g., `{:0.2f}`, `{:0.3%}` | Not supported (yet)                             |

:::

## Case 2: Fibonacci sequence

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

On my machine (Apple M4 Pro), it takes about ***24 seconds*** to run the code. This is because the recursive method is very inefficient. The time complexity is exponential.

---

Let's migrate the code to Mojo and see how fast it is.

Just like what we did in the previous example, we copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()`.

Now you will see that your IDE is complaining about the first line of the code. It highlights the type hints `int` and tells you `use of unknown declaration 'int'`. Running the code will also give your the same error. This is because Mojo's built-in integral type is called `Int` (with capital "I") which is different from Python. So we need to change the type hints from `int` to `Int`. The modified code is as follows:

::: code-group

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

:::

Let's run the code again with `pixi run mojo src/move/fibonacci.mojo`. On my machine, it takes around ***0.35*** seconds only.

See, a huge performance gain! The Mojo code is more than ***50 times*** faster than the Python code. What we did is just copying-pasting from the Python code and making small modifications, but we gained a performance comparable to C.

::: tip Difference between Python and Mojo

The table below summarizes the differences between Python and Mojo in this example.

| Feature       | Python              | Mojo                       |
| ------------- | ------------------- | -------------------------- |
| Integral type | `int` (big integer) | `Int` (fixed-size integer) |

:::

::: tip Naming convention of Mojo type

In Python, types and classes are usually named with CamelCase. But there are some exceptions: primitive types like `int`, `float`, `str`, etc, are name with lowercase. For consistency, Mojo uses CamelCase for all types and classes. So `int` in Python is `Int` in Mojo, `float` is `Float64`, `str` is `String`, etc.

:::

::: tip Why Mojo is faster than Python?

The main reason is that Mojo is a compiled language which is complied to machine code via LLVM and then executed directly by the CPU. Python, on the other hand, is an interpreted language. It is compiled to bytecode and is then interpreted by the Python virtual machine. This leads to a lot of work at runtime that slows down the execution.

There are some other reasons why Mojo is much faster. In this example. One reason is that the Python's integral type is different from Mojo's integral type. The `int` type in Python is actually a big integer type which can be arbitrarily large. This means that every `int` type requests memory allocation and deallocation on heap. In Mojo, `Int` is a fixed-size integer type (32-bit or 64-bit depending on the system) and it is allocated on stack.

:::

:::::: info Speed comparison with C and Rust

Now you know that Mojo is much faster than Python. You may wonder how the performance of Mojo is compared to C and Rust. So I also implement the same code in C and Rust.

To give some stress to these languages, I increase the number of Fibonacci numbers to ***50*** (Do not do this in Python unless you want to take a long shower 😉).

The C, Rust, Mojo, and Python codes are as follows:

::: code-group

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

```mojo
def fib(n: Int) -> Int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(50):
        print(fib(i), end=", ")
```

```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

def main():
    for i in range(50):
        print(fib(i), end=", ")

main()
```

:::

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

::::::

## Case 3: Sort numbers

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

We can visually verify that the array is correctly sorted in ascending order.

---

Now we try to migrate the code to Mojo. Just like what we did in the previous examples, we copy the above Python file and change the file extension to `.mojo`. Then we remove the last line `main()`.

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

After the change, you will see that the IDE is still complaining:

```console
error: expression must be mutable in assignment
                array[j], array[j+1] = array[j+1], array[j]
                ~~~~~~~~^~~~~~~~~~~~
```

This is another important and new feature of Mojo: the arguments cannot be modified at will within the body of a function. This is to avoid unintentional changes to the original variable that is passed into the function. If you intend to change the value of the argument within the function, you have to explicitly declare the argument as ***mutable***. This is done via several special keywords in the function signature. We will discuss this more in Chapter [Functions](../basic/functions). For now, we just add the keyword `mut` in front of the argument `array`. By doing this, we tell Mojo that we want to modify the variable `array` by using this function.

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

::: code-group

```mojo
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
    array = [64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49]
    print("Input array:", end=" ")
    print_list(array)
    bubble_sort(array)
    print("After sorting:", end=" ")
    print_list(array)
```

```python
def bubble_sort(array: list[float]):
    n = len(array)
    for i in range(n):
        for j in range(0, n-1-i):
            if array[j] > array[j+1]:
                array[j], array[j+1] = array[j+1], array[j]

def print_list(array: list[float]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")

def main():
    array = [64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49]
    print("Input array:", end=" ")
    print_list(array)
    bubble_sort(array)
    print("After sorting:", end=" ")
    print_list(array)

main()
```

:::

Running the code with `magic run mojo src/sort.mojo` will give you the same output as in Python:

```console
Input array: [64.1, 34.523, 25.1, -12.3, 22.0, -11.5, 90.49]
After sorting: [-12.3, -11.5, 22.0, 25.1, 34.523, 64.1, 90.49]
```

Finally successful!

For this example, we have to change more lines to adapt our Python code to Mojo, including:

- Explicitly specify the type of the arguments of the function.
- Use the list constructor to create a list and specify the type of the elements.
- Use the keyword `mut` before arguments in function signature if you want to modify their values.
- Printing lists is currently not supported in Mojo. You have to define a helper function to print the list.

If you already use the type-hint system a lot in Python, you will not find these changes too difficult. If you do not use the type-hint system in Python, you may find it a bit annoying and frustrated. But believe me, it is a good practice to declare the types of variables and arguments of functions, in both Mojo and Python. It makes our code more readable and maintainable, and it enables the linter to do static checks and find out potential bugs before you run the code.

::: tip Difference between Python and Mojo

The table below summarizes the differences between Python and Mojo in this example.

| Feature                               | Python              | Mojo                       |
| ------------------------------------- | ------------------- | -------------------------- |
| Integral type                         | `int` (big integer) | `Int` (fixed-size integer) |
| Type annotation in function signature | Optional            | Mandatory                  |
| Annotation for the list type          | `list[float]`       | `List[Float64]`            |
| Types of elements in a list           | Heterogeneous       | Homogeneous                |
| Mutable argument                      | Default             | Must use `mut` keyword     |
| Print list with `print()`             | Supported           | Not supported (yet)        |

:::

## Case 4: Triangle type

In the last example, we will look into a more complex data structure of Python: "class". Class is a container for variables (attributes) and functions (methods), so that these variables and functions can be accessed via a uniformed interface. It also allows us to achieve the object-oriented programming (OOP )paradigm, which is a powerful way to organize our code and data.

In this example, we will define a class to represent a triangle. The `Triangle` class (1) reads in three sides from the user, (2) saves these sides as attributes, and (3) do some verification to check if the three sides can form a valid triangle. The `Triangle` class also contains two methods: one to calculate the perimeter of the triangle and another to calculate the area of the triangle using Heron's formula:

$$
S = \sqrt{s (s-a)(s-b)(s-c)}
$$

Now let's do this in Python first. We create a file in the `src/move/` directory called `triangle.py` and write the code in it.

As a Pythonista, you may want to do this yourself first since it is not difficult. If you are not sure how to do this, you can refer to the code below.

Note that I will use a more stricter style of Python code, which means that I will include "docstrings" for the class and the methods. I will also use type annotations for variables and arguments if necessary.

```python
# src/move/triangle.py
class Triangle:
    """A class to represent a triangle."""

    def __init__(self, a: float, b: float, c: float):
        """Initializes a triangle with three sides.

        Parameters:
            a (float): Length of side a.
            b (float): Length of side b.
            c (float): Length of side c.

        Raises:
            ValueError: If the lengths do not form a valid triangle.
        """
        self.a = a
        self.b = b
        self.c = c

        if (
            (self.a + self.b <= self.c)
            or (self.a + self.c <= self.b)
            or (self.b + self.c <= self.a)
        ):
            raise ValueError("The lengths of sides do not form a valid triangle.")

    def area(self) -> float:
        """Calculates the area of the triangle using Heron's formula.

        Returns:
            float: The area of the triangle.
        """
        s = (self.a + self.b + self.c) / 2
        return (s * (s - self.a) * (s - self.b) * (s - self.c)) ** 0.5

    def perimeter(self) -> float:
        """Calculates the perimeter of the triangle.

        Returns:
            float: The perimeter of the triangle.
        """
        return self.a + self.b + self.c

    def __str__(self) -> str:
        """Returns a string representation of the triangle.

        Returns:
            A string representation of the triangle.

        Notes:
            You can use the `str()` or `print()` to call this method.
        """
        return f"Triangle(a={self.a}, b={self.b}, c={self.c})"


def main():
    # A valid triangle with sides 3, 4, and 5
    print("Creating a valid triangle with sides 3, 4, and 5:")
    triangle = Triangle(3, 4, 5)
    print(triangle)
    print(f"Area: {triangle.area()}")
    print(f"Perimeter: {triangle.perimeter()}")

    # An invalid triangle with sides 1, 2, and 3
    print("\nCreating an invalid triangle with sides 1, 2, and 3:")
    try:
        invalid_triangle = Triangle(1, 2, 3)
        print(invalid_triangle)
    except ValueError as e:
        print(f"Error: {e}")


main()
```

Now we run the code with `python src/move/triangle.py`. The output is:

```console
Creating a valid triangle with sides 3, 4, and 5:
Triangle(a=3, b=4, c=5)
Area: 6.0
Perimeter: 12

Creating an invalid triangle with sides 1, 2, and 3:
Error: The lengths of sides do not form a valid triangle.
```

It is as expected. The first triangle is a valid triangle with sides 3, 4, and 5. The area is 6.0 and the perimeter is 12. The second triangle is not a valid triangle with sides 1, 2, and 3, so it raises a `ValueError` exception. This exception was successfully caught by the try-except statement and printed out.

---

Now, let's migrate the code to Mojo. Just like what we did in the previous examples, we copy the above Python file and change the file extension to `.mojo`.

We first do some simple changes to the code using the knowledge we have learned so far:

- We change the type hints from `float` to `Float64` and from `str` to `String`.
- We use `String` constructor to create the string and use `format()` method instead of "f-string".
- Remove `main()` at the end of the file.

After these changes, we have the following code:

```mojo
# src/move/triangle_from_py.mojo
# Adapted from Python code with preliminary changes
# It is not guaranteed to run successfully yet
class Triangle:
    """A class to represent a triangle."""

    def __init__(self, a: Float64, b: Float64, c: Float64):
        """Initializes a triangle with three sides.

        Parameters:
            a (Float64): Length of side a.
            b (Float64): Length of side b.
            c (Float64): Length of side c.

        Raises:
            ValueError: If the lengths do not form a valid triangle.
        """
        self.a = a
        self.b = b
        self.c = c

        if (
            (self.a + self.b <= self.c)
            or (self.a + self.c <= self.b)
            or (self.b + self.c <= self.a)
        ):
            raise ValueError(
                "The lengths of sides do not form a valid triangle."
            )

    def area(self) -> Float64:
        """Calculates the area of the triangle using Heron's formula.

        Returns:
            Float64: The area of the triangle.
        """
        s = (self.a + self.b + self.c) / 2
        return (s * (s - self.a) * (s - self.b) * (s - self.c)) ** 0.5

    def perimeter(self) -> Float64:
        """Calculates the perimeter of the triangle.

        Returns:
            Float64: The perimeter of the triangle.
        """
        return self.a + self.b + self.c

    def __str__(self) -> String:
        """Returns a string representation of the triangle.

        Returns:
            A string representation of the triangle.

        Notes:
            You can use the `str()` or `print()` to call this method.
        """
        return String("Triangle(a={}, b={}, c={})").format(
            self.a, self.b, self.c
        )


def main():
    # A valid triangle with sides 3, 4, and 5
    print("Creating a valid triangle with sides 3, 4, and 5:")
    triangle = Triangle(3, 4, 5)
    print(triangle)
    print(String("Area: {}").format(triangle.area()))
    print(String("Perimeter: {}").format(triangle.perimeter()))

    # An invalid triangle with sides 1, 2, and 3
    print("\nCreating an invalid triangle with sides 1, 2, and 3:")
    try:
        invalid_triangle = Triangle(1, 2, 3)
        print(invalid_triangle)
    except ValueError as e:
        print("Error:", e)
```

This will be the starting point of our Mojo code. You will see many error messages when you run the code with `magic run mojo src/move/triangle_from_py.mojo`. The first error message is, which should also be highlighted by the IDE is about the first line:

```console
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:1:1: error: classes are not supported yet
class Triangle:
^
```

Ah, "classes are not supported yet" in Mojo! This is a bit disappointing to you. You may ask: does this mean that Mojo cannot fulfill the OOP paradigm? The answer is no. Mojo does not support classes yet, but it supports a similar concept called "**struct**".

Structs are similar to classes, containing variables (fields) and functions (methods). They can achieve encapsulation, data abstraction, polymorphism. The only thing that structs do not support is inheritance. It means that you cannot create a new struct that inherits from an existing struct. It is a different design philosophy called "composition", which is still a way to achieve OOP paradigm. We will discuss more about structs in Chapter [Structs](../basic/structs).

If we do not use inheritance, structs in Mojo are almost the same as classes in Python. So we can simply change the keyword `class` to `struct`:

```mojo
struct Triangle:
    ...
```

There will be no error message for this line anymore, so do the next line, the docstring. Yes, Mojo supports exactly the same docstring syntax as Python. You can learn more about docstring in Section [Documentation string](../move/common.md#documentation-string).

The next error message is about the `__init__` method.

```console
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:4:18: error: argument type must be specified
    def __init__(self, a: float, b: float, c: float):
```

This method in Python is a special method to create an instance of the class by using the class name as a constructor, e.g., `Triangle(3, 4, 5)`. In Mojo, we have the same philosophy, we also use `__init__()` as a constructor, but we have to explicitly specify the "ownership modifier" of the first argument `self` as `out`. This indicates that the `__init__()` method will create a new instance of the struct as an output. (`out` is a abbreviation of "output".)

We then update the first line of the `__init__()` method, by adding the `out` keyword before `self`, and by changing the type of the three arguments from `float` to `Float64`:

```mojo
...
def __init__(out self, a: Float64, b: Float64, c: Float64):
    ...
...
```

The next warning message is about the docstring of the `__init__()` method. It says:

```console
unknown parameter 'a (float)' in doc string
```

This is because Mojo uses "**argument**" to refer to both Python's "parameter" and "argument". Mojo then use "**parameter** to refer to something else, a run-time constant. We will discuss more about the difference between argument and parameter in Chapter [Functions](../basic/functions#declaration-and-usage) and Chapter [Parameterization](../advanced/parameterization.md).

For now, we just change the docstring to use "Args" instead of "Parameters". Moreover, we remove the type of the arguments in the docstring, because we have already specified the types in the function signature:

```mojo
...
"""
Args:
    a: Length of side a.
    b: Length of side b.
    c: Length of side c.
"""
...
```

The next error message is the first line in the body of the `__init__()` method:

```console
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:15:13: error: 'Triangle' value has no attribute 'a'
        self.a = a
        ~~~~^
```

"What does this mean", you may ask?

As mentioned above, Mojo is a statically typed language. It does not allow you to create new attributes on the fly. You have to declare the attributes in the struct definition, so that Mojo can allocate the correct amount of memory for the struct instance. When the `__init__()` function is called, it will copy the values you pass in into the allocated memory.

So, we need to explicitly declare the attributes `a`, `b`, and `c` in the struct definition. This is done by using the `var` keyword before the attribute name, a colon `:` and the type of the attribute. The code after the change looks like this:

```mojo
struct Triangle:
    """A class to represent a triangle."""

    # Declare attributes
    var a: Float64
    var b: Float64
    var c: Float64
    
    ...
```

The next error message is about the error we raised when the three sides do not form a valid triangle:

```console
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:29:19: error: use of unknown declaration 'ValueError'
            raise ValueError("The lengths of sides do not form a valid triangle.")
                  ^~~~~~~~~~
```

This is because Mojo does not have the built-in exception `ValueError` like Python. Instead, Mojo has a more general exception called `Error`. So we change the line to:

```mojo
raise Error("The lengths of sides do not form a valid triangle.")
```

After this change, you will be happy to see that there are no more error message in the body of the struct `Triangle`.

---

Then we come to the main function. The first error message is about printing the triangle:

```console
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:64:10: error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
    print(triangle)
    ~~~~~^~~~~~~~~~
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:64:11: note: failed to infer parameter 'Ts', argument type 'Triangle' does not conform to trait 'Writable'
    print(triangle)
          ^~~~~~~~
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:1:1: note: function declared here
struct Triangle:
^
```

Ah, it is the same error as we had in the previous example when we tried to print a list. The core message is "argument type 'Triangle' does not conform to trait 'Writable'". What does this mean? Maybe you have to wait until you reach Chapter [Generic and traits](../advanced/generic). For now, you can understand this issue in the following way:

In Python, when you call `print(triangle)`, Python interpreter will automatically call the `__str__()` method of the `Triangle` class to get a string representation of the triangle. That is to say, `print(triangle)` will be expanded to `print(triangle.__str__())`.

In Mojo, however, it is not possible. the `__str__()` method is only used for the purposes of **converting the instance to a string**, by calling the constructor `String(triangle)`. In order to **print** out an instance, you have to implement another method called `write_to()` in the struct.

I am not going to write this `write_to()` method for you here because it covers some other concepts. A quick and easy workaround is to simply use the `String()` constructor to first convert the instance to a string, and then use the `print()` function to print the string. So we change the line to:

```mojo
print(String(triangle))
...
print(String(invalid_triangle))
```

Moreover, for some special double underscore methods like `__str__()`, Mojo requires you to explicitly include the related trait in the struct signature. Here, the `__str__()` method is corresponding to the trait `StringableRaising`. This knowledge is too advanced for beginners and we will discuss this in details in Chapter [Generic and Traits](../advanced/generic.md). For now, we just add the trait name to the struct signature:

```mojo
struct Triangle(StringableRaising):
    ...
```

Finally, we come to the last error message, which is about try-except statement:

```console
/Users/ZHU/Programs/my-first-mojo-project/src/move/triangle.mojo:73:18: error: expected ':' after 'except'
    except Error as e:
                 ^
```

The reason is simple: Mojo does not support the `as` keyword in the `except` clause. So we change the line to:

```mojo
except e:
    print("Error:", e)
```

After all these changes, we have our final Mojo code as follows:

::: code-group

```mojo
# src/move/triangle.mojo
struct Triangle(StringableRaising):
    """A class to represent a triangle."""

    # Declare attributes
    var a: Float64
    var b: Float64
    var c: Float64

    def __init__(out self, a: Float64, b: Float64, c: Float64):
        """Initializes a triangle with three sides.

        Args:
            a: Length of side a.
            b: Length of side b.
            c: Length of side c.

        Raises:
            ValueError: If the lengths do not form a valid triangle.
        """
        self.a = a
        self.b = b
        self.c = c

        if (
            (self.a + self.b <= self.c)
            or (self.a + self.c <= self.b)
            or (self.b + self.c <= self.a)
        ):
            raise Error("The lengths of sides do not form a valid triangle.")

    def area(self) -> Float64:
        """Calculates the area of the triangle using Heron's formula.

        Returns:
            Float64: The area of the triangle.
        """
        s = (self.a + self.b + self.c) / 2
        return (s * (s - self.a) * (s - self.b) * (s - self.c)) ** 0.5

    def perimeter(self) -> Float64:
        """Calculates the perimeter of the triangle.

        Returns:
            Float64: The perimeter of the triangle.
        """
        return self.a + self.b + self.c

    def __str__(self) -> String:
        """Returns a string representation of the triangle.

        Returns:
            A string representation of the triangle.

        Notes:
            You can use the `str()` or `print()` to call this method.
        """
        return String("Triangle(a={}, b={}, c={})").format(
            self.a, self.b, self.c
        )


def main():
    # A valid triangle with sides 3, 4, and 5
    print("Creating a valid triangle with sides 3, 4, and 5:")
    triangle = Triangle(3, 4, 5)
    print(String(triangle))
    print(String("Area: {}").format(triangle.area()))
    print(String("Perimeter: {}").format(triangle.perimeter()))

    # An invalid triangle with sides 1, 2, and 3
    print("\nCreating an invalid triangle with sides 1, 2, and 3:")
    try:
        invalid_triangle = Triangle(1, 2, 3)
        print(String(invalid_triangle))
    except e:
        print("Error:", e)
```

```python
# src/move/triangle.py
class Triangle:
    """A class to represent a triangle."""

    # Declare attributes
    a: float
    b: float
    c: float

    def __init__(self, a: float, b: float, c: float):
        """Initializes a triangle with three sides.

        Parameters:
            a (float): Length of side a.
            b (float): Length of side b.
            c (float): Length of side c.

        Raises:
            ValueError: If the lengths do not form a valid triangle.
        """
        self.a = a
        self.b = b
        self.c = c

        if (
            (self.a + self.b <= self.c)
            or (self.a + self.c <= self.b)
            or (self.b + self.c <= self.a)
        ):
            raise ValueError("The lengths of sides do not form a valid triangle.")

    def area(self) -> float:
        """Calculates the area of the triangle using Heron's formula.

        Returns:
            float: The area of the triangle.
        """
        s = (self.a + self.b + self.c) / 2
        return (s * (s - self.a) * (s - self.b) * (s - self.c)) ** 0.5

    def perimeter(self) -> float:
        """Calculates the perimeter of the triangle.

        Returns:
            float: The perimeter of the triangle.
        """
        return self.a + self.b + self.c

    def __str__(self) -> str:
        """Returns a string representation of the triangle.

        Returns:
            A string representation of the triangle.

        Notes:
            You can use the `str()` or `print()` to call this method.
        """
        return f"Triangle(a={self.a}, b={self.b}, c={self.c})"


def main():
    # A valid triangle with sides 3, 4, and 5
    print("Creating a valid triangle with sides 3, 4, and 5:")
    triangle = Triangle(3, 4, 5)
    print(triangle)
    print(f"Area: {triangle.area()}")
    print(f"Perimeter: {triangle.perimeter()}")

    # An invalid triangle with sides 1, 2, and 3
    print("\nCreating an invalid triangle with sides 1, 2, and 3:")
    try:
        invalid_triangle = Triangle(1, 2, 3)
        print(invalid_triangle)
    except ValueError as e:
        print(f"Error: {e}")


main()
```

:::

Compiling and running the code with `magic run mojo src/move/triangle.mojo` generates no error messages and gives the expected output:

```console
Creating a valid triangle with sides 3, 4, and 5:
Triangle(a=3.0, b=4.0, c=5.0)
Area: 6.000000000120229
Perimeter: 12.0

Creating an invalid triangle with sides 1, 2, and 3:
Error: The lengths of sides do not form a valid triangle.
```

This example is more complex than the previous ones, you may need some more time and effort to understand and adapt to the differences between Python and Mojo. But it is a good starting point to learn how to write Mojo code and how to use the features of Mojo to achieve the same functionality as in Python.

::: tip Difference between Python and Mojo

The table below summarizes the differences between Python and Mojo in this example.

| Feature                            | Python                    | Mojo                                                |
| ---------------------------------- | ------------------------- | --------------------------------------------------- |
| Define type                        | `class` keyword           | `struct` keyword                                    |
| Inheritance                        | Supported                 | Not supported                                       |
| Attributes                         | No declaration needed     | Declared in struct definition with keyword `var`    |
| Argument of the type itself        | `self`                    | `self`, but following the keyword `out`             |
| Parameter vs argument in docstring | `Parameters` in docstring | `Args` in docstring                                 |
| Exception classes                  | Several built-in classes  | `Error` is the only built-in exception class        |
| `print()` calls                    | `__str__()` method        | `write_to()` method                                 |
| `__str__()` is used for            | `print()` and `str()`     | Only for string conversion via `String()`           |
| Trait names                        | Not applicable            | Must be explicitly included in the struct signature |
| `as` in except statement           | Supported                 | Not supported                                       |

:::

::: tip `write_to()` method

If you want to implement the `write_to()` method to print the triangle directly, you can do it like this:

```mojo
fn write_to[T: Writer](self, mut writer: T):
    """Writes the complex number to a writer."""
    writer.write("Triangle(a=", self.a, ", b=", self.b, ", c=", self.c, ")")
```

Then you can call `print(triangle)` directly without using `String()`.

```mojo
print(triangle)
```

This will print the triangle in the same way as `print(String(triangle))`:

```console
Triangle(a=3.0, b=4.0, c=5.0)
```

:::

## Next step

With these four examples, you should already have a good idea of how Mojo code looks like and how it is similar to or different from Python. You also see how powerful Mojo is in terms of performance. In the next chapters, we will investigate the concepts that are in common between Mojo and Python, so that you do not need to change your coding habits.
