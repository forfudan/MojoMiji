# Memory Layout of Mojo objects

How the objects are stored in memory is an important aspect of programming languages. In Mojo, the memory layout of objects is different from that of Python, which can lead to some confusion for Python programmers.

In Python, objects are not directly stored in the memory. Instead, they are stored as a reference to a Python object, which is a structure that contains metadata about the object, such as its type, size, and reference count. The actual data of the object is stored in a separate memory block on the heap. This even applies to simple types like integers and floats.

::: info Python variable assignment

Because the python variable `a` is a pointer to a Python object (and its metadata) rather than a direct pointer to the value at a certain memory address, we can say that the assignment `a = 5` is actually to attach the name `a` to the Python object that represents the integer `5`.

:::

When you want to access the value of an object, for example, `print(a)` where `a` is an integer, Python go to the Python object, retrieves the metadata of the object including the pointer to the actual value, and then dereferences that pointer to access the actual data in the memory block.

This means that Python list object has multiple layers in its memory layout. The first layer is a pointer that points to a list object. This list object is the second layer, which contains a reference counter, a size, a capacity, and another pointer to a continuous memory block on heap. This memory block is the third layer, which contains pointers to the elements (Python objects) of the list. The elements are the final layer (if the elements are composite types like lists, there are more layers).

For example, below is an abstract representation of how the Python list `my_list = [0.125, True, 0.5, "Hello", 42]` is stored in the memory.

```console
# Mojo Miji - Memory Layout - Python list

         Variable `my_list`: list
            ↓ (points to the PyListObject) 
        ┌────────┬────────┬────────┬────────┐
Item    │Counter │Size    │Pointer │Capacity│
        ├────────┼────────┼────────┼────────┤
Value   │   1    │   5    │17ca81f8│   8    │
        ├────────┼────────┼────────┼────────┤
Address │26c6a89a│26c6a8a2│26c6a8aa│26c6a8b2│
        └────────┴────────┴────────┴────────┘
                              │
            ┌─────────────────┘
            ↓ (points to a continuous memory block that contains the pointers to the list elements)         
        ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
Item    │Pointer │Pointer │Pointer │Pointer │Pointer │        │        │        │
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
Value   │18c1fc0a│18c128e3│1544340b│1815412c│2da3510f│        │        │        │
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca8200│17ca8208│17ca8210│17ca8218│17ca8220│17ca8228│17ca8230│
        └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘
            │         │       ...      ...      ...
            │         │
            │         └──────────────────────────────────────────────────────────────────────────────────┐
            │                                                                                            │  
            ↓  (points to the first element of the list, which is a float of value 0.125)                │
        ┌────────┬────────┐                                                                              │
Item    │Counter │Pointer │                                                                              │
        ├────────┼────────┤                                                                              │
Value   │00000001│18c1fc12│                                                                              │
        ├────────┼────────┤                                                                              │
Address │19df23ea│18c1fcf2|                                                                              │
        └────────┴────────┘                                                                              │
                     │                                                                                   │
            ┌────────┘                                                                                   │
            ↓  (points to the value of the float)                                                        │
        ┌───────────────────────────────────────────────────────────────────────┐                        │
Item    │              Binary representation of value 0.125                     │                        │
        ├────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┤                        │
Value   │00111111│11000000│00000000│00000000│00000000│00000000│00000000│00000000│                        │
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤                        │
Address │18c1fc12│18c1fc13│18c1fc14│18c1fc15│18c1fc16│18c1fc17│18c1fc18│18c1fc12│                        │
        └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘                        │
                                                                                                         │
            ┌────────────────────────────────────────────────────────────────────────────────────────────┘
            ↓ (points to the second element of the list, which is an boolean of value true)         
        ┌────────┬─────────────────────────────────────┐
Item    │Counter │ Binary representation of value true │
        ├────────┼─────────────────────────────────────┤
Value   │00000001│           00000001                  │
        ├────────┼─────────────────────────────────────┤
Address │18c128e3│           18c128fb                  │
        └────────┴─────────────────────────────────────┘     
```

In Mojo, objects are stored in a more straightforward way. When you create an variable, it asks for a space in the memory (stack) to store the value directly. For example, when you declare `a: Int64 = 5`, Mojo allocates a space in the memory that is large enough to hold an integer (8 bytes, or equivalently 64-bit, for `Int`), and stores the value `5` directly in that space. When you want to access the value of `a`, for example `print(a)`, Mojo simply go to the corresponding memory address and read the value directly.

For composite data types like lists, Mojo uses a similar approach but with some additional structures. When you create a list, such as `my_list = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)`, Mojo allocates a space in the memory (stack) for the list object which contains metadata about the list, i.e., length, capacity, and a pointer to a continuous memory block that holds the actual elements of the list. Then it allocates another continuous memory block on the memory (heap) to store the values of the elements of the list, which are of type `Float64`. The values of the elements are stored directly in this memory block, without further referring to another locations in the memory.

Thus, there are only two layers in the memory layout of a Mojo list: the first layer is the list object that contains metadata and a pointer to the second layer, which is a continuous memory block that holds the actual values of the elements.

Below is a similar abstract representation of how the Mojo list `my_list = List[Float64](0.125, 12.0, 12.625, -2.0, -12.0)` is stored in the memory.

```console
# Mojo Miji - Memory Layout - Mojo List

        local variable `my_list`: List[Float64]
            ↓  (points to the instance of the struct `List[Float64]`)
        ┌────────────────┬────────────┬────────────────┐
Item    │ data (pointer) │ _len (Int) │ capacity (Int) │
        ├────────────────┼────────────┼────────────────┤
Value   │   17ca81f8     │   5        │       8        │
        ├────────────────┼────────────┼────────────────┤
Address │   26c6a89a     │  26c6a8a2  │   26c6a8aa     │
        └────────────────┴────────────┴────────────────┘
            │
            ↓ (points to a continuous memory block that represents the list elements)         
        ┌──────────────────┬──────────────────┬──────────────────┬──────────────┬───────────────┬────────┬────────┬────────┐
Item    │0.125 (Float64)   │ 12.0 (Float64)   │ 12.625 (Float64) │-2.0 (Float64)│-12.0 (Float64)│        │        │        │
        ├──────────────────┼──────────────────┼──────────────────┼──────────────┼───────────────┼────────┼────────┼────────┤
Value   │0x3FC0000000000000|0x4028000000000000│0x4029400000000000│
        ├──────────────────┼──────────────────┼──────────────────┼──────────────┼───────────────┼────────┼────────┼────────┤
Address │17ca81f8          │17ca8200          │17ca8208          │17ca8210      │17ca8218       │17ca8220│17ca8228│17ca8230│
        └──────────────────┴──────────────────┴──────────────────┴──────────────┴───────────────┴────────┴────────┴────────┘
```

The Python and Mojo memory layouts are fundamentally different. The former has multiple layers of indirection, being flexible and inefficient, while the latter is more efficient but less flexible (in the above example, Mojo's list can only contain elements of the same type).

Which one is better? There is no definitive answer. A wise person would choose the one that best suits their needs and fits their use cases.
