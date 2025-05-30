# Ownership

Perhaps Rust is the programming languages that we should thank the most for making the concept of **ownership** popular (maybe also the term "lifetime"). The so-called "ownership" is a conceptual model that intuitively describes how memory is managed and meticulously track the life cycle of values in a program.

We don't have ownership in Python, because Python has a garbage collector system that automatically manages memory for us, e.g., count the number of references to a value, free the memory when the reference count reaches zero, and so on. This is a very convenient feature because we don't have to worry about memory management at all. We can just focus on writing code and implementing our logic.

However, in Mojo, there is no garbage collector. To ensure memory safety and performance, we have to set up a conceptual model to help track the life cycle of values and prevent memory-related issues. These work should even be done as early as in the compilation stage. This is the reason why we need the ownership model in Mojo.

Luckily, you do not need to know the ownership model if you just want to write simple Mojo code. Mojo's design philosophy ensures that you do not need to encounter tons of compilation errors when you write Mojo code (Rust users may smile at this). But if you want to write more complex Mojo code, or if you want to write efficient and safe Mojo code, then you have to understand the ownership model, more or less.

I have to say that it is difficult. You may find that you are still at a loss after reading this chapter. Don't worry. You are not alone. What you need is just to code more and think more. As you accumulated sufficient experience after a while, you can back to this chapter again or read other materials, and will eventually manage it.

[[toc]]

## Why it is important?

Because we want a better tool to help us ensure memory safety, that values are valid and that the values are not assessed in an unintended way.

Let's use a more intuitive example to illustrate these concepts:

In a metropolitan city, there are many, many houses, each with a specific address and a person living in it. Some of these persons are secret agents. You are also a secret agent, and your job is to find these agents at their addresses, then either talk to them or do something (good or bad) on them. You never met these agents before, so you can only find them by their addresses. As your boss, they cares about that:

1. You should be able to find the correct (intended) person at an address. In other words, if a person has not yet moved in or has already left the house, you should not try to find him there. (Otherwise, you will meet a wrong person. Your secret got exposed or you will be in trouble.)
1. You should not harm, remove, or replace the person at the address, unless you are permitted to do so. Without clear permission, you should only talk with the person at the address. (Otherwise, you may cause losses to your organization.)
1. You should mark the house as "available" as soon as you remove the person (in cold or in warm) out of the house, so that other people can use the house again. (Otherwise, more and more people become homeless while there are increasing number of empty houses in the city.)

To achieve these goals, your bose set up several strict rules on the system that tracking the addresses and the persons living in them. Any potential violation of the rules will cause a red flag and you will not be allowed to go on the mission. But once you are allowed to go on the mission, you can be sure that you will not meet any wrong person at the address, nor cause any unintended harm to the person living in the house.

That's it. This is all about memory management and the objective of the ownership model. Just think that the address of houses is the memory address. The person living in the house is the value (data). You never want to access a value that is invalid (e.g., the **dangling-pointer** problem, the **uninitialized-value** problem), to modify a value unintentionally (e.g., the **double-free** problem, the **accidental-overwriting** problem, etc), nor to exhaust the memory (e.g., the **memory-leak** problem). Finally, the rules that your boss set up are the ownership rules that the Mojo compiler checks at compile time.

## Ownership in Mojo

::: info Mojo vs Rust

The ownership model and semantics implemented by Mojo are (significantly) different from Rust's references and lifetimes (See [this article](https://gist.github.com/lattner/da647146ea573902782525f3446829ff) by Chris Lattner).

:::

The key of the "ownership" model is that any value (a meaning piece of information that you directly or indirectly create or use) has an owner. The variable is the owner of the value; the struct is the owner of its fields. The ownership is also hierarchical, meaning that an owner may also have an owner. For example, a integer value is owned by a variable `size` which is further owned by a `List` instance.

A value can have only one **owner** throughout its lifetime, from creation to destruction. The owner has the supermost authority over the value, including the right to read, modify, and destroy the value. If the owner dies, the value will also be destroyed.

Any other parties, who want to read or modify a value at an address, have to firstly check with the owner of the value. A value with no owner should not be accessed at all. The owner of the value must live at least as long as the life of the third-party which accesses the value.

