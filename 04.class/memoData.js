const fs = require("fs");

module.exports = class MemoData {
  constructor() {
    this.path = "db/memo.json";
  }

  read() {
    if (!fs.existsSync(this.path)) {
      return { memoslist: [] };
    }
    const jsonFile = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(jsonFile);
  }

  write(memos) {
    const jsonMemos = JSON.stringify(memos, null, 2);
    fs.writeFile(this.path, jsonMemos, (err) => {
      if (err) throw err;
    });
  }
};
