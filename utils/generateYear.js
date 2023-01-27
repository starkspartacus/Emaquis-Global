const { formatTime } = require('./formatTime');

exports.generateYears = () => {
  const date = new Date();
  const year = date.getFullYear();
  let years = [];

  for (let i = 0; i < 10; i++) {
    years.push(year + i);
  }

  return years;
};

exports.formatDate = (date = new Date(date)) => {
  console.log('👉 👉 👉  ~ file: generateYear.js:16 ~ date', date);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const key = `${formatTime(month)}/${formatTime(day)}/${year}`;
  return key;
};
