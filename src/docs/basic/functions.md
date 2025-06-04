# Functions

Now we are familiar with variables in Mojo. This chapter continue with functions.

[[toc]]

## Code re-use

Maybe in other parallelled worlds, programming and programming languages will look very different. But I believe that, no matter how the science and technologies evolves in these worlds, people (or other intelligent beings) will still come up with the concept of functions at the very early stage of their programming journey. It is because functions allow us to encapsulate pieces of code that we can reuse multiple times, saving us from writing the same code over and over again. Functions also help us to organize our code in a more modular way, making it easier to maintain and share.

To quickly demonstrate the power of functions, consider the following example:

```mojo
def main():
    var pi = 3.1415
    var radius_1: Float64 = 1.0
    var area_1 = pi * radius_1 * radius_1
    print("Area of Circle 1 with radius", radius_1, "is", area_1)

    var radius_2: Float64 = 2.0
    var area_2 = pi * radius_2 * radius_2
    print("Area of Circle 2 with radius", radius_2, "is", area_2)

    var radius_3: Float64 = 3.0
    var area_3 = pi * radius_3 * radius_3
    print("Area of Circle 3 with radius", radius_3, "is", area_3)
```

In the example code, we sequentially calculate the area of three circles with different radii. The code is working, but not elegant. We have to repeat the same code three times, which is not only verbose but also difficult to maintain: In case we want to change the formula for calculating the area of a circle, we have to change it in three places.

The way to improve the code is to use functions. Functions in programming languages are similar to mathematical functions, which take some inputs and return some outputs. The very case above, if represented as a mathematical function `f(x)`, would look like this:

$y = f(x) = \pi \cdot x^2$

It takes in the variable `x` representing radius, conducts some calculation, and returns the variable `y` representing area. When you want to calculate the area of circles with different radii, you can simply call the function `f()` with the radius as the input, e.g., `f(1.0)`, `f(2.0)`, and `f(3.0)`.

In Mojo, we can similarly write a function and re-use it as follows:

```mojo
def area_of_circle(radius: Float64) -> Float64:
    var pi = 3.1415
    return pi * radius * radius

def main():
    print("Area of Circle 1 with radius 1.0 is", area_of_circle(1.0))
    print("Area of Circle 2 with radius 2.0 is", area_of_circle(2.0))
    print("Area of Circle 3 with radius 3.0 is", area_of_circle(3.0))
```

This code is much more concise and elegant. In case you want to modify the formula for calculating the area of a circle, you only need to change it in one place, i.e., the function `area_of_circle()`.

## Declaration and usage

In Mojo, functions are composed of two parts: a declaration line and a body.

- The declaration line starts with a keyword, which can be either `def` or `fn`. Then there goes function name, which must be a valid identifier. This is followed by inputs to the function, which called "parameters" or "arguments", wrapped within brackets or parentheses. Finally, there is an optional `raises` keyword and an arrowing pointing to the return type of the function.
- The body of the function is indented by four spaces. It contains the code that will be executed when the function is called.

To illustrate, the following is the general syntax of a function declaration in Mojo.

```mojo
def function_name[parameter1: Type1, parameter2: Type2, ...](argmuent1, argument2, ...) -> ReturnType:
    # function declared by `def`
    ...

fn function_name[parameter1: Type1, parameter2: Type2, ...](argmuent1, argument2, ...) raises -> ReturnType:
    # function declared by `fn`
    ...
```

Note that there is something wrapped within square brackets `[]`. This is something related to parametrization and does not appear in Python. We will cover it in Chapter [Parametrization](../advanced/parameterization.md) as an advanced topic. For now, we can safely ignore it. So the following is a simplified version of the function declaration syntax:

```mojo
```mojo
def function_name(argmuent1, argument2, ...) -> ReturnType:
    # function declared by `def`
    ...

fn function_name(argmuent1, argument2, ...) raises -> ReturnType:
    # function declared by `fn`
    ...
```

::: info Python's functions

In Python, functions are declared using the `def` keyword. For example, the following functions returns the sum of two numbers (with or without type hints.)

```python
def mysum(a, b):
    return a + b

def mysum(a: int, b: int) -> int:
    return a + b
```

:::

Using functions is easy. Just like in Python, you can call a function by its name followed by parentheses containing the arguments. For example, to call the abstract `function_name()` defined above, you can write:

```mojo
def main():
    var result = function_name(variable1, variable2)
