import styled from 'styled-components';
import { TableCell } from '@mui/material';

// hides columns: [1] invested capital, [2] realized value, [3] unrealized value
export const HIDE_ON_MOBILE_INDICES = new Set([1, 2, 3]);

export const ColoredName = styled('span')`
  color: ${({ $color }) => $color};
`;

export const DataCell = styled(TableCell)`
  display: ${({ $hideOnMobile }) => ($hideOnMobile ? 'none' : 'table-cell')};

  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  padding: ${({ theme }) => theme.spacing(1)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: table-cell;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    padding: ${({ theme }) => theme.spacing(1.5)};
  }
`;

export const FilterHeaderCell = styled(TableCell)`
  display: ${({ $hideOnMobile }) => $hideOnMobile ? 'none' : 'table-cell'};

  color: ${({ theme, $selected }) =>
    $selected ? theme.palette.primary.light : theme.palette.text.primary
  };
  cursor: ${({ $selectable }) => ($selectable ? 'pointer' : 'default')};
  font-size: ${({ theme, $selected }) =>
    $selected ? theme.typography.subtitle1.fontSize : theme.typography.subtitle2.fontSize
  };
  transition: all 0.25s ease-in-out;
  user-select: none;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: table-cell;
  }
`;

export const NameCell = styled(TableCell)`
  max-width: 120px;

  cursor: ${({ $selectable }) => ($selectable ? 'pointer' : 'default')};
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(1)};
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) => theme.breakpoints.up('md')} {
    max-width: 200px;

    padding: ${({ theme }) => theme.spacing(1.5)};
  }
`;
