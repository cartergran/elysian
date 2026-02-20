import {
  Stack,
  Switch as MUISwitch,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import styled from 'styled-components';

const StyledSwitch = styled(Stack)`
  & .MuiSwitch-root {
    cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'} !important;
  }

  & .MuiSwitch-track {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }
`;

const Switch = ({ disabled = false, label, onChange }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <StyledSwitch direction="row" alignItems="center" $disabled={disabled}>
      <MUISwitch
        color="secondary"
        disabled={disabled}
        size={isLargeViewport ? 'large' : 'small'}
        onChange={onChange}
      />
      { isLargeViewport && <Typography variant='body1'>{label}</Typography> }
    </StyledSwitch>
  );
};

export default Switch;
