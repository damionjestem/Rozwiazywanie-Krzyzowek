import { BlobServiceClient } from "@azure/storage-blob";

const sasToken =
  "sv=2020-08-04&ss=bf&srt=sco&sp=rwdlacitfx&se=2022-08-31T03:08:09Z&st=2022-03-30T19:08:09Z&spr=https&sig=6TPVrwrEHtD58hWbQCF00Kk%2FixTMIbOvxzUIIB7sQCk%3D";
const storageAccountName = "xword";
const containerName = "crosswords";
const blobSAS =
  "sp=racwdl&st=2022-03-30T19:12:43Z&se=2022-08-31T03:12:43Z&spr=https&sv=2020-08-04&sr=c&sig=RnxNeDYr5d8xx3HzNtXu6JekcVRqVlX3GRl7Y3a1WGI%3D";

// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};

// return list of blobs in container to display
export const getBlobsInContainer = async (containerClient) => {
  const returnedBlobUrls = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }
  return returnedBlobUrls;
};

const createBlobInContainer = async (containerClient, file) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);
  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };
  await blobClient.uploadData(file, options);
};

// async (file: File | null): Promise<string[]>
export async function uploadFileToBlob(file) {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${blobSAS}`
  );

  const containerClient = blobService.getContainerClient(containerName);
  //await containerClient.createIfNotExists();

  const createContainer = async () => {
    try {
      console.log(`Creating container "${containerName}"...`);
      await containerClient.create();
      console.log(`Done.`);
    } catch (error) {
      console.log(error.message);
    }
  };

  createContainer();

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
}
