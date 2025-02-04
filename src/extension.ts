// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { generateWithOllama } from './commands';

// This method is called when your extension is activated
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
            vscode.window.showWarningMessage('Prompt sent to Ollama');
            await generateWithOllama(prompt);
        }
        catch (err)
        {
            vscode.window.showErrorMessage('Error Generating with Ollama:    ' + err);
            return;
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
