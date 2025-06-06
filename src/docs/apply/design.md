# General design of a matrix type

Before we start implementing the Matrix type, we need to prepare ourself with some basic knowledge about matrices, e.g., how to represent them in Mojo, how to access their elements, and how to perform basic operations on them.

[[toc]]

## Internal representation of a matrix

### Contiguous memory layout

A matrix can be regarded as stacks of several vectors, i.e., multiple rows of column vectors, or multiple columns of row vectors. We can naturally represent a matrix as a nested list of lists. For example, a 2x3 matrix

$$
\begin{pmatrix}
1.12 & 2.3 & -0.12 \\
2.1 & -0.2 & 1.45
\end{pmatrix}
$$

can be represented as a nested list of lists:

```console
A = [[1.12, 2.3, -0.12], [2.1, -0.2, 1.45]]
```

This is easy way to represent a matrix, and it is flexible, as the list is allocated dynamically on the heap. However, it is not efficient: The data is stored as a list of lists, which means that each row is a separate list object, leading to additional overhead. For example, when we want to calculate the sum of all elements in the matrix, we need to iterate over each row and then each element in the row, which is not efficient.

A more efficient way to represent a matrix is to use a single list to store all the elements in the matrix, and then use the row and column indices to access the elements. For example, we can represent the same 2x3 matrix as a single list:

```console
B = [1.12, 2.3, -0.12, 2.1, -0.2, 1.45]
```

### Indices of a matrix

You may ask, then, how do we access the elements in the one-dimensional list according to the two-dimensional indices of the matrix, i.e., row and column?

The answer is simple: we can set up a mapping between the two-dimensional indices and the one-dimensional index (we also call it **offset**). For a matrix with `m` rows and `n` columns, the element at row `i` and column `j` can be accessed by the formula:

$$
A_{i, j}= B_{i \cdot n + j}
$$

where $A$ is a 2x3 matrix, and $B$ is the one-dimensional list that stores all the elements of the matrix by row.

This formula is intuitive: if we want to get access to the element at row `i` and column `j`, we have to skip the first `i` rows, which contain `i * n` elements, and then skip the first `j` elements in the `i`-th row.

### Strides of a matrix

We define the vector $(n, i)$ the **strides** of the matrix. This vector indicates how many elements we need to skip to access the next row or column. 

In the above example, the strides of the matrix are $(3, 1)$, which means that, if you are now at $A_{0, 2}$, you need to skip `3` elements to access the element of the same column number but the next row number, i.e., $A_{1, 2}$.

Strides is very useful when we want to access the elements of the matrix given the indices: you can simply take the inner product of the strides and the indices and get its offset in the one-dimensional list.

$$
A_{index1, index2} = B_{(index1, index2) \cdot (strides1, strides2)} = B_{index1 \cdot strides1 + index2 \cdot strides2}
$$

For example, if we want to access the element at row `i` and column `j`, we can use the formula:

$$
A_{i, j} = B_{(i, j) \cdot (3, 1)} = B_{i \cdot 3 + j}
$$

### Row-major vs column-major

In the above example, we store the elements of the matrix by row. That is to say, the elements of each row are stored in contiguous memory locations, and one row after another. This is called **row-major** order. The strides of a matrix of the size `m x n` in row-major order is `(n, 1)`, e.g., 

```console
B = [1.12, 2.3, -0.12, 2.1, -0.2, 1.45]
```

To access the element at row `i` and column `j` in a row-major order matrix, we can use the formula:
$$
A_{i, j} = B_{(i, j) \cdot (n, 1)} = B_{i \cdot n + j}
$$

We can also store the elements of the matrix by column, i.e., the elements of each column are stored in contiguous memory locations, and one column after another. This is called **column-major** order. The strides of a matrix of the size `m x n` in column-major order is `(1, m)`, e.g.,

```console
C = [1.12, 2.1, 2.3, -0.2, -0.12, 1.45]
```

To access the element at row `i` and column `j` in a column-major order matrix, we can use the formula:

$$
A_{i, j} = C_{(i, j) \cdot (1, m)} = C_{i + j \cdot m}
$$

Whether to use row-major or column-major order depends on the application. For example, if you are doing a lot of matrix multiplication on narrow but long matrices (like datasets with few features but many observations), you may want to use column-major order, as it is more efficient for accessing the elements in the same column. On the other hand, if you are doing a lot of matrix multiplication on wide but short matrices (like images with many pixels but few channels), you may want to use row-major order, as it is more efficient for accessing the elements in the same row.

The default order in Fortran is column-major, while the default order in C is row-major. So we also call the row-major order as "C-contiguous" memory layout, and the column-major order as "F-contiguous" memory layout.

### Row-major for our matrix type

In our matrix type, we will use the row-major order to store the elements of the matrix. So the strides of the matrix will be `(n, 1)`, where `n` is the number of columns in the matrix.

This choice is for simplicity: I do not want to complicate the implementation of the matrix type, but focus on how Mojo can be used to implement the basic functionalities of a matrix.

