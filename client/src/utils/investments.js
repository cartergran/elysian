const calcReturnPercent = (totalValue, investedCapital) => {
  let valueChange = totalValue - investedCapital;
  return ((valueChange / investedCapital) * 100).toFixed(1);
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

  return {
    entityNames: Object.keys(data),
    dataPointsPerPeriod: Array.from(periodMap.values())
  };
};

export {
  calcReturnPercent,
  formatCurrency,
  toChartData
};