During the compilation, the Mojo compiler will check whether the ownership rules are strictly followed. If not, it will raise an error and refuse to compile the code. This is to ensure that the program is safe and the issues mentioned above do not occur at runtime.

## Rules of ownership

::: info Conceptual

Being "conceptual", the ownership model does not necessarily reflect the actual implementation of the Mojo compiler or the memory management system. After all, the programs are down to machine code that manipulates a series of bytes in memory. These bytes never know who owns them or what they should do.

The ownership model is thus a high-level abstraction that provides programmers an intuitive picture of how values should be managed and why this is a good way. Applying this conceptual model at the programming stage and compilation stage can help us avoid common pitfalls and issues related to memory safety.

Nothing is perfect, so does the ownership model. It is not a golden sword that can solve all the problems. If you think that a program that passes the compilation is guaranteed to be safe and correct, you are wrong. The ownership model may not cover all possible cases, the compiler may not be able to catch all violations of the rules, and, finally, there are always ways and tricks bypass the ownership checks. Thus, as a programmer, you should think about the ownership and not always rely on the compiler to do everything for you. By keeping ownership in mind, even if you are program in the unsafe mode, you can still write safe and efficient code.

:::

Here are the most important, but not all, rules of ownership in Mojo. They are either enforced as part of the language (syntax or semantics) or checked by the Mojo compiler at compile time:

1. A value can have only one owner at a time throughout its lifetime, from creation to destruction.
1. If the lifetime of the owner ends, the value will be destroyed.
1. The lifetime of the owner must be at least as long as the lifetime of the third-party that accesses the value.

### A value has only one owner

For each value, there can only be one owner throughout its lifetime, from creation to destruction.

The following figure shows a value `0b00000100` stored at the address `0x16b6a8fb0` in memory. The variable with the name `a: Int8` owns this value. You can always use the name `a` to retrieve or modify the value. When the variable `a` goes out of the scope (after the last time it is used), it will be destroyed. The value will also be destroyed, and the memory at the address `0x16b6a8fb0` will be freed.

Since the value is destroyed, this memory block is uninitialized. It can later be assigned to another owner. For example, a new variable `b: Int16 = 00000000 00001111` is created at the same address. It will then own the new value `00000000 00001111`.

```console
                variable `a: Int8` owns the value
                               ↓
        ┌────────┬────────┬────────┬────────┬────────┬────────┐
Value   │        │        │00000100│        │        │        │
        ├────────┼────────┼────────┼────────┼────────┼────────┤
Address │16b6afae│16b6afaf│16b6afb0│16b6afb1│16b6afb2│16b6afb3│
        └────────┴────────┴────────┴────────┴────────┴────────┘

                    (variable `a` is destroyed)

              The memory is freed, value is destroyed
                               ↓
        ┌────────┬────────┬────────┬────────┬────────┬────────┐
Value   │        │        │????????│        │        │        │
        ├────────┼────────┼────────┼────────┼────────┼────────┤
Address │16b6afae│16b6afaf│16b6afb0│16b6afb1│16b6afb2│16b6afb3│
        └────────┴────────┴────────┴────────┴────────┴────────┘

         (Create a new variable `b: Int16 = 0b00000000_00001111`)
                               
        variable `b: Int16` owns the new value at the same address
                                   ↓
        ┌────────┬────────┬─────────────────┬────────┬────────┐
Value   │        │        │00000000 00001111│        │        │
        ├────────┼────────┼────────┬────────┼────────┼────────┤
Address │16b6afae│16b6afaf│16b6afb0│16b6afb1│16b6afb2│16b6afb3│
        └────────┴────────┴────────┴────────┴────────┴────────┘
```

### A value can be either transferred or copied

The one-owner rule is enforced by the Mojo's syntax and semantics, which prohibits the existence of two owners of the same value at the same time. You may think that the code like `var b = a` can share the ownership of the value owned by `a` with `b`. However, this is not the case.

In Mojo, a value can either be **transferred** or **copied** to another variable, but can never be shared.

#### Transfer a value

