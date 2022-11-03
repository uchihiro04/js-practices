const memoData = require("./memoData.js");
const { v4: uuidv4 } = require("uuid");
const { prompt } = require("enquirer");

module.exports = class MemoController {
  constructor() {
    this.memos = new memoData();
  }

  index() {
    const memos = this.memos.read().memoslist;

    if (!memos.length) {
      console.log("---メモがありません---");
      return;
    }
    const firstLines = [];
    memos.forEach((memo) => {
      firstLines.push(memo.firstLine);
    });
    console.log(firstLines.join("\n"));
  }

  create() {
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

      if (!memo.body.match(/\S/g)) {
        console.log("--文字を入力してください--");
        return;
      }
      memos.memoslist.push(memo);
      this.memos.write(memos);
      console.log("---メモを追加しました---");
    });
  }

  async reference() {
    const memos = this.memos.read().memoslist;
    const questions = this.#createQuestions(memos);

    if (!memos.length) {
      console.log("---メモがありません---");
      return;
    }
    const answers = await prompt(questions);
    const memo = memos.find((memo) => memo.id === answers.id);
    console.log(memo.body);
  }

  async delete() {
    const memos = this.memos.read();
    const questions = this.#createQuestions(memos.memoslist);

    if (!memos.memoslist.length) {
      console.log("---メモがありません---");
      return;
    }
    const answers = await prompt(questions);
    const undeletedMemos = memos.memoslist.filter((memo) => {
      return memo.id !== answers.id;
    });
    memos.memoslist = undeletedMemos;
    this.memos.write(memos);
  }

  #createChoices(memos) {
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

  #createQuestions(memos) {
    const questions = [
      {
        type: "select",
        name: "id",
        message: "Choose a note you want to see:",
        choices: this.#createChoices(memos),
        result() {
          return this.focused.value;
        },
      },
    ];
    return questions;
  }
};
