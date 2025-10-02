import styled from 'styled-components';
import {
  AppBar,
  Breadcrumbs,
  Container, // margins
  IconButton,
  Link,
  Toolbar,
  Typography
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";

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

const HeaderBar = ({ crumbs, view, onCrumbClick }) => {
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
        { /* TODO: view */ }
      </StyledToolBar>
    </AppBar>
  );
};

export default HeaderBar;
