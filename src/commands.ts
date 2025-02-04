import * as vscode from 'vscode';
import axios from 'axios';
import { Ollama } from 'ollama-node';

export async function generateWithOllama(prompt: string){

    const modelName = 'deepseek-r1:32b';
    const ollama = new Ollama();
    await ollama.setModel(modelName);

    const uri = vscode.Uri.parse('untitled:' + Date.now().toString());

    // Open a new empty document at the specified URI
    let doc: vscode.TextDocument;
    let editor: vscode.TextEditor;

    try {   
        doc = await vscode.workspace.openTextDocument(uri);
        editor = await vscode.window.showTextDocument(doc);
    } catch (error) {
        console.error('Error opening text document:', error);
    }

    // callback to print each word 
    const print = async (word: string) =>             
    {
        await writeWord(word, uri, doc, editor);
    }

    try {
        await ollama.streamingGenerate(prompt, print);
    } catch (error) {
        throw new Error(`Ollama API error: ` + error);
    }
}

export async function writeWord(word: string, uri: vscode.Uri, doc: vscode.TextDocument, editor: vscode.TextEditor){
    if (word.length === 0) return;

    // Ensure we are at the end of the document
    const currentEndPosition = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);

    // Create a text edit to append the chunk
    const range = new vscode.Range(currentEndPosition, currentEndPosition);
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, currentEndPosition, word);

    // Apply the edit
    await vscode.workspace.applyEdit(edit);

    // Ensure the editor scrolls to show the new content
    if (editor) {
        editor.revealRange(range, vscode.TextEditorRevealType.Default);
    }
}