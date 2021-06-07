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
</head>
<body onload="javascript:window.location = '${url}'">
</body>
</html>
`;
  }
}
