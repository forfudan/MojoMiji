# Reference system of Mojo

[[toc]]

In Chapter [Ownership](../advanced/ownership), we introduced the ownership system of Mojo, as well as four statuses of ownership: **isolated**, **referenced**, **pointed**, and **unsafely pointed**. In the **referenced** status, a variable is defined as the **reference** of another variable, which means that it shares the same value and behaviors of the variable it refers to, but does not have the ownership of the value. Moreover, the lifetime of the reference is tied to the lifetime of the value it refers to. The Mojo compiler will ensure that the reference is valid by checking the ownership rules at compile time. Thus, we can say that the reference is a kind of **alias**.

In Chapter [Functions](../basic/functions) earlier, we introduced the keywords `read`, `mut`, and `owned` as modifiers for function arguments. These keywords are used to define the ownership and mutability of the arguments, and they also relate to the concept of references in Mojo.

In this chapter, we will re-visit the concept of **reference** in Mojo again, but focuses more on different keywords and behaviors of references.

[[toc]]

## References are not pointers

In Rust, "reference" is more a safe pointer to the value than an alias. It is not the same type as the variable (value) it refers to, but a different type, e.g., `&i64` is a reference to an `i64` value. You can think of it as a pointer that is guaranteed to be valid and not null or dangling. If you want to use the value, you need to de-reference it with the `*` operator, e.g., `let b = *a + 1`. Sometimes, the de-referencing is automatically done, which is called "auto-dereferencing".

In Mojo, "reference" is not a type (a safe pointer) as is in Rust, but is more like the reference in C++. A reference refers to the same value but with a different name. Thus, it is an **alias**, a **body double** that is tidily associated with the original variable. It has some right on the value, but not all the rights. By default, it can read the value. Given more permissions, it can also modify the value. No more than that. It cannot destroy the value or change its ownership.

Since it is not a new type, it is therefore, sharing the same behaviors of the original variable. If you want to get the value of the reference, you do not need to de-reference it. In other words, the auto-dereferencing becomes a result convention of the alias rather than a feature of the reference type.

For example, if you pass `a: Int` into function `fn copyit(read some: Int)`, then `some` is an immutable reference (alias) of `a` and behave exactly as `a`. The code `b = some.copy()` within the function would call `a`'s `copy()` method. To print the value, you can simply use `print(some)` without any de-referencing operator, e.g., `print(some[])`.

If you want to use Rust-type reference, e.g., `&Type`, you should use the `Pointer` type, which is a safe pointer that will not null or dangling. Then, you need to always deference it to get access the value. For example, a iterator over the `List` type would returns, in each step, a `Pointer` instance pointing to the address of an element of the list. To print the value, you have to first dereference the pointer with `[]`.

```mojo
def main():
    for i in List[Int](1, 2, 3, 4):
        # i is of the type Pointer[Int]
        print(i[])  # [] is the de-referencing operator
```

::: info Auto-dereferencing

Auto-dereferencing is convenient, but it also increase the complexity of the syntax system. Mojo tries to avoid it.

:::

## Keywords of conventions

Currently, there are three keywords that are related to references in Mojo: `read`, `mut`, and `owned`. Moreover, a `out` keyword is also used to define a named result of a function. In v25.5, there will be a new keyword `ref` to create an alias in the local scope.

The keywords `read`, `mut`, and `owned`, were not always the ones used to define the ownership and mutability of function arguments. In the early days of Mojo, there were other keywords. The current keywords system is discussed in the following discussion thread on GitHub:

- [[Proposal] New ref convention for returning references #2874](https://github.com/modular/modular/discussions/2874)

As a "archaeologist", I always like to track the history of the changes in the language. The following table shows the historical keywords of the conventions and the versions of Mojo when they were used.

| Version    | Immutable<br>reference        | Mutable<br>reference                     | Local mutable<br>reference | Owned value        | Named result     |
| ---------- | ----------------------------- | ---------------------------------------- | -------------------------- | ------------------ | ---------------- |
| 2022-10-24 |                               | `&expr` introduced                       |                            |                    |                  |
| 2023-03-13 | `borrowed` introduced         |                                          |                            | `owned` introduced |                  |
| 2023-05-11 |                               | `inout` introduced<br>`&expr` deprecated |                            |                    |                  |
| v24.6      | `read` introduced             | `mut` introduced                         |                            |                    | `out` introduced |
| v25.1      | `borrowed` generating warning | `inout` generating warning               |                            |                    |                  |
| v25.2      | `borrowed` deprecated         | `inout` deprecated                       |                            |                    |                  |
| v25.4      |                               |                                          | `ref` introduced           |                    |                  |

We will discuss each keyword of conventions in the following sections.


## Mutable reference in local scope:  `ref`

The keyword `ref` allows you to create a **mutable shared reference** of a value in the **local scope**. At the same time, a mutable [**aliases status**](../advanced/ownership.md#four-statuses-of-ownership) is created. At the same time, a mutable [**aliases status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen when you use `var ref y = x`:

1. The variable `y` will get the same address as the variable `x`, so it can access the value at that address.
1. The variable `y` is marked as "mutable", meaning that you can change the value at the **address** of the argument `x`.
1. If you change the value of `y`, the value of `x` will also be modified, since they share the same address in the memory.

Let's look at the following example to see how the `ref` keyword works in the local scope:

```mojo
def main():
    var a = String("I am owned by `a`")
    var ref b = a
    print(a, "at", String(Pointer(to=a)))
    print(b, "at", String(Pointer(to=b)))

    b = String("I am owned by `a` but modified via `b`")
    print(a, "at", String(Pointer(to=a)))
    print(b, "at", String(Pointer(to=b)))
```

You can run the code and see the following output:

```console
I am owned by `a` at 0x16b33cc80
I am owned by `a` at 0x16b33cc80
I am owned by `a` but modified via `b` at 0x16b33cc80
I am owned by `a` but modified via `b` at 0x16b33cc80
```

In this example, we create a variable `a` with the value `1`, and then create a **mutable reference** `b` of `a` using the `ref` keyword. As it is a **aliased status**, the two variables share the same address in the memory (`0x16ae2cc90`). Both of them are of the same type and have the same behaviors. When we change the value of `b` to `3`, the value of `a` is also changed to `3`.

Because `b` is an alias of `a`, it only has the right to use and modify the value of `a`, but does not have the right to destroy it or change its ownership. For example, in the following code, we try to use the transfer operator `^` to transfer the ownership to variable `c`:

```mojo
def main():
    var a = String("I am owned by `a`")
    var ref b = a
    print(a, "at", String(Pointer(to=a)))
    print(b, "at", String(Pointer(to=b)))

    b = String("I am owned by `a` but modified via `b`")
    print(a, "at", String(Pointer(to=a)))
    print(b, "at", String(Pointer(to=b)))

    var c = b^
    print(c, "at", String(Pointer(to=c)))
```

This gives the following error:

```console
/Users/ZHU/Programs/mymojo/temp.mojo:11:14: error: expression does not designate a value with an origin
    var c = b^
             ^
```

This means that Mojo compiler finds that `b` contains the information of the **origin** and immediately knows that `b` is a reference of another variable, but not the owner of the value. Mojo compiler applies the [ownership rules](../advanced/ownership#rules-of-ownership) and rejects the transfer operation.

You can make the code correct if you change `var c = b^` to `var c = a^`, since `a` is the owner of the value and can transfer the ownership to `c`.

::: tip Type of the `ref` variable

If you hover your mouse over the `b` in the line `var ref b = a`, you will see that the type of `b` is `(variable) var b: ref [a] String`. On contrary, if you hover your mouse over `a`, you will see that the type of `a` is `(variable) var a: String`.

This means that `b` is reference to `a` of the type `String`. The square brackets `[a]` in the type of `b` is the very same syntax for [**parameterization**](../advanced/parameterization). It stores the **lifetime information** of `a` as a parameter of `b`.

In this way, the lifetime of `b` is tied to the lifetime of `a`. Mojo will ensure that:

- `a` is alive as long as `b` is still in use.
- `b` will not be used after `a` is destroyed.

This is the "[Lifetime of the owner is longer than reference](../advanced/ownership#lifetime-of-owner-longer-than-reference)" rule of the ownership. We have already discussed this rule in the chapter [Ownership](../advanced/ownership#rules-of-ownership).

:::

::: tip `ref` vs `Pointer`

The `ref` keyword is used to create a mutable reference in the local scope, while the `Pointer` type is used to create a safe pointer that store the address of a value. Both of them:

- Are safe and are checked by the Mojo compiler against the ownership rules.
- Store the information of the lifetime information of the original variable.
- Store the information of the type of the original variable.

The main difference is that you have to de-reference the `Pointer` to access the value, while you can directly use the `ref` variable to access the value.

:::

## Immutable reference in sub-scope: `read`

`read` is the keyword used to define an **immutable shared reference** of a value in the **sub-function scope**. In other words, It creates a read-only alias of the value passed into the function. At the same time, an immutable [**aliases status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If an argument is declared in the function signature with the keyword `read`, then a read-only reference of the value is passed into the function. If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The value at the address is marked as "immutable", meaning that you cannot change the it within the function. The value of the variable outside the function will thus be protected from being modified.

Notably, you cannot use the `read` keyword to define a immutable reference in the **local scope**. For example, the following code will not compile:

```mojo
def main():
    var x: Int = 5
    read y = x  # This will not compile
    print(y)
```

## Mutable reference in sub-scope: `mut`

The keyword `mut` allows you to pass a **mutable shared reference** of a value in the **sub-function scope**. In other words, it creates a mutable alias of the value passed into the function. At the same time, a mutable [**aliases status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If an argument is declared in the function signature with the keyword `read`, then a mutable reference of the value is passed into the function. If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The argument is marked as "mutable", meaning that you can change the value at the **address** of the argument within the function. Since the address of the argument is the same as that of the variable you passed into the function, this means that the value of the variable outside the function will also be modified.

Notably, you cannot use the `mut` keyword to define a mutable reference in the **local scope**. For example, the following code will not compile:

```mojo
def main():
    var x: Float64 = 5.0
    mut y = x  # This will not compile
    print(y)
```

The following example examines the functionality of the `mut` keyword **from the memory's perspective**, so that you can understand the concepts and mechanics better. For this purpose, we need to import the `Pointer` class from the `memory` module, which allows us to print the address of a variable or an argument.

```mojo
# src/basic/mut_keyword.mojo
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

## Owned value in sub-scope: `owned`

The keyword `owned` allows you to pass a **copy** of the value into the function. Not that it is a copy, not a reference. Therefore, an [**isolated status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The value of the variable you passed into the function will be copied to a new address in the memory, and the argument of the function will get this new address and the value at that address.
1. The argument **owns** the value at the new address. It can modify the value at the address.
1. Since the address of the argument in the function is different from that of the variable you passed into the function, the value of the variable outside the function will not be modified.

The following example examines the functionality of the `owned` keyword **from the memory's perspective**. In the function signature of `changeit()`, we use the `owned` keyword to indicate that the argument `a` is an owned copy of the value passed in.

```mojo
# src/basic/owned_keyword.mojo
from memory import Pointer


def changeit(owned a: Int8):
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

Next, you pass this variable `x` into the function `changeit()` with the `owned` keyword. Mojo will then copy the value (`0b00000100`) to a new address `0x16bb38510`, and let the argument `a` to own this new value and the address. These two variables are completely isolated from each other. See the following illustration.

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

## Chained references

In Mojo, the references (aliases) can be chained through the ownership system. This means that you can create an alias to a variable that is already an alias of another variable. Then the two aliases will both be tied to the original owner of the value, and they will share the same address in the memory. For example, see the following code:

```mojo
def main():
    var a = String("I am owned by `a`")
    var ref b = a
    var ref c = b
    print(a, "at", String(Pointer(to=a)))
    print(b, "at", String(Pointer(to=b)))
    print(c, "at", String(Pointer(to=c)))
```

If we run it, we will see the following output:

```console
I am owned by `a` at 0x16d43cc90
I am owned by `a` at 0x16d43cc90
I am owned by `a` at 0x16d43cc90
```

In this example, we create a variable `a` with the value `I am owned by a`, and then create a mutable reference (alias) `b` of `a` using the `ref` keyword. Then we create another mutable reference (alias) `c` of `b`. As a result, `b` and `c` are both aliases of `a`, which means that they share the same address in the memory (`0x16d43cc90`). The value of `a`, `b`, and `c` are all the same.
