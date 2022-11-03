module.exports = MemoData;

class MemoData {
  constructor() {
    this.path = "db/memo.json";
  }

  read() {
    const fs = require("fs");
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '{"memoslist": []}');
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
