const COLUMN_LABELS = {
  totalValue: 'Total Value',
  investedCapital: 'Invested Capital',
  realizedValue: 'Realized Value',
  unrealizedValue: 'Unrealized Value',
  returnPercent: 'Return'
};

const pick = (obj, keys) => Object.fromEntries(keys.map(k => [k, obj[k]]));

const COLUMN_HEADERS_BY_DATA_POINT = {
  HOME: COLUMN_LABELS,
  FUND: COLUMN_LABELS
};

const FILTER_COLUMN_KEYS = {
  HOME: ['totalValue', 'investedCapital', 'realizedValue', 'unrealizedValue'],
  FUND: ['totalValue', 'investedCapital', 'realizedValue', 'unrealizedValue']
};

const FILTER_COLUMN_HEADERS = {
  HOME: Object.values(pick(COLUMN_LABELS, FILTER_COLUMN_KEYS.HOME)),
  FUND: Object.values(pick(COLUMN_LABELS, FILTER_COLUMN_KEYS.FUND))
};

const DEFAULT_SELECTED_COLUMN = {
  idx: 0,
  title: COLUMN_LABELS.totalValue,
  dataPoint: 'totalValue'
};

const DEFAULT_SORT_COLUMN = 'totalValue';

const SELECTABLE_COLUMN_HEADERS = {
  HOME: 'Fund',
  FUND: 'Company'
};

export {
  COLUMN_HEADERS_BY_DATA_POINT,
  DEFAULT_SELECTED_COLUMN,
  DEFAULT_SORT_COLUMN,
  FILTER_COLUMN_HEADERS,
  SELECTABLE_COLUMN_HEADERS
};
