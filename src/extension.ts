import * as vscode from 'vscode';
import { generateWithOllama } from './commands';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('ollama.prompt', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const selection = editor.document.getText(editor.selection).trim();

        if (selection === '') {
            vscode.window.showErrorMessage('Please select some text to send to Ollama.');
            return;
        }

        try {
            // Show input box for user to provide additional information
            const systemMessage = await vscode.window.showInputBox({
                title: 'Prompt Ollama',
                prompt: 'Enter a question or press enter to continue:',
                value: '',
            });

            var prompt = selection;

            if (systemMessage !== undefined) {
                prompt = systemMessage + "\n" + selection;
            }

            await generateWithOllama(prompt);
        } catch (err) {
            vscode.window.showErrorMessage('Error generating with Ollama: ' + err);
            return;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
