import * as vscode from 'vscode';
import { Ollama } from 'ollama-node';

let ollama: Ollama | undefined;
let existingPanel: vscode.WebviewPanel | undefined;
let isGenerating: boolean;

export async function generateWithOllama(prompt: string) {
    if (!ollama){
        ollama = await initializeModel("deepseek-r1:32b");
    }

    if (isGenerating) {
        vscode.window.showWarningMessage('Please wait for current generation to finish');
        return;
    }

    // Reuse or create a new webview panel for output
    var panel = getPanel();

    try {
        isGenerating = true;
        await ollama.streamingGenerate(prompt, (word) => panel.webview.postMessage(word), null, checkCompletion);
    } catch (error) {
        isGenerating = false;
        throw new Error(`Ollama API error: ${error}`);
    }
}

async function initializeModel(modelName: string){
    var ollamaInstance = new Ollama();
    await ollamaInstance.setModel(modelName);
    return ollamaInstance;
}

function checkCompletion(status: string) {
    if (status.includes("\"done\":true")) {
        isGenerating = false;
    }
}

function getPanel(): vscode.WebviewPanel {
    if (existingPanel) {
        existingPanel?.webview.postMessage("\n\n\nNEW PROMPT:\n\n\n");
        return existingPanel;
    }

    var panel = vscode.window.createWebviewPanel(
        'ollamaOutput',
        'JARVIS AI',
        vscode.ViewColumn.Two,
        { enableScripts: true, retainContextWhenHidden: true }
    );

    // Set up the HTML content
    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>JARVIS AI</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 8px;
                    font-family: Consolas;
                    font-size: 15px;
                    min-height: 200vh;
                    display: flex;
                    flex-direction: column;
                }
                #output {
                    width: 100%;
                    height: calc(100vh - 20px);
                    overflow-y: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    padding: 5px;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <pre id="output"></pre>
            <script>
                window.addEventListener('message', function(event) {
                    const output = document.getElementById('output');
                    output.textContent += event.data;
                    output.scrollTop = output.scrollHeight;
                });
            </script>
        </body>
        </html>
    `;

    existingPanel = panel;
    panel.onDidDispose(() => existingPanel = undefined);
    return panel;
}
