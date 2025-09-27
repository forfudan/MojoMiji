# Copy and move

We have briefly touched the topic of value assignment between variables in Chapter [Variables](./variables). In this chapter, we will take a deeper look into how values are transferred between variables in Mojo. More advanced topics such as ownership and borrowing will be covered in later chapters.

This chapter focuses on the following topics:

- Explicit copy of values
- Implicit copy of values
- Move (transfer) of values
- Comparison between Python, Mojo, and Rust on value assignment

## Explicitly copy values

In Mojo, you can explicitly copy the value of a variable to another variable using the `copy()` method. This applies to all types, including primitive types, composite types, and user-defined types. The syntax is as follows:

```mojo
var b = a.copy()
```

The `copy()` method in Mojo creates a new object in memory with the same value as the original object. This means that after copying, the two variables will refer to different memory locations (different objects), and changing one will not affect the other.

Mojo's `copy()` method is similar to Python's `copy.deepcopy()` function, `copy.copy()` function, or the `copy()` method for **composite** types. For primitive types like integers, floats, and booleans, Python does not necessarily create a new object.

The following table summarizes the differences between Mojo's `copy()` method and Python's copying methods:

| Item                   | Mojo            | Python                                       |
| ---------------------- | --------------- | -------------------------------------------- |
| How to copy explicitly | `copy()` method | `copy()` method or `copy` module             |
| Copy behavior          | Deep copy       | Shallow copy or deep copy                    |
| Applicable types       | All types       | Composite types only                         |
| New object created?    | Yes             | Yes for composite types. No for simple types |

::: tip Copy behavior

The copy behavior is defined in the `__copyinit__` method of the type, if it exists, or Mojo will provide a default implementation of copy for you.

The `copy()` method performs a deep copy for composite types (e.g., lists, structs). This means that the values on the heap, instead of pointers, will be recursively copied to the new object.

:::

The following code illustrates how to explicitly copy values between variables in Mojo and Python. Pay attention to the differences in syntax and behavior.

::: code-group

```mojo
# src/basic/variables/explicit_copy_between_variables.mojo
def main():
    var a = 1
    var b = a.copy()  # Explicitly copy the value of `a` into a new variable `b`
    print("a =", a)
    print("b =", b)
    print(
        "a and b has the same address:",
        Pointer(to=a) == Pointer(to=b),
    )

    var str1: String = "Hello"
    var str2 = (
        str1.copy()
    )  # Explicitly copy the value of `str1` into a new variable `str2`
    print("str1 =", str1)
    print("str2 =", str2)
    print(
        "str1 and str2 has the same address:",
        Pointer(to=str1) == Pointer(to=str2),
    )

    var lst1: List[Int] = [1, 2, 3]
    var lst2 = lst1.copy()
    # Explicitly copy the value of `lst1` into a new variable `lst2`
    print("lst1 =", end=" ")
    for i in lst1:
        print(i, end=", ")
    print("\nlst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")
    print(
        "\nlst1 and lst2 has the same address:",
        Pointer(to=lst1) == Pointer(to=lst2),
    )
```

```python
# src/basic/variables/explicit_copy_between_variables.py
import copy


def main():
    a = 1
    b = copy.deepcopy(a)  # Explicitly copy the value of `a` into a new variable `b`
    print("a =", a)
    print("b =", b)
    print(
        "a and b are the same object:",
        id(a) == id(b),
    )

    str1: str = "Hello"
    str2 = copy.deepcopy(
        str1
    )  # Explicitly copy the value of `str1` into a new variable `str2`
    print("str1 =", str1)
    print("str2 =", str2)
    print("str1 and str2 are the same object:", id(str1) == id(str2))

    lst1: list[int] = [1, 2, 3]
    # `lst1` is now referring to a list object with three integers
    lst2: list[int] = (
        lst1.copy()
    )  # `lst2` is now referring to the same list object as `lst1`
    print("lst1 =", lst1)
    print("lst2 =", lst2)
    print("lst1 and lst2 are the same object:", id(lst1) == id(lst2))


main()
```

:::

This code will produce the following output for Mojo.

```console
a = 1
b = 1
a and b has the same address: False
str1 = Hello
str2 = Hello
str1 and str2 has the same address: False
lst1 = 1, 2, 3, 
lst2 = 1, 2, 3, 
lst1 and lst2 has the same address: False
```

Note that Mojo always creates a new object in memory when using the `copy()` method, regardless of the type of the variable.

For Python, the output will be:

