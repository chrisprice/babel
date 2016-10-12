#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const child  = require("child_process");

const thisBase = path.join(__dirname, "..");
const distPath = path.join(thisBase, "dist");
const browserify = path.join(thisBase, "..", "..", "node_modules", "browserify", "bin", "cmd.js");
const uglify = path.join(thisBase, "..", "..", "node_modules", "uglify-js", "bin", "uglifyjs");
const polyfillFile = path.join(distPath, "polyfill.js");

try {
  fs.statSync(distPath);
}
catch (e) {
  fs.mkdirSync(distPath);
}

const browserifyCommand = `${path.join(thisBase, "lib", "index.js")} \
  --insert-global-vars "global" \
  --plugin bundle-collapser/plugin \
  --plugin derequire/plugin \
  > ${polyfillFile}`;

const uglifyCommand = `${polyfillFile} \
  --compress keep_fnames,keep_fargs,warnings=false \
  --mangle keep_fnames \
  > ${path.join(distPath, "ployfill.min.js")}`;

child.execSync(`node ${browserify} ${browserifyCommand}`);
child.execSync(`node ${uglify} ${uglifyCommand}`);
