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
import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';

const StyledChart = styled(ResponsiveContainer)`
  & div:focus-visible,
  & svg:focus {
    outline: none;
  }
`;

const StyledLegendLabel = styled.span`
  display: inline-block;

  opacity: ${({ $active, theme }) => ($active ? 1 : theme.chart.legendOpacityInactive)};
  transition: opacity 0.25s ease;
  user-select: none;
`;
const LegendWrapperStyle = (activeLine, legendOpacityInactive) => {
  return {
    cursor: 'pointer',
    opacity: activeLine ? 1 : legendOpacityInactive,
    transition: 'opacity 0.25s ease'
  };
};

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
  const periodTickFormatter = (val) => { let [y, q] = val.split('-'); return `${q} '${y.slice(-2)}` };
  const toggleSelect = (dataKey) => setSelectedLine((prev) => prev === dataKey ? null : dataKey);

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
          tickFormatter={periodTickFormatter}
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
                {{ r: activeLine === entityName ? theme.chart.dotRActive : theme.chart.dotR }}
              dataKey={entityName}
              name={entityName}
              opacity=
                {(activeLine && activeLine !== entityName) ? theme.chart.lineOpacityInactive : 1}
              stroke={chartColors[i % chartColors.length]}
              strokeWidth=
                {activeLine === entityName ? theme.chart.lineWidthActive : theme.chart.lineWidth}
            />
          ))
        }
        {
          isLargeViewport &&
            <Legend
              align="center"
              verticalAlign="top"
              iconSize={8}
              iconType="circle"
              labelStyle={{ color: 'black' }}
              formatter={(entityName) =>
                <StyledLegendLabel $active={activeLine === entityName}>
                  {entityName}
                </StyledLegendLabel>
              }
              wrapperStyle={LegendWrapperStyle(activeLine, theme.chart.legendOpacityInactive)}
              onClick={(e) => toggleSelect(e.dataKey)}
              onMouseEnter={(e) => !selectedLine && setHoverLine(e.dataKey)}
              onMouseLeave={() => !selectedLine && setHoverLine(null)}
            />
        }
      </LineChart>
    </StyledChart>
  );
};

export default Chart;
