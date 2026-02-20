const n = (v) => {
  return Math.round((Number(v) + Number.EPSILON) * 10) / 10;
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
    investmentRoundSummary[key] = n(investmentRoundSummary[key])
  }

  return investmentRoundSummary;
};

const requireEnvVariable = (name) => {
  const variable = process.env[name];
  if (!variable) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return variable;
};

export {
  n,
  getInvestmentRoundSummary,
  requireEnvVariable
};
