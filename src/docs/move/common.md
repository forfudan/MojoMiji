# Things that are in common

In this chapter, I will discuss the things that are in common between Mojo and Python. For these features, you do not need to learn from scratch. You can just use the same knowledge you have in Python and apply it to Mojo.

[[toc]]

## Coding style

Mojo is designed to be similar to Python in terms of coding style. You can use the same coding style you have in Python in Mojo. For example, you can use the same indentation, comments, and naming conventions. Here is a summary:

| Feature              | Python and Mojo                          |
| -------------------- | ---------------------------------------- |
| Code blocks          | colon, indentation                       |
| Indentation          | 4 spaces (PEP 8)                         |
| Single-line comments | `#`                                      |
| Block comments       | consecutive single-line comments (PEP 8) |
| Documentation string | `""" """` or `''' '''`                   |
| Case-sensitive       | Yes                                      |

We go through these features one by one.

### Code blocks

The first feature is the code blocks. In Python, we use a colon (`:`) to indicate the start of a code block. The body of the code block is then intended with the same number of spaces, usually 4 spaces. For example:

```python
def main():
    print("Hello, world!")
```

This is exactly the same in Mojo. You can use the same code in Mojo:

```mojo
def code_block():
    print("We are in a code block")
```

Some people may find this indentation-sensitive style of coding a little bit annoying. For example, if you want to copy some code from one place to another, you have to make sure that the indentation is correct. Sometimes, for complicated code, it is very eye-unfriendly and prone to errors.

In some other languages, such as C, Java, and Go, they use curly braces (`{}`) to indicate the start and end of a code block. Other languages like Pascal and Lua uses `end` to indicate the end of a code block.

Both styles have their own advantages and disadvantages. I will not discuss them here. Since Mojo is designed to be similar to Python, we expect that the indentation-sensitive style will not be changed in the future. So, you have to get used to it.

::: info People want different things

