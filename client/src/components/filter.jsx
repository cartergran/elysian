import styled from 'styled-components';
import ToggleButton, { toggleButtonClasses } from '@mui/material/ToggleButton';
import ToggleButtonGroup, {toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

const StyledFilter = styled.div`
  ${({ theme }) => theme.recycle.flexCenter};
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(4),
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.middleButton}, & .${toggleButtonGroupClasses.lastButton}`]:
    {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderLeft: `${theme.shape.borderWidth}px solid ${theme.palette.divider}`
    },
  [`& .${toggleButtonClasses.selected}`]: {
    borderLeftColor: theme.palette.primary.main
  }
}));

const StyledToggleButton = styled(ToggleButton)`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  padding: ${({ theme }) => theme.spacing(0.75)};

  ${({ theme }) => theme.breakpoints.up('md')} {
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    padding: ${({ theme }) => theme.spacing(1)};
  }
`;

const Filter = ({ options, selected, onChange }) => {
  return (
    <StyledFilter>
      <StyledToggleButtonGroup
        value={selected}
        onChange={(e) => onChange(Number(e.target.value))}
        exclusive
      >
        {
          // period := # of quarters + 1 (i.e. 1Y = 5)
          // +1 bc 5 records shows the price over 4Q
          options.map(({ label, period }) => (
            <StyledToggleButton key={label} value={period}>
              {label}
            </StyledToggleButton>
          ))
        }
      </StyledToggleButtonGroup>
    </StyledFilter>
  );
};

export default Filter;
