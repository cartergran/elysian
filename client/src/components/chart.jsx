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

const Chart = ({ report }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="80%" height={500}>
      <LineChart
        data={report}
      >
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="bump" dataKey="capital" stroke={theme.palette.secondary.main} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
