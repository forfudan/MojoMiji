# Functions

> laziness brings creativity.  
> -- Yuhao Zhu, *Gate of Heaven*

Now we are familiar with variables in Mojo. This chapter continue with functions.

[[toc]]

## Code re-use

Maybe in other parallelled worlds, programming and programming languages will look very different. But I believe that, no matter how the science and technologies evolves in these worlds, people (or other intelligent beings) will still come up with the concept of functions at the very early stage of their programming journey. It is because functions allow us to encapsulate pieces of code that we can reuse multiple times, saving us from writing the same code over and over again. Functions also help us to organize our code in a more modular way, making it easier to maintain and share.

To quickly demonstrate the power of functions, consider the following example:

::: code-group

```mojo
# src/basic/functions/areas_of_circles.mojo
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

:::

In the example code, we sequentially calculate the area of three circles with different radii. The code is working, but not elegant. We have to repeat the same code three times, which is not only verbose but also difficult to maintain: In case we want to change the formula for calculating the area of a circle, we have to change it in three places.

The way to improve the code is to use functions. Functions in programming languages are similar to mathematical functions, which take some inputs and return some outputs. The very case above, if represented as a mathematical function `f(x)`, would look like this:

$y = f(x) = \pi \cdot x^2$

It takes in the variable `x` representing radius, conducts some calculation, and returns the variable `y` representing area. When you want to calculate the area of circles with different radii, you can simply call the function `f()` with the radius as the input, e.g., `f(1.0)`, `f(2.0)`, and `f(3.0)`.

In Mojo, we can similarly write a function and re-use it as follows:

::: code-group

```mojo
# src/basic/functions/areas_of_circles_with_functions.mojo
def area_of_circle(radius: Float64) -> Float64:
    var pi = 3.1415
    return pi * radius * radius

def main():
    print("Area of Circle 1 with radius 1.0 is", area_of_circle(1.0))
    print("Area of Circle 2 with radius 2.0 is", area_of_circle(2.0))
    print("Area of Circle 3 with radius 3.0 is", area_of_circle(3.0))
```

:::

This code is much more concise and elegant. In case you want to modify the formula for calculating the area of a circle, you only need to change it in one place, i.e., the function `area_of_circle()`.

## Declaration and usage

In Mojo, functions are composed of two parts: a declaration line and a body.

- The declaration line starts with a keyword, which can be either `def` or `fn`. Then there goes function name, which must be a valid identifier. This is followed by inputs to the function, which called "parameters" or "arguments", wrapped within brackets or parentheses. Finally, there is an optional `raises` keyword and an arrowing pointing to the return type of the function.
- The body of the function is indented by four spaces. It contains the code that will be executed when the function is called.
- At the end of the function body, you can use the `return` keyword to return a value from the function. The type of the returned value must match the return type indicated in the declaration line. If the function does not return a value, you can omit the `return` statement. In this case, the function will return `None` by default.

To illustrate, the following is the general syntax of a function declaration in Mojo.

```mojo
def function_name[parameter1: Type1, parameter2: Type2, ...](argmuent1, argument2, ...) -> ReturnType:
    # function defined by `def`
    ...
    return

fn function_name[parameter1: Type1, parameter2: Type2, ...](argmuent1, argument2, ...) raises -> ReturnType:
    # function defined by `fn`
    ...
    return
```

Note that there is something wrapped within square brackets `[]`. This is something related to parametrization and does not appear in Python. We will cover it in Chapter [Parametrization](../advanced/parameterization.md) as an advanced topic. For now, we can safely ignore it. So the following is a simplified version of the function declaration syntax:

```mojo
```mojo
def function_name(argmuent1, argument2, ...) -> ReturnType:
    # function defined by `def`
    ...
    return

fn function_name(argmuent1, argument2, ...) raises -> ReturnType:
    # function defined by `fn`
    ...
    return
```

:::::: info Python's functions

In Python, functions are defined using the `def` keyword. For example, the following functions returns the sum of two numbers (with or without type hints.)

::: code-group

