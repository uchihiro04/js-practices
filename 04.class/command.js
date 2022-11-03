const memoController = require("./memoController.js");

module.exports = class Command {
  constructor(option) {
    this.option = option;
  }

  runMemo() {
    if (this.option.l) {
      return new memoController().index();
    }
    if (this.option.r) {
      return new memoController().reference();
    }
    if (this.option.d) {
      return new memoController().delete();
    }
    return new memoController().create();
  }
};
