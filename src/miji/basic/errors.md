# Error handling and raises

> Gold can't be pure and man can't be perfect.  
> --  DAI Fugu 戴復古 (Song Dynasty)

It is not uncommon to encounter errors in programming. Errors are not necessarily bad, but failing to handle them properly can lead to unexpected behaviors and bugs in your code. That is why most programming languages provide mechanisms to handle errors gracefully.

Mojo, as a Python-like language, inherits the error handling mechanism from Python but makes it stricter. This chapter will introduce you to the error handling mechanism in Mojo, including how to raise errors and how to handle them.

[[toc]]

## Errors are messages

Errors in Mojo are merely messages that the programmer want to convey to the users when a certain condition is met. They are not necessarily "wrong" or "bad", but rather a way to indicate that some operations are not allowed or undefined. The programmer will not make a decision for the users, but rather let them know that they need to handle the situation themselves.

A common example is division-by-zero error. Dividing a number by zero is mathematically **undefined**, but not necessarily "wrong". Depending on the use cases, you may want to use a certain number to replace the result, you may want to return a "infinity" value, or you may want to just abort the program. In this sense, the programmer should not make a decision for the users, but pass a message to the users that "this operation is undefined mathematically, please handle it and pick a solution that fits your use case".

This is also about the error handling mechanism in Mojo. It is not about "catching" errors and "fixing" them, but rather about letting the users know that something is not right and they need to handle it themselves. If they do not handle it, the program will abort with the message that the programmer has provided.

**The error messages in Mojo are represented by the built-in `Error` type**, which is actually composed of a pointer to a string and the length of it. If you are interested, you can check the source code of the `Error` struct in the [Mojo standard library](https://github.com/modular/modular/blob/main/mojo/stdlib/stdlib/builtin/error.mojo).

## Errors vs return types

We all know that any functions in Mojo has a return type. Even if the function does not return anything, it still has a implicit return type of `None`.

However, things are different when it comes to errors. When an error may occur in a function, calling the function would result in two scenarios:

1. The function works as expected and returns a value of the expected type which is announced in the function signature.
1. The function does not work as expected. The error message is presented to the user, which is wrapped in an `Error` type.

For example, the following function `divide` takes two integers and returns their division result as an integer. Note that when the second argument is zero, the function passes an error message to the user, indicating that division by zero is not allowed.

```mojo
# src/basic/errors/unhandled_error.mojo
def divide(x: Int, y: Int) -> Int:
    if y == 0:
        raise Error("Cannot divide by zero")
    else:
        return x // y


def main():
    var div1 = divide(10, 2)
    print("10 // 2 =", div1)
    var div2 = divide(10, 0)
    print("10 // 0 =", div2)
```

Running the above code will produce the following output:

```console
10 // 2 = 5
Unhandled exception caught during execution: Cannot divide by zero
```

The first call to `divide` works as expected and returns the result of `10 // 2`, which is `5`. The second call to `divide` leads to an abort of the program because the second argument is zero. The error message "Cannot divide by zero" is printed to the console.

Therefore, when a function may raise an error, it actually returns a container of two possible types: the expected return type and the `Error` type. In other words, the function signature may also look like this:

```mojo
# This is a pseudo-code, not valid Mojo code
def divide(x: Int, y: Int) -> PossibleResult[Int, Error]:
    if y == 0:
        return Error("Cannot divide by zero")
    else:
        return x // y
```

That is to say, the function `divide` actually returns a enumeration type `PossibleResult` that can be either an `Int` or an `Error`. You will not know which one it is until you run the code.

This kind of return type is clear and explicit and allows the users to quickly understand that a function may raise an error. It also drives the users to handle the error more actively. Some programming languages, such as Rust, use a similar approach to handle errors.

Python's syntax does not make this explicit. In Python, you never know whether a function will raise an error or not until you run the code or read the source code of the function. This is because Python uses exceptions to handle errors, which are not part of the function signature.

## `raises` in function signature

Mojo, as a Python-like language, inherits most of the syntax style from Python. It does not wrap the errors in a container as a returned type. However, it still tries to make the errors more explicit by using the `raises` keyword in the function signature when you define the function with the `fn` keyword. This keyword indicates that the function may raise an error, the users should be aware of it and handle it properly.

The `raises` keyword is placed before the return type. If a function does not return anything (`None`), the signature is located at the end of the signature. A general function signature with the `raises` keyword looks like this:

```mojo
fn foo(arg: Type) raises -> ReturnType:
    ...

fn foo(arg: Type) raises:
    ...
```

As we have seen in Chapter [Functions](../basic/functions), the only difference between a `fn` function and a `def` function is that the `fn` function requires you to explicitly use the `raises` keyword in the function signature, where the `def` function does not. That is way in the example above, we did not use the `raises` keyword in the function signature of `divide`, because it is defined with `def`.

In case we use the `fn` keyword to define the `divide` function, the example should be written as follows:

```mojo
# src/basic/errors/unhandled_error_with_raises_keyword.mojo
fn divide(x: Int, y: Int) raises -> Int:
    if y == 0:
        raise Error("Cannot divide by zero")
    else:
        return x // y


fn main() raises:
    var div1 = divide(10, 2)
    print("10 // 2 =", div1)
    var div2 = divide(10, 0)
    print("10 // 0 =", div2)
```

The function signature tells the users that the function `divide` may either return an `Int` type or return (raise) an `Error` type.

## Raise an error

Since errors are just a value that can be the result of a function, you need a keyword to pass it back to the caller but also differentiate it from the normal return value. In Mojo, you can use the `raise` keyword to pass error to the caller.

| Keyword  | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| `raise`  | Used to pass an error of `Error` type from a function to the caller.     |
| `return` | Used to pass a value of the expected type from a function to the caller. |

The `raise` keyword shares several similarities with the `return` keyword.

1. When the `raise` keyword is reached, the function will immediately stop executing and return to the caller.

::: tip Return but not raise an error

Since error is a Mojo type, you can also return an error using the `return` keyword. However, when you do so, Mojo will not treat it as an error, but rather as a normal return value. See the following example:

```mojo
def return_error() -> Error:
    return Error("This is an error message")


def main():
    try:
        print(return_error())
        print("No exception raised")
    except e:
        print("Caught an error:", e)
```

```console
This is an error message
No exception raised
```

:::