When you **transfer** a value, you are transferring the ownership of the value from one variable `a` to another variable `b`. The variable `a` will no longer own the value and will be immediately decommissioned. In other words, the quaternary system `a` consisting a name, a type, an address, and a value, does not exist anymore. If you try to use the name `a` later, the Mojo compiler will raise an error.

The transfer of (the ownership of) a value is **usually** done with the `^` operator, e.g., `var b = a^`. It reads as "transfer the ownership of the value from the variable `a` to the variable `b`, and then remove the variable `a` from the scope".

In the following example, we create a list `a` of type `List[Float64]` with four elements. We then transfer the ownership of the value from `a` to `b`. After the transfer, variable `b` now owns the value and can access the element. `a` is no longer valid and cannot be used anymore.

```mojo
# src/advanced/transfer_value.mojo
from memory import Pointer

def main():
    var a = List[Float64](1.0, 2.0, 3.0, 4.0)
    print("a at address", String(Pointer(to=a)), "with values:")
    for i in a:
        print(i[], end=", ")
    print()

    # Transfer ownership from `a` to `b`
    var b = a^
    print("b at address", String(Pointer(to=b)), "with values:")
    for i in b:
        print(i[], end=", ")
```

When you run the above code, we can see that the variable `b` now owns the value that was previously owned by `a`, and can access the elements of the value.

```console
a at address 0x16f350988 with values:
1.0, 2.0, 3.0, 4.0, 
b at address 0x16f350970 with values:
1.0, 2.0, 3.0, 4.0,
```

Since `a` is no longer valid after the transfer, if you try to access `a` after the transfer, the Mojo compiler will raise an error. For example, if you add the following code after the transfer:

```mojo
def main():
    var a = List[Float64](1.0, 2.0, 3.0, 4.0)
    print("a at address", String(Pointer(to=a)), "with values:")
    for i in a:
        print(i[], end=", ")
    print()

    # Transfer ownership from `a` to `b`
    var b = a^

    # After transferring ownership, `a` is no longer valid.
    print("a at address", String(Pointer(to=a)), "with values:")
    for i in a:
        print(i[], end=", ")
    print()
```

You will get an error like this:

```console
error: use of uninitialized value 'a'
    print("a at address", String(Pointer(to=a)), "with values:")
                                        ^
```

::: info Address may change

For lists with millions of elements, it is no point to move the values to a new address when being transferred. The moving of values in the memory is costly and inefficient. Since `a` will no longer be used after the transfer, we can simply let `b` to own the value at the same address as `a`. In other words, transferring the ownership is just like renaming the variable (while the type, the value, and the address are unchanged).

However, this is not guaranteed. In some cases, the address of the value may change after the transfe. For example, in the output above, we can see that the address of `a` is `0x16f350988`, while the address of `b` is `0x16f350970`.

Whether the values are kept in the same address depends on how compiler optimizes the code.

:::

#### Copy a value

When you copy a value, you are creating a new value that is equal but independent of the original value, and then let `b` to own this new value. After the copy, `a` will still be valid and can be used as before.If you change the value of `a`, it will not affect the value of `b`, and vice versa.

The copy of a value (and the ownership) is **usually** done with the `=` operator, e.g., `var b = a`. You may find that it is just like value assignment. Yes, it because **assignment creates a copy of the value by default** in Mojo.

We use the previous example, but this time we will copy the value instead of transferring it:

```mojo
# src/advanced/copy_value.mojo
from memory import Pointer

def main():
    var a = List[Float64](1.0, 2.0, 3.0, 4.0)
    print("a at address", String(Pointer(to=a)), "with values:")
    for i in a:
        print(i[], end=", ")
    print()

    # Copy the value of `a` and let `b` to own it.
    var b = a
    print("b at address", String(Pointer(to=b)), "with values:")
    for i in b:
        print(i[], end=", ")
    print()

    # Modify `b` to show that it is a copy.
    b[0] = -1.0
    b.append(5.0)
    print("b at address", String(Pointer(to=b)), "with values:")
    for i in b:
        print(i[], end=", ")
    print()

    # After copy the value, `a` is still valid.
    print("a at address", String(Pointer(to=a)), "with values:")
    for i in a:
        print(i[], end=", ")
    print()
```

