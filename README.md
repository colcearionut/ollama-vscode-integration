# ollama-vscode-integration README

## Features

This extension provides a keyboard shortcut (Alt+Shift+Z) to prompt a local Ollama model with the selected code and an optional input box.
\!\[Settings\]\(images/prompt-example.png\)

A custom keyboard shortcut can also be configured in VS Code settings for the *ollama.prompt* command.
\!\[Settings\]\(images/keyboard-shortcut-example.png\)

The output is presented on a secondary tab:
\!\[Settings\]\(images/prompt-output-example.png\)

## Requirements

1. Install Ollama - https://ollama.com/
2. In your terminal, pull the model you want to use: "ollama pull <modelName>" - https://ollama.com/library/
3. In VSCode settings, under Ollama Extension Settings, set the model you want to use with the extension.
    - The default model is deepseek-r1:1.5b, as it's the most accessible to run.
    \!\[Settings\]\(images/settings.png\)

## Extension Settings

This extension contributes the following settings:

* `ollama.enable`: Enable/disable this extension.
* `ollama.modelName`: The model name to use with Ollama.

### 1.0.0

Initial release.
