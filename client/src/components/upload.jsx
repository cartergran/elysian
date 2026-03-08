import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormHelperText,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

import { useUploadFund } from '../hooks/funds';

const StyledCloseIconButton = styled(CloseIcon)`
  position: absolute;

  right: ${({ theme }) => theme.spacing(1)};
  top: ${({ theme }) => theme.spacing(1)};
`;

const StyledLinearProgress = styled(LinearProgress)`
  width: 50%;
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
  FILE: {
    EMPTY: 'A PDF file is required.',
    TOO_LARGE: 'File size must be less than 32MB.',
    WRONG_TYPE: 'File type must be a PDF.'
  },
  FUND_NAME: {
    EMPTY: 'A fund name is required.'
  }
};

const FILE_ACCEPTED_TYPE = 'application/pdf';
const FILE_MAX_BYTES = 32 * 1024 * 1024; // 32MB
const FILE_HELPER_TXT_ID = 'file-helper-text';

const FORM_ID = 'upload-report-form';

const FUND_NAME_LABEL = 'Fund Name';
const FUND_NAME_MAX_LENGTH = 100;
const FUND_NAME_PLACEHOLDER = 'Enter fund name...';

const Upload = ({ fundName: initialFundName }) => {
  const fileInputRef = useRef(null);
  const { isPending, mutateAsync } = useUploadFund();

  // display state
  const [open, setOpen] = useState(false);

  // input state
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [fundName, setFundName] = useState(initialFundName ?? '');
  const [fundNameError, setFundNameError] = useState(null);
  const [fundNameTouched, setFundNameTouched] = useState(false);

  // sync fund name when dialog opens
  useEffect(() => {
    if (open) {
      setFundName(initialFundName ?? '');
    }
  }, [open]);

  // server state
  const [globalError, setGlobalError] = useState(null);
  const [response, setResponse] = useState(null);

  const isSubmitDisabled = !file || !fundName || isPending || !!response;

  const validateFundName = (n) => {
    if (initialFundName) {
      return null;
    }

    if (!n) {
      return ERRORS.FUND_NAME.EMPTY;
    }

    // TODO:
    // if (fundNames.includes(n)) {
    //   return ERRORS.FUND_NAME.ALREADY_EXISTS;
    // }

    return null;
  };

  const validateFile = (f) => {
    if (!f) {
      return ERRORS.FILE.EMPTY;
    }

    if (f.size > FILE_MAX_BYTES) {
      return ERRORS.FILE.TOO_LARGE;
    }

    if (f.type !== FILE_ACCEPTED_TYPE) {
      return ERRORS.FILE.WRONG_TYPE;
    }

    return null;
  };

  const handleClose = () => {
    setOpen(false);

    setFile(null);
    setFileError(null);
    if (fileInputRef.current) { fileInputRef.current.value = ''; }
    setFundNameError(null);
    setFundNameTouched(false);

    setGlobalError(null);
    setResponse(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0] ?? null;
    setFile(f);
    setFileError(validateFile(f));

    setGlobalError(null);
    setResponse(null);
  };

  const handleFundNameChange = (e) => {
    const n = e.target.value;
    setFundName(n);
    if (fundNameTouched) { setFundNameError(validateFundName(n)); }
  };

  const handleFundNameBlur = (_e) => {
    const n = fundName.trim();
    setFundName(n);
    setFundNameError(validateFundName(n));
    if (!fundNameTouched) { setFundNameTouched(true); }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fundName', fundName.trim());

    try {
      setGlobalError(null);

      const res = await mutateAsync(formData);
      setResponse(res);

      // setFile(null);
      // fileInputRef.current?.value = '';
      // onUploadSuccess();

    } catch(err) {
      console.error(`${ERRORS.DEFAULT} ${err}`);
      setGlobalError(err.response?.data?.detail || err.message || ERRORS.DEFAULT);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const n = fundName.trim();
    setFundName(n);

    const fErr = validateFile(file);
    const nErr = validateFundName(n);

    setFileError(fErr);
    setFundNameError(nErr);

    if (fErr || nErr) { return; }

    handleUpload();
  };

  return (
    <>
      <IconButton sx={{ color: 'primary.light' }} onClick={() => setOpen(true)}>
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
          <form id={FORM_ID} noValidate onSubmit={handleSubmit}>
            <Stack alignItems="center" gap={2}>
              <TextField
                aria-label="name"
                error={!!fundNameError}
                fullWidth
                helperText={fundNameError || ''}
                label={FUND_NAME_LABEL}
                placeholder={FUND_NAME_PLACEHOLDER}
                value={fundName}
                variant="outlined"
                onBlur={handleFundNameBlur}
                onChange={handleFundNameChange}
                slotProps={{
                  htmlInput: { maxLength: FUND_NAME_MAX_LENGTH },
                  input: { readOnly: !!initialFundName }
                }}
              />
              <FormControl error={!!fileError} required>
                <Button
                  aria-label="select"
                  component="label"
                  variant="contained"
                >
                  Select Report
                  <input
                    accept={FILE_ACCEPTED_TYPE}
                    aria-describedby={fileError ? FILE_HELPER_TXT_ID : undefined}
                    hidden
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
                { fileError && <FormHelperText id={FILE_HELPER_TXT_ID}>{fileError}</FormHelperText> }
              </FormControl>

              {/* TODO: transition  */}
              { file && <Typography variant="body2">{file.name}</Typography> }

              {/* TODO: transition  */}
              { isPending && (
                <Stack alignItems="center" gap={1} width="100%">
                  <StyledLinearProgress />
                  <Typography color="text.secondary" variant="caption">
                    Analyzing report with AI...
                  </Typography>
                </Stack>
              ) }

              {/* TODO: transition  */}
              { response && <Typography variant={"body2"}>{response.message}</Typography> }

              {/* TODO: transition  */}
              { globalError && <Typography color="error" variant="body2">{globalError}</Typography> }
            </Stack>
          </form>
        </DialogContent>

        <DialogActions>
          <Button disabled={isPending} variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitDisabled}
            form={FORM_ID}
            type="submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            { isPending ? <CircularProgress size={24} /> : 'Upload' }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Upload;
