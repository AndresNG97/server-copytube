const AWS = require("aws-sdk");

// AWS S3
const ID = "AKIAUXRR66KUDV2ADZN5";
const SECRET = "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";
const BUCKET_NAME = "copyserverbucket";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

function awsDeleteItems(video, thumbnail) {
  console.log(video);
  let params = {
    Bucket: BUCKET_NAME,
    Delete: {
      // required
      Objects: [
        // required
        {
          Key: thumbnail // required
        },
        {
          Key: video
        }
      ]
    }
  };

  s3.deleteObjects(params, function(s3err, data) {
    if (s3err) console.log(s3err, s3err.stack);
    else console.log(data);
  });
}

module.exports = awsDeleteItems;
