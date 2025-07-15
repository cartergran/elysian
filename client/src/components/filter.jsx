import styled from 'styled-components';
import ToggleButton, { toggleButtonClasses } from '@mui/material/ToggleButton';
import ToggleButtonGroup, {toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

const StyledFilter = styled.div`
  ${({ theme }) => theme.recycle.flexCenter};
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: 'var(--space-xl)',
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderLeft: `1px solid ${theme.palette.secondary.main}`,
    },
  [`
    & .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled},
    & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`
  ]:
    {
      borderLeft: `1px solid ${theme.palette.action.disabled}`,
    },
}));

const Filter = ({ filters, selectedFilter, onFilterChange }) => {
  return (
    <StyledFilter>
      <StyledToggleButtonGroup
        value={selectedFilter}
        onChange={(_e, value) => onFilterChange(value)}
        exclusive
      >
        {
          // value := # of quarters + 1 (i.e. 1Y = 5)
          // +1 bc 5 records shows the price over 4Q
          Object.entries(filters).map(([term, value], idx) => (
            <ToggleButton key={idx} value={value}>
              {term}
            </ToggleButton>
          ))
        }
      </StyledToggleButtonGroup>
    </StyledFilter>
  );
};

export default Filter;
