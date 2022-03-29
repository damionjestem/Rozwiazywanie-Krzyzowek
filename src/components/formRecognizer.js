const fs = require("fs");

const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");

const endpoint = "https://testformrecognizerdl.cognitiveservices.azure.com/";
const apiKey = "ace713887e844586a517297f7ebebaa5";

export async function analyzeImage(fileUrl) {
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  fileUrl = fs.createReadStream(fileUrl);

  const poller = await client.beginAnalyzeDocuments(
    "prebuilt-document",
    analyzeImage(fileUrl)
  );

  const { keyValuePairs, entities } = await poller.pollUntilDone();

  if (keyValuePairs.length <= 0) {
    console.log("No key-value pairs were extracted from the document.");
  } else {
    console.log("Key-Value Pairs:");
    for (const { key, value, confidence } of keyValuePairs) {
      console.log("- Key  :", `"${key.content}"`);
      console.log(
        "  Value:",
        `"${value?.content ?? "<undefined>"}" (${confidence})`
      );
    }
  }

  if (entities.length <= 0) {
    console.log("No entities were extracted from the document.");
  } else {
    console.log("Entities:");
    for (const entity of entities) {
      console.log(
        `- "${entity.content}" ${entity.category} - ${
          entity.subCategory ?? "<none>"
        } (${entity.confidence})`
      );
    }
  }
}