```python
def mysum(a, b):
    return a + b

def mysum(a: int, b: int) -> int:
    return a + b
```

:::

::::::

Using functions is easy. Just like in Python, you can call a function by its name followed by parentheses containing the arguments. For example, to call the abstract `function_name()` defined above, you can write:

::: code-group

```mojo
def main():
    var result = function_name(variable1, variable2)
```

```python
def main():
    result = function_name(variable1, variable2)
```

:::

## keyword `def` and `fn`

As mentioned above, there are two keywords to define functions in Mojo: `def` and `fn`.

### keyword `def`

The `def` keyword is borrowed from Python. I allows you to define functions in a way that is very similar to Python, and allow you to enjoy some freedom that Python has. For example, we can translate the Python function `mysum` above into Mojo code as follows:

```mojo
# src/basic/functions/mysum.mojo
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

You may then wonder why there are two keywords to define functions in Mojo. The reason about the error handling:

- For `fn`-functions: If there are potential exceptions that may be raised by the function, you have to explicitly indicate them using the `raises` keyword in the function declaration.
- For `def`-functions: The `raises` keyword is **not needed**. The function will assume that it may raise some exceptions.

You can think that the `def` keyword will automatically append the keyword `raises` to the end of the function signature, so that you do not need to do that yourself.

::: info Is `fn` pythonic?

In some sense, declaring a function using `def` or `fn` are equivalent. Finally, it only impacts the **default** behaviors of the function, and you can always specify your desired behaviors explicitly.

So the selection of keywords is more related to your personal preference. A Pythonista may prefer `def` because it is more Pythonistic. A Rustacean may prefer `fn` because it is more Rust-like.

From my perspective, I prefer `def` for my personal projects, but would stick to `fn` functions in projects where I need to collaborate with others. This is because `fn` is stricter and more explicit about the behaviors of the functions, e.g., mandatory `raises` keyword, not allowing argument shadowing, etc. In some cases, you may find out that you have to use `fn` keyword to define a function, e.g., `__copyinit__()` where implicit `raises` is not allowed.

Interestingly, the word `fn` itself does not look Pythonic. Python usually truncates the words from left, e.g., `def`. Maybe `func` is a more Pythonic keyword. Nevertheless, Rust users may find `fn` pleasing to the eye.

:::

:::::: details Further reading: `def` and `fn` in early Mojo versions

In early Mojo versions, the difference between `def` and `fn` was more significant. For example, in Mojo v25.3, if a function is defined with `fn`, the arguments are immutable by default (equals to the `read` modifier), and you cannot change the values of the arguments within the function. The following example will cause a compilation error:

::: code-group

```mojo
# src/basic/functions/change_value_in_fn.mojo
# This function will cause a compilation error
fn fn_read_and_modify(x: Int):
    x = 2
    print(x)

def main():
    var a = 1
    change_value_in_fn(a)
    print(a)
```

:::

```console
error: expression must be mutable in assignment
    x = 2
    ^
```

However, if a function is defined with `def`, the arguments are immutable by default, but changing the values of the arguments will create a mutable copy of them. For example,

::: code-group

```mojo
# src/basic/def_read_and_modify.mojo
def change_value_in_def(read x: Int):
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

:::

This code runs without any error, and the output is as follows:

```console
Initializing a to 1
a = 1 at address 0x16f40c4e0
===============================
Calling `change_value_in_def()`
x = 1 at address 0x16f40c540
Change x to 2
x = 2 at address 0x16f40c518
===============================
a = 1 at address 0x16f40c4e0
```

So the difference between `def` and `fn` in Mojo v25.3 is that:

- ***If a function is defined with `def`, the arguments are immutable by default.*** It means that calling the function will not change the value of the variable you passed in. In the example above, the value `a` is not changed after calling `change_value_in_def()`.
- ***Changing the values of the arguments will create a mutable copy of them.*** It means that, if you try to change the value of the argument `x` within the function, it is possible. In the backend, Mojo will create a mutable copy of `x` (at a new address) and assign the new value `2` to it. The `x` is never pointing to the same memory address as `a`. In the example above, you see that `x` never has the same address as `a`.

