import { S3Client } from '@aws-sdk/client-s3';

import { requireEnvVariable } from '../utils.js';

const ACCESS_KEY_ID = requireEnvVariable('AWS_ACCESS_KEY_ID');
const SECRET_ACCESS_KEY = requireEnvVariable('AWS_SECRET_ACCESS_KEY');

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

export default s3;
