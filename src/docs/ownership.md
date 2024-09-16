# Ownership

## Purpose

Mojo introduces Rust's ownership checking feature and the so-called **value semantics** to better manage memory and prevent issues such as use-after-free, double-free, and memory leaks. Although learning ownership takes some time, once mastered, it effectively reduces mental burden during programming.

The core of ownership is that any value (a piece of memory) has an **owner**. For example, a variable name is the owner of a value. Once the variable name's lifetime ends, it is destroyed, and its value is also destroyed. The purpose of introducing ownership is to ensure that the **value** is valid during its owner's lifetime and that all references and modifications to the value do not exceed this lifetime.

## ASAP Destruction Policy

Compared to Rust, Mojo is more aggressive in destroying variables. Rust variables end their lifetime at the end of a code block, but Mojo destroys a variable immediately after its last use ([ASAP destruction](https://docs.modular.com/mojo/manual/lifecycle/death)).

::: warning
The immediate destruction rule brings a problem: for example, `B` is an unsafe pointer to data in the structure `A`, but the Mojo compiler cannot infer this. `A` is destroyed immediately after its last use, resulting in `B` being a dangling pointer pointing to already freed memory.

```mojo
fn main():
    ...
    var A = SomeType()
    var B = UnsafePointer(A.buffer)  # A's last appearance, immediately destroyed
    
    print(B)  # B points to already freed memory

Currently, the recommended approach in Mojo is to use A once more to forcibly extend its lifetime:

```mojo
# Pseudo code
fn main():
    ...
    var A = SomeType()
    var B = UnsafePointer(A.buffer)  # A is not used for the last time, will not be destroyed
    
    print(B)  # B points to A's data, no problem
    _ = A^  # A appears here, manually extending its lifetime to this point
```

:::
