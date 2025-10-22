import { GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { requireEnvVariable } from '../utils.js';
import s3 from '../infra/s3.js';

const S3_BUCKET = requireEnvVariable('S3_BUCKET');

const putPdfAndGetUrlFromS3 = async (buffer, filename) => {
  if (!S3_BUCKET) {
    throw new Error('S3 bucket not configured.');
  }
  
  const key = `reports/${filename}`;
  const putCmd = new PutObjectCommand({
    ACL: 'private',
    Body: buffer,
    Bucket: S3_BUCKET,
    ContentType: 'application/pdf',
    Key: key,
  });
  await s3.send(putCmd);

  const getCmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  const signedUrl = getSignedUrl(s3, getCmd, { expiresIn: 3600 });

  return signedUrl;
};

export default putPdfAndGetUrlFromS3;
