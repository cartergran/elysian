import {
  AppBar,
  Breadcrumbs,
  IconButton,
  Link,
  Stack,
  Toolbar
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Switch from './switch';
import Upload from './upload';

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledBreadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledCrumbLink = styled(Link)`
  display: inline-block; // allows width property for ellipsis

  color: inherit;
  cursor: ${({ $isLast }) => $isLast ? 'default' : 'pointer'};
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.dark};
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: ${({ theme }) => theme.typography.h6.fontSize};
  }

  // truncation
  ${({ theme }) => theme.breakpoints.down('sm')} {
    overflow: hidden;
    max-width: 180px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledToolBar = styled(Toolbar)`
  justify-content: space-between;

  padding: 0;
`;

const HOME_TITLE = 'Overview';

const Header = ({
  chartCompanies,
  fundName,
  selectedSwitchDisabled,
  view,
  onCrumbClick,
  onSwitchChange,
  onSelectedSwitchChange
}) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const crumbs = [
    HOME_TITLE,
    ...(fundName ? [fundName] : []),
    // TODO: ...(companyName ? [companyName] : [])
  ];

  return (
    <StyledAppBar position="static">
      <StyledToolBar>
        <StyledBreadcrumbs>
          <IconButton sx={{ color: 'primary.light' }} onClick={() => onCrumbClick(0)}>{/* 0 := HOME */}
            <ShowChartIcon />
          </IconButton>
          <Breadcrumbs color="inherit" separator=">">
            {
              isLargeViewport ?
                crumbs.map((crumb, idx) => (
                  <StyledCrumbLink
                    variant="subtitle1"
                    $isLast={idx === crumbs.length - 1}
                    onClick={() => onCrumbClick(idx)}
                  >
                    {crumb}
                  </StyledCrumbLink>
                )) :
                <StyledCrumbLink variant="subtitle2">
                  {crumbs.at(-1)}
                </StyledCrumbLink>
            }
          </Breadcrumbs>
        </StyledBreadcrumbs>
        <Stack alignItems="center" direction="row" gap={1}>
          { view.mode === 'FUND' && <Switch label="Companies" onChange={onSwitchChange} /> }
          {
            chartCompanies &&
              <Switch
                disabled={selectedSwitchDisabled}
                label="Selected"
                onChange={onSelectedSwitchChange}
              />
          }
          <Upload fundName={fundName} />
        </Stack>
      </StyledToolBar>
    </StyledAppBar>
  );
};

export default Header;
