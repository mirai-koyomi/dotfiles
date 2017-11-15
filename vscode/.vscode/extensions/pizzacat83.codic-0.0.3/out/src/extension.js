'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
class CodicExtension {
    constructor(context) {
        this.request = require('request-promise');
        this.nullsymbol = "<null>";
        this.cases = {
            "PascalCase": {
                "applyfunc": (word, isFirst) => { return word[0].toUpperCase() + word.slice(1); },
                "sample": "Aa"
            },
            "camelCase": {
                "applyfunc": (word, isFirst) => { return isFirst ? word : (word[0].toUpperCase() + word.slice(1)); },
                "sample": "aA"
            },
            "snake_case": {
                "applyfunc": (word, isFirst) => { return isFirst ? word : "_" + word; },
                "sample": "a_a"
            },
            "SNAKE_CASE": {
                "applyfunc": (word, isFirst) => { return (isFirst ? word : "_" + word).toUpperCase(); },
                "sample": "A_A",
            },
            "hy-phen-a-tion": {
                "applyfunc": (word, isFirst) => { return isFirst ? word : "-" + word; },
                "sample": "a-a"
            },
            "no case": {
                "applyfunc": (word, isFirst) => { return isFirst ? word : " " + word; },
                "sample": "a a"
            }
        };
        this.context = context;
    }
    translate() {
        this.getInputText()
            .then((input) => this.sendRequest(input, this.getAccessToken()))
            .then((body) => this.listCandidates(body))
            .then((candidates) => this.pickCandidates(candidates));
    }
    setLocalCase() {
        var keys = [];
        for (var key in this.cases) {
            keys.push(key);
        }
        vscode.window.showQuickPick(keys)
            .then((choice) => { this.context.workspaceState.update("codic.case", choice); });
    }
    setGlobalCase() {
        var keys = [];
        for (var key in this.cases) {
            keys.push(key);
        }
        vscode.window.showQuickPick(keys)
            .then((choice) => { this.context.globalState.update("codic.case", choice); });
    }
    dispose() {
    }
    getAccessToken() {
        let ACCESS_TOKEN = vscode.workspace.getConfiguration('codic').get('ACCESS_TOKEN');
        if (ACCESS_TOKEN === undefined) {
            vscode.window.showErrorMessage("case が設定されていません。");
            throw 'no ACCESS_TOKEN';
        }
        return ACCESS_TOKEN;
    }
    getInputText() {
        return vscode.window.showInputBox({ prompt: 'Input a Japanese phrase' })
            .then((input) => {
            if (input === undefined || input === "") {
                return Promise.reject(undefined);
            }
            return input;
        });
    }
    sendRequest(text, ACCESS_TOKEN) {
        let options = {
            uri: 'https://api.codic.jp/v1/engine/translate.json',
            method: 'GET',
            qs: { text: text },
            headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
            transform2xxonly: true,
            transform: (body) => { return JSON.parse(body); },
        };
        return this.request(options);
    }
    listCandidates(body) {
        let candidates = [];
        for (let i = 0; i < body[0].words.length; i++) {
            let temp = [];
            for (let j = 0; j < body[0].words[i]['candidates'].length; j++) {
                temp.push(body[0].words[i]['candidates'][j]['text'] === null ? this.nullsymbol : body[0].words[i]['candidates'][j]['text']);
            }
            if (temp.length === 0) {
                temp = [body[0].words[i]['text']];
            }
            candidates.push(temp);
        }
        return candidates;
    }
    getCase() {
        let case_ = this.context.workspaceState.get("codic.case");
        case_ = case_ === undefined ? this.context.globalState.get("codic.case") : case_;
        return case_;
    }
    applyCase(text, isFirst, case_) {
        return this.cases[case_]["applyfunc"](text, isFirst);
    }
    pickCandidates(candidates) {
        let p = Promise.resolve();
        let isFirst = true;
        candidates.forEach((words) => {
            p = p.then(() => { return vscode.window.showQuickPick(words); })
                .then((choice) => {
                if (choice === undefined)
                    return Promise.reject("user focused out");
                if (choice === this.nullsymbol) {
                    return Promise.resolve(null);
                }
                return this.insertText(this.applyCase(choice, isFirst, this.getCase()));
            })
                .then((val) => { if (val !== null) {
                isFirst = false;
            } })
                .then(this.moveCursorToEndOfSelection);
        });
        return p;
    }
    insertText(text) {
        let editor = vscode.window.activeTextEditor;
        let edit = new vscode.WorkspaceEdit();
        edit.insert(editor.document.uri, editor.selection.anchor, text);
        return vscode.workspace.applyEdit(edit);
    }
    moveCursorToEndOfSelection() {
        let editor = vscode.window.activeTextEditor;
        editor.selection = new vscode.Selection(editor.selection.end, editor.selection.end);
    }
}
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let codicExtension = new CodicExtension(context);
    let disposable = [];
    disposable.push(vscode.commands.registerCommand('extension.codicTranslate', () => { codicExtension.translate(); }));
    disposable.push(vscode.commands.registerCommand("extension.codicSetLocalCase", () => { codicExtension.setLocalCase(); }));
    disposable.push(vscode.commands.registerCommand("extension.codicSetGlobalCase", () => { codicExtension.setGlobalCase(); }));
    context.subscriptions.push(codicExtension);
    disposable.forEach((item) => {
        context.subscriptions.push(item);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map