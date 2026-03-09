import { randomUUID } from 'crypto';

import pool from '../infra/db.js';

export const JOB_STATUS = Object.freeze({
  PENDING: 'pending',
  DONE: 'done',
  ERROR: 'error',
});

/**
 * - run once at startup so the table exists before any requests arrive
 * - IF NOT EXISTS makes it safe to call on every boot
 */
export const ensureJobLogTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS job_log (
      job_id     CHAR(36)                        NOT NULL,
      status     ENUM('pending','done','error')  NOT NULL DEFAULT 'pending',
      fund_name  VARCHAR(100)                    NOT NULL,
      error_msg  TEXT,
      created_at DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                          ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (job_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
};

export const createJob = async (fundName) => {
  const jobId = randomUUID();
  await pool.execute(
    'INSERT INTO job_log (job_id, status, fund_name) VALUES (?, ?, ?)',
    [jobId, JOB_STATUS.PENDING, fundName]
  );
  return jobId;
};

export const completeJob = async (jobId) => {
  await pool.execute(
    'UPDATE job_log SET status = ? WHERE job_id = ?',
    [JOB_STATUS.DONE, jobId]
  );
};

export const failJob = async (jobId, errorMsg) => {
  await pool.execute(
    'UPDATE job_log SET status = ?, error_msg = ? WHERE job_id = ?',
    [JOB_STATUS.ERROR, String(errorMsg).slice(0, 500), jobId]
  );
};

/**
 * - returns the job row, or null if not found
 * - opportunistically purges jobs older than 1 day to keep the table small
 */
export const getJob = async (jobId) => {
  await pool.execute(
    'DELETE FROM job_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)'
  );
  const [rows] = await pool.execute(
    'SELECT job_id, status, error_msg FROM job_log WHERE job_id = ?',
    [jobId]
  );
  return rows[0] ?? null;
};