From Mojo v25.4, the difference between `def` and `fn` is not that significant anymore. The only difference is whether the keyword `raises` is needed or not.

::::::

## `main()` function and REPL

You have already learned about this in your [first Mojo program](../start/hello). Let's recap it here.

In order to executing the code in a Mojo file, you have to define a function named `main()`. This is similar to many other programming languages, such as C, Java, and Rust. The `main()` function serves as the entry point of the program, where the execution starts.

There is only one exception: If you are in the Read-Eval-Print Loop (REPL) mode, such as in terminal or Jupyter Notebook, you do not need to define a `main()` function. You can write code directly in the cell and it will be executed immediately.

To demonstrate this, you open your terminal (`Command + J` in VS Code) and type `pixi run mojo`, then you will enter the REPL mode. You can write code directly in the terminal, such as:

::: code-group

```sh [mojo]
  1> var day = 1 
  2. var month = 1 
  3. var year = 2025 
  4. print("Today is", day, "-" , month, "-", year) 
```

:::

Click enter, and you will see the output immediately:

```console
Today is 1 - 1 - 2025
(Int) day = 1
(Int) month = 1
(Int) year = 2025
```

The first line is the output of the `print()` function. From the second line, you can see that the Mojo REPL will automatically print the type and value of the variable you defined.

:::::: info The main() function in Python

In Python, the `main()` function is not needed. The interpreter will automatically run all the code in the file you run or import.

Notably, the Python interpreter will set the special variable `__name__` of the file that you are directly executing to `"__main__"`. Recall that we can use the expression `if __name__ == "__main__"` to prevent the code from a module from being executed when it is imported by another Python file.

Nevertheless, some Python users still define a `main()` function in their code, and then call it at the end of the file. They may find Mojo's `main()` function more comfortable. Here is a Python example with `main()` function:

::: code-group

```python
def main():
    print("Hello, world!")

main()  # Run the main function
```

:::

::::::

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
- **Address**: Depending on the use cases, the address of the argument can either be the same as the address of the variable you pass into the function, or a new address that is allocated for the argument. This is determined by several modifier keyword before the argument^[Mojo compiler will also determine whether a copy is needed even though we ask for a copy. It is a kind of optimization.], which we will discuss later.
- **Value**: The value of the argument is equal to the value of the variable that you pass into the function. Depending on the use cases, a copying action of the value may happen or not. This is also determined by the modifier of the argument, which we will discuss later.

### Positional arguments

For some arguments, you can pass in the values without writing the name of the arguments. The values will be matched to the arguments by their position. This is called "positional arguments".

In the following example, the value `1` and `3.1415` are passed into the function `sumint()`. Mojo will match the first value `1` to the first argument `a`, and the second value `3.1415` to the second argument `b`. If you switch the order of the values, the result will be different.

::: code-group

```mojo
fn my_subtract(a: Float64, b: Float64) -> Float64:
    return a - b

def main():
    var a = my_subtract(1, 3.1415)
    var b = my_subtract(3.1415, 1)
    print(a == b)  # False
```

:::

### Keyword arguments

For other arguments, you pass in the values by also writing the name of the arguments. This is called "keyword arguments". The values will be matched to the arguments by their names, not by their positions. This allows you to pass in the values in any order, as long as you specify the names of the arguments.

In the following example, the argument `b` can comes before the argument `a` if you explicitly indicate their names.

::: code-group

```mojo
fn my_subtract(a: Float64, b: Float64) -> Float64:
    return a - b

def main():
    var a = my_subtract(a=1, b=3.1415)
    var b = my_subtract(b=3.1415, a=1)
    print(a == b)  # True
```

:::

From the previous two examples, you can see that Mojo allows you to positional arguments and keyword arguments are not mutually exclusive. You can use both in the same function call. For example, you can pass in the first argument by its position and the second argument by its name. However, you cannot pass in the first argument by its name and the second argument by its position. See the following example:

::: code-group

