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

const calcReturnPercent = (initialValue, currentValue) => {
  let valueChange = currentValue - initialValue;
  return ((valueChange / initialValue) * 100).toFixed(1);
};

const getReturnPercent = (currentInvestment, investments, filterPeriod) => {
  let initialIdx = filterPeriod + 1;
  let isValidIdx = initialIdx < investments.length;
  let initialInvestment = investments.at(isValidIdx ? -initialIdx : 0);

  return calcReturnPercent(
    initialInvestment.totalValue,
    currentInvestment.totalValue
  );
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

export {
  toChartData,
  getReturnPercent,
  formatCurrency
};
