# Variables

In Python, a variable can be seen as a label pointing to an object. For example, in the following code, the variable `a` points to an integer object with the value `1`. You can reassign the variable `a` to a string object "Hello world" using an assignment statement.

```python
a = 1
a = "Hello world!"
```

In Mojo, a variable can be abstractly viewed as a container that has a **variable name** and a **value**. Semantically, the **variable** name is the identifier of the **value** and is bound to it. From a memory perspective, a variable has a memory space and an address, with data stored in this space in the form of bits.

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
