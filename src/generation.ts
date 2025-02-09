import * as vscode from 'vscode';
import { Ollama } from 'ollama-node';
import { createWebview } from './presentation';
import { print } from './presentation';

let ollama: Ollama | undefined;
let isGenerating: boolean;

export async function generateWithOllama(prompt: string) {
    if (!ollama){
        ollama = await initializeModel();
    }

    if (isGenerating) {
        vscode.window.showWarningMessage('Please wait for current generation to complete.');
        return;
    }

    createWebview();

    try {
        print("INPUT:\n\n" + prompt);
        print("\n\nOUTPUT:\n\n");
        isGenerating = true;
        await ollama.streamingGenerate(prompt, (word) => print(word), null, checkCompletion);
    } catch (error) {
        isGenerating = false;
        throw new Error(`Ollama API error: ${error}`);
    }
}

async function initializeModel(){
    var modelName = vscode.workspace.getConfiguration('ollama').get<string>('modelName', '');
    var ollamaInstance = new Ollama();
    await ollamaInstance.setModel(modelName);
    return ollamaInstance;
}

function checkCompletion(status: string) {
    if (status.includes("\"done\":true")) {
        isGenerating = false;
    }
}
