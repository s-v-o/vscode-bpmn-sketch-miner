// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import LZString = require("lz-string");
import * as path from "path";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  let panel: vscode.WebviewPanel | undefined = undefined;

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

        if (!panel) {
          panel = vscode.window.createWebviewPanel(
            "showBPMNSketchMiner",
            "show Sketch Miner",
            vscode.ViewColumn.Two,
            {
              enableScripts: true,
            }
          );
        }

        let content = getContent(context, text, panel);
        panel.webview.html = content;

      }

    }
  );

  context.subscriptions.push(disposable);
}

function getContent(context: vscode.ExtensionContext, content: string, panel:vscode.WebviewPanel) {

  let encoded = LZString.compressToEncodedURIComponent('bpln:v1\n--\n' + content);
  let bpmnSketchMinerUrl = vscode.Uri.parse("https://www.bpmn-sketch-miner.ai/index.html#" + encoded);
  let libUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'lib/')));

  return `
<!DOCTYPE html>
<!-- saved from url=https://www.bpmn-sketch-miner.ai -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>BPMN Sketch Miner</title>
<meta name="description" content="Sketch process models with the BPMN Business Process Modeling Notation as you describe them in simple natural language">
<meta name="version" content="1.17.3.3296">
<meta name="author" content="Cesare Pautasso, Ana Ivanchikj, Ilija Gjorgjiev"> 
<link rel="stylesheet" href="${libUri}/style.css">
<link id="favicon" rel="shortcut icon" href="${libUri}/logo.png">
</head>
<body data-src="" class="hideNodeFrequency render-done">
<header><section>
<h1>BPMN Sketch Miner</h1>
<nav>
<div style="flex:1"></div></section><section><nav><span id="button-option-layout">Layout: 
<a id="button-option-layout-orientation-vertical" href="#" title="Vertical" class="selected">↓</a>
<a id="button-option-layout-orientation-horizontal" href="#" title="Horizontal">→</a></span>
<span id="button-option-layout">Zoom: <a id="button-option-layout-zoom-none" href="#" title="1:1">1:1</a>
<a id="button-option-layout-zoom-fit" href="#" title="Fit" class="selected">Fit</a></span>
<span id="button-share"><a id="button-share-url-ext" href="${bpmnSketchMinerUrl}" style="">Link</a></span>
</span>
</nav></section>
</header>
<main>
<textarea id="logtext" style="display:none;" oninput="live(this.value+'\\n',true);" placeholder="What&#39;s your process like today?">
    ${content}
</textarea>
<div><svg id="restalk" style="">
</svg>
</div>
</main>
<div style="display: none"><footer><progress id="progress" style="display: none;"></progress><p id="status" style="display: none;">exporting</p></footer>
<textarea id="explog"></textarea></div>
<script src="${libUri}/scripts.js"></script> <script src="${libUri}/socket.io/socket.io.js"></script>
</body></html>
`
}

// this method is called when your extension is deactivated
export function deactivate() { }
