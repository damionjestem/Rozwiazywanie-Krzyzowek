const async = require("async");
const fs = require("fs");
const createReadStream = require("fs").createReadStream;
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = "a14b50d5c2e44133ba3d6177644777b9";
const endpoint = "https://xswcomputervision.cognitiveservices.azure.com/";
const filename = __dirname + "\\test.png";
let overallResult = [];

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

function computerVision(handwrittenImageLocalPath) {
  async.series(
    [
      async function () {
        const printedTextSampleURL =
          "https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg";

        // Status strings returned from Read API. NOTE: CASING IS SIGNIFICANT.
        // Before Read 3.0, these are "Succeeded" and "Failed"
        const STATUS_SUCCEEDED = "succeeded";
        const STATUS_FAILED = "failed";

        // Recognize text in handwritten image from a local file
        console.log(
          "\nRead handwritten text from local file...",
          handwrittenImageLocalPath
        );
        const handwritingResult = await readTextFromFile(
          computerVisionClient,
          handwrittenImageLocalPath
        );
        printRecText(handwritingResult);

        // Perform read and await the result from local file
        async function readTextFromFile(client, localImagePath) {
          // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
          let result = await client.readInStream(() =>
            createReadStream(localImagePath)
          );
          // Operation ID is last path segment of operationLocation (a URL)
          let operation = result.operationLocation.split("/").slice(-1)[0];

          // Wait for read recognition to complete
          // result.status is initially undefined, since it's the result of read
          while (result.status !== STATUS_SUCCEEDED) {
            await sleep(1000);
            result = await client.getReadResult(operation);
          }
          return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
        }

        // Prints all text from Read result
        function printRecText(readResults) {
          console.log("Recognized text:");
          for (const page in readResults) {
            if (readResults.length > 1) {
              console.log(`==== Page: ${page}`);
            }
            const result = readResults[page];
            if (result.lines.length) {
              for (const line of result.lines) {
                overallResult.push(line);
                console.log(line.words.map((w) => w.text).join(" "));
              }
            } else {
              console.log("No recognized text.");
            }
          }
        }
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        });
      },
    ],
    (err) => {
      throw err;
    }
  );
}
/**
 *
 * @param {File} filename
 * @returns {string[]} stings of read text from file
 */
function readFile(filename) {
  computerVision(filename);
  return overallResult;
}

readFile();
