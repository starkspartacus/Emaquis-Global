const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { employeQueries } = require('../requests/EmployeQueries');
const { formatAmount } = require('../utils/formatAmount');
exports.emdashboard = async (req, res) => {
  try {
    const Vente = await venteQueries.getVentes({
      status_commande: 'En attente',
      travail_pour: req.session.user.travail_pour,
    });
    const newSave = req.session.newSave;

    req.session.newSave = false;

    const produit = await produitQueries.getProduit({
      session: req.session.user.travail_pour,
    });
    const employes = await employeQueries.getAllEmploye({
      travail_pour: req.session.user.travail_pour,
      deleted: false,
    });

    const sum = Vente.result.reduce((total, vente) => total + vente.prix, 0);

    console.log(JSON.stringify(Vente.result, null, 2), 'ventes');
    if (req.session.user.role === 'Barman') {
      res.render('emdashboard', {
        ventes: Vente.result,
        newSave: newSave,
        user: req.session.user,
        Produit: produit.result,
        emplnum: employes.length,
        sum: formatAmount(sum),
      });
    } else {
      res.redirect('/emconnexion');
    }
  } catch (e) {
    console.log('err', e);
  }
};

exports.emdashboardPost = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  try {
    res.render('emdashboard');
  } catch (e) {
    console.log('err', e);
    res.redirect(e);
  }
};