```mojo
fn my_subtract(a: Float64, b: Float64) -> Float64:
    return a - b

def main():
    var a = my_subtract(1, b=3.1415)  # This is allowed
    var b = my_subtract(3.1415, a=1)  # This will cause an error
```

:::

This will cause the following compilation error:

```console
error: invalid call to 'my_subtract': argument passed both as positional and keyword operand: 'a'
    var b = my_subtract(3.1415, a=1)  # This will cause an error
            ~~~~~~~~~~~^~~~~~~~~~~~~
```

### Variadic arguments

You use the `*` symbol before the argument name to indicate that the function can accept a variable number of arguments. This is called "variadic arguments". It allows you to pass in an arbitrary number of values of the homogenous type into the function, which will be stored in a array-like structure, e.g, `VariadicList`.

In the following example, by putting an `*` before `flts`, you can pass in any number of `Float64` numbers into the function and get their summation. The values you passed into the function will be stored in a `VariadicList` object.

::: code-group

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

:::

## Mutability of arguments

If an argument is mutable, it means that the function can modify the value of the argument, i.e., the value (belonging to a variable outside the function) that passed into the function. In Python, this mutability is determined by the type of the value. In Mojo, however, you have more control over the mutability of the arguments. Although there is a default behavior, you can always explicitly define the mutability of the arguments in the function declaration.

The mutability of the arguments is defined by several keywords, namely, `read`, `mut`, and `var`. I will also call them "mutability modifiers" in this Miji. Let's discuss them here one by one. Later, after we have introduced the concept of ownership, **we will revisit these keywords** and discuss more about the references system of Mojo in Chapter [Reference](../advanced/references.md).

::: warning Arguments and reference - Mojo vs Rust

The arguments in Mojo behaves very differently from those in Rust.

In Rust, if you pass a value (of a variable) into a function, the function will take over the **ownership** of the value. This means that the argument in the function will take over the ownership (type, the address, and the value) from the outside variable that you passed in. After that, the variable, though outside the function, will no longer exist (dead). You can no longer use the variable any more.

In order to use the value in a function without transferring the ownership to it, you can pass a reference or mutable reference of the value into the function, e.g., `&a` or `&mut a`. These references can be thought of as safe pointers that point to the address of the value (of the variable you passed into the function). You have to de-reference the reference to get access to the value, e.g., `*a` or `*mut a`, though sometimes the de-referencing is automatically done by the compiler.

This transfer of ownership is a key feature of Rust's value model, which ensures memory safety. But it is also very confusing for new users.

In Mojo, if you pass a value (of a variable) into a function, the function (and the argument) will not take over the ownership of the value. Instead, the argument will act as an **alias** of the variable you passed in. It has the same type, value, and sometimes the same address. Since the argument is of the type of the variable you passed in, it has the same methods and behaves the same. You can just use the argument as if it is the variable you passed in. No de-referencing is needed. Moreover, the variable you passed in will still exist after the function call.

From my perspective, this is a more intuitive model for users and leads to less mental burden.

Note that the term "reference" means differently in Mojo compared to Rust. In Rust, a reference is a safe pointer to a value. In Mojo, however, it is an alias (body double) of the variable. For example, an argument can be a (immutable or mutable) reference of the variable being passed into the function. When accessing the value of the argument, you do not need to de-reference it.

We will discuss more about the references system in Mojo in the later chapter [Reference system](../advanced/references.md).

:::

### Keyword `read`

::: info `borrowed` vs `read`

Do you know that the keyword `read` was named as `borrowed` before Mojo version 24.6? The `borrowed` keyword has been gradually deprecated and faded out in the Mojo programming language.

There are some other proposals for this keyword, such as `immut`.

:::

If an argument is declared with the keyword `read`, then a read-only reference of the value is passed into the function. If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The value at the address is marked as "immutable", meaning that you cannot change the it within the function. The value of the variable outside the function will thus be protected from being modified.

