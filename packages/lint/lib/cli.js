// SPDX-License-Identifier: MIT
"use strict";
const globby = require("globby");
const { validateLint } = require("./lint");

/**
 * @param {string} glob
 * @return {Error[]}
 */
module.exports.runCheck = function runCheck(glob) {
    const targetFiles = globby.sync(glob);
    return targetFiles
        .map((filePath) => {
            return validateLint(filePath);
        })
        .filter((result) => result !== undefined);
};
