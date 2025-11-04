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
import { memo, useCallback, useMemo } from 'react';
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

const SelectedEntitiesTooltip = memo(({ active, selectedEntities, dataLabel, payload }) => {
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
});

const Axes = memo(({
  firstPeriod,
  isLargeViewport,
  lastPeriod,
  periodTickFormatter,
  tickFontSize,
  tickDelta
}) => {
  const xTickProps = useMemo(() => ({
    dy: tickDelta,
    fontSize: tickFontSize
  }), [tickFontSize, tickDelta]);

  const yTickProps = useMemo(() => ({
    dx: -tickDelta,
    fontSize: tickFontSize
  }), [tickFontSize, tickDelta]);

  const ticks = useMemo(() => (
    !isLargeViewport ? [firstPeriod, lastPeriod] : undefined
  ), [firstPeriod, isLargeViewport, lastPeriod]);

  return (
    <>
      <XAxis
        dataKey="period"
        // interval="preserveStartEnd"
        stroke="white"
        tick={xTickProps}
        tickFormatter={periodTickFormatter}
        ticks={ticks}
      />
      <YAxis
        tick={yTickProps}
        tickFormatter={(val) => `$${val}`}
        stroke="white"
      />
    </>
  );
});

const EntityLine = memo(({
    activeDotRadius,
    color,
    isAnimationActive,
    name,
    opacity,
    showDetails,
    strokeWidth
  }) => {
  return (
    <Line
      activeDot={showDetails && { r: activeDotRadius }}
      connectNulls
      dataKey={name}
      dot={showDetails}
      isAnimationActive={isAnimationActive}
      name={name}
      opacity={opacity}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
});

// i.e. dots & tooltip
const MAX_COMPANIES_FOR_DETAILS = 5;

const Chart = ({ chartData, dataLabel = 'Total Value', selectedEntities }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const canShowDetails = selectedEntities.size <= MAX_COMPANIES_FOR_DETAILS;
  const { entityNames, dataPointsPerPeriod } = chartData;
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;
  const entityColors = theme.palette.entities || [];

  const periodTickFormatter = useCallback((val) => {
    let [y, q] = val.split('-');
    return `${q}'${y.slice(-2)}`
  }, []);

  const responsive = useMemo(() => {
    const height = isLargeViewport ? 500 : 400;
    const tickFontSize = theme.typography[isLargeViewport ? 'body2' : 'caption'].fontSize;

    return {
      height,
      tickFontSize
    }
  }, [isLargeViewport, theme]);

  const selectedEntitiesMask = useMemo(() => {
    const m = new Map();
    for (const n of entityNames) {
      m.set(n, selectedEntities.has(n));
    }
    return m;
  }, [entityNames, selectedEntities]);

  const toolTipContent = useMemo(() => (
    canShowDetails ?
      <SelectedEntitiesTooltip
        dataLabel={dataLabel}
        selectedEntities={selectedEntities}
      /> : () => null
  ), [canShowDetails, dataLabel, selectedEntities]);

  return (
    <StyledChart height={responsive.height}>
      <LineChart data={dataPointsPerPeriod}>
        <Axes
          firstPeriod={firstPeriod}
          isLargeViewport={isLargeViewport}
          lastPeriod={lastPeriod}
          periodTickFormatter={periodTickFormatter}
          tickDelta={parseInt(theme.spacing(1))}
          tickFontSize={responsive.tickFontSize}
        />

        <Tooltip
          content={toolTipContent}
          isAnimationActive={false}
          wrapperStyle={{ pointerEvents: 'none' }} // avoids browser hit-testing
        />

        {
          entityNames.map((entityName, idx) => {
            const isSelected = selectedEntitiesMask.get(entityName);
            const showDetails = canShowDetails && isSelected;

            return (
              <EntityLine
                key={entityName}
                activeDotRadius={theme.chart.activeDot.radiusDetailed}
                color={entityColors[idx % entityColors.length]}
                isAnimationActive={!canShowDetails}
                name={entityName}
                opacity={isSelected ? 1 : theme.chart.line.opacityUnselected}
                showDetails={showDetails}
                strokeWidth={showDetails ? theme.chart.line.widthDetailed : undefined}
              />
            );
          })
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
