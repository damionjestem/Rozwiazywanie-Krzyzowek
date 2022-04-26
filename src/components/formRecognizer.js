import {
  FormRecognizerClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

import { prepareQ } from "./QuestionSet";

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
        result.push({
          pair: {
            question: prepareQ(cell.text),
            answer: "",
          },
          location: [cell.rowIndex, cell.columnIndex],
        });
        if (cell.text) {
          console.log(
            `cell [${cell.rowIndex},${cell.columnIndex}] has text ${prepareQ(
              cell.text
            )}`
          );
        }
      }
    }
  }
  return result;
}
/*
export async function analyzeImage(fileUrl) {
  const result = {};

  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  const poller = await client.beginAnalyzeDocuments(
    "prebuilt-document",
    analyzeImage(fileUrl)
  );

  const { keyValuePairs, entities } = await poller.pollUntilDone();

  if (keyValuePairs.length <= 0) {
    result.msg = "No key-value pairs were extracted from the document.";
    console.log("No key-value pairs were extracted from the document.");
  } else {
    console.log("Key-Value Pairs:");
    result.pairs = [];
    for (const { key, value, confidence } of keyValuePairs) {
      result.pairs.push({
        key: key,
        question: value,
        confidence: confidence,
      });
      console.log("- Key  :", `"${key.content}"`);
      console.log(
        "  Value:",
        `"${value?.content ?? "<undefined>"}" (${confidence})`
      );
    }
  }

  if (entities.length <= 0) {
    result.msg = "No entities were extracted from the document.";
    console.log("No entities were extracted from the document.");
  } else {
    result.entities = [];
    console.log("Entities:");
    for (const entity of entities) {
      result.entities.push(entity);
      console.log(
        `- "${entity.content}" ${entity.category} - ${
          entity.subCategory ?? "<none>"
        } (${entity.confidence})`
      );
    }
  }
  return result;
}
*/
