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
  gap: var(--space-m);

  // tmp
  .crumb {
    cursor: pointer;
  }
`;

const HeaderBar = ({ breadcrumbs, trendPercent, onBreadcrumbClick }) => {
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
              breadcrumbs.map((breadcrumb, idx) => (
                <Link
                  className="crumb"
                  fontWeight="bold"
                  variant="h5"
                  underline={idx === breadcrumbs.length - 1 ? 'none' : 'hover'}
                  onClick={() => onBreadcrumbClick(breadcrumb.onClickArg)}
                >
                  {breadcrumb.label}
                </Link>
              ))
            }
          </Breadcrumbs>
        </StyledBreadcrumbs>
        {
          trendPercent && 
            <Typography color="secondary" fontWeight="medium" variant="body2">
              {trendPercent}
            </Typography>
        } 
      </StyledToolBar>
    </AppBar>
  );
};

export default HeaderBar;
