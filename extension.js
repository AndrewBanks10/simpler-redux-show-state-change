const vscode = require('vscode')
const path = require('path')
const copyPaste = require("copy-paste")
const fs = require('fs')
const extensionCommand = 'extension.srLoadFile'

function getFullPath(relativeFileName) {
    if ( !vscode.workspace.workspaceFolders ) {
        return {message: 'There are no open workspace folders.'}
    }
    let filePath
    const b = vscode.workspace.workspaceFolders.some( e => {
        filePath = path.join(e.uri.fsPath, relativeFileName)
        if ( fs.existsSync(filePath)) {
            return true
        }
    })
    if ( !b ) {
        return {message: `Could not find ${relativeFileName} in the workspace folders.`}
    }
    return filePath
}

// create a decorator type that we use to decorate small numbers
const stateChangeDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
        // this color will be used in light color themes
        borderColor: 'darkblue'
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'lightblue'
    }
});

function openDocument(line, file) {
    if (file === 'Unknown') {
        vscode.window.showErrorMessage('The source module for this state change was invalidated by HMR. The source cannot be displayed.');
        return
    }
    const filePath = getFullPath(file)
    if ( typeof filePath !== 'string' ) {
        vscode.window.showInformationMessage(filePath.message)
        return
    }
    vscode.workspace.openTextDocument(vscode.Uri.file(filePath))
        .then(doc => vscode.window.showTextDocument(doc))
        .then(() => {
           const editor = vscode.window.activeTextEditor
           const range = editor.document.lineAt(line-1).range
           const stateChanges = []
           const decoration = { range: range, hoverMessage: 'State Change' };
           stateChanges.push(decoration);
           editor.setDecorations(stateChangeDecorationType, stateChanges);
           editor.revealRange(range)

           setTimeout( vscode.window.onDidChangeTextEditorSelection(
               function () {
                    editor.setDecorations(stateChangeDecorationType, []);
                    vscode.window.onDidChangeTextEditorVisibleRanges(null)
                }
           ), 250)
        })
}

function activate(context) {
    let disposable = vscode.commands.registerCommand(extensionCommand, function () {
        let line, file, stack
        try {
            ({stack, file, line} = JSON.parse(copyPaste.paste()))
        } catch (ex) {
            vscode.window.showErrorMessage(`Invalid clipboard object. ${ex}`)
            return
        }

        // No choice, the call stack only has one entry.
        // Display that file.
        if (stack.length === 1) {
            openDocument(line, file)
            return
        }

        // Display the choices and let the user pick.
        let callStack = []
        for (let i = stack.length - 1; i >= 0; --i) {
            callStack.push(`${stack[i].caller} (${stack[i].moduleName}:${stack[i].line})`)
        }

        vscode.window.showQuickPick(callStack)
            .then(item => {
                const matches = item.match(/([^(]*)\(([^:]+):([0-9]+)/)
                if ( matches )
                    openDocument(matches[3], matches[2])
                else {
                    vscode.window.showErrorMessage(`Invalid sourcemap at this location.`)
                }
            })
    })

    context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {
}
exports.deactivate = deactivate