If we apply the [four-status model of ownership](../advanced/ownership.md#four-statuses-of-ownership) introduced in Chapter [Ownership](../advanced/ownership.md) later, this means that a **immutable referenced status** is created.

---

The `read` convention is memory efficient because nothing has been copied in the function call. `read` is also safe because no changes are allowed to be made on the original address in the memory, so the variable outside the function will not be unintentionally modified. Therefore, `read` is the **default behavior** of arguments in Mojo functions.

To emphasize, if you do not put any keywords before the argument, Mojo will automatically assume that the argument is modified by the  `read` keyword. This will generate a read-only reference of the value passed into the function.

Thus, the following two functions are thus equivalent.

::: code-group

```mojo
fn foo(read some: Int) -> None:
    print(some)

fn foo(some: Int) -> None:  # default is `read`
    print(some)
```

:::

---

Here is an example that read elements from a list and print them. Note that the keyword `read` can be omitted, as it is the default behavior of arguments.

::: code-group

```mojo
# src/basic/functions/read_keyword.mojo
def print_list_of_string(read a: List[String]):
    # `a` is a read-only reference of the list passed into the function
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

:::

If you define a function with `fn`, attempting to change the value of an argument with `read` modifier will cause an error at compile time. See the following example:

::: code-group

```mojo
# src/basic/functions/read_keyword_change.mojo
# This code will not compile
fn changeit(read some: List[Int]) -> List[Int]:
    some[0] = 100


fn main():
    var a = List[Int](1, 2, 3, 4, 5)
    changeit(a)
```

:::

This will cause the following compilation error:

```console
error: expression must be mutable in assignment
    some[0] = 100
    ~~~~^~~
```

### keyword `mut`

::: info `inout` vs `mut`

Do you know that the keyword `mut` was named as `inout` before Mojo version 24.6? The `inout` keyword has been gradually deprecated and faded out in the Mojo programming language.

:::

The keyword `mut` allows you to pass a mutable reference of the value into the function. In other words, the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The argument is marked as "mutable", meaning that you can change the value at the **address** of the argument within the function. Since the address of the argument is the same as that of the variable you passed into the function, this means that the value of the variable outside the function will also be modified.

If we apply the [four-status model of ownership](../advanced/ownership.md#four-statuses-of-ownership) introduced in Chapter [Ownership](../advanced/ownership.md) later, this means that a **mutable aliases status** is created.

The following example examines the functionality of the `mut` keyword **from the memory's perspective**, so that you can understand the concepts and mechanics better. For this purpose, we need to import the `Pointer` class from the `memory` module, which allows us to print the address of a variable or an argument.

::: code-group

```mojo
# src/basic/functions/mut_keyword.mojo
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

:::

When you run the code, you will see the following output:

```console
Before change:    variable `x` is of the value 5 and the address 0x16b6a8fb0
In function call: argument `a` is of the value 10 and the address 0x16b6a8fb0
Before change:    variable `x` is of the value 10 and the address 0x16b6a8fb0
```

Let's use a diagram to illustrate what happens in the memory when you run the code.

First, you create variable with the name `x` and type `Int8` and assign value `5` to it. Mojo assigns a space in the memory, which is of 1-byte (8-bit) length at the address `16b6a8fb0` and store the value `5` as `00000100` (binary representation) at the address. See the following illustration.

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

Finally, you go out of the function `changeit()` and back to the `main()` function. The argument `a` is no longer in scope and is destroyed. But `x` is still there and its value is now `10`. The final illustration of the memory is as follows:

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00001010│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

:::::: tip Compared to Rust

You can modify the value of passed-in variable at its original address if you use `mut` keyword. It is similar to Rust's mutable reference, e.g., `fn foo(a: &mut i8)`. But keep in mind that the reference in Mojo is more an alias than a safe pointer, which means a de-referencing is not needed. We will cover this topic in detail in Chapter [Ownership](../advanced/ownership) and [Reference system](../advanced/references).

Let's re-write teh previous example in Rust for comparison.

::: code-group

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

```mojo
fn changeit(mut a: Int8):
    a = 10

fn main():
    var x: Int8 = 5
    changeit(x)
    print("x =", x)
```

:::

::::::

### keyword `var`

The keyword `var` allows you to pass a **copy** of the value into the function. In other words, the following things will happen:

1. The value of the variable you passed into the function will be copied to a new address in the memory, and the argument of the function will get this new address and the value at that address.
1. The argument **owns** the value at the new address. It can modify the value at the address.
1. Since the address of the argument in the function is different from that of the variable you passed into the function, the value of the variable outside the function will not be modified.

If we apply the [four-status model of ownership](../advanced/ownership.md#four-statuses-of-ownership) introduced in Chapter [Ownership](../advanced/ownership.md) later, this means that a **isolated status** is created.

::: info the very same `var` keyword

You may notice that the keyword `var` is also used to declare a variable. Yes, they are the very same keyword. When using `var` in the function declaration, it indicates that the argument is an **owned copy** of the value passed in, just like that you declare a new variable in the function scope that owns its value.

Simplicity is good. That is why Mojo reuses the same keyword here.

:::

The following example examines the functionality of the `var` keyword **from the memory's perspective**. In the function signature of `changeit()`, we use the `var` keyword to indicate that the argument `a` is an owned copy of the value passed in.

::: code-group

```mojo
# src/basic/functions/var_keyword.mojo
from memory import Pointer


def changeit(var a: Int8):
    print(
        String(
            "Within function call: argument `a` is of the value {} and the address {}"
        ).format(a, String(Pointer(to=a)))
    )
    a = 10
    print("Within function call: change value of a to 10 with `a = 10`")
    print(
        String(
            "Within function call: argument `a` is of the value {} and the address {}"
        ).format(a, String(Pointer(to=a)))
    )

def main():
    var x: Int8 = 5
    print(
        String(
            "Before function call: variable `x` is of the value {} and the address {}"
        ).format(x, String(Pointer(to=x)))
    )
    changeit(x)
    print(
        String(
            "Before function call: variable `x` is of the value {} and the address {}"
        ).format(x, String(Pointer(to=x)))
    )
```

:::

When you run the code, you will see the following output:

```console
Before function call: variable `x` is of the value 5 and the address 0x16bb384f7
Within function call: argument `a` is of the value 5 and the address 0x16bb38510
Within function call: change value of a to 10 with `a = 10`
Within function call: argument `a` is of the value 10 and the address 0x16bb38510
Before function call: variable `x` is of the value 5 and the address 0x16bb384f7
```

You will see that:

1. The variable passed into the function (`x`) and the argument (`a`) have the same value `5` at the beginning of the function call, but they are at different addresses in the memory.
1. The value of the argument `a` is changed to `10` within the function, but the value of the variable `x` outside the function remains `5`.

Let's use a diagram to illustrate what happens in the memory when you run the code.

First, you create variable with the name `x` and type `Int8` and assign value `5` to it. Mojo assigns a space in the memory, which is of 1-byte (8-bit) length at the address `16bb384f7`, and then store the value `5` as `00000100` (binary representation) at the address. See the following illustration.

```console
        ┌─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │
        ├─────────┼─────────┼─────────┼─────────┤
Address │16bb384f5│16bb384f6│16bb384f7│16bb384f8│
        └─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

Next, you pass this variable `x` into the function `changeit()` with the `var` keyword. Mojo will then copy the value (`0b00000100`) to a new address `0x16bb38510`, and let the argument `a` to own this new value and the address. These two variables are completely isolated from each other. See the following illustration.

```console
                                                                argument `a` (Int8)
                                                                         ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │ 00000100│         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16bb384f5│16bb384f6│16bb384f7│16bb384f8│   ...   │16bb38509│16bb38510│16bb38511│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

Then, you re-assign a value `10` to the `a`. Since `a` is marked as **owned**, it has the exclusive ownership of its value. The re-assignment of value is thus allowed. The new value `00001010` (binary representation of the integer 10) is then stored into the memory location at address `16bb38510`. Now the updated illustration of the memory goes as follows.

```console
                                                                argument `a` (Int8)
                                                                         ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │ 00001010│         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16bb384f5│16bb384f6│16bb384f7│16bb384f8│   ...   │16bb38509│16bb38510│16bb38511│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

Finally, you go out of the function `changeit()` and back to the `main()` function. The argument `a` is no longer in scope and is destroyed, so is the value owned by it. But `x` is still there and its value is still `5`. The final illustration of the memory is as follows:

```console
                                     The value is destroyed and the memory at the address is uninitialized
                                                                         ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16bb384f5│16bb384f6│16bb384f7│16bb384f8│   ...   │16bb38509│16bb38510│16bb38511│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                 ↑
                          variable `x` (Int8)
```

## Function overloading

Function overloading is a cool feature of Mojo which does not appear in Python. For example, you want to implement a function called `bigger` that can either take in one or two arguments of the integral type. If one argument is passed in, then it returns the argument itself. If two arguments are passed in, then it returns the bigger one. In Python, you would probably use the following trick:

::: code-group

```python
# src/basic/functions/bigger.mojo
def bigger(a: int, b: int | None = None) -> int:
    """Returns the bigger of one or two integers.
    
    Args:
        a (int): First integer.
        b (int | None): Second integer. Defaults to None.
    
    Returns:
        int: The bigger of the two integers if both are provided,
            otherwise returns the first integer.
    """
    
    if b is None:
        return a
    return a if a > b else b

def main():
    print(bigger(1, 2))
    print(bigger(3))

main()
```

:::

In the above code, we set the argument `b` to be either an integer or a `None` type. If the user only passes in one variable, `b` will be `None` and the value of `a` will be returned. If the user passes in two values, then the bigger number will be returned.

However, in Mojo, this trick may not be helpful. Mojo is a statically-typed language and each variable must have a fixed type (well, you can use `Optional` type, but you have to do some de-packing and it will not be efficient). Luckily, Mojo allows function overloading. This feature allows you to define functions with the same name multiple times as long as they are with different arguments. See the following example:

::: code-group

```mojo
# src/basic/functions/bigger.mojo
fn bigger(a: Int) -> Int:
    return a

fn bigger(a: Int, b: Int) -> Int:
    return a if a > b else b

fn main():
    print(bigger(1, 2))
    print(bigger(3))
```

:::

You can run this code and see that it works as expected.

So what we learnt from the above example?

1. You can define the functions multiple times with the same name, e.g., `bigger()`.
1. You have to make sure that the arguments of the functions are different, e.g., one function takes one argument and the other takes two arguments.
1. The Mojo compiler will check the number and the types of the arguments you passed into the function, and then infer which function signature to use.

Of course, you can continue this overloading to more accept more variants. This feature would be very useful when you want to implement a function but with different settings.

::: danger Do not abuse function overloading

Though function overloading is useful, it may also lead to problems. For example, you overload a function `foo()` with 10 different signatures. These signature are very different from each other. If someone is using your function, they will see 10 different signatures as functional hints in VS Code. They have to scroll to check which one is their intended.

Moreover, the moment they types in the first argument, the number of visible functional hints will decrease so as to match the type of the argument. So they cannot see other overloads anymore. If they want to see the alternative signatures, they have to delete everything after the left parenthesis `(`.

The root cause is that Mojo does not (yet) support a unified docstring for all function overloads. The Python type of one-line docstring that summarize all possible combination of arguments is not possible.

Thus, try not to abuse the function overloading. Do not use function overloading as a container to hold everything. If two functions are aimed for different purposes, give them two different names. You should always make the function names self-explanatory. For example,

```mojo
def from_object(a: String) -> Matrix:
    ...

def from_object(*a: Float64) -> Matrix:
    ...

def from_object(a: List[Int]) -> Matrix:
    ...

def from_object(a: PyObject) -> Matrix:
    ...
```

is inferior to

```mojo
def from_string(a: String) -> Matrix:
    ...

def from_float(*a: Float64) -> Matrix:
    ...

def from_list(a: List[Int]) -> Matrix:
    ...

def from_pyobject(a: PyObject) -> Matrix:
    ...
```

:::

## Major changes in this chapter

- 2025-06-20: Update to accommodate the changes in Mojo v25.4.
- 2025-09-04: Update to accommodate the changes in Mojo v25.5.
