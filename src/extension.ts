'use strict';

import * as vscode from 'vscode';
import NewItemRendererCommand from './item-renderer-builder/NewItemRenderer';
import { log_dispose } from './logger';
import NewProjectCommand from './project-builder/NewProject';

export function activate(context: vscode.ExtensionContext) {

    const newProjectCommand = new NewProjectCommand();
    const newItemRendererCommand = new NewItemRendererCommand();

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

    let disposable_newItemRenderer = vscode.commands.registerCommand('extension.newItemRenderer', async (args) => {
        //console.log('newItemRenderer args: ' + args);
        //console.log('newItemRenderer args: ' + args.fsPath);

        if(args === undefined){
            vscode.window.showInformationMessage('Run New Item Renderer command with right click on folder.');
            return;
        }

        newItemRendererCommand.start(context.extensionPath, args.fsPath);
    });

    context.subscriptions.push(newProjectCommand);
    context.subscriptions.push(newItemRendererCommand);
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable_newItemRenderer);
}

export function deactivate() {
    log_dispose();
}