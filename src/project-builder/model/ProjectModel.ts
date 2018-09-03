import { ProjectType } from "../types";

export class ProjectModel {

    type: ProjectType;
    templateFullPath: string = '';
    appName: string = '';
    appId: string = '';

    /**
     * @description Used in builders for file name, and for asconfig template
     */
    extension: string = '';
    packageType: string = ''; //PackageType.NOT_SET;
    airVersion: string = '';
    srcDirs: string[] = ['src'];

    constructor(type: ProjectType) {
        this.type = type;
    }

    isFlex(): boolean {
        return this.type === ProjectType.FX_DESKTOP || this.type === ProjectType.FX_MOBILE;
    }

    isDesktop(): boolean {
        return this.type === ProjectType.FX_DESKTOP || this.type === ProjectType.AS_DESKTOP;
    }

    isLib(): boolean {
        return this.type === ProjectType.LIBRARY;
    }

    get_srcDir(): string {
        return this.srcDirs.join('/') + '/';
    }

    toString(): string {
        return `[ 
    type: ${this.type}
    templateFullPath: ${this.templateFullPath}
    appName: ${this.appName}
    appId: ${this.appId}
    extension: ${this.extension}
    packageType: ${this.packageType}
    airVersion: ${this.airVersion}
    srcDirs: ${this.srcDirs}
]`;
    }
}