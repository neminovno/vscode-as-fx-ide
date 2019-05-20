import { InputBoxOptions, QuickPickOptions, window, WorkspaceFolder } from "vscode";
import BuildASDesktop from "./builders/BuildASDesktop";
import BuildASMobile from "./builders/BuildASMobile";
import BuildFXDesktop from "./builders/BuildFXDesktop";
import BuildFXMobile from "./builders/BuildFXMobile";
import BuildLibrary from "./builders/BuildLibrary";
import { PackageType, ProjectType } from "./types";

export async function pick_type() {
    const items = [
        {
            label: ProjectType.FX_DESKTOP,
            templateDir: 'Flex-desktop',
            description: "Use Flex/ActionScript to build desktop app",
            builder: BuildFXDesktop
        },
        {
            label: ProjectType.AS_DESKTOP,
            templateDir: 'AS3-desktop',
            description: "Use ActionScript to build desktop app",
            builder: BuildASDesktop
        },
        {
            label: ProjectType.FX_MOBILE,
            templateDir: 'Flex-mobile',
            description: "Use Flex/ActionScript to build mobile app",
            builder: BuildFXMobile
        },
        {
            label: ProjectType.AS_MOBILE,
            templateDir: 'AS3-mobile',
            description: "Use ActionScript to build mobile app",
            builder: BuildASMobile
        },
        {
            label: ProjectType.LIBRARY,
            templateDir: 'Flex-library',
            description: "Create SWC Library to use in other projects",
            builder: BuildLibrary
        },
    ];

    const opt: QuickPickOptions = {
        canPickMany: false,
        placeHolder: 'Pick project type',
        matchOnDescription: true,
        matchOnDetail: true,
        ignoreFocusOut: true
    };

    return await window.showQuickPick(items, opt);
}

export async function pick_appName(isLib: boolean) {
    const options: InputBoxOptions = {
        prompt: `Enter name for your ${isLib ? 'library' : 'application, like MyApp or com.example.MyApp'}`,
        placeHolder: `Enter something like: ${isLib ? 'MyLibrary' : 'MyApp or com.example.MyApp'}`,
        value: isLib ? 'MyLibrary' : 'MyApp',
        validateInput: value => {
            if (value === '') {
                return 'Name must have at least one character.';
            }

            let allowedChars = new RegExp(
                isLib ? '[^a-zA-Z0-9_]' : '[^a-zA-Z0-9_.]',
                'gi');

            if (allowedChars.test(value)) {
                return 'Not allowed charater is used.';
            }
            // must not start with number
            if (Number.isInteger(parseInt(value.charAt(0)))) {
                return 'Name cannot start with number.';
            }
            return null;
        },
        ignoreFocusOut: true
    };

    return await window.showInputBox(options);
}

export async function pick_packaging() {
    const items = [
        {
            label: PackageType.SHARED,
            description: "Packages app as .air installer",
            detail: 'Requires installed Adobe AIR.'
        },
        {
            label: PackageType.NATIVE_INSTALLER,
            description: "Packages app as target OS native installer (.exe or .dmg)",
            detail: 'Requires installed Adobe AIR.'
        },
        {
            label: PackageType.BUNDLED,
            description: "Packages app in standalone folder",
            detail: 'Adobe AIR is packaged with app.'
        }
    ];

    const opt: QuickPickOptions = {
        canPickMany: false,
        placeHolder: 'Pick project package type.',
        matchOnDescription: true,
        matchOnDetail: true,
        ignoreFocusOut: true
    };

    return await window.showQuickPick(items, opt);
}




export async function pick_targetDir(openedFolders: WorkspaceFolder[]) {

    const items = [];

    for (let folder of openedFolders) {
        items.push({
            label: folder.name,
            description: folder.uri.fsPath,
            fsPath: folder.uri.fsPath
        });
    }

    const opt: QuickPickOptions = {
        canPickMany: false,
        placeHolder: 'Pick project folder',
        matchOnDescription: true,
        matchOnDetail: true,
        ignoreFocusOut: true
    };

    return await window.showQuickPick(items, opt);
}
