"use strict";
/**
 *  @fileOverview This file the initilzor of the extension
 *  @author       Shahar Kazaz
 *  @requires     vscode
 *  @requires     ./commands(/index.ts): All the extensions commands
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
/**
 * this method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 */
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        commands_1.commands.forEach((command) => {
            command.activate(context);
        });
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map