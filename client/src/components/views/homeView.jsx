import { useMemo } from 'react';
import {
  Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { formatCurrency, getReturnPercent } from '../../utils/investments';

const HOME_HEADERS = [
  'Fund',
  'Invested Capital',
  'Realized Value',
  'Unrealized Value',
  'Total Value',
  'Gross IRR',
  'Return'
];

const HomeView = ({ portfolioData, filterPeriod, onSelectedFund }) => {

  const rows = useMemo(() => portfolioData.map(({ fundName, investmentRoundsSummary }) => {
    let currentInvestment = investmentRoundsSummary.at(-1);
    let returnPercent = getReturnPercent(
      currentInvestment,
      investmentRoundsSummary,
      filterPeriod
    );

    return (
      <TableRow key={fundName}>
        <TableCell>
          <Link component="button" underline="hover" onClick={() => onSelectedFund(fundName)}>
            {fundName}
          </Link>
        </TableCell>
        <TableCell>{formatCurrency(currentInvestment.investedCapital)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.realizedValue)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.unrealizedValue)}</TableCell>
        <TableCell>{formatCurrency(currentInvestment.totalValue)}</TableCell>
        <TableCell>{`${currentInvestment.grossIRR}%`}</TableCell>
        <TableCell>{`${returnPercent}%`}</TableCell>
      </TableRow>
    );
  }), [portfolioData, filterPeriod]);

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
