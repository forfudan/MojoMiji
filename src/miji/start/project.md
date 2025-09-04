# Initiate Mojo project

Now we have installed the pixi CLI. In this chapter, we will cover how to create a Mojo project and install the Mojo compiler.

[[toc]]

## Virtual environment

As a Python user, you may or may not be familiar with the concept of virtual environments. Many people install a certain version of Python and packages globally. No matter where your Python code is, you can always run it using the Python interpreter with the command `python file.py`.

While being convenient, this approach has some drawbacks. For example, you have a project which is relying on version 1.9 of `numpy` and another project which is relying on version 2.0 of `numpy`. If you install `numpy` version 1.9 globally, you will not be able to run the second project. You have to update your `numpy` to version 2.0, after which the first project cannot be run anymore.

For light users or when you are working alone, this may not be a problem: you always install the latest version of the package and update the code to be compatible with the latest version. However, if you are working with other people, or you are working on a larger projects, this can be a problem. You cannot always update or downgrade the package manually.

This brings us to the concept of virtual environment, which is actually an isolated directory that contains a particular version of Python and particular versions of packages. When you run a Python script within in this virtual environment, it will use the Python interpreter and packages in this directory.

Since the Python versions are project-specific and are located in different folders, you can working on multiple projects with different dependencies without any conflicts.

## Create new Mojo project

::: tip Repository of the project

You can find the example programs in this Miji in the [GitHub repository](https://github.com/forfudan/my-first-mojo-project).

:::

Mojo relies on the concept of virtual environment. Each mojo project contains a folder with specific Mojo version and packages.
When you run a Mojo script, it will use the Mojo compiler and packages only in this folder.

Therefore, before we start writing our first Mojo script, we need to first create a Mojo project (and the virtual environment).

To do this, you can navigate to the directory where you want to create your Mojo project folder. For me, it is `/Users/ZHU/Programs`. Then run the following command in your terminal.

```bash
pixi init my-first-mojo-project -c "https://conda.modular.com/max" -c "https://repo.prefix.dev/modular-community" -c "conda-forge"
```

This will create a folder called `my-first-mojo-project` in the current directory. You can go in to this folder by typing:

```bash
cd my-first-mojo-project
```

Or, more conveniently, you can use your VS Code to open this folder as a workspace.

## Transfer existing folder into Mojo project

If you want to create a Mojo project in an existing folder, you can run the following command:

::: code-group

```bash
pixi init -c "https://conda.modular.com/max" -c "https://repo.prefix.dev/modular-community" -c "conda-forge"
```

```zsh
pixi init -c "https://conda.modular.com/max" -c "https://repo.prefix.dev/modular-community" -c "conda-forge"
```

:::

## Look into `pixi.toml`

When you look into the folder `my-first-mojo-project`. You may find out that there is only one non-hidden file being created in this folder[^hidden], called `pixi.toml`. Not so fancy, right? But this is the file that contains all the information about your Mojo project. Anyone want to run your Mojo code can use this file to set up the same environment as yours.

Let's now open this `pixi.toml` file and take a close look.

::: code-group

```toml
[workspace]
authors = ["ZHU Yuhao 朱宇浩 <dr.yuhao.zhu@outlook.com>"]
channels = ["https://conda.modular.com/max", "https://repo.prefix.dev/modular-community", "conda-forge"]
name = "my-first-mojo-project"
platforms = ["osx-arm64"]
version = "0.1.0"

[tasks]

[dependencies]
```

:::

This file contains the following sections:

- `[workspace]`: This section contains the information about your Mojo project, such as the name of the project, the list of authors, version, platform, and channels. The "channels" field indicate where pixi can find and download the files that are necessary to run our Mojo code. We just specified three channels when we created the Mojo project.
- `[dependencies]`: This section contains the list of dependencies for your Mojo project. You can add any version of Mojo compiler and other packages here.
- `[tasks]`: This section is used to define tasks for your Mojo project. We will cover this section in later chapters.

At the moment, let's focus on the `[dependencies]` section.

You can see that there is currently nothing in the `[dependencies]` section. This is because pixi does not know that you want to run Mojo code. You have to manually add the Mojo compiler as a dependency in order to run any Mojo code. To do this, add the following line to the `[dependencies]` section:

::: code-group

```toml
[dependencies]
mojo = "==25.5"
```

:::

The word on the left side of the `=` is the name of the package. In this case, it is the `mojo` package, which contains all necessary files to run Mojo code. This also includes the Mojo compiler.

The word on the right side of the `=` is the version of the package you want to install. Here are some examples:

- `mojo = "==25.5"`: This means to install a specific version of the package, e.g., version 25.5.
- `mojo = ">=25.5"`: This means to install any version from 25.5 and later.
- `mojo = ">=25.5, <25.7"`: This means to install version 25.5 or later, but less than 25.7.
- `mojo = "*"`: This means to install the latest version of the package (as available in the channels specified in the "channels" field).

## Install Mojo compiler

After we put `mojo = "==25.5"` in the dependencies field, pixi knows that we want to install the latest version of the `mojo` package. To finish the installation, we need to run the following command in your terminal (Use `Cmd + J` to open the terminal in VS Code):

::: code-group

```bash
pixi install
```

:::

You will see that installation immediately start: pixi downloads all the necessary files and packages from the channels. Depending on your internet connection, it may take a while to finish the installation. Finally, you will see the following message in your terminal:

```console
✔ The default environment has been installed.
```

This means that Mojo compiler is ready to use. Now, let's start with our first Mojo program!

::: info The `.pixi` folder

By running `pixi install`, you actually created an virtual environment (folder `envs`) for your Mojo project in the hidden folder `.pixi`. This folder contains all the necessary files for your Mojo project.

:::

::: tip Update dependencies

You can always update the dependencies in `pixi.toml` file. Then, just run `pixi install` again to update the dependencies. You can also run `pixi clean` to delete the current environment, which empty the `.pixi` folder.

:::

For more information about pixi, you can refer to the [official documentation](https://pixi.sh/latest/getting_started/).

[^hidden]: There are also three hidden files: `.gitignore`, `.pixi` and `.gitattributes`. These files are used for version control and package management. You can ignore them for now.
