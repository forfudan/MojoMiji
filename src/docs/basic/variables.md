# Variables

A variable is a fundamental concept in programming which allows you to store, read, and manipulate data. It can be seen as a container of data, enabling you to refer to the data by a symbolic name rather than the value in the memory directly. This is essential for writing readable and maintainable code.

[[toc]]

## A conceptual model of a Mojo variable

There are various way to define a variable, and the definition varies across programming languages. In this Miji, I would provide the following conceptual model which I found easy to understand and remember when I program in Mojo:

***A variable in Mojo is a quaternary structure consisting a name, a type, an address, and a value***. The name of the variable is the unique identifier that you use to refer to the variable in your code. The type of the variable defines what kind of data it can hold, how much memory space it occupies, how it can be manipulated, and how the value is represented in binary format in memory. The address of the variable defines where the data is stored in memory. The value of the variable is the actual data that is stored in the memory space.

You can always think of or analyze a variable from these four aspects. For example, when you initialize a variable, you are doing the following things: (1) Select an **name** for the variable, (2) Specify the **type** of the variable, (3) Ask for an **address**, a memory space, to store the date, and (4) Store the **value** in the memory space in a binary format.

When you use a variable with its name, you are doing the following four things: (1) Find out the information of the variable, including its type and address in the memory, (2) Go to the memory address to retrieve the value stored there, and (3) Interpret the value according to its type.

::: tip Type is important

The values of variables stored in the computer's memory is not in a human-readable format. For example, the value `12.5` does not appear as "12.5" if you use a microscope to look into your computer's RAM stick. Physically, the memory is a sequence of units with binary, mutually exclusive states, which can be represented as `0` and `1` (or, yes and no, sun and moon, yīn and yáng...), e.g., 00000000 00001100 00000000 00001101... These units are called bits.

How to interpret these bits into a human-readable format? It depends on the type of the variable. There are pre-defined rules for each type to interpret the bits into a human-readable value, or translate a human-readable value into bits. For example, if the value in bit format is `0000000000000010` and the type is `Int8`, then it is interpreted as the integer **2**. For the same value `0000000000000010`, if the type is `Float16`, then it is interpreted as a floating-point number **0.00000011920928955078125**. Certain manipulations can only be performed on certain types of variables. You can not apply a method that is defined for `Int` on a variable of type `String`.

In short, the type of a variable is very important as it defines how the program interprets and manipulates the data.

:::

::: info A variable in Python

In Python, a variable can be regarded as a tertiary structure consisting a name, a type, and a value. Compared to Mojo, you can see that the address is not present in the conceptual model anymore. This is because Python's variables are not directly associated with a memory block. Instead, Python variables are references to Python objects. You can think of a Python variable as a sticker. You can stick it on any object (assignment), you can remove it from the object (deletion), and you can move it from one object onto another object (re-assignment).

For example, in the following code, the variable `a` is firstly sticked onto an object with type `int` and value `1`. Later, it is removed from the first object and sticked onto another object with type `int` and value `2`. Finally, it is removed from the second object and sticked onto a string object with value `"Hello world!"`. All these objects are stored in different locations in the memory. This even applies to the second line (`a = 2`): when the variable `a` is assigned to another integer type, the location of the value in the memory is changed.

```python
a = 1
a = 2  # Different object, different memory address
a = "Hello world!"  # Different object, different memory address
```

This does not applies to Mojo. As I said before, a Mojo's variables is associated with an address. When you do `a = 1`, the variable `a` will be associated with a type `Int`, an address in the memory, and a value `1`. When you do `a = 2`, the variable `a` will still be associated with the same address in the memory, but the value will be changed to `2` (physically, the status of the electrons at that location changed). You can never do `a = "Hello world!"` because the type of `a` is `Int`, and you cannot insert a string value into that address.

:::

## Declaration

In Python, initializing a variable is very simple. It does not require a declaration, and the variable type is not necessary:

```python
a = 1
b: int = 1  # We opt-in using type hint
# You can also do as follows, but not necessary
c: int
c = 2
```

In contrast, Mojo variables must be declared (or defined) using the `var` keyword, and in most cases, the variable type must be specified. For example:

```mojo
fn main():
    var a: Int
```

The above code^[Note that Mojo code must be placed within the `main()` function, except in certain special cases. Here, it is uniformly placed in the `main()` function.] first declares a variable named `a`, allocating a memory space just large enough to store an integer value.

## Initialization

