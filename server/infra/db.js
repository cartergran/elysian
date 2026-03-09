import mysql from 'mysql2/promise';

import { requireEnvVariable } from '../utils.js';

const JAWSDB_URL = requireEnvVariable('JAWSDB_URL');

const pool = mysql.createPool(JAWSDB_URL);

export default pool;
