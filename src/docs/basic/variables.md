# Variables

> Taiji (☯) generates two Yi's (⚊ ⚋); the two Yi's generate four Xiang's (⚌ ⚍ ⚎ ⚏); the four Xiang's generate eight Gua's (☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷).  
> -- *Yi-Jing (I Ching)*

A variable is a fundamental concept in programming which allows you to store, read, and manipulate data. It can be seen as a container of data, enabling you to refer to the data by a symbolic name rather than the value in the memory directly. This is essential for writing readable and maintainable code.

[[toc]]

## Conceptual model of variable

There are various way to define the term "variable", and the definition varies across programming languages. In this Miji, I would provide the following conceptual model which I found easy to understand and remember when I program in Mojo:

***A variable in Mojo is a quaternary system consisting a name, a type, an address, and a value***.

- The name of the variable is the unique identifier that you use to refer to the variable in your code.
- The type of the variable defines what kind of data it can hold, how much memory space it occupies, how it can be manipulated, and how the value is represented in binary format in memory.
- The address of the variable defines where the data is stored in memory.
- The value of the variable is a meaningful piece of information that you directly or indirectly create or use. It is usually stored in a binary format in the memory.

Below is an abstract, internal representation of a variable in memory. The variable is of name `a`, of type `Int`, of address `0x26c6a89a`, and of value `123456789`. Since the `Int` type is 64-bit (8-byte) long, it actually occupies the space from `0x26c6a89a` to `0x26c6a89a + 7` = `0x26c6a8a1`. The value `123456789` is stored in the memory space in a binary format, which is `00000000 00000000 00000000 00000000 00000000 00000000 00000101 00000101` (in little-endian format).

```console
        local variable `a` (Int type, 64 bits or 8 bytes)
            ↓  (stored on stack at address 0x26c6a89a in little-endian format)
        ┌───────────────────────────────────────────────────────────────────────────────────────┐
Name    │                                           a                                           │
        ├───────────────────────────────────────────────────────────────────────────────────────┤
Type    │                                          Int                                          │
        ├───────────────────────────────────────────────────────────────────────────────────────┤
Value   │ 00000000 │ 00000000 │ 00000000 │ 00000000 │ 00000111 │ 01011011 │ 11001101 │ 00010101 │
        ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
Address │0x26c6a89a│0x26c6a89b│0x26c6a89c│0x26c6a89d│0x26c6a89e│0x26c6a89f│0x26c6a8a0│0x26c6a8a1│
        └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

When you program in Mojo, you should always view a variable as a system consisting of four aspects, a name, a type, an address, and a value. You should not only regard it as a name or a label. In this way, you can better understand **how variables are interacted with each other**. When you step into the concept "[ownership](../advanced/ownership.md)", it will save you a lot of effort to understand it.

For example, when you initialize a variable, you are doing the following things: (1) Select an **name** for the variable, (2) Specify the **type** of the variable, (3) Ask for an **address**, a memory space, to store the date, and (4) Store the **value** in the memory space in a binary format.

When you use a variable via its name, you are doing the following four things: (1) Find out the information of the variable in the symbol table, which includes its name, type, and address in the memory, (2) Go to the memory address to retrieve the value stored there, and (3) Interpret the value according to its type.

::: tip Type is important

The values of variables stored in the computer's memory is not in a human-readable format. For example, the value `12.5` does not appear as "12.5" if you use a microscope to look into your computer's RAM stick. Physically, the memory is a sequence of units with binary, mutually exclusive states, which can be represented as `0` and `1` (or, yes and no, sun and moon, yīn and yáng...), e.g., 00000000 00001100 00000000 00001101... These units are called bits.

How to interpret these bits into a human-readable format? It depends on the type of the variable. There are pre-defined rules for each type to interpret the bits into a human-readable value, or translate a human-readable value into bits. For example, if the value in bit format is `0000000000000010` and the type is `Int8`, then it is interpreted as the integer **2**. For the same value `0000000000000010`, if the type is `Float16`, then it is interpreted as a floating-point number **0.00000011920928955078125**. Certain manipulations can only be performed on certain types of variables. You can not apply a method that is defined for `Int` on a variable of type `String`.

In short, the type of a variable is very important as it defines how the program interprets and manipulates the data.

:::

::: info A variable in Python

In Python, a variable can be regarded as a tertiary structure consisting a name, a type, and a value. Compared to Mojo, you can see that the address is not present in the conceptual model anymore. This is because Python's variables are not directly associated with a memory block. Instead, Python variables are pointers to Python objects. You can think of a Python variable as a sticker. You can stick it on any object (assignment), you can remove it from the object (deletion), and you can move it from one object onto another object (re-assignment).

For example, in the following code, the variable `a` is firstly sticked onto an object with type `int` and value `1`. Later, it is removed from the first object and sticked onto another object with type `int` and value `2`. Finally, it is removed from the second object and sticked onto a string object with value `"Hello world!"`. All these objects are stored in different locations in the memory. This even applies to the second line (`a = 2`): when the variable `a` is assigned to another integer type, the location of the value in the memory is changed.

```python
a = 1
a = 2  # Different object, different memory address
a = "Hello world!"  # Different object, different memory address
```

This does not applies to Mojo. As I said before, a Mojo's variables is associated with an address. When you do `a = 1`, the variable `a` will be associated with a type `Int`, an address in the memory, and a value `1`. When you do `a = 2`, the variable `a` will still be associated with the same address in the memory, but the value will be changed to `2` (physically, the status of the electrons at that location changed). You can never do `a = "Hello world!"` because the type of `a` is `Int`, and you cannot insert a string value into that address.

:::

## Identifiers

Identifiers are names used to identify variables, functions, structs, classes, etc.

Mojo has the exactly the same rules for identifiers as Python does. You can always use your existing knowledge of Python identifiers in Mojo. To be more specific, Mojo has the following rules on identifiers:

- Identifiers must consist of letters (both uppercase and lowercase), digits, and underscores (`_`), e.g, `my_variable`, `MyVariable`, `my_variable_1`, `_temp_variable`, etc.
- Identifiers cannot start with a digit, e.g., `1st_variable` is not a valid identifier, but `first_variable` is.
- Identifiers cannot be a keyword (reserved word), e.g, `if`, `for`, `while`, `def`, etc. are not valid identifiers.
- Identifiers are case-sensitive.

There is one feature that is new in Mojo. You can use the grave accent (``) to create an identifier that does not follow the rules above. For example, the following code is valid in Mojo:

```mojo
def main():
    var `var`: Int = 1
    var `123`: Int = 123
    print(`var`)  # Using backticks to escape the keyword 'var'
    print(`123`)  # Using backticks to escape the numeric identifier '123'
