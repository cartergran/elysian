const requireEnvVariable = (name) => {
  const variable = process.env[name];
  if (!variable) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return variable;
};

const getInvestmentRoundSummary = (payload) => {
  const investmentRoundSummary = payload.investments.reduce((acc, { investmentRound }) => {
    acc.investedCapital += investmentRound.investedCapital;
    acc.realizedValue += investmentRound.realizedValue;
    acc.unrealizedValue += investmentRound.unrealizedValue;
    acc.totalValue += investmentRound.totalValue;
    return acc;
  },
  {
    investedCapital: 0,
    realizedValue: 0,
    unrealizedValue: 0,
    totalValue: 0
  });

  for (const key of Object.keys(investmentRoundSummary)) {
    investmentRoundSummary[key] = Math.round(investmentRoundSummary[key] * 10) / 10;
  }

  return investmentRoundSummary;
};

export {
  getInvestmentRoundSummary,
  requireEnvVariable
};
