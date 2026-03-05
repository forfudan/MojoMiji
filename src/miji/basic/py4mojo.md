# Use Python in Mojo

> Don't worry - What you've learnt will ultimately help you.  
> -- Yuhao Zhu, _Gate of Heaven_

"Is what I know about Python still useful in Mojo?" This is a common question for Pythonistas learning Mojo. The good news is: **Yes, you can use Python in Mojo!**

In this chapter, we'll explore how to import and use Python modules, call Python functions, create Python objects, and even leverage popular Python libraries like NumPy and Scipy from your Mojo code. The following topics will be covered:

- Use Python primitive types and functions
- Use Python standard library
- Use third-party Python libraries
- Virtual environments and Python dependencies
- Compiled part and interpreted part

::: warning Everything is an object

When learning Python, you may have heard the phrase "everything is an object". This means that in Python, all data types (including functions, classes, modules, etc.) are represented as objects. This is a fundamental concept in Python and is crucial for understanding how to interact with Python from Mojo.

:::

## Use Python primitive types

Let's begin with the basics - Python primitive types, such as integers (`int`), floating-point numbers (`float`), strings (`str`), lists (`list`), dictionaries (`dict`), and so on.

### Integers

As dicussed in the previous Chapter [Data Types](./types.md), the Mojo's `Int` type is very different from Python's `int` type: Mojo's `Int` is a fixed-size integer type with a specific value range, while Python's `int` is an arbitrary-precision integer type that can grow as much as needed to accommodate the value.

Thus, if you want to store a value that is too large for Mojo's `Int` type, you may consider using Python's `int` type instead.

Lucily, Mojo provides a seamless way to interact with Python's built-in types and functions. On the one hand, a Python interpreter will be installed alongside your Mojo installation, so you do not need to do anything extra work yourself; on the other hand, Mojo provides a `Python` module that allows you to import Python modules, create Python objects, call Python functions, and even evaluate Python expressions directly from your Mojo code.

To use a Python primitive type in Mojo, you just need to do two things:

**First**, import the `Python` struct from the `python` package at the top of your Mojo file:

```mojo
from python import Python
```

This `Python` struct provides various useful methods to interact with Python, which is almost like a **bridge** between Mojo and Python.

**Second**, use `Python.int()` to create a Python integer, just like what you do in Python. For example,

```mojo
var py_int = Python.int("43")
```

That is it, and that is all! You can then do arithmetic operations on `py_int` just like you do in Python. See the following example:

::: code-group

```mojo
# src/basic/py4mojo/use_py_int.mojo

from python import Python
from decimo import BInt  # For verification


def main():
    var py_int = Python.int(43)
    print("43^43 with Python's int:\n", py_int**py_int, end="\n\n", sep="")

    var mojo_int = Int(43)
    print(
        "43^43 with Mojo's Int:  \n", mojo_int**mojo_int, end="\n\n", sep=""
    )

    var decimo_int = BInt(43)
    print(
        "43^43 with Decimo's BInt:\n",
        decimo_int**decimo_int,
        end="\n\n",
        sep="",
    )
```

```python
# src/basic/py4mojo/use_py_int.py


def main():
    py_int = int(43)
    print("43^43 with Python's int:\n", py_int**py_int, end="\n\n", sep="")


main()
```

:::

This will print the following output:

```sh
43^43 with Python's int:
17343773367030267519903781288812032158308062539012091953077767198995507

43^43 with Mojo's Int:  
-4071272324936764365

43^43 with Decimo's BInt:
17343773367030267519903781288812032158308062539012091953077767198995507
```

As you can see from the output, using Mojo's `Int` type results in an overflow and gives us a negative number. Python helps us a lot here.

::: tip

We used [Decimo](../extend/decimo.md)'s `BInt` type in the above example to verify the result. Because `BInt` is also an arbitrary-precision integer type (written in pure Mojo), it generates the same result as Python's `int`.

Although Python' `int` and Decimo's `BInt` generate the same result, they still have some differences. We will continue with this topic at a later point of time in the Chapter.

:::

### Floating-point numbers

Similarly, we can create a Python floating-point number using `Python.float()`. For example:

::: code-group

```mojo
# src/basic/py4mojo/use_py_float.mojo

from python import Python


def main():
    var py_float = Python.float(200.808) / Python.float(12.34)
    print(
        "200.808 / 12.34 with Python's float:\n",
        py_float**py_float,
        end="\n\n",
        sep="",
    )

    var mojo_float = Float64(200.808) / Float64(12.34)
    print(
        "200.808 / 12.34 with Mojo's Float:  \n",
        mojo_float**mojo_float,
        end="\n\n",
        sep="",
    )
```

