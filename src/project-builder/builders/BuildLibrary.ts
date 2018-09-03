import { ProjectModel } from "../model/ProjectModel";
import { IBuildProjectFiles, IProjectFile } from "../types";
import { get_asconfig_lib, get_lib_samplefile } from "./templates";

export default class BuildLibrary implements IBuildProjectFiles {

    public getFilesData(pm: ProjectModel): IProjectFile[] {

        return [
            {
                fileName: 'src/MyClass.mxml',
                fileData: get_lib_samplefile(),
                toOpenAfterCreation: true
            },
            {
                fileName: 'asconfig.json',
                fileData: get_asconfig_lib(pm)
            }
        ];
    }
}