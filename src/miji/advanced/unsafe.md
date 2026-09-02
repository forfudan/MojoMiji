# Unsafe Mojo

> "I am the owner."  
> "But I am the God."  
> -- Yuhao Zhu, *Gate of Heaven*

::: danger

**Unsafe** does not mean "death", but it increases the probability of "death".
Do not touch unsafe Mojo unless you know what you are doing and are willing to
take the risk.

:::

[[toc]]

## Unsafe realm

Mojo is designed to be safe, by means of the ownership system and compile-time
checks. However, there are some cases where "safe Mojo" is not able to
(elegantly) handle. Thus, we have the other side of Mojo: **unsafe Mojo**. In
this world, we can directly manipulate the memory and bypass the ownership
system by means of unsafe pointers. Finally, it is you, but not the variable,
who is the true owner of the values.

Many languages expose pointers directly to users, while others try to hide them.
Mojo is in the middle: it gives you one pointer type, `Pointer`, and marks the
individual **operations** that step outside the ownership system. You are then
responsible for ensuring the safety of those operations.

::: details Mojo used to have two pointer types

Until **Mojo v1.0.0**, there were two types: a safe `Pointer`, checked against
the ownership rules, and an `UnsafePointer` that bypassed them. The name
`UnsafePointer` still works, as a deprecated alias, so you will meet it in older
code and older versions of this Miji.

The two were unified because the split was in the wrong place. A pointer is not
unsafe; *reading through it at an offset you computed yourself* is unsafe.
Marking the type made every use of it look equally dangerous, which taught you
nothing about which line to be careful on. Marking the operation tells you
exactly where you left the compiler behind.

:::

::: info is "unsafe" a bad word?

Some people do not like the term "unsafe" because it implies that the code is
inherently dangerous or flawed. They prefer to use other, more neutral words
like "raw pointers" or "trusted pointers" to describe the same concept.

However, the term "unsafe" does not necessarily mean that memory issues will
certainly happen, but it means that the probability of memory issues happening
is higher than in safe Mojo. It servers more like a "remainder" than a
"description". When you see this term, you will be alerted that you are entering
a world where the compiler will not help you, and you need to be careful about
what you are doing.

:::

---

Recall that we have four ownership statuses in Mojo: "Isolated", "Referenced",
"Pointed", and "Unsafely pointed". The first three statuses are safe, either by
duplicating the value or by tracking the information of the owner.

The last, however, is unsafe. It neither get a copy of the value, nor tracks the
information of the owner. Instead, it directly points to an address, a space, in
the memory. It likes a ghost that enters the house through the wall, reading the
newspaper, changing the furniture, or even destroying everything. Nobody knows
that it has come and gone, except for one person, you, the programmer.

You have to ensure, on your own, that the address is valid (not uninitialized,
not freed, not out of bounds), that the value is what you expect, that the type
is correct, and that the value is not unintentionally modified by your access.
You will manually validate whether the rules of ownership are followed.

## Unsafe pointers

Firstly, a pointer is a type — a struct in the Mojo standard library. A
`Pointer[T, origin]` carries two things: the address of a value of type `T`, and
the [origin](../advanced/lifetimes.md) that the value belongs to.

The origin is what makes a pointer safe. As we saw in Chapter
[References](../advanced/references.md), it is how the compiler knows that a
pointer is not outliving the value it points at. As long as you build a pointer
with `Pointer(to=x)` and read it back with `p[]`, you are in the safe world, and
the borrow checker will stop you from doing anything silly:

```mojo
var a = 42
var p = Pointer(to=a)
print(p[])       # 42, and the compiler knows `a` is still alive
```

### The `unsafe_` operations

You leave the safe world when you do something the compiler cannot check. Those
operations all carry `unsafe_` in their name, or take an `unsafe_`-prefixed
keyword argument. The main ones:

