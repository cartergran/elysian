import styled from 'styled-components';
import {
  AppBar,
  Breadcrumbs,
  Container, // margins
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

  // tmp
  & .crumb {
    cursor: pointer;
  }
`;

const StyledUploadIcon = styled(CloudUploadIcon)`
  font-size: 40px;
  transition: transform 1s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.25);
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
          <IconButton color="secondary" onClick={() => onBreadcrumbClick(null)}>
            <ShowChartIcon />
          </IconButton>
          <Breadcrumbs color="secondary" separator=">">
            {
              crumbs.map((crumb, idx) => (
                <Link
                  className="crumb"
                  fontWeight="bold"
                  variant="h5"
                  underline={idx === crumbs.length - 1 ? 'none' : 'hover'}
                  onClick={() => onCrumbClick(idx)}
                >
                  {crumb}
                </Link>
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
