# Unsafe Mojo

> Yes, you have the ownership. So what? I am the God!  
> -- Yuhao Zhu, *Gate of Heaven*

::: danger

**Unsafe** does not mean "death", but it increases the probability of "death". Do not touch unsafe Mojo unless you know what you are doing and are willing to take the risk.

:::

[[toc]]

## Unsafe Mojo

Mojo is designed to be safe, by means of the ownership system and compile-time checks. However, there are some cases where "safe Mojo" is not able to (elegantly) handle. Thus, we have the other side of Mojo: **unsafe Mojo**. In this world, we can directly manipulate the memory and bypass the ownership system by means of unsafe pointers.

Many language expose pointers directly to users, while others try to hide them. Mojo is in the middle: it has a safe pointer type `Pointer` which is designed to be checked against the ownership rule, and an unsafe pointer type `UnsafePointer` which is designed to bypass the ownership system. You are then responsible for ensuring the safety of your code.

::: info is "unsafe" a bad word?

Some people do not like the term "unsafe" because it implies that the code is inherently dangerous or flawed. They prefer to use other, more neutral words like "raw pointers" or "trusted pointers" to describe the same concept.

However, the term "unsafe" does not necessarily mean that memory issues will certainly happen, but it means that the probability of memory issues happening is higher than in safe Mojo. It servers more like a "remainder" than a "description". When you see this term, you will be alerted that you are entering a world where the compiler will not help you, and you need to be careful about what you are doing.

:::