When you run the above code, you have the following output:

```console
a at address 0x16b2488e0 with values:
1.0, 2.0, 3.0, 4.0, 
b at address 0x16b248960 with values:
1.0, 2.0, 3.0, 4.0, 
b at address 0x16b248960 with values:
-1.0, 2.0, 3.0, 4.0, 5.0, 
a at address 0x16b2488e0 with values:
1.0, 2.0, 3.0, 4.0, 
```

We can see that the variable `b` now owns a new value that is equal to the value owned by `a`, and can access the elements of the value. The variable `a` is still valid and can be used as before. Moreover, the address of `b` is different from the address of `a`, and the address of `a` is unchanged after the copy. If you change the value of `b`, it will not affect the value of `a`, and vice versa.

#### Transfer or copy by default?

The default behavior of `=` operator in Mojo is to copy the value, not transfer it (and the ownership). This is very different from Rust, where the default behavior of `=` operator is to transfer the ownership of the value. In Mojo, if you want to transfer the ownership of a value, you have to explicitly use the `^` operator (and sometimes it is ignored by the compiler, see below).

This design pattern has the following concerns and advantages:

1. **Pythonic**: The default behavior of `=` operator is to copy the value, which is more Pythonic. After doing `var b = a`, you can still use `a` as before. This is more intuitive for Python users. In Rust, `var b = a` will make `a` invalid and you cannot use it anymore.
1. **Efficient for small structs**: For small structs located on the stack, copying the value is not that expensive. The transfer of ownership is needed mainly for large structs with data located on the heap.
1. **Less mental burden**: You do not have to worry about whether a variable is invalid due to assignment or due to function calls. You do not need to use pointers (in Rust, reference `&` or mutable reference `&mut`) to access the value. You do not need to use `clone()` to copy a value. You do not need to deal with tons of compilation errors due to transfer of ownership. The default behavior of `=` operator, which is always safe and simple to use.

However, this design pattern also has some disadvantages: You may unconsciously make a lot of copies of values in your code that are not necessary. This leads to performance issues. In the contrast, Rust's design pattern makes you use pointers more, which increase the re-use of values.

::: tip Syntax shapes your behavior - Rust vs Mojo in transfer of ownership

Many people are not aware that their coding behavior is largely shaped or influenced by the syntax of the programming language they use.

For example, in Rust, the default behavior of `=` operator is to transfer the ownership of a value, after which the variable become invalid. In order not to lose the variable, you tend to use safe pointers (in Rust, "references") more, e.g., `let b = &a` or `let b = &mut a`, even for some small structs. The more you use pointers, the more you encounter compilation errors due to lifetime issues (e.g., the pointer `b` may still refer to a value that has been destroyed).

In Mojo, the default behavior of `=` operator is to copy the value, which is safe and simple. You do not need to use safe pointers because they are also more verbose compared to Rust, e.g., `var b = Pointer(to=a)`. Since most of the the values are copied by default, you encounter less compilation errors due to ownership issues. However, you may unconsciously make a lot of copies of big objects that are not necessary, which leads to performance issues.

Which design is better? Maybe I would say Mojo. It starts with make it working, enable you to write code quickly, even though you made some unnecessary copies. Later, you can make it faster by using `Pointer` or `^` operator to avoid unnecessary copies. 

In Rust, however, you have to think about ownership and lifetime from the very beginning, which brings more mental burden and frustrating you at the stage when you should focus on writing code and implementing your logic.

:::

::: warning non-transferable values

Some types of values are not transferable, which means they can only be copied. For example, the built-in types like `Int`, `Float`, `Bool`, that are small struct and allocated on the stack, are not transferable. If you try to use `^` on these types, e.g., `var b = a^`, the Mojo compiler will give you a warning as is in the following example:

```mojo
# src/advanced/non_transferable_value.mojo
def main():
    var a: Int = 1
    var b = a^
    print("a =", a)
    print("b =", b)
```

```console
warning: transfer from a value of trivial register type 'Int' has no effect and can be removed
    var b = a^
             ^
a = 1
b = 1
```

