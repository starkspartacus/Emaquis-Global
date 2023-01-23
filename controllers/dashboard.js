const { MONTHS } = require('../constants');
const { employeQueries } = require('../requests/EmployeQueries');
const { produitQueries } = require('../requests/produitQueries');
const { venteQueries } = require('../requests/venteQueries');
const { formatAmount } = require('../utils/formatAmount');
const { formatTime } = require('../utils/formatTime');
const { generateYears, formatDate } = require('../utils/generateYear');
const moment = require('moment');
const { getPercent } = require('../utils/getPercent');

exports.dashboard = async (req, res) => {
  if (req.session.user) {
    let totalemploye;
    res.setHeader('Content-Type', 'text/html');
    const session = req.session.user;
    const userId = session.id;
    try {
      const Employe = await employeQueries.getEmployeByEtablissement(userId);
      const Produit = await produitQueries.getProduitBySession(userId);
      const Vente = await venteQueries.getVentes({
        travail_pour: userId,
        status_commande: 'Validée',
      });

      let employe = Employe.result;
      let prod = Produit.result;
      let vente = Vente.result;
      // ( (nombre final - nombre initial) / nombre initial ) * 100

      let venteByDay = vente.reduce((acc, item) => {
        const date = new Date(item.createdAt);

        const key = formatDate(date);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

      const yesterdayKey = formatDate(
        moment(new Date()).subtract(1, 'days').toDate()
      );
      const toDayKey = formatDate(new Date());

      const yesterday = venteByDay[yesterdayKey] || [];
      const today = venteByDay[toDayKey] || [];

      const yesterdayTotal = yesterday.reduce((acc, item) => {
        return acc + item.prix;
      }, 0);

      const todayTotal = today.reduce((acc, item) => {
        return acc + item.prix;
      }, 0);

      const toDayPercent = getPercent(yesterdayTotal, todayTotal);

      const totalVente = vente.reduce((acc, item) => {
        return acc + item.prix;
      }, 0);

      res.render('dashboard', {
        totalemploye: employe.length,
        Tab: prod,
        totalVente: formatAmount(totalVente),
        venteByDay,
        user: session,
        years: generateYears(),
        months: MONTHS,
        toDayPercent: toDayPercent.toFixed(2),
      });
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};

exports.dashboardPost = async (req, res) => {
  if (req.session.user) {
    res.setHeader('Content-Type', 'text/html');
    try {
      res.render('dashboard', { user: req.session.user });
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }
};
