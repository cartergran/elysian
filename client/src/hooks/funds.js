// hooks/funds.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../utils/client';

const FUNDS_KEY = ['funds'];

// GET /api/funds
const fetchFunds = async () => {
  const { data } = await api.get('/funds');
  return data;
};

// POST /api/extract — S3 + LLM parsing + DB upsert
const UPLOAD_TIMEOUT_MS = 83000; // 1 minute 23 seconds

const uploadFund = async (formData) => {
  const { data } = await api.post('/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: UPLOAD_TIMEOUT_MS
  });
  return data;
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
