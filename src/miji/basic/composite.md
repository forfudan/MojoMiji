# Composite data types

> Human beings are merely containers of atoms.  
> -- Yuhao Zhu, *Gate of Heaven*

In this chapter, we continue to learn about the composite data types in Mojo. Composite data types are data types that can hold multiple values of the same or different types. They are also known as **compound types** or **collection types**.

[[toc]]

## Lists

In Mojo, a `List` is a mutable, variable-length sequence that can hold a collection of elements of the ***same type***. It is similar to Rust's `Vec` type, but it is different from Python's `list` type that can hold objects of **any type**. Here are some key differences between Python's `list` and Mojo's `List`:

| Functionality      | Mojo `List`            | Python `list`                               |
| ------------------ | ---------------------- | ------------------------------------------- |
| Type of elements   | Homogeneous type       | Heterogenous types                          |
| Mutability         | Mutable                | Mutable                                     |
| Inialization       | `List[Type]()` or `[]` | `list()` or `[]`                            |
| Indexing           | Use brackets `[]`      | Use brackets `[]`                           |
| Slicing            | Use brackets `[a:b:c]` | Use brackets `[a:b:c]`                      |
| Extending by items | Use `append()`         | Use `append()`                              |
| Concatenation      | Use `+` operator       | Use `+` operator                            |
| Printing           | Not supported          | Use `print()`                               |
| Iterating          | Use `for` loop         | Use `for` loop                              |
| Iterator returns   | Reference to element   | Copy of element                             |
| List comprehension | Partially supported    | Supported                                   |
| Memory layout      | Metadata -> Elements   | Pointer -> metadata -> Pointers -> Elements |

### Construct a list

There are two ways to construct a `List` in Mojo.

The first way is to use the **list literal** syntax, which is similar to Python's list syntax. You can create a `List` by using square brackets `[]` and separating the elements with commas. For example, the following code will successfully create a list of integers, floats, strings, and even lists:

```mojo
# src/basic/types/list_creation_from_literals.mojo
def main():
    my_list_of_integers = [1, 2, 3, 4, 5]
    var my_list_of_floats: List[Float64] = [0.125, 12.0, 12.625, -2.0, -12.0]
    var my_list_of_strings: List[String] = ["Mojo", "is", "awesome"]
    var my_list_of_list_of_integers: List[List[Int]] = [[1, 2], [3, 4], [5, 6]]

    print(my_list_of_integers[0])
    print(my_list_of_floats[0])
    print(my_list_of_strings[0])
    print(my_list_of_list_of_integers[0][0])
```

The second way is to use the ***list constructor***, which is a special method that initializes a new instance of the `List` type. The list constructor takes a variable number of arguments, which are the elements of the list. You **must** specify the type of the elements in the list by using square brackets `[]` after the `List` keyword. For example, we can re-write the previous example using the list constructor:

```mojo
# src/basic/types/list_creation_with_constructor.mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    var my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    var my_list_of_strings: List[String] = List[String]("Mojo", "is", "awesome")
    var my_list_of_list_of_integers = List[List[Int]](
        List[Int](1, 2), List[Int](3, 4), [5, 6]
    )

    print(my_list_of_integers[0])
    print(my_list_of_floats[0])
    print(my_list_of_strings[0])
    print(my_list_of_list_of_integers[0][0])
```

The first way is more concise and easier to read, while the second way is more explicit since you have to specify the type of the elements in the list. Both ways are valid and will produce the same result. You can choose either way depending on your preference.

### Index or slice a list

You can retrieve the elements of a `List` in Mojo using **indexing**, just like in Python. For example, you can access the first element of `my_list_of_integers` with `my_list_of_integers[0]`.

You can create another `List` by **slicing** an existing `List`, just like in Python. For example, you can create a new list that contains the first three elements of `my_list_of_integers` with `my_list_of_integers[0:3]`.

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    first_element = my_list_of_integers[0]  # Accessing the first element
    sliced_list = my_list_of_integers[0:3]  # Slicing the first three elements
```

### Extend or concat a list

You can **append** elements to the end of a `List` in Mojo using the `append()` method, just like in Python. For example,

```mojo
def main():
    my_list_of_integers = List[Int](1, 2, 3, 4, 5)
    my_list_of_integers.append(6)  # Appending a new element
