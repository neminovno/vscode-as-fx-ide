import { ProjectModel } from "./model/ProjectModel";

export interface IProjectFile {
    fileName: string;
    fileData: string;
    toOpenAfterCreation?: boolean;
}

export interface IBuildProjectFiles {
    getFilesData(pm: ProjectModel): IProjectFile[];
}

export enum ProjectType {
    //NOT_SET = 'Not set',
    FX_DESKTOP = 'Flex desktop',
    AS_DESKTOP = 'ActionScript desktop',
    FX_MOBILE = 'Flex mobile',
    AS_MOBILE = 'ActionScript mobile',
    LIBRARY = 'SWC Library',
}

export enum PackageType {
    //NOT_SET = "Not set",
    SHARED = 'Shared runtime',
    NATIVE_INSTALLER = 'Native installer',
    BUNDLED = 'Captive runtime (bundle)'
}
/* 
export default class ProjectType {
    static FX_DESKTOP: string = 'Flex desktop';
    static AS_DESKTOP: string = 'ActionScript desktop';
    static FX_MOBILE: string = 'Flex mobile';
    static AS_MOBILE: string = 'ActionScript mobile';
    static LIBRARY: string = 'SWC Library';
}
export default class PackageType {
    static SHARED: string = 'Shared runtime';
    static NATIVE_INSTALLER: string = 'Native installer';
    static BUNDLED: string = 'Captive runtime (bundle)';
} */
