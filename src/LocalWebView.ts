import * as path from "path";
import * as vscode from "vscode";
import { WebView } from "./WebView";

export class LocalWebView extends WebView {
  public getContent(
    context: vscode.ExtensionContext,
    content: string,
    panel: vscode.WebviewPanel
  ) {
    let encoded = this.encode(content);
    let bpmnSketchMinerUrl = this.getBpmnSketchMinerUrl(encoded);
    let libUri = panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, "lib/"))
    );

    panel.webview.onDidReceiveMessage(async message => {
      if (message?.command === 'download') {
        const uri = await vscode.window.showSaveDialog({
          defaultUri: vscode.Uri.file('bpmn.svg')
        });

        if (uri) {
          await vscode.workspace.fs.writeFile(
            uri,
            Buffer.from(message.payload, 'utf8')
          );
        }
      }
    });

    return `
<!DOCTYPE html>
<!-- saved from url=https://www.bpmn-sketch-miner.ai -->
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta
  http-equiv="Content-Security-Policy"
  content="default-src ${panel.webview.cspSource} https:; script-src ${panel.webview.cspSource} 'unsafe-inline'; style-src ${panel.webview.cspSource} 'unsafe-inline';"
/>
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
<span id="button-export">
  <a id="button-export-svg">SVG</a>
</span>

<script>

  const api = acquireVsCodeApi();

  document.getElementById("button-export-svg").addEventListener("click", ()=>{
    const svg = export_svg(document.querySelector('svg'), 'test'); 
    api.postMessage({command: 'download', payload: svg});
  });

</script>

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
<script src="${libUri}/scripts.js"></script> 
<script src="${libUri}/socket.io/socket.io.js"></script>
</body></html>
`;
  }
}