# my_list_of_integers = [1, 2, 3, 4, 5, 6]
```

You can use the `+` operator to concatenate two `List` objects, just like in Python. For example:

```mojo
def main():
    first_list = List[Int](1, 2, 3)
    second_list = List[Int](4, 5, 6)
    concatenated_list = first_list + second_list  # Concatenating two lists
# concatenated_list = [1, 2, 3, 4, 5, 6]
```

### Iterate over a list

We can iterate over a `List` in Mojo using the `for ... in` keywords. This is similar to how we iterate over a list in Python. See the following example:

::: code-group

```mojo
# src/basic/types/list_iteration.mojo
def main():
    my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
# Output: 1 2 3 4 5
```

```python
def main():
    my_list = [1, 2, 3, 4, 5]
    for i in my_list:
        print(i, end=" ")
main()
# Output: 1 2 3 4 5
```

:::

As a Pythonista, you may find this syntax very familiar. Actually, the above example is **completely identical** to how we iterate over a list in Python.

---

Still, there are some differences between Mojo's `List` and Python's `list` when it comes to iteration. The difference allows you to write some fancy code in Mojo that is not possible in Python.

The trick is about the local variable `i` in the for-loop. In Mojo, `i` is a **immutable reference** to the element in the list, not a copy of the element. We have already discussed the concept of reference in Chapter [Functions](../basic/functions). In short, a reference is just an alias of the variable it refers to. They have the same type, same memory address, and share the same value. You can use the reference directly without de-referencing it. By saying "immutable", we mean that you cannot change the value of the reference. This may protect you from accidentally modifying the original element in the list.

If you, however, want to change the value of the reference, you can use the `ref` keyword before `i` in the for-loop statement. This will make `i` a **mutable reference** to the element in the list, allowing you to change its value. For example, in the following code, we change the elements of the list by adding 1 to each element.

::: code-group

```mojo
# src/basic/types/list_iteration_with_modification.mojo
def main():
    my_list = [1, 2, 3, 4, 5]

    # Change the elements of the list using a for loop
    for ref i in my_list:
        i = i + 1

    # Print the modified list
    for i in my_list:
        print(i, end=" ")
```

:::

The code runs successfully and prints the modified list:

```console
2 3 4 5 6
```

Note that we use `ref` before `i` in the `for ref i in my_list:` to make `i` a mutable reference to the element in the list. If you forget to use `ref`, you will get an error message because you are trying to modify the value via an immutable reference. The error message will look like this:

```console
error: expression must be mutable in assignment
        i = i + 1
        ^
```

Now let's translate the above code into Python. You will find that it does not work as expected:

::: code-group

```python
# src/basic/types/list_iteration_with_modification.py
def main():
    my_list = [1, 2, 3, 4, 5]

    # Change teh variable i inside the loop
    for i in my_list:
        i = i + 1

    # Print the list
    for i in my_list:
        print(i, end=" ")  # Output: 1 2 3 4 5

main()
```

:::

The output is still `1 2 3 4 5`, which is the original list. This is because in Python, `i` is a copy of the element in the list, not a reference to it. When you change `i`, you are only changing the copy, not the original element in the list. Thus, the original list remains unchanged.

---

Returning a reference instead of a copy of the value makes Mojo's iteration more memory-efficient. Imagine that you want to read a list of books in a library. You can either:

- Ask the administrator to copy these books and give your the copies.
- Ask the administrator to give you the locations of these books, and you go to the corresponding shelves to read them.

In the first case, you will have to pay for the cost of copying the books and you have to wait for the copies to be made. In the second case, you can read the books directly without any extra cost.

The same applies to when you want to write something new into the books. In Python, you have to copy the book, make changes to the copy, and the replace the original book with the modified copy. In contrast, in Mojo, you can directly modify the book on the shelf without copying it. This is more efficient in terms of memory usage and performance.

As a Pythonista, I always try to avoid using iteration in Python because it is too slow. Some third-party libraries, such as NumPy, provide optimized functions to perform operations on arrays or matrices without using Python's built-in iteration. Nevertheless, the gain in performance can still be neutralized by the overhead of Python's loop if you still have to iterate over some objects in your code. In Mojo, however, we will never need to worry about the performance of iteration. Just be brave to iterate!

::: info List iteration before Mojo v25.4

Before Mojo v25.4, the iteration over a `List` in Mojo would return **a pointer to the address of the element** instead of the reference to the element. You have to de-reference it to get the actual value of the element. The de-referencing is done by using the `[]` operator. See the following example:

```mojo
# src/basic/types/list_iteration_before_mojo_v25d4.mojo
# This code is valid until Mojo v25.3
# It will not compile in Mojo v25.4 and later versions.
def main():
    my_list = List[Int](1, 2, 3, 4, 5)
    for i in my_list:  # `i` is a safe pointer to the element
        print(i[], end=" ")  # De-referencing the element to get its value
