import styled from 'styled-components';
import {
  AppBar,
  Breadcrumbs,
  IconButton,
  Link,
  Toolbar
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Switch from './switch';

const StyledToolBar = styled(Toolbar)`
  justify-content: space-between;
`;

const StyledBreadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledCrumbLink = styled(Link)`
  cursor: ${({ $isLast }) => $isLast ? 'default' : 'pointer'};
  font-weight: bold;
  text-decoration: none;

  ${({ theme }) => theme.breakpoints.up('md')} {
    font-size: ${({ theme }) => theme.typography.h6.fontSize};
  }
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

const HeaderBar = ({ crumbs, view, onCrumbClick, onSwitchChange }) => {
  return (
    <AppBar 
      position="static"
      color="black"
    >
      <StyledToolBar>
        <StyledBreadcrumbs>
          <IconButton color="secondary" onClick={() => onCrumbClick(null)}>
            <ShowChartIcon />
          </IconButton>
          <Breadcrumbs color="secondary" separator=">">
            {
              crumbs.map((crumb, idx) => (
                <StyledCrumbLink
                  variant="subtitle1"
                  $isLast={idx === crumbs.length - 1}
                  onClick={() => onCrumbClick(idx)}
                >
                  {crumb}
                </StyledCrumbLink>
              ))
            }
          </Breadcrumbs>
        </StyledBreadcrumbs>
        {
          view.mode === 'HOME'
            ? <StyledUploadIcon />
            : <Switch label="Companies" onChange={onSwitchChange} />
        }
      </StyledToolBar>
    </AppBar>
  );
};

export default HeaderBar;
