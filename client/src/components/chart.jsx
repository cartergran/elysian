import styled from 'styled-components';
import {
  Label,
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

const YAxisLabel = (
  <Label
    value="Total Value (USD)"
    angle={-90}
    position="center"
    dx={-30}
  />
);

const Chart = ({ chartData }) => {
  const theme = useTheme();
  const { entityNames, totalValueByPeriod } = chartData;
  const chartColors = theme.palette.charts || [];

  return (
    <StyledChart width="80%" height={500}>
      <LineChart data={totalValueByPeriod}>
        <XAxis
          dataKey="period"
          stroke="white"
          tickFormatter={(val) => val.split('-').at(-1) }
        />
        <YAxis
          label={YAxisLabel}
          stroke="white"
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip
          itemStyle={{ color: 'black' }}
          labelStyle={{ color: 'black' }}
          labelFormatter={(label) => `Period: ${label}`}
        />
        <Legend
          align="right"
          verticalAlign="top"
          iconSize={8}
          iconType="circle"
          labelStyle={{ color: 'black' }}
        />

        {
          entityNames.map((entityName, i) => (
            <Line
              key={entityName}
              name={entityName}
              dataKey={entityName}
              stroke={chartColors[i % chartColors.length]}
            />
          ))
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
