# Generic and traits

Parametrization is about setting the value of a certain type to be fixed at run time. We can also extend this idea to set a **type with a certain feature** to be fixed at run time. This is about **generic**.

**Generic** is a model that allows you to write code that can operate on different types, improving maintainability, readability, and extensibility of your code.

::: info Compatible Mojo version

This chapter is compatible with Mojo v25.4 (2025-06-18).

:::

[[toc]]

## Generic

What is generic? What is generic good? Let's answer these questions with a simple example.

In `src/advanced/generic/favorite_food.mojo`, we define three different types of animals: `Cat`, `Bird`, and `Human`. Each animal type has a `name` property,  a `food` property, a `get_name()` method that returns the name of the animal as a string, and a `speech()` method that returns a string representing what they have said about their favorite food (note that different animal has different way of greetings).

Then, we create three functions that print the name of the speaker and what they said on display.

```mojo
# src/advanced/generic/favorite_food.mojo
struct Cat:
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Meow! I love {}.").format(self.food)


struct Bird:
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Bugubugu! I love {}.").format(self.food)


struct Human:
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Hi! I love {}.").format(self.food)


def cat_says_what(animal: Cat):
    print(animal.get_name(), "says:", animal.speech())


def bird_says_what(animal: Bird):
    print(animal.get_name(), "says:", animal.speech())


def human_says_what(animal: Human):
    print(animal.get_name(), "says:", animal.speech())


def main():
    saku = Cat("Saku", "chicken")
    bili = Bird("Bili", "worms")
    yuhao = Human(
        "Yuhao",
        (
            "生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai"
            " and Suzhou"
        ),
    )

    cat_says_what(saku)
    bird_says_what(bili)
    human_says_what(yuhao)
```

If we run this code, we will get the following output:

```console
Saku says: Meow! I love chicken.
Bili says: Bugubugu! I love worms.
Yuhao says: Hi! I love 生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai and Suzhou.
```

This is expected, but then, another animal comes, a `Dog`.

```mojo
...

struct Dog():
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Auuuuuw! I love {}.").format(self.food)
```

To achieve the same result, we need to write another function `dog_says_what()`:

```mojo
def dog_says_what(dog: Dog):
    print(dog.get_name(), "says:", dog.speech())
```

Here comes a problem. If we constantly add new animals, we will need to write a new function `who_says_what()` for each animal. But the code within the body of the functions `cat_says_what()`, `bird_says_what()`, and `human_says_what()` are **completely identical**!

Why can't we just re-use the same code for all animal types?

It seems not possible, using what we have learned so far. Because Mojo is a statically typed language, the type of the input argument of a function must be known at compile time. We cannot write a function without specifying a concrete type for the input argument.

In order to solve this problem, Mojo introduces the powerful tool, "**generic**".

The core idea behind generic is to allow you pass any type into a function, as long as the types meet certain requirements. In our example, the types should at least have (1) a `get_name()` method that returns a string and (2) a `speech()` method that returns a string. The generic function can be written in the following format:

```mojo
# Psuedo code
def who_say_what(animal: CertainType):  where the CertainType must have a `name` field and a `speech()` method
    print(animal.name, "says:", animal.speech())
```

Then you can call this function with anu type that meets the requirements, `who_say_what(cat)`, `who_say_what(bird)`, `who_say_what(human)`, and `who_say_what(dog)`.

But in the code above, the requirements are specified in **English**, which is not understandable by the compiler. We have to use a more formal way to do this, which is called **traits**.

## Traits

**Traits** to types are just like types to values. They are a way to specify and regulates the behavior of types, e.g., what fields are required, what methods are needed. If a type meets the requirements of a trait, we say that the type **conforms** to the trait.

::: warning

Until Mojo version 25.3, fields in traits are not supported yet. Thus, you cannot define a field in a trait. You can only define methods in a trait. In the future, fields will be supported in traits, and you will be able to define a field in a trait.

That explains why, in our example, we have to define a method `get_name()` in the trait in all structs. It is because we cannot use `animal.name` directly in the generic function.

:::

Defining a trait is similar to defining a struct. We use the keyword `trait`:

```mojo
# src/advanced/generic/favorite_food_with_trait.mojo
trait Animal():
    def get_name(self) -> String:
        ...

    def speech(self) -> String:
        ...
```

It looks very similar to a struct. The main difference is that:

