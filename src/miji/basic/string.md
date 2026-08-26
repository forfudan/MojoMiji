# Data type - String

> There are a thousand string types in a thousand people's eyes.  
> -- Yuhao Zhu, _Gate of Heaven_

String is one of the most important concepts in programming languages, but also
one of the most controversial ones. On the one hand, the "string" is able to
store or represent the texts of almost all human languages. On the other hand,
it is also a source of confusion and frustration for many programmers,
especially when it comes to how to encode, decode, and manipulate strings. In a
thousand people's eyes, there are a thousand different ways to implement a
string type as well as its functionalities. Thus, some people even think that
the string type should not be a built-in type in programming languages, but
rather be in third-party libraries that can be implemented in different ways.

Nevertheless, most programming languages do have a built-in string type. Mojo is
no exception. Its `String` took a long time to settle, and, for the reasons
above, it was argued over even within the development team. It has been stable
since Mojo v1.0.0, but it carries enough ideas that it deserves this standalone
chapter.

This chapter will cover the following topics:

- Nature of string
- String construction
- String, StringSpan, and StaticString
- String printing and formatting
- String iteration
- String length
- String indexing and slicing
- Internal representation of string

## What is a string?

String is an important type of Mojo and Python, which represents a sequence of
UTF-8 encoded code points (aka characters). The coding space is so large that it
can present almost all human languages and symbols. It is also flexible as it
represents different characters in different lengths, allowing for efficient
storage and processing of text data. For example, the English alphabet is
represented by one byte per character, while Chinese characters are usually
represented by three bytes per character.

