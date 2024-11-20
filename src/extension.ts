import * as vscode from 'vscode';

async function addConfig(add_name: string, add_command: string, local = false) {
    const extensionConfig = vscode.workspace.getConfiguration('terminal-run-configs');

    const configs = extensionConfig.get<object[]>('configs');
    
    if (configs) {
        for (let i = 0; i < configs.length; ++i) {
            if (configs[i] !== null && 'name' in configs[i]) {
                const config = (configs[i] as { name: string, command: string });
                if (config.name === add_name) {
                    vscode.window.showWarningMessage(`Config with name "${add_name}" already exists!`);
                    return;
                }
            } else {
                vscode.window.showWarningMessage('Corrupted config in configs! Should contain "name".');
                return;
            }
        }
    
        const newConfigs = [...configs, { name: add_name, command: add_command }];
    
        if (local) {
            if (vscode.workspace.workspaceFolders) {
                await extensionConfig.update('configs', newConfigs, vscode.ConfigurationTarget.Workspace);
            } else {
                vscode.window.showWarningMessage("Can't find opened workspace!");
            }
        } else {
            await extensionConfig.update('configs', newConfigs, vscode.ConfigurationTarget.Global);
        }
    
        vscode.window.showInformationMessage("Added config!");
    } else {
        vscode.window.showWarningMessage("Configs can't be found!");
    }
}

async function runConfig(name: string) {
    const extensionConfig = vscode.workspace.getConfiguration('terminal-run-configs');

    const configs = extensionConfig.get<object[]>('configs');
    
    if (configs) {
        for (let i = 0; i < configs.length; ++i) {
            if (configs[i] !== null && 'name' in configs[i]) {
                const config = (configs[i] as { name: string, command: string });
                if (config.name === name) {
                    const activeTerminal = vscode.window.activeTerminal;

                    if (activeTerminal) {
                        // Send the command to the active terminal
                        activeTerminal.sendText(config.command);
                        vscode.window.showInformationMessage(`Executed command: ${config.command}`);
                    } else {
                        vscode.window.showWarningMessage('No active terminal found!');
                    }

                    return;
                }
            }
        }

        vscode.window.showWarningMessage(`Config with name "${name}" can't be found!`);
    } else {
        vscode.window.showWarningMessage("Configs can't be found!");
    }
}

async function removeConfig(name: string, local = false) {
    const extensionConfig = vscode.workspace.getConfiguration('terminal-run-configs');

    const configs = extensionConfig.get<object[]>('configs');
    const newConfigs : object[] = [];
    
    if (configs) {
        let removed = false;
        for (let i = 0; i < configs.length; ++i) {
            if (configs[i] !== null && 'name' in configs[i]) {
                const config = (configs[i] as { name: string, command: string });
                if (config.name === name) {
                    removed = true;
                    vscode.window.showInformationMessage("Removed config!");
                } else {
                    newConfigs.push(config);
                }
            } else {
                vscode.window.showWarningMessage('Corrupted config in configs!');
                return;
            }
        }
    
        if (local) {
            if (vscode.workspace.workspaceFolders) {
                await extensionConfig.update('configs', newConfigs, vscode.ConfigurationTarget.Workspace);
            } else {
                vscode.window.showWarningMessage("Can't find opened workspace!");
                return;
            }
        } else {
            await extensionConfig.update('configs', newConfigs, vscode.ConfigurationTarget.Global);
        }

        if (removed === false) {
            vscode.window.showInformationMessage("Config not found!");
        }
    } else {
        vscode.window.showWarningMessage("Configs can't be found!");
    }
}

export function activate(context: vscode.ExtensionContext) {

	const disposableAddConfig = vscode.commands.registerCommand('terminal-run-configs.addConfig', async () => {
        try {
            const config_name = await vscode.window.showInputBox({
                prompt: 'Name for config',
                placeHolder: 'e.g., cmake build, test-config'
            });

            const config_exec = await vscode.window.showInputBox({
                prompt: 'Enter the run command',
                placeHolder: 'e.g., git commit, cmake build .'
            });

            if (config_name && config_exec) {
                addConfig(config_name, config_exec);
            } else {
                vscode.window.showWarningMessage('Command arguments were not fully provided.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const disposableAddConfigLocal = vscode.commands.registerCommand('terminal-run-configs.addConfigLocal', async () => {
        try {
            const config_name = await vscode.window.showInputBox({
                prompt: 'Name for config',
                placeHolder: 'e.g., cmake build, test-config'
            });

            const config_exec = await vscode.window.showInputBox({
                prompt: 'Enter the run command',
                placeHolder: 'e.g., git commit, cmake build .'
            });

            if (config_name && config_exec) {
                addConfig(config_name, config_exec, true);
            } else {
                vscode.window.showWarningMessage('Command arguments were not fully provided.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const disposableRunConfig = vscode.commands.registerCommand('terminal-run-configs.runConfig', async () => {
        try {
            const config_name = await vscode.window.showInputBox({
                prompt: 'Name of config',
                placeHolder: 'e.g., cmake build, test-config'
            });

            if (config_name) {
                runConfig(config_name);
            } else {
                vscode.window.showWarningMessage('Command arguments were not fully provided.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const disposableRemoveConfig = vscode.commands.registerCommand('terminal-run-configs.removeConfig', async () => {
        try {
            const config_name = await vscode.window.showInputBox({
                prompt: 'Name of config',
                placeHolder: 'e.g., cmake build, test-config'
            });

            if (config_name) {
                removeConfig(config_name);
            } else {
                vscode.window.showWarningMessage('Command arguments were not fully provided.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const disposableRemoveConfigLocal = vscode.commands.registerCommand('terminal-run-configs.removeConfigLocal', async () => {
        try {
            const config_name = await vscode.window.showInputBox({
                prompt: 'Name of config',
                placeHolder: 'e.g., cmake build, test-config'
            });

            if (config_name) {
                removeConfig(config_name, true);
            } else {
                vscode.window.showWarningMessage('Command arguments were not fully provided.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    context.subscriptions.push(disposableAddConfig);
    context.subscriptions.push(disposableAddConfigLocal);
    context.subscriptions.push(disposableRunConfig);
    context.subscriptions.push(disposableRemoveConfig);
    context.subscriptions.push(disposableRemoveConfigLocal);
}

export function deactivate() {}
