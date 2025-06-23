# Lifetime system

> I do not fear death. I fear only you dying after me.  
> -- Yuhao Zhu, *Gate of Heaven*

Lifetime is a concept that describes how long a value (of a variable) exists in memory. It is central to the ownership model because accessing a value after it has been destroyed can lead to undefined behavior. e.g., double free, use after free, dangling pointer, etc. Recall that in Chapter [Ownership](../advanced/ownership#lifetime-of-owner-longer-than-reference), we discussed one of the ownership rules: **the lifetime of the owner must be longer than the lifetime of the reference**. This is a fundamental rule that ensures that references are always valid.

Many people think that lifetime is a complex concept, as well as how to denote it in your code. Indeed, in Rust, lifetime annotation seems to be complex, and failing to understand it can lead to many compiler errors. In Mojo, however, the syntax related to lifetime is much simpler and more intuitive.

::: warning Compatible Mojo version

This chapter is compatible with Mojo v25.4 (2025-06-18).

The lifetime system in Mojo is still evolving. The syntax and semantics described in this document are subject to change in future versions of Mojo.

:::

[[toc]]

## Core philosophy of lifetime

The core philosophy of lifetime system of Mojo is that **the lifetime of a safe pointer or reference (alias), shall not be longer than the lifetime of the variable it points to** ([which is exactly the third ownership rule](../advanced/ownership#lifetime-of-owner-longer-than-reference)). In other words, **the owner of a value must outlive all the borrowers of that value**.

To start with, let's first discuss the start and the end of a lifetime.

## Start and end of lifetime

The lifetime of a variable is the period during which its value is valid and can be safely assessed (directly or indirectly). In Mojo, the lifetime of a variable starts when it is declared and initialized, and ends when it goes out of scope, is explicitly transferring out its ownership, or all its references (and itself) are lastly used. Let's illustrate the scenarios with an example. Consider the following code:

```mojo
# src/advanced/lifetime/lifetime_scenarios.mojo
def main():
    var a = List[Int](1, 2, 3)
    var x = String("I am a string.")

    var ref b = a
    var ref y = x
    var c = Pointer(to=a)
    var z = Pointer(to=x)

    print("0-th element of `a` via `b`:", b[0])
    print("1-st element of `a` via `c`:", c[][1])

    var d = a^

    for i in range(0, 3):
        var e = d[i]
        print("Idx", i, "of `d` is:", e)

    x += " and I am modified."
    print(y)
    print(z[])

    print("The end of the example.")
```

We can see that:

1. `a` and `x` are variables that own their values.
1. `b` and `c` are either reference or safe pointer to `a`, while `y` and `z` are either alias or safe pointer to `x`.
1. `a` transfers the ownership of the value to `d` using the `^` operator.
1. `i` is a loop variable that is used to iterate over the elements of `d`, with values `0`, `1`, and `2`.
1. `e` is a variable that holds the value of the `i`-th element of `d` in the scope of the loop.
1. `x` is modified by appending a string to it, and `y` and `z` are used to print the modified value.

If we run it, we will see the following expected output:

```console
0-th element of `a` via `b`: 1
1-st element of `a` via `c`: 2
Idx 0 of `d` is: 1
Idx 1 of `d` is: 2
Idx 2 of `d` is: 3
I am a string. and I am modified.
I am a string. and I am modified.
```

Now, let's analyze the lifetime of each variable in this code. The lifetime of a variable is determined by when it is created and when it is destroyed. As mentioned above, a variable's lifetime starts when it is initialized (assigned a value) and ends when it goes out of scope, or all its references (and itself) are lastly used. The following table summarizes the start and end of lifetime for each variable in the code:

| Name | Stage  | Lifetime starts or ends after      | Type      | Code                                        |
| ---- | ------ | ---------------------------------- | --------- | ------------------------------------------- |
| `a`  | Starts | Initialization (assigned a value)  | Owner     | `var a = List[Int](1,2,3)`                  |
| `b`  | Starts | Initialization                     | Reference | `var ref b = a`                             |
| `x`  | Starts | Initialization (assigned a value)  | Owner     | `var x = String("I am a string.")`          |
| `y`  | Starts | Initialization                     | Reference | `var ref y = x`                             |
| `c`  | Starts | Initialization                     | Pointer   | `var c = Pointer(to=a)`                     |
| `z`  | Starts | Initialization                     | Pointer   | `var z = Pointer(to=x)`                     |
| `b`  | Ends   | Last used                          | -         | `print("0-th element of a via b:", b[0])`   |
| `c`  | Ends   | Last used                          | -         | `print("1-st element of a via c:", c[][1])` |
| `d`  | Starts | When ownership is transferred in   | Owner     | `var d = a^`                                |
| `a`  | Ends   | When ownership is transferred out  | -         | `var d = a^`                                |
| `i`  | Starts | When the loop starts               | Owner     | `for i in range(0, 3):`                     |
| `e`  | Starts | Initialization (each loop)         | Owner     | `var e = d[i]`                              |
| `e`  | Ends   | When each loop ends (out of scope) | -         | `print("Idx", i, "of d is:", e)`            |
| `i`  | Ends   | When the loop ends (out of scope)  | -         |                                             |
| `y`  | Ends   | Last used                          | -         | `print(y)`                                  |
| `z`  | Ends   | Last used                          | -         | `print(z[])`                                |
| `x`  | Ends   | Last used via pointer `z`          | Owner     | `print(z[])`                                |

Note that, although `x` is last used in the fifth-to-last line, it is not destroyed until `print(z[])` because `z` is pointing to it. The lifetime of `x` is extended until all its references are lastly used. After `print(z[])`, `x` is immediately destroyed, so does the pointer `z`.

We will use comments to denote the start and end of lifetime in the above code.

```mojo
# src/advanced/lifetime/lifetime_scenarios_with_comments.mojo
def main():
    var a = List[Int](1, 2, 3)                     # Lifetime of `a` starts here
    var x = String("I am a string.")               # Lifetime of `x` starts here

    var ref b = a                                  # Lifetime of `b` starts here, sharing `a`
    var ref y = x                                  # Lifetime of `y` starts here, sharing `x`
    var c = Pointer(to=a)                          # Lifetime of `c` starts here, pointing to `a`
    var z = Pointer(to=x)                          # Lifetime of `z` starts here, pointing to `x`

    print("0-th element of `a` via `b`:", b[0])    # Lifetime of `b` ends here, last used
    print("1-st element of `a` via `c`:", c[][1])  # Lifetime of `c` ends here, last used

    var d = a^                                     # Lifetime of `d` starts here, transferring ownership from `a`
                                                   # Lifetime of `a` ends here, ownership transferred to `d`

    for i in range(0, 3):                          # Lifetime of `i` starts here
        var e = d[i]                               # Lifetime of `e` starts here, each loop iteration 
        print("Idx", i, "of `d` is:", e)           # Lifetime of `e` ends here, out of scope

    x += " and I am modified."
    print(y)                                       # Lifetime of `y` ends here, last used
    print(z[])                                     # Lifetime of `z` ends here, last used
                                                   # Lifetime of `x` ends here, last used via `z`

    print("The end of the example.")
```

::: tip ASAP destruction policy

Compared to Rust, Mojo is more aggressive in destroying variables. Rust variables end their lifetime at the end of the current scope (code block), but Mojo destroys a variable immediately after its last use. This is called [ASAP destruction](https://docs.modular.com/mojo/manual/lifecycle/death).

However, the term "last use" does not mean that the variable name lastly appears in the code. It also means that all its references and safe pointers are lastly used. As long as one of its references are still alive, the variable will not be destroyed.

This policy is both safe and efficient:

1. It ensures that the owner of a value is always valid when its references are used.
1. It allows the compiler to optimize memory usage by destroying variables as soon as they are no longer needed, reducing memory footprint and improving performance.

:::

## Tracking lifetime information

How does Mojo ensure, in the last example, that the lifetime of `x` is extended until all its references are lastly used? The answer is **to track the lifetime of the original owner in its references and safe pointers**.

When you create a reference or a safe pointer to a variable, the reference will carry a piece of information on who is the **original** owner variable. Let's say the owner variable is `a`, and you create several references, e.g., `b`, `c`, `d`, etc, to it. Then all these references will carry the information that `a` is the **original** owner of the value.

During compilation, Mojo will do these steps:

1. It first finds out all the variables that contains information on `a`.
1. It then finds out the location where these references, as well as the owner variable `a`, are last used in your code.
1. It extends the lifetime of the owner variable `a` until this location, and immediately destroys it after this line.

This way, Mojo ensures that the owner variable `a` is always valid when its references are used, and it will not be destroyed until all its references are lastly used. If the owner variable `a` is **manually destroyed** (transferring the ownership out) before this location, a compilation error will be raised.

## Chained lifetime

We have earlier discussed about the [chained references](../advanced/references#chained-references) in previous chapter. We can extend this chaining rule to lifetime as well.

In Mojo, the lifetime of a variable can be chained through references. For example, if you have a reference `b` to a variable `a`, and then you create another reference `c` to `b`, then `c` will contains the information on the lifetime (as well as the **mutability**) of the original owner `a`. This means that `c` can only be used as long as `a` is valid.

Let's illustrate this with an example:

```mojo
def main():
    var a = String("I am owned by `a`")
    var ref b = a
    var ref c = b
    var d = Pointer(to=c)
    print(a, "at", String(Pointer(to=a)))
    print(b, "at", String(Pointer(to=b)))
    print(c, "at", String(Pointer(to=c)))
    print(d[], "at", String(Pointer(to=d[])))
```

If we run it, we will see the following output:

```console
I am owned by `a` at 0x16d43cc90
I am owned by `a` at 0x16d43cc90
I am owned by `a` at 0x16d43cc90
I am owned by `a` at 0x16d43cc90
```

Because `b`, `c`, and `d` are all references or safe pointers to `a`, they all contain the information on the lifetime of `a`. This means that Mojo compiler will extend the lifetime of `a` until all these references are lastly used.

In the VS Code editor, you can hover over the variables to see their lifetime information:

| Variable | Information displayed at hover         |
| -------- | -------------------------------------- |
| `a`      | `(variable) var a: String`             |
| `b`      | `(variable) var b: ref [a] String`     |
| `c`      | `(variable) var b: ref [a] String`     |
| `d`      | `(variable) var d: Pointer[String, a]` |

Here, the `[a]` in `ref [a] String` means that the values of `b` and `c` are originally owned by `a`.

`Pointer[String, a]` means that the pointer instance `d` carries the information on the origin as a **parameter**.

::: tip `Origin` and `__origin_of()`

In the previous example, the pointer `d` is of the type `Pointer[String, a]`. The `String` is the type of the value it points to, and `a` is the origin of the value.

If you investigate how the `Pointer` type is defined in Mojo's standard library, you will find that it is defined as follows:

```mojo
struct Pointer[
    mut: Bool, //,
    type: AnyType,
    origin: Origin[mut],
    address_space: AddressSpace = AddressSpace.GENERIC,
](ExplicitlyCopyable, Stringable, Copyable, Movable):
```

Thus, the `a` in `Pointer[String, a]` corresponds to the `origin` parameter of the `Pointer` type. This `origin` parameter is of the type `Origin[mut]`, which is a special type that carries the information on the origin reference including the mutability of the value.

This parameter can be inferred by the compiler when you create a pointer, or you can explicitly specify it when you create a pointer. You can also use the `__origin_of()` function to get the origin reference of a variable pass this value to the function. For example, the following two lines are equivalent:

```mojo
var d = Pointer(to=c)
var e = Pointer[type=String, origin=__origin_of(a)](to=a)
```

:::

## Manual lifetime management

Mojo will automatically track the lifetime of variables and their references, as we discussed above. However, there are cases where you may want to manually manage the lifetime of a variable, especially when a pointer may point to either an owner `a` or an owner `b`. 

Let's illustrate this with an example: The user is asked to input two integers, then the program will create a pointer that points to the smaller of the two integers (the if-statement), finally, the program will print the values of the two integers and the smaller one. The code is as follows:

```mojo
# src/advanced/lifetime/combined_lifetime_wrong.mojo
# This code will not compile
def main():
    var a: Int = Int(input("Type the first integer `a`: "))
    var b: Int = Int(input("Type the second integer `b`: "))
    var c: Pointer[Int]

    if a < b:
        c = Pointer[Int](to=a)
    else:
        c = Pointer[Int](to=b)

    print(
        "The first integer you give is", a, "at address", String(Pointer(to=a))
    )
    print(
        "The second integer you give is", b, "at address", String(Pointer(to=b))
    )
    print("The smaller of the two integers is", c[], "at address", String(c))
```

In the best scenario, we hope that the Mojo compiler can automatically infer the lifetime of `c` based on the branches of the `if` statement.

- If `a` is smaller than `b`, then `c` should point to `a` and records the original owner of the value as `a`. `a` should live as long as `c` is alive (the last line of the code).
- If `b` is smaller than `a`, then `c` should point to `b` and records the original owner of the value as `b`. `b` should live as long as `c` is alive (the last line of the code).

However, this automatic adjustment of lifetime information does not work in Mojo, because Mojo is a statically typed language. The lifetime of a variable is determined at compile time, while the final branch of the `if` statement is determined at runtime. Therefore, the compiler cannot automatically infer the lifetime of `c` based on the branches of the `if` statement at compile time.

The root cause of this problem is that **`c` may point to either `a` or `b` at run time, but you never know this at compile time**. This is like a situation called Schrodinger's cat, where `c` is either pointing to `a` or `b`, or it is neither pointing to `a` nor `b`, or it is both pointing to `a` and `b` at the same time.

Let's say, you bet that `c` will always point to `a` and record this in the signature of `c`, then `b` will be destroyed immediately after the `if` statement. If in the runtime, `b` is smaller than `a`, then `c` will point to `b`, then the last line of the code will try to access an address whose value has already been destroyed, leading to use-after-free error.

Let's run the above code to see what happens:

If we run it, we will see the following error at compile time:

```console
error: failed to infer parameter 'mut'
    var c: Pointer[Int]
                  ^
note: failed to infer parameter 'mut', parameter isn't used in any argument
    var c: Pointer[Int]
                  ^
error: cannot implicitly convert 'Pointer[Int, b]' value to 'Pointer[Int, a]'
        c = Pointer(to=b)
            ~~~~~~~^~~~~~
```

The first two error messages mean that the compiler cannot infer whether the value that `c` points to is *mutable or not*, because we did not explicitly specify the original owner of the value it points to.

The third error message means that the compiler cannot implicitly convert `Pointer[Int, b]` to `Pointer[Int, a]`. Why? Because when we do `c = Pointer(to=a)` in the first branch, `c` stores the original owner of the value to `a`. However, in the second branch, we are trying to overwrite the original to `b`, which is not allowed.

We are lucky that the compiler catches this error at compile time. The safe pointer of Mojo prevents us compiling code that may lead to use-after-free errors at runtime. The question is how to fix this error?

The answer is to **prepare for both cases beforehand**. We can put the information of both `a` and `b` in the pointer `c`, so that Mojo compiler will extend the lifetime of both `a` and `b` until the last line of the code where `c` is lastly used.

To do this, we can use the `__origin_of()` function. This function returns an object (of `Origin` type) that records the original owner(s). Then you can pass this object to the constructor of the `Pointer` type. Let's rewrite the code as follows:

```mojo
# src/advanced/lifetime/combined_lifetime.mojo
def main():
    var a: Int = Int(input("Type the first integer `a`: "))
    var b: Int = Int(input("Type the second integer `b`: "))
    var c: Pointer[Int, origin = __origin_of(a, b)]

    if a < b:
        c = Pointer[Int, origin = __origin_of(a, b)](to=a)
    else:
        c = Pointer[Int, origin = __origin_of(a, b)](to=b)

    print(
        "The first integer you give is", a, "at address", String(Pointer(to=a))
    )
    print(
        "The second integer you give is", b, "at address", String(Pointer(to=b))
    )
    print("The smaller of the two integers is", c[], "at address", String(c))
```

In this code, we explicitly specify the original owner of the value that `c` points to as `__origin_of(a, b)`. This means that `c` may point to either `a` or `b`. Mojo compiler will then ensure that both `a` and `b` are alive as long as `c` is alive.

This is a wildcard solution, it may not be the most efficient, but it is safe and works for both cases. If we run this code and input `-10` and `10`, we will see the following output:

```console
Type the first integer `a`: -10
Type the second integer `b`: 10
The first integer you give is -10 at address 0x16d12cc68
The second integer you give is 10 at address 0x16d12cc70
The smaller of the two integers is -10 at address 0x16d12cc68
```

If we input `20` and `2`, we will see the following output:

```console
Type the first integer `a`: 20
Type the second integer `b`: 2
The first integer you give is 20 at address 0x16fc54c68
The second integer you give is 2 at address 0x16fc54c70
The smaller of the two integers is 2 at address 0x16fc54c70
```

The output is as expected, we always get the smaller of the two integers, the pointer `c` points to the address of the smaller one, and the owner is alive until the last line of the code.

## Lifetime in functions

In the previous example, we create a pointer `c` in the local scope of the `main()` function that may either point to `a` or `b`. You may now wonder whether you can also do this for a function. The answer is yes.

In the following example, we want to create a function `shorter()` that takes two strings (words) as input, and returns a pointer to the shorter one. We then call this function in the `main()` function. The code is as follows.

```mojo
# src/advanced/lifetime/lifetime_function_pointer.mojo
def shorter(
    word1: String, word2: String
) -> Pointer[String, __origin_of(word1, word2)]:
    if len(word1) < len(word2):
        return Pointer[String, __origin_of(word1, word2)](to=word1)
    else:
        return Pointer[String, __origin_of(word1, word2)](to=word2)


def main():
    var a: String = String("beautiful")
    var b: String = String("pretty")

    var c = shorter(a, b)

    print(
        String('The first word you give is "{}" at address {}').format(
            a, String(Pointer(to=a))
        )
    )
    print(
        String('The second word you give is "{}" at address {}').format(
            b, String(Pointer(to=b))
        )
    )
    print(
        String('The shorter of the two words is "{}" at address {}').format(
            c[], String(Pointer(to=c[]))
        )
    )
```

The code is very similar to the previous example, except that we take out the if-statement into a separate function `shorter()`. The function takes two strings as input, and returns a pointer to the shorter one.

One thing that worth noting is that the return type of the function is `Pointer[String, __origin_of(word1, word2)]`, which means that the returned pointer will point to either argument `word1` or `word2`. Therefore, the lifetime of the returned pointer shall not be longer than the lifetime of the arguments `word1` and `word2`.

We have also learned previously that the arguments `word1` and `word2` are immutable references of the variables in the caller function `main()`. This means that the lifetime of the arguments `word1` and `word2` is the same as the lifetime of the variables `a` and `b` in the caller function.

Using the **chained lifetime rule**, we know that the lifetime of the returned pointer, which is assigned to `c`, should be no longer than the lifetime of either `a` or `b` in the caller function. In other words, both `a` and `b` are destroyed only after `c` is lastly used in the caller function.

Running the code will give us the following output:

```console
The first word you give is "beautiful" at address 0x16f768540
The second word you give is "pretty" at address 0x16f768558
The shorter of the two words is "pretty" at address 0x16f768558
```

This is exactly what we expect.

## Lifetime annotation - Mojo vs Rust

If you have used Rust before, you may notice that the above example is very popular in Rust books. Usually a similar example would appear as the first example in the chapter about lifetime.

Let's re-write this example in Rust to see how it looks like, but firstly, a incorrect implementation that would not pass the Rust compiler:

```rust
fn shorter(word1: &String, word2: &String) -> &String {
    if word1.len() < word2.len() {
        word1
    } else {
        word2
    }
}

fn main() {
    let a: String = String::from("Beautiful");
    let b: String = String::from("Pretty");

    let c: &String = shorter(&a, &b);

    println!(r#"The first word you give is "{}" at address {:p}"#, a, &a);
    println!(r#"The second integer you give is "{}" at address {:p}"#, b, &b);
    println!(r#"The shorter of the two words is "{}" at address {:p}"#, c, &c);
}
```

Even though **no error message is shown in IDE**, this code will not compile in Rust.

```console
error[E0106]: missing lifetime specifier
 --> combined_lifetime.rs:1:47
  |
1 | fn shorter(word1: &String, word2: &String) -> &String {
  |                   -------         -------     ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `word1` or `word2`
help: consider introducing a named lifetime parameter
  |
1 | fn shorter<'a>(word1: &'a String, word2: &'a String) -> &'a String {
  |           ++++         ++                 ++             ++

error: aborting due to 1 previous error

For more information about this error, try `rustc --explain E0106`.
```

The reason is already in the error message: **the function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `word1` or `word2`**. In Rust, you need to explicitly annotate the lifetime in the function signature to indicate that the return value should have the same lifetime as either argument `word1` or `word2`. The correct implementation should look like this:

```rust
fn shorter<'a>(word1: &'a String, word2: &'a String) -> &'a String {
    ...
}
```

Here, you use the lifetime annotation `'a` in the function signature, in the type annotation of the arguments, and in the type annotation of the return value. `a` is a formal lifetime parameter which can be any name, but it is conventionally named `'a` in Rust.

This this way, you tell the Rust compiler that the lifetime of the return value is `a`, and it is the same as the lifetime of either `word1` or `word2`. This way, the compiler can ensure that the return value will not outlive the arguments.

After this change, the code will compile successfully in Rust. The final Rust code looks like this:

```rust
fn shorter<'a>(word1: &'a String, word2: &'a String) -> &'a String {
    if word1.len() < word2.len() {
        word1
    } else {
        word2
    }
}

fn main() {
    let a: String = String::from("beautiful");
    let b: String = String::from("pretty");

    let c: &String = shorter(&a, &b);

    println!(r#"The first word you give is "{}" at address {:p}"#, a, &a);
    println!(r#"The second integer you give is "{}" at address {:p}"#, b, &b);
    println!(r#"The shorter of the two words is "{}" at address {:p}"#, c, &c);
}
```

The  output is similar our Mojo code.

```console
The first word you give is "beautiful" at address 0x16b9ce888
The second integer you give is "pretty" at address 0x16b9ce8a0
The shorter of the two words is "pretty" at address 0x16b9ce8b8
```

---

We may want to compare the design philosophy of lifetime annotation in Mojo and Rust:

```mojo
def shorter(
    word1: String, word2: String
) -> Pointer[String, __origin_of(word1, word2)]:
    ...
```

```rust
fn shorter<'a>(word1: &'a String, word2: &'a String) -> &'a String {
    ...
}
```

In **Mojo**, a safe pointer must be created with the information of the original owner. Thus, you cannot use a `Pointer` type as a function argument because you cannot put a existing variable into the `__origin_of()` function.

Moreover, the origin reference in the `Pointer` type cannot be overwritten in your code. Failing to do so will lead to an error as early as in the editing time (IDE warning).

This means that, if your code causes no warning message in the IDE, then it is highly likely that the code will pass the compiler without lifetime errors.

In **Rust**' syntax, however, you do not write the origin owner(s) as a parameter in the signature of the borrower (i.e., the reference). Thus, you have to use the lifetime annotation before all arguments and the return value to indicate the relationship between their lifetimes.

Therefore, the IDE will not warn you about the lifetime issues until you compile the code.

The design philosophy of Mojo and Rust lifetime systems is different. Different people may prefer one over the other. From my perspective, I prefer Mojo's design for the following reasons:

1. By putting the origin reference in the annotation of the pointers or references, the chains of the relationship between the owner and the borrower is more explicit and clear.
1. This annotation only needs to be done in the references or safe pointers, but not in the owner variables.
1. The syntax is more elegant and Pythonic, since `&'a` looks quite strange.

## Lifetime in functions - ref vs Pointer

In the previous example, we used `Pointer` type to return the pointer to the shorter string. However, we can also use `ref` type to achieve the same goal. The code will look like this:

```mojo
# src/advanced/lifetime/lifetime_function_ref.mojo
def shorter(a: String, b: String) -> ref [a, b] String:
    if len(a) < len(b):
        return a
    else:
        return b


def main():
    var a: String = String("beautiful")
    var b: String = String("pretty")

    var ref c = shorter(a, b)

    print(
        String('The first word you give is "{}" at address {}').format(
            a, String(Pointer(to=a))
        )
    )
    print(
        String('The second word you give is "{}" at address {}').format(
            b, String(Pointer(to=b))
        )
    )
    print(
        String('The shorter of the two words is "{}" at address {}').format(
            c, String(Pointer(to=c))
        )
    )
```

In this code, we use `ref [a, b] String` as the return type of the function `shorter()`. This means that the returned reference will point to either `a` or `b`, and it will carry the information on both `a` and `b` as the possible original owners of the value. The lifetime information is expressed in the square brackets `[]` after the `ref` keyword and before the type.

## Major changes in this chapter

- 2025-06-23: Update to accommodate to the changes in Mojo v24.5.
