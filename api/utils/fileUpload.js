const multer = require("multer");
const { google } = require("googleapis");
const stream = require("stream");
const dotenv = require("dotenv");

dotenv.config();

const SCOPE = ["https://www.googleapis.com/auth/drive.file"];

// Use memory storage for uploading files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function authorize() {
  const jwtClient = new google.auth.JWT(
    process.env.client_email,
    null,
    process.env.private_key,
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
}

async function uploadFile(authClient, fileBuffer, originalFilename) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const fileMetaData = {
    name: originalFilename,
    parents: ["16l7M6t2rW8bqLe96zFRsAmuw5RAi8P8a"], // A folder ID to which the file will get uploaded
  };

  // Create a readable stream from the file buffer
  const fileStream = new stream.PassThrough();
  fileStream.end(fileBuffer);

  const media = {
    mimeType: "application/octet-stream",
    body: fileStream,
  };

  const response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: "id",
  });

  return response.data;
}
async function fetchAvatarFile(authClient, fileId) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const response = await drive.files.get(
    {
      fileId: fileId,
      alt: "media",
    },
    { responseType: "arraybuffer" }
  );

  return response.data;
}

module.exports = { authorize, uploadFile, fetchAvatarFile, upload };