```

As what you may learn from Python, variables with prefixes like `_` or `__` have some special meanings. Mojo also adopts this convention. For example, variables with a single underscore prefix (e.g., `_temp`) are considered private or temporary variables, and users should not access them directly (like `private` keywords in other languages). Variables with a double underscore prefix (e.g., `__temp`) are considered private to the classes or structs. Particularly, variables with double underscores before and after the name (e.g., `__init__`) are considered special methods for classes or structs, which are called "double-underscore methods" or "**dunder** methods". These dunder methods provide an uniformed interface for system functions to work on different types, achieving polymorphism.

## Variable declaration

Now we look into how to create a variable in Mojo with help of the the conceptual model and the figure introduced above.

In Mojo, the **complete** syntax to create a variable is `var name: Type = value`, where,

- `var` is the keyword to declare a variable.
- `name` is the name of the variable, which must be a valid identifier.
- `Type` is the type of the variable, which must be a valid Mojo type.
- `value` is the initial value of the variable, which must be a valid literal of the specified type.

An example go as follows:

```mojo
def main():
    var a: Int = 1
    var b: Float64 = 2.5
    var c: String = "Hello, world!"
    var d: List[Int] = List[Int](1, 2, 3)
```

The above code construction of the variables, namely `var name: Type = value`, can be further broken down into two parts:

1. **Definement** (`var name: Type`): A `var` keyword is followed by variable name and type. This tells Mojo compiler that a new variable with the specified name and type shall be created in the current code block (scope). Please allocates a memory space for the variable based on its type.
1. **Assignment** (`= value`): An equal sign is followed by a value. This tells Mojo compiler to evaluate the value you provided, and store it in the allocated memory space in a binary format. How to convert the value into binary format depends on the type of the variable.

These two steps can be done simultaneously in one line, as shown in the above example, or separately in two lines, in the following way:

```mojo
```mojo
def main():
    # Define variables first
    var a: Int
    var b: Float64 = 2.5
    var c: String = "Hello, world!"
    var d: List[Int] = List[Int](1, 2, 3)

    # Assign values to the variable names in separate lines
    a = 1
    b = 2.5
    c = String("Hello, world!")  # c = "Hello, world!" is also valid
    d = List[Int](1, 2, 3)
```

