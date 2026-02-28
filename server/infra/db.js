import { fileURLToPath } from 'url';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';

import { requireEnvVariable } from '../utils.js';

const DB_NAME = requireEnvVariable('DB_NAME');
const DB_HOST = requireEnvVariable('DB_HOST');
const DB_PASS = requireEnvVariable('DB_PASS');
const DB_USER = requireEnvVariable('DB_USER');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SSL_CA = fs.readFileSync(path.resolve(__dirname, '../certs/global-bundle.pem'));

const pool = mysql.createPool({
  // connectionLimit: 10,
  database: DB_NAME,
  host: DB_HOST,
  password: DB_PASS,
  user: DB_USER,
  // waitForConnections: true,
  ssl: {
    ca: SSL_CA,
    rejectUnauthorized: true
  }
});

export default pool;
