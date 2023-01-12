exports.generateYears = () => {
  const date = new Date();
  const year = date.getFullYear();
  let years = [];

  for (let i = 0; i < 10; i++) {
    years.push(year + i);
  }

  return years;
};