These two examples are equivalent. The first example is more concise and Pythonic. The second example is also useful when you want to show which variables will be used in one place. Which one is better depends on your personal preference and the purpose of the code.

:::tip Too verbose

You may find that the complete syntax of variable creation is still verbose, compared to Python. However, Yuhao personally still recommends you to always follow this complete style, as it is more explicit and error-free, especially the inlay hints is not yet supported by Mojo extension. Being confident is good, but being explicit is better. (One exception is that you have already used the constructors to wrap the value, e.g., `List[Int](1, 2, 3)`.)

If you still want to chill a bit, luckily, Mojo is more than "clever" to allow you to omit the `var` keyword as well as the type annotation and use a **simplified** syntax: `name = value`, just like Python. This will be discussed in details in the next sections.

:::

## The `var` keyword

Mojo uses the `var` keyword to declare a variable. This keyword is not required in Python.

`var` explicitly tells the Mojo compiler that you want to create a new variable and the name of the variable must be the first time appearing in the **current code block** (scope). This implies that you cannot use the `var` keyword twice for the same variable name in the same scope. For example, the following code will result in an error:

```mojo
def main():
    var a: Int = 1
    var a: Int = 2  # We use `var` keyword again for variable name `a`
```

```console
error: invalid redefinition of 'a'
    var a: Int = 2  # Error: invalid redefinition of 'a'
    ^
```

:::info variable shadowing

Though not possible in Mojo, redefining a variable with the same name (even with a different type) is allowed in some other languages. This is called **variable shadowing**. For example, in Rust and Python, the following code is legal:

```rust
fn main() {
    let a: i32 = 1;
    let a: String = "Hello".to_string();  // Redefine variable `a` with a different type
}
```

```python
def main():
    a: int = 1
    a: str = "Hello"  # Redefine variable `a` with a different type
main()
```

But in Mojo, it is not allowed. Yuhao finds this a good design choice, as it helps to avoid confusion and potential bugs caused by variable shadowing. If you want to change the type of a variable, please instead use a different name for the new variable.

:::

You can omit the `var` keyword and the type annotation when you declare a variable for the first time, just like what you usually do in Python. For example, the following simplified syntax of variable creation is valid in Mojo:

```mojo
def main():
    a = 1
    b = 2.5
    c = "Hello, world!"
    d = List[Int](1, 2, 3)
```

Some Pythonistas will be happy now. But remember, if you omit the `var` keyword, then you have to also omit the type annotation. In other words, if you want to use type annotations, you must use the `var` keyword. Note that the following code won't work:

```mojo
def main():
    a: Int = 1
    b: Float64 = 2.5
    c: String = "Hello, world!"
    d: List[Int] = List[Int](1, 2, 3)
```

:::info `let` and `var`

Do you know that, in early versions of Mojo, the `let` keyword is used to declare immutable variables (just like in Rust) and the `var` keyword is used to declare mutable variables. From v24.4 (2024-06-07), the `let` keyword has been completely removed from the language.

From v24.5 (2024-09-13), the `var` keyword has also become optional, to be fully compatible with Python. However, many Magicians find this not a good move. In the following sections, you will see why.

:::

## Type annotations

Python is a dynamic, strongly-typed language. When we say that it is strongly-typed, we mean that Python enforces type checking at runtime and there are less implicit type conversions. When we say that it is dynamic, we mean that Python does not require you to declare the type of a variable before using it. You can assign any value to a variable, and Python will determine its type at runtime. From Python 3.5 onwards, Python also supports type hints, which allows you to annotate the types of variables and function arguments, but these are optional and do not affect the runtime behavior and performance of the code. Giving incorrect type hints will not cause any errors. The Python's type hints are primarily for static analysis tools and IDEs to help you catch potential errors before running the code, and it also helps other developers (or yourself in future) understand your code better.

