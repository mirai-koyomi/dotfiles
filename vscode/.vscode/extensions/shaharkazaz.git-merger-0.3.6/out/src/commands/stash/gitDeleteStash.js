'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @fileOverview The git delete stash command executer file
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
const util_1 = require("../../services/util");
function deleteStash(stashItem) {
    child_process_1.exec(string_constnats_1.default.git.stash("drop " + stashItem.index), {
        cwd: vscode_1.workspace.rootPath
    }, (error, stdout, stderr) => {
        if (error) {
            logger.logError(string_constnats_1.default.error("droping stash:"), stderr || error);
            return;
        }
        if (stdout.indexOf("Dropped") != -1) {
            logger.logInfo(string_constnats_1.default.success.general("Stash", "removed"));
        }
    });
}
exports.deleteStash = deleteStash;
function activate(context) {
    /**
     * An array of all the stash objects
     * @type {Array < IGitStashResponse > }
     */
    let stashList;
    /**
     * Get the list of all the stashs
     * @returns {void}
     */
    function fetchStashList() {
        return util_1.getStashList(child_process_1.execSync(string_constnats_1.default.git.stash("list ", true), {
            cwd: vscode_1.workspace.rootPath
        }).toString());
    }
    let disposable = vscode_1.commands.registerCommand('gitMerger.deleteStash', () => {
        try {
            stashList = fetchStashList();
            if (stashList.length === 0) {
                logger.logInfo("No stash exists");
            }
        }
        catch (error) {
            logger.logError(string_constnats_1.default.error("fetching branch list"), error.message);
        }
        vscode_1.window.showQuickPick(stashList, {
            matchOnDescription: true,
            placeHolder: "Choose the stash you wish to drop"
        }).then(stashItem => {
            if (stashItem) {
                deleteStash(stashItem);
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=gitDeleteStash.js.map