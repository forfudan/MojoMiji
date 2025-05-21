# Initiate Mojo project

## Virtual environment

As a Python user, you may or may not be familiar with the concept of virtual environments. Many people install a certain version of Python and packages globally. No matter where your Python code is, you can always run it using the Python interpreter with the command `python file.py`.

While being convenient, this approach has some drawbacks. For example, you have a project which is relying on version 1.9 of `numpy` and another project which is relying on version 2.0 of `numpy`. If you install `numpy` version 1.9 globally, you will not be able to run the second project. You have to update your `numpy` to version 2.0, after which the first project cannot be run anymore.

For light users or when you are working alone, this may not be a problem: you always install the latest version of the package and update the code to be compatible with the latest version. However, if you are working with other people, or you are working on a larger projects, this can be a problem. You cannot always update or downgrade the package manually.

This brings us to the concept of virtual environment, which is actually an isolated directory that contains a particular version of Python and particular versions of packages. When you run a Python script within in this virtual environment, it will use the Python interpreter and packages in this directory.

Since the Python versions are project-specific and are located in different folders, you can working on multiple projects with different dependencies without any conflicts.

## Create new Mojo project

Mojo relies on the concept of virtual environment. Each mojo project contains a folder with specific Mojo version and packages.
When you run a Mojo script, it will use the Mojo compiler and packages only in this folder.

Therefore, before we start writing our first Mojo script, we need to first create a Mojo project (and the virtual environment).

To do this, you can navigate to the directory where you want to create your Mojo project folder. For me, it is `/Users/ZHU/Programs`. Then run the following command in your terminal.

```bash
magic init my-first-mojo-project --mojoproject
```

This will create a folder called `my-first-mojo-project` in the current directory. You can go in to this folder by typing:

```bash
cd my-first-mojo-project
```

Or, more conveniently, you can use your VS Code to open this folder as a workspace.

::: tip Existing folder

If you want to create a Mojo project in an existing folder, you can run the following command:

```bash
magic init --mojoproject
```

:::

## Look into `mojoproject.toml`

When you look into the folder `my-first-mojo-project`. You may find out that there is only one non-hidden file being created in this folder[^hidden], called `mojoproject.toml`. Not so fancy, right? But this is the file that contains all the information about your Mojo project. Anyone want to run your Mojo code can use this file to set up the same environment as yours.

Let's now open this `mojoproject.toml` file and take a close look.

```toml
[project]
authors = ["ZHU Yuhao 朱宇浩 <dr.yuhao.zhu@outlook.com>"]
channels = ["https://conda.modular.com/max-nightly", "https://conda.modular.com/max", "https://repo.prefix.dev/modular-community", "conda-forge"]
name = "my-first-mojo-project"
platforms = ["osx-arm64"]
version = "0.1.0"

[tasks]

[dependencies]
max = "*"
```

This file contains the following sections:

- `[project]`: This section contains the information about your Mojo project, such as the name of the project, the list of authors, version, platform, and channels. You may change them if you want.
- `[dependencies]`: This section contains the list of dependencies for your Mojo project. You can add any version of Mojo compiler and other packages here.
- `[tasks]`: This section is used to define tasks for your Mojo project. We will cover this section in later chapters.

We focus on the `[dependencies]` section for now.

The `max` package contains the Mojo compiler (analogically the Python interpreter), which is required to run any Mojo code. The `*` means that you want to install the latest version of the `max` package (including the Mojo compiler). If you want to install a specific version of the package, you can, for example, write:

- `max = "==25.3"` to install version 25.3.
- `max = ">=25.3"` to install version 25.3 or later.
- `max = ">=25.1, <25.4"` to install version 25.1 or later, but less than 25.4.

For now, you can leave the `[dependencies]` section as it is. We will cover how to add dependencies in later chapters.

::: info About `mojoproject.toml` file

The `mojoproject.toml` file is similar to `pyproject.toml` file or `requirements.txt` file in Python.

:::

## Install Mojo compiler

As mentioned above, the `max = "*"` tells Magic CLI to install the latest version of the `max` package as well as the Mojo compiler. To finish the installation, you can run the following command in your terminal (Use `Cmd+J` to open the terminal in VS Code):

```bash
magic install
```

You can see that installation is in progress. Magic CLI will download all the necessary files and packages from the channels specified in the `mojoproject.toml` file. Depending on your internet connection, it may take a while to finish the installation. Finally, you will see the following message in your terminal:

```console
✔ The default environment has been installed.
```

This means that Mojo compiler is ready to use. Now, let's start with our first Mojo program!

::: info `.magic` folder

By running `magic install`, you actually created an virtual environment (folder `envs`) for your Mojo project in the hidden folder `.magic`. This folder contains all the necessary files for your Mojo project.
:::

::: tip Update dependencies

You can always update the dependencies in `mojoproject.toml` file. Then, just run `magic install` again to update the dependencies. You can also run `magic clean` to delete the current environment, which empty the `.magic` folder.

:::

[^hidden]: There are also three hidden files: `.gitignore`, `.magic` and `.gitattributes`. These files are used for version control and package management. You can ignore them for now.
