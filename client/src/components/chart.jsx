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

const Chart = ({ chartData }) => {
  const theme = useTheme();
  const { entityNames, totalValuesByPeriod } = chartData;

  return (
    <StyledChart width="80%" height={500}>
      <LineChart data={totalValuesByPeriod}>
        <XAxis
          dataKey="period"
          stroke="white"
          tickFormatter={(val) => val.split('-').at(-1) }
        />
        <YAxis
          stroke="white"
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip
          labelFormatter={(label) => `Period: ${label}`}
          labelStyle={{ color: 'black' }}
          itemStyle={{ color: 'black' }}
        />
        <Legend />

        {
          entityNames.map((entityName) => (
            <Line
              key={entityName}
              name={entityName}
              dataKey={entityName}
              stroke="white"
            />
          ))
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
