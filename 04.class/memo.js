#! /usr/bin/env node

class Command {
  constructor(option) {
    this.option = option;
  }

  runMemo() {
    if (this.option.l) {
      return new MemoController().index();
    }
    if (this.option.r) {
      return new MemoController().reference();
    }
    if (this.option.d) {
      return new MemoController().delete();
    }
    return new MemoController().create();
  }
}

class MemoController {
  constructor() {
    this.memos = new MemoData();
  }

  index() {
    const memos = this.memos.read().memoslist;
    const firstLines = [];
    memos.forEach((memo) => {
      firstLines.push(memo.firstLine);
    });
    console.log(firstLines.join("\n"));
  }

  create() {
    const { v4: uuidv4 } = require("uuid");
    process.stdin.setEncoding("utf8");
    const reader = require("readline").createInterface({
      input: process.stdin,
    });

    const lines = [];
    reader.on("line", (line) => {
      lines.push(line);
    });

    reader.on("close", () => {
      const memos = this.memos.read();
      const memo = {
        id: uuidv4(),
        firstLine: lines[0],
        body: lines.join("\n"),
      };
      memos.memoslist.push(memo);
      this.memos.write(memos);
      console.log("---メモを追加しました---");
    });
  }

  reference() {
    const { prompt } = require("enquirer");
    const memos = this.memos.read().memoslist;
    const questions = this.createQuestions(memos);

    (async function () {
      const answers = await prompt(questions);
      const memo = memos.find((memo) => memo.id === answers.id);
      console.log(memo.body);
    })();
  }

  delete() {
    const { prompt } = require("enquirer");
    const memos = this.memos.read();
    const questions = this.createQuestions(memos.memoslist);

    async function deleteMemo() {
      const answers = await prompt(questions);
      const undeletedMemos = memos.memoslist.filter((memo) => {
        return memo.id !== answers.id;
      });
      memos.memoslist = undeletedMemos;
      return memos;
    }

    deleteMemo().then((memos) => {
      this.memos.write(memos);
    });
  }

  createChoices(memos) {
    const choices = [];
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

  createQuestions(memos) {
    const questions = [
      {
        type: "select",
        name: "id",
        message: "Choose a note you want to see:",
        choices: this.createChoices(memos),
        result() {
          return this.focused.value;
        },
      },
    ];
    return questions;
  }
}

class MemoData {
  constructor() {
    this.path = "db/memo.json";
  }

  read() {
    const fs = require("fs");
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '{"memos": []}');
    }
    const jsonFile = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(jsonFile);
  }

  write(memos) {
    const fs = require("fs");
    const jsonMemos = JSON.stringify(memos);
    fs.writeFile(this.path, jsonMemos, (err) => {
      if (err) throw err;
    });
  }
}

const argv = require("minimist")(process.argv.slice(2));
const command = new Command(argv);
command.runMemo();
