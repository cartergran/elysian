import { useMemo } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { getTrendPercent } from '../../utils/investments';

const FUND_HEADERS = [
  'Company',
  'Invested Capital',
  'Total Value',
  'Trend'
];

const FundView = ({ portfolioData, selectedFilter }) => {
  const fundRows = useMemo(() => portfolioData.map(({ company, investmentRounds }) => {
    let currentInvestment = investmentRounds.at(-1);
    let trendPercent = getTrendPercent(
      currentInvestment,
      investmentRounds,
      selectedFilter
    );

    return {
      company,
      investedCapital: currentInvestment.investedCapital,
      totalValue: currentInvestment.totalValue,
      trendPercent
    };
  }), [portfolioData, selectedFilter]);

  return (
    <>
      <TableHead>
        <TableRow>
          { FUND_HEADERS.map((title) => <TableCell key={title}>{title}</TableCell>) }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          fundRows.map(({ company, investedCapital, totalValue, trendPercent }) => (
            <TableRow key={company}>
              <TableCell>{company}</TableCell>
              <TableCell>{investedCapital}</TableCell>
              <TableCell>{totalValue}</TableCell>
              <TableCell>{`${trendPercent}%`}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </>
  );
};

export default FundView;
