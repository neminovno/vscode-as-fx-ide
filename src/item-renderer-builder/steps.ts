import { InputBoxOptions, QuickPickOptions, window } from "vscode";
import { IRType } from "./types";

export async function pick_ir_type() {
    let items = [
        {
            label: IRType.FOR_SPARK,
            namePlaceholder: 'MyItemRenderer',
            templateFilename: 'SparkItemRenderer.mxml',
            description: "Creates ItemRenderer"
        },
        {
            label: IRType.FOR_SPARK_DG,
            namePlaceholder: 'MyGridItemRenderer',
            templateFilename: 'SparkDGItemRenderer.mxml',
            description: "Creates GridItemRenderer"
        },
        {
            label: IRType.FOR_HALO_ADG,
            namePlaceholder: 'MyMXAdvancedDataGridItemRenderer',
            templateFilename: 'MXAdvancedDataGridItemRenderer.mxml',
            description: "Used in web or desktop projects"
        },
        {
            label: IRType.FOR_HALO_DG,
            namePlaceholder: 'MyMXDataGridItemRenderer',
            templateFilename: 'MXDataGridItemRenderer.mxml',
            description: "Used in web or desktop projects"
        },
        {
            label: IRType.FOR_HALO_TREE,
            namePlaceholder: 'MyMXTreeItemRenderer',
            templateFilename: 'MXTreeItemRenderer.mxml',
            description: "Used in web or desktop projects"
        },
        {
            label: IRType.FOR_MOBILE_ICON,
            namePlaceholder: 'MyMobileIconItemRenderer',
            templateFilename: 'MobileIconItemRenderer.mxml',
            description: "Used in mobile projects"
        },
        {
            label: IRType.FOR_MOBILE_CUSTOM,
            namePlaceholder: 'MyCustomActionScriptItemRenderer', templateFilename: 'CustomActionScriptItemRenderer.as', description: "Used in mobile projects"
        },
    ];

    let opt: QuickPickOptions = {
        canPickMany: false,
        placeHolder: 'Pick item renderer type...',
        matchOnDescription: true,
        matchOnDetail: true,
        ignoreFocusOut: true
    };

    return await window.showQuickPick(items, opt);
}

export async function pick_ir_name(namePlaceholder: string) {
    let opts: InputBoxOptions = {
        prompt: "Enter new item renderer name...",
        value: namePlaceholder,
        validateInput: value => {
            if (value === '') {
                return 'Name must have at least one character.';
            }
            if (value.indexOf(' ') !== -1) {
                return 'Space character is not allowed.';
            }
            return null;
        }
    };

    return await window.showInputBox(opts);
}