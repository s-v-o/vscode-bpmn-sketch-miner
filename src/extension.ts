// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { LocalWebView } from "./LocalWebView";
import { HybridWebView } from "./HybridWebView";
import { RemoteWebView } from "./RemoteWebView";
import { WebView } from "./WebView";

let currentSource: string = "";
let panel: vscode.WebviewPanel | undefined = undefined;

const log = vscode.window.createOutputChannel(
  'vscode-bpmn-sketch-miner',
  { log: true }
);

export function activate(context: vscode.ExtensionContext) {

  log.info('Extension "bpmn-sketch-miner" is now active!!!');
  log.info(`Version: ${context.extension.packageJSON.version}`)

  let disposable = vscode.commands.registerCommand(
    "bpmn-sketch-miner.show",
    () => {
      renderBPMN(context, panel, currentSource);
    }
  );

  vscode.workspace.onDidSaveTextDocument(async () => {
    await renderBPMN(context, panel, currentSource)
  })

  context.subscriptions.push(disposable);
  context.subscriptions.push(log);

}

async function renderBPMN(context: vscode.ExtensionContext, panel: vscode.WebviewPanel | undefined, currentSource: string) {
  if (!vscode.window.activeTextEditor) {
    return;
  }
  const editor = vscode.window.activeTextEditor;
  let text = editor.document.getText() + "\n";
  if (text) {
    let source = vscode.workspace
      .getConfiguration("bpmn-sketch-miner")
      .get("generatorSource") as string;

    if (panel) {
      if (source !== currentSource) {
        panel.dispose();
        panel = WebView.createWebPanel();
        currentSource = source;
      }
    } else {
      panel = WebView.createWebPanel();
      currentSource = source;
    }
    panel.onDidDispose(() => (panel = undefined));
    let webView: WebView;

    switch (source) {
      case "local":
        webView = new LocalWebView();
        break;
      case "hybrid":
        webView = new HybridWebView();
        break;
      case "web":
        webView = new RemoteWebView();
        break;
      default:
        webView = new LocalWebView();
        break;
    }

    let content = webView.getContent(context, text, panel);
    panel.webview.html = content;
    
    await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');

  }

}

// this method is called when your extension is deactivated
export function deactivate() { }
