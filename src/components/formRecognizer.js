import {
  FormRecognizerClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

const endpoint = "https://formrecognizerxword.cognitiveservices.azure.com/";
const apiKey = "d711bf45cf6344ee9788cdfe669bf824";

export async function recognizeContent(pictureUrl) {
  const client = new FormRecognizerClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const result = [];

  if (!pictureUrl) {
    pictureUrl =
      "https://xword.blob.core.windows.net/crosswords/271724706_4884084881648162_6840587049327880732_n.jpg";
  }
  console.log("beginRecognizeContentFromUrl", pictureUrl);
  const poller = await client.beginRecognizeContentFromUrl(pictureUrl);
  const pages = await poller.pollUntilDone();

  if (!pages || pages.length === 0) {
    throw new Error("Expecting non-empty list of pages!");
  }

  for (const page of pages) {
    console.log(
      `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
    );
    for (const table of page.tables) {
      for (const cell of table.cells) {
        if (cell.text) {
          result.push({
            pair: {
              question: prepareQ(cell.text),
              answer: "",
            },
            location: [cell.rowIndex, cell.columnIndex],
          });
          console.log(
            `cell [${cell.rowIndex},${cell.columnIndex}] has text ${prepareQ(
              cell.text
            )}`
          );
        }
      }
    }
  }
  return await result;
}

function prepareQ(rawText) {
  var r = rawText.split("-");
  r.forEach((q, i, arr) => {
    arr[i] = q.trim();
  });
  return r.join("");
}
/**
 * Gets rid of hypens and unnecessary whitespaces and returns a string in one variable
 * @param {String[]} qArr - array of strings from one cell
 * @returns {String} nicely prepared question string
 */

function setQA() {
  const q = this.prepareQ(this.text);
  const a = "answer";
  var qa = {
    question: q,
    answer: a,
  };
  this.qaArray.push(qa);
}