Some people indeed proposes optional, alternative syntax for code blocks in Mojo. You may find these discussions of interest: [Issue #284](https://github.com/modular/modular/issues/284) and [Issue #2929](https://github.com/modular/modular/issues/2929).

:::

### Indentation

In Python, the standard indentation is 4 spaces. This is also the same in Mojo. In fact, you can also use any number of spaces or tabs to indent your code, as long as the indentation is consistent within the same level of code block. For example, the following code is also valid in Mojo. But don't do this.

```mojo
def main():
 print("One space is okay!")
 for _ in range(1):
      print("Five spaces is also okay!")
 for _ in range(1):
            print("Eleven spaces is also okay!")
```

### Comments

In Python, we use `#` to indicate a single-line comment. This is also the same in Mojo. For example:

```mojo
# This is a single-line comment
print("Hello, world!")  # This is also a single-line comment
```

In Python, we can also use consecutive single-line comments to indicate a block comment. The same applies to Mojo. For example:

```mojo
# This is a block comment
# This is also a block comment
# This is the last line of the block comment
```

You may also see some people using multi-line string literal to indicate a block comment. This is also valid in Mojo. For example:

```mojo
"""
This is a multi-line string literal
that spans multiple lines.
Some people use it as a block comment.
"""
```

But it is ***not recommended***. In fact, you will receive an warning if you do this Mojo. The compiler will tell that this is a multi-line string literal is unused.

### Documentation string

In Python, documentation string ("docstring") is multi-line string literal that is used to document a function, class, or module. Usually, it is placed at the beginning of the function, class, or module. For example:

```python
def bubble_sort(array: list[int]) -> list[int]:
    """Returns a sorted array using bubble sort algorithm.
    Args:
        array: The array to be sorted.
    Returns:
        The sorted array.
    """
    ...
```

In Mojo, the same applies. You can use the multi-line string literal to provide information about the functions, structs, and modules.

::: tip Docstring style guide

There are many styles of docstring in Python. Some people use Google style, some people use NumPy style, and some people use reStructuredText (reST) style.

Mojo has its own [docstring style guide](https://github.com/modular/modular/blob/main/mojo/stdlib/docs/docstring-style-guide.md). If you are interested in it, you can check it out now or later.

:::

### Case-sensitive

Both Python and Mojo are case-sensitive. This means that `hello`, `Hello`, and `HELLO` are three different identifiers. It also means that you can never run your code successfully if you use `IF` instead of `if` or `FOR` instead of `for`. For example, the following code is not even wrong.

```mojo
def main():
    a = 1
    IF A > 0:
        print("A is positive")
    ELSE:
        Print("A is not positive")
```

## Keywords

Keywords are reserved words with special meaning and purposes in a programming languages. They are a part of the syntax and cannot be used as identifiers, e.g., variable names, function names, etc. For example, `if`, `for`, `while`, `def`, `class`, etc. are the most common keywords in Python.

Mojo inherits most of the keywords from Python. In most cases, they have the same meaning and functionality. For example, `if`, `for`, `while`, `def`, `class`, `import`, `from`, `as`, `return`, `break`, `continue`, etc. are the same in both languages. Let's take a look at the keywords in Mojo.

### Control flow keywords

Control flow keywords are used to control the flow of execution in a program. They are used to make decisions (selections), repeat actions (iterations or loops), and handle exceptions.

#### Selection

For selection, we have `if`, `elif`, and `else` in both Python and Mojo. For example:

```mojo
def is_positive(a: Int):
    if a > 0:   
        print("A is positive")
    elif a == 0:
        print("A is zero")
    else:
        print("A is negative")
```

#### Iteration

For iteration, we have `for` and `while` in both Python and Mojo. For example, the following code prints the numbers from 0 to 4:

```mojo
def main():
    for i in range(5):
        print(i)
    
    i = 0
    while i < 5:
        print(i)
        i += 1
```

The `break` and `continue` keywords that are used to break out of a loop or skip the current iteration of a loop, respectively, are also valid in Mojo. For example, the following code prints the natural numbers from 1, but skips the number 3 and breaks out of the loop when it reaches 8:

```mojo
def main():
    i = 0
    while i < 10:
        i += 1
        if i == 3:
            continue
        if i == 8:
            break
        print(i, end=" ")
# Output: 1 2 4 5 6 7
```

The `for`-`else` and `while`-`else` statements are also valid in Mojo. The `else` block is executed when the loop terminates normally (i.e., not by a `break` statement). For example:

```mojo
def main():
    for i in range(5):
        print(i, end=" ")
    else:
        print("Loop terminated normally")
# Output: 0 1 2 3 4 Loop terminated normally
```

#### Exception handling

For exception handling, we have `try`, `except`, `finally`, and `raise` in both Python and Mojo. For example:

```mojo
def main():
    try:
        print("Hello, World!")
    except e:
        print(e)
        raise Error("An error occurred")
    else:
        print("No errors occurred")
    finally:
        print("Finally block executed")
```

We will discuss exception handling in detail in the later chapters.

### Definition keywords

Definition keywords are used to define variables, functions, structs, classes, etc.

#### Variable definition

In Python, we do not use any keyword to define variables. We just assign a value to a variable name. For example:

```python
def main():
    a = 1
    b = 2
```

In mojo, we have two approaches to define variables. The first one is the same as Python. We just assign value to a variable name. The second one is new in Mojo. We use the `var` keyword. For example:

```mojo
def main():
    a = 1
    var b = 2
```

Nevertheless, there is still some difference in the philosophy and behavior of variable declaration and assignment between Mojo and Python. For example, in Python, you can easily re-assign a variable to a new value with a different type. But in Mojo, you cannot do this. You can only re-assign a variable to a value with the same type. We will discuss this in detail in the later chapters ([variables](../basic/variables.md)).

::: info `let` keyword

Do you know that in early Mojo versions, there is also a `let` keyword to define immutable variables? The `let` keyword is now deprecated.

:::

#### Function definition

In Python, we use the `def` keyword to define a function. For example:

```python
def add(a: int, b: int) -> int:
    return a + b
```

In mojo, we also use the `def` keyword to define a function. For example:

```mojo
def add(a: Int, b: Int) -> Int:
    return a + b
```

Moreover, Mojo has another way to define a function, the `fn` keyword. For example:

```mojo
fn sub(a: Int, b: Int) -> Int:
    return a - b
```

The `def` keyword and the `fn` keyword share the most of the functionality. The main difference is in the default behavior of the arguments. If a function is defined with `fn`, the arguments are immutable by default, and you cannot change the values of the arguments within the function. If a function is defined with `def`, the arguments are immutable by default, but changing the values of the arguments will create a mutable copy of them. We will discuss this in detail in the later chapters ([functions](../basic/functions.md)).

#### Class definition

In Python, "class" is a core feature that reflect the philosophy of object-oriented programming (OOP), we use the `class` keyword to define a class. For example, we define a class called `Human` with two attributes, `name` and `age`, and a method called `greet()`. Then we construct an object of the class and call the method:

```python
class Human:
    name: str
    age: int

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def greet(self):
        print(f"Hello, world! I am {self.name} and I am {self.age} years old.")

def main():
    person = Human("Yuhao Zhu", 33)
    person.greet()

main()
```

This prints:

```console
Hello, world! I am Yuhao Zhu and I am 33 years old.
```

In Mojo, however, we do not have "class" (yet). Instead, we have "struct". A struct is a data structure that can contain multiple fields and methods. It is similar to a class, but it cannot be inherited. Structs are defined with the `struct` keyword. For example, we define a struct that achieves the same functionality as the `Human` class in Python:

```mojo
struct Human:
    var name: String
    var age: Int

    def __init__(out self, name: String, age: Int):
        self.name = name
        self.age = age

    def greet(self):
        print(String("Hello, world! I am {} and I am {} years old.").format(self.name, self.age))

def main():
    var person = Human("Yuhao Zhu", 33)
    person.greet()
```

It is mostly similar to the Python code. The main difference is that we have to use `var` to define the attributes of the struct, and we use `out` to modify the `self` parameter. We will discuss this in detail in the later chapters.

## Data types

### Basic data types

Basic data types are the most common data types in programming languages, they can be numeric. They are usually small in size, simple memory layout, and intuitive in meaning. For example, integers, floating-point numbers, strings, and booleans are the most common basic data types in almost all programming languages. In Python, these are `int`, `float`, `str`, and `bool`.

Mojo provides the corresponding basic data types as well. They behave almost the same as in Python. In most cases, you can use the these types without any issues. The following tables lists the basic data types in Python and their corresponding types in Mojo. Note that they are not exactly the same. We will discuss the differences in detail later ([Things that are different](./different.md)).

| Python type | Mojo type | Description           | Behavior                                 |
| ----------- | --------- | --------------------- | ---------------------------------------- |
| `int`       | `Int`     | Integer               | Mostly same when number is not too large |
| `float`     | `Float64` | Floating-point number | Mostly same                              |
| `str`       | `String`  | String                | Partially similar                        |
| `bool`      | `Bool`    | Boolean               | Mostly same                              |

### Composite data types

Composite data types are more complex data structures and may contain multiple basic types. They are usually larger in size, more complex memory layout, and more abstract in meaning. For example, lists, tuples, sets, and dictionaries are the most common advanced data types in Python. Mojo provides the corresponding advanced data types as well. The following table summarize these data structures. Unfortunately, you will see more difference in behavior and functionality between Mojo and Python. We will discuss the advanced data types in detail in the later chapters ([Things that are different](./different.md)).

| Python type | Mojo type          | Description                        | Behavior          |
| ----------- | ------------------ | ---------------------------------- | ----------------- |
| `list`      | `List`             | Dynamic allocated array of objects | Partially similar |
| `tuple`     | `Tuple`            | Immutable array of objects         | Mostly similar    |
| `set`       | `collections.Set`  | Unordered collection of objects    | Partially similar |
| `dict`      | `collections.Dict` | Key-value pairs                    | Partially similar |

## Operators

Operators are symbols that perform operations on one or more operands. They are fundamental building blocks of any programming language, including Mojo and Python. Operators allow you to perform calculations, comparisons, logical operations, and more. 

In Python, we have arithmetic operators (`+`, `-`, `*`, `/`, `%`, `**`), comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`), logical operators (`and`, `or`, `not`), bitwise operators (`&`, `|`, `^`, `~`), and assignment operators (`=`, `+=`, `-=`, etc.). In Mojo, we have **exactly the same operators** as in Python. They have the same meaning and functionality. Moreover, the **operator precedence and associativity** are also the same in both languages.

Another important feature of operators in Python is the **chained comparison**. This means that you can chain multiple comparison operators together, such as `a < b < c`, which is equivalent to `(a < b) and (b < c)`. This feature is also available in Mojo.

::: info More on operators

We will discuss operators in more detail in Chapter [Operators](../basic/operators.md).

:::

## Core functions

Many core functions in Python are also available in Mojo. Usually, they have the same name, same objectives, and even same arguments. For example, `print()`, `len()`, `range()`, `sum()`, `min()`, `max()`, etc. are almost the same in both languages.

AT the current stage, some of the functions in Mojo cannot achieve 100% functionality as in Python. For example, the `print()` function in Mojo does not support "f-string" formatting. You have to use the `format()` method of the `String` class. For example:

```mojo
def main():
    year = 2025
    print(f"It is {year} now!")  # This will not work
    print(String("It is {} now!").format(year))  # This will work
```

## Dunder methods

***Dunder methods***, which is short for "double underscore" methods, are special methods defined in Python functions that start and end with double underscores. The most popular dunder method, I believe, is `__init__()`, which is used to initialize an object. You should have learnt it in the first lesson on Python class. There are many other dunder methods, such as `__str__()`, `__repr__()`, `__add__()`, `__sub__()`, etc. They are used to implement certain universal behaviors and provide a uniformed interface to interact with objects.

For example, `__str__()` is used to define the string representation of an object. If you define a `__str__()` method in your class, you can use the function `print()` to print the object. Another example is `__add__()`, which is used to define the behavior of the `+` operator. If you define a `__add__()` method in your class, you can use the `+` operator to add two objects of the class. In another words, Python will first translate `a + b` into `a.__add__(b)` and then conduct the operation.

You see, dunder methods allows you to use the same function `print()` to print different objects, as long as these objects have the `__str__()` method defined. If you create a new class `Human`, you do not need to modify the system function `print()` in order to get it printed, but just add a `__str__()` method in the class `Human`.

Mojo also inherit this feature. You can use system functions like `print()`, `len()`, `sum()`, etc, on your own structs by defining the corresponding dunder methods. This is called "trait". A type that conforms to a trait guarantees that it implements all of the features of the trait. We will discuss this in detail in the later chapters.

## Modules, packages, and imports

In Python, modules are files that contain functions, classes, and variables. They are used to organize Python code into separate files and make it easier to manage and reuse code. Packages are directories that contain multiple modules (Python files). Usually, a `__init__.py` file is created in the package directory to indicate that this directory is a Python package. In there is another directory within a package directory, we call it a sub-package.

To import packages, module, functions, or classes into your current Python file, we use the `import` statement. For example, to import the built-in `math` module and the decimal class from the `decimal` module, we can use:

```python
import math
from decimal import Decimal
```

Mojo completely inherits the modules, package, an imports system from Python. Each Mojo file is a module, and each directory with `__init__.mojo` file is a package. You can use the same `import` statement or `import ... from ... as ...` statement to import modules, packages, functions, or structs into your Mojo file. For example:

```mojo
import math
from collections import Dict as BuiltInDict
```

## Next step

Now we have seen the things that are in common between Mojo and Python. I hope that, after reading this chapter, you will be confident that you can learn and master Mojo quickly. In the next chapter, we will discuss the things that are different between Mojo and Python.