| What you want                  | How you write it                    |
| ------------------------------ | ----------------------------------- |
| The element `i` places along   | `p[unsafe_offset=i]`                |
| A new pointer `i` places along | `p.unsafe_offset(i)`                |
| Read a value                   | `p.unsafe_load()`                   |
| Write a value                  | `p.unsafe_store(value)`             |
| Reinterpret as another type    | `p.unsafe_bitcast[U]()`             |
| Write into raw memory          | `p.unsafe_write(value^)`            |
| Run the destructor by hand     | `p.unsafe_deinit_pointee()`         |
| Free the memory                | `p.unsafe_free()`                   |

There is a real benefit to this naming:
**you can find every dangerous line in a file by searching for `unsafe_`**. In a
code review, that is a much better question to ask than "does this file use
pointers?".

Here is what it looks like in practice:

::: code-group

```mojo
# src/advanced/unsafe/pointer_operations.mojo
from std.memory import Pointer


def main():
    var a = 42
    var p = Pointer(to=a)
    print("Safe dereference:", p[])

    var lst: List[Int] = [1, 2, 3]
    var raw = lst.unsafe_ptr()
    print("First element: ", raw[unsafe_offset=0])
    print("Third element: ", raw.unsafe_offset(2)[unsafe_offset=0])

    # Nothing stops the following line. There is no fourth element.
    print("Out of bounds:  ", raw[unsafe_offset=9])
```

```output mojo
Safe dereference: 42
First element:  1
Third element:  3
Out of bounds:   0
```

:::

That last line is the whole lesson of this chapter. `lst` has three elements. We
asked for the tenth. Mojo printed `0` and carried on, cheerfully, because nobody
checked. It might have printed anything. It might have crashed. On another run,
with another allocation, it might do something different again.

### The traps

Everything the previous chapters protected you from is back on the table:

1. **Reading past the end.** As above. A `List` knows its own length, but a raw
   pointer into its buffer does not.
1. **Reading after the owner is gone.** In Chapter
   [Ownership](../advanced/ownership.md) we saw that a value is destroyed when
   its owner dies. A safe pointer's origin keeps the owner alive. A raw pointer
   has no such string attached, so it will happily point at memory that has been
   freed.
1. **Reading across a reallocation.** In Chapter
   [References](../advanced/references.md#what-interior-origins-buy-you) we saw
   the lifetime checker reject a reference held across an `append()`. A raw
   pointer into the same buffer gets no such warning; after the list grows, it
   points at the old, freed block.
1. **Lying about the type.** `unsafe_bitcast[U]()` tells the compiler "read
   these bytes as a `U`". If the bytes are not a `U`, nobody will tell you.
1. **Aliasing.** Two mutable raw pointers to the same address defeat the
   exclusivity rule that the borrow checker normally enforces for you.

### When is it worth it?

Honestly, for most Mojo you write: never. The `List`, `Dict`, and `String` types
already do this work, carefully, on your behalf. Reach for raw pointers when you
are:

- implementing a data structure of your own, where you are the one who must
  manage the buffer;
- talking to C, which has no notion of Mojo's ownership;
- working at the very bottom of a hot loop, where you have measured that the
  bounds check costs you.

And when you do, one habit pays for itself:
**wrap the unsafety in a small, safe API**. Keep the `unsafe_` calls inside a
handful of methods of your struct, get those right once, and let the rest of
your program, and everyone reading it, stay in the safe world.

::: tip Leave the checks on

Mojo already bounds-checks collection accesses for you on the CPU, and this
chapter is about the one place where that protection does not reach. Two flags
change the setting:

```bash
mojo run -D ASSERT=none my_program.mojo  # Turn the checks off
mojo run -D ASSERT=all my_program.mojo   # Turn them on for GPU code too
```

Neither one polices raw pointers. But leaving the collection checks alone
catches the ordinary mistakes long before you go looking for a pointer bug that
is not there.

:::

## Major changes in this chapter

- 2026-08-19: Update to accommodate the changes in Mojo v1.0.0. `Pointer` and
  `UnsafePointer` are unified into a single `Pointer` type, with the unsafe
  operations carrying an `unsafe_` prefix. Sections on the `unsafe_` operations,
  the traps, and when raw pointers are worth it are added.
- 2026-08-21: Collection bounds checks are on by default since Mojo v1.0.0, so
  the tip on turning them on is rewritten around leaving them on.
