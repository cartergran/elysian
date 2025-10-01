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

const Chart = ({ chartData }) => {
  const theme = useTheme();

  const { entityNames, totalValueByPeriod } = chartData;
  const chartColors = theme.palette.charts || [];
  const firstPeriod = totalValueByPeriod.at(0)?.period;
  const lastPeriod = totalValueByPeriod.at(-1)?.period;

  return (
    <StyledChart height={500}>
      <LineChart data={totalValueByPeriod}>
        <XAxis
          dataKey="period"
          stroke="white"
          tick={{ dy: parseInt(theme.spacing(1)) }}
          ticks={[firstPeriod, lastPeriod]}
          tickFormatter={(val) => {let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}`}} // tmp
        />
        <YAxis
          label={{
            value: 'Total Value (USD)',
            angle: -90,
            dx: -parseInt(theme.spacing(3)),
          }}
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
