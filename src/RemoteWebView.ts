import * as vscode from "vscode";
import { WebView } from "./WebView";

export class RemoteWebView extends WebView {
  public getContent(
    context: vscode.ExtensionContext,
    content: string,
    panel: vscode.WebviewPanel
  ) {
    let url = this.getBpmnSketchMinerUrl(this.encode(content));
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://www.bpmn-sketch-miner.ai;">
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body >
<iframe
    src="${url}"
    style="width:100%;height:100vh;border:none;">
</iframe>
</body>
</html>
`;
  }
}
