const moment = require('moment');

function getDateByWeekendMonthYear(weekend, month, year) {
  const startDate = moment()
    .year(year)
    .month(month - 1)
    .startOf('month')
    .isoWeekday(1); // Set the first day of the week to Monday

  // Calculate the number of weeks between the first and last day of the month
  const numWeeks = getWeeksInMonth(month, year);

  const weeks = [];
  let currentWeekStart = startDate.clone();

  for (let i = 0; i < numWeeks; i++) {
    const currentWeekEnd = currentWeekStart.clone().isoWeekday(7); // Set to Sunday, the end of the week
    weeks.push({ start: currentWeekStart.toDate(), end: currentWeekEnd.toDate() });
    currentWeekStart.add(1, 'week');
  }

  // Get the specific week
  const week = weeks[Number(weekend) - 1];
  // Get the start of the week
  const start = new Date(week.start.setHours(0, 0, 0, 0));
  // Get the end of the week
  const end = new Date(week.end.setHours(23, 59, 59, 999));

  return { start, end };
}

function getWeeksInMonth(month, year) {
  const firstDayOfMonth = moment({ year, month: month - 1, day: 1 });
  // Get the last day of the month
  const lastDayOfMonth = moment(firstDayOfMonth).endOf('month');
  // Calculate the number of weeks between the first and last day of the month
  const weeksInMonth = lastDayOfMonth.isoWeek() - firstDayOfMonth.isoWeek() + 1;
  return weeksInMonth;
}

module.exports = { getDateByWeekendMonthYear, getWeeksInMonth };
