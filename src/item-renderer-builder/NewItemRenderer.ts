import * as path from 'path';
import { window } from "vscode";
import { log } from '../logger';
import { copyFile_FSUtils, doesFileExist, openFileInEditor } from "../utils";
import { pick_ir_name, pick_ir_type } from "./steps";

const TEMPLATES_DIR: string = 'templates/ir';

export default class NewItemRendererCommand {

    async start(extPath: string, targetDir: string) {

        log('------starting new ItemRenderer------');
        log('targetDir: ' + targetDir);
        log('extPath: ' + extPath);

        // STEP 1
        const picked_ir_type = await pick_ir_type();

        if (!picked_ir_type) {
            log('picked_ir_type is undefined');
            return;
        }

        log('picked_ir_type:' + picked_ir_type.label);
        log('picked_ir_type:' + picked_ir_type.templateFilename);

        const templateFileName: string = picked_ir_type.templateFilename;

        // STEP 2
        const picked_ir_name = await pick_ir_name(picked_ir_type.namePlaceholder);

        if (!picked_ir_name) {
            log('picked_ir_name is undefined');
            return;
        }

        log('picked_ir_name:' + picked_ir_name);


        // CREATE FILE

        const templateRootPath: string = path.join(extPath, TEMPLATES_DIR);
        const fromFile: string = path.join(templateRootPath, templateFileName);
        const extension: string = templateFileName.substr(templateFileName.lastIndexOf('.'));
        const toFile: string = path.join(targetDir, picked_ir_name + extension);

        log('fromFile: ' + fromFile);
        log('toFile: ' + toFile);

        if (doesFileExist(toFile)) {
            const toOverwrite = await window.showWarningMessage('File exists:\n\n' + toFile + '\n\nOverwrite?', { modal: true }, 'Yes');
            if (toOverwrite !== 'Yes') {
                return;
            }
        }

        try {
            await copyFile_FSUtils(fromFile, toFile);
            await openFileInEditor(toFile);

            log('IR created');
        }
        catch (error) {
            log('catched error: ' + error);
        }
    }

    dispose(): void {
        //OUTPUT_CHANNEL.dispose();
    }
}