```console
a = 1
b = 1
a and b are the same object: True
str1 = Hello
str2 = Hello
str1 and str2 are the same object: True
lst1 = [1, 2, 3]
lst2 = [1, 2, 3]
lst1 and lst2 are the same object: False
```

Note that Python does not necessarily create a new object for primitive types like integers and strings. This is because Python caches small integers and short strings for performance reasons. However, for composite types like lists, Python always creates a new object when using the `copy()` method.

::: tip Before Mojo v0.25.6

Before Mojo v0.25.6 (2025-09-22), the assignment operator `=` always performed a copy operation, regardless of the type of the variable. This means that `b = a` was equivalent to `b = a.copy()` and we do not need to call the `copy()` method for explicit copy.

However, this behavior has been changed from Mojo v0.25.6 where explicit copy and implicit copy are distinguished. Now, you have to use the `copy()` method for explicit copy, and the assignment operator `=` only performs implicit copy for types that are "cheap" to copy. We will discuss implicit copy in the next section.

:::

## Implicitly copy values

On the one hand, it would be tedious if you have to use the `copy()` method every time you want to copy a value between variables. On the other hand, if "copy" can always done implicitly, you may unknowingly create multiple copies of the same data, and this leads to performance issues, especially when dealing with large data structures. We need a balance between convenience and performance.

Mojo achieves this balance by providing a shortcut, an implicit copy mechanism, for types that "cheap" to copy. These types include primitive types (e.g., `Int`, `Float64`, `Bool`), SIMD types (e.g., `SIMD4[Int]`, `SIMD8[Float32]`), and some composite types (e.g., small structs). They are usually small in size and are stored on the stack. Copying these types does not involve heap allocation or deep copying, so it is efficient and does not lead to significant performance overhead.

To perform an implicit copy, you can simply assign the value of one variable to another with the assignment operator `=`, without calling the `copy()` method explicitly. For example:

```mojo
var b = a  # Implicitly copy the value of `a` into a new variable `b`
# This is equivalent to `var b = a.copy()`
```

The following table summarizes the differences between Mojo and Python when it comes to the syntax `b = a`:

| Item                | Mojo                                   | Python                                             |
| ------------------- | -------------------------------------- | -------------------------------------------------- |
| Behavior            | Implicit copy                          | Assignment - bind the name to the object in memory |
| Applicable types    | "small" types (implicitly copyable)    | All types                                          |
| New object created? | Yes                                    | No                                                 |
| Potential errors?   | Yes if type is not implicitly copyable | No                                                 |

::: tip ImplicitCopyable trait

Whether a type is implicitly copyable is determined by the `ImplicitlyCopyable` trait. If a struct conforms to this trait, it means that the type is cheap to copy and can be copied implicitly. For your own user-defined types, you can make them implicitly copyable by implementing the `ImplicitlyCopyable` trait. We will discuss traits in Chapter [Generic and traits](../advanced/generic).

:::

The following code illustrates how to implicitly copy values between variables in Mojo.

```mojo
# src/basic/variables/implicit_copy_between_variables.mojo
def main():
    var a = 1
    var b = a  # Implicitly copy the value of `a` into a new variable `b`
    # This is equivalent to `var b = a.copy()`
    print("a =", a)
    print("b =", b)
    print(
        "a and b has the same address:",
        Pointer(to=a) == Pointer(to=b),
    )

    var str1: String = "Hello"
    var str2 = (
        str1  # Implicitly copy the value of `str1` into a new variable `str2`
    )
    # This is equivalent to `var str2 = str1.copy()`
    print("str1 =", str1)
    print("str2 =", str2)
    print(
        "str1 and str2 has the same address:",
        Pointer(to=str1) == Pointer(to=str2),
    )

    var bool1: Bool = True
    var bool2 = bool1  # Implicitly copy the value of `bool1` into a new variable `bool2`
    # This is equivalent to `var bool2 = bool1.copy()`
    print("bool1 =", bool1)
    print("bool2 =", bool2)
    print(
        "bool1 and bool2 has the same address:",
        Pointer(to=bool1) == Pointer(to=bool2),
    )
```

The code will produce the following output:

```console
a = 1
b = 1
a and b has the same address: False
str1 = Hello
str2 = Hello
str1 and str2 has the same address: False
bool1 = True
bool2 = True
bool1 and bool2 has the same address: False
```

For composite types like lists, dictionaries, or user-defined structs that are not implicitly copyable, you cannot use the assignment operator `=` to implicitly copy their values. Instead, you have to use the `copy()` method explicitly. For example, the following code will produce a compilation error:

