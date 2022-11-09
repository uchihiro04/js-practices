const MemoController = require("./memoController.js");

module.exports = class Command {
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
};
