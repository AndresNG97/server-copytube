const AWS = require("aws-sdk");
const fs = require("fs");

// AWS S3
const ID = "AKIAUXRR66KUDV2ADZN5";
const SECRET = "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";

const BUCKET_NAME = "copyserverbucket";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

function awsUploadVideo(file, filePath, callback) {
  fs.readFile(file.tempFilePath, (err, data) => {
    if (err) throw err;
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${filePath}`,
      Body: data
    };

    s3.upload(params, function(s3Err, data) {
      if (s3Err) return callback(s3Err);
      return callback(data.Location);
    });
  });
}

module.exports = awsUploadVideo;