```mojo
# src/basic/variables/implicit_copy_between_variables_errors.mojo
# This will not compile from Mojo v0.25.6
def main():
    var lst1: List[Int] = [1, 2, 3]
    var lst2 = lst1
    print("lst1 =", end=" ")
    for i in lst1:
        print(i, end=", ")
    print("\nlst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")
```

This code will produce the following compilation error:

```console
warning: 'List' is no longer implicitly copyable, because it is O(n) expensive; this warning will be an error in the next release of Mojo
    var lst2 = lst1
               ^~~~
```

## Move values

As a Python user, you may be unfamiliar with the concept of "move" in programming. In Mojo, "move" means transferring the object (its value, type, and memory location) of a variable to another variable. After the move, the original variable becomes uninitialized and cannot be used anymore. This is different from copying, where both variables remain valid and independent of each other.

Just like **implicit copy** only works on types that are "cheap" to copy, **move** operations in Mojo only work on types that are "expensive" to copy. These types include composite types (e.g., lists, dictionaries, structs) and user-defined types. They are usually large in size and are stored on the heap. Moving these types avoids the overhead of copying large amounts of data.

After a move operation, the new variable name is referring to the same memory location as the original variable, no new memory allocation or copying of values is needed. This makes move operations very efficient, especially for large data structures.

Based on the effect of the move operation, at this stage, you can very well think that "move" is a way to **rename the object**.

To perform a move operation in Mojo, you can use the transfer operator `^` after the variable name. The syntax is as follows:

```mojo
var b = a^  # Move the value of `a` into a new variable `b`
```

The following table summarizes the syntax `b = a^`:

| Item                  | "Small" types (immovable)        | Composite types (movable) |
| --------------------- | -------------------------------- | ------------------------- |
| Behavior              | Copy value                       | Move value                |
| Potential errors?     | Yes, a warning will be displayed | No                        |
| New memory allocated? | Yes                              | No                        |
| Original variable     | Remains valid                    | Becomes uninitialized     |

::: tip Move behavior

The move behavior is defined in the `__moveinit__` method of the type. If a struct does not have a `__moveinit__` method, `^` will not move the value but instead perform a copy.

:::

Let's see some examples of moving values between variables in Mojo.

```mojo
# src/basic/variables/move_between_variables.mojo
def main():
    var lst1: List[Int] = [1, 2, 3]
    var lst2 = lst1^
    # Move the value of `lst1` into a new variable `lst2`
    print("lst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")

    var str1: String = "Hello"
    var str2 = str1^  # Move the value of `str1` into a new variable `str2`
    print()
    print("str2 =", str2)
```

This code will produce the following output as expected:

```console
lst2 = 1, 2, 3, 
str2 = Hello
```

However, if you try to access the original variable `lst1` after the move operation, you will get a compilation error:

```mojo
    for i in lst1:
        print(i, end=", ")
```

```console
error: use of uninitialized value 'lst1'
    for i in lst1:
             ^
```

---

If you try to move a variable of a type that is not movable, Mojo will perform a copy instead, but it will also display a warning message to inform you that the type is not movable. For example:

```mojo
# src/basic/variables/move_between_variables_errors.mojo
def main():
    var a = 1
    var b = a^  # Move the value of `a` into a new variable `b`
    print("a =", a)
    print("b =", b)
    print(
        "a and b has the same address:",
        Pointer(to=a) == Pointer(to=b),
    )
```

This code will compile and run, but it will produce the following warning:

```console
warning: transfer from a value of trivial register type 'Int' has no effect and can be removed
    var b = a^  # Move the value of `a` into a new variable `b`
             ^
             
a = 1
b = 1
a and b has the same address: False
```

## Types and their behaviors

Based on what we have learnt in the previous sections, a quick conclusion may immediately come to your mind: If a type is not implicitly copyable, then you must either explicitly copy it using the `copy()` method or move it using the move operator `^`. This is indeed the case. Let's summarize the behaviors of different types in Mojo when it comes to value assignment between variables.

| Type    | `b = a`           | `b = a.copy()` | `b = a^`         |
| ------- | ----------------- | -------------- | ---------------- |
| Int     | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| Float64 | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| Bool    | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| SIMD    | ✅ (Implicit) copy | ✅ Copy         | ⚠️ Copy (warning) |
| String  | ✅ (Implicit) copy | ✅ Copy         | ✅ Move           |
| List    | ❌ Error           | ✅ Copy         | ✅ Move           |
| Set     | ❌ Error           | ✅ Copy         | ✅ Move           |
| Dict    | ❌ Error           | ✅ Copy         | ✅ Move           |

`String` is somewhat special because it allows both implicit copy and move operations. This is because `String` is so common used while can both be allocated on the stack (small strings) or on the heap (large strings). Thus, it is designed to be both implicitly copyable and movable.