```

In the following sections, we will dive into different aspects of functions in Mojo.

## keyword `def` and `fn`

As mentioned above, there are two keywords to declare functions in Mojo: `def` and `fn`.

### keyword `def`

The `def` keyword is borrowed from Python. I allows you to declare functions in a way that is very similar to Python, and allow you to enjoy some freedom that Python has. For example, we can translate the Python function `mysum` above into Mojo code as follows:

```mojo
def mysum(a: Int, b: Int) -> Int:
    return a + b

def main():
    var a: Int = 1
    var b: Int = 2
    var c = mysum(a, b)
```

You will see that Mojo code is almost identical with Python's code **with type hint**. We have already seen this in the previous Chapter [Convert Python code into Mojo](../move/examples.md).

But remember, in Mojo, you **have to** always indicate the types of the arguments and the return type. Failing to do so will cause a compilation error.

In the previous example, when you call the function `mysum()`, the compiler checks whether the types of the values passed into the function match with the types that are indicated in the function. This check can also be done in an early stage by the Mojo extension (LSP) in VS Code, which helps you detect bugs in your code as soon as you write it.

Indicating the type of the returned value of function in can also help Mojo compiler to infer the type of the variable that stores the return value. In the last line of the previous example, we write `var c = mysum(a, b)` but not `var c: Int = mysum(a, b)`. This is because the return type of the function `mysum` is already indicated as `Int`, so `c` can only be an `Int`. You do not need to explicitly declare the type of the variable `c` again (though it may still be helpful for readers to quickly known the type of `c`).

### keyword `fn`

The `fn` keyword is unique to Mojo and is not present in Python. It is another way to define a function. For most functionalities (I would say 95 percent of use cases), these two keywords are interchangeable. You can safely choose either.

You may then wonder why there are two keywords to declare functions in Mojo. The reason is to allow different **default behaviors** of functions:

- In `fn`, you have to use `raises` keyword to indicate the exceptions that may be raised by the function. On contrary, `def` automatically assumes that the function may raise some exceptions, so you do not need to use the `raises` keyword.
- If a function is defined with `fn`, the arguments are immutable by default,and you cannot change the values of the arguments within the function. If a function is defined with `def`, the arguments are immutable by default, but changing the values of the arguments will create a mutable copy of them.

The first one is easy: `def` automatically add `raises` to the function for you so you do not need to do that yourself. We will discuss the error-handling in Mojo in the chapters.

The second one is more difficult to understand if you are new to Mojo because it covers some concepts that are not familiar to Python users, e.g., mutability. We will discuss the differences in detail [at the end of this chapter](#def-vs-fn).

::: info Is `fn` pythonic?

In some sense, declaring a function using `def` or `fn` are equivalent. Finally, it only impacts the **default** behaviors of the function, and you can always specify your desired behaviors explicitly.

So the selection of keywords is more related to your personal preference. A Pythonista may prefer `def` because it is more Pythonistic. A Rustacean may prefer `fn` because it is more Rust-like.

From my perspective, I prefer `def` for my personal projects, but would stick to `fn` functions in projects where I need to collaborate with others. This is because `fn` is stricter and more explicit about the behaviors of the functions, e.g., mandatory `raises` keyword, not allowing argument shadowing, etc. In some cases, you may find out that you have to use `fn` keyword to define a function, e.g., `__copyinit__()` where implicit `raises` is not allowed.

Interestingly, the word `fn` itself does not look Pythonic. Python usually truncates the words from left, e.g., `def`. Maybe `func` is a more Pythonic keyword. Nevertheless, Rust users may find `fn` pleasing to the eye.

:::

## The `main()` function

You have already learned about this in your [first Mojo program](../start/hello). Let's recap it here.

In order to executing the code in a Mojo file, you have to define a function named `main()`. This is similar to many other programming languages, such as C, Java, and Rust. The `main()` function serves as the entry point of the program, where the execution starts.

There is only one exception: If you are in the REPL (Read-Eval-Print Loop) mode, such as in terminal or Jupyter Notebook, you do not need to define a `main()` function. You can write code directly in the cell and it will be executed immediately.

To demonstrate this, you open your terminal (`Command + J` in VS Code) and type `magic run mojo`, then you will enter the REPL mode. You can write code directly in the terminal, such as:

```mojo
var day = 1
var month = 1
var year = 2025
print("Today is", day, "-" , month, "-", year)
```

Click enter, and you will see the output immediately:

```console
Today is 1 - 1 - 2025
(Int) day = 1
(Int) month = 1
(Int) year = 2025
```

See that you also get a list of local variables you have defined.

::: info The main function in Python

In Python, the `main()` function is not needed. The interpreter will automatically run all the code in the file you run or import.

Notably, the Python interpreter will set the special variable `__name__` of the file that you are directly executing to `"__main__"`. Recall that we can use the expression `if __name__ == "__main__"` to prevent the code from a module from being executed when it is imported by another Python file.

Nevertheless, some Python users still define a `main()` function in their code, and then call it at the end of the file. They may find Mojo's `main()` function more comfortable. Here is a Python example with `main()` function:

```python
def main():
    print("Hello, world!")
