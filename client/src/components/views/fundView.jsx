import { useMemo } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { formatCurrency, getReturnPercent } from '../../utils/investments';

const FUND_HEADERS = [
  'Company',
  'Invested Capital',
  'Total Value',
  'Return'
];

const FundView = ({ portfolioData, filterPeriod }) => {
  const fundRows = useMemo(() => portfolioData.map(({ companyName, investmentRounds }) => {
    let currentInvestment = investmentRounds.at(-1);
    let returnPercent = getReturnPercent(
      currentInvestment,
      investmentRounds,
      filterPeriod
    );

    return {
      companyName,
      investedCapital: currentInvestment.investedCapital,
      totalValue: currentInvestment.totalValue,
      returnPercent
    };
  }), [portfolioData, filterPeriod]);

  return (
    <>
      <TableHead>
        <TableRow>
          { FUND_HEADERS.map((title) => <TableCell key={title}>{title}</TableCell>) }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          fundRows.map(({ companyName, investedCapital, totalValue, returnPercent }) => (
            <TableRow key={companyName}>
              <TableCell>{companyName}</TableCell>
              <TableCell>{formatCurrency(investedCapital)}</TableCell>
              <TableCell>{formatCurrency(totalValue)}</TableCell>
              <TableCell>{`${returnPercent}%`}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </>
  );
};

export default FundView;
