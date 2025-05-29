# Data type - SIMD

Although SIMD is considered a "small" struct and are on the stack, I still make a separate chapter for it because there is not a counterpart in Python. It is also not a built-in type in many other programming languages. However, Mojo includes this type as a fundamental numerical type and makes it built-in. This type helps Mojo to achieve high performance in numerical computing, especially in vectorized operations.

[[toc]]

## Why SIMD?

Consider the following example where we want to add two lists element-wise. If we use a traditional approach, we would iterate over each element of the lists and perform the addition one by one. (The function `print_list_of_floats` is defined in Section [Print a list](../basic/types.md#print-a-list).)

```mojo
# src/basic/add_lists.mojo
def add_lists(a: List[Float64], b: List[Float64]) -> List[Float64]:
    result = List[Float64]()
    for i in range(len(a)):
        result.append(a[i] + b[i])
    return result

def main():
    a = List[Float64](1.0, 2.0, 3.0, 4.0)
    b = List[Float64](5.0, 6.0, 7.0, 8.0)
    result = add_lists(a, b)
    for i in result:
        print(i[], end=", ")
    # Output: 6.0, 8.0, 10.0, 12.0,
```

This approach is straightforward and simple. Compared to Python, plain iteration in Mojo is also much, much faster, since Mojo stores the values of elements of list contiguously in memory. You can safely use plain iteration in Mojo to achieve good performance.

However, our pioneers in computer science are never satisfied with the status quo. They always want to make things faster and more efficient. So the question is:

**Can we instruct multiple elements of the lists to be added simultaneously?**

The answer is yes! This is where SIMD comes into play.

:::info Iterations in Python

In Python, I am very cautious about using plain iteration, because Python's list is not a contiguous memory structure. The elements of a list can be stored in different locations in memory. The program has to dereference each pointer to access to the values of the elements.

That is why people recommend using NumPy or other libraries that provide vectorized operations for numerical computing in Python. These libraries provide list-like data structures that are stored contiguously in memory, allowing for efficient vectorized operations. However, iterating over these data structures is still slow(er) because the items has to be wrapped into Python objects.

In Mojo, you do not need to worry about this in most cases. Just use plain iterations if you want to.

:::

## What is SIMD?

SIMD stands for "Single Instruction, Multiple Data". The name is self-explanatory: It is a type of ***parallel computing*** that allows a single instruction to be applied to multiple data points simultaneously. This is particularly useful in numerical computing, where operations can often be performed simultaneously on multiple elements of an array or vector.

Let me illustrate this concept with the following graphical representation. Suppose we have a list `me = List[UInt8](89, 117, 104, 97, 111)`. The elements are stored contiguously in memory, and we want to add 1 to each element. In a **traditional approach**, we would iterate over each element and perform the addition one by one. The process would look like this:

``` txt
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  89    │  117   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
            ↓ (Iterator goes to me[0] and adds 1)
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  90    │  117   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
                     ↓ (Iterator goes to me[1] and adds 1)
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  90    │  118   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
                              ↓ (Iterator goes to me[2] and adds 1)
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  90    │  118   │  105   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
    (Iterator goes to me[3] and adds 1) ↓ 
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  90    │  118   │  105   │  98    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
            (Iterator goes to me[4] and adds 1) ↓
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  90    │  118   │  105   │  98    │  112   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
```

After the iteration, the list `me` has the values `[90, 118, 105, 98, 112]`.

Now we switch to the idea of SIMD. Instead of iterating over each element one by one, we can use a single instruction, i.e., "to add 1", to multiple elements at once. The process would look like this:

``` txt
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  89    │  117   │  104   │  97    │  111   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
                              │
                              │ (add 1)
            ┌────────┬────────┼────────┬────────┐
            ↓        ↓        ↓        ↓        ↓
        ┌────────┬────────┬────────┬────────┬────────┐
Element │  90    │  118   │  105   │  98    │  112   │
        ├────────┼────────┼────────┼────────┼────────┤
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┤
Value   │01011001│01110101│01101000│01100001│01101111│
        ├────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│
        └────────┴────────┴────────┴────────┴────────┘
```

Because the instruction "add 1" is applied to five elements at the same time, this process is much faster than the traditional approach.

That's it.

You may find this a bit too simple. But this is the essence of SIMD: Simultaneity. This concept can also be called as "vectorization".

## The SIMD type in Mojo

As a programming language for the era of AI, Mojo provides a built-in, open-boxed SIMD type that allows users to perform vectorized operations on multiple data points. This is a powerful feature and a shining point of Mojo that other programming languages do not have.

The SIMD type in Mojo is called `SIMD`. It is a container, a generic type that can hold multiple elements of the same type, similar to `List`. However, the elements of a `SIMD` type are stored contiguously on stack, which allows for efficient memory access and manipulation.

Here is a summary of the `SIMD` type:

|                    | Mojo `SIMD` type                    |
| ------------------ | ----------------------------------- |
| Type of elements   | Homogeneous type defined by `DType` |
| Mutability         | Mutable                             |
| Inialization       | `SIMD[DType, size]()`               |
| Indexing           | Use brackets `[]`                   |
| Slicing            | Use brackets `[a:b:c]`              |
| Extending by items | Use `append()`                      |
| Concatenation      | Use `+` operator                    |
| Printing           | Not supported                       |
| Iterating          | Use `for` loop and de-reference     |
| Memory layout      | Contiguous on stack                 |

### Create an SIMD

To create a `SIMD` object, you can use the general syntax `SIMD[DType, size]()`, where `DType` is the data type of the elements and `size` is the number of elements in the SIMD. For example, in the following code, we create four different `SIMD` objects with different data types and sizes:

1. An SIMD of `DType.float64` with 4 elements.
1. An SIMD of `DType.uint8` with 8 elements.
1. An SIMD of `DType.bool` with 1 element.
1. An SIMD of `DType.int32` with 8 elements. However, we only provide 4 elements as input.
1. An SIMD of `DType.float32` with 1 element. However, we do not explicitly specify the size.

```mojo
# src/basic/create_simd.mojo
def main():
    var a = SIMD[DType.float64, 4](1.0, 2.0, 3.0, 4.0)
    var b = SIMD[DType.int64, 8](89, 117, 104, 97, 111, 90, 104, 117)
    var c = SIMD[DType.bool, 2](True, False)
    var d = SIMD[DType.uint8, 8](1, 2, 3, 4)
    var e = SIMD[DType.float32](1.0)
    print("a =", a)
    print("b =", b)
    print("c =", c)
    print("d =", d)
    print("e =", e)
```

When you run this code, you will see the output:

```console
a = [1.0, 2.0, 3.0, 4.0]
b = [89, 117, 104, 97, 111, 90, 104, 117]
c = [True, False]
d = [1, 2, 3, 4, 0, 12, 89, 0]
e = 1.0
```

No error message is raised, but you may notice something intriguing:

- You may notice that the sizes of the SIMD that I passed to the constructor are always the power of two.
- You may notice that, although I did not specify the size of the SIMD `e`, it still works and prints the value `1.0`.
- You may notice that the variable `d` prints 4 more elements than I provided to the constructor. These four values are strange values.
- You may notice that the variable `e` is printed as if it is of a `Float32` type.
- You may notice that the fields in `DType` are very similar to the numeric data types we discussed in the previous Chapter [Data types](../basic/types.md), but they are all in lowercase.

If you do, then you can find out the answer by continuing reading this chapter.

## Size of SIMD

For a `List` type, you do not need to specify a size at the time of creation. This is because `List` is a dynamic data structure, being created at the runtime, that can grow and shrink as needed. In contrast, `SIMD` is a fixed-size data structure whose size in memory is determined at the compile time. You cannot change the size of it after creation. While being less flexible, it is more efficient in terms of performance.

Therefore, you need specify the size of the `SIMD` at the time of creation, so that Mojo compiler can allocate the exact amount of memory needed for the `SIMD` object.

There are two things that you need to know:

1. The size of the `SIMD` must be a power of two, i.e., 1, 2, 4, 8, 16, 32, etc. You may have noticed this from the example above. If you pass a size that is not a power of two, Mojo will raise an error at the compile time and indicate that "note: constraint failed: simd width must be power of 2".
1. If you do not specify the size of the `SIMD`, Mojo will automatically set the size to 1. This is useful when you want to create a SIMD with a single element, such as `SIMD[DType.float32](1.0)`.

## Type of SIMD

The type of a `SIMD` is also important as it determines how much memory is needed for each element and what operations can be performed on the elements.

The type of a `SIMD` is defined by the `DType` type, which is a special type that enumerates all possible data types that SIMD can hold.

For example, `DType.float64` represents a 64-bit floating-point number. Note that `DType.float64` is not a type per se, but a field of the `DType` type.

The most common data types are:

| Field of `DType` | Description                  |
| ---------------- | ---------------------------- |
| `DType.int8`     | 8-bit signed integer         |
| `DType.int16`    | 16-bit signed integer        |
| `DType.int32`    | 32-bit signed integer        |
| `DType.int64`    | 64-bit signed integer        |
| `DType.int128`   | 128-bit signed integer       |
| `DType.int256`   | 256-bit signed integer       |
| `DType.uint8`    | 8-bit unsigned integer       |
| `DType.uint16`   | 16-bit unsigned integer      |
| `DType.uint32`   | 32-bit unsigned integer      |
| `DType.uint64`   | 64-bit unsigned integer      |
| `DType.uint128`  | 128-bit unsigned integer     |
| `DType.uint256`  | 256-bit unsigned integer     |
| `DType.float16`  | 16-bit floating-point number |
| `DType.float32`  | 32-bit floating-point number |
| `DType.float64`  | 64-bit floating-point number |
| `DType.bool`     | Boolean value                |
| `DType.index`    | 32-bit or 64-bit index type  |

*"Wait a moment, Yuhao!"* you may say, *"I am sure that I saw this table in the previous chapter!"*

Yes, you are right! We have seen this table in the previous Chapter [Data types](../basic/types) under the sections for integer and floats.

*"Then what is the difference?"* you may ask.

The answer may be surprising to you: **Those numeric types are just SIMD types with size 1!**

Your brain may be burning right now, but let me explain: In Mojo, the basic numeric types are just an alias for the SIMD types with corresponding data types and the size of 1. For example,

- `Int8` is an alias for `SIMD[DType.int8, 1]`.
- `Int16` is an alias for `SIMD[DType.int16, 1]`.
- `Float32` is an alias for `SIMD[DType.float32, 1]`. This explains why the variable `e` in the previous example is printed as if it is of a `Float32`  type. Because it is just a `Float32` object that we are familiar with.

**SIMD is the first-class type** in Mojo. This may sounds a little bit exaggerated, but it is true.

Nevertheless, there are two important exceptions that you need to be aware of:

- `Int` type is not an `SIMD` type. You cannot vectorize operations on `Int` objects. If you want to use SIMD with integers, you need to consider using the specific integral type such as `Int32` (`SIMD[DType.int32]`) and `Int64` (`DType.int64`).
- `Bool` type is not an `SIMD` type. This means that `Bool` and `SIMD[DType.bool]` are completely two different things. You cannot vectorize operations on `Bool` objects. If you want to use SIMD with boolean values, you need to use `SIMD[DType.bool]`.

::: tip `Float64()` vs `SIMD[DType.float64, 1]()`, which one to use?

If you look into the source code of the standard library, you will find that `Float64` is defined as `alias Float64 = SIMD[DType.float64, 1]`. This applies to many other numeric types as well. As an alias, `Float64()` and `SIMD[DType.float64, 1]()` are equivalent in terms of functionality.

You may wonder which one you should use in your code for type annotation or variable construction. I would recommend using `Float64()` when you want to deal with a single floating-point number. This is more concise, more readable, and more Pythonic.

Finally, the Mojo compiler will replace `Float64()` with `SIMD[DType.float64, 1]()` at the compile time, so let's do save time here and enjoy a cup of coffee instead. 😉

:::

## Uninitialized SIMD

Recall the variable `d` in the previous example:

```mojo
var d = SIMD[DType.uint8, 8](1, 2, 3, 4)
```

The size of the object is 8, but we only provided 4 elements. The output is then `d = [1, 2, 3, 4, 0, 12, 89, 0]`. If you run your code several times, you will see that the last four elements are different each time (mostly zeros). This is because the last four elements are **uninitialized**.

To help you understand this, let me use graphs to illustrate what has happened in the memory when you created the variable `d`.

When you define the variable `d` and indicate that it is a `SIMD[DType.uint8, 8]`, the Mojo compiler will allocate 8 bytes (one byte for each element) of contiguous memory on the stack (e.g., from the address `17ca81f8` to `17ca81a5`), which is just enough to hold 8 elements of type `UInt8`.

At this time, the memory block may still contain some random values which are leftover from other programs or functions. For example, the memory address `17ca81a2` and `17ca81a5` are zeros, while the other addresses contain non-zero values. These values are all random and unpredictable. You should never assume any specific value for them. In Mojo, we call that the values at these addresses are **uninitialized**. The memory block looks like this:

```txt
        local variable `d` of type SIMD[DType.uint8, 8]
            ↓ (allocate 8 bytes of contiguous memory on the stack)
        ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
Value   │00100001|00111010│00000011│00110110│00000000│00001100│01011001│00000000│
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│17ca81a3│17ca81a4│17ca81a5│
        └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

Next, the Mojo compiler will sequentially copy the values you provided in the constructor, i.e., `1`, `2`, `3`, and `4`, into the first four addresses of the memory, but in a binary format. Now, the memory block now looks like this:

```txt
            1        2        3         4
            ↓        ↓        ↓         ↓ (change the values at the first four addresses)
        ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
Type    │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │ UInt8  │
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
Value   │00000001|00000010│00000011│00000100│00000000│00001100│01011001│00000000│
        ├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
Address │17ca81f8│17ca81f9│17ca81a0│17ca81a1│17ca81a2│17ca81a3│17ca81a4│17ca81a5│
        └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

Note that the values of the first four addresses are modified according to the values you provided. While the last four addresses remain unchanged, they are still uninitialized.

Using uninitialized values are dangerous and can lead to unexpected behavior in your program (not only for SIMD, but also for any other data structure). The following code is an example,

```mojo
# src/basic/uninitialized_simd.mojo
def main():
    var result = Float64(0)
    var d = SIMD[DType.float64, 64](1.0, 2.0, 3.0, 4.0)
    for i in range(len(d)):
        result += d[i]
    print("Sum of SIMD elements by iteration:", result)
    print("Sum of SIMD elements by method `reduce_add()`:", d.reduce_add())
    print("Expected: 10.0")
```

This code runs without any error, but the output is not what you expected:

```console
Sum of SIMD elements by iteration: 1.8676994148579432e+200
Sum of SIMD elements by method `reduce_add()`: 3.16e-322
Expected: 10.0
```

Since the size of the `SIMD` must be a power of two, but you may not always provide the exact number of elements that matches the size, in most cases, the last few elements of the `SIMD` will be uninitialized. You have to be very careful when using the `SIMD` type to avoid using uninitialized values.

To avoid this problem:

1. Always verify that that the valid number of elements in a SIMD is equal to the size of it. Only apply the methods, e.g., `reduce_add()`, on the SIMD with no uninitialized values.
1. If there are uninitialized values, you should iter until the valid number of elements in the SIMD. Things like `for i in range(len(d))` is not recommended.

::: tip Bigger or smaller SIMDs?

One of the best practice to avoid creating too many uninitialized values in SIMD is to use many smaller SIMD instead of a big one. For example, if you have 513 elements, you can either create:

- One SIMD of size 1024. There will be 513 initialized values and 511 uninitialized values.
- Nine SIMD of size 64. 8 SIMDs are fully initialized. 1 SIMD has 1 initialized value and 63 uninitialized values.

For the first option, you not only waste precious memory on stack, but also risk using uninitialized values. If you, instead, iterate over the valid elements in the SIMD, you lose the performance benefit of SIMD. Thus, it is not a good approach.

For the second option, you can apply vectorized operations on the first 8 SIMDs sequentially, and then use the iteration to process the last SIMD. This way, you not only save memory space (63 uninitialized values vs 511 in the first approach), but also gain performance by applying vectorized operations on the first 8 SIMDs.

You can see that there are more than one way to split the data into smaller SIMDs. The optimal size of SIMD? I have no definitive answer for that. It depends on the specific use cases. Maybe you need to experiment with different sizes to find the best one for your application.

:::

## Performance of SIMD

Now we finally come to see how SMID can help us to achieve high performance in numerical computing. Let's re-write our previous example of adding two lists element-wise, but this time, using SIMDs.

```mojo
# src/basic/add_lists.mojo
def main():
    a = SIMD[DType.float64, 4](1.0, 2.0, 3.0, 4.0)
    b = SIMD[DType.float64, 4](5.0, 6.0, 7.0, 8.0)
    result = a + b
    print(result)
    # Output: [6.0, 8.0, 10.0, 12.0]
```

It is just as easy as adding up two numbers. The `+` operator for the `SIMD` type is to perform element-wise addition. You can also use other operators such as `-`, `*`, `/`, etc. to perform element-wise subtraction, multiplication, and division, respectively. Note that these operations are done in parallel for all elements in the SIMD.

We can make a quick comparison between the performance of the two approaches. In the mojo file `src/basic/simd_performance.mojo`, we will implement two approaches to repeatedly add up `[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]`, element-wise, for 1,000,000 times. The expected result is `[1000000.0, 2000000.0, 3000000.0, 4000000.0, 5000000.0, 6000000.0, 7000000.0, 8000000.0]`.

- The first approach is to use plain iteration. We simply iterate over each element and add them into the result at the same index. This is similar to the traditional approach we discussed earlier.
- The second approach is to use the `+` operator on two SIMD objects.

To calculate the time taken for each approach, we need to import the `time` module and use the `perf_counter_ns()` function. The code looks like this:

```mojo
# src/basic/simd_performance.mojo
import time


def main():
    var number_of_iterations = 1000000
    a = SIMD[DType.float64, 8](1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0)

    # We will add up `a` element-wise for 1,000,000 times.

    # Use plain iterations
    t0 = time.perf_counter_ns()
    result_iter = SIMD[DType.float64, 8](0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    for _i in range(number_of_iterations):
        for _j in range(8):
            result_iter[_j] += a[_j]
    t_delta = time.perf_counter_ns() - t0
    print("Use plain iterations over all elements:")
    print("Result is", result_iter, "in", t_delta, "nano-seconds.")

    print()

    # Use SMID operation
    t0 = time.perf_counter_ns()
    result_simd = SIMD[DType.float64, 8](0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    for _ in range(number_of_iterations):
        result_simd += a
    t_delta = time.perf_counter_ns() - t0
    print("Use vectorized operation on all elements:")
    print("Result is", result_simd, "in", t_delta, "nano-seconds.")
    print()
```

Let's run this code with `pixi run mojo src/basic/simd_performance.mojo` command in the terminal and see the output:

```console
Use plain iterations over all elements:
Result is [1000000.0, 2000000.0, 3000000.0, 4000000.0, 5000000.0, 6000000.0, 7000000.0, 8000000.0] in 33363000 nano-seconds.

Use vectorized operation on all elements:
Result is [1000000.0, 2000000.0, 3000000.0, 4000000.0, 5000000.0, 6000000.0, 7000000.0, 8000000.0] in 557000 nano-seconds.
```

The results are correct for both approaches, but the time taken for the vectorized operation is significantly less than that of the plain iteration. In this case, the vectorized operation is about 60 times faster than the plain iteration.
