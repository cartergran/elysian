// TODO: = (data, dataPoint = 'totalValue')
const toChartData = (data) => {
  let periodMap = new Map();

  Object.entries(data).forEach(([ entityName, investmentRounds ], idx) => {
    investmentRounds.forEach(({ period, totalValue }) => {
      if (!periodMap.has(period)) {
        periodMap.set(period, { period });
      }
      periodMap.get(period)[entityName] = totalValue ;
    });
  });

  return {
    entityNames: Object.keys(data),
    totalValuesByPeriod: Array.from(periodMap.values())
  };
};

const calcTrendPercent = (initialValue, currentValue) => {
  let valueChange = currentValue - initialValue;
  return ((valueChange / initialValue) * 100).toFixed(1);
};

const getTrendPercent = (currentInvestment, investments, selectedFilter) => {
  let isValidFilter = selectedFilter != null && selectedFilter < investments.length;
  let initialInvestment = investments.at(isValidFilter ? -selectedFilter : 0);

  return calcTrendPercent(
    initialInvestment.totalValue,
    currentInvestment.totalValue
  );
};

export {
  toChartData,
  getTrendPercent
};
