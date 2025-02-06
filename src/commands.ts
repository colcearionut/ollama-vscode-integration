import * as vscode from 'vscode';
import { Ollama } from 'ollama-node';

let existingPanel: vscode.WebviewPanel | undefined;

export async function generateWithOllama(prompt: string) {
    const modelName = 'deepseek-r1:32b';
    const ollama = new Ollama();
    await ollama.setModel(modelName);

    // Reuse or create a new webview panel for output
    var panel = getPanel();

    // Function to send words to the webview for display
    const print = async (word: string) => {
            panel?.webview.postMessage(word);
    };

    try {
        await ollama.streamingGenerate(prompt, print);
    } catch (error) {
        throw new Error(`Ollama API error: ${error}`);
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
        { enableScripts: true, retainContextWhenHidden:true }
    );

    // Set up the HTML content only once
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
                    padding: 10px;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    min-height: 100vh;
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
    return panel;
}