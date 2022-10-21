#! /usr/bin/env node

const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const jsonPath = "db/memo.json";

const memosText = readMemo();
if (argv.l) {
  const memos = memosText.memos;
  for (let number in memos) {
    const memoArray = memos[number].memo.split("\n");
    console.log(memoArray[0]);
  }
} else {
  createMemo();
}

function readMemo() {
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, '{"memos": []}');
  }
  const jsonFile = fs.readFileSync(jsonPath, "utf-8");
  return JSON.parse(jsonFile);
}

function createMemo() {
  process.stdin.setEncoding("utf8");
  const reader = require("readline").createInterface({
    input: process.stdin,
  });
  const lines = [];
  const memoText = {};

  reader.on("line", (line) => {
    lines.push(line);
  });

  reader.on("close", () => {
    const memosText = readMemo();
    memoText.memo = lines.join("\n");
    memosText.memos.push(memoText);
    writeMemo(memosText);
  });
}

function writeMemo(memosText) {
  const jsonText = JSON.stringify(memosText);
  fs.writeFile(jsonPath, jsonText, (err) => {
    if (err) throw err;
    console.log("---書き込みが完了しました---");
  });
}
