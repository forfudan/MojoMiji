# String

[Source code of String type](https://github.com/modularml/mojo/blob/main/stdlib/src/collections/string.mojo)

String is an important type of Mojo and Python, which represents a sequence of UTF-8 encoded characters. String is usually displayed in paired quotation marks, e.g., `'a'`, `"abc"`.

`String` is stored on heap as a sequence of unsigned integers (`UInt8`), and with an `0` at the end. Because UTF-8 encoding is not fixed in bytes, each character may take space from 1 byte to 4 bytes.

The following example shows how `"abc"` is stored in the memory.

```console
Each cell represent a byte (UInt).
┌──┬──┬──┬─┐
│97│98│99│0│
└──┴──┴──┴─┘
Or in raw binary form.
┌────────┬────────┬────────┬────────┐
│00111101│00111101│00111101│00000000│
└────────┴────────┴────────┴────────┘
```

A valid UTF-8 character must starts with `0` (1-byte character), `110` (2-byte character), `1110` (3-byte character), `11110` (4-byte character). The non-first bytes of a string must be `10`.

This also means that not all slices of 1 bytes to 4 bytes are valid UTF-8 characters.

::: info Example

ASCII codes are always stored as one-byte with UTF-8 encoding. Chinese characters usually takes more than 2 bytes. 

For example, "你好", which means "hello", are display as two characters. But it is stored by more than 2 bytes. We can examine its exact `UInt` sequence in the memory with the following code:

```mojo
fn main():
    var a: String = "你好"
    for i in a.as_bytes():
        print(i[], end=" ")
    # It prints: 228 189 160 229 165 189
```

It means that the two characters are actually stored in memory as follows, each character taking 3 bytes (starting with `111`).

```console
Each cell represent a byte (UInt).
┌───┬───┬───┬───┬───┬───┐
│228│189│160│229│165│189│
└───┴───┴───┴───┴───┴───┘
Or in raw binary form.
┌────────┬────────┬────────┬────────┬────────┬────────┐
│11100100│10111101│10100000│11100101│10100101│10111101│
└────────┴────────┴────────┴────────┴────────┴────────┘
Note that the null value at the end is not displayed.
```

:::

::: warning UTF-8 assurance

Python adopts an algorithm to assure that indexing and iterator of a String returns a valid character.

This is not yet completely implemented in Mojo (as of version 24.5). The iterator returns correct characters while indexing does not.

```mojo
fn main():
    var a: String = "你好"
    print(a[0])
    # This prints "�", invalid character. We expect "大".
```

```mojo
fn main():
    var a: String = "你好"
    for i in a:
        print(i)
    # This prints "你" and "好", correct!
```

In future, Mojo will also guarantee that String slicing returns valid UTF-8 characters.

:::
