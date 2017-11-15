'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @fileOverview The git stash command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
const vscode_1 = require("vscode");
const string_constnats_1 = require("../../constants/string-constnats");
const child_process_1 = require("child_process");
const logger = require("../../logger");
function stash(stashName, hideMsg) {
    let promise = new Promise((resolve, reject) => {
        child_process_1.exec(string_constnats_1.default.git.stash("save ", false, stashName), {
            cwd: vscode_1.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                logger.logError(string_constnats_1.default.error("creating stash:"), stderr || error);
                reject();
                return;
            }
            if (stdout.indexOf("No local changes to save") != -1) {
                logger.logInfo("No local changes detected in tracked files");
                resolve();
                return;
            }
            if (!hideMsg) {
                logger.logInfo(string_constnats_1.default.success.general("Stash", "created"));
            }
            resolve();
        });
    });
    return promise;
}
exports.stash = stash;
function activate(context) {
    let disposable = vscode_1.commands.registerCommand('gitMerger.stash', () => {
        vscode_1.window.showInputBox({ placeHolder: "Enter stash message (default will show no message)", validateInput: (input) => {
                if (input[0] == "-") {
                    return "The name can't start with '-'";
                }
                else if (new RegExp("[()&`|!]", 'g').test(input)) {
                    return "The name can't contain the following characters: '|', '&', '!', '(', ')' or '`'";
                }
                return "";
            } }).then((userInput) => {
            if (userInput === undefined) {
                return;
            }
            stash(userInput, false);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=gitStash.js.map