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

const Chart = ({ chartData, yLabel = 'Total Value' }) => {
  const theme = useTheme();

  const { entityNames, dataPointsPerPeriod } = chartData;
  const chartColors = theme.palette.charts || [];
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;

  return (
    <StyledChart height={500}>
      <LineChart data={dataPointsPerPeriod}>
        <XAxis
          dataKey="period"
          stroke="white"
          tick={{ dy: parseInt(theme.spacing(1)) }}
          ticks={[firstPeriod, lastPeriod]}
          tickFormatter={(val) => { let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}` }} // tmp
        />
        <YAxis
          label={{
            value: `${yLabel} (USD)`,
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
