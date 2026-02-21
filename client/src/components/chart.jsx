import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useLineAnimationOnAdd } from '../hooks/lines';

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

  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  color: ${({ theme }) => theme.palette.text.primary};
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
  const theme = useTheme();
  const strokeColor = theme.palette.primary.main;

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
        stroke={strokeColor}
        tick={xTickProps}
        tickFormatter={periodTickFormatter}
        ticks={ticks}
      />
      <YAxis
        tick={yTickProps}
        tickFormatter={(val) => `$${val}`}
        stroke={strokeColor}
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
      animationDuration={ANIMATION_DURATION}
      connectNulls
      dataKey={name}
      dot={showDetails}
      isAnimationActive={isAnimationActive}
      isUpdateAnimationActive={false}
      name={name}
      opacity={opacity}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
});

const ANIMATION_DURATION = 1400; // ms
const MAX_ENTITIES_FOR_DETAILS = 5; // i.e. dots & tooltip

const Chart = ({
  chartData,
  dataLabel = 'Total Value',
  newEntities,
  selectedEntities,
  showSelectedOnly = false,
  visibleEntities
}) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const canShowDetails = selectedEntities.size <= MAX_ENTITIES_FOR_DETAILS;
  const canShowTooltip = canShowDetails && selectedEntities.size > 0;

  const { entityNames, dataPointsPerPeriod } = chartData;
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;
  const entityColors = theme.palette.entities || [];

  const getLineAnimationActive= useLineAnimationOnAdd(entityNames, selectedEntities);
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

  const tooltipContent = useMemo(() => (
    canShowTooltip ?
      <SelectedEntitiesTooltip
        dataLabel={dataLabel}
        selectedEntities={selectedEntities}
      /> : () => null
  ), [canShowTooltip, dataLabel, selectedEntities]);

  const tooltipWrapperStyle = useMemo(() => ({
    pointerEvents: 'none'
  }), []);

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
          content={tooltipContent}
          isAnimationActive={false}
          wrapperStyle={tooltipWrapperStyle} // avoids browser hit-testing
        />

        {
          entityNames.map((entityName, idx) => {
            if (showSelectedOnly && !visibleEntities.has(entityName)) { return null; }

            const isVisible = visibleEntities.has(entityName);
            const showDetails = canShowDetails && isVisible;

             // new key --> remount --> fresh animation :)
            const lineAnimationActive = canShowDetails && getLineAnimationActive(entityName);
            const lineKey = lineAnimationActive ? `${entityName}::anim` : `${entityName}::static`;

            return (
              <EntityLine
                key={lineKey}
                activeDotRadius={theme.chart.activeDot.radiusDetailed}
                color={entityColors[idx % entityColors.length]}
                isAnimationActive={newEntities || lineAnimationActive}
                name={entityName}
                opacity={isVisible ? 1 : theme.chart.line.opacityUnselected}
                showDetails={showDetails}
                strokeWidth={showDetails ? theme.chart.line.widthDetailed : 1}
              />
            );
          })
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