Once a variable is declared, it can be initialized using an assignment statement. Mojo’s assignment statements are similar to Python’s, using the equals sign `=` to assign the value on the right to the variable name on the left. For example, in the following example, `1` is assigned to `a`. From a memory perspective, the number `1` is stored in the newly allocated memory space. From a value perspective, `1` is bound to the variable name `a`.

```mojo
fn main():
    var a: Int
    a = 1
```

Variable declaration and assignment can be done separately or simultaneously. The following code is equivalent to the previous example.

```mojo
fn main():
    var a: Int = 1
```

::: info `let` and `var`

In early versions of Mojo, the `let` keyword is used to declare immutable variables (just like Rust) and the `var` keyword is used to declare mutable variables. From v24.4 (2024-06-07), the `let` keyword has been completely removed from the language. From v24.5 (2024-09-13), the `var` keyword has become optional (like Python).

Yuhao highly recommends you to continue using the `var` keyword though it is optional. Using `var` can effectively differentiate the cases when you want to declare a variable and when you want to change the value.
:::

## Changing Values

Once a variable is assigned a value, we can continue to change its value using assignment statements:

```mojo
fn main():
    var a: Int = 1
    a = 10
```

Note that the following code is incorrect because `a` is of type `Int` and cannot be assigned a `String`.

```mojo
fn main():
    var a: Int = 1
    a = "Hello!"
```

## Variable Overloading

In Python, variables can be overloaded and their types changed because Python variables are just labels that can point to different objects at any time. The following code is legal^[mypy does not recommend doing this].

```python
# python
a: int = 1
a: str = "Hello!"
```

In Rust, variables can also be overloaded by using `let` to declare them again. The following code is legal:

```rust
fn main() {
    let a: i8 = 1
    let a: String = "Hello!".to_string()
}
```

In Mojo, variable overloading is not allowed. The following code will result in an error:

```mojo
fn main():
    var a: Int = 1
    var a: String = "Hello!"
```

```console
error: invalid redefinition of 'a'
    var a: String = "Hello!"
```

## Transferring Values Between Variables

Like in Python, we can also transfer values between variables:

```mojo
fn main():
    var a: Int = 1
    var b = a
    print(a)
    print(b)
```

In the above code, `1` is first assigned to `a`, and then the value of `a` is assigned to `b`. The result is as follows:

```console
1
1
```

For example, first assigning the string `"Hello"` to `a`, and then assigning the value of `a` to `b`. The result is as follows:

```mojo
fn main():
    var a: String = "Hello"
    var b: String = a
    print(a)
    print(b)
```

```console
Hello
Hello
```

Note that this is different from Rust. See the following example:

```rust
fn main() {
    let a = "Hello".to_string();
    let b = a;
    println!("{a}");
    println!("{b}");
}
```

```console
2 |     let a = "Hello".to_string();
  |         - move occurs because `a` has type `String`, which does not implement the `Copy` trait
3 |     let b = a;
  |             - value moved here
4 |     println!("{a}");
  |               ^^^ value borrowed here after move
```

The compilation error occurs because, in Rust, for heap-based data structures, assignment defaults to ownership transfer. This means that the identifier `a` transfers its ownership of the string value to the identifier `b`, making a unusable.

In Mojo, assignment defaults to copying. This means that the value of `a` is first copied, and then `b` gains ownership of this copied value. `a` retains ownership of the original value and can continue to be used.

To enforce ownership transfer in Mojo, you can use the transfer operator `^`. The code is as follows:

```mojo
fn main():
    var a: String = "Hello"
    var b = a^
    print(a)
    print(b)
```

```console
error: use of uninitialized value 'a'
print(a)
```

Here, we use the transfer operator to inform the compiler to transfer the ownership of the string value from `a` to `b`. After this, a returns to an uninitialized state and cannot be used.

::: info
Compared to Rust, this approach in Mojo reduces the mental burden during programming, especially when passing parameters, as you don’t have to worry about functions acquiring ownership and invalidating the original variable name. The downside is that the default copying behavior (`__copyinit__`) can lead to additional memory consumption. The compiler optimizes this by using `__moveinit__` to transfer ownership if the original variable name is no longer used after assignment.

Of course, certain small, stack-based data types in Mojo are always copied, including SIMD types. This can make Mojo faster than Rust in some computations (Pass-by-ref consumes more than direct copying, as detailed in this article: [Should Small Rust Structs be Passed by-copy or by-borrow?](https://www.forrestthewoods.com/blog/should-small-rust-structs-be-passed-by-copy-or-by-borrow/)).

The topic of ownership will be further explained in later tutorials.
:::
