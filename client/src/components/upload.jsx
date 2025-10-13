import axios from 'axios';
import {
  // Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, useState } from 'react';
import styled from 'styled-components';

const StyledCloseIconButton = styled(CloseIcon)`
  position: absolute;

  right: ${({ theme }) => theme.spacing(1)};
  top: ${({ theme }) => theme.spacing(1)};
`;

const StyledUploadIcon = styled(CloudUploadIcon)`
  font-size: 1.5rem;
  transition: transform 1s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.25);
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    font-size: 2rem;
  }
`;

const ERRORS = {
  DEFAULT: 'An error occurred while processing the file.',
  NO_FILE: 'Please select a PDF file first.',
  TOO_LARGE: 'File size must be less than 32MB'
};

const MAX_BYTES = 32 * 1024 * 1024; // 32MB

const Upload = ({}) => {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState(null);

  const fileInputRef = useRef(null);

  const handleClose = () => {
    setError(null);
    setFile(null);
    setLoading(false);
    setOpen(false);
    setResponse(null);
    if (fileInputRef.current) { fileInputRef.current.value = ''; }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setResponse(null);

    if (selected.size && selected.size > MAX_BYTES) {
      setError(ERRORS.TOO_LARGE);
      setFile(null);
      if (fileInputRef.current) { fileInputRef.current.value = ''; }
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError(ERRORS.NO_FILE);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post('extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResponse(res.data);
      // setFile(null);
      // fileInputRef.current?.value = '';
      // onUploadSuccess();

    } catch(err) {
      setError(err.response?.data?.detail || err.message || ERRORS.DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton color="secondary" onClick={() => setOpen(true)}>
        <StyledUploadIcon />
      </IconButton>

      <Dialog disableRestoreFocus fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>
          <StyledCloseIconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </StyledCloseIconButton>
          Upload Report
        </DialogTitle>

        <DialogContent dividers>
          <Stack alignItems="center" spacing={1}>
            <Button
              aria-label="select"
              component="label"
              tabIndex={-1}
              variant="contained"
            >
              Select Report
              <input
                accept="application/pdf"
                hidden
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
              />
            </Button>

            { file && <Typography variant="body2">{file.name}</Typography> }

            { loading && <LinearProgress /> }

            {
              // response && (
              //   <Box>
              //     <Typograpy></Typography>
              //   </Box>
              // )
            }

            { error && <Typography color="error" variant="body2">{error}</Typography> }
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button disabled={loading} variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!file || loading}
            startIcon={<CloudUploadIcon />}
            variant="contained"
            onClick={handleUpload}
          >
            { loading ? <CircularProgress size={24} /> : 'Upload' }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Upload;
