const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { employeQueries } = require('../requests/EmployeQueries');
exports.emdashboard = async (req, res) => {
  try {
    const Vente = await venteQueries.getVentes({
      status_commande: 'En attente',
    });
    let employenum = [];
    let sum = [];
    const newSave = req.session.newSave;

    req.session.newSave = false;

    const produit = await produitQueries.getProduit({
      session: req.session.user.travail_pour,
    });
    const employenumber = await employeQueries.getAllEmploye({
      travail_pour: req.session.user.travail_pour,
    });

    employenumber.result.forEach(async (el) => {
      employenum.push(el);
    });
    const sumvente = await venteQueries.getVentes({
      status_commande: 'Validée',
      travail_pour: req.session.user.travail_pour,
      // travail_pour :"62b444adad125d386cd0e17c"
    });

    sumvente.result.forEach(async (el) => {
      sum.push(el.prix);
    });
    //  console.log("summm",eval(sum.join('+')))

    console.log(JSON.stringify(Vente.result, null, 2), 'ventes');
    if (req.session.user.role === 'Barman') {
      res.render('emdashboard', {
        ventes: Vente.result,
        newSave: newSave,
        user: req.session.user,
        Produit: produit.result,
        emplnum: employenum.length,
        sellsum: eval(sum.join('+')),
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
