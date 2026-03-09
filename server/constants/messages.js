/**
 * centralized API response messages (detail / message fields)
 * single source of truth for client-facing strings
 */
export const MESSAGES = {
  // auth
  UNAUTHORIZED: 'Unauthorized.',
  SERVER_AUTH_CONFIG_ERROR: 'Server auth configuration error.',
  INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password.',
  LOGGED_OUT: 'Logged out.',

  // upload / extract
  NO_FILE_UPLOADED: 'No file uploaded.',
  NO_FUND_NAME_ENTERED: 'No fund name entered.',
  FILE_SIZE_EXCEEDED: 'File size exceeds 32MB limit.',
  REPORT_PROCESSED_SUCCESS: 'Report processed successfully.',
  ONLY_PDF_ALLOWED: 'Only PDF files are allowed.',

  // async jobs
  JOB_NOT_FOUND: 'Job not found.',
  JOB_PROCESSING_FAILED: 'Processing failed. Please try again.',

  // model
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait a moment and try again.',
};