This is because the value is small enough to be copied efficiently, and transferring it does not help gain performance (remember that the address of an object is already 64-bit). In this case, the `^` operator is ignored by the compiler.

:::

### A value is destroyed when its owner is dead

When the lifetime of the owner of a value ends, the value will also be destroyed. This is to ensure that the memory is freed in time and would not be leaked. You can hand over this task to the Mojo compiler, which will automatically destroy the value when the owner goes out of scope. For example,

```mojo
# src/advanced/destroy_value.mojo
def main():
    var a: Int = 1
    
    if True:
        var b: Int = 100
        print("b =", b)

    print("a =", a)
    print("b= ", b)  # Lifetime of b ends, the value is destroyed too
```

This generates the following output:

```console
error: use of unknown declaration 'b'
    print("b= ", b)
                 ^
```

This is because the the lifetime of the variable `b` ends after the `if` block is finished. The Mojo compiler automatically destroys the variable `b` and the value it owns. If you try to use `b` after the `if` block, the Mojo compiler will raise an error.

## Lifetime of owner longer than reference

The lifetime of the owner must be at least as long as the lifetime of the third-party that accesses the value. This is to ensure that the value is valid when it is accessed by the third-party.

The following example shows how the Mojo compiler checks the lifetime of the owner and the reference:

```mojo
# src/advanced/lifetime_owner_reference.mojo
def main():
    var a = String("Hello, Mojo!")
    var ptr = Pointer(to=a)

    print("a is at address", String(ptr), "with de-referenced value:", ptr[])

    var b = a^  # Lifetime of `a` ends here
    print("The ownership is transferred to `b` with value: ", b)
    
    print(ptr[])
```

In this example, we create a variable `a` of `String` type. We then create a safe pointer `ptr` that points to the address of the value of `a`. We then transfer the ownership of the value from `a` to `b`. After the transfer, the lifetime of `a` ends, and the value is destroyed. If you try to access the pointer `ptr` after the transfer, the Mojo compiler will raise an error:

```console
error: potential indirect access to uninitialized value 'a'
    print(ptr[])
             ^
```

This is because the lifetime of the owner `a` ends after the transfer, but the lifetime of the pointer `ptr` that accesses the value of `a` is longer (until the line `print(ptr[])`). This violates the ownership rules, and the Mojo compiler raises an error to prevent potential memory safety issues.

To fix this issue, we can either remove the `^` operator to keep the ownership of `a`, or we remove the last line that accesses the pointer `ptr` after the transfer. For example, we can change the code to:

```mojo
def main():
    var a = String("Hello, Mojo!")
    var ptr = Pointer(to=a)

    print("a is at address", String(ptr), "with de-referenced value:", ptr[])

    var b = a  # A copy is made, a is still valid
    print("The value of `a` is copied to `b`. `b` is with value:", b)
    
    # Dereferencing the pointer still gives the value of `a`
    print("a is at address", String(ptr), "with de-referenced value:", ptr[])
```

And the code will run successfully, generating the following output:

```console
a is at address 0x16d4d4958 with de-referenced value: Hello, Mojo!
The value of `a` is copied to `b`. `b` is with value: Hello, Mojo!
a is at address 0x16d4d4958 with de-referenced value: Hello, Mojo!
```

::: danger ASAP Destruction Policy

