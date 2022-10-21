#! /usr/bin/env node

const fs = require("fs");
const jsonPath = "db/memo.json";

if (!fs.existsSync(jsonPath)) {
  fs.writeFileSync(jsonPath, '{"memos": []}');
}
const jsonFile = fs.readFileSync(jsonPath, "utf-8");
const memosText = JSON.parse(jsonFile);

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

createMemo();
