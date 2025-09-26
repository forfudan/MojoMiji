# Make it work

After a general design of the library, we can start to implement it. We will first try to **make it work**: to implement the basic functionalities of the matrix type.

[[toc]]

## Initiate the project

I assume that you have already installed pixi according to Chapter [pixi](../start/pixi.md). Then, you navigate to your preferred directory and run the following command to initiate a new Mojo project:

```bash
pixi init matrix-mojo -c "https://conda.modular.com/max" -c "https://repo.prefix.dev/modular-community" -c "conda-forge"
```

This will create a new folder called `matrix-mojo` in the current directory. You can then use your VS Code to open this folder as a workspace.

Now, we open the `pixi.toml` file in this folder. We learnt about this file in Chapter [Initiate Mojo project](../start/project.md). It is a configuration file that contains the information about the Mojo project, such as the name, version, authors, and dependencies.

We can add more information to this file so that it should look like this:

```toml
[workspace]
authors = ["This is your name"]
channels = ["https://conda.modular.com/max", "https://repo.prefix.dev/modular-community", "conda-forge"]
name = "matmojo"
platforms = ["osx-arm64"]
version = "0.1.0"

[tasks]

[dependencies]
max = "*"
```

For now, it is sufficient. We will update this file later when we add more features to the library.

---

Now, we can install the dependencies of the project by typing the following command in the terminal:

```bash
pixi install
```

This will install the latest version of the `max` package, which also contains the Mojo compiler.

## Create folders and files

Next, we will create some folders and files to organize our code. The workspace should look like this:

```console
matrix-mojo
├── pixi.toml
├─- tests
└── src
    └── matmojo
        ├── __init__.mojo
        ├── creation.mojo
        ├── math.mojo
        ├── matrix.mojo
        └── utils.mojo
```

This structure is similar to the `my-first-mojo-project` we created in Chapter [My first Mojo program](../start/hello.md). Here are some explanations of the folders and files:

- The `src` folder contains the source code of the project.
- The `matmojo` folder contains the code of the matrix library. Although it is the only folder in the `src` folder, it is still a good practice to put the code of the library in a separate sub-folder. For bigger projects, you may have multiple auxiliary libraries. You can then put them in different sub-folders under `src`.
- `__init__.mojo` is a file that indicating that this folder is a valid Mojo package. It is identical to Python's convention, so your knowledge of Python packages can be directly applied here. In this file, you can also write some code that will be executed when the package is imported.
- `matrix.mojo` is the main file that contains the definition of the `Matrix` type. It is the core of the library.
- `creation.mojo`, `math.mojo`, and `utils.mojo` are modules containing the implementation of the matrix creation, mathematical operations, and utility functions, respectively. Your knowledge of Python modules can also be directly applied here: **every mojo file is a module.**
- The `tests` folder is where we will put interactive tests and, in future, unit tests for the library. It is a good practice to put tests in a separate folder so that they are not mixed with the source code of the library.

## Define struct and its fields

Now, we can start to implement the `Matrix` type. We will first create the `Matrix` struct in the `matrix.mojo` file. Open the `matrix.mojo` file and type the following code:

```mojo
struct Matrix[dtype: DType = DType.float64]:
    """A 2D matrix type.
    
    Parameters:
        dtype: The data type of the matrix elements. Defaults to `DType.float64`.
    """

    var data: List[Scalar[dtype]]
    """The elements of the matrix stored in row-major layout (C-contiguous)."""
    var size: Int
    """The total number of elements in the matrix."""
    var shape: Tuple[Int, Int]
    """The shape of the matrix as a tuple (rows, cols)."""
    var strides: Tuple[Int, Int]
    """The strides of the matrix in memory (row stride, col stride)."""
```

This code defines a `Matrix` struct with four fields:

- `data`: A list of elements of type `Scalar[dtype]`, which stores the elements of the matrix in a row-major layout (C-contiguous).
- `size`: An integer that represents the total number of elements in the matrix.
- `shape`: A tuple of two integers that represents the shape of the matrix as `(rows, cols)`.
- `strides`: A tuple of two integers that represents the strides of the matrix in memory, which is `(row stride, col stride)`.

Notably, the `Matrix` struct is [parameterized](../advanced/parameterization.md) by a type parameter `dtype`, which allows us to create matrices of different data types. The `dtype` can be any type that is an [SIMD](../advanced/simd.md) type, such as `Float32`, `Float64`, `Int32`, or `Int64`. This `dtype` parameters, different from the four fields, is known at compile time. This means that the `dtype` parameter will be replaced with a realized type when you compile your code. During run time, the `dtype` will be a constant value.