- We do not need to define any fields but only methods.
- We do not need to provide an implementation for the methods. We only need to define the method signature, including the method name, the input arguments, and the return type.
- We use `...` to indicate that we do not provide a concrete implementation for the method. It is just a **placeholder**. The code  will be provided by the types that implement the trait.

Thus, you can think of **a trait as a prototype, a template, or a placeholder for types** that implement the trait.

Now, we can re-write our pseudo code above into a valid generic function `who_says_what()` that takes any type that meets the requirements in the `Animal` trait (in other words, any type that implements the `Animal` trait).

```mojo
def who_says_what[CertainType: Animal](animal: CertainType):
    print(animal.get_name(), "says:", animal.speech())
```

To read this, we should say: The argument `animal` is of type `CertainType`, where the `CertainType` must implement (all the methods defined in) the `Animal` trait.

Yep, it is just like the English sentence in the pseudo code we wrote above, but now it is not a natural language, but a formal language that the Mojo compiler can understand. Note that the trait must be specified in the square brackets `[]` after the function name.

Finally, we can re-write the `main()` function to use the generic function `who_says_what()`. The complete code is as follows:

```mojo
# src/advanced/generic/favorite_food_with_trait.mojo
trait Animal:
    def get_name(self) -> String:
        ...

    def speech(self) -> String:
        ...


struct Cat(Animal):  # Explicitly specify that Cat implements the Animal trait
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Meow! I love {}.").format(self.food)


struct Bird(Animal):  # Explicitly specify that Bird implements the Animal trait
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Bugubugu! I love {}.").format(self.food)


struct Human(
    Animal
):  # Explicitly specify that Human implements the Animal trait
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Hi! I love {}.").format(self.food)


def who_says_what[CertainType: Animal](animal: CertainType):
    print(animal.get_name(), "says:", animal.speech())


def main():
    saku = Cat("Saku", "chicken")
    bili = Bird("Bili", "worms")
    yuhao = Human(
        "Yuhao",
        (
            "生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai"
            " and Suzhou"
        ),
    )

    who_says_what(saku)
    who_says_what(bili)
    who_says_what(yuhao)
```

If we run this code, we will get the same output as before.

::: tip Name of the generic type

In the code above, I use `CertainType` as the name of the generic type. It is just a placeholder, and you can use any valid identifier you like. During compilation, the Mojo compiler will automatically replace this placeholder with the actual type names.

In practice, you probably will never see such a long name as `CertainType`. Instead, you will see shorter names like `T`, `U`, or `V`. For example, you can write the function as:

```mojo
def who_says_what[T: Animal](animal: T):
    print(animal.get_name(), "says:", animal.speech())
```

:::

By using generic, we can now easily add new animal types without having to write new functions, as long as the new type implements the `Animal` trait. For example,

```mojo
def main():
    saku = Cat("Saku", "chicken")
    bili = Bird("Bili", "worms")
    yuhao = Human("Yuhao", "生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai and Suzhou")
    jimi = Dog("Jimi", "bones")
    wia = Wolf("Wia", "meat")

    who_says_what(saku)
    who_says_what(bili)
    who_says_what(yuhao)
    who_says_what(jimi)
    who_says_what(wia)
```

::: tip Implicitly implementing traits before Mojo v25.4

In the code in `src/advanced/generic/favorite_food_with_trait.mojo`, we explicitly put the trait name `Animal` in the parentheses after the struct name, like `struct Cat(Animal):`, `struct Bird(Animal):`, `struct Human(Animal):`. This is called **explicit trait declaration**. It means that the `Cat` struct explicitly declares that it implements the `Animal` trait.

In historical Mojo versions before v25.4, explicit trait declaration was **optional**. You can also write the struct without explicitly declaring the trait, like `struct Cat():`, `struct Bird():`, and `struct Human():`. If the a struct implements all the methods defined in the `Animal` trait, the Mojo compiler will **automatically** add the trait information to the struct for you. This is called **conforming to a trait implicitly**.

From Mojo v25.4, this implicit trait declaration was deprecated. If you do so, you will see a warning message like this:

```console
warning: struct 'Human' utilizes conformance to trait 'Animal' but does not explicitly declare it (implicit conformance is deprecated)
struct Human:  # Explicitly specify that Human implements the Animal trait
       ^
```

:::

## What compiler does with generic

When the Mojo compiler sees a generic function, it will automatically generate a specialized version of the function for each type that is used as an argument. It is similar to what we have done in the first example, `src/advanced/generic/favorite_food.mojo`, where we wrote a function for each type of animal. But now, it is done automatically by the compiler. So,

