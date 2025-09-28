# Lifetimes and origin

> I do not fear death. I fear only you dying after me.  
> -- Yuhao Zhu, *Gate of Heaven*

Lifetime is a concept that describes how long a value (of a variable) exists in memory. It is central to the ownership model because accessing a value after it has been destroyed can lead to undefined behavior. e.g., double free, use after free, dangling pointer, etc. Recall that in Chapter [Ownership](../advanced/ownership#lifetime-of-owner-longer-than-reference), we discussed one of the ownership rules: **the lifetime of the owner must be longer than the lifetime of the reference**. This is a fundamental rule that ensures that references are always valid.

Many people think that lifetime is a complex concept, as well as how to denote it in your code. Indeed, in Rust, lifetime annotation seems to be complex, and failing to understand it can lead to many compiler errors. In Mojo, however, the syntax related to lifetime is much simpler and more intuitive.

This chapter will cover the following topics:

- Core philosophy of lifetime
- Tracking lifetimes of origins
- Chained lifetimes
- Manual lifetime management and annotation
- Lifetimes in returns of functions

::: warning Future changes expected

The lifetime system in Mojo is still evolving. The syntax and semantics described in this document are subject to change in future versions of Mojo.

:::

## Core philosophy of lifetime

The core philosophy of lifetime system of Mojo is that **the lifetime of a safe pointer or reference (alias), shall not be longer than the lifetime of the variable it points to** ([which is exactly the third ownership rule](../advanced/ownership#lifetime-of-owner-longer-than-reference)). In other words, **the owner of a value must outlive all the borrowers of that value**.

To start with, let's first discuss the start and the end of a lifetime.

## Start and end of lifetime

The lifetime of a variable is the period during which its value is valid and can be safely assessed (directly or indirectly). In Mojo, the lifetime of a variable starts when it is declared and initialized, and ends when it goes out of scope, is explicitly transferring out its ownership, or all its references (and itself) are lastly used. Let's illustrate the scenarios with an example. Consider the following code:

```mojo
# src/advanced/lifetimes/lifetime_scenarios.mojo
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
# src/advanced/lifetimes/lifetime_scenarios_with_comments.mojo
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

## Tracking lifetimes of origins

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

Because `b`, `c`, and `d` are all references or safe pointers to `a`, they all contain the information on the original owner `a`. This means that Mojo compiler will extend the lifetime of `a` until all these references are lastly used.

In the VS Code editor, you can hover over the variables to see their lifetime information:

| Variable | Information displayed at hover         |
| -------- | -------------------------------------- |
| `a`      | `(variable) var a: String`             |
| `b`      | `(variable) var b: ref [a] String`     |
| `c`      | `(variable) var b: ref [a] String`     |
| `d`      | `(variable) var d: Pointer[String, a]` |

Here, the `[a]` in `ref [a] String` means that the values of `b` and `c` are originally owned by `a`.

`Pointer[String, a]` means that the pointer instance `d` carries the information on the origin as a **parameter**.

## `Origin` and `__origin_of()`

In the previous example, the pointer `d` is of the type `Pointer[String, a]`. We can see there are two items in the square brackets: `String` and `a`.

- `String` is the type of the value it points to.
- `a` is the name of the original owner of the value, which is where the value originates from.

If you investigate how the `Pointer` type is defined in Mojo's standard library, you will find that it is defined as follows:

```mojo
# Mojo standard library
# https://github.com/modular/modular/blob/main/mojo/stdlib/stdlib/memory/pointer.mojo

struct Pointer[
    mut: Bool, //,
    type: AnyType,
    origin: Origin[mut],
    address_space: AddressSpace = AddressSpace.GENERIC,
](ExplicitlyCopyable, Stringable, Copyable, Movable):
    ...
```

Matched by the position of the parameters, we can see that `a` in `Pointer[String, a]` corresponds to the parameter `origin`.

What is this `origin` parameter, which is of the type `Origin[mut]`?

Well, it is a special primitive type that carries the information on two things:

1. The owner of the value, in other words, the ultimate object where the value originates from.
1. The mutability of the value.

The `origin` parameter can be automatically **inferred** by the compiler when you create a pointer. You can also explicitly **specify** it when you create a pointer. In other words, you can define the origin of a pointer a specific owner.

To do this, you need to use the `__origin_of()` function. This function takes the owner variable(s) as arguments and returns an `Origin` object that contains the information on the original owner(s) of the value. Then, you can pass this `Origin` object to the constructor of the `Pointer` type. See the following examples:

```mojo
var d = Pointer(to=c)
# The compiler will automatically infer the origin of `d` as `a`

var e = Pointer[type=String, origin=__origin_of(a)](to=a)
# You manually specify that the origin of the variable `e` is the variable `a`
# by using the `__origin_of()` function
```

## Manual lifetime management and annotation

Mojo will automatically track the lifetime of variables and their references, as we discussed above. However, there are cases where you may want to manually manage the lifetime of a variable, especially when a pointer may point to either an owner `a` or an owner `b`.

Let's illustrate this with an example: The user is asked to input two integers, then the program will create a pointer that points to the smaller of the two integers (the if-statement), finally, the program will print the values of the two integers and the smaller one.

You may immediately come to the following code:

```mojo
# src/advanced/lifetimes/combined_lifetime_wrong.mojo
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

If you try to compile this code, you will see the following error messages:

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

Alas! Why does this error happen? Let's analyze the case carefully:

What we initially hope is that the Mojo compiler can automatically infer the lifetime of `c` based on the branches of the `if` statement, so that,

- If `a` is smaller than `b`, then `c` should point to `a` and records the original owner of the value as `a`. `a` should live as long as `c` is alive (the last line of the code).
- If `b` is smaller than `a`, then `c` should point to `b` and records the original owner of the value as `b`. `b` should live as long as `c` is alive (the last line of the code).

However, the Mojo compiler cannot know in advance which branch of the `if` statement will be executed at runtime. So, it **cannot automatically infer** the lifetime of `c` based on something that will happen in the future.

As a programmer, you cannot make any assumption on which branch will be executed by users, either. This is like a situation called Schrodinger's cat: The final state of `c` is unknown until the `if` statement is executed by users in the future.

Then, how to fix this error?

The answer is quite simple: **to prepare for both cases together**. Since we do not know which branch will be executed, we just assume that both branches will be executed. We tie the lifetime of `c` to both `a` and `b`, so that Mojo compiler will extend the lifetime of both `a` and `b` to be as long as `c` is alive.

To do this, we can use the `__origin_of()` function. This function returns an object (of `Origin` type) that records the original owner(s). Then you can pass this object to the constructor of the `Pointer` type. Let's rewrite the code as follows:

```mojo
# src/advanced/lifetimes/combined_lifetime.mojo
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

In this code, we explicitly specify the original owner of the value that `c` points to as `__origin_of(a, b)`. This means that the lifetime of `c` is tied to both `a` and `b`. Mojo compiler will then ensure that both `a` and `b` are alive as long as `c` is alive.

This solution may not be the most efficient one, but it is the safest. If we run this code and input `-10` and `10`, we will see the following output:

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

---

Let's see another example. We ask the user to input two words (strings), then the program will print the shorter one. The code is as follows:

```mojo
# src/advanced/lifetimes/combined_lifetime_string.mojo
def main():
    var a: String = input("Type the first word `a`: ")
    var b: String = input("Type the first word `b`: ")
    var c: Pointer[String, origin = __origin_of(a, b)]

    if len(a) < len(b):
        c = Pointer[String, origin = __origin_of(a, b)](to=a)
    else:
        c = Pointer[String, origin = __origin_of(a, b)](to=b)

    print("The first word you give is", a, "at address", String(Pointer(to=a)))
    print("The second word you give is", b, "at address", String(Pointer(to=b)))
    print("The shorter of the two words is", c[], "at address", String(c))
```

The code is similar to the previous one, except that we use `String` type instead of `Int` type. If we run it and input `beautiful` and `pretty`, we will see the following output:

```console
Type the first word `a`: Beautiful
Type the first word `b`: Ugly
The first word you give is Beautiful at address 0x16fd38198
The second word you give is Ugly at address 0x16fd381b0
The shorter of the two word is Ugly at address 0x16fd381b0
```

You can see that the output is as expected: The pointer `c` points to the address of the shorter word (in this case, variable `b`), even though which word is shorter is only determined at runtime. By using `__origin_of(a, b)`, we tell the compiler that the pointer `c` may point to either `a` or `b`, so that both `a` and `b` are alive until the last line of the code.

In case we input `Mojo` and `Python`, we will see the following output:

```console
Type the first word `a`: Mojo
Type the first word `b`: Python
The first word you give is Mojo at address 0x16eec0198
The second word you give is Python at address 0x16eec01b0
The shorter of the two word is Mojo at address 0x16eec0198
```

The output is still as expected: The pointer `c` points to the address of the shorter word (in this case, variable `a`).

## Lifetimes in returns of functions

In the previous example, we create a pointer `c` in the local scope of the `main()` function that may either point to `a` or `b`. Although it works, it is some how tedious to write the same `Pointer[Int, origin = __origin_of(a, b)]` in both the declaration and the assignment of `c`.

Mojo provides an alternative way, yet more concise and elegant, to achieve the same goal: Encapsulate the logic in a function that return a reference (instead of a pointer) by use of the `ref` keyword.

We have already discussed about returning references in the previous chapter [References](../advanced/references/#reference-as-returned-value-ref). Recall that, when you return a reference from a function, the syntax is as follows:

```mojo
def function_name(arg: TypeOfArg, ...) -> ref [arg] TypeOfReturn:
```

The `ref [arg] TypeOfReturn` means that the returned reference will carry the information on the argument `arg` as the original owner of the value.

In this chapter, we further extend this syntax to support multiple arguments as the original owners of the returned reference. For example, `ref [a, b] TypeOfReturn` means that the returned reference may point to either argument `a` or argument `b`, and it will carry the information on both `a` and `b` as the possible origins.

Thus, the previous example can be re-written, by adding a auxiliary function `shorter()`, as follows:

```mojo
# src/advanced/lifetimes/lifetime_function_ref.mojo
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

In this code, we use `ref [a, b] String` as the return type of the function `shorter()`. To be more specifc:

- `ref` means that the return is a **referenced value** but not an **owned value**.
- `String` is the type of the returned value.
- `[a, b]` is a parameterization that indicates the reference is tied to the lifetime and mutability of both the argument `a` and `b` (the origins). `[a, b]` is a shortcut for `[__origin_of(a, b)]`, which is the complete syntax to indicate that the lifetime and mutability of the reference originates from the argument `a` and `b`.

In this way, the returned value can either be a reference to `a` or be a reference to `b`, so Mojo compiler will ensure that both `a` and `b` are alive as long as the returned reference is alive.

Later in the `main()` function, we use `var ref c = shorter(a, b)` to let `c` to hold the returned reference from the function `shorter()`. The lifetime of `c` is then tied to the lifetime of both `a` and `b`, so both `a` and `b` will be alive until `c` is lastly used in the last line of the code.

```console
The first word you give is "beautiful" at address 0x16f934220
The second word you give is "pretty" at address 0x16f934238
The shorter of the two words is "pretty" at address 0x16f934238
```

::: warning Note on `var ref c = shorter(a, b)`

Note that we use `var ref c = shorter(a, b)` instead of `var c = shorter(a, b)`. This is because the return type of the function `shorter()` is a reference, so we need to use `var ref` to declare `c` as a reference too. If we use `var c = shorter(a, b)`, the an **implicit copy** will be made and `c` will be an owned value instead of a reference, which is not what we want.

:::

## Further reading

### Lifetime in functions - ref vs Pointer

You may now wonder whether you can also use `Pointer` as the return type of a function, just like using `ref` as the return type. The answer is yes.

In the following example, we create a function `shorter()` that takes two strings (words) as input, and returns a pointer to the shorter one. We then call this function in the `main()` function. The code is as follows.

```mojo
# src/advanced/lifetimes/lifetime_function_pointer.mojo
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

The code is very similar to the previous example where a reference is returned, but this time we return a pointer instead.

One thing that worth noting is that the return type of the function is `Pointer[String, __origin_of(word1, word2)]`, which means that the returned pointer will point to either argument `word1` or `word2`. Therefore, the lifetime of the returned pointer shall not be longer than the lifetime of the arguments `word1` and `word2`.

We have also learned previously that the arguments `word1` and `word2` are immutable references of the variables in the caller function `main()`. This means that the lifetime of the arguments `word1` and `word2` is the same as the lifetime of the variables `a` and `b` in the caller function.

Using the **chained lifetime rule**, we know that the lifetime of the returned pointer, which is assigned to `c`, should be no longer than the lifetime of either `a` or `b` in the caller function. In other words, both `a` and `b` are destroyed only after `c` is lastly used in the caller function.

Running the code will give us the following output, which is exactly what we expect.

```console
The first word you give is "beautiful" at address 0x16f768540
The second word you give is "pretty" at address 0x16f768558
The shorter of the two words is "pretty" at address 0x16f768558
```

Nevertheless, compared to returning a reference, returning a pointer is more verbose and less convenient. You need to write the `Pointer` type with the `__origin_of()` function in both the return type and the return statements. Moreover, you need to use `c[]` to dereference the pointer when you want to access the value.

In future, `Pointer` may eventually go away from Mojo language.

### Lifetime annotation - Mojo vs Rust

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

In **Mojo**, a safe pointer must be created with the information of the original owner. Thus, you cannot use a `Pointer` type as a function argument.

Moreover, the origin reference in the `Pointer` type cannot be overwritten in your code. Failing to do so will lead to an error as early as in the editing time (IDE warning).

This means that, if your code causes no warning message in the IDE, then it is highly likely that the code will pass the compiler without lifetime errors.

In **Rust**' syntax, however, you do not write the origin owner(s) as a parameter in the signature of the borrower (i.e., the reference). Thus, you have to use the lifetime annotation before all arguments and the return value to indicate the relationship between their lifetimes.

Therefore, the IDE will not warn you about the lifetime issues until you compile the code.

The design philosophy of Mojo and Rust lifetime systems is different. Different people may prefer one over the other. From my perspective, I prefer Mojo's design for the following reasons:

1. By putting the origin reference in the annotation of the pointers or references, the chains of the relationship between the owner and the borrower is more explicit and clear.
1. This annotation only needs to be done in the references or safe pointers, but not in the owner variables.
1. The syntax is more elegant and Pythonic, since `&'a` looks quite strange.

## Major changes in this chapter

- 2025-06-23: Update to accommodate the changes in Mojo v25.4.
