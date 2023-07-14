const { formatTime } = require('./formatTime');

exports.generateYears = () => {
  const currentYear = new Date().getFullYear();
  let years = [2023];

  if (!years.includes(currentYear) && years.at(-1) < currentYear) {
    while (years.at(-1) < currentYear) {
      years.push(years.at(-1) + 1);
    }
  }

  return years;
};

exports.formatDate = (date = new Date(date)) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const key = `${formatTime(month)}/${formatTime(day)}/${year}`;
  return key;
};