```mojo
def who_says_what[CertainType: Animal](animal: CertainType):
    print(animal.get_name(), "says:", animal.speech())
```

is expanded into:

```mojo
def who_says_what_Human(animal: Human):
    print(animal.get_name(), "says:", animal.speech())

def who_says_what_Cat(animal: Cat):
    print(animal.get_name(), "says:", animal.speech())

def who_says_what_Bird(animal: Bird):
    print(animal.get_name(), "says:", animal.speech())
```

## Use multiple traits in one struct

Sometimes, you may want to specify multiple traits for a generic type. You can do this by separating the trait names with a comma in the square brackets. For example, if we have another trait `Measurable` that requires a `length()` method, we can write:

```mojo
# src/advanced/generic/favorite_food_with_multiple_traits.mojo
trait Animal:
    def get_name(self) -> String:
        ...

    def speech(self) -> String:
        ...


trait Measurable:
    def length(self) -> Int:
        ...


struct Cat(Animal, Measurable):
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Meow! I love {}.").format(self.food)

    def length(self) -> Int:
        return len(self.name)


struct Bird(Animal, Measurable):
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Bugubugu! I love {}.").format(self.food)

    def length(self) -> Int:
        return len(self.food)


struct Human(Animal, Measurable):
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Hi! I love {}.").format(self.food)

    def length(self) -> Int:
        return len(self.name) + len(self.food)


def who_says_what[T: Animal](animal: T):
    print(animal.get_name(), "says:", animal.speech())


def mysterious_number[U: Measurable](animal: U):
    print("The mysterious number of me is:", animal.length())


def main():
    saku = Cat("Saku", "chicken")
    bili = Bird("Bili", "worms")
    yuhao = Human(
        "Yuhao",
        (
            "生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai"
            " and Suzhou"
        ),
    )

    who_says_what(saku)
    mysterious_number(saku)
    who_says_what(bili)
    mysterious_number(bili)
    who_says_what(yuhao)
    mysterious_number(yuhao)
```

In this example, each struct implements both the `Animal` trait and the `Measurable` trait. The generic function `who_says_what()` requires the type to implement the `Animal` trait, while the function `mysterious_number()` requires the type to implement the `Measurable` trait.

When we run this code, we will get the following output:

```console
Saku says: Meow! I love chicken.
The mysterious number of me is: 4
Bili says: Bugubugu! I love worms.
The mysterious number of me is: 5
Yuhao says: Hi! I love 生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai and Suzhou.
The mysterious number of me is: 88
```

## Use multiple traits for one type in functions

In the previous example, we defined two functions, `who_says_what()` and `mysterious_number()`, to print some information about the animal.

```mojo
def who_says_what[T: Animal](animal: T):
    print(animal.get_name(), "says:", animal.speech())

def mysterious_number[U: Measurable](animal: U):
    print("The mysterious number of me is:", animal.length())
```

You may wonder if we can combine these two functions into one. Yes, we can. In this case, the type `T` must simultaneously implement both the `Animal` trait and the `Measurable` trait. This is allowed in Mojo. You just need to use the `&` operator to combine the two traits in the type parameter declaration, like this:

```mojo
def who_says_what[T: Animal & Measurable](animal: T):
    print(animal.get_name(), "says:", animal.speech())
    print("The mysterious number of me is: ", animal.length())
```

In the code, we use `T: Animal & Measurable` to indicate that the type `T` must conform to both the `Animal` trait and the `Measurable` trait. In other words, the type `T` must implement all the methods defined in both traits, *i.e.*, `get_name()`, `speech()`, and `length()`.

The complete code is as follows:

```mojo
# src/advanced/generic/use_multiple_traits_for_one_type_in_functions.mojo
trait Animal:
    def get_name(self) -> String:
        ...

    def speech(self) -> String:
        ...


trait Measurable:
    def length(self) -> Int:
        ...


struct Cat(Animal, Measurable):
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Meow! I love {}.").format(self.food)

    def length(self) -> Int:
        return len(self.name)


struct Bird(Animal, Measurable):
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Bugubugu! I love {}.").format(self.food)

    def length(self) -> Int:
        return len(self.food)


struct Human(Animal, Measurable):
    var name: String
    var food: String

    def __init__(out self, name: String, food: String):
        self.name = name
        self.food = food

    def get_name(self) -> String:
        return self.name

    def speech(self) -> String:
        return String("Hi! I love {}.").format(self.food)

    def length(self) -> Int:
        return len(self.name) + len(self.food)


def who_says_what[T: Animal & Measurable](animal: T):
    print(animal.get_name(), "says:", animal.speech())
    print("The mysterious number of me is: ", animal.length())


def main():
    saku = Cat("Saku", "chicken")
    bili = Bird("Bili", "worms")
    yuhao = Human(
        "Yuhao",
        (
            "生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai"
            " and Suzhou"
        ),
    )

    who_says_what(saku)
    who_says_what(bili)
    who_says_what(yuhao)
```

