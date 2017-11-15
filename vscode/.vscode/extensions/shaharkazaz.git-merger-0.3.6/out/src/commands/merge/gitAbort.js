'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @fileOverview The git abort merge command executer file
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
function activate(context) {
    let disposable = vscode_1.commands.registerCommand('gitMerger.abortMerge', () => {
        child_process_1.exec(string_constnats_1.default.git.merge(["abort"]), {
            cwd: vscode_1.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (error) {
                if (stderr.indexOf(string_constnats_1.default.git.noMerge)) {
                    logger.logInfo(string_constnats_1.default.git.noMerge);
                    return;
                }
                logger.logError(string_constnats_1.default.error("aborting merge"), stderr || error);
                return;
            }
            logger.logInfo(string_constnats_1.default.success.general("Merge", "aborted"));
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=gitAbort.js.map