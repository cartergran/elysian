import {
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

const StyledChart = styled(ResponsiveContainer)`
  & div:focus-visible,
  & svg:focus {
    outline: none;
  }
`;

const Chart = ({ chartData, yLabel = 'Total Value' }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const { entityNames, dataPointsPerPeriod } = chartData;
  const chartColors = theme.palette.charts || [];
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;
  const periodTickFormatter = (val) => { let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}` };

  const responsive = useMemo(() => {
    const height = isLargeViewport ? 500 : 400;
    const tickFontSize = theme.typography.tick[isLargeViewport ? 'large' : 'small'].fontSize;

    return {
      height,
      tickFontSize
    }
  }, [isLargeViewport, theme]);

  return (
    <StyledChart height={responsive.height}>
      <LineChart data={dataPointsPerPeriod}>
        <XAxis
          dataKey="period"
          stroke="white"
          tick={{
            dy: parseInt(theme.spacing(1)),
            fontSize: responsive.tickFontSize
          }}
          ticks={[firstPeriod, lastPeriod]}
          tickFormatter={periodTickFormatter}
        />
        <YAxis
          label={{
            value: `${yLabel} (USD)`,
            angle: -90,
            dx: -parseInt(theme.spacing(3)),
          }}
          stroke="white"
          tick={{ fontSize: responsive.tickFontSize }}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip
          itemStyle={{ color: 'black' }}
          labelStyle={{ color: 'black' }}
          labelFormatter={(label) => `Period: ${label}`}
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
        {
          isLargeViewport &&
            <Legend
              align="right"
              verticalAlign="top"
              iconSize={8}
              iconType="circle"
              labelStyle={{ color: 'black' }}
            />
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
