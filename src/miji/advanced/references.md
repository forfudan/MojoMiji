# Reference system and pointers

[[toc]]

In Chapter [Ownership](../advanced/ownership), we introduced the ownership system of Mojo, as well as four statuses of ownership: **isolated**, **referenced**, **pointed**, and **unsafely pointed**. In the **referenced** status, a variable is defined as the **reference** of another variable, which means that it shares the same value and behaviors of the variable it refers to, but does not have the ownership of the value. Moreover, the lifetime of the reference is tied to the lifetime of the value it refers to. The Mojo compiler will ensure that the reference is valid by checking the ownership rules at compile time. Thus, we can say that the reference is a kind of **alias**.

In Chapter [Functions](../basic/functions) earlier, we introduced the keywords `read`, `mut`, and `var` as modifiers for function arguments. These keywords are used to define the ownership and mutability of the arguments, and they also relate to the concept of references in Mojo.

In this chapter, we will re-visit the concept of **reference** in Mojo again, but focuses more on different keywords and behaviors of references.

::: info Future changes expected

The reference system in Mojo is still evolving. The syntax and semantics described in this document are subject to change in future versions of Mojo.

:::

[[toc]]

## References are not pointers

In Rust, "reference" is more a safe pointer to the value than an alias. It is not the same type as the variable (value) it refers to, but a different type, e.g., `&i64` is a reference to an `i64` value. You can think of it as a pointer that is guaranteed to be valid and not null or dangling. If you want to use the value, you need to de-reference it with the `*` operator, e.g., `let b = *a + 1`. Sometimes, the de-referencing is automatically done, which is called "auto-dereferencing".

In Mojo, "reference" is not a type (a safe pointer) as is in Rust, but is more like the reference in C++. A reference refers to the same value but with a different name. Thus, it is an **alias**, a **body double** that is tidily associated with the original variable. It has some right on the value, but not all the rights. By default, it can read the value. Given more permissions, it can also modify the value. No more than that. It cannot destroy the value or change its ownership.

Since it is not a new type, it is therefore, sharing the same behaviors of the original variable. If you want to get the value of the reference, you do not need to de-reference it. In other words, the auto-dereferencing becomes a result convention of the references rather than a feature of the reference type (reference in Mojo is no type).

For example, if you pass `a: Int` into function `fn copyit(read some: Int)`, then `some` is an immutable reference (alias) of `a` and behave exactly as `a`. The code `b = some.copy()` within the function would call `a`'s `copy()` method. To print the value, you can simply use `print(some)` without any de-referencing operator.

If you want to use Rust-type reference, e.g., `&Type`, you should use the `Pointer` type, which is a safe pointer that will not null or dangling. Then, you need to always deference it to get access the value. The following code illustrate how to achieve similar functionality as the "Rust-type reference" in Mojo.

::: code-group

```mojo
# src/advanced/references/pointer_and_deref.mojo
fn main():
    var val = 42
    var ptr = Pointer[Int](to=val)
    print("The address of val is:", String(ptr))
    print("The value pointed to by ptr is:", ptr[])
```

```rust
// Equivalent Rust code
fn main() {
    let val = 42;
    let ptr = &val;
    println!("The address of val is {:p}", ptr);
    println!("The value at that address is {}", *ptr);
}
```

:::

::: info Auto-dereferencing

Auto-dereferencing is convenient, but it also increase the complexity of the syntax system. Mojo tries to avoid it.

:::

## Conventions of references

In Mojo, the keywords `read`, `mut`, and `var`, are the main keywords defining the conventions of arguments. The keyword `out` is used to define a named result of a function. The keyword `ref` to create an reference in the local scope or to return a reference from a function.

In the early days of Mojo, there used to be other keywords. As time went by, the keywords were deprecated or replaced by the current ones. You can find the discussion about why these new names were selected in the following thread on GitHub:

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
| v25.5      |                               |                                          |                            | `var` introduced   |                  |

