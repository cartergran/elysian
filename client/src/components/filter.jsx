import { useState } from 'react';
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

const filters = ['Q1', 'Q2', '1Y', '2Y'];

const Filter = ({}) => {
  const [selected, setSelected] = useState(0);

  return (
    <StyledFilter>
      <StyledToggleButtonGroup
        value={selected}
        onChange={(_e, value) => setSelected(value)}
        exclusive
      >
        {
          Object.entries(filters).map(([_, term], idx) => (
            <ToggleButton key={idx} value={idx}>
              {term}
            </ToggleButton>
          ))
        }
      </StyledToggleButtonGroup>
    </StyledFilter>
  );
};

export default Filter;
