const { MONTHS } = require('../constants');
const { employeQueries } = require('../requests/EmployeQueries');
const { produitQueries } = require('../requests/produitQueries');
const { venteQueries } = require('../requests/venteQueries');
const { formatAmount } = require('../utils/formatAmount');
const { generateYears, formatDate } = require('../utils/generateYear');
const moment = require('moment');
const { getPercent } = require('../utils/getPercent');
const { settingQueries } = require('../requests/settingQueries');
const {
  getDateByWeekendMonthYear,
  getWeeksInMonth,
} = require('../utils/generateWeekly');

exports.dashboard = async (req, res) => {
  if (req.session.user) {
    // let totalemploye;
    res.setHeader('Content-Type', 'text/html');
    const session = req.session.user;
    const userId = session.id;
    try {
      const Employe = await employeQueries.getEmployeByEtablissement(userId);
      const Produit = await produitQueries.getProduitBySession(userId);

      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      // Définir la date de référence pour le mois

      // Calculez le nombre de semaines entre le premier et le dernier jour du mois
      const weeksInMonth = getWeeksInMonth(month, year);

      const currentDate = moment();

      const currentWeekIndex =
        currentDate.isoWeek() -
        moment(currentDate).startOf('month').isoWeek() +
        1;

      const { start, end } = getDateByWeekendMonthYear(
        currentWeekIndex,
        month + 1,
        year
      );

      const Vente = await venteQueries.getVentes({
        createdAt: { $gte: start, $lte: end },
        travail_pour: userId,
        status_commande: { $in: ['Validée', 'Retour'] },
      });

      const settings = await settingQueries.getSettingByUserId(userId);

      let employe = Employe.result;
      let prod = Produit.result;
      let vente = Vente.result;

      let venteByDay = vente.reduce((acc, item) => {
        const date = new Date(item.createdAt);

        const key = formatDate(date);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

      // afficher l'employe qui a fait le plus de vente

      const venteByEmploye = vente.reduce((acc, item) => {
        const key = item.travail_pour;
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

      const totalVente =
        venteByDay[toDayKey]?.reduce((acc, item) => {
          return acc + item.prix;
        }, 0) || 0;
      
      

      // const toDay = new Date().getDay();
      // const time = new Date().getTime();
      // const previousWeekDay = new Date(
      //   time - ((toDay === 0 ? 7 : toDay) - 1) * 24 * 60 * 60 * 1000
      // );

      const weekKeys = Object.keys(venteByDay).filter((acc) => {
        const date = new Date(acc);
        if (date >= new Date(formatDate(start))) {
          return true;
        } else {
          return false;
        }
      });

      let totalVenteWeek = weekKeys
        .map((key) => {
          return (
            venteByDay[key]?.reduce((acc, item) => {
              return acc + item.prix;
            }, 0) || 0
          );
        })
        .reduce((acc, item) => acc + item, 0);

      const allProductsByDay = venteByDay[toDayKey]?.reduce((acc, item) => {
        let products = [];
        for (let [key, value] of Object.entries(item.produit)) {
          products.push({
            ...value._doc,
            quantite: Number(item.quantite[key] || item.quantite[0]),
          });
        }

        return [...acc, ...products];
      }, []);

      const allProductsByDayGrouped =
        allProductsByDay?.reduce((acc, item) => {
          const productId = item.produit?._id;
          const taille = item.taille;
          const productFind = acc.find(
            (item) => item.produit?._id === productId && item.taille === taille
          );

          let promo_quantity = 0;
          let prix_vente = item.prix_vente * item.quantite;
          if (item.promo) {
            if (item.promo_quantity <= item.quantite) {
              promo_quantity = parseInt(item.quantite / item.promo_quantity);
            }
          }

          if (promo_quantity) {
            prix_vente =
              promo_quantity * item.promo_price +
              (item.quantite % item.promo_quantity) * item.prix_vente;
          }

          if (productFind) {
            productFind.prix_vente += prix_vente;
            productFind.quantite += item.quantite;
          } else {
            acc.push({
              ...item,
              prix_vente,
            });
          }

          return acc;
        }, []) || [];

      const productMostSold = allProductsByDayGrouped?.reduce(
        (acc, item) => {
          if (acc.quantite < item.quantite) {
            return item;
          }
          return acc;
        },
        {
          quantite: 0,
        }
      );

      const objectivePercent =
        (totalVente / (settings?.result.objective || 1)) * 100;

      res.render('dashboard', {
        totalemploye: employe.length,
        Tab: prod,
        totalVente: formatAmount(totalVente),
        venteByDay,
        user: session,
        years: generateYears(),
        months: MONTHS,
        toDayPercent: toDayPercent.toFixed(2),
        objective: settings?.result.objective || 0,
        objectivePercent:
          objectivePercent > 100 ? 100 : objectivePercent.toFixed(2),
        allProductsByDayGrouped,
        productMostSold,
        totalVenteWeek: formatAmount(totalVenteWeek || 0),
        currentWeekIndex,
        weeksInMonth,
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
