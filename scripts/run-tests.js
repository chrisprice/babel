#!/usr/bin/env node
"use strict";

require("./babel-register.js");

const path = require("path");
const Mocha = require("mocha");
const glob = require("glob");

const testGrep = process.env.npm_config_TEST_GREP;
const testPackage = process.env.npm_config_TEST_ONLY;
const testSearch = `packages/${testPackage || "*"}/test/*.js`

const mocha = new Mocha();

function getTestFiles() {
  glob.sync(testSearch).forEach((file) => {
    mocha.addFile(file);
  });
}

function runTests() {
  if(testGrep) mocha.grep(testGrep);
  mocha.ui("tdd").reporter("dot").timeout(10000).run((failures) => {
      process.exit(failures);
  });
}

getTestFiles();
runTests();
