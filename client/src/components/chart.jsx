import {
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Chart = ({ report }) => {
  return (
    <ResponsiveContainer width="80%" height={500}>
      <LineChart
        data={report}
      >
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="bump" dataKey="capital" stroke="blue" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
