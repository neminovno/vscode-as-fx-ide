# vscode-as-fx-ide README

This extension helps creating ActionScript/Flex projects.

## Features

### New Project command

- creates project files in selected folder
- will ask to delete all files if selected folder is not empty
- reads AIR version from SDK's airsdk.xml, if not available uses 30.0

Run it with right click in Explorer menu:

![Run New Project command from explorer menu](images/cp-how-to-run.png)

or from Command Palette (Ctrl+Shift+P) by typing extension's name:

![Run New Project command from Command Palette](images/cp-how-to-run-2.png)

and pick project type:

![Pick project type](images/cp-pick.png)

### New Item Renderer command

- creates selected item renderer file

Run it by right click on folder:

![Run New ItemRenderer command from Explorer menu](images/ir-how-to-run.png)

and pick item renderer to be created:

![Pick New ItemRenderer type](images/ir-pick-type.png)