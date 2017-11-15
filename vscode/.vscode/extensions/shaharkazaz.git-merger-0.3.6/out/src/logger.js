"use strict";
/**
 *  @fileOverview This file is in charge of logging and displaying messages
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     npm:moment
 *  @requires     ./constants/string-constnats: string-constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const moment = require("moment");
const string_constnats_1 = require("./constants/string-constnats");
/**
 * The output channel instance
 * @type {vscode.OutputChannel}
 */
let outLogChannel;
/**
 * Creates an output channel instance or retrives it if already exists.
 * @returns {vscode.OutputChannel} The output channel instance
 */
function getLogChannel() {
    if (outLogChannel === undefined) {
        outLogChannel = vscode.window.createOutputChannel('Git merger');
    }
    return outLogChannel;
}
/**
 * Print a error message to the log and shows a ui error message.
 * @returns {void}
 */
function logError(errorTitle, error) {
    getLogChannel().appendLine(`[Error-${moment().format(string_constnats_1.default.timeForamt.hours)}] ${errorTitle}\n${error.toString()}`);
    vscode.window.showErrorMessage(string_constnats_1.default.windowErrorMessage, string_constnats_1.default.actionButtons.openLog).then((action) => {
        if (action) {
            this.openLog();
        }
    });
}
exports.logError = logError;
/**
 * Print a info message to the log and shows a ui error message.
 * @returns {void}
 */
function logInfo(message, actionButton) {
    getLogChannel().appendLine(`[Info-${moment().format(string_constnats_1.default.timeForamt.hours)}] ${message}`);
    vscode.window.showInformationMessage(message, actionButton ? actionButton.name : []).then((action) => {
        if (action) {
            actionButton.callback();
        }
    });
}
exports.logInfo = logInfo;
/**
 * Print a warning message to the log
 * @returns {void}
 */
function logWarning(message) {
    getLogChannel().appendLine(`[Warning-${moment().format(string_constnats_1.default.timeForamt.hours)}] ${message}`);
}
exports.logWarning = logWarning;
/**
 * Print a debug message to the log
 * @returns {void}
 */
function logDebug(message) {
    getLogChannel().appendLine(`[Debug-${moment().format(string_constnats_1.default.timeForamt.hours)}] ${message}`);
}
exports.logDebug = logDebug;
/**
 * Opens a wanted output log
 * @returns {void}
 */
function openLog() {
    getLogChannel().show();
}
exports.openLog = openLog;
//# sourceMappingURL=logger.js.map