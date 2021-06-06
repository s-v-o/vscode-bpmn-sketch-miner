import * as vscode from "vscode";
import LZString = require("lz-string");

export abstract class WebView{

    public static createWebPanel(){
        return vscode.window.createWebviewPanel(
            "showBPMNSketchMiner",
            "show Sketch Miner",
            vscode.ViewColumn.Two,
            {
              enableScripts: true,
            }
          );

    }

    public abstract getContent(context: vscode.ExtensionContext, content: string, panel:vscode.WebviewPanel):string

    encode(content:String){
        return LZString.compressToEncodedURIComponent('bpln:v1\n--\n' + content);
    }


    getBpmnSketchMinerUrl(encodedContent:String){
        return vscode.Uri.parse("https://www.bpmn-sketch-miner.ai/index.html#" + encodedContent);
    }

}
