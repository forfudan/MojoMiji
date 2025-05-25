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

### `fn` keyword

The `fn` keyword is unique to Mojo and is not present in Python. It is another way to define a function. The `def` keyword and the `fn` keyword share the most of the functionality, with very small differences. We will discuss the differences in detail [at the end of this chapter](#def-vs-fn), but here is a brief summary:

1. The `fn` keyword requires you to use `raises` keyword to indicate the exceptions that may be raised by the function.
1. If a function is defined with `fn`, the arguments are immutable by default, and you cannot change the values of the arguments within the function. If a function is defined with `def`, the arguments are immutable by default, but changing the values of the arguments will create a mutable copy of them.

You can choose either way to declare functions in Mojo. But I would recommend you to use `fn` for functions that you want to be more strict about the types and behaviors.

::: info Is `fn` pythonic?

Interestingly, the word `fn` itself does not look Pythonic. Python usually truncates the words from left, e.g., `def`. Maybe `func` is a more Pythonic keyword. Nevertheless, Rust users may find `fn` friendly.

:::

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

To determine whether a passed-in value can be modified by the function, Mojo uses several keywords to define the behavior of the arguments.

Although Mojo has ownership system, it is different from Rust's. In Rust, if you pass a value into function, the function will take over the ownership of the value. The value is inaccessible after using the function. In order to use the value in a function without transferring the ownership to it, one could pass a reference or mutable reference of the value into the function, e.g., `&a` or `&mut a`.

In Mojo, you can directly pass the value into the function. The function will take a reference (alias) of the value. This reference (alias) will behave the same as the value you passed in. The mutability of the arguments is defined by several keywords, namely, `read`, `mut`, `owned` and `out`.

::: warning Reference

The term "reference" means differently in Mojo compared to Rust. Moreover, the ownership model of Mojo is significantly different from that of Rust's. For more information on "reference", please refer to the page [reference](../misc/reference).
:::

::: info

The keyword `read` was named as `borrowed` before v24.6. The keyword `mut` was named as `inout` before v24.6.

:::

### Keyword `read`

If an argument is declared with the keyword `read`, then a read-only reference of the value is passed into the function. The function can access the value stored at certain address in the memory without a copy [^copy], but it will not modify the value at the address.

The read-only reference behaves the same as the value it refers to. An example goes as follows.

```mojo
fn copyit(read some: List[Int]) -> List[Int]:
    b = some.copy()
    return b

def main():
    var lst = List[Int](1, 2, 3, 4)
    var new_lst = copyit(lst)
    for i in new_lst:
        print(i[])
```

When you pass the list `lst` into the function `copyit()`, Mojo creates read-only, immutable reference (alias) of `lst`. This variable `some` points to the same address of `lst` and behave exactly as `lst`.

The line `b = some.copy()` then calls the `copy()` method of `some`. This generates a deep copy of the list and bind it to the variable `b`.

The variable `b` is then returned by `copyit()` into `main()` and is assigned to the variable `new_lst`.

::: tip `read` as default keyword

In the Mojo programming language, when declaring a function, if no keyword is indicated in front of an argument, then it is defaulted to `read`. So the following two functions are equivalent.

```mojo
fn copyit(read some: List[Int]) -> List[Int]:
    b = some.copy()
    return b

fn copyit(some: List[Int]) -> List[Int]:
    b = some.copy()
    return b
```

:::

Since the `read` argument convention is immutable, attempting to change the value of the argument will cause an error at compile time. See the following example:

```mojo
fn changeit(read some: List[Int]) -> List[Int]:
    some[0] = 100
    return b
```

```console
error: expression must be mutable in assignment
    some[0] = 100
    ~~~~^~~
```

### keyword `mut`

The keyword `mut` allows you to pass a mutable reference of the value into the function. The function can then modify the value at its original address. It is similar to the Rust `fn foo(a: &mut i8)`, but keep in mind that the reference in Mojo is more like an alias than a safe pointer, which means a de-referencing is not needed. See the following example:

```mojo
from memory import Pointer

fn changeit(mut a: Int8):
    a = 10
    print("Address of the argument `a`: ", String(Pointer.address_of(a)))

fn main():
    var x: Int8 = 5
    print("Value of the variable `x` before change: ", x)
    print("Address of the variable `x`: ", String(Pointer.address_of(x)))
    changeit(x)
    print("Value of the variable `x` after change: ", x)
    print("Address of the variable `x`: ", String(Pointer.address_of(x)))
```

```console
Value of the variable `x` before change:  5
Address of the variable `x`:  0x16b6a8fb0
Address of the argument `a`:  0x16b6a8fb0
Value of the variable `x` after change:  10
Address of the variable `x`:  0x16b6a8fb0
```

Let's look into the code and see what has happened:

First, you create variable with the name `x` and type `Int8` and assign value `5` to it. Mojo assigns a space in the memory, which is of 1-byte (8-bit) length at the address `16b6a8fb0`. The value is `5`, so it is stored as `00000100` (binary representation of an integer 5) at the address `16b6a8fb0`. See the following illustration.

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                               ↑
                             x (Int8)
```

Next, you pass this value into the function `changeit` with the `mut` keyword. Mojo will then create a mutable reference of `x`, which is named as `a` . This reference `a` is an alias of `x`, pointing to the same address `16b6a8fb0`. See the following illustration.

```console
                             a (Int8): Mutable reference of x
                               ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                               ↑
                             x (Int8)
```

Then, you assign a value `10` to the `a`. Since `a` is a mutable reference of `x`, this re-assignment is allowed. The line of code is equivalent to re-assigning the value `10` to `x`. The new value `00001010` (binary representation of the integer 10) is then stored into the memory location of `x` at address `16b6a8fb0`. Now the updated illustration of the memory goes as follows.

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00001010│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                              ↑
                             x (Int8)
```

::: tip Equivalent code in Rust

The code above, if written in Rust, looks like:

```rust
fn changeit(a: &mut i8) {
    *a = 10;
}

fn main() {
    let mut x: i8 = 5;
    changeit(&mut x);
    println!("x = {}", x);
}
```

Let's compare it again with Mojo.

```mojo
fn changeit(mut a: Int8):
    a = 10

fn main():
    var x: Int8 = 5
    changeit(x)
    print("x =", x)
```

:::

## def vs fn

Now let's go back to the differences between `fn` and `def`.

If a function is defined with `fn`, the arguments are immutable by default (equals to the `read` modifier), and you cannot change the values of the arguments within the function. The following example will cause a compilation error:

```mojo
fn change_value_in_fn(x: Int):
    x = 2
    print(x)

def main():
    var a = 1
    change_value_in_fn(a)
    print(a)
```

```console
error: expression must be mutable in assignment
    x = 2
    ^
```

If a function is defined with `def`, the arguments are immutable by default, but changing the values of the arguments will create a mutable copy of them.

This sounds confusing. Let's try to understand it by looking at the following example:

```mojo
def change_value_in_def(x: Int):
    print("===============================")
    print("Calling `change_value_in_def()`")
    print("x =", x, "at address", String(Pointer(to=x)))
    x = 2
    print("Change x to 2")
    print("x =", x, "at address", String(Pointer(to=x)))
    print("===============================")

def main():
    var a = 1
    print("Initializing a to 1")
    print("a =", a, "at address", String(Pointer(to=a)))
    change_value_in_def(a)
    print("a =", a, "at address", String(Pointer(to=a)))
```

This code runs without any error, and the output is as follows:

```console
Initializing a to 1
a = 1 at address 0x16d4d0960
===============================
Calling `change_value_in_def()`
x = 1 at address 0x16d4d09c0
Change x to 2
x = 2 at address 0x16d4d0998
===============================
a = 1 at address 0x16d4d0960
```

Now we try to understand the words above:

***If a function is defined with `def`, the arguments are immutable by default.*** It means that calling the function will not change the value of the variable you passed in. In the example above, the value `a` is not changed after calling `change_value_in_def()`.

***Changing the values of the arguments will create a mutable copy of them.*** It means that, if you try to change the value of the argument `x` within the function, it is possible. In the backend, Mojo will create a mutable copy of `x` (at a new address) and assign the new value `2` to it. The new `x` is no longer pointing to the same memory address as `a`. In the example above, you see that when you change the value of `x` to `2`, the address of `x` is changed, meaning that a mutable copy of `x` is created.

[^copy]: For some small structs, a copy is made.
