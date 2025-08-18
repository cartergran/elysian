// TODO: = (data, dataPoint = 'totalValue')
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
    [`${dataPoint}ByPeriod`]: Array.from(periodMap.values())
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
