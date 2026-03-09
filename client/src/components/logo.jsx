import Box, { boxClasses } from '@mui/material/Box';
import styled from 'styled-components';

const LOGO_SRC = '/logo.svg';

const StyledLogo = styled(Box)`
  &.${boxClasses.root} {
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
  }
`;

const Logo = ({ alt = 'logo', size = 24, ...props }) => (
  <StyledLogo
    alt={alt}
    component="img"
    src={LOGO_SRC}
    $size={size}
    {...props}
  />
);

export default Logo;
