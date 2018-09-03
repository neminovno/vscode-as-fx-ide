import { get_appDescriptor, get_asconfig_mobile, get_MainAppFile_flex } from "../builders/templates";
import { ProjectModel } from "../model/ProjectModel";
import { IBuildProjectFiles, IProjectFile } from "../types";

export default class BuildFXMobile implements IBuildProjectFiles {

    public getFilesData(pm: ProjectModel): IProjectFile[] {

        pm.extension = '.mxml';

        return [
            {
                fileName: pm.get_srcDir() +  pm.appName + pm.extension,
                fileData: get_MainAppFile_flex(pm),
                toOpenAfterCreation: true
            },
            {
                fileName: pm.get_srcDir() + pm.appName + '-app.xml',
                fileData: get_appDescriptor(pm)
            },
            {
                fileName: 'asconfig.json',
                fileData: get_asconfig_mobile(pm)
            }
        ];
    }
}