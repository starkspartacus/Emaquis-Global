const { MONTHS } = require('../constants');
const { employeQueries } = require('../requests/EmployeQueries');
const { produitQueries } = require('../requests/produitQueries');
const { venteQueries } = require('../requests/venteQueries');
const { formatAmount } = require('../utils/formatAmount');
const { formatTime } = require('../utils/formatTime');
const { generateYears } = require('../utils/generateYear');
exports.dashboard = async (req, res) => {
  if (req.session.user) {
    let totalemploye;
    res.setHeader('Content-Type', 'text/html');
    const session = req.session.user;
    const userId = session.id;
    try {
      const Employe = await employeQueries.getEmployeByEtablissement(userId);
      console.log('👉 👉 👉  ~ file: dashboard.js:12 ~ Employe', Employe);
      const Produit = await produitQueries.getProduitBySession(userId);
      console.log('👉 👉 👉  ~ file: dashboard.js:13 ~ Produit', Produit);
      const Vente = await venteQueries.getVentes({
        travail_pour: userId,
        status_commande: 'Validée',
      });
      console.log('👉 👉 👉  ~ file: dashboard.js:16 ~ Vente', Vente);

      let employe = Employe.result;
      let prod = Produit.result;
      let vente = Vente.result;

      let venteByDay = vente.reduce((acc, item) => {
        const date = new Date(item.createdAt);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${formatTime(month)}/${formatTime(day)}/${year}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

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