Note that we do not need to define the `mysterious_number()` function anymore, because it is now combined into the `who_says_what()` function. The output is identical to the previous example:

```console
Saku says: Meow! I love chicken.
The mysterious number of me is:  4
Bili says: Bugubugu! I love worms.
The mysterious number of me is:  5
Yuhao says: Hi! I love 生煎包 (sanci moedeu), a pan-fried baozi which is popular in Shanghai and Suzhou.
The mysterious number of me is:  88
```

::: tip Combining traits before Mojo v25.4

Before Mojo v25.4, combining multiple traits *ad hoc* in a type parameter declaration is not possible. You have to first declare a new trait that combines all the required methods from the other traits. For example, the built-in `Comparable` trait is defined as:

```mojo
# Mojo v25.3 standard library
# mojo/stdlib/src/builtin/comparable.mojo
trait Comparable(
    EqualityComparable,
    LessThanComparable,
    GreaterThanComparable,
    LessThanOrEqualComparable,
    GreaterThanOrEqualComparable,
):
    """A type which can be compared with other instances of itself."""
```

From Mojo v25.4, you can use the `&` operator to combine multiple traits in a type parameter declaration, which is more concise and readable. Due to this change, the built-in `Comparable` trait becomes an trait alias of the combined traits:

```mojo
# Mojo v25.4 standard library
# mojo/stdlib/stdlib/builtin/comparable.mojo
alias Comparable = EqualityComparable & LessThanComparable & GreaterThanComparable & LessThanOrEqualComparable & GreaterThanOrEqualComparable
"""A type which can be compared with other instances of itself."""
```

:::

## Python vs Mojo in generic

As a Pythonista, you may have heard about a concept called "duck typing", which means that:

It is the methods that an object owns that determines whether it is of a certain type, but not how the object is defined in the `class` block or whether several objects are inherited from the same parent.

For example, if an object has a method `eat()`, a method `walk()`, a method `speak()`, and a method `think()`, then it is considered to be of the type "human", even though it is not defined in a class called `Human`. If the `print()` function can be applied on several objects, then these objects all belong to the same type "printable", even though they are not belonging to the same class or inherited from the same parent class.

You may still use the idea of duck typing in Mojo, but replace it by **traits**: If several types implement the same methods, they can be considered to be of the same trait. You can use the trait to write generic functions that can operate on all these types.

## Built-in traits in Mojo

Mojo provides quite a lot of built-in traits that you can use in your code. Sometimes, you may even not aware that you are using them. For example, many dunder methods, such as `__str__()`, `__repr__()`, `__absable__()`, `__gt__()`, etc., are actually implementing the built-in traits. Some non-dunder methods, such as `write_to()`, also implement the built-in traits.

Let's look it one of these built-in traits, `Absable`, which is used to take the absolute value of a number. Types that conform to the `Absable` trait can be used with the built-in function `abs()` to get the absolute value of the number. See the following example:

```mojo
# src/advanced/generic/absable_trait.mojo
def main():
    var a = -1
    var b = -0.5
    var c = String("Hello, Mojo!")
    print(abs(a))  # Output: 1
    print(abs(b))  # Output: 0.5
```

The Mojo developer cannot write `abs()` function for every type of number, such as `Int`, `Float`, `Complex`, etc. It is not practical and not extensible. Instead, Mojo internal does the following:

First, it provides a built-in trait called `Absable`, which requires the type to implement the dunder method `__abs__()` that returns the absolute value (or magnitude, distance from zero) of the number. A simple illustration of the `Absable` trait is as follows:

```mojo
# Mojo v25.4 standard library
# mojo/stdlib/stdlib/builtin/math.mojo
# Some code omitted for brevity
struct Absable():
    def __abs__(self) -> Self:
        ...
```

Then, it provides a built-in function `abs()` that takes any type that implements the `Absable` trait and calls the `__abs__()` method to get the absolute value. A simple illustration of the `abs()` function is as follows:

