# Data type - SIMD

Although SIMD is considered a "small" struct and are on the stack, I still make a separate chapter for it because there is not a counterpart in Python. It is also not a built-in type in many other programming languages. However, Mojo includes this type as a fundamental numerical type and makes it built-in. This type helps Mojo to achieve high performance in numerical computing, especially in vectorized operations.

[[toc]]

## Why SIMD?

SIMD stands for "Single Instruction, Multiple Data". The name is self-explanatory: It is a type of ***parallel computing*** that allows a single instruction to be applied to multiple data points simultaneously. This is particularly useful in numerical computing, where operations can often be performed simultaneously on multiple elements of an array or vector.

Consider the following example where we want to add two lists element-wise. If we use a traditional approach, we would iterate over each element of the lists and perform the addition one by one. (The function `print_list_of_floats` is defined in Section [Print a list](../basic/types.md#print-a-list).)

```mojo
# src/basic/simd.mojo

def add_lists_traditional(a: List[Float64], b: List[Float64]) -> List[Float64]:
    result = List[Float64]()
    for i in range(len(a)):
        result.append(a[i] + b[i])
    return result

def main():
    a = List[Float64]([1.0, 2.0, 3.0, 4.0])
    b = List[Float64]([5.0, 6.0, 7.0, 8.0])
    result = add_lists_traditional(a, b)
    print_list_of_floats(result)
    # Output: [6.0, 8.0, 10.0, 12.0]
```

This approach is straightforward. Compared to Python, plain iteration in Mojo is also much faster, since Mojo stores the values of elements of list contiguously in memory. You can safely use plain iteration in Mojo to achieve good performance.

:::info Python iteration

:::

