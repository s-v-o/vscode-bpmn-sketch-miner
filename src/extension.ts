// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { compress } from "lz-string";
import LZString = require("lz-string");

var _onDidChange = new vscode.EventEmitter<vscode.Uri>();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "bpmn-sketch-miner" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "bpmn-sketch-miner.show",
    () => {
      // The code you place here will be executed every time your command is executed
      let text = vscode.window.activeTextEditor?.document.getText();
      if (text) {
        let encoded = LZString.compressToEncodedURIComponent('bpln:v1\n--\n' + text);


        let uri = vscode.Uri.parse(
          "https://www.bpmn-sketch-miner.ai/index.html#" + encoded
        );
        // vscode.env.openExternal(uri);

        let content = getContent(uri);

        const panel = vscode.window.createWebviewPanel(
          "showBPMNSketchMiner",
          "show Sketch Miner",
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
          }
        );

        panel.webview.html = content;

        _onDidChange.fire(uri);
      }

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from BPMN Sketch Miner!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

function getContent(url: vscode.Uri) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body onload="javascript:window.location = '${url}'">
</body>
</html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
