# Wishes

Here are some features that I wish Mojo could have in the future. These are not necessarily bugs or issues, but rather enhancements that could improve the user experience and make Mojo more powerful and flexible in this AI era.

## Optional block ending keyword

I wish Mojo could support an optional block ending keyword, such as `end` or `done`, to make auto-formatting more convenient. Consider that `end` is ready a common argument name in some functions, so `done` may be a better choice. Some Pythonistas use `pass` as a block ending keyword in the Python code, which is useful to detect mis-indentation in some cases, but it is not always working.

For example, we have the following code:

```mojo
fn main():
    var a = 5
    var b = 10
    for i in range(3):
       print(a)
    if a < b:
        print("a is less than b")
```

If we want to copy the first for-loop block to another place, let's say into the code block of `if a < b:`, we have to manually add the indentation for the copied block by one level. This is because Mojo is indentation-sensitive, but the copied block will have two possible and valid indentations:

1. The original indentation of the copied block, which is outside the `if` statement.
1. One more level of indentation of the copied block, which is inside the `if` statement.

```mojo
fn main():
    var a = 5
    var b = 10
    for i in range(3):
       print(a)
    if a < b:
        print("a is less than b")
        for i in range(3):
        print(a)
```

or

```mojo
fn main():
    var a = 5
    var b = 10
    for i in range(3):
       print(a)
    if a < b:
        print("a is less than b")
    for i in range(3):
    print(a)
```

This is a simple case, so manual indentation is not a big deal. However, if we have a more complex code with multiple nested blocks, it will be very inconvenient to copy and paste the blocks and do manual adjustments ourselves.

Nowadays, we also rely on AI tools to help us with code generation or revision. These generated code may not be indented correctly, and we have to manually adjust the indentation. This is prone to errors and may lead to unexpected behaviors. For example, if the indentation is not desired but the code runs anyway, just like the example above.

An optional block ending keyword can help us avoid this problem. We can simply copy the block and paste it anywhere we want, without worrying about the indentation. The formatter will infer from the block ending keyword and automatically indent the block correctly. The first example, when added with the `done` keyword, will look like this:

```mojo
fn main():
    var a = 5
    var b = 10
    for i in range(3):
       print(a)
    done
    if a < b:
        print("a is less than b")
    done
done
```

Let's do the copying of the for-loop again:

```mojo
fn main():
    var a = 5
    var b = 10
    for i in range(3):
       print(a)
    done
    if a < b:
        print("a is less than b")
    for i in range(3):
       print(a)
    done
    done
done
```

Since there is a `done` keyword at the end of the code block of the if-statement, and we copied the code block of for-statement before the `done` keyword, the formatter will understand that the copied block is a nested one and will be automatically indented by one level. 

This way, we can avoid manual indentation and reduce the risk of errors.

The ending keyword is not mandatory, but optional. So it is ignored by the compiler, but will be used by the formatter to format the code or by the linter to check whether the indentation is correct.

Moreover, the Mojo extension in VS Code can also use inlay hints to show the ending keyword at the end of each block, so that we can easily check whether the indentation is correct or not.
