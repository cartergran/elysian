const calcReturnPercent = (totalValue, investedCapital) => {
  const valueChange = totalValue - investedCapital;
  const pct = (valueChange / investedCapital) * 100;
  return Math.round(pct * 10) / 10;
};

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

const toChartData = (data, dataPoint = 'totalValue') => {
  let periodMap = new Map();

  Object.entries(data).forEach(([ entityName, investmentRounds ]) => {
    investmentRounds.forEach(({ period, ...investmentRound }) => {
      let dataPointValue = investmentRound[dataPoint];

      if (!periodMap.has(period)) {
        periodMap.set(period, { period });
      }
      periodMap.get(period)[entityName] = dataPointValue ;
    });
  });

  const byPeriod = (a, b) => {
    const [ya, qa] = a.period.split('-Q').map(Number);
    const [yb, qb] = b.period.split('-Q').map(Number);
    return ya - yb || qa - qb;
  };

  return {
    entityNames: Object.keys(data),
    dataPointsPerPeriod: Array.from(periodMap.values()).sort(byPeriod)
  };
};

export {
  calcReturnPercent,
  formatCurrency,
  toChartData
};
