# Reference system of Mojo

In Rust, "reference" is more like a safe pointer to the value. You need to de-reference it to assess the value, although sometimes the de-referencing is automatically done.

In Mojo, "reference" is not a type (a safe pointer) as is in Rust, but is more like the reference in C++. A reference refers to the same value but with a different name. In another word, it is an alias. It is therefore, sharing the same behaviors of the value it refers to. No de-referencing is needed to get access to the value. For example, if you pass `a: Int` into function `fn copyit(read some: Int)`, then `some` is an immutable reference (alias) of `a` and behave exactly as `a`. The code `b = some.copy()` within the function would call `a`'s `copy()` method.

If you want to use Rust's reference, e.g., `&`, in Mojo, you should use the type `Pointer`, which is a safe pointer that will not null or dangling. You need to deference it to get access the value. For example, a iterator over the `List` type would returns, in each step, a pointer to one of the elements of `List`. To print the value, you have to first dereference the pointer with `[]`.

```mojo
def main():
    for i in List[Int](1, 2, 3, 4):
        # i is of the type Pointer[Int]
        print(i[])  # [] is the de-referencing operator
```

## Illustrations

Here is the same example we used in introducing the keyword `mut` for arguments of [functions](../basic/functions). It demonstrate how Mojo's "reference" works.

```mojo
from memory import Pointer

fn changeit(mut a: Int8):
    a = 10
    print("Address of the argument `a`: ", String(Pointer.address_of(a)))

fn main():
    var x: Int8 = 5
    print("Value of the variable `x` before change: ", x)
    print("Address of the variable `x`: ", String(Pointer.address_of(x)))
    changeit(x)
    print("Value of the variable `x` after change: ", x)
    print("Address of the variable `x`: ", String(Pointer.address_of(x)))
```

```console
Value of the variable `x` before change:  5
Address of the variable `x`:  0x16b6a8fb0
Address of the argument `a`:  0x16b6a8fb0
Value of the variable `x` after change:  10
Address of the variable `x`:  0x16b6a8fb0
```

Let's look into the code and see what has happened:

First, you create variable with the name `x` and type `Int8` and assign value `5` to it. Mojo assigns a space in the memory, which is of 1-byte (8-bit) length at the address `16b6a8fb0`. The value is `5`, so it is stored as `00000100` (binary representation of an integer 5) at the address `16b6a8fb0`. See the following illustration.

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                               ↑
                             x (Int8)
```

Next, you pass this value into the function `changeit` with the `mut` keyword. Mojo will then create a mutable reference of `x`, which is named as `a` . This reference `a` is an alias of `x`, pointing to the same address `16b6a8fb0`. See the following illustration.

```console
                             a (Int8): Mutable reference of x
                               ↓
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00000100│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                               ↑
                             x (Int8)
```

Then, you assign a value `10` to the `a`. Since `a` is a mutable reference of `x`, this re-assignment is allowed. The line of code is equivalent to re-assigning the value `10` to `x`. The new value `00001010` (binary representation of the integer 10) is then stored into the memory location of `x` at address `16b6a8fb0`. Now the updated illustration of the memory goes as follows.

```console
        ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
Value   │         │         │ 00001010│         │         │         │
        ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
Address │16b6a8fae│16b6a8faf│16b6a8fb0│16b6a8fb1│16b6a8fb2│16b6a8fb3│
        └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                              ↑
                             x (Int8)
```