Python's type hints are primarily for IDE static checks and readability, and are not mandatory, having no impact on performance^[Compilers like Cython and mypyc may use type hints for partial optimization.].

In contrast, Mojo is statically compiled. Therefore, data types of variables must be explicitly declared so that the compiler can allocate appropriate memory space.

The syntax for type annotations in Mojo is `var name: Type`, where the type always follows the variable name with a colon `:`. This is similar to Python's type hints. Some early programming languages, like C or C++, use the syntax `Type name` to declare a variable.

As mentioned above, Mojo compiler is smart enough to **infer** the type of variable based on the literals, expressions, and the returns of functions. However, it is still recommended that you provide type annotations as much as possible for clarity and to avoid ambiguity (except when you use explicit constructors of types). For example,

```mojo
fn main():
    var a: Float64 = 120.0            # Use type annotations for literals
    var b: Int = 24                   # Use type annotations for literals
    var c = String("Hello, world!")   # Use explicit constructors
    var d = Int128(100) ** Int128(2)  # Use explicit constructors
```

In an exercise in Section [Integer](../basic/types#integer) of Chapter [Types](../basic/types), we will see that absence of type annotations can sometimes lead to unintended behaviors.

::: tip Inlay hints

Some IDEs provides inlay hints that show the inferred types of variables. You can use it to check whether the compiler has inferred the data type correctly. For example, the Rust and Python extensions of Visual Studio Code provide inlay hints. Mojo does not yet provide this feature. Thus, I recommend you to always provide type annotations, particularly for literals.

:::

## Value re-assignment

Once a variable is assigned a value, we can change its value using equal sign `=`. This is called **value re-assignment**. The type of the variable must be compatible with the new value, otherwise, you will get a compilation error. For example, the following code is valid:

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

## Scope of variables

The scope of a variable is the region of code where the variable can be accessed. It is determined by the location where the variable is defined (or, declared). A typical code block is a function, a for loop, a while loop, an if statement, etc.

If you declare a variable inside a function, then the variable can only be accessed within that function. If you declare a variable inside a for loop, then the variable can only be accessed within that loop. See the following example that won't work:

```mojo
def main():
    if True:
        var a: Int = 1
        print(a)
    print(a)  # This will cause an error
```

```console
error: use of unknown declaration 'a'
    print(a)  # This will cause an error
          ^
```

This is because the variable `a` is declared inside the `if` statement and only accessible within that `if` statement. When the program 
goes out of the `if` statement, the variable `a` (name, type, address, and value) is **dead**, or **destroyed**. Therefore, when you try to access `a` in the second `print(a)`, it cannot find the variable `a` anymore.

On the other hand, variables declared in the parent scope can be accessed in the child scope. For example, if you define a variable in a function, you can always assess this variable in a nested for loop inside that function. The code below will work:

```mojo
def main():
    var a: Int = 1  # Declare a variable in the parent scope
    print(a)  # Access the variable `a` in the parent scope is valid
    for _i in range(5):  # for loop as a child scope
        print(a)  # Access the variable `a` in the child scope is valid
```

The scope of a variable is also called its **lifetime**, which is a very important concept in Mojo. We will discuss it in detail in [Part IV](../advanced/advanced.md) of this Miji, which is about advanced features of Mojo.

## Re-declaring variables in nested scopes

In the previous section, I mentioned that, if you declare a variable using the `var` keyword, it means that a variable is being created **in the current code block (scope)**. Why we have to emphasize this? Because means that:

1. You cannot use the `var` keyword to declare a variable with the name of an existing variable in the same scope (we have discussed this "shadowing" above).
1. However, you can still use the `var` keyword to declare a variable with the same name as an existing variable in a **nested scope** (child scope). See the following example:

```mojo
def main():
    var a: Int = 1
    print("a =", a, " (before the if block)")
    if True:
        var a: Float64 = 3.1415926
        print("a =", a, " (inside the if block)")
    print("a =", a, " (after the if block)")
```

This code will work and produce the following output:

```console
a = 1  (before the if block)
a = 3.1415926  (inside the if block)
a = 1  (after the if block)
```

The reason is that, when you go into a nested scope (child code block), the Mojo compiler allows you to overwrite the variable name in the parent scope. And the overwritten variable only exists in the child scope. When you go out of the child scope, the variable in the parent scope is still there, and you can access it again. In the above example,

- You first define a variable `a` of type `Int` and value `1` in the `main` function.
- Then, you enter the `if` block and declare a new variable `a` of type `Float64` and value `3.1415926`. This new variable shadows the original variable `a` in the parent scope. Mojo compiler will allocate new memory space for this new variable, while keeping the memory space of the original variable `a` in the parent scope intact. When you print `a` inside the `if` block, it refers to the new variable with value `3.1415926`.
- Next, you go out of the `if` block, and the new variable `a` is destroyed. The original variable `a` in the `main` function is still there. When you print `a` outside the `if` block, it refers to the original variable with value `1`.

How is this possible? The Mojo compiler will always keep track of the variable names in different scopes. This means that the true, internal name of a variable is actually a combination of its name and the scope it is defined in. For example, the variable `a` in the `if` block has a different internal name (identifier) from the variable `a` in the `main` function. The compiler will never mix them up.

:::danger Why you should always use `var`?

Because variable declaration and variable assignment shares the same syntax in Mojo, the compiler may not be able to distinguish your intention. If you always omit the `var` keyword when declaring a variable. This habit will lead to confusion and bugs, especially when you are working with nested scopes. See the following example, which would run without any error, but may produce unexpected results:

```mojo
def main():
    var a = 1
    if a == 1:
        a = 2  # Reassign `a` to 2
               # This `a` is the same variable as the outer `a`
               # They both refer to the same address in memory
    print("a=", a)

    var b = 1
    if b == 1:
        var b = 2  # Create a new variable `b` in the local scope
                   # This `b` shadows the outer `b`
                   # They refer to different addresses in memory
    print("b=", b)
```

```console
a= 2
b= 1
```

In the first `if` block, we use `a = 2`. Since we did not use the `var` keyword, Mojo compiler thinks that we are re-assigning the value of the existing variable `a` in the parent scope. In this sense, no new variable is created, no new memory space is allocated. Mojo compiler simply changes the value of `a` in the parent scope to `2`.
Therefore, when we print `a` in the outer scope, it shows `2`.

In the second `if` block, we use `var b = 2`. This tells Mojo compiler that we are creating a new variable `b` in the local scope. This new variable shadows the outer variable `b`, and Mojo compiler allocates a new memory space for it. Therefore, when we print `b` in the inner scope, it is `2`. However, when we print `b` in the outer scope, it shows `1`.

If you always omit the `var` keyword when declaring a variable, this habit will bring trouble to you. Let's say, you intend to create a new variable in the child scope, you use `b = 2`, and you think this is the correct way to create a new variable while keep the variable `b` in the parent scope unchanged. When you run the code, you will be surprised that the value `b` in the parent scope is changed to `2`.

So, based on Yuhao's experience, it is always good to use the `var` keyword when declaring a variable. There are two main reasons:

1. **Explicitness**: Using `var` makes it clear that you are declaring a new variable. It is particularly helpful when you are working on a large codebase or collaborating with others. You can easily identify where variables are declared and what their types are. It also allows you to put all variable declarations at the beginning of a function, which is a common practice in many programming languages.
1. **Error prevention**: Using `var` helps to prevent accidental overwriting of the values of variables in the parent scope, as shown in the example above.

:::

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

The topic of ownership will be further explained in Chapter [Ownership](../advanced/ownership.md).
:::

## Unused variables

In Mojo, if a variable is declared but not used, the compiler will issue a warning. This is to help you identify potential mistakes that you may have overlooked in your code. For example, the following code will generate a warning:

```mojo
def main():
    var a = "unused variable"
```

```console
warning: assignment to 'a' was never used; assign to '_' instead?
    var a = "unused variable"
            ^
```

In this case, we should consider removing this variable.

Another situation is when you do a loop over a list or a range, but do not use the loop variable. For example:

```mojo
def main():
    for i in range(5):
        print("Hello, world!")
```

You will get a warning like this:

```console
warning: assignment to 'i' was never used; assign to '_' instead?
    for i in range(5):
                  ^
Hello, world!
Hello, world!
Hello, world!
Hello, world!
Hello, world!
```

In this case, you can use the underscore `_` to indicate that this variable is a temporary variable that you do not care about. So the code can be rewritten as follows:

```mojo
def main():
    for _i in range(5):
        print("Hello, world!")
```
