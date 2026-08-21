# Composite data types

> Human beings are merely containers of atoms.  
> -- Yuhao Zhu, *Gate of Heaven*

In this chapter, we continue to learn about the composite data types in Mojo.
Composite data types are data types that can hold multiple values of the same or
different types. They are also known as **compound types** or
**collection types**. We will cover the following topics:

- How to create a list and access to its elements
- How to iterate over a list
- List comprehension syntax
- The memory layout of a list in Mojo
- How an array differs from a list, and why a bare literal gives you an array
- The memory layout of an array in Mojo

## Lists

In Mojo, a `List` is a mutable, variable-length sequence that can hold a
collection of elements of the ***same type***. It is similar to Rust's `Vec`
type, but it is different from Python's `list` type that can hold objects of
**any type**. Here are some key differences between Python's `list` and Mojo's
`List`:

| Functionality      | Mojo `List`                              | Python `list`                               |
| ------------------ | ---------------------------------------- | ------------------------------------------- |
| Type of elements   | Homogeneous type                         | Heterogenous types                          |
| Mutability         | Mutable                                  | Mutable                                     |
| Initialization     | `List[Type]()`, or `:List[Type] = []`    | `list()` or `[]`                            |
| Indexing           | Use brackets `[]`, no negative index     | Use brackets `[]`                           |
| Slicing            | Use brackets `[a:b:c]`, must be in range | Use brackets `[a:b:c]`, clamped             |
| Extending by items | Use `append()`                           | Use `append()`                              |
| Concatenation      | Use `+` operator                         | Use `+` operator                            |
| Printing           | Use `print()`, but verbose               | Use `print()`                               |
| Iterating          | Use `for` loop                           | Use `for` loop                              |
| Iterator returns   | Reference to element                     | Copy of element                             |
| List comprehension | Partially supported                      | Supported                                   |
| Memory layout      | Metadata -> Elements                     | Pointer -> metadata -> Pointers -> Elements |
| Shallow copy       | N.A.                                     | `list.copy()` or `copy.copy(lst)`           |
| Deep copy          | `lst.copy()`                             | `copy.deepcopy(lst)`                        |
| Reference          | `ref` keyword                            | `lst2 = lst1`                               |
| Transfer ownership | `^` operator                             | N.A.                                        |

### Construct a list

There are two ways to construct a `List` in Mojo.

