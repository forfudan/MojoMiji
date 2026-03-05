# Calendar app in Mojo

In this chapter, we will implement a calendar app in Mojo, which is very similar to that in the last exercise of Chapter [Control Flows](../basic/control.md#print-calendar-with-user-input). However, this time, we will implement it as a more sophisticated command-line application that can be run with a one-line command, instead of a script that requires user input. For example,

The following command will directly print the calendar of the year 2024.

```bash
./calendar 2024
```

We also allow the user to specify the month, so that they can print the calendar of a specific month. The following command will print the calendar of February 2024.

```bash
./calendar 2024 --feb
```

We can also specify whether Sunday or Monday is the first day of the week. For example, the following command will print the calendar of February 2024 with Monday as the first day of the week.

```bash
./calendar 2024 --feb --monday
./calendar 2024 --feb -m  # short option for --monday
```

We can also specify the layout of the calendar, e.g., to print 1 month per line or 3 months per line. For example, the following command will print the calendar of the year 2024 with 3 months per line.

```bash
./calendar 2024 --layout 3
```

## Design of the calendar app

Before we start to implement the calendar app, we need to carefully design the structure of the app. For this simple calendar app, there are usually two layers.

1. A layer that handles the command-line arguments (the options provided by the user)
1. A layer that contains the main logic of the calendar app, e.g., calculate the calendar of a specific month and year, and print it in a nice format.

The second layer is the **core** of the calendar app, which contains the main logic and functionalities. The first layer is the **interface** of the calendar app, which handles the user input and provides a way for users to interact with the core.

Ideally, these two layers should be separated, so that we can easily modify the interface without affecting the core logic, and vice versa. For example, we can call directly the core logic in another program or we can later implement a graphical user interface (GUI) for the calendar app without changing the core logic.

Reading command-line arguments is a common task in many applications but it can be a bit tricky to implement it from scratch. Fortunately, we have [ArgMojo](https://github.com/forfudan/argmojo), a library that provides a simple and efficient way to parse command-line arguments in pure Mojo. We will use ArgMojo to handle the command-line arguments in our calendar app, which enables us to focus on the core logic of the calendar app without worrying about the details of parsing command-line arguments.

The project structure of the calendar app will be as follows:

- `src/`: a directory that contains the source code of the calendar app.
  - `main.mojo`: the main entry point of the calendar app, which handles the command-line arguments and calls the core logic.
  - `core.mojo`: the core logic of the calendar app, which contains the main functionalities for calculating and printing the calendar.
- `README.md`: a file that contains the description and usage of the calendar app.
- `LICENSE`: a file that contains the license of the calendar app.
- `pixi.toml`: a file that contains the configuration of the project, which is used by pixi to build and run the project.

```txt
calendar/
├── src/
│   ├── main.mojo
│   └── core.mojo
│── README.md
│── LICENSE
└── pixi.toml
```

## Core logic of the calendar app

We will first implement the core logic of the calendar app, which is the main part of the app.
