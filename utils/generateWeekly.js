const moment = require('moment');

function getDateByWeekendMonthYear(weekend, month, year) {
  const startDate = moment()
    .year(year)
    .month(month - 1)
    .startOf('month');
  const endDate = startDate.clone().endOf('month');

  const numWeeks = endDate.diff(startDate, 'weeks') + 1;

  const weeks = [];
  let currentWeekStart = startDate.clone().startOf('week');

  for (let i = 0; i < numWeeks; i++) {
    const currentWeekEnd = currentWeekStart.clone().endOf('week');
    weeks.push({ start: currentWeekStart, end: currentWeekEnd });
    currentWeekStart = currentWeekEnd.clone().add(1, 'day');
  }

  // Obtenir la semaine spécifique
  const week = weeks[Number(weekend) - 1];

  // Obtenir le premier jour de la semaine

  const start = new Date(week.start.toDate().setHours(0, 0, 0, 0));

  // Obtenir le dernier jour de la semaine

  const end = week.end.toDate();

  return { start, end };
}

module.exports = { getDateByWeekendMonthYear };
