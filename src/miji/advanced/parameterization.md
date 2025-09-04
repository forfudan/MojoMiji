# Parameterization

Parametrization is not difficult, as you can see in this chapter soon. But it is a very powerful tool that allows us to improve the performance of our programs during execution. We do not have this feature in Python and, I have to say, it is not something that is mandatory to write a program to solve daily problems. So I put this topic in the advanced section of the Miji.

[[toc]]

## Compile time vs runtime

We have learnt this in the first Part of this Miji when we write our [first Mojo program](../start/hello.md): running a Mojo program takes two steps: **compile** and **run** (we can also say **build** and **execute**):

1. The first step **translates** the Mojo code into very efficient machine code. This period is called **compile time**. You can think that the compile time is when you type `pixi run mojo build file.mojo` in your terminal.
1. After that, the Mojo compiler is no longer needed, and the machine code can be **executed** alone on any machine that supports the architecture of the compiled code. This period is called **runtime**. You can think that the runtime is when you type `./file` in your terminal.

In our previous examples, we usually combine these step into one. So every time we run a Mojo program, we do one compile and one execute. However, this is only for tutorial purposes. In real life, we can compile our Mojo code once and then run it many, many times. Think of a game, a calculator, or a web server. We just run the executable file.

Since do do fewer compilations but more executions, a question arises: **can we shift some work from the run time to the compile time?** This is what parameterization is about.

Parametrization in Mojo is done via the concept "**parameter**". A parameter in Mojo is **a variable at compile time but is a constant at runtime**. How can this be achieved? The answer is that the compiler will replace the parameter with the value you provide at the compile time. When you execute the program, the parameter becomes a fixed value, and you cannot change it or assess it anymore.

## Parameterized functions

To understand how parameters work, let's start with "parameterized function". A parameterized function is a function that takes a parameter and uses it to generate code at compile time.

Let's see the following example. You ask the user to input three sentences. The first sentence is printed two times, the second sentence is printed four times, and the third sentence is printed six time. The code looks like this:

```mojo
# src/advanced/parameterization/print_sentences.mojo
def print_sentence_twice(sentence: String):
    for _i in range(2):
        print(sentence)

def print_sentence_four_times(sentence: String):
    for _i in range(4):
        print(sentence)

def print_sentence_six_times(sentence: String):
    for _i in range(6):
        print(sentence)

def main():
    var first_sentence = String(input("Please enter the first sentence: "))
    print_sentence_twice(first_sentence)

    var second_sentence = String(input("Please enter the second sentence: "))
    print_sentence_four_times(second_sentence)

    var third_sentence = String(input("Please enter the third sentence: "))
    print_sentence_six_times(third_sentence)
```

If we run this program, we will see that it works as expected. However, the code is not very efficient. We have three functions that do almost the same thing, and we have to write three times the same code. This is not good.

You must have come out with a better solution: we can write a single function that takes an argument for the number of times to print the sentence, as in the following code:

```mojo
# src/advanced/parameterization/print_sentences_argument.mojo
def print_sentence(sentence: String, times: Int):
    for _i in range(times):
        print(sentence)


def main():
    var first_sentence = String(input("Please enter the first sentence: "))
    print_sentence(first_sentence, times=2)

    var second_sentence = String(input("Please enter the second sentence: "))
    print_sentence(second_sentence, times=4)

    var third_sentence = String(input("Please enter the third sentence: "))
    print_sentence(third_sentence, times=6)
```

It is better. But we have another question:

At runtime, the only thing that users need to input is the sentences. The number of times to print each sentence is fixed: two, four, and six. The users cannot change them. Can we then make `times` argument a constant number at run time, so that there is no need to allocate memory for it?

Yes, we can. What we need to do is simply take the `times` argument out of the parentheses `()` and put it in the square brackets `[]`. In this way, it becomes a **parameter**. The code will look like this:

```mojo
# src/advanced/parameterization/print_sentences_parameter.mojo
def print_sentence[times: Int](sentence: String):
    for _i in range(times):
        print(sentence)


def main():
    var first_sentence = String(input("Please enter the first sentence: "))
    print_sentence[2](first_sentence)

    var second_sentence = String(input("Please enter the second sentence: "))
    print_sentence[4](second_sentence)

    var third_sentence = String(input("Please enter the third sentence: "))
    print_sentence[times=6](third_sentence)
```

