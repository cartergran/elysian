import { useMemo } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { formatCurrency, getTrendPercent } from '../../utils/investments';

const FUND_HEADERS = [
  'Company',
  'Invested Capital',
  'Total Value',
  'Return'
];

const FundView = ({ portfolioData, filteredPeriod }) => {
  const fundRows = useMemo(() => portfolioData.map(({ companyName, investmentRounds }) => {
    let currentInvestment = investmentRounds.at(-1);
    let trendPercent = getTrendPercent(
      currentInvestment,
      investmentRounds,
      filteredPeriod
    );

    return {
      companyName,
      investedCapital: currentInvestment.investedCapital,
      totalValue: currentInvestment.totalValue,
      trendPercent
    };
  }), [portfolioData, filteredPeriod]);

  return (
    <>
      <TableHead>
        <TableRow>
          { FUND_HEADERS.map((title) => <TableCell key={title}>{title}</TableCell>) }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          fundRows.map(({ companyName, investedCapital, totalValue, trendPercent }) => (
            <TableRow key={companyName}>
              <TableCell>{companyName}</TableCell>
              <TableCell>{formatCurrency(investedCapital)}</TableCell>
              <TableCell>{formatCurrency(totalValue)}</TableCell>
              <TableCell>{`${trendPercent}%`}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </>
  );
};

export default FundView;
