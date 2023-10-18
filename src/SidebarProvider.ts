import * as vscode from "vscode";
import { globSync } from "glob";
import getTemplate from "./template";
import { join, dirname, basename } from "path";
import { parseFiles } from "./utils/parseFiles";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const defaultIngore = ['node_modules', '__tests__', 'es', 'lib', 'umd', 'scripts', 'public', '*.d.ts'];


export class SidebarProvider implements vscode.WebviewViewProvider {
  rootPath: string | undefined;

  resultFiles: any[] = [];

  constructor(private readonly _extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    this.rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
      ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

  }

  private configWebview(webview: vscode.Webview) {
    webview.html = getTemplate(webview, this._extensionUri);
    webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webview.onDidReceiveMessage(async (data) => {
      if (data.command === 'search') {
        const { content = {} } = data;
        const { include, exclude = '', exportPath } = content as Record<string, string>;

        if (this.rootPath) {
          
          let pattern = include.split(',').map((p: string) => p.trim()).filter(Boolean).map(p => {
            return join(p, '/**/*.{ts,tsx,js,jsx}');
          })

          if (pattern.length === 0) {
            pattern = ['/**/src/**/*.{ts,tsx,js,jsx}'];
          }

          try {
            const files = globSync(pattern, { cwd: this.rootPath, root: this.rootPath, ignore: exclude.split(',').map(f => f.trim()).filter(Boolean).concat(defaultIngore).map(it => it.indexOf('.') > -1 ? `**/${it}` : `**/${it}/**`) });

            const result = parseFiles(files);
            const target = {
              result,
              length: result.length,
              total: result.map(item => item.rows).flat(Infinity).length,
            };

            if (exportPath) {
              const dirPath = dirname(join(this.rootPath, exportPath));
              const filename = basename(join(this.rootPath, exportPath)) || 'locale-plugin.json';
              if (!existsSync(dirPath)) {
                mkdirSync(dirPath, { recursive: true });
              }
              writeFileSync(join(dirPath, filename), JSON.stringify(target, null, 4), { encoding: 'utf-8' })
            }

            this.resultFiles = result;

            webview.postMessage({
              content: target,
              command: 'files'
            });
          } catch (error: any) {
            console.log(error);
            webview.postMessage({
              content: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                lineNumber: error.lineNumber,
                columnNumber: error.columnNumber,
                fileName: error.fileName,
                cause: error.cause,
              },
              command: 'error'
            });
          }
        }
      } else if (data.command === 'click') {
        const { fileIndex, rowIndex } = data.content;
        const { filePath, rows } = this.resultFiles[fileIndex];
        const { rowNumber, colNumber } = rows[rowIndex];
        vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath).with({
          fragment: `L${rowNumber}C${colNumber}`
        }));
      }
    });
  }

  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    const { webview } = webviewView;
    this.configWebview(webview);
  }
}