```python
# src/basic/py4mojo/use_py_float.py


def main():
    py_float = float(200.808) / float(12.34)
    print(
        "200.808 / 12.34 with Python's float:\n",
        py_float**py_float,
        end="\n\n",
        sep="",
    )


main()
```

:::

It will print the following output:

```sh
200.808 / 12.34 with Python's float:
5.177299519736755e+19

200.808 / 12.34 with Mojo's Float:  
5.177299519823977e+19
```

The results match perfectly, which is expected because both Python's `float` and Mojo's `Float64` are implemented using the IEEE 754 double-precision floating-point format, as mentioned in the Chapter [Data Types](./types.md#floating-point-numbers).

Therefore, for floating-point numbers, you **do not need** to use Python's `float` type, and Mojo's `Float64` type is sufficient for most use cases. However, if you need to use Python's `float` type for some reason, you can do so without any issues.

### Strings

You can also create a Python string using `Python.str()`. For example:

::: code-group

```mojo
# src/basic/py4mojo/use_py_str.mojo

from python import Python


def main():
    var py_str = Python.str("Hello, Python! 你好，蟒蛇！")
    print("Python's str, iterate and print each character:")
    for i in py_str:
        print(i, end="")

    print("\n")

    var mojo_str = String("Hello, Mojo! 你好，魔咒！")
    print("Mojo's String, iterate and print each character:")
    for i in mojo_str.codepoints():
        print(i, end="")
```

```python
# src/basic/py4mojo/use_py_str.py


def main():
    py_str = str("Hello, Python! 你好，蟒蛇！")
    print("Python's str, iterate and print each character:")
    for i in py_str:
        print(i, end="")

    print("\n")


main()
```

:::

It will print the following output:

```sh
Python's str, iterate and print each character:
Hello, Python! 你好，蟒蛇！

Mojo's String, iterate and print each character:
Hello, Mojo! 你好，魔咒！         
```

## PythonObject type

When you hover your mouse over the variables `py_int`, `py_float`, and `py_str` in the above examples, you will see that they are all of type `PythonObject`.

```sh
(variable) var py_int: PythonObject
(variable) var py_float: PythonObject
(variable) var py_str: PythonObject
```

This is because Mojo represents all Python objects as instances of the `PythonObject` type.

::: tip `PythonObject` is a Mojo struct

It may be a bit confusing at first, but `PythonObject` is actually a Mojo type (a struct) that serves as a wrapper for Python objects. It allows you to interact with Python objects from your Mojo code.

So a `PythonObject` instance is a Mojo struct that contains a reference to a Python object.

:::

When you use Python in Mojo, all Python types, functions, classes, modules, etc. are wrapped in a `PythonObject` instance. That is to say, if you hover your mouse over any Python related variables, classes, modules, functions, etc. in your Mojo code, you will see that they are all of type `PythonObject`.

This is a little bit inconvenient for you because you cannot get signatures, documentation, and type hints for Python objects in your Mojo code. You have to be familiar with the Python API and know how to use it in order to use Python in Mojo.

## Use Python built-in functions

Python has many built-in functions that are very useful. For example, the `len()` function can be used to get the length of a string, list, or dictionary. The `max()` function can be used to get the maximum value from a list of numbers. To use these Python built-in functions in Mojo, you can import the `builtins` module from Python and then call the functions as methods of the imported module. The function that imports a Python module into a Mojo object is,

```mojo
var py_module = Python.import_module("module_name")
```

This `import_module()` function takes the name of the Python module as a string ("module_name" in the example above) and returns a `PythonObject` that represents the imported module (`py_module` in the example above). You can then call the functions in the imported module as methods of the `py_module`. Note that, the built-in functions in Python are always automatically available (you do not need to specify a module name nor to import them), but to use them in Mojo, you still need to import the `builtins` module into the namespace. For example, to use the `max()` and `len()` functions in Python from your Mojo code, you can do the following:

```mojo

::: code-group

```mojo
# src/basic/py4mojo/use_py_functions.mojo

from python import Python


def main():
    var py = Python.import_module("builtins")
    var py_max = py.max(3, 5, 2, 8, 1)  # Call Python's built-in max function
    print(
        "The maximum value among (3, 5, 2, 8, 1) using Python's max():\n",
        py_max,
        end="\n\n",
    )

    var mojo_max = max(3, 5, 2, 8, 1)  # Call Mojo's built-in max function
    print(
        "The maximum value among (3, 5, 2, 8, 1) using Mojo's max():\n",
        mojo_max,
        end="\n\n",
    )

    var py_len = py.len(
        "Hello, world! 你好世界！"
    )  # Call Python's built-in len function
    print(
        "The length of 'Hello, world! 你好世界！' using Python's len():\n",
        py_len,
        end="\n\n",
    )

    var mojo_len = len(
        "Hello, world! 你好世界！"
    )  # Call Mojo's built-in len function
    print(
        "The length of 'Hello, world! 你好世界！' using Mojo's len():\n",
        mojo_len,
        end="\n\n",
    )
```

```python
# src/basic/py4mojo/use_py_function.py


def main():
    py_max = max(3, 5, 2, 8, 1)  # Call Python's built-in max function
    print(
        "The maximum value among (3, 5, 2, 8, 1) using Python's max():\n",
        py_max,
        end="\n\n",
    )

    py_len = len("Hello, world! 你好世界！")  # Call Python's built-in len function
    print(
        "The length of 'Hello, world! 你好世界！' using Python's len():\n",
        py_len,
        end="\n\n",
    )


main()
```

:::

Running the above code will print the following output:

```console
The maximum value among (3, 5, 2, 8, 1) using Python's max():
 8

The maximum value among (3, 5, 2, 8, 1) using Mojo's max():
 8

The length of 'Hello, world! 你好世界！' using Python's len():
 19

The length of 'Hello, world! 你好世界！' using Mojo's len():
 29
```

You can see that both Python's `max()` and Mojo's `max()` functions give us the same result, but Python's `len()` and Mojo's `len()` functions give us different results. This is because Python's `len()` function counts the number of characters (valid Unicode code points) in the string, while Mojo's `len()` function counts the number of bytes in the string. Since the string contains both ASCII characters and Chinese characters, the number of bytes is greater than the number of characters.

::: tip UTF-8 encoding for the example string

The string "Hello, world! 你好世界！" contains 19 characters, but it is encoded in UTF-8 as a sequence of bytes. The ASCII characters (H, e, l, o, ,, space, w, r, d, !, space) are each encoded as 1 byte, while the Chinese characters (你, 好, 世, 界) are each encoded as 3 bytes. Therefore, the total number of bytes is 14 (for the ASCII characters) + 5 * 3 (for the Chinese characters and punctuation) = 14 + 15 = 29 bytes. However, there are also some punctuation marks and spaces that may contribute to the byte count, which is why we get a total of 29 bytes when we call `len()` on the string in Mojo.

The following table shows the internal representation of the string "Hello, world! 你好世界！" in both Python and Mojo:

```console
# Mojo Miji - Data types - Internal representation of String "Hello, world! 你好世界！"
                        ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬────────────────────────────────┬────────────────────────────────┬────────────────────────────────┬────────────────────────────────┬────────────────────────────────┐
Code point (readable)   │    H     │    e     │    l     │    l     │    o     │    ,     │          │    w     │    o     │    r     │    l     │    d     │    !     │          │               你               │               好               │               世               │               界               │               ！               │
                        ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼────────────────────────────────┼────────────────────────────────┼────────────────────────────────┼────────────────────────────────┼────────────────────────────────┤
Unicode (hex)           │  U+0048  │  U+0065  │  U+006C  │  U+006C  │  U+006F  │  U+002C  │  U+0020  │  U+0077  │  U+006F  │  U+0072  │  U+006C  │  U+0064  │  U+0021  │  U+0020  │             U+4F60             │             U+597D             │             U+4E16             │             U+754C             │             U+FF01             │
                        ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┬──────────┬──────────┼──────────┬──────────┬──────────┼──────────┬──────────┬──────────┼──────────┬──────────┬──────────┼──────────┬──────────┬──────────┤
Byte view (decimal)     │    72    │   101    │   108    │   108    │   111    │    44    │    32    │   119    │   111    │   114    │   108    │   100    │    33    │    32    │   228    │   189    │   160    │   229    │   165    │   189    │   228    │   184    │   150    │   231    │   149    │   140    │   239    │   188    │   129    │
                        ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
Bit (binary)            │ 01001000 │ 01100101 │ 01101100 │ 01101100 │ 01101111 │ 00101100 │ 00100000 │ 01110111 │ 01101111 │ 01110010 │ 01101100 │ 01100100 │ 00100001 │ 00100000 │ 11100100 │ 10111101 │ 10100000 │ 11100101 │ 10100101 │ 10111101 │ 11100100 │ 10111000 │ 10010110 │ 11100111 │ 10010101 │ 10001100 │ 11101111 │ 10111100 │ 10000001 │
                        └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

For more details about how strings are represented in Python and Mojo, please refer to the Chapter [String](./string.md#utf-8-encoding).

:::

## Use Python standard library

To use other Python standard libraries in Mojo, you can also use the `Python.import_module()` function. This function takes the name of the module as a string and returns a `PythonObject` that represents the imported module. For example, to import the `decimal` module and use the `Decimal` class, you do the following:

::: code-group

```mojo
# src/basic/py4mojo/use_py_decimal.mojo

from python import Python
import decimo  # Pure Mojo implementation


def main():
    var decimal = Python.import_module("decimal")
    decimal.getcontext().prec = 36  # Set precision to 36 decimal places
    var py_pi = decimal.Decimal("3.1415926535897932384626433832795028841971")
    var py_e = decimal.Decimal("2.7182818284590452353602874713526624977572")
    var py_ratio = py_pi / py_e
    print(
        "The value of pi divided by e using Python's Decimal:\n",
        py_ratio,
        end="\n\n",
    )

    var mojo_pi = decimo.Decimal("3.1415926535897932384626433832795028841971")
    var mojo_e = decimo.Decimal("2.7182818284590452353602874713526624977572")
    var mojo_ratio = mojo_pi / mojo_e
    print(
        "The value of pi divided by e using Mojo's Decimal:\n",
        mojo_ratio,
    )
```

```python
# src/basic/py4mojo/use_py_decimal.py

import decimal


def main():
    decimal.getcontext().prec = 36  # Set precision to 36 decimal places
    py_pi = decimal.Decimal("3.1415926535897932384626433832795028841971")
    py_e = decimal.Decimal("2.7182818284590452353602874713526624977572")
    py_ratio = py_pi / py_e
    print(
        "The value of pi divided by e using Python's Decimal:\n",
        py_ratio,
        end="\n\n",
    )


main()
```

:::

Running the above code will print the output below. Both Python's `Decimal` and Mojo's `Decimal` give us the same result, which is expected because they are both implemented using the same algorithm for arbitrary-precision decimal arithmetic.

```sh
The value of pi divided by e using Python's Decimal:
 1.15572734979092171791009318331269630

The value of pi divided by e using Mojo's Decimal:
 1.15572734979092171791009318331269630
```

The way of using Python's packages or modules in Mojo, such as `decimal` in the above example, is very convenient and straightforward. The only difference is that you need to use

```mojo
decimal = Python.import_module("decimal")
```

in Mojo, instead of

```python
import decimal
```

in Python. After that, you can use the imported module `decimal` in Mojo just like how you use it in Python. Fantastic!

## Use Python third-party libraries

Using Python's third-party libraries in Mojo is also possible, and it is almost the same as using Python's standard libraries. The only difference is that you need to make sure that the third-party library is installed in your Mojo environment.

For example, if we want to use the popular third-party library NumPy in Mojo, we can first install it in our Mojo environment using pixi CLI:

```bash
pixi add numpy
```

After this, pixi will install NumPy to the local environment, and you can see that you have an extra line in `[dependencies]` section of your `pixi.toml` file, for example:

```toml
numpy = ">=2.4.2,<3"
```

Now we can go back to our Mojo code and import NumPy using `Python.import_module("numpy")`, just like how we import Python's standard libraries. For example:

::: code-group

```mojo
# src/basic/py4mojo/use_py_numpy.mojo

from python import Python


def main():
    var np = Python.import_module("numpy")
    var array_str = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
    var a = np.fromstring(array_str, sep=",").reshape(5, 2)
    var b = np.fromstring(array_str, sep=",").reshape(2, 5)
    var a_mul_b = np.matmul(a, b)

    print("Array a (5x2):\n", a, end="\n\n", sep="")
    print("Array b (2x5):\n", b, end="\n\n", sep="")
    print("Result of a * b:\n", a_mul_b, end="\n\n", sep="")
```

```python
# src/basic/py4mojo/use_py_numpy.py

import numpy as np


def main():
    array_str = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
    a = np.fromstring(array_str, sep=",").reshape(5, 2)
    b = np.fromstring(array_str, sep=",").reshape(2, 5)
    a_mul_b = np.matmul(a, b)

    print("Array a (5x2):\n", a, end="\n\n", sep="")
    print("Array b (2x5):\n", b, end="\n\n", sep="")
    print("Result of a * b:\n", a_mul_b, end="\n\n", sep="")


main()
```

:::

Both the Mojo and Python code will print the following output:

```txt
Array a (5x2):
[[ 1.  2.]
 [ 3.  4.]
 [ 5.  6.]
 [ 7.  8.]
 [ 9. 10.]]

Array b (2x5):
[[ 1.  2.  3.  4.  5.]
 [ 6.  7.  8.  9. 10.]]

Result of a * b:
[[ 13.  16.  19.  22.  25.]
 [ 27.  34.  41.  48.  55.]
 [ 41.  52.  63.  74.  85.]
 [ 55.  70.  85. 100. 115.]
 [ 69.  88. 107. 126. 145.]]
```

It is something exiting to see that we can use Python's powerful libraries in our Mojo code. This allows us to leverage the rich ecosystem of Python libraries and tools while still enjoying the performance benefits of Mojo. What's more, you never need to worry that your knowledge about Python will be wasted when you learn Mojo, because you can still use Python in Mojo!

## What happens under the hood?

When you call `Python.import_module("module_name")`, Mojo will look for the specified Python module or package in the environment that is installed alongside Mojo. If the module is found, it will be imported and wrapped in a `PythonObject` instance, which can then be used to call functions and access attributes of the module from your Mojo code.

This means that, when you use Python in Mojo, you are actually running Python code in a **Python interpreter** that is embedded within the Mojo runtime.

You may immediately ask: Wait, does this mean that the part of the code that uses Python will be interpreted instead of compiled? The answer is: Yes. The part of the code that interacts with Python (e.g., calling `Python.import_module()`, calling Python functions, etc.) will be interpreted at runtime. Meanwhile, the rest of the code that does not interact with Python will still be compiled and optimized by Mojo's compiler.

Everything comes with a cost. Using Python in Mojo is very convenient and allows you to leverage the rich ecosystem of Python libraries, but it also comes with some performance overhead due to the need to call into the Python interpreter. Moreover, since an Python interpreter is involved, you will not be able to copy-paste your compiled Mojo code to another machine and run it without installing Python.

Let's go back to the example before where we want to calculate the value of pi divided by e. The following code that involve Python's `decimal` module will be partially interpreted at runtime. This means that, although you build the code into a binary executable file via `pixi run mojo build`, the code can only run on machines that have Python (of a compatible version) installed.

```mojo
from python import Python


def main():
    var decimal = Python.import_module("decimal")
    decimal.getcontext().prec = 36  # Set precision to 36 decimal places
    var py_pi = decimal.Decimal("3.1415926535897932384626433832795028841971")
    var py_e = decimal.Decimal("2.7182818284590452353602874713526624977572")
    var py_ratio = py_pi / py_e
    print(
        "The value of pi divided by e using Python's Decimal:\n",
        py_ratio,
        end="\n\n",
    )
```

On the contrary, the following code that uses Mojo's `decimo` library will be fully compiled and optimized by Mojo's compiler, because `decimo` is written in pure Mojo. This means that you can copy-paste the compiled binary file to another machine and run it without installing Python.

```mojo
import decimo  # Pure Mojo implementation


def main():
    var mojo_pi = decimo.Decimal("3.1415926535897932384626433832795028841971")
    var mojo_e = decimo.Decimal("2.7182818284590452353602874713526624977572")
    var mojo_ratio = mojo_pi / mojo_e
    print(
        "The value of pi divided by e using Mojo's Decimal:\n",
        mojo_ratio,
    )
```

## Look into future

After learning the above content, you should have a good understanding of how to use Python in Mojo. You can use Python's built-in functions, standard libraries, and third-party libraries in your Mojo code, which allows you to leverage the rich ecosystem of Python while still enjoying the performance benefits of Mojo.

You can also form an educated guess about the future of Mojo and Python:

In the short term, we will continue to import many Python libraries into Mojo, as pure-Mojo counterparts of these libraries do not exist yet. Even though we need an interpreter to run the code that uses Python, it is still worth. Above all, "make it work" is the first priority.

In the middle term, we will see more and more pure-Mojo libraries being developed, which will allow us to replace the Python libraries with their Mojo counterparts. This will help us to reduce the performance overhead of using Python in Mojo and make our code more portable.

In the long term, most Python libraries will have their Mojo counterparts, and we will even be able to write Python packages in Mojo (currently most Python packages are written in C, C++, Rust, etc). However, even in this case, we may still want to use Python for some specific tasks because of its rich ecosystem and ease of use.
