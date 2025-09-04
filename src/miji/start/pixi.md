# Install package manager for Mojo

Mojo can be installed and run on MacOS and Linux. Currently, the support of Windows is not available. If you are using Windows, please use Windows Subsystem for Linux (WSL) to run Mojo.

Before programming in Mojo, you need to first set up two things:

1. Install `pixi`, a command line (CLI) tool and package manager.
1. Install `mojo` extension in your IDE (I would say VS Code is the best choice for now).

[[toc]]

## Install Pixi

[Pixi](https://pixi.sh/latest/) is a package manager and virtual environment manager for Mojo (as well as other languages). You can install Pixi on MacOS, Linus, or Windows Subsystem for Linux (WSL) by running the following command in your terminal:

```bash
curl -fsSL https://pixi.sh/install.sh | sh
```

Notes: Some instruction will be printed in your terminal. Read them carefully and run the `source` command or restart your terminal as instructed.

Now, the `pixi` binary is installed in the directory `~/.pixi/bin`.

::: tip Modular family

You may be confused by the names of Modular's products. Here is a brief introduction to the Modular family:

|         | Description                                                | Official link                                                                  |
| ------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| magic   | Package and virtual environment manager (being deprecated) | [https://docs.modular.com/magic/](https://docs.modular.com/magic/)             |
| pixi    | Package and virtual environment manager (to replace magic) | [https://pixi.sh/latest/](https://pixi.sh/latest/)                             |
| modular | Company, platform, suite of AI libraries and tools         | [https://www.modular.com/](https://www.modular.com/)                           |
| max     | GenAI graph compiler                                       | [https://docs.modular.com/max/intro](https://docs.modular.com/max/intro)       |
| mojo    | Programming language, mojo compiler                        | [https://docs.modular.com/mojo/manual/](https://docs.modular.com/mojo/manual/) |

:::

### Update pixi

To update pixi, you can run the following command in your terminal:

```bash
pixi self-update
```

### Remove pixi

To remove Pixi, you can run the following command in your terminal:

```bash
rm ~/.pixi/bin
```

## Install Mojo extension in VS Code

To install Mojo extension in VS Code, you can search for "Mojo" in the "Extensions: Marketplace" Tab. You can also assess it via the link [https://marketplace.visualstudio.com/items?itemName=modular-mojotools.vscode-mojo](https://marketplace.visualstudio.com/items?itemName=modular-mojotools.vscode-mojo).

There are two versions of the extension: `Mojo` and `Mojo (nightly)`. The first one is the stable version. For now, I recommend you to use the stable version, unless you want to try the latest features of Mojo.
