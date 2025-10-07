import { Box, Switch as MUISwitch, Typography } from '@mui/material';
import styled from 'styled-components';

const StyledSwitch = styled(Box)`
  display: flex;
  align-items: center;

  & .MuiSwitch-root .MuiSwitch-track {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }
`;

const Switch = ({ label, onChange }) => {
  return (
    <StyledSwitch>
      <MUISwitch
        color="secondary"
        size="large"
        onChange={onChange}
      />
      <Typography variant="h5">{label}</Typography>
    </StyledSwitch>
  );
};

export default Switch;
