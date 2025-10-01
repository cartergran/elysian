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
      borderLeft: `${theme.shape.borderWidth}px solid ${theme.palette.secondary.main}`,
    },
  [`
    & .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled},
    & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`
  ]:
    {
      borderLeft: `${theme.shape.borderWidth}px solid ${theme.palette.action.disabled}`,
    },
}));

const Filter = ({ options, selected, onChange }) => {
  return (
    <StyledFilter>
      <StyledToggleButtonGroup
        value={selected}
        onChange={(e) => onChange(Number(e.target.value))}
        exclusive
      >
        {
          // value := # of quarters + 1 (i.e. 1Y = 5)
          // +1 bc 5 records shows the price over 4Q
          options.map(({ label, period }) => (
            <ToggleButton key={label} value={period}>
              {label}
            </ToggleButton>
          ))
        }
      </StyledToggleButtonGroup>
    </StyledFilter>
  );
};

export default Filter;
