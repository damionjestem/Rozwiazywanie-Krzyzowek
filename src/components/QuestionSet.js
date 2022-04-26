export class QuestionSet {
  constructor(t) {
    this.text = t;
    this.qaArray = [];
    this.status = false;
  }
  /**
   * Gets rid of hypens and unnecessary whitespaces and returns a string in one variable
   * @param {String[]} qArr - array of strings from one cell
   * @returns {String} nicely prepared question string
   */

  setQA() {
    const q = this.prepareQ(this.text);
    const a = "answer";
    var qa = {
      question: q,
      answer: a,
    };
    this.qaArray.push(qa);
  }
}

export function prepareQ(rawText) {
  var r = rawText.split("-");
  r.forEach((q, i, arr) => {
    arr[i] = q.trim();
  });
  return r.join("");
}
