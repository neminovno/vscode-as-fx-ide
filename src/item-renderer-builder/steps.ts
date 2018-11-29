import { InputBoxOptions, QuickPickOptions, window } from "vscode";
import { IRType } from "./types";

export async function pick_ir_type() {
    let items = [
        {
            label: IRType.FOR_SPARK,
            namePlaceholder: 'MyItemRenderer',
            templateFilename: 'SparkItemRenderer.mxml',
            description: "Creates ItemRenderer base class for Spark item renderers"
        },
        {
            label: IRType.FOR_SPARK_DG,
            namePlaceholder: 'MyGridItemRenderer',
            templateFilename: 'SparkDGItemRenderer.mxml',
            description: "Creates GridItemRenderer for the Spark grid controls, such as DataGrid and Grid"
        },
        {
            label: IRType.FOR_HALO_ADG,
            namePlaceholder: 'MyMXAdvancedDataGridItemRenderer',
            templateFilename: 'MXAdvancedDataGridItemRenderer.mxml',
            description: "Creates Spark item renderer class for use with the MX AdvancedDataGrid control."
        },
        {
            label: IRType.FOR_HALO_DG,
            namePlaceholder: 'MyMXDataGridItemRenderer',
            templateFilename: 'MXDataGridItemRenderer.mxml',
            description: "Creates Spark item renderer class for use with the MX DataGrid control."
        },
        {
            label: IRType.FOR_HALO_TREE,
            namePlaceholder: 'MyMXTreeItemRenderer',
            templateFilename: 'MXTreeItemRenderer.mxml',
            description: "Creates Spark item renderer class for use with the MX Tree control."
        },
        {
            label: IRType.FOR_MOBILE_ICON,
            namePlaceholder: 'MyIconItemRenderer',
            templateFilename: 'MobileIconItemRenderer.mxml',
            description: "Creates IconItemRenderer for mobile devices."
        },
        {
            label: IRType.FOR_MOBILE_CUSTOM,
            namePlaceholder: 'MyCustomActionScriptItemRenderer', 
            templateFilename: 'CustomActionScriptItemRenderer.as', 
            description: "Creates LabelItemRenderer for a list-based control in the mobile theme."
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