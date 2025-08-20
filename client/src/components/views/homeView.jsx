import { useMemo } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { getTrendPercent, formatCurrency } from '../../utils/investments';

const HOME_HEADERS = [
  'Fund',
  'Invested Capital',
  'Realized Value',
  'Unrealized Value',
  'Total Value',
  'Gross IRR',
  'Trend'
];

const HomeView = ({ portfolioData, selectedFilter }) => {

  const rows = useMemo(() => portfolioData.map(({ fundName, investmentRoundsSummary }) => {
    let currentInvestment = investmentRoundsSummary.at(-1);
    let trendPercent = getTrendPercent(
      currentInvestment,
      investmentRoundsSummary,
      selectedFilter
    );

    return (
      <TableRow key={fundName} hover>
        <TableCell>{fundName}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.investedCapital)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.realizedValue)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.unrealizedValue)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.totalValue)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.grossIRR)}</TableCell>
        <TableCell>{`${trendPercent}%`}</TableCell>
      </TableRow>
    );
  }), [portfolioData, selectedFilter]);

  return (
    <>
      <TableHead>
        <TableRow>
          { HOME_HEADERS.map((title) => <TableCell key={title}>{title}</TableCell>) }
        </TableRow>
      </TableHead>
      <TableBody>{rows}</TableBody>
    </>
  );
};

export default HomeView;
