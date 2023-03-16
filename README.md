This README file contains information on the contents of the bitburner-chprat repository.

Please see the corresponding sections below for details.

General
=======

This repository contains a set of [Bitburner](https://danielyxie.github.io) script files.
They can be run within Bitburner to automate the game.

Setup
=====

On Windows you'll want to install [Docker Desktop}(https://www.docker.com/products/docker-desktop/)
and [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) to make use of the bash scripts.
[Visual Studio Code](https://code.visualstudio.com/) is the preferred editor to work with. It provides
code completion, linting while you edit your sources and an extension to push the files to the game.

Before running the scripts in WSL, you probably need to to convert them to use LF endings instead of
CRLF (they get checked out by git automatically with CRLF on Windows).

Then run the `lint.sh` script to set up [ESLint](https://eslint.org/) (on the first run, everything
will be set up, on consecutive runs it will check/fix the sources).

Afterwards run the `updateDefs.sh` script to download the NetscriptDefinitions. They'll be used for
code completion. So it's essential, that they match the version of the game you're running. That's
why you need to provide the git commit SHA1 of your game's version to the script.

To enable pushing source files to the game, enable the API server in the game and add the API key
to the VS Code Bitburner extension settings.

Static Code Analysis
====================

ESLint can be run inside a Docker container by executing the ``lint.sh`` script.
By passing the ``-f`` argument potentially fixable issues are fixed automatically.

Links
=====

* [Bitburner documentation](https://bitburner-official.readthedocs.io/en/latest/)
* [Bitburner scripting language](https://github.com/bitburner-official/bitburner-src/blob/stable/markdown/bitburner.ns.md)
* [VSCode integration](https://marketplace.visualstudio.com/items?itemName=bitburner.bitburner-vscode-integration)
* [ESLint Docker container](https://hub.docker.com/r/pipelinecomponents/eslint)

Sources I used for the scripts
------------------------------

* https://gist.github.com/OrangeDrangon/8a08d2d7d425fddd2558e1c0c5fae78b
* https://github.com/bitburner-official/bitburner-scripts
* https://raw.githubusercontent.com/adamadair/bitburner/main/scripts/contract-auto-solver.js
* https://steamcommunity.com/sharedfiles/filedetails/?id=2775214434
* https://github.com/tomdunning/bitburner-solutions
* https://github.com/bitburner-official/vscode-template