main()  # Run the main function
```

:::

## Arguments

Arguments are the values (sometimes also the type and the address) that are passed into a function when the function is being called. Depending on use cases, an arguments can be regarded as an alias to a variable, or a copy of the variable.

::: info Arguments vs Parameters

In Python, some people use the terms "arguments" and "parameters" interchangeably. Some people may distinguish them by saying that "parameters" are the variables that are defined in the function (from the perspective of the inner scope, the callee), while "arguments" are the values that are passed into a function (from the perspective of the outer scope, the caller).

In Mojo, we reserve the term "parameter" for other purposes (we will cover this in Chapter [Parametrization](../advanced/parameterization.md) later) and use the term "argument" to refer to both the values that are passed into a function and the variables that are defined in the function itself.

Thus, as a new Magician, you should stop using the term "parameter" to refer to something that you do in Python. Just call the things within parentheses "arguments" no matter they are in a function declaration or a function call. This will help you to avoid confusion in the future.

:::

### Conceptual model

Recall the conceptual model of variables I discussed in the chapter [Variables](../basic/variables). You can also think of arguments in the same way. An argument is a quaternary of a name, a type, an address, and a value:

- **Name**: The name of the argument is defined in the function declaration. You can use this name to refer to the argument within the function body. You cannot re-define the name of the argument within the function body, as it will cause a compilation error. The name of the argument is not necessarily the same as the name of the variable you pass into the function.
- **Type**: The type of the argument is also defined in the function declaration. It indicates what kind of value the argument can accept. The type of the argument must match the type of the value you pass into the function and will be checked by the Mojo compiler.
- **Address**: Depending on the use cases, the address of the argument can either be the same as the address of the variable you pass into the function, or a new address that is allocated for the argument. This is determined by the mutability modifier of the argument[^optimization], which we will discuss later.
- **Value**: The value of the argument is equal to the value of the variable that you pass into the function. Depending on the use cases, a copying action of the value may happen or not. This is also determined by the mutability modifier of the argument, which we will discuss later.

### Positional arguments

For some arguments, you can pass in the values without writing the name of the arguments. The values will be matched to the arguments by their position. This is called "positional arguments".

In the following example, the value `1` and `3.1415` are passed into the function `sumint()`. Mojo will match the first value `1` to the first argument `a`, and the second value `3.1415` to the second argument `b`. If you switch the order of the values, the result will be different.

```mojo
fn my_subtract(a: Float64, b: Float64) -> Float64:
    return a - b

def main():
    var a = my_subtract(1, 3.1415)
    var b = my_subtract(3.1415, 1)
    print(a == b)  # False
```

### Keyword arguments

For other arguments, you pass in the values by also writing the name of the arguments. This is called "keyword arguments". The values will be matched to the arguments by their names, not by their positions. This allows you to pass in the values in any order, as long as you specify the names of the arguments.

In the following example, the argument `b` can comes before the argument `a` if you explicitly indicate their names.

```mojo
fn my_subtract(a: Float64, b: Float64) -> Float64:
    return a - b

def main():
    var a = my_subtract(a=1, b=3.1415)
    var b = my_subtract(b=3.1415, a=1)
    print(a == b)  # True
```

From the previous two examples, you can see that Mojo allows you to positional arguments and keyword arguments are not mutually exclusive. You can use both in the same function call. For example, you can pass in the first argument by its position and the second argument by its name. However, you cannot pass in the first argument by its name and the second argument by its position. See the following example:

```mojo
fn my_subtract(a: Float64, b: Float64) -> Float64:
    return a - b

def main():
    var a = my_subtract(1, b=3.1415)  # This is allowed
    var b = my_subtract(3.1415, a=1)  # This will cause an error
```

```console
error: invalid call to 'my_subtract': argument passed both as positional and keyword operand: 'a'
    var b = my_subtract(3.1415, a=1)  # This will cause an error
            ~~~~~~~~~~~^~~~~~~~~~~~~
