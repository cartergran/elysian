import {
  Stack,
  Switch as MUISwitch,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import styled from 'styled-components';
import { switchClasses } from '@mui/material/Switch';

const StyledSwitch = styled(Stack)`
  & .${switchClasses.root} {
    cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'} !important;
  }
`;

const switchSx = {
  color: 'primary.light',
  [`& .${switchClasses.switchBase}.${switchClasses.checked}`]: {
    color: 'primary.light',
  },
  [`& .${switchClasses.switchBase}.${switchClasses.checked} + .${switchClasses.track}`]: {
    backgroundColor: 'primary.light',
  },
};

const Switch = ({ disabled = false, label, onChange }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <StyledSwitch direction="row" alignItems="center" $disabled={disabled}>
      <MUISwitch
        disabled={disabled}
        size={isLargeViewport ? 'large' : 'small'}
        sx={switchSx}
        onChange={onChange}
      />
      { isLargeViewport && <Typography variant='body1'>{label}</Typography> }
    </StyledSwitch>
  );
};

export default Switch;
