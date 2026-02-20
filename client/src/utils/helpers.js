const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens
};

const deslugify = (slug, funds, fundContext = null) => {
  if (fundContext && fundContext.investments) {
    let company = fundContext.investments.find(c => slugify(c.company) === slug);
    if (company) { return company.companyName; }
  }
  let fund = funds.find(f => slugify(f.fundName) === slug);
  if (fund) { return fund.fundName; }
  return null;
};

export {
  slugify,
  deslugify
};
