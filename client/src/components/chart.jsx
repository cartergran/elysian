// TODO: import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const StyledChart = styled(ResponsiveContainer)`
  & div:focus-visible,
  & svg:focus {
    outline: none;
  }
`;

const Chart = ({ funds, selectedFilter }) => {
  const theme = useTheme();

  return (
    <StyledChart width="80%" height={500}>
      <LineChart data={funds[0].fundTotalValueByPeriod.slice(-selectedFilter)}>
        <XAxis
          dataKey="period"
          stroke="white"
          tickFormatter={(val) => val.split('-').at(-1) }
        />
        <YAxis
          stroke="white"
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip formatter={(val) => `$${val}`} />
        <Legend />
        <Line
          dataKey="totalValue"
          stroke={theme.palette.primary.light}
        />
      </LineChart>
    </StyledChart>
  );
}

export default Chart;