Compared to Rust, Mojo is more aggressive in destroying variables. Rust variables end their lifetime at the end of a code block, but Mojo destroys a variable immediately after its last use ([ASAP destruction](https://docs.modular.com/mojo/manual/lifecycle/death)).

You may then wonder, in the previous example, why the pointer `ptr` is still valid after the last use of `a`, i.e., `var b = a`?

This is because the Mojo compiler will also check whether there are any safe pointers or alias to the value of `a`, if so, the `a` is still regarded as **in use** and will not be destroyed immediately. In other words, the lifetime of a variable is extended if there are still safe pointers or alias to the value it owns, unless you explicitly make it invalid by using the `^` operator.

Nevertheless, it is only valid for safe pointers. The immediate destruction rule may bring troubles if you are using unsafe code: for example, `B` is an unsafe pointer to data in the structure `A`, but the Mojo compiler cannot infer this. `A` is destroyed immediately after its last use, resulting in `B` being a dangling pointer pointing to already freed memory.

```mojo
fn main():
    ...
    var a = SomeType()
    var b = UnsafePointer(a.buffer)  # a's last use, immediately destroyed
    
    print(b)  # a points to already freed memory

You can manually extend the lifetime of `a` by putting `var _ = a^` at the end of the code block.

```mojo
# Pseudo code
fn main():
    ...
    var a = SomeType()
    var b = UnsafePointer(a.buffer)  # a is not used for the last time, will not be destroyed
    
    print(b)  # b points to a's data, no problem
    var _ = a^  # a appears here, manually extending its lifetime to this point
```

:::

## A metaphor for ownership

::: info Just a metaphor

It is just a metaphor to help you understand the concept of ownership. You can safely skip this if you do not like too long stories.

:::

In this section, I will show you a metaphor for ownership. Later, I will demonstrate how this metaphor can be linked with programming.

There is an island surround by water. It is completed owned by a governor. The governor is very wise and want to build a big encyclopedia in one year, from 1 January to 31 December. For this purpose, he need some resources.

The first type of resource is **notebook** which can be used for drafting. Luckily, there is a number of notebooks on the island. Each notebook contains a specific type of information, e.g., a number, a character, a poem, or the location of another notebook. The governor knows the exact locations of all notebooks, can change the texts on them, but cannot destroy them.

The second type of resoure is **worker**. The governor needs workers to help him fulfilling this dream. Luckily, the island is not far from a famous university, so there are almost unlimited people who are educated enough to help him.

The governor's power on the island is huge. He can freely bring persons in out out of the island, he can assgin notebooks to workers, he can write something on notebooks himself, and he can ask workers to write something on notebooks.

However, everything to be done within this year should be planned beforehand. After the work starts, the workers, as well as the governor, have to act according to the plan. If something goes wrong in the middle, the projects starts again.

The governor carefully divided the tasks into pieces, and made a complicated plan, e.g., on which day he needs to bring in more people, on which day who should do what, on which day who can leave the island.

Initially, the governor set up the following rules of planning:

::: tip Rules of planning version 1

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on notebooks.
1. Every worker returns the notebook when he leaves the island.

:::

After setting up the house rules, the governor could not wait to start the work. Soon, he found out something was not working well.

::: warning Problem 1: Too much copying

Workers cannot access the notebook from others. When they want to read the information on other notebooks, the governor has to first copy the texts for them. This is too much work for the governor and it is not efficient at all. The work cannot be done in one year.

:::

Thus, the governor decided to add one item to the rules and restart the work:

::: tip Rules of planning version 2

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on notebooks.
1. Every worker returns the notebook when he leaves the island.
1. (new) A worker can assess to another notebook if he knows the the location of that notebook.

:::

Now workers are happy, so is the governor. As long as the workers know the location of another notebook, they can access to that notebook as well as the information on it. The governor does not need to make a copy every time.

The work started again. Everything looked so good. But after some time, the governor detected other problems.

::: warning Problem 2: Do not change my texts!

**Worker A** owns **Notebook X**, which records numbers. On 15 January, **Worker A** suddenly noticed that the number on the notebook was modified from 1 to 1000. This is not intended at all!

They came to the governor and reported this issue. The governor checked the planning, and found out the reason:  

**Worker B** knows the location of **Notebook X** too (the location of **Notebook X** is written in the notebook of **Worker B**). In principal, **Worker B** shall only read **Notebook X** but not modify the number on it. However, the governor made a mistake in the planning which asks **Worker B** to change the number on **Notebook X** on 15 January.

:::

To avoid this kind of problem, the govener modified the house rules so that workers can only read other notebooks. If they want to modify other notebooks, they need special permission.

::: tip Rules of planning version 3

1. Every worker is assigned and owns a notebook.
1. (changed) Every worker can modify the texts on their own notebook.
1. Every worker returns the notebook when he leaves the island.
1. A worker can read another notebook if he knows the the location of that notebook.
1. A worker can write on another notebook if he knows the the location of that notebook and has a special permission.

:::

Workers cannot modify other notebooks without permissions. This is good. But then another problem occurred.

::: warning Problem 3: Use of notebook after reassignment

**Worker A** is planned to read **Notebook X** on 1 March and come back to the governor with what he sees. **Notebook X** belongs to **Worker B**, and there should be a poem on it.

**Worker A** came back soon, telling the governor that there was a nunmber on **Notebook X**, instead of a poem.

The governor was shocked. He checked all records and found out the reason:

- **Notebook X** is assigned to **Worker B** to hold a poem on 1 January.
- **Worker B** finishes his work and leave the island on 1 February. The governor takes back the **Notebook X** from **Worker B**.
- **Notebook X** is re-assigned to **Worker C** to record a number on 15 February.
- **Worker A** is assigned to read **Notebook X** as a poem on 1 March.

That is way **Worker A** got a number instead not a poem. He used the notebook after reassignment.

:::

The governor want to avoid this problem. He decided that, if a worker wants to access to another notebook, he must do this via the owner of the notebook. At the planning stage, the governor checkes whether the owner left the island before other worker assess the notebook.

He modified the house rule as follows:

::: tip Rules of planning version 4

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on their own notebook.
1. Every worker returns the notebook when he leaves the island.
1. (changed) A worker can read another notebook if he knows the owner of that notebook.
1. (changed) A worker can write on another notebook if he knows the owner of that notebook and has a special permission.
1. (new) A worker should not leave the island if other workers are planned to read or write on his notebook in future.

:::

Now the problem is resolved: At the planning stage, **Worker A** is planned to read **Worker B's notebook** on 1 March and come back to the governor with what he sees. governor then checks the stay-time of **Worker B** on the island. He notices that **Worker B** is planned to leave the island on 1 February. This violates the house rules. He then extend the stay of **Worker B** until 1 March.

The governor restarts the project again at 1 January. Things go well until 30 June.

::: warning Problem 5: Insufficient notebooks

On 30 June, the governor suddenly found there were insufficient notebooks on the island. Within days, new workers are not able to receive a notebook book for work.

This is very weird, but according to his estimation, the workload should never exhaust the resources on the island.

He then visited every corner of the island. He found out that many workers, after finishing their work, did not return the notebooks and leave the island. Therefore, the number of notebooks in idleness increases as time passes by.

:::

To solve this problem, the governor change the rules of planning so that workers always return the notebooks and leave the island once their work finishes.

::: tip Rules of planning version 5

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on their own notebook.
1. Every worker returns the notebook when he leaves the island.
1. A worker can read another notebook if he knows the owner of that notebook.
1. A worker can write on another notebook if he knows the owner of that notebook and has a special permission.
1. A worker should not leave the island if other workers are planned to read or write on his notebook in future.
1. (new) A worker should leave the island when his work is done and when nobody will read or write on his notebook anymore.

:::

The governor then, according to the new rules, examineed his plan again. All workers are planned to leave the island as soon as possible.

He restarted the project. This time, everything works well. After 12 months, the enclopedia is finished!

## From social model to Mojo's ownership

Then we can come back to Mojo and see how the social model applies in Mojo. You can do the following mapping of the terminnologies:

- Worker: a variable (name).
- Notebook: a block of space on memory, a value.
- Location of notebook: The address of the corresponding meomeory (byte).
- Read notebook: Read the data at the address.
- Write notebook: Change the data at the address.
- Leave the island: Lifetime ends. Be destroyed.
- Assign notebook: Allocate memory.
- Return notebook: Free memory. The value is destroyed.

Then, the rule of planning can be translated into the langauge ownership model in safe Mojo as follows:

::: tip Rules of ownership

1. Every variable is the owner of a value.
1. Every variable can modify their own value.
1. The value is destroyed if its owner is destroyed.
1. A variable can read another value via the owner of that value.
1. A variable can modify another value via the owner of that value under special permission.
1. The life time of a variable should not end if other variable will read or write on his value.
1. The variable will be destroyed when it is not used anymore and no other variable will read or write its value.

:::

These rules of ownership are checked at compile time, and ensure that Mojo is safe at execution.
