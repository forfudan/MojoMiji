# Unsafe Mojo

> "I am the owner."  
> "But I am the God."  
> -- Yuhao Zhu, *Gate of Heaven*

::: danger

**Unsafe** does not mean "death", but it increases the probability of "death". Do not touch unsafe Mojo unless you know what you are doing and are willing to take the risk.

:::

[[toc]]

## Unsafe realm

Mojo is designed to be safe, by means of the ownership system and compile-time checks. However, there are some cases where "safe Mojo" is not able to (elegantly) handle. Thus, we have the other side of Mojo: **unsafe Mojo**. In this world, we can directly manipulate the memory and bypass the ownership system by means of unsafe pointers. Finally, it is you, but not the variable, who is the true owner of the values.

Many language expose pointers directly to users, while others try to hide them. Mojo is in the middle: it has a safe pointer type `Pointer` which is designed to be checked against the ownership rule, and an unsafe pointer type `UnsafePointer` which is designed to bypass the ownership system. You are then responsible for ensuring the safety of your code.

::: info is "unsafe" a bad word?

Some people do not like the term "unsafe" because it implies that the code is inherently dangerous or flawed. They prefer to use other, more neutral words like "raw pointers" or "trusted pointers" to describe the same concept.

However, the term "unsafe" does not necessarily mean that memory issues will certainly happen, but it means that the probability of memory issues happening is higher than in safe Mojo. It servers more like a "remainder" than a "description". When you see this term, you will be alerted that you are entering a world where the compiler will not help you, and you need to be careful about what you are doing.

:::

---

Recall that we have four ownership statuses in Mojo: "Isolated", "Referenced", "Pointed", and "Unsafely pointed". The first three statuses are safe, either by duplicating the value or by tracking the information of the owner.

The last, however, is unsafe. It neither get a copy of the value, nor tracks the information of the owner. Instead, it directly points to an address, a space, in the memory. It likes a ghost that enters the house through the wall, reading the newspaper, changing the furniture, or even destroying everything. Nobody knows that it has come and gone, except for one person, you, the programmer.

You have to ensure, on your own, that the address is valid (not uninitialized, not freed, not out of bounds), that the value is what you expect, that the type is correct, and that the value is not unintentionally modified by your access. You will manually validate whether the rules of ownership are followed.

## Unsafe pointers

Unsafe pointers are the core of unsafe Mojo. Firstly, it is a type (defined as a struct in the Mojo standard library).
