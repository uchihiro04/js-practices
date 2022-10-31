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
  const memos = memosText.memoslist;
  memos.forEach((memo) => {
    console.log(memo.firstLine);
  });
}

function readMemo() {
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, '{"memoslist": []}');
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
  reader.on("line", (line) => {
    lines.push(line);
  });

  reader.on("close", () => {
    const allMemo = readMemo();
    const memo = {
      id: uuidv4(),
      firstLine: lines[0],
      body: lines.join("\n"),
    };
    allMemo.memoslist.push(memo);
    writeMemo(allMemo);
    console.log("---書き込みが完了しました---");
  });
}

function writeMemo(memosText) {
  const jsonText = JSON.stringify(memosText);
  fs.writeFile(jsonPath, jsonText, (err) => {
    if (err) throw err;
  });
}

function createChoices() {
  const choices = [];
  const memos = memosText.memoslist;
  memos.forEach((memo) => {
    const choice = {
      name: memo.firstLine,
      value: memo.id,
      message: memo.firstLine,
    };
    choices.push(choice);
  });
  return choices;
}

function createQuestions() {
  const questions = [
    {
      type: "select",
      name: "id",
      message: "Choose a note you want to see:",
      choices: createChoices(),
      result() {
        return this.focused.value;
      },
    },
  ];
  return questions;
}

function referenceMemo() {
  const { prompt } = require("enquirer");
  const memos = memosText.memoslist;

  (async function () {
    const questions = createQuestions();
    const answers = await prompt(questions);
    const memo = memos.find((memo) => memo.id === answers.id);
    console.log(memo.body);
  })();
}

function deleteMemo() {
  const { prompt } = require("enquirer");
  const memos = memosText.memoslist;

  (async function () {
    const questions = createQuestions();
    let answers = await prompt(questions);
    const deletedMemos = memos.filter((memo) => {
      return memo.id !== answers.id;
    });
    memosText.memoslist = deletedMemos;
    writeMemo(memosText);
  })();
}
