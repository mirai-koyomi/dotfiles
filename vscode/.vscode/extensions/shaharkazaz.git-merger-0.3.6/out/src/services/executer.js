"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const vscode_1 = require("vscode");
function execAsync(command) {
    return new Promise((resolve) => {
        child_process_1.exec(command, {
            cwd: vscode_1.workspace.rootPath
        }, (error, stdout, stderr) => {
            resolve({
                error: error,
                stdout: stdout,
                stderr: stderr
            });
        });
    });
}
exports.execAsync = execAsync;
function execSync(command) {
    return __awaiter(this, void 0, void 0, function* () {
        yield child_process_1.exec(command, {
            cwd: vscode_1.workspace.rootPath
        }, (error, stdout, stderr) => {
            return {
                error: error,
                stdout: stdout,
                stderr: stderr
            };
        });
    });
}
exports.execSync = execSync;
//# sourceMappingURL=executer.js.map