```mojo
# Mojo v25.4 standard library
# mojo/stdlib/stdlib/builtin/math.mojo
# Some code omitted for brevity
struct Absable():
fn abs[T: Absable](value: T) -> T:
    return value.__abs__()
```

Finally, define the dunder method `__abs__()` in each type that support a model of absolute value, such as `Int`, `Float`, `Complex`, etc. For example, the `Int` type implements the `Absable` trait as follows:

```mojo
# Mojo v25.4 standard library
# mojo/stdlib/stdlib/builtin/int.mojo
# Some code omitted for brevity
struct Int(
    Absable,
    ...
):
    fn __abs__(self) -> Self:
        return select(self < 0, -self, self)
```

If a type does not implement the `Absable` trait, it cannot be used with the `abs()` function. For example, if we try to take the absolute value of a string, we will get a compilation error:

```mojo
def main():
    var c = String("Hello, Mojo!")
    print(abs(c))
```

```console
error: invalid call to 'abs': could not deduce parameter 'T' of callee 'abs'
    print(abs(c))
          ~~~^~~
note: failed to infer parameter 'T', argument type 'String' does not conform to trait 'Absable'
    print(abs(c))
              ^
```

::: tip Dunders in Python

You may be familiar these dunder methods and built-in functions. You may also once defined these dunders to allow other users to apply the built-in functions on your custom types. Yes, your knowledge of Python's dunder methods and built-in functions can be directly applied to Mojo. Although Mojo will do some checks on the types and traits during compile time, while Python checks the methods at run time, the final coding style is identical.

This is another reason why Mojo is so Pythonic.

:::

## Dunder methods and built-in functions

The examples above show that you can utilize the built-in functions by defining your own dunder methods. The dunder methods are entry points for universal built-in functions, which are provided by the Mojo, to work on your custom types. This feature is very powerful, as it allows users to use their familiar built-in functions on any new types of values they encounter.

For example, when you see a variable `v` of the `Vector` type. Even though you have never learnt about the details of the `Vector` type, you can still, naturally, use the built-in functions like `print(v)` to display it on your screen, `len(v)` to get the number of item, and `for i in v:` to iterate over the items in the vector.

On the other hand, if you want the other users to access your custom type with the built-in functions, you need to implement the corresponding dunder methods in your type. For example, if you want others to use the `len()` function to get the length of your type, you need to implement the `__len__()` method in your type, which conforms to the built-in trait `Sizable`. The same applies to other built-in functions and even operators, such as `str()`, `repr()`, `int()`, `float()`, `+`, `>=`, etc. To emphasize,

**Defining dunder methods in your structs is a way to conform to the built-in traits and to make use of the built-in functions.**

