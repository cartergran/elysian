import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

// TODO
const fundHeaders = [''];
const companyHeaders = ['Company', 'Invested Capital', 'Total Value', 'Trend'];

const calcTrendPercent = (initialValue, currentValue) => {
  if (!initialValue || isNaN(initialValue)) { return 0; }
  let valueChange = currentValue - initialValue;
  return ((valueChange / initialValue) * 100).toFixed(1);
};

const getCompanyView = (portfolioData, selectedFilter) => {
  let companyView = portfolioData.map(({ company, investmentRounds }) => {
    let isValidFilter =
      selectedFilter != null && Math.abs(selectedFilter) <= investmentRounds.length;
    let initialInvestment = investmentRounds.at(isValidFilter ? -selectedFilter : 0);
    let currentInvestment = investmentRounds.at(-1);
    let trendPercent = calcTrendPercent(
      initialInvestment.totalValue,
      currentInvestment.totalValue
    );

    return (
      <TableRow key={company}>
        <TableCell>{company}</TableCell>
        <TableCell>{currentInvestment.investedCapital}</TableCell>
        <TableCell>{currentInvestment.totalValue}</TableCell>
        <TableCell>{`${trendPercent}%`}</TableCell>
      </TableRow>
    );
  });

  return companyView;
};

const views = [getCompanyView];

const Portfolio = ({ view, portfolioData, selectedFund, selectedFilter, onFundChange }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {
              companyHeaders.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          { views[view](portfolioData, selectedFilter) }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