That is it! Now, if you run this program, you will see that it works exactly the same as the previous one. However, the compiler will do more work at compile time:

- It will replace the `times` parameter everywhere in the body the function `print_sentence()` with the value you provide when you call the function.
- It will expand the code by doing this replacement for each value of `times` you provide. That is to say, there will be three copies of the function `print_sentence()` in the compiled code, each with a different value of `times`. Your code will be expanded to something similar to `src/advanced/print_sentences.mojo`.

::: tip Keyword parameters and positional parameters

Just like what we learnt in Chapter [Functions](../basic/functions.md) under Sections [Keyword arguments](../basic/functions.md#keyword-arguments) and [Positional arguments](../basic/functions.md#positional-arguments), you can also put the name of the parameter in the square brackets `[]` and make it a **keyword parameter**. This is useful when you have multiple parameters and you want to specify only some of them so that it is more readable. In the previous example, you can see that the last call to `print_sentence` uses a keyword parameter `times=6`.

:::

Below is an intuitive illustration of how the code is expanded at compile time. (Note that the real expansion is more complex, so the following code is just a general idea of how it works.)

```mojo
def print_sentence[times: Int](sentence: String):
    for _i in range(times):
        print(sentence)
```

is expanded to:

```mojo
# This is how the expanded code looks like, not that it is just a
def print_sentence_times_2(sentence: String):
    for _i in range(2):
        print(sentence)
    # # Or even this:
    # print(sentence)
    # print(sentence)

def print_sentence_times_4(sentence: String):
    for _i in range(4):
        print(sentence)

def print_sentence_times_6(sentence: String):
    for _i in range(6):
        print(sentence)
```

Since the times of print is constant at runtime, there is no need to create a variable for it. Moreover, the loops can also be unfolded by the compiler at compile time. So the code is more efficient in terms of memory and speed.

::: info parameter and macro

You may find that the parameter is pretty similar to the macro in C/C++. In fact, they both serve the same purpose: write code that generates code. However, the parameters in Mojo is much easier to use and more flexible.

:::

## Advantages of parameterization

The main advantage of parameterization is that it allows you to shift some work from runtime to compile time. It make take more time to compile the code, but it will make the runtime faster. Since the final executable is expected to run many times or by many people, the overall social benefit is positive.

Moreover, by moving some work to compile time, you can also take advantage of the compiler's **optimizations**: The Mojo compiler analyzes the code your wrote, and see whether some values can be re-used, some calculations can be simplified, or some code can be removed. It can also do some early calculations and replace the code with the results before the run time.

## Parameterized data structures

Some data structures (defined by the `struct` keyword) in Mojo can also be parameterized. For example, the `SIMD` type is stored on stack and can not be resized at runtime. This means that when you declare a `SIMD` instance in Mojo, you have to specify the size of it. However, arguments are evaluated at runtime, you can only do that via a parameter.

Remember that in the [SIMD chapter](./simd.md), we have seen the following code:

```mojo
# src/advanced/simd/create_simd.mojo
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

Actually the data type and the numbers we put in the square brackets `[]` of the `SIMD` constructor are just "parameters". They indicate the data types and sizes of the SIMD instances. The compiler will replace it with the value you provide at compile time, and then generate the code for that specific size. When you run the executable, SIMD instances of fixed datatype and fixed sizes are created on the stack.

Just like in a function call, you can use keyword parameters in the `SIMD` constructor. The constructors in the previous example can also be written as:

```mojo
# src/advanced/parameterization/create_simd_with_keyword_parameters.mojo
def main():
    var a = SIMD[dtype = DType.float64, size=4](1.0, 2.0, 3.0, 4.0)
    var b = SIMD[dtype = DType.int64, size=8](
        89, 117, 104, 97, 111, 90, 104, 117
    )
    var c = SIMD[dtype = DType.bool, size=2](True, False)
    var d = SIMD[dtype = DType.uint8, size=8](1, 2, 3, 4)
    var e = SIMD[dtype = DType.float32, size=1](1.0)

    print("a =", a)
    print("b =", b)
    print("c =", c)
    print("d =", d)
    print("e =", e)
```

## Next step

Now you have a basic understanding of how parameterization works in Mojo. You can use it to write more efficient code. However, it is not the end of the story. There is another, yet more powerful, concept called **generics** in Mojo. It can further improve the efficiency and readability of your code, and can make your code more Pythonic.
