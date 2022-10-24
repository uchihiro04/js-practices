#! /usr/bin/env node

const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const { v4: uuidv4 } = require("uuid");
const jsonPath = "db/memo.json";
const memosText = readMemo();

if (argv.l) {
  allMemo();
} else if (argv.r) {
  referenceMemo();
} else if (argv.d) {
  deleteMemo();
} else {
  createMemo();
}

function allMemo() {
  const memos = memosText.memos;
  for (let number in memos) {
    const memoArray = memos[number].memo.split("\n");
    console.log(memoArray[0]);
  }
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
    memoText.id = uuidv4();
    memoText.firstLine = lines[0];
    memoText.memo = lines.join("\n");
    memosText.memos.push(memoText);
    writeMemo(memosText);
    console.log("---書き込みが完了しました---");
  });
}

function writeMemo(memosText) {
  const jsonText = JSON.stringify(memosText);
  fs.writeFile(jsonPath, jsonText, (err) => {
    if (err) throw err;
  });
}

function referenceMemo() {
  const { Select } = require("enquirer");
  const choices = [];
  const memos = memosText.memos;
  memos.forEach((memo) => {
    const choice = {};
    choice.name = memo.memo;
    choice.value = memo.id;
    choice.message = memo.firstLine;
    choices.push(choice);
  });

  const prompt = new Select({
    name: "id",
    message: "Choose a note you want to see:",
    choices: choices,
  });
  prompt
    .run()
    .then((answer) => console.log(answer))
    .catch(console.error);
}

function deleteMemo() {
  const choices = [];
  const memos = memosText.memos;

  memos.forEach((memo) => {
    const choice = {};
    choice.name = memo.firstLine;
    choice.value = memo.id;
    choice.message = memo.firstLine;
    choices.push(choice);
  });

  const { prompt } = require("enquirer");
  (async function () {
    const questions = [
      {
        type: "select",
        name: "id",
        message: "Choose a note you want to delete:",
        choices: choices,
        result() {
          return this.focused.value;
        },
      },
    ];
    let answers = await prompt(questions);
    const deletedMemos = memos.filter((memo) => {
      return memo.id !== answers.id;
    });
    memosText.memos = deletedMemos;
    writeMemo(memosText);
  })();
}
