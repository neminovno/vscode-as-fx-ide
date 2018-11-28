'use strict';

import * as vscode from 'vscode';
import NewProjectCommand from './project-builder/NewProject';
import { log_dispose } from './logger';

export function activate(context: vscode.ExtensionContext) {

    const newProjectCommand = new NewProjectCommand();

    let disposable = vscode.commands.registerCommand('extension.newProject', () => {

        const ext: vscode.Extension<any> | undefined = vscode.extensions.getExtension("bowlerhatllc.vscode-nextgenas");
        const sdkPath = ext !== undefined ? ext.exports.frameworkSDKPath : '';

        const openedFolders = vscode.workspace.workspaceFolders;

        if (!openedFolders) {
            console.log('there is no folder opened');
            vscode.window.showInformationMessage('There is no folder opened.');
            return;
        }

        newProjectCommand.start(openedFolders, context.extensionPath, sdkPath);
    });

    context.subscriptions.push(newProjectCommand);
    context.subscriptions.push(disposable);
}

export function deactivate() {
    log_dispose();
}