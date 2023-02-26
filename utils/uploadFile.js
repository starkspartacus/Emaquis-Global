const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

exports.uploadFile = async (file, filename) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_BUCKET_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });

  // uploads a file to AWS Cloud s3
  const fileStream = file.path ? fs.createReadStream(file.path) : file;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file?.originalname || filename,
    acl: 'public-read',
  };

  return s3.upload(uploadParams).promise();
};
