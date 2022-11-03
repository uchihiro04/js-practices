#! /usr/bin/env node

const command = require("./command.js");

const argv = require("minimist")(process.argv.slice(2));
new command(argv).runMemo();
