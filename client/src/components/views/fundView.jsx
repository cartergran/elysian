import { useMemo } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { getTrendPercent } from '../../utils/investments';

const FUND_HEADERS = ['Company', 'Invested Capital', 'Total Value', 'Trend'];

const FundView = ({ portfolioData, selectedFilter }) => {
  const rows = useMemo(() => portfolioData.map(({ company, investmentRounds }) => {
    let currentInvestment = investmentRounds.at(-1);
    let trendPercent = getTrendPercent(
      currentInvestment,
      investmentRounds,
      selectedFilter
    );

    return (
      <TableRow key={company}>
        <TableCell>{company}</TableCell>
        <TableCell>{currentInvestment.investedCapital}</TableCell>
        <TableCell>{currentInvestment.totalValue}</TableCell>
        <TableCell>{`${trendPercent}%`}</TableCell>
      </TableRow>
    );
  }), [portfolioData, selectedFilter]);

  return (
    <>
      <TableHead>
        { FUND_HEADERS.map((title) => <TableCell key={title}>{title}</TableCell>) }
      </TableHead>
      <TableBody>{rows}</TableBody>
    </>
  );
};

export default FundView;
