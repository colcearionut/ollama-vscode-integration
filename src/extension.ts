import * as vscode from 'vscode';
import { generateWithOllama } from './commands';

export function activate(context: vscode.ExtensionContext) {
    // Register the command to generate with Ollama
    let disposable = vscode.commands.registerCommand('ollama.generate', async () => {
		
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const selection = editor.selection;
        const prompt = editor.document.getText(selection);

        if (prompt.trim() === '') {
            vscode.window.showErrorMessage('Please select some text to send to Ollama.');
            return;
        }

        try
        {
            await generateWithOllama(prompt);
        }
        catch (err)
        {
            vscode.window.showErrorMessage('Error Generating with Ollama: ' + err);
            return;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