```

### Variadic arguments

You use the `*` symbol before the argument name to indicate that the function can accept a variable number of arguments. This is called "variadic arguments". It allows you to pass in an arbitrary number of values of the homogenous type into the function, which will be stored in a array-like structure, e.g, `VariadicList`.

In the following example, by putting an `*` before `flts`, you can pass in any number of `Float64` numbers into the function and get their summation. The values you passed into the function will be stored in a `VariadicList` object.

```mojo
fn sum_floats(*numbers: Float64) -> Float64:
    var s: Float64 = 0
    for i in numbers:  # Iterate over the variadic list
        s += i         # Note that the iterator returns a value but not a pointer
    return s

def main():
    var a = sum_floats(0.1, 0.2, 0.3)
    print(a)

# Output: 0.6000000000000001
```

## Mutability of arguments

If an argument is mutable, it means that the function can modify the value of the argument, i.e., the value (belonging to a variable outside the function) that passed into the function. In Python, this mutability is determined by the type of the value. In Mojo, however, you have more control over the mutability of the arguments. Although there is a default behavior, you can always explicitly define the mutability of the arguments in the function declaration.

The mutability of the arguments is defined by several keywords, namely, `read`, `mut`, `owned` and `out`. I will also call them "mutability modifiers" in this Miji. Let's discuss them one by one.

::: warning Arguments and reference - Mojo vs Rust

The arguments in Mojo behaves very differently from those in Rust.

In Rust, if you pass a value (of a variable) into a function, the function will take over the **ownership** of the value. This means that the argument in the function will take over the ownership (type, the address, and the value) from the outside variable that you passed in. After that, the variable, though outside the function, will no longer exist (dead). You can no longer use the variable any more.

In order to use the value in a function without transferring the ownership to it, you can pass a reference or mutable reference of the value into the function, e.g., `&a` or `&mut a`. These references can be thought of as safe pointers that point to the address of the value (of the variable you passed into the function). You have to de-reference the reference to get access to the value, e.g., `*a` or `*mut a`, though sometimes the de-referencing is automatically done by the compiler.

This transfer of ownership is a key feature of Rust's value model, which ensures memory safety. But it is also very confusing for new users.

In Mojo, if you pass a value (of a variable) into a function, the function (and the argument) will not take over the ownership of the value. Instead, the argument will act as an **alias** of the variable you passed in. It has the same type, value, and sometimes the same address. Since the argument is of the type of the variable you passed in, it has the same methods and behaves the same. You can just use the argument as if it is the variable you passed in. No de-referencing is needed. Moreover, the variable you passed in will still exist after the function call.

From my perspective, this is a more intuitive model for users and leads to less mental burden.

Note that the term "reference" means differently in Mojo compared to Rust. In Rust, a reference is a safe pointer to a value. In Mojo, however, depending on the context, it can either be:

- An alias of the variable. For example, an argument can be a (immutable or mutable) reference of the variable being passed into the function.
- A safe pointer type that stores the address of the value of the variable. For example, `Pointer(to=a)` is a reference of the variable `a`.

In case there is no confusion, I will use the term "reference" for convenience for both cases. Otherwise, I  will use the term "alias" to refer to the first case, and "pointer" to refer to the second case.

:::

### Keyword `read`

::: info `borrowed` vs `read`

Do you know that the keyword `read` was named as `borrowed` before Mojo version 24.6? The `borrowed` keyword has been gradually deprecated and faded out in the Mojo programming language.

There are some other proposals for this keyword, such as `immut`.

:::

If an argument is declared with the keyword `read`, then a read-only reference of the value is passed into the function. If we apply our conceptual model, the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The value at the address is marked as "immutable", meaning that you cannot change the it within the function. The value of the variable outside the function will thus be protected from being modified.

::: info A mutable copy

Note that, for Item 2, although the value at the original address cannot be changed, the argument itself can still be modified when the function is declared with the `def` keyword. This is done by implicitly creating a mutable copy of the value at another address. This will be discussed in the section [def vs fn](#def-vs-fn) at the end of this chapter.

:::

::: tip `read` as default keyword

`read` modifier is memory efficient because nothing has been copied in the function call. `read` is also safe because no changes are allowed to be made on the original address in the memory, so the variable outside the function will not be unintentionally modified. Therefore, `read` is the **default behavior** of arguments in Mojo functions. In case you do not explicitly specify the mutability modifier before the argument, Mojo will automatically assume that the argument is `read`.

The following two functions are thus equivalent.

```mojo
fn foo(read some: Int) -> None:
    print(some)