You may notice that we also use this parameter `dtype` in the type annotation of the `data` field. This means that the list that contains the elements of the matrix will be also parameterized by the `dtype`.

The square brackets `[]` containing the parameters is **a part of the struct name**. This means that, when you want to create a new matrix instance, the corresponding constructor should contains both the struct name and the type parameters, e.g., `Matrix[Float32]()`.

If you do not specify the `dtype` parameter when creating a new `Matrix` instance, it will default to `DType.float64`, as specified in the struct definition.

::: info Scalar and SIMD

When there is only one element in the `SIMD` type, it can also be referred to as a `Scalar`. The `Scalar` type is not new type, but just a type alias for the `SIMD` type, just like `Float32` is a type alias for `SIMD[Float32, 1]`. So we have the following equation:

`Float32` = `Scalar[DType.float32]` = `SIMD[DType.float32, 1]`

You can use either alias in your code for convenience.

:::

## Implement the constructor

Next, we will implement the constructor of the `Matrix` type, the `__init__()` method. It allows us to create a new `Matrix` instance with the name of the struct, e.g., `Matrix[Float32]()`.

For this `__init__()` method, we will pass in the following information:

- The elements of the matrix. In our implementation, we will accept a list of values.
- The shape of the matrix, which is a tuple of two integers `(rows, cols)`. We can use it to calculate the size and strides of the matrix.

Here is the code:

```mojo
# src/matmojo/__init__.mojo
fn __init__(out self, data: List[Scalar[dtype]], shape: Tuple[Int, Int]) raises:
    """Initialize the matrix with data and shape.
    
    Args:
        data: A list of elements to initialize the matrix.
        shape: A tuple specifying the shape of the matrix (rows, cols).
    """
    self.data = data
    self.size = shape[0] * shape[1]
    self.shape = shape
    self.strides = (shape[1], 1)  # Row-major order
    if len(data) != shape[0] * shape[1]:
        raise "Data length does not match the specified shape."
```

Let's see what we should pay attention to in this code:

- We use the `out self` as the first argument to indicate that a instance of the `Matrix` struct will be created by this method. Similar to Python, `self` is a reference to the instance being created, but an explicit `out` keyword is required in Mojo.
- We need to specify the type of all remaining arguments explicitly.
- We use the `raises` keyword to indicate that this method may raise an exception. It is because we will check at the initialization whether the length of the `data` list matches the specified shape. If not, we raise an exception with a message.
- The code inside the method body is similar to Python. We use `self.field_name` to access the fields of the struct that are defined at the top of the file.

## Test your code in time

You may want to already test your code to see if it works as expected. Although we we in future set up some unit tests for the library, we can still test the code with a more interactive way. There are many ways to do this, but I will show you rather convenient way to do this in VS Code.

### Step 1: Create a test file

You can create a file called `test.mojo` in the `tests` folder. This file will be used to test the code interactively. You can then type the following code in this file to create a `Matrix` instance.

```mojo
# tests/test.mojo
import matmojo as mm

def main():
    var mat = mm.matrix.Matrix[DType.float64](data=List[Float64](1.0, 2.0, 3.0, 4.0, 5.0), shape=(2, 2))
```

In the code, we import the `matmojo` package into the file by `import matmojo as mm`, and then use the `mm.matrix.Matrix[DType.float64]` to call call the constructor of the `Matrix` type. This is very similar to Python's import statement, so you can safely use your knowledge of Python import system here.

However, we have a problem here: The Mojo compiler does not know where the `matmojo` package is located. If is not that smart to guess that the `matmojo` package is in the path `../src/`. Thus, we have to do something for the compiler to find the package.

### Step 2: Build the package

To make the Mojo compiler aware of the `matmojo` package, we need to build a Mojo package and put it in the same directory as the `test.mojo` file. Mojo compiler will search for the package in the current directory and its subdirectories. When it sees the `matmojo` package, it will be able to import it.

To build the package, you can run the following command in the terminal:

```bash
pixi run mojo package -o tests/matmojo.mojopkg src/matmojo
```

What does this mean? Let's break it down:

- `pixi run mojo package`: This command tells pixi to run the Mojo compiler with the `package` command, which is used to build a Mojo package. A Mojo package is a standalone file with extension `.mojopkg` that contains all the code in your `matmojo` package, but a more compact form. Note it is not compiled yet to machine code.
- `-o tests/matmojo.mojopkg`: This option specifies the output file of the package. The package will be saved as `tests/matmojo.mojopkg`.
- `src/matmojo`: This is the path to the source code of the `matmojo` package that we want to build.

After running this command, you should see a new file called `matmojo.mojopkg` in the `tests` folder. This file is functionally equivalent to the `matmojo` folder in the `src` folder. You can even copy it to other computers and use it.

