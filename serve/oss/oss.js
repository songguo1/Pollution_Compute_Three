const OSS = require('ali-oss');

const ossConfig = {
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
};

const client = new OSS(ossConfig);

module.exports = {client, ossConfig};
