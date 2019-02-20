import { ProjectModel } from "../model/ProjectModel";
import { IBuildProjectFiles, IProjectFile } from "../types";
import { get_asconfig_mobile, get_MainAppFile_as, get_appDescriptor_mobile } from "./templates";

export default class BuildASMobile implements IBuildProjectFiles {

    public getFilesData(pm: ProjectModel): IProjectFile[] {

        pm.extension = '.as';

        return [
            {
                fileName: pm.get_srcDir() + pm.appName + pm.extension,
                fileData: get_MainAppFile_as(pm),
                toOpenAfterCreation: true
            },
            {
                fileName: pm.get_srcDir() + pm.appName + '-app.xml',
                fileData: get_appDescriptor_mobile(pm)
            },
            {
                fileName: 'asconfig.json',
                fileData: get_asconfig_mobile(pm)
            }
        ];
    }
}