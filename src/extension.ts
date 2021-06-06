// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { LocalWebView } from "./LocalWebView"
import { HybridWebView } from "./HybridWebView"
import { RemoteWebView } from "./RemoteWebView"
import { WebView } from "./WebView"

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  let panel: vscode.WebviewPanel | undefined = undefined;
  let currentSource:string = ""

  console.log(
    'Extension "bpmn-sketch-miner" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "bpmn-sketch-miner.show",
    () => {
      // The code you place here will be executed every time your command is executed
      if (!vscode.window.activeTextEditor)
        return;
      let text = vscode.window.activeTextEditor.document.getText() + '\n';
      if (text) {

        let source = vscode.workspace.getConfiguration('bpmn-sketch-miner').get("generatorSource") as string

        if (panel) {
          if(source != currentSource){
            panel.dispose()
            panel = WebView.createWebPanel()
            currentSource = source;
          }
        }else{
          panel = WebView.createWebPanel()
          currentSource = source
        }
        let webView: WebView;

        switch (source) {
          case "local":
            webView = new LocalWebView()
            break;
          case "hybrid":
            webView = new HybridWebView()
            break;
          case "web":
            webView = new RemoteWebView()
            break;
          default:
            webView = new LocalWebView()
            break;
        }

        let content = webView.getContent(context, text, panel);
        panel.webview.html = content;

      }

    }
  );

  context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() { }
