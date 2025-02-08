import * as vscode from 'vscode';
import { generateWithOllama } from './generation';

export async function ollamaPromptCommand(){
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    const selection = editor.document.getText(editor.selection).trim();

    try {
        // Show input box for user to provide additional information
        var systemMessage = await vscode.window.showInputBox({
            title: 'Prompt Ollama',
            prompt: 'Enter a question or press enter to continue:',
            value: undefined,
        });

        if (!selection && !systemMessage) {
            vscode.window.showErrorMessage('Please select some text or ask a question to send to Ollama.');
            return;
        }

        var prompt = selection;

        if (systemMessage) {
            prompt = systemMessage + "\n" + selection;
        }

        await generateWithOllama(prompt);
    } catch (err) {
        vscode.window.showErrorMessage('Error generating with Ollama: ' + err);
        return;
    }
}

