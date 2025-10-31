import {
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

const StyledTooltip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background: white;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  color: black;
  padding: ${({ theme }) => theme.spacing(1)};

  & .data-label {
    font-weight: 700;
  }
`;

/*
TODO:
const SelectedEntitiesTooltip = ({ active, selectedEntities, dataLabel, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const entries = selectedEntities ? payload.filter(...)
  if (!entries) {
    return null;
  }

  return (<div />);
}
*/;

// i.e. dots & tooltip
const MAX_COMPANIES_FOR_DETAILS = 5;

const Chart = ({ chartData, dataLabel = 'Total Value', selectedEntities }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const chartColors = theme.palette.chartLines || [];
  const { entityNames, dataPointsPerPeriod } = chartData;
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;
  const periodTickFormatter = (val) => { let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}` };
  const showDots = selectedEntities.size <= MAX_COMPANIES_FOR_DETAILS;

  const responsive = useMemo(() => {
    const height = isLargeViewport ? 500 : 400;
    const tickFontSize = theme.typography[isLargeViewport ? 'body2' : 'caption'].fontSize;

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
          tickFormatter={periodTickFormatter}
          {...(!isLargeViewport && { ticks: [firstPeriod, lastPeriod] })}
        />
        <YAxis
          stroke="white"
          tick={{
            dx: -parseInt(theme.spacing(1)),
            fontSize: responsive.tickFontSize
          }}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip
          content={() => null}
          isAnimationActive={false}
          wrapperStyle={{ pointerEvents: 'none' }} // avoids browser hit-testing
        />
        {
          entityNames.map((entityName, i) => {
            const isSelected = selectedEntities.has(entityName);

            return (
              <Line
                key={entityName}
                activeDot={isSelected && showDots}
                connectNulls
                dataKey={entityName}
                dot={isSelected && showDots}
                name={entityName}
                opacity={ isSelected ? 1 : theme.chart.line.opacityInactive }
                stroke={chartColors[i % chartColors.length]}
              />
            );
          })
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