### Step 3: Run the test file

Now, you can run the `test.mojo` file to see if it works. You can do this by running the following command in the terminal:

```bash
pixi run mojo run tests/test.mojo
```

Success! You should see the following output:

```console
(base) ZHU@MBP-Dr-Yuhao-Zhu matrix-mojo % pixi run mojo run tests/test.mojo
Unhandled exception caught during execution: Data length does not match the specified shape.
/Users/ZHU/Programs/matrix-mojo/.pixi/envs/default/bin/mojo: error: execution exited with a non-zero result: 1
```

This means that the `Matrix` constructor was successfully called, but it raised an exception because the length of the `data` list does not match the specified shape. This is expected, as we only provided 5 elements in the `data` list, while the shape is `(2, 2)`, which requires 4 elements.

If you change the code in the `test.mojo` file and provide a valid `data` list, such as `data=List[Float64](1.0, 2.0, 3.0, 4.0)`, you should see no output, which means the code ran successfully without any exceptions.

### Use pixi tasks as a shortcut

It will be a little bit tedious to run the commands above every time you want to test your code. Fortunately, we can use pixi "tasks" to automate this process.

Pixi "tasks" is a feature that allows you to define custom commands in the `pixi.toml` file. You can define a task that will build the package and run the test file with a single command. To do this, you can add the following lines to the `pixi.toml` file:

```toml
[tasks]
# Build the package into the root directory
pack = "pixi run mojo package -o tests/matmojo.mojopkg src/matmojo"

# Run the test.mojo file
test = "pixi run pack && pixi run mojo run tests/test.mojo"
```

It is simply the commands we ran above. We define two tasks: `pack` and `test`:

- The `pack` task builds the package.
- The `test` task runs the `pack` task first and then runs the `test.mojo` file.

Now, you can use the `pixi run` command to build the package and run the test file in one go. Just type the following command in the terminal:

```bash
pixi run test
```

## Print the matrix

Although we have successfully created a `Matrix` instance and run the test file without any compilation errors, we cannot see the contents of the matrix. So the next priority is to implement a way to print the matrix in a human-readable format.

To do this, we can implement the `__str__()` method and the `write_to()` method for the `Matrix` struct. We have seen the functionality of these two methods in Chapter [Structs](../basic/structs.md). Moreover, we want some formatting for the output that:

1. The string representation of a matrix is in a grid-like format. Element in the same row will be printed in the same line, separated by tabs.
1. When we print the matrix using the `print()` function, we need to wrap it with square brackets `[]` to indicate that it is a matrix.

You can try yourself first. Below is my implementation of the two methods.

```mojo
# src/matmojo/matrix.mojo
    fn __str__(self) -> String:
        """Return a string representation of the matrix."""
        result = String("")
        for i in range(self.shape[0]):
            for j in range(self.shape[1]):
                result += String(self.data[i * self.strides[0] + j]) + "\t"
            if i < self.shape[0] - 1:
                result += "\n"
        return result

    fn write_to[W: Writer](self, mut writer: W):
        """Write the matrix to a writer."""
        for i in range(self.shape[0]):
            if i == 0:
                writer.write("[[\t")
            else:
                writer.write(" [\t")
            for j in range(self.shape[1]):
                writer.write(self.data[i * self.strides[0] + j])
                writer.write("\t")
            writer.write("]")
            if i < self.shape[0] - 1:
                writer.write("\n")
            else:
                writer.write("]")
```

Let's update our test file and see if it works:

```mojo
# tests/test.mojo
import matmojo as mm


def main():
    var mat = mm.matrix.Matrix[DType.float64](
        data=List[Float64](
            1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0
        ),
        shape=(3, 4),
    )

    print("String representation of the matrix:")
    print(String(mat))

    print("Printing the matrix directly:")
    print(mat)
```

Now, running the command `pixi run test` should give you the following output:

```console
String representation of the matrix:
1.0     2.0     3.0     4.0
5.0     6.0     7.0     8.0
9.0     10.0    11.0    12.0
Printing the matrix directly:
[[      1.0     2.0     3.0     4.0     ]
 [      5.0     6.0     7.0     8.0     ]
 [      9.0     10.0    11.0    12.0    ]]
```

It looks good! Now we know that the `Matrix` type is working as expected: it correctly initializes the matrix with the given data and shape.

::: info More comprehensive implementation

The methods above are not a comprehensive implementation, but it is sufficient for our Miji. If you want to put it into production, you need to also think about the following:

1. How many digits to print for each element, based on the data type of the matrix?
1. How to handle the case when the matrix is too large to fit in the console?
1. How to align the elements in the same column?
1. When we should print the elements in scientific notation?

:::
