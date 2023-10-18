import * as vscode from 'vscode';


export default (webview: vscode.Webview, base: vscode.Uri) => { 
  const styleResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(base, "out", "compiled/index.css")
  );

  const scriptResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(base, "out", "compiled/index.js")
  );

  const jqueryResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(base, "out", "compiled/jquery.js")
  );
  // const html = readFileSync(join(__dirname, './html/index.html'), { encoding: "utf8" });
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link href="${styleResetUri}" rel="stylesheet">
      <script>
        window.isVscode = true;
      </script>
    </head>
    <body>
      <div id="root">
        <div class="form-input">
          <div class='label'>包含的文件</div>
          <input id="includePath" placeholder="请输入" />
        </div>
        <div class="form-input">
          <div class='label'>排除的文件</div>
          <input id="excludePath" placeholder="请输入" />
        </div>
        <div class="form-input">
          <div class='label'>导出JSON文件</div>
          <input id="exportPath" placeholder="请输入文件路径" />
        </div>
        <div id="search">开始搜索</div>
        <div id='statistics'></div>
        <div id="main">
         <div id="container"></div>
         </div>
        </div>
      </div>
      <script src="${jqueryResetUri}"></script>
      <script src="${scriptResetUri}"></script>
    </body>
    </html>
  `;
}