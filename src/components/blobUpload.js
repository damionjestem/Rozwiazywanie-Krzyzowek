import { BlobServiceClient } from "@azure/storage-blob";

const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
const storageAccountName = "xwordblobstoragetest"; //process.env.REACT_APP_STORAGERESOURCENAME;
const containerName = `xsword-test1`;

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
    `https://${storageAccountName}.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-08-30T00:13:25Z&st=2022-03-29T16:13:25Z&spr=https&sig=TiJb8OAfRq0DGuzbB6Cc13sjKnBkIKLB%2BNa%2FjeTShBY%3D`
  );

  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
}
