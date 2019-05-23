import * as path from 'path';
import { window, WorkspaceFolder, workspace, Uri, commands } from 'vscode';
import { log } from '../logger';
import { openFileInEditor, getAIRverFromSDKPath } from '../utils';
import { ProjectModel } from './model/ProjectModel';
import { pick_appName, pick_packaging, pick_targetDir, pick_type } from './steps';
import { IBuildProjectFiles, IProjectFile } from './types';
import { copyDir, getDirFiles, isDirEmpty, mkDirsInDir, writeFiles } from './utils';

const TEMPLATES_DIR: string = 'templates/project';
const DEFAULT_AIR_VERSION: string = '30.0';

/**
 * Starts New Project guided process of creating picked project files.
 */
export default class NewProjectCommand {

    async start(openedFolders: WorkspaceFolder[] | undefined, extPath: string, sdkPath: string) {

        log('------starting new project------');
        log('extPath: ' + extPath);

        // pick one of the workspace folders
        const picked_targetDir = await pick_targetDir(openedFolders);

        if (!picked_targetDir) {
            console.error('picked_targetDir is undefined');
            return;
        }

        log('picked_targetDir: ' + picked_targetDir);

        let targetDir = '';

        if (picked_targetDir.fsPath === 'custom') {
            // provide folder pick
            const customFolder = await window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                //openLabel: 'Choose project folder'
            })

            if (!customFolder) {
                console.error('customFolder is undefined');
                log('customFolder is undefined');
                return;
            }

            log('customFolder:' + customFolder);

            targetDir = customFolder[0].fsPath;

        } else {
            targetDir = picked_targetDir.fsPath;
        }

        log('targetDir: ' + targetDir);

        if (!isDirEmpty(targetDir)) {
            const toContinue = await window.showWarningMessage("Selected folder is not empty. Some files may be overwritten. Continue?", { modal: true }, "Yes");

            if (toContinue !== 'Yes') {
                return;
            }
        }

        // STEP 1
        const picked_type = await pick_type();

        if (!picked_type) {
            console.error('picked_type is undefined');
            return;
        }

        const project: ProjectModel = new ProjectModel(picked_type.label);
        //project.type = picked_type.label;
        project.templateFullPath = path.join(extPath, TEMPLATES_DIR, picked_type.templateDir);

        const airVersion = getAIRverFromSDKPath(sdkPath);

        log('got airVersion from sdkPath: ' + airVersion);

        project.airVersion = airVersion === '' ? DEFAULT_AIR_VERSION : airVersion;

        try {
            log('curr templateFullPath files:' + getDirFiles(project.templateFullPath));
        } catch (error) {
            log('error: ' + error);
        }

        const projectBuilder: IBuildProjectFiles = new picked_type.builder();

        // STEP 2
        const picked_name = await pick_appName(project.isLib());

        if (!picked_name) {
            console.error('picked_name is undefined');
            return;
        }

        project.appName = picked_name;
        project.appId = picked_name.replace(/_/gi, '');

        // if name is like com.example.AppName, parse id and name
        if (picked_name.indexOf('.') > -1) {
            const appNameParts: string[] = picked_name.split('.');
            const srcDirsToCreate: string[] = appNameParts.slice(0, -1);

            project.appName = appNameParts.slice(-1).toString();

            // add extra path to src/
            project.srcDirs = project.srcDirs.concat(srcDirsToCreate);
        }

        // STEP 3
        if (project.isDesktop()) {

            const picked_package_type = await pick_packaging();

            if (!picked_package_type) {
                console.error('picked_package_type is undefined');
                return;
            }

            project.packageType = picked_package_type.label;
        }

        log('project:' + project);

        try {
            log('copy template files');

            let copy_results: string[] = await copyDir(project.templateFullPath, targetDir);

            log('copied template files:\n' + copy_results.join('\n'));


            mkDirsInDir(targetDir, project.srcDirs);

            const pfd: IProjectFile[] = projectBuilder.getFilesData(project);

            log('pfd:' + pfd.length);

            await writeFiles(targetDir, pfd);

            // if project is being created outside of workspace, provide option to open it or add it to workspace 
            const isTargetFolderOpened = this.isTargetFolderOpenedOrInWorkspace(targetDir);

            if (isTargetFolderOpened) {
                // target folder is opened, open created file(s)
                await this.openCreatedFiles(targetDir, pfd);
            }
            else {
                // target folder is not opened, ask to open it

                let targetDirUri = Uri.file(targetDir);

                const toOpenTargetFolder = await window.showInformationMessage(
                    "Project is created, but is not opened. Open it now?", { modal: true },
                    "Open", "Open in new window", "Add to workspace and open");

                if (toOpenTargetFolder === 'Open') {
                    await commands.executeCommand('vscode.openFolder', targetDirUri);

                    await this.openCreatedFiles(targetDir, pfd);
                }
                else if (toOpenTargetFolder === 'Open in new window') {
                    await commands.executeCommand('vscode.openFolder', targetDirUri, true);

                    // can't open file as new window starts
                    //await this.openCreatedFiles(targetDir, pfd);
                }
                else if (toOpenTargetFolder === 'Add to workspace and open') {
                    workspace.onDidChangeWorkspaceFolders(
                        async (e) => {
                            log('onDidChangeWorkspaceFolders:' + e)
                            if (e.added.length > 0) {
                                log('onDidChangeWorkspaceFolders e.added:' + e.added)

                                await this.openCreatedFiles(targetDir, pfd);
                            }
                        }
                    )

                    // if no folder or workspace is opened, Explorer could be hidden, show it now, so user can notice created project
                    await commands.executeCommand('workbench.view.explorer');

                    // adding a new workspace folder at the end of workspace folders
                    workspace.updateWorkspaceFolders(workspace.workspaceFolders ? workspace.workspaceFolders.length : 0, null, { uri: targetDirUri });
                }
                else {
                    // Cancel - don't open
                }
            }

            log('Project is created.');

        } catch (error) {
            log('open doc error occured: ' + error);
        }
    }

    dispose(): void {
        //OUTPUT_CHANNEL.dispose();
    }

    isTargetFolderOpenedOrInWorkspace(somePath: string): boolean {
        const openedFolders = workspace.workspaceFolders;

        if (!openedFolders)
            return false;

        for (let folder of openedFolders) {
            if (folder.uri.fsPath === somePath) {
                return true;
            }
        }

        return false;
    }

    async openCreatedFiles(targetDir: string, pfd: IProjectFile[]) {
        for (const iterator of pfd) {
            if (iterator.toOpenAfterCreation) {
                await openFileInEditor(path.join(targetDir, iterator.fileName));
            }
        }
    }
}
