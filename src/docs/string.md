# String

[Source code of String type](https://github.com/modularml/mojo/blob/main/stdlib/src/collections/string.mojo)

String is an important type of Mojo and Python, which represents a sequence of UTF-8 encoded characters. String is usually displayed in paired quotation marks, e.g., `'a'`, `"abc"`.

`String` is stored on heap as a sequence of unsigned integers (`UInt8`), and with an `0` at the end. Because UTF-8 encoding is not fixed in bytes, each character may take space from 1 byte to 4 bytes.

The following example shows how `"abc"` is stored in the memory.

```console
Each cell represent a byte (UInt).
┌──┬──┬──┬─┐
│61│62│63│0│
└──┴──┴──┴─┘
Or in raw binary form.
┌────────┬────────┬────────┬────────┐
│00111101│00111101│00111101│00000000│
└────────┴────────┴────────┴────────┘
```

A valid UTF-8 character must starts with `0` (1-byte character), `110` (2-byte character), `1110` (3-byte character), `11110` (4-byte character). The non-first bytes of a string must be `10`.

This means that not all slices of 1 bytes to 4 bytes are valid UTF-8 characters.

Python adopts an algorithm to assure that indexing and iterator of a String returns a valid character. This is not yet implemented in Mojo (as of version 24.5). In future, Mojo will also guarantee that String slicing returns valid UTF-8 characters.
