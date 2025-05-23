# My first Mojo program

Now we have set up everything (finally). In this chapter, let's write our first Mojo program and run it.

[[toc]]

## Hello, world

Let's create a folder in our project directory called `src`. Then we create a file called `hello.mojo` in this folder. Your project directory should look like this:

```console
my-first-mojo-project
├── mojoproject.toml
└── src
    └── hello.mojo
```

We open the `hello.mojo` file and type the following code:

```mojo
def main():
    print("Hello, world!")
```

You may be surprised (or even a little bit disappointed) to see that the code is 100% identical to Python code. But yes, it is just the design philosophy of Mojo. It is designed to similar to Python, so that a Python user, like you, can learn it easily.

Now, let's run this code. You can type the following command in your terminal:

```bash
magic run mojo src/hello.mojo
```

And you will see the output:

```console
Hello, World!
```

Congratulations! You have successfully run your first Mojo program. 🎉

## What has happened?

You may ask have many questions in your mind: Why I have to define a function called `main()`? What happens when I run `magic run mojo src/hello.mojo`? What is the difference between `magic run mojo` and `python`?

Lets's answer these questions one by one.

### Function `main()`

This might be the first difference you notice between Mojo and Python. In Python, you can run code without defining a main function. However, in Mojo, you have to define a function called `main()` to run your code. By putting the code in the `main()` function, you tell Mojo that this is the entry point of your program.

::: tip `main()` function in Python

Some Python users also define a `main()` function in their Python code. But they have to write `main()` so that Python interpreter will run the code within the `main()` function. For example,

```python
def main():
    print("Hello, world!")
main()  # Run the main function
```

In Mojo, you do not need to write the last line.

:::

### Behind `magic run mojo file.mojo`

`magic run mojo file.mojo` is equal to `magic run mojo run file.mojo`. It directs Magic to run the Mojo compiler that is installed in your current environment (`.magic/envs`) and then asks Mojo compiler to run the `file.mojo` file.

You may find the second step similar to `python file.py`, where you ask Python interpreter to run the `file.py` file.
The output of running the `hello.mojo` file with Mojo is also the same as the output of running the `hello.py` file with Python.

However, there are some differences between `mojo file.mojo` and `python file.py`.

In Python, the software "Python" (we call it an "interpreter") reads the `file.py` file and executes the code in it. The python interpreter has to be kept running in the background in order to generate the output "hello, world!".

In Mojo, the software "Mojo" (we call it a "compiler") first reads the `file.mojo` file and compiles it into a binary executable file. Then, it runs the binary executable file to get the output. After compilation, the Mojo compiler is no longer needed. The binary executable file alone can generate the output "hello, world!".

Thus, in Mojo, `magic run mojo file.mojo` equals to the following two commands:

```bash
magic run mojo build src/hello.mojo
./hello
```

The first command complies the `hello.mojo` file into a binary executable file called `hello` in the root directory. The second command runs the `hello` file to get the output "hello, world!". You can test it in your terminal.

You can copy this "hello" file to another computer (same OS) and run it without installing Mojo. This is a feature that Python does not have.

## Next step

Now you have successfully run your first Mojo program. I believe that you cannot wait to write another mojo script. For example, something like this:

```mojo
def main():
    a = 1
    b = 2.0
    print(a + b)
```

Then, let's go to the next Part of the Miji, where we try two find out a quick path for you to migrate from the Pythonic world to the Magician world.