The first way is to use the **list literal** syntax, which is similar to
Python's list syntax. You write square brackets `[]` and separate the elements
with commas. There is one catch, which we will come back to in Section
[Arrays](#arrays): you have to say `List` somewhere, either in a type annotation
or with the constructor. Otherwise Mojo gives you an `Array` instead. For
example:

```mojo
# src/basic/composite/list_creation_from_literals.mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    var my_list_of_floats: List[Float64] = [0.125, 12.0, 12.625, -2.0, -12.0]
    var my_list_of_strings: List[String] = ["Mojo", "is", "awesome"]
    var my_list_of_list_of_integers: List[List[Int]] = [[1, 2], [3, 4], [5, 6]]

    print(my_list_of_integers)
    print(my_list_of_floats)
    print(my_list_of_strings)
    print(my_list_of_list_of_integers)
```

```output mojo
[1, 2, 3, 4, 5]
[0.125, 12.0, 12.625, -2.0, -12.0]
[Mojo, is, awesome]
[[1, 2], [3, 4], [5, 6]]
```

The second way is to use the ***list constructor***, `List()`, which similar to
Python's `list()` constructor. However, you **must** specify the type of the
elements in the list by using square brackets `[]` after the `List` keyword. For
example, we can re-write the previous example using the list constructor:

```mojo
# src/basic/composite/list_creation_with_constructor.mojo
def main():
    var my_list_of_integers = List[Int]([1, 2, 3, 4, 5])
    var my_list_of_floats = List[Float64]([0.125, 12.0, 12.625, -2.0, -12.0])
    var my_list_of_strings: List[String] = List[String](
        ["Mojo", "is", "awesome"]
    )
    var my_list_of_list_of_integers = List[List[Int]](
        [List[Int]([1, 2]), List[Int]([3, 4]), List[Int]([5, 6])]
    )

    print(my_list_of_integers)
    print(my_list_of_floats)
    print(my_list_of_strings)
    print(my_list_of_list_of_integers)
```

```output mojo
[1, 2, 3, 4, 5]
[0.125, 12.0, 12.625, -2.0, -12.0]
[Mojo, is, awesome]
[[1, 2], [3, 4], [5, 6]]
```

The first way is more concise and easier to read, but both ways are valid and
will produce the same result. You can choose either way depending on your
preference.

::: details `List()` constructor used to take variadic arguments

Before Mojo v0.26.1, the `List()` constructor used to take variadic arguments,
which means that you can pass the elements of the list directly as arguments to
the constructor without using square brackets `[]`. For example, you can create
a list of integers with `List[Int](1, 2, 3, 4, 5)`. However, this syntax is no
longer supported in the latest version of Mojo. You have to use square brackets
`[]` to pass the elements as a single argument to the constructor, like
`List[Int]([1, 2, 3, 4, 5])`.

In this sense, using the list literal syntax is more concise and easier to read
than using the `List()` constructor.

:::

::: tip A bare literal gives you an `Array`, not a `List`

Since **Mojo v1.0.0**, `var a = [1, 2, 3]` does not give you a `List[Int]`. It
gives you an `Array[Int, 3]`, a fixed-length container that lives on the stack.
To get a `List`, you have to say `List` somewhere: annotate the variable with
`List[Int]`, or call the constructor as `List[Int]([1, 2, 3])`.

Forget it and the compiler will tell you, usually at the moment you `append()`
to the value or pass it to a function that asks for a list:

```console
error: invalid call to 'changeit': value passed to 'some' cannot be converted
       from 'Array[Int, Int(5)]' to 'List[Int]'
```

Section [Arrays](#arrays) tells the whole story, and this is why every list
example in this chapter spells out its `List` annotation.

:::

### Copy and move a list

You can **deep copy** a `List` in Mojo by using the `copy()` method. This will
create a new `List` that contains the same elements as the original list.
However, all the elements in the new list are **independent copies** of the
elements in the original list. Thus, modifying an element in the new list will
not affect the corresponding element in the original list, and vice versa. For
example:

```mojo
# src/basic/composite/list_copy.mojo
def main():
    var lst1: List[List[Int]] = [[1, 2], [3, 4]]
    var lst2 = lst1.copy()
    print("Before modifying the copied list:")
    print("lst1 =", lst1)
    print("lst2 =", lst2)

    lst2[0][0] = 100
    print("After modifying the copied list:")
    print("lst1 =", lst1)
    print("lst2 =", lst2)
```

```output mojo
Before modifying the copied list:
lst1 = [[1, 2], [3, 4]]
lst2 = [[1, 2], [3, 4]]
After modifying the copied list:
lst1 = [[1, 2], [3, 4]]
lst2 = [[100, 2], [3, 4]]
```

This is different from Python, where `lst1.copy()` creates a shallow copy of the
list. In a shallow copy, the new list contains references to the same elements
as the original list. Thus, modifying an element in the new list will also
affect the corresponding element in the original list, and vice versa. For
example:

```python
# src/basic/composite/list_copy.py
def main():
    lst1 = [[1, 2], [3, 4]]
    lst2 = lst1.copy()
    print("Before modifying the copied list:")
    print("lst1 =", lst1)
    print("lst2 =", lst2)

    lst2[0][0] = 100
    print("After modifying the copied list:")
    print("lst1 =", lst1)
    print("lst2 =", lst2)


main()
```

```output python
Before modifying the copied list:
lst1 = [[1, 2], [3, 4]]
lst2 = [[1, 2], [3, 4]]
After modifying the copied list:
lst1 = [[100, 2], [3, 4]]
lst2 = [[100, 2], [3, 4]]
```

Thus, Mojo's `copy()` method creates a deep copy of the list, just like Python's
`copy.deepcopy()` function. Be aware of this difference.

---

You can **transfer the ownership** of a `List` in Mojo by using the `^`
operator. This will move the object (type, address, and value) from one variable
to another, leaving the original variable name in an invalid state. After the
transfer, you can only use the new variable name to access and modify the list.
Attempting to use the original variable name will result in a compile-time
error. For example:

```mojo
# src/basic/composite/list_move.mojo
def main():
    var lst1: List[List[Int]] = [[1, 2], [3, 4]]
    print("Before moving the list:")
    print("lst1 =", lst1)

    var lst2 = lst1^
    print("After moving the list:")
    print("lst2 =", lst2)

    # print("Attempting to access lst1 after move:")
    # print("lst1 =", lst1)
```

```output mojo
Before moving the list:
lst1 = [[1, 2], [3, 4]]
After moving the list:
lst2 = [[1, 2], [3, 4]]
```

Attempting to access `lst1` after the move (`print("lst1[0][0] =", lst1[0][0])`)
will generate a compile-time error. You can try to remove the `#` of the
commented lines in the above example to see the output:

```console
error: use of uninitialized value 'lst1'
    print("lst1 =", lst1)
         ^
```

---

As learnt in Chapter [Copy and move](../basic/copy), `List` is not implicitly
copyable in Mojo. This means that you cannot just use an equal sign `=` to
assign a `List` to another variable. For example, the following code will not
compile:

```mojo
# src/basic/composite/list_assignment_with_only_equal_sign.mojo
def main():
    var lst1 = [[1, 2], [3, 4]]
    var lst2 = lst1
    print("lst1 =", lst1)
    print("lst2 =", lst2)
```

This will generate a compile-time error:

```console
error: value of type 'List[List[Int]]' cannot be implicitly copied, it does not conform to 'ImplicitlyCopyable'
    lst2 = lst1
           ^~~~
```

To fix this, you can either use the `copy()` method to create a deep copy of the
list, or use the `^` operator to transfer the ownership of the list.

### Index or slice a list

You can retrieve the elements of a `List` in Mojo using **indexing**, just like
in Python. For example,

```mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    var first_element = my_list_of_integers[0]  # Accessing the first element
    var last_element = my_list_of_integers[len(my_list_of_integers) - 1]  # The last element
    print("First element:", first_element)
    print("Last element:", last_element)
```

```output mojo
First element: 1
Last element: 5
```

Notice how we asked for the last element. Python would let us write
`my_list_of_integers[-1]`, but **Mojo does not support negative indices**. You
can run the following example to see what will happen.

::: code-group

```mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    var last_element = my_list_of_integers[-1]  # The last element
    print("Last element:", last_element)
```

```python
def main():
    my_list_of_integers = [1, 2, 3, 4, 5]
    last_element = my_list_of_integers[-1]  # The last element
    print("Last element:", last_element)

main()
```

:::

The compiler stops you with a message that tells you what to write instead:

```console
constraint failed: negative indexing is not supported, use e.g. `x[len(x) - 1]`
```

An index that is too large is caught as well, but at run time rather than at
compile time. Try to run the following example:

::: code-group

```mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    var tenth_element = my_list_of_integers[9]  # The thenth element
    print("Tenth element:", tenth_element)
```

```python
def main():
    my_list_of_integers = [1, 2, 3, 4, 5]
    tenth_element = my_list_of_integers[9]  # The thenth element
    print("Tenth element:", tenth_element)

main()
```

:::

Asking `my_list_of_integers[9]` of a five-element list stops the program with
a message that names the line you wrote:

```console
Assert Error: index 9 is out of bounds, valid range is 0 to 4
```

::: details History: lists did not always check bounds

Before Mojo v1.0.0, a list did not look at the index you handed it. The program
below ran without complaint and printed a number:

```mojo
def main():
    var lst: List[Int] = [1, 2, 3, 4, 5]
    ref item = lst[10]
    print("Item at index 10:", item)
    item += 100
    print("Modified item at index 10:", item)
```

Mojo simply walked ten `Int`s past the first element and read whatever was lying
there. That memory belonged to something else, and the `item += 100` on the next
line wrote into it. To get the checks you had to ask for them yourself, with
`mojo run -D ASSERT=all`.

Mojo v1.0.0 turned the checks on by default, and dropping negative indices is
what made them cheap enough to leave on. The two changes came together.

You can still turn them off with `-D ASSERT=none` if you have measured that a
hot loop pays for them, but that puts you back in the world above. On the GPU
the checks are off by default for speed; `-D ASSERT=all` switches them on there.

:::

---

You can also **slice** an existing `List`, just like in Python. However, list
slicing returns a `Span` type, which is a view of the original list. A "view"
means that it looks into the same memory location as the original list, which is
a "cheap" way to access a portion of the list without copying the elements.
Modifying the elements in the sliced view will also modify the corresponding
elements in the original list, and vice versa.

You can convert a `Span` to a `List` by using the `List()` constructor. Note
that the new list is independent of the original list, and modifying the
elements in the new list will not affect the corresponding elements in the
original list, and vice versa. For example,

```mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    var sliced_list_as_view = my_list_of_integers[0:3]  # Slicing the first three elements as view
    var sliced_list_as_copy = List(sliced_list_as_view)  # Converting the view to a new list
```

::: danger A slice must be in range

Python is forgiving about slices. `lst[0:100]` on a five-element list quietly
gives you the five elements it has, and `lst[:-1]` quietly means "all but the
last". Since **Mojo v1.0.0**, neither of these guesses is made: an invalid slice
**aborts your program**.

For a slice `[start:end]` to be valid, both `start` and `end` must lie between
`0` and `len(lst) - 1`, and `start` must not be greater than `end`.

```mojo
var lst: List[Int] = [1, 2, 3]
_ = lst[0:100]  # Aborts. Python would have given you [1, 2, 3].
_ = lst[3:1]    # Aborts. `start` is greater than `end`.
_ = lst[:-1]    # Aborts. There are no negative indices.
```

The Python idiom "all but the last element" therefore has to spell out its end
index. And take care with the empty list, because `lst[0 : len(lst) - 1]`
becomes `lst[0:-1]` when the list is empty, which aborts:

```mojo
var all_but_last = lst[: max(len(lst) - 1, 0)]
```

:::

### Extend or concat a list

You can **append** elements to the end of a `List` in Mojo using the `append()`
method, just like in Python. For example,

```mojo
def main():
    var my_list_of_integers: List[Int] = [1, 2, 3, 4, 5]
    my_list_of_integers.append(6)  # Appending a new element
# my_list_of_integers = [1, 2, 3, 4, 5, 6]
```

You can use the `+` operator to concatenate two `List` objects, just like in
Python. For example:

```mojo
def main():
    var first_list: List[Int] = [1, 2, 3]
    var second_list: List[Int] = [4, 5, 6]
    var concatenated_list = first_list + second_list  # Concatenating two lists
# concatenated_list = [1, 2, 3, 4, 5, 6]
```

### Iterate over a list

We can iterate over a `List` in Mojo using the `for ... in` keywords. This is
similar to how we iterate over a list in Python. See the following example:

::: code-group

```mojo
# src/basic/composite/list_iteration.mojo
def main():
    var my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
```

```output mojo
1 2 3 4 5
```

```python
def main():
    my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
main()
```

```output python
1 2 3 4 5
```

:::

As a Pythonista, you may find this syntax very familiar. Actually, the above
example is **completely identical** to how we iterate over a list in Python.

---

Still, there are some differences between Mojo's `List` and Python's `list` when
it comes to iteration. The difference allows you to write some fancy code in
Mojo that is not possible in Python.

The trick is about the local variable `i` in the for-loop. In Mojo, `i` is a
**immutable reference** to the element in the list, not a copy of the element.
We have already discussed the concept of reference in Chapter
[Functions](../basic/functions). In short, a reference is just an alias of the
variable it refers to. They have the same type, same memory address, and share
the same value. You can use the reference directly without de-referencing it. By
saying "immutable", we mean that you cannot change the value of the reference.
This may protect you from accidentally modifying the original element in the
list.

If you, however, want to change the value of the reference, you can use the
`ref` keyword before `i` in the for-loop statement. This will make `i` a
**mutable reference** to the element in the list, allowing you to change its
value. For example, in the following code, we change the elements of the list by
adding 1 to each element.

::: code-group

```mojo
# src/basic/composite/list_iteration_with_modification.mojo
def main():
    var my_list = [1, 2, 3, 4, 5]

    # Change the elements of the list using a for loop
    for ref i in my_list:
        i = i + 1

    # Print the modified list
    for i in my_list:
        print(i, end=" ")
```

```output mojo
2 3 4 5 6
```

:::

Note that we use `ref` before `i` in the `for ref i in my_list:` to make `i` a
mutable reference to the element in the list. If you forget to use `ref`, you
will get an error message because you are trying to modify the value via an
immutable reference. The error message will look like this:

```console
error: expression must be mutable in assignment
        i = i + 1
        ^
```

Now let's translate the above code into Python. You will find that it does not
work as expected:

::: code-group

```python
# src/basic/composite/list_iteration_with_modification.py
def main():
    my_list = [1, 2, 3, 4, 5]

    # Change teh variable i inside the loop
    for i in my_list:
        i = i + 1

    # Print the list
    for i in my_list:
        print(i, end=" ")

main()
```

```output python
1 2 3 4 5
```

:::

The output is still `1 2 3 4 5`, which is the original list. This is because in
Python, `i` is a copy of the element in the list, not a reference to it. When
you change `i`, you are only changing the copy, not the original element in the
list. Thus, the original list remains unchanged.

---

Returning a reference instead of a copy of the value makes Mojo's iteration more
memory-efficient. Imagine that you want to read a list of books in a library.
You can either:

- Ask the administrator to copy these books and give your the copies.
- Ask the administrator to give you the locations of these books, and you go to
  the corresponding shelves to read them.

In the first case, you will have to pay for the cost of copying the books and
you have to wait for the copies to be made. In the second case, you can read the
books directly without any extra cost.

The same applies to when you want to write something new into the books. In
Python, you have to copy the book, make changes to the copy, and the replace the
original book with the modified copy. In contrast, in Mojo, you can directly
modify the book on the shelf without copying it. This is more efficient in terms
of memory usage and performance.

As a Pythonista, I always try to avoid using iteration in Python because it is
too slow. Some third-party libraries, such as NumPy, provide optimized functions
to perform operations on arrays or matrices without using Python's built-in
iteration. Nevertheless, the gain in performance can still be neutralized by the
overhead of Python's loop if you still have to iterate over some objects in your
code. In Mojo, however, we will never need to worry about the performance of
iteration. Just be brave to iterate!

::: info List iteration before Mojo v25.4

Before Mojo v25.4, the iteration over a `List` in Mojo would return
**a pointer to the address of the element** instead of the reference to the
element. You have to de-reference it to get the actual value of the element. The
de-referencing is done by using the `[]` operator. See the following example:

```mojo
# src/basic/composite/list_iteration_before_mojo_v25d4.mojo
# This code is valid until Mojo v25.3
# It will not compile in Mojo v25.4 and later versions.
def main():
    var my_list: List[Int] = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i[], end=" ")  # De-referencing the element to get its value
```

If you forget the `[]` operator, you will get an error message because you are
trying to print the pointer to the element instead of the element itself.

```console
error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
        print(i,  end=" ")
        ~~~~~^~~~~~~~~~~~~
```

From Mojo v25.4 onwards, the iteration over a `List` will return a reference to
the element instead of a pointer. You can directly use the element without
de-referencing it.

For the difference between a pointer and a reference, please refer to Chapter
[Reference system](../advanced/references#references-are-not-pointers) and
Chapter [Ownership](../advanced/ownership#four-statuses-of-ownership).

:::

### Print a list

You can print a `List` object directly with the built-in `print()` function, and
since **Mojo v1.0.0** the output looks exactly like Python's:

::: code-group

```mojo
# src/basic/composite/list_printing.mojo
def main():
    var my_list_of_floats: List[Float64] = [0.125, 12.0, 12.625, -2.0, -12.0]
    var my_list_of_strings: List[String] = ["Mojo", "is", "awesome"]
    print(my_list_of_floats)
    print(my_list_of_strings)
```

```output mojo
[0.125, 12.0, 12.625, -2.0, -12.0]
[Mojo, is, awesome]
```

```python
# src/basic/composite/list_printing.py
def main():
    my_list_of_floats = [0.125, 12.0, 12.625, -2.0, -12.0]
    my_list_of_strings = ["Mojo", "is", "awesome"]
    print(my_list_of_floats)
    print(my_list_of_strings)

main()
```

```output python
[0.125, 12.0, 12.625, -2.0, -12.0]
['Mojo', 'is', 'awesome']
```

:::

The one difference is in the strings: Mojo prints them bare, Python puts them in
quotes.

::: details How printing a list got here

It took Mojo three tries.

Before **v0.26.1**, you could not print a list at all:

```console
error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
    print("Input array:", array)
    ~~~~~^~~~~~~~~~~~~~~~~~~~~~~
```

From v0.26.1 you could, but the output named the full type of every element:

```console
[SIMD[DType.float64, 1](0.125), SIMD[DType.float64, 1](12.0), ...]
```

which is informative and unreadable in equal measure. So tutorials, including
earlier versions of this Miji, defined little helper functions to print a list
in Python's style:

```mojo
def print_list_of_floats(array: List[Float64]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")
```

Since **v1.0.0** you no longer need them. If you meet such a helper in older
Mojo code, this is what it was for.

:::

### List comprehension

Mojo supports list comprehension syntax, which allows you to create a new list
by iterating over an iterator in a single line. The syntax is similar to
Python's list comprehension syntax. Note that a comprehension always gives you a
`List`, not an `Array`: its length is not known until the program runs. For
example, you can create a list containing the squares of the numbers from 0 to 9
using list comprehension:

```mojo
def main():
    var my_list = [i**2 for i in range(10)]
    for i in my_list:
        print(i, end=", ")
```

```output
0, 1, 4, 9, 16, 25, 36, 49, 64, 81,
```

A general syntax of list comprehension in Mojo is

```mojo
[expression(item) for item in iterable if condition]
```

where `expression(item)` is an expression computed for an `item` that is
sequentially taken out from an iterable. You can also add an optional
`if condition` to filter the items in the iterable. In fact, such a list
comprehension is the shortened version (a syntax sugar) of the following code:

```mojo
lst = List[Type]()
for item in iterable:
    if condition:
        lst.append(expression(item))
```

For example, the following code creates the same lists from a list comprehension
and a full syntax:

```mojo
def main():
    var lst1 = [i * 2 for i in range(10) if i % 2 == 0]

    var lst2 = List[Int]()
    for i in range(10):
        if i % 2 == 0:
            lst2.append(i * 2)

    print("List Comprehension:")
    for i in lst1:
        print(i, end=", ")
    print("\nFull Syntax:")
    for i in lst2:
        print(i, end=", ")
```

```output
List Comprehension:
0, 4, 8, 12, 16, 
Full Syntax:
0, 4, 8, 12, 16, 
```

---

You can also use list comprehension with multiple iterations. For example, you
can generate a list of concatenated strings by permuting three lists:

::: code-group

```mojo
# src/basic/composite/list_comprehension_permutations.mojo
def main():
    var lst1 = ["a", "b", "c"]
    var lst2 = ["i", "j", "k"]
    var lst3 = ["x", "y", "z"]

    var lst4 = [i + j + k for i in lst1 for j in lst2 for k in lst3]

    for item in lst4:
        print(item, end=", ")
```

```output mojo
aix, aiy, aiz, ajx, ajy, ajz, akx, aky, akz, bix, biy, biz, bjx, bjy, bjz, bkx, bky, bkz, cix, ciy, ciz, cjx, cjy, cjz, ckx, cky, ckz, 
```

```python
# src/basic/composite/list_comprehension_permutations.py
def main():
    lst1 = ["a", "b", "c"]
    lst2 = ["i", "j", "k"]
    lst3 = ["x", "y", "z"]

    lst4 = [i + j + k for i in lst1 for j in lst2 for k in lst3]

    for item in lst4:
        print(item, end=", ")


main()
```

```output python
aix, aiy, aiz, ajx, ajy, ajz, akx, aky, akz, bix, biy, biz, bjx, bjy, bjz, bkx, bky, bkz, cix, ciy, ciz, cjx, cjy, cjz, ckx, cky, ckz, 
```

:::

---

In Python, list comprehension is also a compact way to print the items of an
iterable. Since **Mojo v1.0.0**, this works in Mojo too.

Recall that the `print()` function implicitly returns a `None` value, which
means that a call to it is also a valid expression. Thus, you can put `print()`
inside a list comprehension. For example, you can print the third power of the
numbers from 0 to 9 like this:

::: code-group

```mojo
# src/basic/composite/list_comprehension_print.mojo
def main():
    _ = [print(i**3, end=", ") for i in range(10)]
```

```output mojo
0, 1, 8, 27, 64, 125, 216, 343, 512, 729,
```

```python
# src/basic/composite/list_comprehension_print.py
def main():
    _ = [print(i**3, end=", ") for i in range(10)]

main()
```

```output python
0, 1, 8, 27, 64, 125, 216, 343, 512, 729,
```

:::

The underscore `_` says that we are throwing the resulting list away; we only
wanted the printing. Do not make a habit of it, though. A plain `for` loop says
the same thing more honestly, in both languages.

### Memory layout of List type

A Mojo `List` is actually a structure that contains three fields:

- A pointer type `_data` that points to a continuous block of memory on the heap
  that stores the elements of the list contiguously.
- A integer type `_len` which stores the number of elements in the list.
- A integer type `capacity` which represents the maximum number of elements that
  can be stored in the list without reallocating memory. When `capacity` is
  larger than `_len`, it means that the memory space is allocated but is not
  fully used. This enable you to append a few new elements to the list without
  reallocating memory. If you append more elements than the current capacity,
  the list will request another block of memory on the heap with a larger
  capacity, copy the existing elements to the new block, and then append the new
  elements. Since Mojo v1.0.0 you read it with the method `capacity()` rather
  than the field `capacity`.

Let's take a closer look at how a Mojo `List` is stored in the memory with a
simple example: The code below creates a `List` of `UInt8` numbers representing
the ASCII code of 5 letters. We can use the `chr()` function to convert them
into characters and print them out to see what they mean.

```mojo
def main():
    var me: List[UInt8] = [89, 117, 104, 97, 111]
    print(me.capacity())
    for i in me:
        print(chr(Int(i)), end="")
```

```output mojo
5
Yuhao
```

When you create a `List` with `List[UInt8]([89, 117, 104, 97, 111])`, Mojo will
first allocate a continuous block of memory on **stack** to store the three
fields (`_data: Pointer`, `_len: Int` and `capacity: Int`, each of which is 8
bytes long on a 64-bit system. Because we passed 5 elements to the `List`
constructor, the `_len` field will be set to 5, and the `capacity` field will
also be set to 5 (default setting, `capacity = _len`).

Then Mojo will allocate a continuous block of memory on **heap** to store the
actual values of the elements of the list, which is 1 bytes (8 bits) for each
`UInt8` element, equaling to 5 bytes in total for 5 elements. The `_data` field
will then store the address of the first byte in this block of memory.

The following figure illustrates how the `List` is stored in the memory. You can
see that a continuous block of memory on the heap (from the address `17ca81f8`
to `17ca81a2`) stores the actual values of the elements of the list. Each
element is a `UInt8` value, and thus is of 1 byte long. The data field on the
stack store the address of the first byte of the block of memory on the heap,
which is `17ca81f8`.

```console
# Mojo Miji - Data types - List in memory

        local variable `me: List[UInt8] = [89, 117, 104, 97, 111]`
            ↓  (meta data on stack)
        ┌────────────────┬────────────┬────────────┐
Field   │ _data          │ _len       │ capacity   │
        ├────────────────┼────────────┼────────────┤
Type    │ Pointer[UInt8] │  Int       │     Int    │
        ├────────────────┼────────────┼────────────┤
Value   │   17ca81f8     │     5      │     5      │
        ├────────────────┼────────────┼────────────┤
Address │   26c6a89a     │  26c6a8a2  │  26c6a8aa  │
        └────────────────┴────────────┴────────────┘
            │
            ↓ (points to a continuous memory block on heap that stores the list elements)
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  89    │  117   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
```

Now we try to see what happens when we use list indexing to get a specific
element from the list, for example, `me[0]`. Mojo will first check the `_len`
field to see if the index is valid (i.e., `0 <= index < me._len`). If it is
valid, Mojo will then calculate the address of the element by adding the index
to the address stored in the `_data` field. In this case, it will return the
address of the first byte of the block of memory on the heap, which is
`17ca81f8`. Then Mojo will de-reference this address to get the value of the
element, which is `89` in this case.

If we try `me[2]`, Mojo will calculate address by adding `2` to the address
stored in the `_data` field, which is `17ca81f8 + 2 = 17ca81fa`. Then Mojo will
de-reference this address to get the value of the element, which is `104` in
this case.

::: info Index or offset?

You may find that the index starting from `0` in Python or Mojo is a little bit
strange. But it will be intuitive if you look at the example above: The index of
an element in a list is actually the offset from the address of the first
element. When you think of the index as an offset, it will make more sense.
Thus, in this Miji, I will sometimes use the term "offset" to refer to the index
within the brackets `[]`.

:::

::: tip Memory layout of a list in Python and Mojo

In Mojo, the values of the elements of a list is stored consecutively on the
heap. In Python, the pointers to the elements of a list is stored consecutively
on the heap, while the actual values of the elements are stored in separate
memory locations. This means that a Mojo's list is more memory-efficient than a
Python's list, as it does not require additional dereferencing to access the
values of the elements.

If you are interested in the difference between the the memory layout of a list
in Python and Mojo, you can refer to Chapter
[Memory Layout of Mojo objects](../misc/layout.md) for more details, where I use
abstract diagrams to compare the memory layouts of a list in Python and Mojo.

:::

## Arrays

An `Array` is the other sequence type that you will meet constantly in Mojo.
Since **Mojo v1.0.0** it is also the one that you get by default, because a bare
list literal now builds an `Array` rather than a `List`:

```mojo
def main():
    var a = [1, 2, 3]
    # type of `a` is Array[Int, 3], not List[Int]
```

This may surprise Pythonistas, so it is worth a moment. A `List` lives on the
heap and can grow. That is the right thing for Python's `list`, but it means
that every literal you write costs a heap allocation, even a tiny fixed one like
`[1, 2, 3]` which you will never modify it later. An `Array`, on contrary, lives
on the stack and its length is fixed at compile time. It costs nothing to
create, and for a literal, whose length the compiler can plainly see, that is
usually what you actually wanted. So Mojo made it the default.

Note that the length is part of the type, not a value stored in the object.
`Array[Int, 3]` and `Array[Int, 4]` are two different types, in the same way
that `Int8` and `Int16` are two different types. This is also why an `Array`
cannot grow: growing it would mean changing its type, and a variable cannot
change its type halfway through a program.

|                            | `Array[Int, 3]`       | `List[Int]`         |
| -------------------------- | --------------------- | ------------------- |
| Closest Python relative    | `tuple` of one type   | `list`              |
| Where it lives             | Stack                 | Heap                |
| Length                     | Fixed at compile time | Grows and shrinks   |
| Length is part of the type | Yes                   | No                  |
| `append()`, `pop()`        | No                    | Yes                 |
| Cost to create             | Free                  | One heap allocation |
| What `[1, 2, 3]` gives you | This one              | Only if you ask     |

### Construct an array

You get an `Array` by writing a list literal and saying nothing about the type.
If you prefer to be explicit, you can annotate the variable with both
parameters, the element type and the length:

```mojo
def main():
    var a = [1, 2, 3]                       # Array[Int, 3], inferred
    var b: Array[Int, 3] = [1, 2, 3]        # The same type, spelled out
    var c: Array[Float64, 3] = [1, 2, 3]    # Elements are converted to Float64
    print(a, "\n", b, "\n", c, sep="")
```

```output mojo
[1, 2, 3]
[1, 2, 3]
[1.0, 2.0, 3.0]
```

To get a `List` instead, ask for one. Any of these work:

```mojo
def main():
    var a: List[Int] = [1, 2, 3]     # Annotate the element type
    var b: List = [1.0, 2.0, 3.0]    # Or let the elements speak for themselves
    var c: List[_] = [1, 2, 3]       # Same thing, with an explicit hole
    var d = List[Int]([1, 2, 3])     # Or use the constructor
    print(a, "\n", b, "\n", c, "\n", d, sep="")
```

```output mojo
[1, 2, 3]
[1.0, 2.0, 3.0]
[1, 2, 3]
[1, 2, 3]
```

::: tip When does it matter?

Less often than you would think. `Array` supports `len()`, indexing, and `for`
loops, so many examples in this Miji would work either way. It bites you in
exactly two places: when you want to `append()` to it, and when you pass it to a
function that asks for a `List[Int]`:

```console
error: invalid call to 'changeit': value passed to 'some' cannot be converted
       from 'Array[Int, Int(5)]' to 'List[Int]'
```

If you see that message, you forgot the annotation.

In most use cases, we just need a fixed-sized list, then the `Array` type is
sufficient, and it is more efficient too. Only if you really need some dynamic
features of `List`, you add a type annotation to force a list constructor.

:::

::: details `InlineArray` was renamed to `Array`

The `Array` type is not new. Until v1.0.0 it was called `InlineArray`, its
element-type parameter was `ElementType` rather than `T`, and its length
parameter was `size` rather than `length`. So
`InlineArray[ElementType=Int, size=3]` is today's `Array[T=Int, length=3]`. The
old name still works for now, as a `comptime` alias.

:::

### Memory layout of Array type

In the previous section, we saw that a `List` is a three-field structure on the
stack (`_data`, `_len`, and `capacity`) that points to a block of memory on the
heap. An `Array` is simpler than that: it has no fields at all besides the
elements themselves. The elements are stored **inline**, one after another,
right where the variable lives. Hence its former name, `InlineArray`.

Let's use the same five letters as before, but this time in an `Array`:

```mojo
def main():
    var me: Array[UInt8, 5] = [89, 117, 104, 97, 111]
    for i in me:
        print(chr(Int(i)), end="")
```

```output mojo
Yuhao
```

There is no `capacity()` to print, because there is nothing to print: an
`Array[UInt8, 5]` holds exactly five elements, no more and no fewer, and the
compiler knows this without asking the object. The whole value is 5 bytes long
and it sits on the stack:

```console
# Mojo Miji - Data types - Array in memory

        local variable `me: Array[UInt8, 5] = [89, 117, 104, 97, 111]`
            ↓  (the elements themselves, on stack, nothing on heap)
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  89    │  117   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │26c6a89a│26c6a89b│26c6a89c│26c6a89d│26c6a89e│
        └────────┴────────┴────────┴────────┴────────┘
```

Compare this with the figure of the `List` in the previous section and you will
see three differences:

1. There is no metadata. The `List` spends 24 bytes on stack on its three
   fields, before storing a single element. The `Array` spends nothing.
2. There is no heap block, and thus no allocation when the value is created and
   no de-allocation when it goes out of scope.
3. There is one fewer hop to reach an element. Indexing a `List` means reading
   the `_data` field and then de-referencing it. Indexing an `Array` means going
   straight to the address of the value plus the offset, because the elements
   are the value.

This is what "costs nothing to create" means in the table above. It is also what
you give up: the length is baked into the type, so the array can never grow, and
a large array is a large value that gets copied around by value rather than a
small handle to a heap block. Use an `Array` when you know the length at compile
time and it is small; use a `List` when you do not, or when it is not.

::: info Stack, heap, and which to choose

If the words "stack" and "heap" are not yet familiar, Chapter
[Memory Layout of Mojo objects](../misc/layout.md) walks through them with
diagrams. The short version: the stack is fast, automatically cleaned up, and
limited in size, so it suits small values whose size is known while compiling;
the heap is flexible and larger, at the cost of an allocation, so it suits
values that grow.

:::

## Dictionaries

A `Dict` (dictionary) is a mutable, variable-length composite data type that is
used to store a collection of key-value pairs. You can think of it as a
real-world dictionary, where each key is a word and each value is the definition
of that word. You can use the word (key) to look up the definition (value) in
the dictionary. In a real-world dictionary, the words are unique, and each word
has only one definition. Similarly, in a `Dict`, the keys are unique, and each
key has only one value associated with it.

Mojo's `Dict` type is similar to Python's `dict` type, Rust's `HashMap` type,
C#'s `HashTable` type, or C++'s `std::unordered_map` type. Compared to Python's
`dict`, the keys and values in a Mojo's `Dict` must be **of the same type**. In
Python, the keys can be of any type as long as they can be hashable, while the
values can also be of any type.

The table below compares Mojo's `Dict` with Python's `dict`:

| Functionality      | Mojo `Dict`                  | Python `dict`                         |
| ------------------ | ---------------------------- | ------------------------------------- |
| Type of elements   | Homogeneous type             | Heterogenous types                    |
| Mutability         | Mutable                      | Mutable                               |
| Initialization     | `Dict[Type, Type]()` or `{}` | `dict()` or `{}`                      |
| Unique keys        | Yes                          | Yes                                   |
| Unique values      | No                           | No                                    |
| Key-value mapping  | Many-to-one mapping          | Many-to-one mapping                   |
| Ordered            | No                           | Yes (>= Python 3.7)                   |
| Indexing           | Use brackets `[key]`         | Use brackets `[key]`                  |
| Slicing            | No                           | No                                    |
| Extending by items | Use `update()`               | Use `update()`                        |
| Extending by dicts | Use `update()`               | Use `update()`                        |
| Printing           | Use `print()`                | Use `print()`                         |
| Iterating          | Use `for` loop to get keys   | Use `for` loop to get key-value pairs |
| Iterator returns   | Reference to element         | Copy of element                       |
| Shallow copy       | N.A.                         | `dct.copy()` or `copy.copy(dct)`      |
| Deep copy          | `dct.copy()`                 | `copy.deepcopy(dct)`                  |
| Reference          | `ref` keyword                | `dct2 = dct1`                         |
| Transfer ownership | `^` operator                 | N.A.                                  |

## Main changes in this chapter

- 2025-09-25: Update to accommodate the changes in Mojo v0.25.6.
- 2026-02-28: Update to accommodate the changes in Mojo v0.26.1.
- 2026-08-19: Update to accommodate the changes in Mojo v1.0.0. A list literal
  now builds an `Array` instead of a `List`, so a section "List or Array?" is
  added and every example spells out its `List` annotation. Negative indices are
  gone, an out-of-range slice now aborts, `capacity` became a method, and list
  comprehension with `print()` now works.
- 2026-08-21: Remove the warning that lists are unchecked. Since Mojo v1.0.0 an
  out-of-range index stops the program, so the old warning is kept as a history
  note under Section [Index or slice a list](#index-or-slice-a-list).
- 2026-08-21: Move the printed output of nine examples out of separate `console`
  blocks and into the output panel of the code above them, so that the page
  already looks the way it does after you press Run.
- 2026-08-21: Give each tab of a code group its own output. The Python tabs of
  Section [Print a list](#print-a-list),
  [List comprehension](#list-comprehension) now show what Python prints, next to
  what Mojo prints.
- 2026-08-21: Promote `Array` to its own section, [Arrays](#arrays), which now
  sits between the lists and the dictionaries and carries the comparison with
  `List`, the ways to construct an array, and a memory-layout figure of its own.
  The subsection "List or Array?" is replaced by a short pointer under Section
  [Construct a list](#construct-a-list).