You can always extend the matrix type to support column-major order by allowing the user to specify the memory layout when creating the matrix, and the initialize the strides accordingly. This is also the approach taken by the `NuMojo.Matrix` type ([PR #234](https://github.com/Mojo-Numerics-and-Algorithms-group/NuMojo/pull/234)).

::: info `numpy.matrix` is row-major

Notably, the `numpy.matrix` type in Python is also row-major by default, and it does not support column-major order.

In contrast, the `numpy.ndarray` type is more flexible and can be either row-major or column-major, depending on the `order` parameter that are given by users when they create the array. The default order for `numpy.ndarray` is row-major, but you can specify `order='F'` to make it column-major.

The `numojo.NDArray` type in Mojo is similar to `numpy.ndarray`, and it also supports both row-major and column-major orders.

:::

### Fixed-size vs dynamic-size matrix

Since the size of the matrix is not necessarily known at the compile time (e.g., users may read a matrix from a file), we cannot store the elements of the matrix in a fixed-size array. Thus, we need to use a dynamic-size array-like data structure to store the elements of the matrix **on heap**.

Nevertheless, if you are particularly interested in some fixed-size matrix, e.g., 2x2, 3x3, or 4x4 matrices, you can use an SIMD to store the elements of the matrix **on stack**. This will allow you to improve the performance of the matrix operations.

## Fields of the matrix type

To represent a matrix in Mojo, we need to define a struct that contains the following fields:

- type: a `DType` value that indicates the data type of the elements in the matrix, e.g., `int64`, `float32`, `bool`, etc. This is similar to the `dtype` argument in NumPy. However, we can make use of the parameterization feature of Mojo to make the matrix type known at the compile time.
- data: a one-dimensional array-like data structure (e.g., `List`) that stores all the elements of the matrix on the heap.
- size: a tuple that stores the size of the matrix, i.e., the number of rows and columns.
- strides: a tuple that stores the strides of the matrix, i.e., how many elements we need to skip to access the next row or column. Since we use row-major order, the strides will be `(n, 1)`, where `n` is the number of columns in the matrix. Thus, this field is optional, as we can always calculate the strides from the size of the matrix. Nevertheless, we will keep it for convenience and allow you to extend the matrix type to support column-major order in the future.
- flags: a mapping table that stores information on the memory layout of the matrix, e.g., whether it is row-major or column-major, whether it is contiguous or not, etc. This field is also optional, as we always ensure, by design, that the matrix is contiguous in memory and is of row-major order. However, we will keep it for convenience and allow you to extend the matrix type to support column-major order or data referencing.

## Methods of the matrix type

The matrix type should provide the following methods:

### Lifetime methods

- `__init__()`: a constructor that initializes the matrix with the given data (a 1D list), size (a tuple of two integers), and data type (a `DType` value). The constructor will also calculate the number of elements, the strides, and the flags of the matrix. If the data is not provided, it will initialize an empty matrix with the given size and data type.
- `__copyinit__()` and `__moveinit__()`: constructors that initialize the matrix by copying or moving the data from another matrix.

### IO methods

- `__str__()`: a method that returns a string representation of the matrix.
- `write_to()`: a method that enables the `print()` function to print the matrix in a human-readable format.

### Access methods

- `__getitem__()`: a method that allows you to access the elements of the matrix using the row and column indices, e.g., `A[i, j]`. This method will use the strides to calculate the offset in the one-dimensional list that stores the elements of the matrix. Moreover, this method will also support slicing, e.g., `A[i, :]` or `A[:, j]`, to access the whole row or column of the matrix.
- `__setitem__()`: a method that allows you to set the elements of the matrix using the row and column indices, e.g., `A[i, j] = x`. This method will also support slicing, e.g., `A[i, :] = x` or `A[:, j] = x`, to set the whole row or column of the matrix.

### Mathematical methods

There are a lot of mathematical or statistical methods that we can implement for the matrix type, but we will focus on the most common ones that are useful for basic matrix operations.

- `__add__()`, `__sub__()`, `__mul__()`, `__truediv__()`: methods that allow you to perform element-wise addition, subtraction, multiplication, and division on the matrix. These methods will return a new matrix with the same size and data type as the original matrix.
- `__matmul__()`: a method that allows you to perform matrix multiplication on the matrix. This method will return a new matrix with the size of the result of the matrix multiplication.
- `sum()`: a method that allows you to calculate the sum of all elements in the matrix. This method will return a scalar value of the same data type as the elements in the matrix. Moreover, this method will also support summing along a specific axis, e.g., `A.sum(axis=0)` to sum all rows in each column, or `A.sum(axis=1)` to sum all columns in each row. This overload will return a new matrix with one dimension equals to one (a vector).
- `max()`, `min()`: methods that allow you to calculate the maximum and minimum values in the matrix. These methods will return a scalar value of the same data type as the elements in the matrix. Moreover, these methods will also support finding the maximum or minimum value along a specific axis, e.g., `A.max(axis=0)` to find the maximum value in each column, or `A.max(axis=1)` to find the maximum value in each row. This overload will return a new matrix with one dimension equals to one (a vector).

### Manipulation methods

- `reshape()`: a method that allows you to reshape the matrix to a new size, e.g., from a 2x3 matrix to a 3x2 matrix. This method will return a new matrix with the same data but a different size.
- `transpose()`: a method that allows you to transpose the matrix, i.e., swap the rows and columns.