```

If you forget the `[]` operator, you will get an error message because you are trying to print the pointer to the element instead of the element itself.

```console
error: invalid call to 'print': could not deduce parameter 'Ts' of callee 'print'
        print(i,  end=" ")
        ~~~~~^~~~~~~~~~~~~
```

From Mojo v25.4 onwards, the iteration over a `List` will return a reference to the element instead of a pointer. You can directly use the element without de-referencing it.

For the difference between a pointer and a reference, please refer to Chapter [Reference system](../advanced/references#references-are-not-pointers) and Chapter [Ownership](../advanced/ownership#four-statuses-of-ownership).

:::

### Print a list

You cannot print the `List` object directly in Mojo (at least at the moment). This is because the `List` type does not implement the `Writable` trait, which is required for printing. To print a `List`, you have to write your own auxiliary function.

```mojo
# src/basic/types/list_printing.mojo
def print_list_of_floats(array: List[Float64]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")

def print_list_of_strings(array: List[String]):
    print("[", end="")
    for i in range(len(array)):
        if i < len(array) - 1:
            print(array[i], end=", ")
        else:
            print(array[i], end="]\n")

def main():
    var my_list_of_floats = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)
    var my_list_of_strings = List[String]("Mojo", "is", "awesome")
    print_list_of_floats(my_list_of_floats)
    print_list_of_strings(my_list_of_strings)
```

::: info `print_lists()` function

We have already seen this auxiliary function in Chapter [Convert Python code into Mojo](../move/examples.md). We will use this kinds of functions to print lists in the following chapters as well.

:::

### List comprehension

Mojo supports list comprehension syntax, which allows you to create a new list by iterating over an iterator in a single line. The syntax is similar to Python's list comprehension syntax. For example, you can create a list containing the squares of the numbers from 0 to 9 using list comprehension:

```mojo
def main():
    var my_list = [i**2 for i in range(10)]
    for i in my_list:
        print(i, end=", ")
```

This will output:

```console
0, 1, 4, 9, 16, 25, 36, 49, 64, 81,
```

A general syntax of list comprehension in Mojo is

```mojo
[expression(item) for item in iterable if condition]
```

where `expression(item)` is an expression computed for an `item` that is sequentially taken out from an iterable. You can also add an optional `if condition` to filter the items in the iterable. In fact, such a list comprehension is the shortened version (a syntax sugar) of the following code:

```mojo
lst = List[Type]()
for item in iterable:
    if condition:
        lst.append(expression(item))
