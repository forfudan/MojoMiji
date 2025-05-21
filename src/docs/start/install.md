# Install Magic

Mojo can be installed and run on MacOS and Linux. Currently, the support of Windows is not available. If you are using Windows, please use Windows Subsystem for Linux (WSL) to run Mojo.

Before programming in Mojo, you need to first set up two things:

1. Install `magic`, a command line (CLI) tool and package manager.
1. Install `mojo` extension in your IDE (I would say VS Code is the best choice for now).

## Install Magic CLI

Magic is a package manager and virtual environment manager for Mojo (as well as other languages). It is based on pixi, so a lot of the commands are similar to pixi.

You can install Magic CLI on MacOS or Linus by running the following command in your terminal:

```bash
curl -ssL https://magic.modular.com/ff414efd-16ac-4bf3-8efc-50b059272ab6 | bash
```

Notes: Some instruction will be printed in your terminal. Read them carefully and run the `source` command as instructed.

Now, Magic CLI is installed in the directory `~/.modular/`.

::: tip Modular family

You may be confused by the names of Modular's products. Here is a brief introduction to the Modular family:

|         | Description                                                | Official link                                                                  |
| ------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| magic   | Package and virtual environment manager, command line tool | [https://docs.modular.com/magic/](https://docs.modular.com/magic/)             |
| modular | Platform, suite of AI libraries and tools                  | [https://www.modular.com/](https://www.modular.com/)                           |
| max     | GenAI graph compiler                                       | [https://docs.modular.com/max/intro](https://docs.modular.com/max/intro)       |
| mojo    | Programming language                                       | [https://docs.modular.com/mojo/manual/](https://docs.modular.com/mojo/manual/) |

:::

### Update Magic

To update Magic CLI, you can run the following command in your terminal:

```bash
magic self-update
```

::: warning Deprecation of magic

In future, the `magic` manager might be deprecated. You will be required to use `uv` or `pixi` instead.
:::

### Remove Magic

To remove Magic CLI, you can run the following command in your terminal:

```bash
rm ~/.modular/bin/magic
```

## Install Mojo extension in VS Code

To install Mojo extension in VS Code, you can search for "Mojo" in the "Extensions: Marketplace" Tab. You can also assess it via the link [https://marketplace.visualstudio.com/items?itemName=modular-mojotools.vscode-mojo](https://marketplace.visualstudio.com/items?itemName=modular-mojotools.vscode-mojo).

There are two versions of the extension: `Mojo` and `Mojo (nightly)`. The first one is the stable version. For now, I recommend you to use the stable version, unless you want to try the latest features of Mojo.
