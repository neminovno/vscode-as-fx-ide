import { OutputChannel, window } from "vscode";

const OUTPUT_CHANNEL_NAME: string = 'as-fx-ide';
const OUTPUT_CHANNEL: OutputChannel = window.createOutputChannel(OUTPUT_CHANNEL_NAME);

export function log(line: string): void {
    OUTPUT_CHANNEL.appendLine(new Date().toLocaleString() + ' -> ' + line);
    console.log(line);
}

export function log_dispose(): void {
    OUTPUT_CHANNEL.dispose();
}
