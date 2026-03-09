// hooks/funds.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../utils/client';

const FUNDS_KEY = ['funds'];

// GET /api/funds
const fetchFunds = async () => {
  const { data } = await api.get('/funds');
  return data;
};

// POST /api/extract — uploads PDF and returns a job ID immediately (202)
// GET /api/jobs/:id — polled until the job is done or errored
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS  = 5 * 60 * 1000; // 5 minutes

const pollJobUntilDone = async (jobId) => {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const { data } = await api.get(`/jobs/${jobId}`);

    if (data.status === 'done')  return data;
    if (data.status === 'error') throw new Error(data.detail || 'Processing failed.');
    // status === 'pending' — keep polling
  }

  throw new Error('Processing timed out. Please try again.');
};

const uploadFund = async (formData) => {
  // the POST only needs to complete S3 upload before responding (well under 30s)
  const { data } = await api.post('/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return pollJobUntilDone(data.jobId);
};

const useFunds = () => {
  return useQuery({
    queryKey: FUNDS_KEY,
    queryFn: fetchFunds,
    placeholderData: (prev) => prev ?? []
  });
};

const useUploadFund = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadFund,
    onSuccess: () => {
      // fetch funds after a successful upload
      qc.invalidateQueries({ queryKey: FUNDS_KEY });
    }
  });
};

export {
  useFunds,
  useUploadFund
};