The following table summarizes the differences between `String` in Mojo and
`str` in Python. Note that some features are still under development in Mojo, so
they may not be available in the current version. This table is also referred in
Chapter [Differences between Python and Mojo](../move/different#string).

| Functionality                           | Python string                             | Mojo string                                                      |
| --------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| Type of string literals                 | `Literal`                                 | `StringLiteral`                                                  |
| String literal auto converted to string | Yes                                       | Yes                                                              |
| Constructed string from string literals | Use `str()` constructor                   | Use `String()` constructor                                       |
| Use string methods on string literals   | Yes, string literals are coerced to `str` | Yes, string literals are materialized into `String`              |
| Non-owning view into a string           | N.A.                                      | `StringSpan`, and `StaticString` for constants                   |
| Print string with `print()`             | Yes                                       | Yes                                                              |
| Format string with `format()`           | Yes, use `{}`                             | Yes, use `{}`                                                    |
| Named fields in `format()`              | Supported, e.g., `{name}`                 | Not supported (yet)                                              |
| formatted values                        | Supported, e.g., `{:0.2f}`, `{:0.3%}`     | Not supported (yet)                                              |
| f-strings                               | Supported, e.g., `f"{name}"`              | Not supported, but there are t-strings, e.g., `t"{name}"`        |
| Iteration over characters               | Yes, use `for i in s:` directly           | Yes, use `for i in s:` directly                                  |
| What one iteration step gives you       | One code point                            | One grapheme cluster                                             |
| Iteration over bytes and code points    | Needs manual encoding or `ord()`          | Yes, use `s.bytes()` and `s.codepoints()`                        |
| Length of a string                      | `len(s)`, counted in code points          | `s.byte_length()`, `s.count_codepoints()`, `s.count_graphemes()` |
| UTF8-assured indexing and slicing       | Yes, use `s[i]` or `s[i:j]` directly      | Yes, but you must say which unit, e.g., `s[codepoint=i]`         |
| Copy                                    | `copy()` or `lst2 = lst1`                 | `lst2 = lst1`                                                    |
| Reference                               | `ref` keyword                             | N.A.                                                             |
| Transfer ownership                      | `^` operator                              | N.A.                                                             |

## String construction

In Mojo, you can create a `String` instance in three ways:

1. Wrapping a **string literal** with the `String()` constructor.
1. Explicitly declare a variable with the `String` type and assign a string
   literal to it.
1. Simply assign a string literal to a variable.

The methods are similar to Python. Let's take a look at the following examples:

::: code-group

```mojo
# src/basic/string/create_a_string.mojo
def main():
    var s1 = String("Hello, world!")
    var s2: String = "Hello, Mojo!"
    var s3 = "Hello, Mojo v25.5!"
    print(s1)
    print(s2)
    print(s3)
```

```output mojo
Hello, world!
Hello, Mojo!
Hello, Mojo v25.5!
```

```python
def main():
    s1: str = "Hello, world!"
    s2 = str("Hello, Mojo!")
    s3 = "Hello, Mojo v25.5!"
    print(s1)
    print(s2)
    print(s3)

main()
```

```output python
Hello, world!
Hello, Mojo!
Hello, Mojo v25.5!
```

:::

## String literals and String

In Mojo, `StringLiteral` is a special type that stores the string (a sequence of
letters or characters) that you write in your source code. A valid string
literal is a sequence of characters enclosed in double quotes `"`, single quotes
`'`, or triple quotes `"""` or `'''` (for multi-line strings). It is similar to
Python's string literals. For example, `"I am a string literal"`,
`'I am also a string literal'`, and `"""I am a multi-line string literal"""` are
all valid string literals in Mojo. They are stored as `StringLiteral` instances,
which are immutable and cannot be modified.

During compilation, the Mojo compiler will also conduct some operations on
string literals. For example, string literals in multiple lines that are wrapped
in parentheses `()` will be concatenated into a single string literal. For
example, the following code snippet:

```mojo
def main():
    var s = (
        "This is a string literal "
        "that spans multiple lines."
    )
    print(s)
```

```output mojo
This is a string literal that spans multiple lines.
```

When you run the code, the `StringLiteral` type will be automatically
**materialized** into a `String` type. We will meet this word again in Chapter
[Literals](../basic/literal#no-type-annotation): a literal lives inside the
compiler, and materialization is the moment when it has to become a value that
your program carries around at run time.

Now, you may be worried about the cost (Great! You are thinking more like a
Magician now). In Python, a `str` object is a real object on the heap, and you
may reasonably assume that `var a = "Hello"` in Mojo does something similar:
reserve some memory, copy the letters into it, and remember where they are. That
would be a shame, because the letters are already sitting in your compiled
program, and copying them again buys you nothing.

I don' do that, says Mojo. When a string literal is materialized into a
`String`, the `String` simply
**remembers where, in the memory, the letters already are**. No memory is
reserved and no letter is copied. The `String` only makes a copy of the letters
when you modify it for the first time, because at that point it really does need
a piece of memory of its own.

So there are two things happening, and it is worth keeping them apart:

1. `var a = "Hello"` gives you a `String`. This costs nothing more than a
   `StaticString` would.
1. `a += ", world!"` is the first modification, and this is where `a` finally
   allocates its own memory and copies the letters into it.

As a user, you do not need to worry about these details. Mojo does everything
for you.

:::: details Evidence: a `String` from a literal does not copy anything

We can see this for ourselves by printing the address where the letters are
stored. In the following code, `a` and `b` are two separate `String` variables,
and `c` is a `StaticString`. All three are built from the same (long) string
literal:

::: code-group

```mojo
# src/basic/string/string_shares_literal_memory.mojo
def main():
    var a = "a long string literal that does not fit in 23 bytes"
    var b = "a long string literal that does not fit in 23 bytes"
    var c: StaticString = "a long string literal that does not fit in 23 bytes"

    print("String       a points at:", String(a.unsafe_ptr()))
    print("String       b points at:", String(b.unsafe_ptr()))
    print("StaticString c points at:", String(c.unsafe_ptr()))
    print()

    a += "!"  # the first modification makes `a` allocate its own memory
    print('after `a += "!"`:')
    print("String       a points at:", String(a.unsafe_ptr()))
    print("String       b points at:", String(b.unsafe_ptr()))
```

```output mojo
String       a points at: 0x1310040e0
String       b points at: 0x1310040e0
StaticString c points at: 0x1310040e0

after `a += "!"`:
String       a points at: 0x108aa4008
String       b points at: 0x1310040e0
```

:::

The addresses will differ on your machine.

Look at the first three lines. Two `String` variables and one `StaticString` all
point at **exactly the same address**. Nothing was copied and nothing was
allocated: all three of them are looking at the same letters inside the compiled
program.

Then look at what happens after `a += "!"`. The address of `a` jumps to a
completely different region of memory, because `a` has finally allocated a piece
of memory of its own and copied the letters into it. Meanwhile, `b` has not been
touched, and still points into the compiled program.

::::

::: tip Why the literal in the example is so long

You may wonder why we used such a long, clumsy string literal in the example
above instead of something short like `"Hello"`.

The reason is that a `String` that is short enough is stored
**inside the `String` variable itself**, without using any separate memory at
all. On a 64-bit machine, a `String` is 24 bytes big, and up to 23 bytes of text
can live directly inside it. This is called the **small string optimization**,
and we come back to it in Section
[Where a String keeps its bytes](#where-a-string-keeps-its-bytes).

A short literal would therefore have been copied into the variable, and the
three addresses would all have been different, which would have hidden the very
thing we wanted to show. Our example literal is 50 bytes long, so it cannot be
stored inline, and the `String` has to point at the letters in the compiled
program instead.

:::

::: details String literals not materialized to String before Mojo v25.5

Before Mojo v25.5, string literals are not automatically converted to `String`
type at run time. If you **do not** explicitly declare a variable as a `String`
type or use the `String()` constructor, Mojo compiler will keep the string
literal as a `StringLiteral` instance and **will not** automatically materialize
it into a `String` instance at run time. That is to say that the `str1`, `str2`,
`str3` variables in the following code snippet are of different types:

```mojo
# This is only relevant for Mojo v25.4 and earlier.
def main():
    var str1 = "Hello"          # StringLiteral
    var str2: String = "Hello"  # String
    var str3 = String("Hello")  # String
```

---

Mojo does not automatically convert the `StringLiteral` type into the `String`
type because it avoids creating a `String` instance that is dynamically
allocated on the heap, and thus improves performance. The disadvantage is that
you cannot modify the string literal, and you cannot apply some string methods
on it, such as `format()`.

The following code snippet illustrates the difference between `StringLiteral`
and `String` in Mojo v25.4 and earlier. The first variable `s1` is a
`StringLiteral` instance because we did not explicitly declare it as a `String`
type. The second variable `s2` is a `String` instance because we used the
`String()` constructor to wrap the string literal. Nevertheless, both `s1` and
`s2` can be printed with the `print()` function. You can also get the address
the location of the string literal or string in memory, as well as the address
of the first letters of them.

```mojo
# src/basic/string/string_literal_vs_string.mojo
# This is only relevant for Mojo v25.4 and earlier.
def main():
    var s1 = (
        "I am of the string literal type with the type name `StringLiteral`"
    )
    var s2 = String("I am of the string type with the type name `String`")

    var ptr1 = s1.unsafe_ptr()  # Unsafe pointer to the string literal
    var ptr2 = s2._ptr_or_data  # Unsafe pointer to the string

    print(s1)
    print("My meta data is store at the address", String(Pointer(to=s1)))
    print("My first letter is stored at the address ", ptr1)
    for i in range(66):
        # Print each character of the string literal unsafely
        print(chr(Int(ptr1[unsafe_offset=i])), end=" ")
    print()
    print("=" * 80)
    print(s2)
    print("My meta data is stored at the address", String(Pointer(to=s2)))
    print("My first letter is stored at the address", ptr2)
    for i in range(51):
        # Print each character of the string unsafely
        print(chr(Int(ptr2[unsafe_offset=i])), end=" ")
```

```output mojo
I am of the string literal type with the type name `StringLiteral`
My meta data is store at the address 0x16f200408
My first letter is stored at the address  0x3100040b0
I   a m   o f   t h e   s t r i n g   l i t e r a l   t y p e   w i t h   t h e   t y p e   n a m e   ` S t r i n g L i t e r a l `
================================================================================
I am of the string type with the type name `String`
My meta data is stored at the address 0x16f200390
My first letter is stored at the address 0x310004030
I   a m   o f   t h e   s t r i n g   t y p e   w i t h   t h e   t y p e   n a m e   ` S t r i n g `
```

---

Nevertheless, in Mojo v25.4 and earlier, you do not need to worry about the
difference between `StringLiteral` and `String` if you just want to print some
sentences. If you later want to use some string-specific methods, such as
`format()`, you can simply wrap the string literal with the `String()`
constructor to convert it to a `String` instance.

After Mojo v25.5, this distinction is no longer relevant, as all string literals
are automatically converted to `String` instances at run time.

:::

## String, StringSpan, and StaticString

If you read the Mojo standard library, or the error messages that the compiler
gives you, you will sooner or later run into two more names: `StringSpan` and
`StaticString`. In Python there is only `str`, so this may look like an
unnecessary complication. It is not, and the idea behind it is something you
already know from Python.

Think about what happens in Python when you write `s[0:5]`. Python builds a
brand-new `str` object and copies five characters into it. If you only wanted to
_look_ at the first five characters, that copy was wasted work. Python accepts
this cost because it makes the language simple, and most of the time you never
notice.

Mojo gives you the choice. Besides the `String` type that owns its characters,
there is a second type that only **looks at** characters that somebody else
owns:

- A **`String`** owns its characters. It is responsible for them, it can modify
  them, and it cleans them up when it goes out of scope. This is the type you
  get by default, and the type you should reach for most of the time.
- A **`StringSpan`** owns nothing. It only remembers _where_ some characters are
  and _how many_ of them there are. Creating one copies no text at all. Because
  it owns nothing, it can never make the text longer or shorter, and it must not
  outlive whatever it is looking at.
- A **`StaticString`** is the special case of a `StringSpan` that looks at text
  inside your compiled program, such as a string literal. Since your compiled
  program is around for as long as your program runs, a `StaticString` is safe
  to keep anywhere, and you never have to think about how long it lives.

The following table summarizes the three types:

| Type           | Owns the characters? | Can grow or shrink? | How long does the text live?     | Size on a 64-bit machine |
| -------------- | -------------------- | ------------------- | -------------------------------- | ------------------------ |
| `String`       | Yes                  | Yes                 | As long as the `String` variable | 24 bytes                 |
| `StringSpan`   | No                   | No                  | As long as the text it looks at  | 16 bytes                 |
| `StaticString` | No                   | No                  | The whole run of the program     | 16 bytes                 |

The "can grow or shrink" column is the one that matters in practice. A `String`
can be appended to with `+=`, because it is allowed to go and find itself a
bigger piece of memory. A `StringSpan` cannot, because the memory belongs to
somebody else. (A span over a `String` that you are allowed to modify can still
change the characters in place, one for another, but never the number of them. A
`StaticString` cannot even do that, because the text lives in a read-only part
of your program.)

Let's see them side by side. Note the function `shout()`, which accepts a
`StringSpan`, and yet we are able to pass a `String`, a `StringSpan`, a
`StaticString`, and even a bare string literal into it:

::: code-group

```mojo
# src/basic/string/string_and_string_span.mojo
def shout(text: StringSpan) -> String:
    return text.upper()

def main():
    var owned = String("hello")             # owns its characters
    var view = StringSpan(owned)            # looks at `owned`, owns nothing
    var constant: StaticString = "world"    # looks at the compiled program

    print("owned    :", owned)
    print("view     :", view)
    print("constant :", constant)
    print()

    # All three can be passed to the same function.
    print("shout(owned)    :", shout(owned))
    print("shout(view)     :", shout(view))
    print("shout(constant) :", shout(constant))
    print("shout(\"literal\") :", shout("literal"))
    print()

    # A view does not copy: it points into the string it looks at.
    print("owned.unsafe_ptr() =", String(owned.unsafe_ptr()))
    print("view.unsafe_ptr()  =", String(view.unsafe_ptr()))
```

```output mojo
owned    : hello
view     : hello
constant : world

shout(owned)    : HELLO
shout(view)     : HELLO
shout(constant) : WORLD
shout("literal") : LITERAL

owned.unsafe_ptr() = 0x16daeef60
view.unsafe_ptr()  = 0x16daeef60
```

:::

Two things are worth noticing here.

First, `shout()` accepts all four kinds of argument without any conversion on
your side. This is why so many functions in the Mojo standard library take a
`StringSpan` rather than a `String`: it is the most welcoming type you can ask
for. If you write a function that only **reads** a string and never modifies or
stores it, take a `StringSpan`, and your users will be able to pass whatever
they happen to have.

Second, the last two lines of the output print the same address. The view did
not copy the five letters of `"hello"`; it simply remembers where they are.

### When should I use which?

Here is a rule of thumb for a Pythonista who has just arrived in Mojo:

1. For a variable that holds text, use `String`. Just write `var name = "Yuhao"`
   and do not think about it.
1. For a function argument that you only read, use `StringSpan`.
1. For a constant that you want to keep somewhere for the whole program, such as
   a field of a struct or a global setting, use `StaticString`.
1. Only think about the difference when you have measured that it matters.
   Mojo's `String` is designed so that the lazy choice is rarely the wrong
   choice.

### Views are cheap, and they stay cheap

The nice thing about a view is that it stays a view. When you slice a
`StringSpan`, or split it, you get more views, and no text is copied anywhere
along the way:

::: code-group

```mojo
def main():
    var sentence: StaticString = "Mojo is a fast language"
    var parts = sentence.split(" ")   # this is a List[StaticString]
    print(parts[0])                   # Mojo
```

:::

The `split()` method above returns five `StaticString` values, each of which
points into the original literal. Compare this with Python, where
`"Mojo is a fast language".split(" ")` builds five brand-new `str` objects and
copies every letter into them.

:::: details Evidence: `StringSlice` was renamed to `StringSpan` in Mojo v1.0.0

If you read older code, older tutorials, or older versions of this Miji, you
will see the name `StringSlice` instead of `StringSpan`. They are the same type:
it was renamed in Mojo v1.0.0 so that it matches the other non-owning view types
such as `Span`. The old name still works, because the standard library keeps it
around as an alias:

```mojo
# Mojo standard library
# https://github.com/modular/modular/blob/main/mojo/stdlib/std/collections/string/string_span.mojo

comptime StringSlice = StringSpan
"""Provides a compatibility alias for `StringSpan`."""

comptime StaticString = StringSpan[ImmStaticOrigin]
"""An immutable static string span."""
```

The second line also tells us what a `StaticString` really is. It is not a
separate type at all: it is a `StringSpan` whose text is known to live in a
place that never goes away.

::::

::: info Where does `StringSpan` get its safety from?

You may be wondering what stops you from creating a `StringSpan` that looks at a
`String` which has already been destroyed. This is a real danger, and Mojo has a
real answer for it, called an **origin**. Every `StringSpan` carries a note
about which variable its text belongs to, and the compiler refuses to let the
view outlive that variable.

You do not need to know anything about origins to use `StringSpan` the way we
used it above, because the compiler works them out for you. We come back to this
topic in Section
[Origins of string views](../advanced/lifetimes#origins-of-string-views) of
Chapter [Lifetimes and origin](../advanced/lifetimes).

:::

## String printing and formatting

In Mojo, you can print a `String` using the `print()` function.

String formatting is partially supported in Mojo. You can use curly brackets
`{}` within a `String` object to indicate where to insert values, and then call
the `format` methods to replace those placeholders with actual values. You can
optionally put numbering in the placeholders to specify the order of the values
to be inserted. For example:

```mojo
# src/basic/string/string_printing_and_formatting.mojo
def main() raises:
    var a = String("Today is {} {} {}").format(1, "Janurary", 2023)
    var b = String("{0} plus {1} equals {2}").format(1.1, 2.34, 3.45)
    var c = "{0} apples plus {1} oranges is {2}".format(3, 2, "nonsense")
    print(a)
    print(b)
    print(c)
```

```output mojo
Today is 1 Janurary 2023
1.1 plus 2.34 equals 3.45
3 apples plus 2 oranges is nonsense
```

::: tip When does `format()` need a `raises`?

You may have noticed that the example above does not need `def main() raises:`,
even though `format()` is a function that can fail. The reason is worth knowing.

When you call `format()` on a **string literal**, as in `"{} apples".format(3)`,
the compiler can read the format string during compilation, check that the curly
brackets make sense, and report any mistake as a compilation error. There is
nothing left to fail at run time, so the call does not raise.

When you call `format()` on a **`String`**, as in
`String("{} apples").format(3)`, the format string is an ordinary run-time
value, and the compiler cannot look inside it. The call may therefore fail while
the program runs, and you have to mark the surrounding function with `raises`.
If you forget, you will get this:

```console
error: cannot call function that may raise in a context that cannot raise
    print(String("Today is {} {}").format(1, "Jan"))
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~~~~~~~~~
```

This is why the example file above is written with `def main() raises:`.

:::

However, the following features are not supported in Mojo:

- **f-strings**: Mojo does not support f-strings like Python does. You cannot
  use the `f` prefix to format strings. Mojo has **t-strings** instead, which we
  introduce right after this section.
- **Named fields**: You cannot put variable names in curly brackets `{}` and use
  the `format()` method to fill them in by name.
- **Formatting styles**: You cannot specify formatting styles in curly brackets,
  e.g., `.2f` for floating-point numbers or `.3%` for percentages.

For example, the following code will not work in Mojo:

::: code-group

```mojo
# src/basic/string/f_string.mojo
# This code will not compile
def main():
    var a = String("Today is {day} {month} {year}").format(
        day=1, month="Janurary", year=2023
    )
    var b = String("{0:.2f} plus {1:.2%} equals {2:.3g}").format(
        1.1, 2.34, 3.45
    )


print(a)  # Not working in Mojo
print(b)  # Not working in Mojo
```

:::

This code will generate the following error:

```console
error: invalid call to 'format': unexpected keyword argument 'day'
    var a = String("Today is {day} {month} {year}").format(
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^
```

::: tip Formatting in Python

Note that the above code will work in Python.

```python
def main():
    a = "Today is {day} {month} {year}".format(day=1, month="Janurary", year=2023)
    b = "{0:.2f} plus {1:.2%} equals {2:.3g}".format(1.1, 2.34, 3.45)
    print(a)
    print(b)
main()
```

```output python
Today is 1 Janurary 2023
1.10 plus 234.00% equals 3.45
```

:::

## Template strings (t-strings)

Since Mojo v0.26.2, there is something that will feel very familiar if you like
Python's f-strings: the **template string**, or **t-string** for short. You
write it with a `t` prefix instead of an `f` prefix, and you put your variables
and expressions directly inside the curly brackets:

::: code-group

```mojo
# src/basic/string/t_string.mojo
def main():
    var name = "Mojo"
    var year = 2026

    var greeting = t"Hello, {name}! The year is {year}."
    print(greeting)

    # A t-string can be turned into a String when you need to keep it.
    var kept = String(t"{name} was released in {year}.")
    print(kept)

    # Expressions are allowed inside the braces.
    print(t"1 + 2 = {1 + 2}")
```

```output mojo
Hello, Mojo! The year is 2026.
Mojo was released in 2026.
1 + 2 = 3
```

```python
def main():
    name = "Mojo"
    year = 2026

    greeting = f"Hello, {name}! The year is {year}."
    print(greeting)

    kept = str(f"{name} was released in {year}.")
    print(kept)

    print(f"1 + 2 = {1 + 2}")


main()
```

```output python
Hello, Mojo! The year is 2026.
Mojo was released in 2026.
1 + 2 = 3
```

:::

So why is it called a "template string" and not an "f-string"? Because a
t-string does not immediately build a string for you. It creates a value of the
`TString` type, which keeps two things apart: the constant text of the template,
which the compiler already knows, and the values you interpolated, which it
keeps as they are, in their own types.

The text is only assembled at the moment you actually need it. If you pass a
t-string straight to `print()`, as in the first and third example above, no
`String` is ever built: the pieces are written to the screen one after another.
Only when you write `String(...)` around it, as in the second example, do you
get a real `String` that you can keep.

This is the reason why Mojo chose t-strings over f-strings. An f-string always
builds a new string, even when you are going to throw it away one line later. A
t-string lets you skip that work when you do not need it.

::: warning You still cannot specify formatting styles

A t-string is not a full replacement for a Python f-string yet. In particular,
you cannot write formatting styles inside the curly brackets:

```mojo
print(t"{value:.2f}")  # Not supported in Mojo
```

If you need to control the number of decimals, you have to do the rounding
yourself before interpolating the value.

:::

## String iteration

In Mojo, you can iterate over a `String` with a `for` loop, exactly as you do in
Python:

::: code-group

```mojo
# src/basic/string/string_iteration.mojo
def main():
    var my_string = String("Hello, world! 你好，世界！")
    for char in my_string:
        print(char, end="")
    print()
```

```output mojo
Hello, world! 你好，世界！
```

```python
# src/basic/string/string_iteration.py
def main():
    my_string = str("Hello, world! 你好，世界！")
    for char in my_string:
        print(char, end="")


main()
```

```output python
Hello, world! 你好，世界！
```

:::

::: details String iteration was more complicated before Mojo v1.0.0

Before Mojo v1.0.0, a `String` could not be iterated over directly. You had to
call the `codepoints()` method and iterate over the result:

```mojo
# This is only relevant for Mojo v0.26.2 and earlier.
def main():
    var my_string = String("Hello, world! 你好，世界！")
    for char in my_string.codepoints():
        print(char, end="")
```

This still works today, and it is still the right thing to write when you really
do want code points. But it is no longer the default, because "one code point"
is not what most people mean when they say "one character". See the next
sub-section.

:::

### Which unit are you iterating over?

Now comes the interesting part, and it is a part that Python quietly hides from
you.

When you write `for char in my_string:` in Python, you get one **code point**
per step. When you write the same thing in Mojo, you get one
**grapheme cluster** per step. We introduced these two words in Section
[Grapheme clusters](#grapheme-clusters) below: a code point is one Unicode
number, while a grapheme cluster is what a human being would point at on the
screen and call "one character".

Most of the time these two are the same thing, which is why you have never had
to worry about it in Python. But they part ways as soon as accents or emojis
show up. Let's look at all three levels at once:

::: code-group

```mojo
# src/basic/string/string_iteration_levels.mojo
def main():
    # "cafe" + combining acute accent (U+0301) + a grinning face (U+1F600).
    var s = "cafe\u0301\U0001f600"

    print("for char in s:                   ", end="")
    for char in s:
        print(char, end=" ")
    print()

    print("for cp in s.codepoints():        ", end="")
    for cp in s.codepoints():
        print(cp, end=" ")
    print()

    print("for b in s.bytes():              ", end="")
    for b in s.bytes():
        print(b, end=" ")
    print()

    print("for g in s.graphemes_reversed(): ", end="")
    for g in s.graphemes_reversed():
        print(g, end=" ")
    print()
```

```output mojo
for char in s:                   c a f é 😀 
for cp in s.codepoints():        c a f e ́ 😀 
for b in s.bytes():              99 97 102 101 204 129 240 159 152 128 
for g in s.graphemes_reversed(): 😀 é f a c
```

:::

Look carefully at the second line. The "é" has fallen apart into an "e" and a
lonely accent floating on its own, because they are two separate code points.
The first line keeps them together, because they form a single grapheme cluster.
This is why Mojo chose grapheme clusters as the default: it is the answer that
matches what you see.

The following table summarizes the ways to iterate over a string:

| What you write                   | What you get in each step              | Type of the item |
| -------------------------------- | -------------------------------------- | ---------------- |
| `for c in s:`                    | One grapheme cluster ("one character") | `StringSpan`     |
| `for c in s.graphemes():`        | The same as above, written explicitly  | `StringSpan`     |
| `for c in s.codepoints():`       | One Unicode code point                 | `Codepoint`      |
| `for c in s.codepoint_slices():` | One Unicode code point                 | `StringSpan`     |
| `for b in s.bytes():`            | One raw UTF-8 byte                     | `Byte` (`UInt8`) |

You can also walk backwards with `s.graphemes_reversed()` and
`s.codepoint_slices_reversed()`, as the last line of the example shows.

::: warning Walking backwards is not free

Iterating backwards over grapheme clusters costs more per step than iterating
forwards. This is a consequence of UTF-8: the encoding is designed to be read
from left to right, so finding the previous character takes more work than
finding the next one. It is fine for ordinary use, but do not build a hot loop
around it.

:::

::: info characters vs code points

Do you know that in early versions of Mojo, we use "characters" (`Char` type) to
stand for a meaningful unit of text corresponding to a single Unicode code
point? However, in the latest versions of Mojo, it is changed to "code points"
(`Codepoint` type) to refer to the same concept. This change is made to align
with the Unicode terminology because a character can also be composed of
multiple code points, such as "grapheme clusters".

You can read more about this change in the article
[Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) and
[PR #3988: String, ASCII, Unicode, UTF, Graphemes](https://github.com/modular/modular/pull/3988).

:::

## String length

Here is a question that looks trivial but is not: how long is the string
`"café"`?

In Python you would write `len(s)` and get an answer without thinking. In Mojo,
`len()` on a string does not compile at all:

::: code-group

```mojo
# src/basic/string/string_len.mojo
# This code will not compile
def main():
    var s = "hello"
    print(len(s))
```

:::

```console
error: `len(String/StringSlice)` is not supported because Mojo strings are UTF-8 encoded, so a single length is ambiguous: it could mean the number of UTF-8 bytes, the number of Unicode code points, or the number of user-visible characters (grapheme clusters). Use `s.byte_length()` or `len(s.bytes())` for the number of UTF-8 bytes, `len(s.codepoints())` for Unicode code points, or `len(s.graphemes())` for grapheme clusters.
    print(len(s))
          ^~~
```

This is the "**be specific**" principle that we mentioned in the warning box of
Section [Grapheme clusters](#grapheme-clusters). Mojo would rather refuse to
answer than give you an answer to a question you did not mean to ask. So it
offers you three methods, and you pick the one that matches your intention:

| Method                 | What it counts                              | Cost             |
| ---------------------- | ------------------------------------------- | ---------------- |
| `s.byte_length()`      | Raw UTF-8 bytes                             | Instant          |
| `s.count_codepoints()` | Unicode code points                         | Walks the string |
| `s.count_graphemes()`  | User-visible characters (grapheme clusters) | Walks the string |

Now let's answer the question about `"café"`. It turns out the question was
ill-posed, because there are two different ways to write that word:

::: code-group

```mojo
# src/basic/string/string_lengths.mojo
def main():
    # Both strings display as "café", but they are encoded differently.
    # The first one uses the single code point U+00E9.
    # The second one uses "e" (U+0065) followed by a combining acute accent
    # (U+0301), which is written here with the `\u0301` escape sequence.
    var precomposed = "caf\u00e9"
    var decomposed = "cafe\u0301"

    print("precomposed:", precomposed)
    print("    byte_length()      =", precomposed.byte_length())
    print("    count_codepoints() =", precomposed.count_codepoints())
    print("    count_graphemes()  =", precomposed.count_graphemes())

    print("decomposed :", decomposed)
    print("    byte_length()      =", decomposed.byte_length())
    print("    count_codepoints() =", decomposed.count_codepoints())
    print("    count_graphemes()  =", decomposed.count_graphemes())
```

```output mojo
precomposed: café
    byte_length()      = 5
    count_codepoints() = 4
    count_graphemes()  = 4
decomposed : café
    byte_length()      = 6
    count_codepoints() = 5
    count_graphemes()  = 4
```

:::

Two strings that look identical on your screen, and the only count that agrees
between them is the number of grapheme clusters. If you are counting
"characters" the way a reader of your program's output would count them,
`count_graphemes()` is the method you want. If you are reserving memory or
writing bytes to a file, `byte_length()` is the one.

::: tip This is not a Mojo problem

Python has exactly the same issue, it just does not tell you about it. In
Python, `len("café")` gives you 4 or 5 depending on which of the two spellings
you typed, and there is no built-in way to get the answer 4 for both. Mojo did
not create this complication; it inherited it from Unicode, and decided to be
honest about it.

:::

## String indexing and slicing

The same principle applies when you want to reach into a string. Writing `s[0]`
does not compile:

::: code-group

```mojo
# src/basic/string/string_positional_indexing.mojo
# This code will not compile
def main():
    var s = "hello"
    print(s[0])
    print(s[0:3])
```

:::

```console
error: String does not support direct positional indexing like `s[i]` because Mojo strings are UTF-8 encoded, and the same position can mean three different things. Use one of: `s[byte=i]` for a raw UTF-8 byte, `s[codepoint=i]` for a Unicode code point, or `s[grapheme=i]` for a user-visible character (grapheme cluster).
    print(s[0])
          ~^~~
error: String does not support direct positional slicing like `s[a:b]` because Mojo strings are UTF-8 encoded, and the same range can mean different things. Use `s[byte=a:b]` to slice by raw UTF-8 byte positions, or `s[codepoint=a:b]` to slice by Unicode code points.
    print(s[0:3])
          ~^~~~~
```

Instead of a bare number, you write a **keyword** inside the square brackets to
say which unit you are counting in. Let's use the same string that we dissected
in Section
[Internal representation of String](#internal-representation-of-string):

::: code-group

```mojo
# src/basic/string/string_indexing_and_slicing.mojo
def main():
    var s = "你好shìjiè😀🇨🇳"

    print("s[byte=0:6]      =", s[byte=0:6])
    print("s[codepoint=0]   =", s[codepoint=0])
    print("s[codepoint=2:8] =", s[codepoint=2:8])
    print("s[grapheme=8]    =", s[grapheme=8])
    print("s[grapheme=9]    =", s[grapheme=9])
```

```output mojo
s[byte=0:6]      = 你好
s[codepoint=0]   = 你
s[codepoint=2:8] = shìjiè
s[grapheme=8]    = 😀
s[grapheme=9]    = 🇨🇳
```

:::

The last line is the interesting one. The Chinese flag "🇨🇳" is a single grapheme
cluster made of two code points, so `s[grapheme=9]` hands you both of them
together, while asking for a code point at that position would have given you
half a flag.

The following table summarizes what you can write:

| Syntax             | Meaning                               | Available on              |
| ------------------ | ------------------------------------- | ------------------------- |
| `s[byte=i]`        | The byte at position `i`              | `String` and `StringSpan` |
| `s[byte=i:j]`      | The bytes from `i` to `j`             | `String` and `StringSpan` |
| `s[codepoint=i]`   | The code point at position `i`        | `String` and `StringSpan` |
| `s[codepoint=i:j]` | The code points from `i` to `j`       | `String` and `StringSpan` |
| `s[grapheme=i]`    | The grapheme cluster at position `i`  | `String` and `StringSpan` |
| `s[grapheme=i:j]`  | The grapheme clusters from `i` to `j` | `StringSpan` only         |

Note the last row: slicing a range of grapheme clusters is currently only
available on `StringSpan`, not on `String`. If you need it on a `String`, wrap
it first with `StringSpan(s)[grapheme=i:j]`.

Also note that all of these give you back a `StringSpan`, not a `String`. This
is the design we discussed in Section
[String, StringSpan, and StaticString](#string-stringspan-and-staticstring):
slicing does not copy any letters, it just gives you a view into the string you
already have. If you want to keep the result after the original string is gone,
wrap it with `String()`.

::: warning No negative indices, and no silent clamping

If you are used to Python's `s[-1]` for the last character, or `s[0:100]`
quietly giving you as much as it can, be careful: Mojo does neither. Since Mojo
v1.0.0, an out-of-range or negative index makes your program abort with an error
message instead of guessing what you meant.

To get the last byte of a string, write `s[byte=s.byte_length() - 1]`.

:::

## Internal representation of String

::: tip You can skip this section on your first read

This section explains how the characters of human languages are encoded, and how
Mojo stores a `String` in the memory. It is background knowledge, and you do not
need it to use strings correctly in your program. If you are reading this Miji
for the first time, you can jump to the next chapter and come back later when
you become curious about the details.

:::

You may wonder, how strings are stored in the memory? Is each character stored
as the same number of bytes? If not, how do we determine the start and end of
each character?

To answer these questions, let's take a look at the following two things:

1. The encoding schema of characters of Human languages.
1. The internal representation of a `String` in Mojo.

### Unicode and code points

Characters are the building blocks of texts. They can be letters (Latin, Greek,
Slavic, Sanskrit, etc., e.g, "abc", "αβγ", "абв", "अआइ"), 漢字 (Hànzì, Kanji,
Hanja, e.g., "天地人"), digits ("123"), punctuation marks ("!., ?;"), symbols
("@#$"), or even emojis ("繪文字", literally, "graphic characters", e.g.,
"😀❤️🌍").

**"All characters are equal"**, they do not have a certain rank or order.
However, when human beings entered into the era of 0s and 1s (like in telegrams,
longs and shorts), they find it convenient to assign characters an ordinal
number, so that they can be easily transmitted to and processed by other people.

However, this ordering is not universal. Different languages, different
organizations, and different governments may have different ways of assigning
ordinal numbers to characters. A ordinal number may refer to a different
character in different systems. In the trend of internationalization, people
realized that they need a unified system to represent characters in a consistent
way. This is how the **Unicode** standard was born.

Unicode is a standard that assigns a unique integral number to every character
in almost all human languages and scripts, as well as many symbols and emojis.
The integral number assigned to characters is called a **code point**. We
usually use the prefix "U+" to indicate that it is a Unicode code point. For
example, the code point for the letter "a" is U+0061, the code point for the
Chinese character "天" is U+5929, and the code point for the emoji "😀" is
U+1F600.

But which characters go first? It is a question, but not a difficult one. The
makers of the Unicode standard decided to assign code points in a way that is
consistent with the order of characters in the most widely used scripts. For
example, the ASCII characters, that are so widely used in computer science,
receive the first 128 code points, from U+0000 to U+007F. This makes Unicode
backward-compatible with ASCII. Then come the other Latin alphabet, the Greek
alphabet, symbols, and other scripts.

### Grapheme clusters

For some characters or symbols, they might be composed of multiple code points.
For example, "g̈" (U+0067 U+0308), is composed of two code points: the letter "g"
(U+0067) and the combining diaeresis (U+0308). This is called a
**grapheme cluster**, which is a sequence of one or more code points that are
displayed as a single character. This is a way to allow dynamic composition of
characters, especially for some languages that are normally written with
diacritics or other modifiers.

In this Miji, if there is possible confusion, I will use the term
**code-point character** to refer to a character that is represented by a single
code point, and **grapheme-cluster character** to refer to a character that is
composed of multiple code points.

::: warning Is character a grapheme cluster or a code point?

**A character can both refer to a single code point and a grapheme cluster**,
depending on the context. Thus, a character (represented by a grapheme cluster)
can be composed of multiple characters (represented code points). You can refer
to this article
[Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) if you are
interested.

This flexibility also introduces ambiguity and confusion when we want to
**print**, **count**, or **iterate** characters in a string. For example, the
string "g̈" can be considered as one character (a grapheme cluster) or two
characters (two code points). Is this string of length 1 or 2? Moreover, should
the length also be counted in bytes?

This is a common issue in many programming languages, but the solution is
straightforward:

**Be specific**!

Yes, just be more specific about what you want to do. In Mojo, the term
"character" is avoided in methods of the string type. When it comes to printing,
counting, or iterating, Mojo uses more explicit terms like "bytes", "code
points" or "grapheme clusters".

In the old versions of Mojo, there is a `Char` type that represents a single
code point, but it is deprecated in the latest versions because it leads to
confusion. Some people may think that it is a grapheme cluster, some may think
that it is a code point, the rest may think that it is a ASCII character (`char`
in C). Thus, from Mojo v25.1, the `Char` type is replaced by the `Codepoint`
type, which is more explicit and clear.

:::

### UTF-8 encoding

Each code-point character has a unique code point, but how do we store these
code points in the memory? How do we represent them as a sequence of bytes that
can be processed by computers?

I think many people may immediately think of a very intuitive, yet simple,
solution: we can use a fixed-length encoding schema, where each code point is
represented by a fixed number of bytes. The length should be long enough to hold
all valid code points. Because the capacity of Unicode is 1,114,112 code points
(from U+0000 to U+10FFFF), we should use at least 3 bytes to represent each code
point.

This is a valid solution, of course, and it is called **UTF-32** encoding, where
each character is represented by 32-bits (4 bytes). This is a fixed-length
encoding schema, which means that each character takes the same amount of space
in the memory. An alternative proposal is
[UTF-24 encoding](https://unicode.org/mail-arch/unicode-ml/y2007-m01/0057.html),
with less space wasted, but it is not very compatible with modern computer
architectures.

UTF-32 is intuitive and simple. The time complexity of accessing a character is
O(1), because we can calculate the address of a character by multiplying its
index by 4.

**"But some characters are more equal than others"**, in the modern world, the
most used characters are those in the ASCII range (U+0000 to U+007F), which are
the basic Latin letters, digits, and punctuation marks. These characters are
used in almost every programming language and are used in the most spoken
languages, such as English, Spanish, French, etc. If we use UTF-32 encoding, we
will waste a lot of space for these characters, because they only take 1 byte in
ASCII encoding.

This makes UTF-32 not a very space-efficient encoding schema.

A solution is to use a **variable-length encoding schema**, where each character
is represented by either 1, 2, 3, or 4 bytes. This way, we can use fewer bytes
for common characters and more bytes for less common characters. This is how
**UTF-8** encoding was brought to the world.

For example, the letter "a" (U+0061) will take 4 bytes in UTF-32, while it only
takes 1 byte in ASCII. The Chinese character "天" (U+5929) will take 4 bytes in
UTF-32, while it only takes 3 bytes in UTF-8. The emoji "😀" (U+1F600) will take
4 bytes in both UTF-8 and UTF-32.

The advantage of UTF-8 is obvious, the only technical question is
**segmentation**. We need some unique patterns to allow us, as well as
computers, to quickly determine whether a byte is the start of a character or
not. Here are the rules:

- A valid UTF-8 character must starts with `0` (1-byte character), `110` (2-byte
  character), `1110` (3-byte character), `11110` (4-byte character).
- The non-first bytes of a string must be `10`.

This means that not all slices of 1 bytes to 4 bytes are valid UTF-8 characters.
For more about the encoding schema, you can refer to the
[UTF-8 Wikipedia page](https://en.wikipedia.org/wiki/UTF-8).

::: tip Visual checks of valid UTF-8 code points

You can count the number of leading 0 or 1 in the first byte of a UTF-8
character to determine how many bytes it takes. Specifically, **the number of
ones is equal to the number of bytes for non-single-byte code point**. For
example:

- 1 leading `0`: 1-byte character
- 2 leading `1`: 2-byte character
- 3 leading `1`: 3-byte character
- 4 leading `1`: 4-byte character

:::

In this way, although bytes are contiguously stored in the memory, programming
languages are able to determine the start and end of each character. If you try
to access a character by passing in a wrong slice, no valid character will be
returned.

### Back to string in Mojo

Now back to the question of how a `String` is stored in the memory in Mojo.
`String` is saved contiguously in the memory as a list of bytes (or, a list of
8-bit unsigned integers, `List[UInt8]`). These sequence of bytes are encoded in
UTF-8 format, which means that each character can take 1 to 4 bytes depending on
the code point of the character.

The following example shows how `"abc"` is stored in the memory as a Mojo's
`String` type. Note that "a", "b", and "c" are of the same code in ASCII and
Unicode, and each of them is represented by one byte in UTF-8 encoding.

```console
# Mojo Miji - Data types - Internal representation of String "abc"
                    ┌──────────┬──────────┬──────────┐
Character           │    a     │     b    │     c    │
                    ├──────────┼──────────┼──────────┤
Unicode code point  │   97     │    98    │    99    │
                    ├──────────┼──────────┼──────────┤
In memory (binary)  │ 00111101 │ 00111101 │ 00111101 │
                    └──────────┴──────────┴──────────┘
```

Remember that, in the rules, "a valid UTF-8 character must starts with `0` for
1-byte character". So Mojo can easily determine that each of these characters is
a valid UTF-8 character, and they are stored as 1 byte each.

While ASCII codes are always stored as one-byte with UTF-8 encoding, other
Characters usually takes more than 2 bytes. For example, common Chinese
characters are usually stored as 3 bytes in the memory, even though it is
**displayed** as a single character on your screen.

For example, the string "你好shìjiè😀🇨🇳" means "hello world 😀🇨🇳" in Chinese (in
[hànzì](https://en.wikipedia.org/wiki/Chinese_characters) and
[pīnyīn](https://en.wikipedia.org/wiki/Pinyin) forms). It is display as 10
characters in total: 2 Chinese characters, 6 Latin letters with or without
signs, 1 Emoji, and 1 national flag (on some devices, this may not shown
correctly but instead two letters).

However, they requires more than 10 bytes to be stored in the memory. Actually,
it might be more complicated than you may have thought. Let's take a look at the
internal representation of this string in Mojo in the following graphic:

```console
# Mojo Miji - Data types - Internal representation of String "你好shìjiè😀🇨🇳"
                        ┌────────────────────────────────┬────────────────────────────────┬──────────┬──────────┬─────────────────────┬──────────┬──────────┬─────────────────────┬───────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
Grapheme cluster        │                你              │               好               │    s     │    h     │          ì          │    j     │    i     │          è          │                    😀                     │                                          🇨🇳                                           │
                        ├────────────────────────────────┼────────────────────────────────┼──────────┼──────────┼─────────────────────┼──────────┼──────────┼─────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────┬───────────────────────────────────────────┤
Code point (readable)   │                你              │               好               │    s     │    h     │          ì          │    j     │    i     │          è          │                    😀                     │                   🇨                      │                   🇳                      │
                        ├────────────────────────────────┼────────────────────────────────┼──────────┼──────────┼─────────────────────┼──────────┼──────────┼─────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────┤
Unicode (hex)           │               U+4F60           │              U+597D            │  U+0073  │  U+0068  │       U+00EC        │  U+006A  │  U+0069  │        U+00E8       │                 U+1F600                   │                 U+1F1E8                   │                 U+1F1F3                   │
                        ├──────────┬──────────┬──────────┼──────────┬──────────┬──────────┼──────────┼──────────┼──────────┬──────────┼──────────┼──────────┼──────────┬──────────┼──────────┬──────────┬──────────┬──────────┼──────────┬──────────┬──────────┬──────────┼──────────┬──────────┬──────────┬──────────┤
Byte view (decimal)     │   228    │    189   │   160    │   229    │   165    │    189   │   115    │   104    │   195    │    172   │    106   │    105   │    195   │    168   │   240    │   159    │   152    │   128    │   240    │    159   │    135   │    168   │    240   │    159   │    135   │    179   │
                        ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
Bit (binary)            │ 11100100 │ 10111101 │ 10100000 │ 11100101 │ 10100101 │ 10111101 │ 01110011 │ 01101000 │ 11000011 │ 10101100 │ 01101010 │ 01101001 │ 11000011 │ 10101000 │ 11110000 │ 10011111 │ 10011000 │ 10000000 │ 11110000 │ 10011111 │ 10000111 │ 10101000 │ 11110000 │ 10011111 │ 10000111 │ 10110011 │
                        └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

Okay, let's explain it from the bottom to the top.

- **Byte (binary)**: This row shows the sequence of bytes in the memory, which
  is a contiguous sequence of `UInt8` values. Each byte is represented by 8 bits
  (0s and 1s).
- **Byte view (decimal)**: This row shows the decimal values of each byte, which
  are the `UInt8` values in the memory. For example, the first byte is `228`,
  which is `11100100` in binary.
- **Unicode (hex)**: This row shows the Unicode code points of each character in
  hexadecimal format. You can see that each Unicode is composed of one or more
  bytes from below. The mapping from bytes to Unicode code points is determined
  by the UTF-8 encoding schema. For example, the first character "你" has a code
  point of `U+4F60`, which is composed of three bytes; the letter "s" is
  composed of one byte; the letter "è" is composed of two bytes; and the emoji
  "😀" is composed of four bytes.
- **Code point**: This row is a human-readable way of the corresponding code
  points of the Unicode. You can see that, at this point, the most of code
  points can be represented by a single human-readable character, except for the
  national flag "🇨🇳".
- **Grapheme cluster**: This row shows the grapheme clusters. A grapheme cluster
  is a sequence of one or more code points that are displayed as a single
  character. This enables a more dynamic representation of characters. For
  example, the national flags are composed of two code points, each one
  representing a letter of the country code. For example, the country code of
  China is "CN", and thus, the national flag of China consists of two code
  points, "🇨" (U+1F1E8) and "🇳" (U+1F1F3). The country code of the United States
  is "US", and thus, the national flag of the US consists of two code points,
  "🇺" and "🇸".

So, you can see that there are multiple layers of representation for a `String`
in Mojo. Some characters are represented by a single byte, some are represented
by a code point, and some are represented by a grapheme cluster. When you use
this convenient `String` type in future, you should thank all the people who
have worked on this topic.

### Examine the internal representation of a String

We can examine its exact `UInt8` sequence in the memory with the following code:

::: code-group

```mojo
def main():
    var s = String("你好shìjiè😀🇨🇳")
    var idx = 0
    print("Index | Binary       | Decimal | Hexadecimal")
    for i in s.as_bytes():
        var byte_dec = Int(i)
        var byte_bin = bin(byte_dec)
        var byte_hex = hex(byte_dec)
        print(idx, "    | ", byte_bin, " | ", byte_dec, "   | ", byte_hex)
        idx += 1
```

```output mojo
Index | Binary       | Decimal | Hexadecimal
0     |  0b11100100  |  228    |  0xe4
1     |  0b10111101  |  189    |  0xbd
2     |  0b10100000  |  160    |  0xa0
3     |  0b11100101  |  229    |  0xe5
4     |  0b10100101  |  165    |  0xa5
5     |  0b10111101  |  189    |  0xbd
6     |  0b1110011  |  115    |  0x73
7     |  0b1101000  |  104    |  0x68
8     |  0b11000011  |  195    |  0xc3
9     |  0b10101100  |  172    |  0xac
10     |  0b1101010  |  106    |  0x6a
11     |  0b1101001  |  105    |  0x69
12     |  0b11000011  |  195    |  0xc3
13     |  0b10101000  |  168    |  0xa8
14     |  0b11110000  |  240    |  0xf0
15     |  0b10011111  |  159    |  0x9f
16     |  0b10011000  |  152    |  0x98
17     |  0b10000000  |  128    |  0x80
18     |  0b11110000  |  240    |  0xf0
19     |  0b10011111  |  159    |  0x9f
20     |  0b10000111  |  135    |  0x87
21     |  0b10101000  |  168    |  0xa8
22     |  0b11110000  |  240    |  0xf0
23     |  0b10011111  |  159    |  0x9f
24     |  0b10000111  |  135    |  0x87
25     |  0b10110011  |  179    |  0xb3
```

:::

### Where a String keeps its bytes

We now know what the bytes of a string look like. The last question is where a
`String` variable actually keeps them.

A `String` in Mojo is 24 bytes big on a 64-bit machine, no matter how long the
text is. Those 24 bytes are three machine words, and depending on the situation
they are used in one of three different ways:

| Form         | When it is used                             | What the 24 bytes hold                           | Any memory allocated? |
| ------------ | ------------------------------------------- | ------------------------------------------------ | --------------------- |
| **Inline**   | The text is at most 23 bytes long           | The text itself, plus its length                 | No                    |
| **Constant** | The text comes from a string literal        | Where the letters sit in your compiled program   | No                    |
| **Owned**    | After the string has been modified or grown | Where the letters sit on the heap, plus capacity | Yes                   |

The **inline** form is the one we met in Chapter
[Structs](../basic/structs#memory-layout-of-struct): a short string simply lives
inside the `String` variable, which is why a `String` field does not always mean
a pointer to somewhere else. This is commonly known as the
**small string optimization**.

The **constant** form is the one we demonstrated at the beginning of this
chapter, in Section [String literals and String](#string-literals-and-string): a
`String` built from a literal just remembers where the letters already are.

The **owned** form is the one that most closely matches what a Python `str`
does. Note that Mojo only moves into this form when it has to, that is, when you
modify the string. This is why `var a = "Hello"` costs nothing, while
`a += ", world!"` is where the real work happens.

::: info Further reading

If you want to see how these three forms are packed into 24 bytes, including the
flag bits that tell them apart, the official
[Proposal on String Design](https://github.com/modular/modular/blob/main/mojo/proposals/string-design.md)
walks through the layout byte by byte.

:::

::: details How `String` got to this shape

Earlier editions of this chapter opened with a warning that everything you were
about to read might change next month. That warning has been retired: the Mojo
API has been stable since **v1.0.0**, and `String` is not expected to move again
in the near term. What follows is the trail it left, in case you meet older code
or older writing about Mojo.

For years `String` was the most argued-over type in the language. Should a
string be a sequence of bytes, of code points, or of grapheme clusters? Should
indexing be allowed at all, given that any answer is wrong for somebody? Should
`String` even be built in, rather than a library that each project picks for
itself? Different answers landed in different releases, which is why Mojo
tutorials written a year apart can disagree with each other.

Three documents record the arguments, and the design proposal linked just above
is the first of them:

- [Proposal on fixing simple literals](https://github.com/modular/modular/blob/main/mojo/proposals/fixing-simple-literals.md),
  which explains why a string literal turns into a `String` at run time.
- [PR #3988: String, ASCII, Unicode, UTF, Graphemes](https://github.com/modular/modular/pull/3988),
  the long discussion behind the byte-based design this chapter describes.

:::

## Main changes in this chapter

- 2025-06-21: Update to accommodate the changes in Mojo v25.4.
- 2025-08-18: Update to accommodate the changes in Mojo v25.5.
- 2026-02-28: Update to accommodate the changes in Mojo v0.26.1.
- 2026-08-10: Update to accommodate the changes in Mojo v1.0.0. Add a section on
  `StringSpan` and `StaticString`. Add a section on template strings
  (t-strings). Add a section on string length. Rewrite the sections on string
  iteration and on string indexing and slicing, both of which are now supported.
- 2026-08-19: Correct the source-file paths of the code listings so that they
  match `my-first-mojo-project`.
- 2026-08-21: Remove the warning that `String` is still changing. The API has
  been stable since Mojo v1.0.0, so the warning and its references are kept as a
  history note under Section
  [Where a String keeps its bytes](#where-a-string-keeps-its-bytes). Add a
  notice under Section
  [Internal representation of String](#internal-representation-of-string) that
  this section is background knowledge and can be skipped on a first read.
