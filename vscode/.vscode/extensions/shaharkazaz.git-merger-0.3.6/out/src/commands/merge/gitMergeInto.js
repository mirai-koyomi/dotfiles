'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  @fileOverview The git merge command executer file
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     strings: The extension string constants
 *  @requires     exec
 *  @requires     logger
 */
const vscode_1 = require("vscode");
const gitStash_1 = require("../stash/gitStash");
const string_constnats_1 = require("../../constants/string-constnats");
const child_process_1 = require("child_process");
const logger = require("../../logger");
const util_1 = require("../../services/util");
const gitUnstash_1 = require("../stash/gitUnstash");
function activate(context) {
    /**
     * Holds a list of all the branchs and the current branch
     * @type {IBranchObj}
     */
    let branchObj, 
    /**
     * Holds all the git commands options info
     * @type {IOptionsObj}
     */
    optionsObj, 
    /**
     * Holds the targeted merge branch info
     * @type {IgitBranchResponse}
     */
    targetBranch, patchCreated;
    /**
     * Exexute the git merge command
     * @param   {string} [customCommitMsg] The user's custom commit message
     * @returns {void}
     */
    function merge(customCommitMsg) {
        if (customCommitMsg && string_constnats_1.default.userSettings.get("extendAutoCommitMessage")) {
            customCommitMsg = "Merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'\n" + customCommitMsg;
        }
        child_process_1.exec(string_constnats_1.default.git.merge(optionsObj.validOptions, targetBranch.label, customCommitMsg), {
            cwd: vscode_1.workspace.rootPath
        }, (error, stdout, stderr) => {
            if (optionsObj.invalidOptions.length > 0) {
                vscode_1.window.showWarningMessage("Some of your options were invalid and were exluded, check the log for more info", string_constnats_1.default.actionButtons.openLog).then((chosenitem) => {
                    if (chosenitem) {
                        logger.openLog();
                    }
                });
            }
            if (stdout) {
                if (stdout.toLowerCase().indexOf("conflict") != -1) {
                    let conflictedFiles = stdout.split("\n"), conflictedFilesLength = conflictedFiles.length - 1;
                    logger.logWarning(string_constnats_1.default.warnings.conflicts);
                    for (let i = 0; i < conflictedFilesLength; i++) {
                        let conflictIndex = conflictedFiles[i].indexOf(string_constnats_1.default.git.conflicts);
                        if (conflictIndex != -1) {
                            logger.logWarning(conflictedFiles[i].substr(38, conflictedFiles[i].length));
                        }
                    }
                    let message = string_constnats_1.default.windowConflictsMessage;
                    if (patchCreated) {
                        message += ", stash was not applied";
                    }
                    vscode_1.window.showWarningMessage(message);
                    setGitMessage();
                    return;
                }
                else if (stdout.indexOf(string_constnats_1.default.git.upToDate) != -1) {
                    if (patchCreated) {
                        gitUnstash_1.unstash();
                    }
                    logger.logInfo(string_constnats_1.default.git.upToDate);
                    return;
                }
            }
            else if (error) {
                logger.logError(string_constnats_1.default.error("merging"), stderr || error);
                return;
            }
            if (optionsObj.addMessage) {
                setGitMessage();
            }
            if (patchCreated) {
                gitUnstash_1.unstash();
            }
            logger.logInfo(string_constnats_1.default.success.merge(targetBranch.label, branchObj.currentBranch));
        });
    }
    function setGitMessage() {
        vscode_1.scm.inputBox.value = "Merge branch '" + targetBranch.label + "' into branch '" + branchObj.currentBranch + "'";
    }
    /**
     * Process the options, handle invalid ones and require a commit message if necessary
     * @returns {void}
     */
    function processMergeOptions() {
        optionsObj = util_1.processUserOptions(string_constnats_1.default.userSettings.get("mergeCommandOptions"), "merge");
        if (optionsObj.invalidOptions.length > 0) {
            logger.logWarning("The following commands are not valid merge commands: " + optionsObj.invalidOptions.toString());
            logger.logWarning("Yoc can check out which commands are valid at: https://git-scm.com/docs/git-merge");
        }
        if (optionsObj.requireCommitMessage) {
            vscode_1.window.showInputBox({
                placeHolder: "Enter a custom commit message"
            }).then((customCommitMsg) => {
                merge(customCommitMsg);
            });
        }
        else {
            merge();
        }
    }
    function checkUncommitedFiles() {
        let gitStatus = child_process_1.execSync(string_constnats_1.default.git.status, {
            cwd: vscode_1.workspace.rootPath
        }).toString();
        if (gitStatus.indexOf("nothing to commit") != -1) {
            try {
                branchObj = fetchBranchs();
            }
            catch (error) {
                logger.logError(string_constnats_1.default.error("Fetching git branches"), error.message);
            }
            showBranchQuickPick();
        }
        else {
            vscode_1.window.showWarningMessage("You have some uncommited changes, choose how you wish to proceed", "Try to proceed", "Commit", "Stash & Patch").then((action) => {
                if (action) {
                    try {
                        branchObj = fetchBranchs();
                    }
                    catch (error) {
                        logger.logError(string_constnats_1.default.error("Fetching git branches"), error.message);
                    }
                    patchCreated = true;
                    showBranchQuickPick();
                }
            });
        }
    }
    /**
     * Get the list of all the branches
     * @returns {void}
     */
    function fetchBranchs() {
        return util_1.getBranchList(child_process_1.execSync(string_constnats_1.default.git.getBranches, {
            cwd: vscode_1.workspace.rootPath
        }).toString());
    }
    function showBranchQuickPick() {
        vscode_1.window.showQuickPick(branchObj.branchList, {
            placeHolder: string_constnats_1.default.quickPick.chooseBranch
        }).then(chosenitem => {
            if (chosenitem) {
                if (patchCreated) {
                    targetBranch = chosenitem;
                    gitStash_1.stash("Temp stash - merge branch '" + targetBranch.label + "' into '" + branchObj.currentBranch + "'", true).then(() => {
                        processMergeOptions();
                    });
                }
                else {
                    targetBranch = chosenitem;
                    processMergeOptions();
                }
            }
        });
    }
    let disposable = vscode_1.commands.registerCommand('gitMerger.mergeInto', () => {
        try {
            checkUncommitedFiles();
        }
        catch (error) {
            logger.logError(string_constnats_1.default.error("Getting git status"), error.message);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=gitMergeInto.js.map