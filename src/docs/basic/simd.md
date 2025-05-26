# Data type - SIMD

Although SIMD is considered a "small" struct and are on the stack, I still make a separate chapter for it because there is not a counterpart in Python. It is also not a built-in type in many other programming languages. However, Mojo includes this type as a fundamental numerical type and makes it built-in. This type helps Mojo to achieve high performance in numerical computing, especially in vectorized operations.

[[toc]]

## What is SIMD?

SIMD stands for "Single Instruction, Multiple Data". It is a type of ***parallel computing*** that allows a single instruction to be applied to multiple data points simultaneously. This is particularly useful in numerical computing, where operations can often be performed simultaneously on multiple elements of an array or vector.

Consider the following example where we want to add two vectors element-wise. If we use a traditional approach, we would iterate over each element of the vectors and perform the addition one by one.

```mojo
def add_vectors_traditional(a: List[Float64], b: List[Float64]) -> List[Float64]:
    result = List[Float64]()
    for i in range(len(a)):
        result.append(a[i] + b[i])
    return result
```