fn foo(some: Int) -> None:  # default is `read`
    print(some)
```

:::

An example that read elements from a list and print them is as follows. Note that the keyword `read` can be left out.

```mojo
def print_list_of_string(read a: List[String]):
    print("[", end="")
    for i in range(len(a)):
        if i < len(a) - 1:
            print(String('"{}"').format(a[i]), end=", ")
        else:
            print(String('"{}"').format(a[i]), end="]\n")

def main():
    var lst = List[String]("Mojo", "Miji", "is", "interesting")
    var new_lst = print_list_of_string(lst)
```

If you define a function with `fn`, attempting to change the value of an argument with `read` modifier will cause an error at compile time. See the following example:

```mojo
fn changeit(read some: List[Int]) -> List[Int]:
    some[0] = 100

fn main():
    var a = List[Int](1, 2, 3, 4, 5)
    changeit(a)
```

```console
error: expression must be mutable in assignment
    some[0] = 100
    ~~~~^~~
```

### keyword `mut`

::: info `inout` vs `mut`

Do you know that the keyword `mut` was named as `inout` before Mojo version 24.6.

:::

The keyword `mut` allows you to pass a mutable reference of the value into the function. In other words, the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The argument is marked as "mutable", meaning that you can change the value at the **address** of the argument within the function. Since the address of the argument is the same as that of the variable you passed into the function, this means that the value of the variable outside the function will also be modified.

The following example examines the functionality of the `mut` keyword **from the memory's perspective**, so that you can understand the concepts and mechanics better. For this purpose, we need to import the `Pointer` class from the `memory` module, which allows us to print the address of a variable or an argument.

```mojo
from memory import Pointer

def changeit(mut a: Int8):
    a = 10
    print(
        String(
            "In function call: argument `a` is of the value {} and the address {}"
        ).format(a, String(Pointer(to=a)))
    )

def main():
    var x: Int8 = 5
    print(
        String(
            "Before change:    variable `x` is of the value {} and the address {}"
        ).format(x, String(Pointer(to=x)))
    )
    changeit(x)
    print(
        String(
            "Before change:    variable `x` is of the value {} and the address {}"
        ).format(x, String(Pointer(to=x)))
    )
```

When you run the code, you will see the following output:

```console
Before change:    variable `x` is of the value 5 and the address 0x16b6a8fb0
In function call: argument `a` is of the value 10 and the address 0x16b6a8fb0
Before change:    variable `x` is of the value 10 and the address 0x16b6a8fb0
```

Let's look into the code and see what has happened:

First, you create variable with the name `x` and type `Int8` and assign value `5` to it. Mojo assigns a space in the memory, which is of 1-byte (8-bit) length at the address `16b6a8fb0`. The value `5` is stored as `00000100` (binary representation) at the address. See the following illustration.

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

Next, you pass this value into the function `changeit()` with the `mut` keyword. Mojo will then mark argument `a` as a **mutable** reference of `x`. The argument `a` is an alias of `x`, which means they are of the same type and has the same address `16b6a8fb0`. See the following illustration.

```console
                        argument `a` (Int8): Mutable reference of x
                                 ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

Then, you assign a value `10` to the `a`. Since `a` is marked as **mutable**, this re-assignment of value is allowed. The new value `00001010` (binary representation of the integer 10) is then stored into the memory location at address `16b6a8fb0`. Now the updated illustration of the memory goes as follows.

```console
                        argument `a` (Int8): Mutable reference of x
                                 ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00001010│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

Finally, you go out of the function `changeit()` and back to the `main()` function. The argument `a` is no longer in scope and is destroyed. But `x` is still there and its value is now `10`.

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00001010│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

::: tip Compared to Rust

You can modify the value of passed-in variable at its original address if you use `mut` keyword. It is similar to Rust's mutable reference, e.g., `fn foo(a: &mut i8)`. But keep in mind that the reference in Mojo is more an alias than a safe pointer, which means a de-referencing is not needed. 

Let's copy the the previous example here, and re-write it in Rust for comparison.

```mojo
fn changeit(mut a: Int8):
    a = 10

fn main():
    var x: Int8 = 5
    changeit(x)
    print("x =", x)
```

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

[^optimization]: Mojo compiler will also determine whether a copy is needed even though we ask for a copy. It is a kind of optimization.