```

For example, the following code creates the same lists from a list comprehension and a full syntax:

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

This will output:

```console
List Comprehension:
0, 4, 8, 12, 16, 
Full Syntax:
0, 4, 8, 12, 16, 
```

---

You can also use list comprehension with multiple iterations. For example, you can generate a list of concatenated strings by permuting three lists:

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

:::

Running the above code will output:

```console
aix, aiy, aiz, ajx, ajy, ajz, akx, aky, akz, bix, biy, biz, bjx, bjy, bjz, bkx, bky, bkz, cix, ciy, ciz, cjx, cjy, cjz, ckx, cky, ckz, 
```

---

In Python, list comprehension is also helpful when you want to print items of a iterable in a simpler way. However, this is not yet supported in Mojo.

<!-- 
Recall that `print()` function implicitly returns a `None` value, which means that the function is also a valid expression. Thus, you can very well put the `print()` function inside the list comprehension.

For example, you can print the third power of the numbers from 0 to 9 using list comprehension: 
-->

### Memory layout of List type

A Mojo `List` is actually a structure that contains three fields:

- A pointer type `data` that points to a continuous block of memory on the heap that stores the elements of the list contiguously.
- A integer type `_len` which stores the number of elements in the list.
- A integer type `capacity` which represents the maximum number of elements that can be stored in the list without reallocating memory. When `capacity` is larger than `_len`, it means that the memory space is allocated but is fully used. This enable you to append a few new elements to the list without reallocating memory. If you append more elements than the current capacity, the list will request another block of memory on the heap with a larger capacity, copy the existing elements to the new block, and then append the new elements.

Let's take a closer look at how a Mojo `List` is stored in the memory with a simple example: The code below creates a `List` of `UInt8` numbers representing the ASCII code of 5 letters. We can use the `chr()` function to convert them into characters and print them out to see what they mean.

```mojo
def main():
    var me = List[UInt8](89, 117, 104, 97, 111)
    print(me.capacity)
    for i in me:
        print(chr(Int(i[])), end="")
# Output: Yuhao
```

When you create a `List` with `List[UInt8](89, 117, 104, 97, 111)`, Mojo will first allocate a continuous block of memory on **stack** to store the three fields (`data: Pointer`, `_len: Int` and `capacity: Int`, each of which is 8 bytes long on a 64-bit system. Because we passed 5 elements to the `List` constructor, the `_len` field will be set to 5, and the `capacity` field will also be set to 5 (default setting, `capacity = _len`).

Then Mojo will allocate a continuous block of memory on **heap** to store the actual values of the elements of the list, which is 1 bytes (8 bits) for each `UInt8` element, equaling to 5 bytes in total for 5 elements. The `data` field will then store the address of the first byte in this block of memory.

The following figure illustrates how the `List` is stored in the memory. You can see that a continuous block of memory on the heap (from the address `17ca81f8` to `17ca81a2`) stores the actual values of the elements of the list. Each element is a `UInt8` value, and thus is of 1 byte long. The data field on the stack store the address of the first byte of the block of memory on the heap, which is `17ca81f8`.

```console
# Mojo Miji - Data types - List in memory

        local variable `me = List[UInt8](89, 117, 104, 97, 111)`
            ↓  (meta data on stack)
        ┌────────────────┬────────────┬────────────┐
Field   │ data           │ _len       │ capacity   │
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

Now we try to see what happens when we use list indexing to get a specific element from the list, for example, `me[0]`. Mojo will first check the `_len` field to see if the index is valid (i.e., `0 <= index < me._len`). If it is valid, Mojo will then calculate the address of the element by adding the index to the address stored in the `data` field. In this case, it will return the address of the first byte of the block of memory on the heap, which is `17ca81f8`. Then Mojo will de-reference this address to get the value of the element, which is `89` in this case.

If we try `me[2]`, Mojo will calculate address by adding `2` to the address stored in the `data` field, which is `17ca81f8 + 2 = 17ca81fa`. Then Mojo will de-reference this address to get the value of the element, which is `104` in this case.

::: info Index or offset?

You may find that the index starting from `0` in Python or Mojo is a little bit strange. But it will be intuitive if you look at the example above: The index of an element in a list is actually the offset from the address of the first element. When you think of the index as an offset, it will make more sense. Thus, in this Miji, I will sometimes use the term "offset" to refer to the index within the brackets `[]`.

:::

::: tip Memory layout of a list in Python and Mojo

In Mojo, the values of the elements of a list is stored consecutively on the heap. In Python, the pointers to the elements of a list is stored consecutively on the heap, while the actual values of the elements are stored in separate memory locations. This means that a Mojo's list is more memory-efficient than a Python's list, as it does not require additional dereferencing to access the values of the elements.

If you are interested in the difference between the the memory layout of a list in Python and Mojo, you can refer to Chapter [Memory Layout of Mojo objects](../misc/layout.md) for more details, where I use abstract diagrams to compare the memory layouts of a list in Python and Mojo.

:::
