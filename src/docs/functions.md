# Functions

## Declaration

In Python, functions are declared using the `def` keyword. For example, the following functions returns the sum of two numbers (with or without type hints.)

```python
def mysum(a, b):
    return a + b

def mysum(a: int, b: int) -> int:
    return a + b
```

In Mojo, functions can either be declared with the `def` keyword or with the `fn` keyword.

### `def` keyword

Using the `def` keyword to declare a function would allow you to enjoy some freedom that Python has. For example, you do not need to declare the types of the arguments and returns. You do not need to use the `raises` keyword for functions that may raise an error. For example, the following functions are valid in mojo.

```mojo
def mysum(a, b):
    return a + b

def mysum(a: Int, b: Int) -> Int:
    return a + b
```

The `def` functions in mojo do not always behave in the same manner as those in Python. Finally, these are different programming languages. Nevertheless, declaring functions by `def` is a good starting point if you are familiar with Python and want to try out Mojo.

Yuhao highly recommends you to use `fn` always to declare functions, which gives you more control over the functions you are writing.

### `fn` keyword

The `fn` keyword is unique to Mojo and is not present in Python. It is one of the features that allow Mojo to accomplish low-level programming objectives.

Interestingly, the word `fn` itself does not look Pythonic. Python usually truncates the words from left, e.g., `def`. Maybe `func` is a more Pythonic keyword. Nevertheless, Rust users may find `fn` friendly.

To declare a function by the `fn` keyword, you have to explicitly indicate the types of arguments and returns. Failing to indicate types will cause the compilation to fail. For example,

```mojo
fn mysum(a: Int, b: Int) -> Int:
    return a + b
```

Whenever you call the function `mysum`, the compiler checks whether the types of the values passed into the function match with the types that are indicated in the function. This helps you detect bugs in your code at the compile time or at the coding time (with help of LSP).

Indicating the type of the returned value of function in `fn` can also help you to take the advantages of implicit variable declaration. Consider the following example, since the returned type of the function `mysum` is Int, you do not need to explicitly declare the type of the variable `c` during its initialization.

```mojo
fn mysum(a: Int, b: Int) -> Int:
    return a + b

var a: Int = 1
var b: Int = 2
var c = mysum(a, b)  # Equivalent to `var c: Int = mysum(a, b)`
```

## `main()` function

In mojo, all code except imports has to be wrapped in function blocks, unless you are in the REPL (Read-Eval-Print Loop) mode.

This means that you cannot directly write the following code in your Mojo file.

```mojo
# This won't work during compilation.
print(1 + 2)
```

Instead, you have to put everything in the `main()` function.

```mojo
fn main():
    print(1 + 2)
```

The `main()` function tells Mojo to start everything from here. This function may be familiar to you if you have experience with programming languages like C, Java, or Rust. In Python, the `main()` function is not needed and can be automatically inferred by the interpreter (recall the expression `if __name__ == "__main__"`).

For convenience, I will not always put the code in the `fn main()` block. If you want to test the code, please remember to put the code in the `fn main()` block in your mojo file.

## Arguments

In mojo, names appeared between the parentheses after the function name are called "arguments". They cannot be called as "parameters" because the word is reserved for other purposes. We will discuss this in other chapters.

### Positional arguments

If you call the function without writing the name of the arguments, the values will match to the arguments by their position. See the following example. The value `1` and `3.1415` are passed into the function `sumint()` without `a=` and `b=`. Thus, the values will be matched with the arguments by their position. That is, `a=1` and `b=3.1415`.

```mojo
fn sumint(a: Int, b: Float64) -> Int:
    return a + Int(b)

def main():
    var a = sumint(1, 3.1415)
    print(a)
```

### Keyword arguments

You can also call the function and write the name of the arguments, the equal sign, and the value. Then the the values will be matched with the arguments by their names.

See the following example. The argument `b` can comes before the argument `a` if you explicitly use their names.

```mojo
fn sumint(a: Int, b: Float64) -> Int:
    return a + Int(b)

def main():
    var a = sumint(b=3.1415, a=1)
    print(a)
```

### Variadic arguments

Similar with Python, you can pass in an arbitrary number of arguments into the function using `*arg`. The only difference is that the arguments must be of the same type.

See the following example. By using `*` before `flts`, you can pass in any number of `Float64` numbers into the function and get their summation. The values you passed into the function will be stored in a variadic list of floats `VariadicList[Float64]`.

```mojo
fn sumfloats(*flts: Float64) -> Float64:
    var s: Float64 = 0
    for i in flts:
        s += i
    return s

def main():
    var a = sumfloats(0.1, 0.2, 0.3)
    print(a)

```

## Mutability of arguments