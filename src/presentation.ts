import * as vscode from 'vscode';

let webview: vscode.WebviewPanel | undefined;

export function createWebview(): vscode.WebviewPanel {
    if (webview) {
        print("\n\n\nNEW PROMPT:\n");
        return webview;
    }

    var panel = vscode.window.createWebviewPanel(
        'ollamaOutput',
        'Local AI Assistant',
        vscode.ViewColumn.Two,
        { enableScripts: true, retainContextWhenHidden: true }
    );

    // Set up the HTML content
    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Local AI Assistant</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 8px;
                    font-family: Consolas;
                    font-size: 15px;
                    height: 100vh;
                    overflow-y: hidden;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                }
                #output {
                    width: 100%;
                    flex-grow: 1;
                    overflow-y: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    padding: 5px;
                    margin: 0;
                    box-sizing: border-box;
                }
            </style>
        </head>
        <body>
            <pre id="output"></pre>
            <script>
                window.addEventListener('message', function(event) {
                    const output = document.getElementById('output');
                    output.textContent += event.data;
                    
                    requestAnimationFrame(() => {
                        output.scrollTop = output.scrollHeight - output.clientHeight + 10;
                    });
                });
            </script>
        </body>
        </html>
    `;

    webview = panel;
    panel.onDidDispose(() => webview = undefined);
    return panel;
}

export function print(output: string){
    webview?.webview.postMessage(output);
}