::: SIMD is implicitly copyable

Small, stack-based data types in Mojo are always implicitly copied, including SIMD types. This can make Mojo faster than Rust in some computations (Pass-by-ref consumes more than direct copying, as detailed in this article: [Should Small Rust Structs be Passed by-copy or by-borrow?](https://www.forrestthewoods.com/blog/should-small-rust-structs-be-passed-by-copy-or-by-borrow/)).

The topic of ownership will be further explained in Chapter [Ownership](../advanced/ownership#transfer-a-value).

:::

## Copy or reference (Python vs Mojo)

As discussed in Chapter [Variables](./variables), Python variables are **references to objects** but not directly linked with a space in the memory. When you create a variable, e.g., `a = 10.0`, Mojo actually does the following things:

1. Create a new object in the memory with the value `10.0`, the type `Float64`, and a unique ID.
1. Put a sticker with the name `a` onto the object.

When you do `a = 20.0`, Python does the following things:

1. Create a new object in the memory with the value `20.0`, the type `Float64`, and a unique ID.
1. Remove the sticker with the name `a` from the old object.
1. Put a sticker with the name `a` onto the new object.

When you do `b = a`, Python does the following things:

1. Find the object with the name `a` in the memory.
1. Put another sticker with the name `b` onto the same object.

This means that, for simple or immutable data types, changing the value of a variable always **creates a new object**. Thus, if you change the value of `a` after `b = a`, `b` will not be affected because `b` is still pointing to the old object.

However, for some complex data types like lists, dictionaries, or custom classes, if you try to change the element, this can lead to some unexpected behaviors. For example,

```python
# src/basic/copy/copy_values_or_references.py
def main():
    lst1 = [1, 2, 3]  # `lst1` is now referring to a list object with three integers
    lst2 = lst1  # `lst2` is now referring to the same list object as `lst1`
    print("lst1 =", lst1)
    print("lst2 =", lst2)
    print("Changing lst1[0] to -1")
    lst1[0] = -1  # This modifies the list object that both `lst1` and `lst2` refer to
    print("lst1 =", lst1)
    print("lst2 =", lst2)

main()
```

The code will produce the following output:

```console
lst1 = [1, 2, 3]
lst2 = [1, 2, 3]
Changing lst1[0] to -1
lst1 = [-1, 2, 3]
lst2 = [-1, 2, 3]
```

We see that when we change the first element of `lst1`, `lst2` is also changed. This is because both `lst1` and `lst2` are referring to the same list object in the memory. Let's see what Python does when you run the code above:

1. `lst1 = [1, 2, 3]`: Create a new list object in the memory with the value `[1, 2, 3]` and type `list[int]`. Put a sticker with the name `lst1` onto the object.
1. `lst2 = lst1`: Find the object with the name `lst1` in the memory. Put another sticker with the name `lst2` onto the same object.
1. `lst1[0] = -1`: Find the object with the name `lst1` in the memory. Modify the first element of the object to `-1`.

Note that in the third step, Python does not create a new object. Instead, it just modifies the existing object that `lst1` is referring to, since the list type is mutable. Because `lst2` is also referring to the same object, it is also affected by the change.

The behavior introduced above is called **reference assignment**. It has advantages and disadvantages. The advantage is that it saves memory space, as you do not need to create a new object every time you change the value of a variable. The disadvantage is that it can lead to unexpected behaviors, as shown in the example above.

If you want to copy the values of the list instead of the reference, you can use the `copy()` method, e.g., `lst3 = lst1.copy()`. This will create a new list object with the same values as `lst1` and put a sticker with the name `lst3` onto the new object. Now, if you change `lst1`, `lst3` will not be affected, as they are referring to different objects in the memory.

---

Mojo, on the other hand, does not have this reference assignment behavior. When you do `var lst2: List[Int] = lst1.copy()`, Mojo will do the following things:

1. Allocate a new memory space with the type `List[Int]` at a new address, and link it with the variable name `lst2`.
1. Copy the values of `lst1` into the new memory space for `lst2`.

This means that `lst1` and `lst2` are now referring to completely different memory spaces. If you change the value of `lst1`, `lst2` will not be affected, and vice versa. The code below illustrates this:

```mojo
# src/basic/copy/copy_values_or_references.mojo
def main():
    var lst1: List[Int] = [1, 2, 3]
    # `lst1` is a variable of type `List[Int]` at Address 1
    var lst2: List[Int] = lst1.copy()
    # `lst2` is a variable of type `List[Int]` at Address 2

    print("lst1 =", end=" ")
    for i in lst1:
        print(i, end=", ")
    print("\nlst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")

    print("\nChanging lst1[0] to -1")
    lst1[0] = -1

    print("lst1 =", end=" ")
    for i in lst1:
        print(i, end=", ")
    print("\nlst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")
```

The code will produce the following output:

```console
lst1 = 1, 2, 3, 
lst2 = 1, 2, 3, 
Changing lst1[0] to -1
lst1 = -1, 2, 3, 
lst2 = 1, 2, 3,
```

To summarize, in Mojo, when you assign a value from one variable to another, it always copies the value, not the reference. This means that an **isolated status** is created and the two variables are independent of each other, changing one will not affect the other.

If you still want to create a reference to an existing variable, you can use the `ref` keyword. This is similar to Python's reference assignment. For example, the following code will create a reference to the variable `lst1`.

```mojo
# src/basic/copy/create_reference_of_a_variable.mojo
def main():
    var lst1: List[Int] = [1, 2, 3]
    # `lst1` is a variable of type `List[Int]` at Address 1
    ref lst2: List[Int] = lst1
    # `lst2` is a reference to the variable `lst1` of type `List[Int]` at Address 1

    print("lst1 =", end=" ")
    for i in lst1:
        print(i, end=", ")
    print("\nlst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")

    print("\nChanging lst1[0] to -1")
    lst1[0] = -1

    print("lst1 =", end=" ")
    for i in lst1:
        print(i, end=", ")
    print("\nlst2 =", end=" ")
    for i in lst2:
        print(i, end=", ")
```

The code will produce the following output:

```console
lst1 = 1, 2, 3, 
lst2 = 1, 2, 3, 
Changing lst1[0] to -1
lst1 = -1, 2, 3, 
lst2 = -1, 2, 3,
```

We will discuss more about "copy at assignment" in Chapter [Ownership](../advanced/ownership#four-statuses-of-ownership), and we will also see how the reference system works in Mojo in Chapter [References](../advanced/references).

## Copy or move value (Rust vs Mojo)

If you are familiar with Rust, you may notice immediately that the behavior of variable assignment with `b = a` in Mojo is different from that in Rust, when it comes to **complex data types** like lists (vectors in Rust), dictionaries (hash maps in Rust), and user-defined structs.

- In Mojo, `b = a` would lead to an error message during compilation. You have to either explicitly copy the value using `b = a.copy()` or move the value using `b = a^`.
- In Rust, however, a move operation will be performed by default, and the original variable will become unusable. As an example, the following code in Rust will not compile:

```rust
fn main() {
    let a = "Hello".to_string();
    let b = a;
    println!("{a}");
    println!("{b}");
}
```

It will produce the following compilation error:

```console
2 |     let a = "Hello".to_string();
  |         - move occurs because `a` has type `String`, which does not implement the `Copy` trait
3 |     let b = a;
  |             - value moved here
4 |     println!("{a}");
  |               ^^^ value borrowed here after move
```

The compilation error occurs because the identifier `a` transfers its ownership of the string value to the identifier `b`, making a unusable.

The following table summarizes the differences between common data types in Rust and Mojo when it comes to value assignment `b = a`:

| Mojo type               | Rust type    | `b = a` behavior in Mojo | `b = a` behavior in Rust |
| ----------------------- | ------------ | ------------------------ | ------------------------ |
| `Int`, `Int32`, `Int64` | `i32`, `i64` | 🟢 Copy                   | 🟢 Copy                   |
| `Float32`, `Float64`    | `f32`, `f64` | 🟢 Copy                   | 🟢 Copy                   |
| `Bool`                  | `bool`       | 🟢 Copy                   | 🟢 Copy                   |
| `String`                | `String`     | 🟢 Copy                   | 🟡 Move                   |
| `List[...]`             | `Vec<...>`   | 🔴 Error                  | 🟡 Move                   |

::: info Is explicit copy and move better?

In Rust, when it comes to `b = a`, whether a copy or move is performed depends on whether the type implements the `Copy` trait. It may be confusing to know whether a copy or move operation is performed, especially for beginners. This would cause extra mental burden during programming.

Compared to Rust, the copy and move operations in Mojo are more explicit. If `b = a` is always a copy if it is allowed. Otherwise, you have to explicitly choose between copy and move. This makes the behavior of variable assignment more predictable and easier to understand.

The downside of Mojo's semantic is that you have to use an extra `^` sigil every time for move operations.

:::

## Major changes in this chapter

- 2025-09-25: Add this chapter to accommodate the changes in Mojo v0.25.6.
