"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** This is a barrel file for all the extensions commands */
const gitMerge = require("./merge/gitMerge");
const gitAbort = require("./merge/gitAbort");
const gitStash = require("./stash/gitStash");
const gitUnstash = require("./stash/gitUnstash");
const gitClearStash = require("./stash/gitClearStash");
const gitDeleteStash = require("./stash/gitDeleteStash");
exports.commands = [gitMerge, gitAbort, gitStash, gitUnstash, gitClearStash, gitDeleteStash];
//# sourceMappingURL=index.js.map