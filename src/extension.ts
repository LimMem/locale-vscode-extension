// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// 注册webview
	const readerViewProvider = new SidebarProvider(context.extensionUri, context);
	vscode.window.registerWebviewViewProvider('locale-plugin-view', readerViewProvider, {
		webviewOptions: {
			retainContextWhenHidden: true,
		}
	})
}
