#! /usr/bin/env node

const fs = require("fs");
const jsonPath = "db/memo.json";

process.stdin.setEncoding("utf8");

const lines = [];
const memoText = {};

let reader = require("readline").createInterface({
  input: process.stdin,
});

if (!fs.existsSync(jsonPath)) {
  fs.writeFileSync(jsonPath, '{"memos": []}');
}
const jsonFile = fs.readFileSync(jsonPath, "utf-8");
const memosText = JSON.parse(jsonFile);

reader.on("line", (line) => {
  lines.push(line);
});

reader.on("close", () => {
  memoText.memo = lines.join("\n");
  memosText.memos.push(memoText);
  const jsonText = JSON.stringify(memosText);
  fs.writeFile(jsonPath, jsonText, (err) => {
    if (err) throw err;
    console.log("---書き込みが完了しました---");
  });
});
