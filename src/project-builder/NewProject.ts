import * as path from 'path';
import { window, WorkspaceFolder } from 'vscode';
import { log } from '../logger';
import { openFileInEditor, getAIRverFromSDKPath } from '../utils';
import { ProjectModel } from './model/ProjectModel';
import { pick_appName, pick_packaging, pick_targetDir, pick_type } from './steps';
import { IBuildProjectFiles, IProjectFile } from './types';
import { copyDir, deleteFiles, getDirFiles, isDirEmpty, mkDirsInDir, writeFiles } from './utils';

const TEMPLATES_DIR: string = 'templates/project';
const DEFAULT_AIR_VERSION: string = '30.0';

/**
 * Starts New Project guided process of creating picked project files.
 */
export default class NewProjectCommand {

    async start(openedFolders: WorkspaceFolder[], extPath: string, sdkPath: string) {

        log('------starting new project------');
        log('extPath: ' + extPath);

        // pick one of the workspace folders
        const picked_targetDir = await pick_targetDir(openedFolders);

        if (!picked_targetDir) {
            console.error('picked_targetDir is undefined');
            return;
        }

        const targetDir = picked_targetDir.fsPath;

        console.log('picked_targetDir:', picked_targetDir);

        log('targetDir: ' + targetDir);


        //
        /* if (!isDirEmpty(targetDir)) {
            const toDeleteFiles_confirm = await window.showWarningMessage("Before creating new project, all files will be deleted in:\n" + targetDir + "\n\nContinue?", { modal: true }, "No", "Yes");

            if (toDeleteFiles_confirm !== 'Yes') {
                return;
            }

            log('deleting all files in target dir');

            await deleteFiles(targetDir);
        } */

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

            for (const iterator of pfd) {
                if (iterator.toOpenAfterCreation) {
                    await openFileInEditor(path.join(targetDir, iterator.fileName));
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
}
