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
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';

const StyledChart = styled(ResponsiveContainer)`
  & div:focus-visible,
  & svg:focus {
    outline: none;
  }
`;

const StyledLegendLabel = styled.span`
  display: inline-block;

  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  opacity: ${({ theme, $active }) => $active ? 1 : theme.chart.legend.opacityInactive};
  transition: opacity 0.25s ease;
  user-select: none;
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

const ActiveLineTooltip = ({ active, activeLine, dataLabel, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = activeLine ? payload.find(p => p.dataKey === activeLine) : null;
  if (!entry) {
    return null;
  }

  return (
    <StyledTooltip>
      <span className="data-label">{dataLabel}</span>
      <span>{entry.dataKey}: {entry.value}</span>
    </StyledTooltip>
  );
};

const Chart = ({ chartData, dataLabel = 'Total Value' }) => {
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));

  const [hoverLine, setHoverLine] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const activeLine = selectedLine ?? hoverLine;

  const chartColors = theme.palette.chartLines || [];
  const { entityNames, dataPointsPerPeriod } = chartData;
  const firstPeriod = dataPointsPerPeriod.at(0)?.period;
  const lastPeriod = dataPointsPerPeriod.at(-1)?.period;
  const periodTickFormatter = (val) => { let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}` };
  const toggleSelect = (dataKey) => setSelectedLine((prev) => prev === dataKey ? null : dataKey);

  const responsive = useMemo(() => {
    const height = isLargeViewport ? 500 : 400;
    const tickFontSize = theme.typography[isLargeViewport ? 'body2' : 'caption'].fontSize;

    return {
      height,
      tickFontSize
    }
  }, [isLargeViewport, theme]);

  // stable string key
  const entityNamesKey = chartData.entityNames.join('|');
  useEffect(() => {
    setSelectedLine(null);
    setHoverLine(null);
  }, [entityNamesKey]);

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
        <Tooltip content={<ActiveLineTooltip activeLine={activeLine} dataLabel={dataLabel} />} />
        {
          entityNames.map((entityName, i) => (
            <Line
              key={entityName}
              activeDot=
                {{ r: activeLine === entityName ? theme.chart.dot.r : theme.chart.dot.rActive }}
              connectNulls
              dataKey={entityName}
              // TODO:
              // animationDuration={3000}
              // isAnimationActive={!activeLine}
              name={entityName}
              opacity=
                {(activeLine && activeLine !== entityName) ? theme.chart.line.opacityInactive : 1}
              stroke={chartColors[i % chartColors.length]}
              strokeWidth=
                {activeLine === entityName ? theme.chart.line.widthActive : theme.chart.line.width}
            />
          ))
        }
        {
          isLargeViewport &&
            <Legend
              align="center"
              verticalAlign="top"
              iconSize={4}
              iconType="circle"
              labelStyle={{ color: 'black' }}
              formatter={(entityName) =>
                <StyledLegendLabel $active={activeLine === entityName}>
                  {entityName}
                </StyledLegendLabel>
              }
              onClick={(e) => toggleSelect(e.dataKey)}
              onMouseEnter={(e) => !selectedLine && setHoverLine(e.dataKey)}
              onMouseLeave={() => hoverLine && setHoverLine(null)}
            />
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
