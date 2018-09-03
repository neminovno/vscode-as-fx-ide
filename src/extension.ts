'use strict';

import * as vscode from 'vscode';
import NewProjectCommand from './project-builder/NewProject';
import { log_dispose } from './logger';

export function activate(context: vscode.ExtensionContext) {

    const newProjectCommand = new NewProjectCommand();

    let disposable = vscode.commands.registerCommand('extension.newProject', () => {

        vscode.window.showInformationMessage('Hello World!');

        const openedFolders = vscode.workspace.workspaceFolders;

        if (!openedFolders) {
            console.log('there is no folder opened');
            vscode.window.showInformationMessage('There is no folder opened.');
            return;
        }

        newProjectCommand.start(openedFolders, context.extensionPath);
    });

    context.subscriptions.push(newProjectCommand);
    context.subscriptions.push(disposable);
}

export function deactivate() {
    log_dispose();
}