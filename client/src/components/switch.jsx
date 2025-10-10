import {
  Box,
  Switch as MUISwitch,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import styled from 'styled-components';

const StyledSwitch = styled(Box)`
  display: flex;
  align-items: center;

  & .MuiSwitch-root .MuiSwitch-track {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }
`;

const Switch = ({ label, onChange }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <StyledSwitch>
      <MUISwitch
        color="secondary"
        size={isLargeViewport ? 'large' : 'small'}
        onChange={onChange}
      />
      { isLargeViewport && <Typography variant='body1'>{label}</Typography> }
    </StyledSwitch>
  );
};

export default Switch;