You may remember that we have already discussed this topic in Section [Basic methods](../basic/structs#basic-methods) of Chapter [Structs](../basic/structs.md). But let's rewind a bit and take a look at another example.

In the following example, we define a custom type `Pixel` that represents a pixel in a 2D space with `x` and `y` coordinates. In order to display the pixel in a human-readable format, we want to (1) define the string representation of the pixel, (2) call the built-in `String()` constructor to convert the pixel to its string representation, and (3) print the string representation of the pixel.

To use `String()` constructor, the type `Pixel` need to conform to the `Stringable` trait, which requires the type to implement the dunder method `__str__()` that returns a string representation of the pixel. The code is as follows:

```mojo
# src/advanced/generic/pixel.mojo
struct Pixel(Stringable):
    var x: Int
    var y: Int

    fn __init__(out self, x: Int, y: Int):
        self.x = x
        self.y = y

    fn __str__(self) -> String:
        return String("Pixel(") + String(self.x) + String(", ") + String(self.y) + String(")")

def main():
    var point1 = Pixel(212,149)
    var point2 = Pixel(-12,391)
    print(String(point1))
    print(String(point2))
```

In the code, the `__str__()` method combines the `x` and `y` coordinates, as well as necessary texts and punctuations, into a string. When we use `String(point1)` and `String(point2)`, the Mojo compiler will automatically call the `__str__()` method of the `Pixel` type to get the string representation of the pixel, then print it to the console.

The output of the code is as follows:

```console
Pixel(212, 149)
Pixel(-12, 391)
```

Below is a summary of the most common dunder methods, the built-in traits they conform to, and the built-in functions they enable.

| Dunder method | Built-in trait  | Built-in function | Description                                                |
| ------------- | --------------- | ----------------- | ---------------------------------------------------------- |
| `__str__()`   | `Stringable`    | `String()`        | String representation of the object                        |
| `__repr__()`  | `Representable` | `repr()`          | String representation in the format of a constructor       |
| `write_to()`  | `Writable`      | `print()`         | Write the object to a writer instance to enable printing   |
| `__len__()`   | `Sizable`       | `len()`           | Length of the object                                       |
| `__abs__()`   | `Absable`       | `abs()`           | Absolute value of the object                               |
| `__int__()`   | `Intable`       | `Int()`           | Convert the object to an integer with the constructor      |
| `__bool__()`  | `Boolable`      | `Bool()`          | Convert the object to a boolean value with the constructor |
| `__round__()` | `Roundable`     | `round()`         | Round the object                                           |

## Dunder methods and operators overloading

Not only are the behaviors of built-in functions impacted by the dunder methods, but also the behaviors of operators. However, **not all dunder methods that overload operators conform to a trait**. We will summarize this at the end of this section.

For example, we want to add two `Complex` objects together using our own rules, let's say, the sum of two pixels being the summed squares of each coordinate:

$$
(x_1, y_1) + (x_2, y_2) = (x_1^2 + x_2^2, y_1^2 + y_2^2)
$$

We can so this by defining a method, e.g., `pixel1.add(pixel2)`. But it is not very intuitive.

A more intuitive way is to use the `+` operator to add two `Pixel` objects together. However, Mojo won't do this automatically for you. You need to define the behavior of the `+` operator for the `Pixel` type yourself. This is called **operator overloading**.

You may remember that we have already discussed this topic in Section [Arithmetic operators](../basic/structs#arithmetic-operators) of Chapter [Structs](../basic/structs.md). Let's quickly recap it here.

To overload an operator, you need to define the corresponding dunder method in your type. For the `+` operator, the dunder method is `__add__()`. When you use the `+` operator on two `Pixel` objects, Mojo will automatically call the `__add__()` method of the first `Pixel` object and pass the second `Pixel` object as an argument. That is to say, the following transformation will happen:

```mojo
pixel1 + pixel2 -> pixel1.__add__(pixel2)
```

Let's try to implement this and update the `Pixel` type in `src/advanced/generic/pixel.mojo`:

```mojo
# src/advanced/generic/pixel.mojo
struct Pixel(Stringable):
    ...

    fn __add__(self, other: Pixel) -> Pixel:
        return Pixel(self.x**2 + other.x**2, self.y**2 + other.y**2)

def main():
    var point1 = Pixel(212,149)
    var point2 = Pixel(-12,391)
    print(String(point1))
    print(String(point2))

    var point3 = point1 + point2  # point1.__add__(point2)
    print(String(point3))
```

When we run this code, we will get the following output as expected:

```console
Pixel(212, 149)
Pixel(-12, 391)
Pixel(45088, 175082)
```

Below is a table summarizing the most common dunder methods, the operators they overload, and the built-in traits they conform to.

| Dunder method    | Built-in trait | Built-in operator | Description                        |
| ---------------- | -------------- | ----------------- | ---------------------------------- |
| `__add__()`      |                | `+`               | Addition                           |
| `__sub__()`      |                | `-`               | Subtraction                        |
| `__mul__()`      |                | `*`               | Multiplication                     |
| `__truediv__()`  |                | `/`               | Division                           |
| `__floordiv__()` |                | `//`              | Floor division                     |
| `__mod__()`      |                | `%`               | Modulus                            |
| `__pow__()`      | `Powable`      | `**`              | Power                              |
| `__gt__()`       | `Comparable`   | `>`               | Greater than                       |
| `__ge__()`       | `Comparable`   | `>=`              | Greater than or equal to           |
| `__lt__()`       | `Comparable`   | `<`               | Less than                          |
| `__le__()`       | `Comparable`   | `<=`              | Less than or equal to              |
| `__eq__()`       | `Comparable`   | `==`              | Equal                              |
| `__ne__()`       | `Comparable`   | `!=`              | Not equal                          |
| `__getitem__()`  |                | `a[]`             | Indexing and slicing               |
| `__setitem__()`  |                | `a[] = b`         | Assignment by index or slice       |
| `__copyinit__()` | `Copyable`     | Mostly `y = x`    | Copy the value to another variable |
| `__moveinit__()` | `Movable`      | Mostly `y = x^`   | Move the value to another variable |

## Major changes in this chapter

- 2025-06-23: Update to accommodate to the changes in Mojo v25.4.
