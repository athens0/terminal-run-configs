## Features

VS Code extension for running terminal commands quickly.

`Ctrl+Shift+P` to reveal commands window in VS Code.

- `Add Config <name> <command>`: Add a new configuration with name and terminal command to execute. Have a local version to add config to current workspace.
- `Run Config <name>`: Run configuration with name.
- `Remove Config <name>`: Remove a configuration by name. Also have a local version.

All names should be unique for each configuration.

**Names are register sensitive!**

## Examples

- `Add Config "cmake-default" "cmake build ."` - config with name `cmake-default` and command `cmake build .` will be saved in `terminal-run-configs.configs`.
- `Run Config "cmake-default"` - `cmake build .` will be executed in current opened terminal.
- `Remove Config "cmake-default"` - config will be removed from `terminal-run-configs.configs`.

## Extension Settings

There only one parameter in settings:

* `terminal-run-configs.configs`: Configs of plugin. You can change it for Workspace or globally. Remember that all configs should consist name and command to run.

## Known Issues

(None)

## Release Notes

### 1.0.0

Initial release of extension

## Авторство

Семенов Артём Герасимович М3103
ITMO University.