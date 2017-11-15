/**
 *  @fileOverview The git unstash (stash apply) command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const string_constnats_1 = require("../../constants/string-constnats");
const child_process_1 = require("child_process");
const logger = require("../../logger");
const util_1 = require("../../services/util");
const gitDeleteStash_1 = require("./gitDeleteStash");
function unstash(stashItem) {
    let command = stashItem ? string_constnats_1.default.git.stash("apply " + stashItem.index) : string_constnats_1.default.git.stash("pop ");
    child_process_1.exec(command, {
        cwd: vscode_1.workspace.rootPath
    }, (error, stdout, stderr) => {
        if (error) {
            logger.logError(string_constnats_1.default.error("unstashing:"), stderr || error);
            return;
        }
        let button;
        if (stashItem) {
            button = {
                name: "delete stash",
                callback: () => {
                    gitDeleteStash_1.deleteStash(stashItem);
                }
            };
        }
        logger.logInfo(string_constnats_1.default.success.general("Stash", "applied on current branch"), button);
    });
}
exports.unstash = unstash;
function activate(context) {
    /**
     * An array of all the stash objects
     * @type {Array < IGitStashResponse > }
     */
    let stashList, 
    /**
     * The selected stash item to unstash
     * @type {IGitStashResponse}
     */
    stashItem;
    /**
     * Get the list of all the stashs
     * @returns {void}
     */
    function fetchStashList() {
        return util_1.getStashList(child_process_1.execSync(string_constnats_1.default.git.stash("list ", true), {
            cwd: vscode_1.workspace.rootPath
        }).toString());
    }
    let disposable = vscode_1.commands.registerCommand('gitMerger.unstash', () => {
        try {
            stashList = fetchStashList();
            if (stashList.length === 0) {
                logger.logInfo("No stash exists");
                return;
            }
            vscode_1.window.showQuickPick(stashList, {
                matchOnDescription: true,
                placeHolder: "Choose stash to apply"
            }).then(choosenStashItem => {
                if (choosenStashItem) {
                    stashItem = choosenStashItem;
                    unstash(stashItem);
                }
            });
        }
        catch (error) {
            logger.logError(string_constnats_1.default.error("fetching branch list"), error.message);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=gitUnstash.js.map