import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styled from 'styled-components';
import { Typography, useMediaQuery } from '@mui/material';
import { memo, useMemo } from 'react';
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
`;

const SelectedEntitiesTooltip = ({ active, selectedEntities, dataLabel, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const entries = selectedEntities ? payload.filter((p) => selectedEntities.has(p.dataKey)) : null;
  if (!entries) {
    return null;
  }

  return (
    <StyledTooltip>
      <Typography component="span" fontWeight="bold">{dataLabel}</Typography>
      {
        entries.map((entry) => (
          <Typography
            key={entry.dataKey}
            component="span"
          >
            {entry.dataKey}: ${entry.value}
          </Typography>
        ))
      }
    </StyledTooltip>
  );
};

// i.e. dots & tooltip
const MAX_COMPANIES_FOR_DETAILS = 5;

const EntityLine = memo(({ color, name, opacity, showDetails }) => {
  return (
    <Line
      key={name}
      activeDot={showDetails}
      connectNulls
      dataKey={name}
      dot={showDetails}
      name={name}
      opacity={opacity}
      stroke={color}
    />
  );
});

const Chart = ({ chartData, dataLabel = 'Total Value', selectedEntities }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const canShowDetails = selectedEntities.size <= MAX_COMPANIES_FOR_DETAILS;
  const { entityNames, dataPointsPerPeriod } = chartData;
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;
  const lineColors = theme.palette.chartLines || [];

  const periodTickFormatter = (val) => { let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}` };

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
          content={
            canShowDetails ?
              <SelectedEntitiesTooltip
                dataLabel={dataLabel}
                selectedEntities={selectedEntities}
              /> : () => null
          }
          isAnimationActive={false}
          wrapperStyle={{ pointerEvents: 'none' }} // avoids browser hit-testing
        />
        {
          entityNames.map((entityName, i) => {
            const isSelected = selectedEntities.has(entityName);
            const showDetails = canShowDetails && isSelected;

            return (
              <EntityLine
                color={lineColors[i % lineColors.length]}
                name={entityName}
                opacity={isSelected ? 1 : theme.chart.line.opacityInactive}
                showDetails={showDetails}
              />
            );
          })
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
