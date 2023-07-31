const moment = require('moment');

function getDateByWeekendMonthYear(weekend, mois, année) {
  const startDate = moment()
    .year(année)
    .month(mois - 1)
    .startOf('month')
    .isoWeekday(1); // Définir le premier jour de la semaine comme lundi

  // Calculer le nombre de semaines entre le premier et le dernier jour du mois
  const numWeeks = getWeeksInMonth(mois, année);

  const semaines = [];
  let débutSemaineCourante = startDate.clone();

  for (let i = 0; i < numWeeks; i++) {
    const finSemaineCourante = débutSemaineCourante.clone().isoWeekday(7); // Définir le dimanche, fin de la semaine
    semaines.push({ début: débutSemaineCourante.toDate(), fin: finSemaineCourante.toDate() });
    débutSemaineCourante.add(1, 'week');
  }

  // Obtenir la semaine spécifique
  const semaine = semaines[Number(weekend) - 1];
  // Obtenir le début de la semaine
  const début = new Date(semaine.début.setHours(0, 0, 0, 0));
  // Obtenir la fin de la semaine
  const fin = new Date(semaine.fin.setHours(23, 59, 59, 999));

  return { début, fin };
}

function getWeeksInMonth(mois, année) {
  const premierJourDuMois = moment({ year: année, month: mois - 1, day: 1 });
  // Obtenir le dernier jour du mois
  const dernierJourDuMois = moment(premierJourDuMois).endOf('month');
  // Calculer le nombre de semaines entre le premier et le dernier jour du mois
  const semainesDansLeMois = dernierJourDuMois.isoWeek() - premierJourDuMois.isoWeek() + 1;
  return semainesDansLeMois;
}

module.exports = { getDateByWeekendMonthYear, getWeeksInMonth };

