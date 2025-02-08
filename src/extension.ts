import * as vscode from 'vscode';
import { ollamaPromptCommand } from './commands';

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    let disposable = vscode.commands.registerCommand('ollama.prompt', () => ollamaPromptCommand());
    context.subscriptions.push(disposable);
}

export function deactivate() {}
