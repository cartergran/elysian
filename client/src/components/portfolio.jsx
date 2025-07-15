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

const Portfolio = ({ report }) => {
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
            {
              report.map(({ company, investmentRounds }) => {
                let currentInvestment = investmentRounds.at(-1);

                return (
                  <TableRow key={company}>
                      <TableCell>{company}</TableCell>
                      <TableCell>{currentInvestment.investedCapital}</TableCell>
                      <TableCell>{currentInvestment.totalValue}</TableCell>
                      <TableCell>{`${currentInvestment.trend}%`}</TableCell>
                  </TableRow>
                );
              })
            }
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default Portfolio;
