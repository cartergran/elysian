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
  getTrendPercent
};
