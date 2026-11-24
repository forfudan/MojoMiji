# Pattern matching

> Things are grouped by kind, and creatures are divided by herd.  
> -- *Yi-Jing (I Ching)*

In previous Chapter [Control flows](../basic/control#match-case-statement), we have seen the `match` statement as a cleaner way to write a long `if`-`elif` chain. The patterns there were simple: string literals such as `"hi"`, the wildcard `_`, and tuples of numbers such as `(0, y)`. However, this is only a small part of what `match` can do. Now that we know lists, dictionaries, structs, and error handling, it is time to look at the more powerful patterns.

The key idea of pattern matching is that **a pattern looks like the code that builds a value, but it takes the value apart**. For example, you build a list with `["add", "3", "4"]`, and you take it apart with the pattern `["add", a, b]`. When the value has the same shape as the pattern, two things happen at the same time: the case is selected, and the parts of the value are bound to the names in the pattern. We have already seen this idea in the tuple unpacking `var (x, y) = (10, 2)`. In this chapter, we will apply it to lists, optional values, and structs.

If you have used `match` in Python (available since Python 3.10), you will find most of this chapter familiar. The differences between Mojo and Python are marked in yellow or red boxes. If you have never used `match` in Python, do not worry. Nothing is assumed except the short section in Chapter Control flows.

This chapter will cover the following topics:

- List patterns and list unpacking
- Optional values and how to match them
- The `if case` statement
- Struct patterns
- Mutability of the names bound in patterns
- The `while case` statement
- Exhaustive match
- Differences between Mojo's and Python's `match`

[[toc]]

## List patterns

In Chapter Control flows, we wrote a function `respond()` that gives a reply to a command such as `"hi"` or `"bye"`. It only understands single words. A real command, however, often comes with arguments, e.g., `greet Yuhao` or `add 3 4`. We can use the `split()` method to cut the command into a list of words, and then use **list patterns** to check the words. A list pattern checks two things at once: the number of items in the list, and the values of some of the items.

Let's upgrade the function `respond()` with list patterns:

::: code-group

```mojo
# src/basic/matching/respond_with_lists.mojo
def respond(command: String) raises -> String:
    match command.split():
        case []:
            return "Say something, master."
        case ["hi" | "hello" as greeting]:
            return String("Hello, master! (You said '", greeting, "'.)")
        case ["greet", name]:
            return String("Nice to meet you, ", name, "!")
        case ["add", a, b]:
            return String(a, " + ", b, " = ", Int(a) + Int(b))
        case _:
            return "I don't understand your command."


def main() raises:
    print(respond(""))
    print(respond("hello"))
    print(respond("greet Yuhao"))
    print(respond("add 3 4"))
    print(respond("add 1 2 3"))
```

```output mojo
Say something, master.
Hello, master! (You said 'hello'.)
Nice to meet you, Yuhao!
3 + 4 = 7
I don't understand your command.
```

```python
# src/basic/matching/respond_with_lists.py
def respond(command: str) -> str:
    match command.split():
        case []:
            return "Say something, master."
        case ["hi" | "hello" as greeting]:
            return f"Hello, master! (You said '{greeting}'.)"
        case ["greet", name]:
            return f"Nice to meet you, {name}!"
        case ["add", a, b]:
            return f"{a} + {b} = {int(a) + int(b)}"
        case _:
            return "I don't understand your command."


def main():
    print(respond(""))
    print(respond("hello"))
    print(respond("greet Yuhao"))
    print(respond("add 3 4"))
    print(respond("add 1 2 3"))


main()
```

```output python
Say something, master.
Hello, master! (You said 'hello'.)
Nice to meet you, Yuhao!
3 + 4 = 7
I don't understand your command.
```

:::

The Mojo code and the Python code are almost the same. Let's go through the patterns one by one:

1. `[]` matches an empty list, i.e., the user typed nothing.
1. `["hi" | "hello" as greeting]` matches a list of exactly one word, which is either `"hi"` or `"hello"`. The keyword `as` gives the whole `"hi" | "hello"` part a name, so `greeting` holds the word that the user actually typed.
1. `["greet", name]` matches a list of exactly two words, where the first word is `"greet"`. The second word can be anything, and it is bound to the name `name`.
1. `["add", a, b]` matches a list of exactly three words, where the first word is `"add"`. The function `Int()` converts a word into an integer. Since it raises an error if the word is not a number, `respond()` is marked with `raises` (see Chapter [Error handling](../basic/errors)).
1. `_` matches anything else. For example, `add 1 2 3` has four words, so it does not match `["add", a, b]`, and it ends up here.

Note that the pattern `["add", a, b]` looks exactly like the code that builds a list of three items. But here, it is used to take a list of three items apart.

::: warning `case _` is needed for list patterns

You may think that `case []` and a pattern for "one or more items" together cover all possible lists, so the last `case _` is not needed. Unfortunately, Mojo does not think so. List patterns are never considered complete. If a function returns a value, you have to end the `match` statement with `case _`. Otherwise, the compiler stops with the error `return expected at end of function with results`. We will come back to this in Section [Exhaustive match](#exhaustive-match).

:::

### Starred names

The function above does not understand `add 1 2 3`. It would be nice if it could add any number of numbers. For this purpose, we can use a **starred name**, such as `*numbers`, which collects all the remaining items of the list. There can be zero, one, or more of them. See the following example:

::: code-group

```mojo
# src/basic/matching/respond_with_rest.mojo
def respond(command: String) raises -> String:
    match command.split():
        case ["add", *numbers]:
            var total = 0
            for number in numbers:
                total += Int(number)
            return String("The sum is ", total, ".")
        case _:
            return "I don't understand your command."


def main() raises:
    print(respond("add 1 2 3 4"))
    print(respond("add 42"))
    print(respond("add"))
```

```output mojo
The sum is 10.
The sum is 42.
The sum is 0.
```

```python
# src/basic/matching/respond_with_rest.py
def respond(command: str) -> str:
    match command.split():
        case ["add", *numbers]:
            total = 0
            for number in numbers:
                total += int(number)
            return f"The sum is {total}."
        case _:
            return "I don't understand your command."


def main():
    print(respond("add 1 2 3 4"))
    print(respond("add 42"))
    print(respond("add"))


main()
```

```output python
The sum is 10.
The sum is 42.
The sum is 0.
```

:::

The pattern `["add", *numbers]` matches any list whose first word is `"add"`. For the command `add 1 2 3 4`, `numbers` holds the four words after `"add"`. For the command `add`, `numbers` holds nothing, and thus the sum is 0. A pattern can contain at most one starred name, but it can be at any position. For example, `[first, *middle, last]` is also a valid pattern.

---

There is one difference between Mojo and Python here. In Python, the starred name is a **new list**. In Mojo, however, it is a `Span`, i.e., a **view** of the original list, just like what you get from slicing a list (see Section [Index or slice a list](../basic/composite#index-or-slice-a-list)). No element is copied, so it is cheap. On the other hand, if you modify the elements through the view, the original list is also modified:

```mojo
# src/basic/matching/rest_is_a_view.mojo
def main():
    var numbers: List[Int] = [1, 2, 3]
    match numbers:
        case [_, *rest]:
            rest[0] = 100
        case _:
            pass
    print(numbers)
```

```output mojo
[1, 100, 3]
```

If you want an independent list, you can convert the view into a new list with `List(rest)`.

### Unpacking a list

A list pattern can also be used outside a `match` statement, in the same way as the tuple unpacking in Chapter Control flows. Python users know this as "extended unpacking". For example,

::: code-group

```mojo
# src/basic/matching/list_unpacking.mojo
def main() raises:
    var scores: List[Int] = [7, 9, 8, 10, 6]
    var [first, *middle, last] = scores
    print("first:", first)
    print("middle:", middle)
    print("last:", last)
```

```output mojo
first: 7
middle: [9, 8, 10]
last: 6
```

```python
# src/basic/matching/list_unpacking.py
def main():
    scores = [7, 9, 8, 10, 6]
    [first, *middle, last] = scores
    print("first:", first)
    print("middle:", middle)
    print("last:", last)


main()
```

```output python
first: 7
middle: [9, 8, 10]
last: 6
```

:::

You may notice that `main()` is marked with `raises` in the Mojo code. Why?

Recall that in Chapter Control flows, a tuple of a wrong length is a compile error, because the length of a tuple is part of its type. The length of a list, however, is only known when the program runs. Therefore, if the list does not fit the pattern, for example, `var [first, second] = scores` with five scores, Mojo can only find it out at runtime, and it raises an error:

```console
Unhandled exception caught during execution: list pattern does not match value length
```

Note that this only happens in the unpacking statement. In a `match` statement, a list of a wrong length is not an error. The case simply does not match, and Mojo goes on to the next case. The following table summarizes the two situations. Python behaves in the same way.

| A list of a wrong length in | Mojo                         | Python                       |
| --------------------------- | ---------------------------- | ---------------------------- |
| `var [a, b] = values`       | Raises an error              | Raises a `ValueError`        |
| `case [a, b]:`              | No match, try the next case  | No match, try the next case  |

## Optional values

Let's teach our assistant to remember people's ages. We can store the ages in a dictionary of the type `Dict[String, Int]`. But what should `ages.get("Rust")` return if the assistant has never heard of Rust?

In Python, `dict.get()` returns either the value or `None`. This is very convenient. However, it is also a source of bugs. If you forget to check for `None`, your program may run well for months, and then one day stop with an error like `TypeError: '<' not supported between instances of 'NoneType' and 'int'`.

In Mojo, a variable of the type `Int` is always an integer. It can never be `None`. For the situations where "nothing" is a valid answer, Mojo provides a dedicated type, `Optional`. An `Optional[Int]` is either an integer or nothing. You can think of it as the [blind box](../basic/errors#result-is-a-blind-box) in Chapter Error handling, with one difference: that box contains either a value or an error, while this box contains either a value or nothing. The method `Dict.get()` returns such a box.

The following example shows how to create and use `Optional` values:

::: code-group

```mojo
# src/basic/matching/optional_basics.mojo
def main():
    var a: Optional[Int] = 5
    var b: Optional[Int] = None
    print(a, b)

    if a:
        print("a holds", a.value())
    if not b:
        print("b is empty")

    print(b.or_else(0))
```

```output mojo
5 None
a holds 5
b is empty
0
```

```python
# src/basic/matching/optional_basics.py
def main():
    a: int | None = 5
    b: int | None = None
    print(a, b)

    if a is not None:
        print("a holds", a)
    if b is None:
        print("b is empty")

    print(b if b is not None else 0)


main()
```

```output python
5 None
a holds 5
b is empty
0
```

:::

In this example,

1. `var a: Optional[Int] = 5` creates a box with the value `5`, and `var b: Optional[Int] = None` creates an empty box. When printed, an empty box is shown as `None`, just like in Python.
1. `if a:` checks whether the box contains a value.
1. `a.value()` takes the value out of the box.
1. `b.or_else(0)` takes the value out of the box, or returns `0` if the box is empty.

::: tip `if a:` - Mojo vs Python

In Mojo, `if a:` on an `Optional` only checks whether the box contains a value. A box containing `0` is not empty, so `if a:` is `True`. In Python, however, `if a:` is `False` for both `None` and `0`. This is a common source of bugs, and that is why the Python code above uses `is not None` explicitly.

:::

What if you call `.value()` on an empty box? The program will abort with the following message:

```console
ABORT: ...: `Optional.value()` called on empty `Optional`. Consider using `if optional:` ...
```

At least the message tells you how to fix the problem. But it would be even better if the compiler made sure that you never forget to check the box. This is where pattern matching comes in.

### Match an Optional

An `Optional` value has two possible shapes: `.Some(value)`, a box that contains a value, and `.None`, an empty box. We can use them as patterns in a `match` statement. Let's write a function `how_old()` for our assistant:

::: code-group

```mojo
# src/basic/matching/optional_ages.mojo
def how_old(name: String, ages: Dict[String, Int]) -> String:
    match ages.get(name):
        case .Some(age) if age < 18:
            return String(name, " is ", age, ". Too young for coffee.")
        case .Some(age):
            return String(name, " is ", age, ".")
        case .None:
            return String("I don't know ", name, " yet.")


def main():
    var ages: Dict[String, Int] = {"Python": 35, "Mojo": 3}
    print(how_old("Python", ages))
    print(how_old("Mojo", ages))
    print(how_old("Rust", ages))
```

```output mojo
Python is 35.
Mojo is 3. Too young for coffee.
I don't know Rust yet.
```

```python
# src/basic/matching/optional_ages.py
def how_old(name: str, ages: dict[str, int]) -> str:
    match ages.get(name):
        case None:
            return f"I don't know {name} yet."
        case age if age < 18:
            return f"{name} is {age}. Too young for coffee."
        case age:
            return f"{name} is {age}."


def main():
    ages = {"Python": 35, "Mojo": 3}
    print(how_old("Python", ages))
    print(how_old("Mojo", ages))
    print(how_old("Rust", ages))


main()
```

```output python
Python is 35.
Mojo is 3. Too young for coffee.
I don't know Rust yet.
```

:::

The patterns work as follows:

- `.Some(age)` matches a box that contains a value, and binds the value to the name `age`. That is to say, the pattern opens the box for you. You do not need to call `.value()`, and you cannot forget to check whether the box is empty.
- `.Some(age) if age < 18` is a pattern with a guard, which we have seen in Chapter Control flows.
- `.None` matches an empty box.

The leading dot in `.Some` and `.None` is a short form of `Optional[Int].Some` and `Optional[Int].None`. Since Mojo already knows that `ages.get(name)` is of the type `Optional[Int]`, you do not have to write the type again.

Since `.Some` and `.None` together cover all possible values of an `Optional`, the function `how_old()` does not need a `case _` at the end.

---

Now let's compare the Mojo code with the Python code. In Python, the case `None` is put first. This is not by accident. In Python, the pattern `age` matches anything, including `None`. If it were put first, Python would happily tell you that "Rust is None." In Mojo, the pattern `.Some(age)` never matches an empty box, so the order of `.Some` and `.None` does not matter.

::: warning `case None` does not work in Mojo

If you write `case None:` as in Python, Mojo will give the error `expression is not a valid match pattern; use '==' to compare against its value`. You should write `case .None:` instead.

:::

### `if case` statement

Sometimes, you only care about one pattern. Writing a full `match` statement with a `case _: pass` at the end is a bit verbose. In this case, you can use the `if case` statement:

::: code-group

```mojo
# src/basic/matching/if_case_ages.mojo
def main():
    var ages: Dict[String, Int] = {"Python": 35, "Mojo": 3}

    if case .Some(age) = ages.get("Mojo"):
        print("Mojo is", age)
    else:
        print("I don't know Mojo yet.")
```

```output mojo
Mojo is 3
```

```python
# src/basic/matching/if_case_ages.py
def main():
    ages = {"Python": 35, "Mojo": 3}

    if (age := ages.get("Mojo")) is not None:
        print("Mojo is", age)
    else:
        print("I don't know Mojo yet.")


main()
```

```output python
Mojo is 3
```

:::

You can read `if case .Some(age) = ages.get("Mojo"):` as "if the value has the shape `.Some(age)`, then do the following". If it has, `age` is bound to the value inside the box, and you can use it in the block. You can also continue with `elif case`, `elif`, and `else`, just like a normal `if` statement.

Python does not have an `if case` statement. The closest thing is to combine the walrus operator `:=` with `is not None`, as shown in the Python code above.

## Struct patterns

Our assistant now needs to manage a to-do list. Each item of the list is a task, which has a title, and two flags indicating whether it is urgent and whether it is done. We define a struct `Task` for it. In Python, a dataclass is the natural choice:

::: code-group

```mojo
struct Task(Copyable, Writable):
    var title: String
    var urgent: Bool
    var done: Bool

    def __init__(out self, title: String, urgent: Bool = False, done: Bool = False):
        self.title = title
        self.urgent = urgent
        self.done = done
```

```python
from dataclasses import dataclass


@dataclass
class Task:
    title: str
    urgent: bool = False
    done: bool = False
```

:::

Compared with the `Complex` struct in Chapter [Structs](../basic/structs), there are two new things. The trait `Copyable` allows us to build a list of tasks with the `[...]` syntax. And since `Task` conforms to `Writable` but does not define a `write_to()` method, it is printed in a default way, e.g., `Task(title=buy milk, urgent=False, done=False)` (see the tip in Chapter [Structs](../basic/structs)).

A **struct pattern** looks like a call to the constructor with keyword arguments, e.g., `Task(done=True)`. It matches a struct if every field that you name in the pattern matches the pattern after the `=` sign. The fields that you do not name can be anything. Let's see an example:

::: code-group

```mojo
# src/basic/matching/task_patterns.mojo
def describe(task: Task) -> String:
    match task:
        case Task(done=True):
            return String("Done: ", task.title)
        case Task(title="feed the cat"):
            return "Feed the cat. Now."
        case Task(title=title, urgent=True):
            return String("Urgent: ", title)
        case Task(title=title):
            return String("Later: ", title)


def main():
    var todo: List[Task] = [
        Task("buy milk"),
        Task("feed the cat"),
        Task("write a chapter", urgent=True),
        Task("pay rent", urgent=True, done=True),
    ]
    for task in todo:
        print(describe(task))
```

```output mojo
Later: buy milk
Feed the cat. Now.
Urgent: write a chapter
Done: pay rent
```

```python
# src/basic/matching/task_patterns.py
def describe(task: Task) -> str:
    match task:
        case Task(done=True):
            return f"Done: {task.title}"
        case Task(title="feed the cat"):
            return "Feed the cat. Now."
        case Task(title=title, urgent=True):
            return f"Urgent: {title}"
        case Task(title=title):
            return f"Later: {title}"


def main():
    todo = [
        Task("buy milk"),
        Task("feed the cat"),
        Task("write a chapter", urgent=True),
        Task("pay rent", urgent=True, done=True),
    ]
    for task in todo:
        print(describe(task))


main()
```

```output python
Later: buy milk
Feed the cat. Now.
Urgent: write a chapter
Done: pay rent
```

:::

In the function `describe()`,

1. `Task(done=True)` matches any task that is done, no matter what its title is.
1. `Task(title="feed the cat")` matches a task with this particular title.
1. `Task(title=title, urgent=True)` checks one field and binds another. You can read `title=title` from left to right: the field `title` is bound to a new name, which also happens to be `title`. You can also write `Task(title=t, urgent=True)` and then use `t` in the block.
1. `Task(title=title)` binds the title of any other task. Since it does not check any value, it matches all tasks, and thus `describe()` does not need a `case _` at the end.

Again, the pattern `Task(title=title, urgent=True)` looks like the code that builds a task, e.g., `Task("write a chapter", urgent=True)`. But here, it takes a task apart.

::: warning Struct patterns - Mojo vs Python

In Python, a dataclass automatically supports positional patterns, so `case Task("buy milk"):` works. Mojo does not support positional patterns. If you write `case Task("buy milk"):`, you will get the error `struct patterns do not support positional or unpacked arguments`. You always have to name the fields.

Moreover, a class pattern in Python first checks whether the value is an instance of the class, i.e., `isinstance(task, Task)`. Mojo does not need such a check, because the type of the value is already known at compile time.

:::

### Mutability of bound names

By default, the names bound in a pattern are read-only. If you try to modify one of them, the compiler will stop you:

```mojo
# src/basic/matching/names_read_only.mojo
# This code will not compile
match todo[0]:
    case Task(done=done):
        done = True  # error: expression must be mutable in assignment
```

This should remind you of the arguments of a function, which are also read-only by default (see Section [Keyword `imm`](../basic/functions#keyword-imm)). Similar to the arguments, you can put a keyword before a name in a pattern to change its mutability. The following table compares them:

| In a pattern | Similar to the argument | Meaning                                                          |
| ------------ | ----------------------- | ---------------------------------------------------------------- |
| `done`       | `imm` (default)         | A read-only reference to that part of the value                  |
| `var done`   | `var`                   | A copy of that part. Changes only affect the copy.               |
| `ref done`   | `mut`                   | A mutable reference. Changes are written back to the original.   |

Let's see how `var` and `ref` work:

```mojo
# src/basic/matching/names_var_and_ref.mojo
def main():
    var todo: List[Task] = [Task("buy milk"), Task("feed the cat")]

    match todo[0]:
        case Task(title=var title):
            title += " and eggs"
            print("Copy:", title)
    print("List:", todo[0].title)

    match todo[1]:
        case Task(done=ref done):
            done = True
    print(todo[1])
```

```output mojo
Copy: buy milk and eggs
List: buy milk
Task(title=feed the cat, urgent=False, done=True)
```

In the first `match` statement, `var title` is a copy of the title. We change the copy, but the title of the task in the list is still "buy milk". In the second `match` statement, `ref done` is a mutable reference to the field `done` of the second task, so setting it to `True` modifies the task in the list.

Python does not have this feature. In Python, `done = True` in a case block simply binds the local name `done` to `True`. The task itself is not touched. To modify the task, you have to write `task.done = True`.

Note that the starred name in Section [Starred names](#starred-names) is a bit special. The name `rest` itself is read-only, i.e., you cannot make it refer to another list. But it is a view, and modifying the elements through a view modifies the original list.

::: info Why can `ref` modify the value here?

In Chapter [Functions](../basic/functions#keyword-imm), we learned that a `ref` argument on its own is read-only, just like `imm`. This is because a function does not know where its argument comes from. A pattern, however, does know: the value is right there after the keyword `match`. In the example above, Mojo sees that `todo[1]` belongs to a mutable variable, so the `ref` name is also mutable. If you match a value that is not mutable, e.g., an `imm` argument, the `ref` name is read-only, too.

:::

### `while case` statement

The `if case` statement has a sibling, the `while case` statement. It repeats the block as long as the value matches the pattern. Our assistant can use it to work through the to-do list, from the last task to the first:

::: code-group

```mojo
# src/basic/matching/while_case_todo.mojo
def main():
    var todo: List[Task] = [
        Task("buy milk"),
        Task("feed the cat"),
        Task("write a chapter"),
    ]

    while case [*_, last] = todo:
        print("Doing:", last.title)
        _ = todo.pop()
    print("Nothing left to do.")
```

```output mojo
Doing: write a chapter
Doing: feed the cat
Doing: buy milk
Nothing left to do.
```

```python
# src/basic/matching/while_case_todo.py
def main():
    todo = [
        Task("buy milk"),
        Task("feed the cat"),
        Task("write a chapter"),
    ]

    while todo:
        last = todo[-1]
        print("Doing:", last.title)
        todo.pop()
    print("Nothing left to do.")


main()
```

```output python
Doing: write a chapter
Doing: feed the cat
Doing: buy milk
Nothing left to do.
```

:::

The pattern `[*_, last]` matches any list with at least one item, and binds the last item to `last`. When the list becomes empty, the pattern no longer matches, and the loop ends. The line `_ = todo.pop()` removes the last task from the list and discards it. Of course, `while len(todo) > 0:` would also work. The `while case` statement just gives you `last` for free.

---

Note that the order of the two lines in the loop matters. The name `last` is a reference to an item in the list. If you call `todo.pop()` before you use `last`, the item that `last` refers to is already removed. Mojo detects this and refuses to compile the code:

```console
error: use of invalidated interior reference 'todo["element"]'
        print("Doing:", last.title)
                        ^
note: origin was invalidated here
        _ = todo.pop()
                    ^
```

In plain words, the error says that `last` refers to something inside `todo`, and `pop()` has removed it. In Python, the order does not matter, because `last` keeps the popped task alive. In Mojo, the compiler catches the mistake before it becomes a bug.

## Exhaustive match

Let's start with a small puzzle in Python. What does the following code print?

```python
def size(items: list[int]) -> str:
    match items:
        case []:
            return "empty"
        case [_]:
            return "one item"
        case [_, _]:
            return "two items"


print(size([1, 2, 3]))
```

The answer is: it prints `None`. Since no case matches the list `[1, 2, 3]`, the function reaches its end and returns `None`, even though the return type is declared as `str`. Python does not complain. Only a type checker, such as mypy, would warn you, and only if you run it.

The same function in Mojo does not compile. Mojo gives the error `return expected at end of function with results`. Recall from Section [Non-exhaustive conditionals](../basic/control#non-exhaustive-conditionals) that a function with a return type must return a value on every path. For a `match` statement, this means that the cases must cover every possible value, i.e., the match must be **exhaustive**. The following table shows what Mojo considers exhaustive:

| The cases include                                               | Exhaustive?                   |
| --------------------------------------------------------------- | ----------------------------- |
| `case _:`, or a plain name such as `case x:`                    | Yes, they match anything      |
| `.Some(x)` and `.None`                                          | Yes, for an `Optional` value  |
| A struct pattern with only names inside, e.g., `Task(title=t)`  | Yes                           |
| List patterns only                                              | No, never                     |

The last row is what we have seen in Section [List patterns](#list-patterns). Even `case []` and `case [_, *_]` together, which cover all possible lists, are not considered exhaustive. Therefore, if you are not sure, end the `match` statement with `case _`.

## Differences from Python

Most of the differences have been discussed in the previous sections. The following box summarizes them, together with two that we have not mentioned yet.

::: warning Pattern matching - Mojo vs Python

- **Mapping patterns are not supported.** In Python, `case {"type": "click", "x": x}:` is common in code that handles JSON data. Mojo does not support it and gives the error `expression is not a valid match pattern; use '==' to compare against its value`. Instead, you can use `Dict.get()` and match the returned `Optional`, e.g., `case .Some(x):`.
- **Type patterns are not needed.** Python's `case int(n):` checks the type of the value at runtime. In Mojo, the type of the value is known at compile time, so there is nothing to check.
- Struct patterns must [name the fields](#struct-patterns).
- The starred name is [a view](#starred-names), not a new list.
- An empty `Optional` is matched with [`case .None:`](#match-an-optional), not `case None:`.
- Negative numbers, plain names, and the length of tuples are discussed in Chapter [Control flows](../basic/control#match-case-statement).

:::

## Main changes in this chapter

- 2026-11-23: New chapter for Mojo v1.2.0.