We will discuss each keyword of conventions in the following sub-sections.

### Reference in local scope:  `ref`

The keyword `ref` allows you to create a **shared reference** of a value in the **local scope**. The mutability of the reference is determined by the **mutability of the origin** of the value. After the declaration, a [**referenced status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

A general syntax of the `ref` keyword is as follows:

```mojo
var ref <name> = <variable>
ref <name> = <variable>  # shorthand syntax
```

If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen when you use `var ref y = x` (or equivalently `ref y = x`):

1. The variable `y` will get the same address as the variable `x`, so it can access the value at that address.
1. The variable `y` is marked as "mutable" or "immutable", depending on whether `x` is mutable or not.
1. If you change the value of `y`, the value of `x` will also be modified, since they share the same address in the memory.
1. The variable `x` will not be destroyed as long as `y` is still in use.

Let's look at the following example to see how the `ref` keyword works in the local scope:

```mojo
# src/advanced/references/ref_in_local_scope.mojo
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
I am owned by `a` at 0x16ce283d0
I am owned by `a` at 0x16ce283d0
I am owned by `a` but modified via `b` at 0x16ce283d0
I am owned by `a` but modified via `b` at 0x16ce283d0
```

In this example, we create a variable `a` with the value `1`, and then create a **mutable reference** `b` of `a` using the `ref` keyword. As it is a **referenced status**, the two variables share the same address in the memory (`0x16ce283d0`). Both of them are of the same type and have the same behaviors. When we change the value of `b` to `3`, the value of `a` is also changed to `3`.

Because `b` is an reference of `a`, it only has the right to use and modify the value of `a`, but does not have the right to destroy it or change its ownership. For example, in the following code, we try to use the transfer operator `^` to transfer the ownership to variable `c`:

```mojo
# src/advanced/references/transfer_ownership_via_reference.mojo
# This code will not compile
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
error: expression does not designate a value with an origin
    var c = b^
             ^
```

This means that Mojo compiler finds that `b` contains the information of the **origin** and immediately knows that `b` is a reference of another variable, but not the owner of the value. Mojo compiler applies the [ownership rules](../advanced/ownership#rules-of-ownership) and rejects the transfer operation.

You can make the code correct if you change `var c = b^` to `var c = a^`, since `a` is the owner of the value and can transfer the ownership to `c`.

::: tip Type of the `ref` variable

If you hover your mouse over the `b` in the line `var ref b = a`, you will see that the type of `b` is `(variable) var b: ref [a] String`. On contrary, if you hover your mouse over `a`, you will see that the type of `a` is `(variable) var a: String`.

There are two more components in the type of `b`:

1. A keyword `ref`: This means that `b` is reference to `a` of the type `String`.
1. A contation `[a]`: The square backets are used to stand for [**parameterization**](../advanced/parameterization). `[a]` means that the origin of the value of `b`, which is the variable `a`, is stored as a parameter of `b`.

These two pieces of information are important. They ensure that the reference `b` is tied to the lifetime of `a`, and this information will be used by the Mojo compiler to check the ownership rules, which are:

- `a` should be kept alive as long as `b` is still in use.
- After `a` and `b` are used for the last time, `a` and `b` can be destroyed.

This is the so-called "[Lifetime of the owner is longer than reference](../advanced/ownership#lifetime-of-owner-longer-than-reference)" rule of the ownership that is already discussed in the chapter [Ownership](../advanced/ownership#rules-of-ownership).

:::

::: tip `ref` vs `Pointer`

The `ref` keyword is used to create a mutable reference in the local scope, while the `Pointer` type is used to create a safe pointer that store the address of a value. Both of them:

- Are safe and are checked by the Mojo compiler against the ownership rules.
- Store the information of the lifetime information of the original variable.
- Store the information of the type of the original variable.

The main difference is that you have to de-reference the `Pointer` to access the value, while you can directly use the `ref` variable to access the value.

:::

### Immutable reference in sub-scope: `read`

`read` is the keyword used to define an **immutable shared reference** of a value in the **sub-function scope**. In other words, It creates a read-only reference of the value passed into the function. At the same time, an immutable [**referenced status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If an argument is declared in the function signature with the keyword `read`, then a read-only reference of the value is passed into the function. If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The value at the address is marked as "immutable", meaning that you cannot change the it within the function. The value of the variable outside the function will thus be protected from being modified.

Notably, you cannot use the `read` keyword to define a immutable reference in the **local scope**. For example, the following code will not compile:

```mojo
# This code will not compile
def main():
    var x: Int = 5
    read y = x  # This will not compile
    print(y)
```

You should use the `ref` keyword instead:

```mojo
def main():
    var x: Int = 5
    ref y = x
    print(y)
```

### Mutable reference in sub-scope: `mut`

The keyword `mut` allows you to pass a **mutable shared reference** of a value in the **sub-function scope**. In other words, it creates a mutable reference of the value passed into the function. At the same time, a mutable [**referenced status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If an argument is declared in the function signature with the keyword `read`, then a mutable reference of the value is passed into the function. If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The argument will get the same address as the variable you passed into the function, so it can access the value at that address.
1. The argument is marked as "mutable", meaning that you can change the value at the **address** of the argument within the function. Since the address of the argument is the same as that of the variable you passed into the function, this means that the value of the variable outside the function will also be modified.

Notably, you cannot use the `mut` keyword to define a mutable reference in the **local scope**. For example, the following code will not compile:

```mojo
# This code will not compile
def main():
    var x: Float64 = 5.0
    mut y = x  # This will not compile
    print(y)
```

You should use the `ref` keyword instead:

```mojo
def main():
    var x: Float64 = 5.0
    ref y = x
    print(y)
```

The following example examines the functionality of the `mut` keyword **from the memory's perspective**, so that you can understand the concepts and mechanics better. For this purpose, we need to import the `Pointer` class from the `memory` module, which allows us to print the address of a variable or an argument.

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

Next, you pass this value into the function `changeit()` with the `mut` keyword. Mojo will then mark argument `a` as a **mutable** reference of `x`. The argument `a` is an reference (alias) of `x`, which means they are of the same type and has the same address `16b6a8fb0`. See the following illustration.

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

### Copied value in sub-scope: `var`

The keyword `var` allows you to pass a **copy** of the value into the function. Not that it is a copy, not a reference. Therefore, an [**isolated status**](../advanced/ownership.md#four-statuses-of-ownership) is created.

If we apply our [conceptual model of variables](../basic/variables.md#conceptual-model-of-variable), the following things will happen:

1. The value of the variable you passed into the function will be copied to a new address in the memory, and the argument of the function will get this new address and the value at that address.
1. The argument **owns** the value at the new address. It can modify the value at the address.
1. Since the address of the argument in the function is different from that of the variable you passed into the function, the value of the variable outside the function will not be modified.

The following example examines the functionality of the `var` keyword **from the memory's perspective**. In the function signature of `changeit()`, we use the `var` keyword to indicate that the argument `a` is an owned copy of the value passed in.

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

### Reference as returned value: `ref`

The `ref` keyword can also be used to **return a reference** of a value from a function. This is useful when you do not want to copy the value, nor do you want to create a pointer to the value. The general syntax of the `ref` keyword in the return type is as follows:

```mojo
def function_name(arg: TypeOfArg, ...) -> ref [arg] TypeOfReturn:
def function_name(arg: TypeOfArg, ...) -> ref [__origin_of(...)] TypeOfReturn:
```

Before we explain what the syntax means, let's first look at an example where we define a function to return the first element of a list. Then we modify this value in the main function and see how it affects the original list. There are three approaches to achieve this: (1) return a copy of the value, (2) return a pointer to the value, and (3) return a reference to the value.

The first piece of code illustrates how to return the first element of a list as a copy:

::: code-group

```mojo
# src/advanced/references/return_as_copy.mojo
def return_first_element_as_copy(mut a: List[String]) -> String:
    if len(a) == 0:
        raise Error("List is empty.")
    else:
        return a[0]


def main():
    var lst = List[String]("Mojo", "is", "interesting")
    print("The 1st item of the list is '", lst[0], "'", sep="")
    var val = return_first_element_as_copy(lst)
    val = String("Miji")
    print("The 1st item of the list is now '", lst[0], "'", sep="")
```

:::

Executing the code will produce the following output:

```console
The 1st item of the list is 'Mojo'
The 1st item of the list is 'Mojo' now
```

This is because the function `return_first_element_as_copy()` returns a copy of the first element of the list. An additional memory space is allocated for the returned value, *i.e.*, an **isolated status** is created. If you change the value of `val`, it does not affect the original list.

---

The second piece of code illustrates how to return a safe pointer to the first element of a list:

::: code-group

```mojo
# src/advanced/references/return_as_pointer.mojo
def return_first_element_as_pointer(
    mut a: List[String],
) -> Pointer[String, __origin_of(a)]:
    if len(a) == 0:
        raise Error("List is empty.")
    else:
        return Pointer(to=a[0])


def main():
    var lst = List[String]("Mojo", "is", "interesting")
    print("The 1st item of the list is '", lst[0], "'", sep="")
    var ptr = return_first_element_as_pointer(lst)
    ptr[] = String("Miji")
    print("The 1st item of the list is '", lst[0], "' now", sep="")
```

:::

Executing the code will produce the following output:

```console
The 1st item of the list is 'Mojo'
The 1st item of the list is 'Miji' now
```

This is because the function `return_first_element_as_pointer()` returns a **safe pointer** to the first element of the list (`mut` is to indicate that the `str` argument is mutable, so as the returned pointer), *i.e.*, a **pointed status** is created. If you change the value of `ptr[]` in the main function, it will modify the original list, since `ptr` is a pointer to the address of the first element of the list. The value of `lst[0]` is changed to `Miji`.

---

These two approaches are sometimes not ideal:

1. If you return a copy of the value, you will allocate an additional memory space for the returned value. Moreover, you cannot use it to modify the original value.
1. If you return a pointer to the value, you also need to allocate an additional memory space for the pointer itself (32-bit or 64-bit based on your system), and you need to dereference the pointer to access the value. This can be cumbersome.

Thus, we can try to use the third approach, which is to return a **mutable reference** of the value. This allows you to modify the original value without allocating additional memory space for the pointer. The code is as follows:

::: code-group

```mojo
# src/advanced/references/return_as_reference.mojo
def return_first_element_as_reference(
    mut a: List[String],
) -> ref [a] String:
    if len(a) == 0:
        raise Error("List is empty.")
    else:
        return ref a[0]


def main():
    var lst = List[String]("Mojo", "is", "interesting")
    print("The 1st item of the list is '", lst[0], "'", sep="")
    ref first = return_first_element_as_reference(lst)
    first = String("Miji")
    print("The 1st item of the list is '", lst[0], "' now", sep="")
```

:::

Executing the code will produce the following output:

```console
The 1st item of the list is 'Mojo'
The 1st item of the list is 'Miji' now
```

This generates the same result as the code where we return a pointer to the value. Let's dissect the code to see how it works:

```mojo
def return_first_element_as_reference(
    mut a: List[String],
) -> ref [a] String:
    ...
```

In the function signature:

- We use the `mut` keyword to indicate that the argument `a` is a mutable reference to the original list in the caller function.
- The return type is `ref [a] String`, where,
- `ref` means that we are returning a **reference** to a value, not a copy.
- `String` means that the type of the returned value is `String`.
- `[str]` is a [**parameterization**](../advanced/parameterization.md)). It indicates that the reference is tied to the lifetime and mutability of the argument `str` (the origin).
- Recall that the mutability of the reference is determined by the mutability of the origin, which is `str` in this case. Since `str` is mutable, the reference returned by the function is also **mutable**.

```mojo
...
    if len(str) == 0:
        raise Error("List is empty.")
    else:
        return ref str[0]
```

In the function body, we return the first element of the list if the list is not empty (`return ref str[0]`). Because we explicitly specify the return type as `ref [str] String` in the function signature, Mojo will mark this returned value as a reference instead of a copy.

You can also write `return str[0]` without the `ref` keyword, and Mojo will automatically infer that it is a reference based on the return type.

```mojo
def main():
    var lst = List[String]("Mojo", "is", "interesting")
    print("The 1st item of the list is '", lst[0], "'", sep="")
    ref first = return_first_element_as_reference(lst)
    first = String("Miji")
    print("The 1st item of the list is '", lst[0], "' now", sep="")
```

In the main function, we call the function `return_first_element_as_reference(lst)` and assign the returned reference to the another reference called `first`. Now, `first` is a mutable reference to the first element of the list `lst`. When we change the value of `first` to `String("Miji")`, it modifies the original list `lst`.

Note that we have a chained reference here:  

1. Variable `lst` is the owner of the value.
2. -> Argument `a` is a mutable reference of `lst`.
3. -> Return value is a mutable reference of `a[0]` and thus a mutable reference of `lst[0]`.
4. -> Variable `first` is a mutable reference of the return value and thus a mutable reference of `lst[0]`.

We will discuss the chained references in more detail in the [next section](#chained-references).

---

Back to the syntax of the `ref` keyword in the return type. You can now understand it more easily:

```mojo
def function_name(arg: TypeOfArg, ...) -> ref [arg] TypeOfReturn:
def function_name(arg: TypeOfArg, ...) -> ref [__origin_of(arg)] TypeOfReturn:
```

Here:

- `ref` means that the returned value is a **mutable reference**.
- `TypeOfReturn` is the type of the returned value.
- `[arg]` is a parameterization that indicates the reference is tied to the lifetime and mutability of the argument `arg` (the origin). The mutability information stored as a parameter is called **parametric mutability**. This suggests that the information is known at compile time.
- `[arg]` is a shortcut for `[__origin_of(arg)]`, which is the complete syntax to indicate that the lifetime and mutability of the reference originates from the argument `arg` (the `__origin_of` function is a built-in function that returns an object with the information of the origin of the value).
- You can also put multiple arguments in the parameterization, such as `[arg1, arg2, ...]`, to indicate that the reference is tied to the lifetime and mutability of multiple arguments.

We will discuss lifetimes and origins in more detail in the chapter [Lifetimes and Origins](../advanced/lifetimes).

## Chained references

### reference to reference

In Mojo, the references (aliases) or safe pointers can be chained through the ownership system. This means that you can create an reference (or a pointer) to a variable that is already an reference of (or a pointer to) another variable. Then the two references (or pointers) will both be tied to the original owner of the value, and they will share the same address in the memory.

We have already seen the chained references in the previous section. Here is a quick recap:

```mojo
# src/advanced/references/chained_references.mojo


def return_as_reference(mut x: String) -> ref [x] String:
    var ref y = x
    return y


def main():
    var a = String("I am owned by 'a'")
    var ref b = a
    var ref c = b
    var ref d = return_as_reference(c)
    print("a:", a, "at", String(Pointer(to=a)))
    print("b:", b, "at", String(Pointer(to=b)))
    print("c:", c, "at", String(Pointer(to=c)))
    print("d:", d, "at", String(Pointer(to=d)))

    print("Changing `d`...")
    d = String("I am still owned by 'a' but I am longer now")
    print("a:", a, "at", String(Pointer(to=a)))
```

If we run it, we will see the following output:

```console
a: I am owned by 'a' at 0x16ee243e0
b: I am owned by 'a' at 0x16ee243e0
c: I am owned by 'a' at 0x16ee243e0
d: I am owned by 'a' at 0x16ee243e0
Changing `d`...
a: I am still owned by 'a' but I am longer now at 0x16ee243e0
```

In this example, we create a variable `a` with the value `I am owned by 'a'`, and then create a mutable reference `b` of `a` using the `ref` keyword. Then we create another mutable reference `c` of `b`. Then we pass `c` into the function `return_as_reference()`, which returns a mutable reference `d` of `c`. As a result, `b`, `c`, `d` are all references of `a`, which means that they share the same value at the same address in the memory (`0x16d43cc90`). If you change the value of `d`, it will also impact the value of `a`.

The chained references can be summarized as follows:

- Variable `a` is the owner of the value.
- -> Variable `b` is a mutable reference of `a`.
- -> Variable `c` is a mutable reference of `b`.
- -> Argument `x` in the function `return_as_reference()` is a mutable reference of `c`.
- -> Variable `y` in the function `return_as_reference()` is a mutable reference of `x`.
- -> Variable `d` is a mutable reference of `y`, which is the return value of the function `return_as_reference()`.

### Mutability of chained references

The mutability of the chained references (or pointers) is determined by the mutability of the origin of the value. Two rules are applied:

1. If a value is immutable, then all the references that are originated from it are also immutable.
1. If a value is mutable, then all the references that are originated from it can either be mutable or immutable, depending on which keyword you use to define the reference.

To summarize: **A mutable status can be changed in to a immutable status in the chained references, but not the other way around**. Once the mutability is changed from mutable to immutable, all the references that are originated from it will also become immutable.

Let's summarize in the below table, when we use different conventional keywords, the mutability of the reference given the mutability of the origin.

| Keyword | Origin is *mutable*              | Origin is *immutable* |
| ------- | -------------------------------- | --------------------- |
| `read`  | immutable reference (`muttoimm`) | immutable reference   |
| `mut`   | mutable reference                | **Not allowed**       |
| `owned` | owned value (mutable)            | owned value (mutable) |

For example, the following code illustrates such a chained references with different mutability:

- owner `a` -> mutable reference `b` -> immutable reference `c` -> immutable reference `d`.

```mojo
def main():
    var a = 10
    print("Before function call (mutable):", a)
    first_reference(a)

def first_reference(mut b: Int):
    b = 20
    print("First reference made with `mut`:", b)
    second_reference(b)

def second_reference(read c: Int):
    print("Second reference made with `read`:", c)
    third_reference(c)

def third_reference(read d: Int):
    print("Third reference made with `read`:", d)
```

The code will compile and run successfully, producing the following output:

```console
Before function call (mutable): 10
First reference made with `mut`: 20
Second reference made with `read`: 20
Third reference made with `read`: 20
```

---

The following code illustrates another scenario where the chained references will not work:  
owner `a` -> mutable reference `b` -> immutable reference `c` -> ~~mutable reference `d`~~.

Note that the last reference `d` is not allowed: since `c` is an immutable reference, it cannot be changed to a mutable reference by using the `mut` keyword. This will result in a compilation error.

```mojo
# The code will not compile
def first_reference(mut b: Int):
    b = 20
    print("First reference made with `mut`:", b)
    second_reference(b)


def second_reference(read c: Int):
    print("Second reference made with `read`:", c)
    third_reference(c)


def third_reference(mut d: Int):
    print("Third reference made with `mut`:", d)


def main():
    var a = 10
    print("Before function call (mutable):", a)
    first_reference(a)
```

The code will not compile, producing the following error:

```console
error: invalid call to 'third_reference': argument #0 must be mutable in order to pass to a mutating argument
    third_reference(c)
    ~~~~~~~~~~~~~~~^~~
```

## Major changes in this chapter

- 2025-06-23: Update to accommodate to the changes in Mojo v25.4.
- 2025-09-04: Update to accommodate to the changes in Mojo v25.5.
