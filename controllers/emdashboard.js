const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { employeQueries } = require('../requests/EmployeQueries');
const { formatAmount } = require('../utils/formatAmount');
const categorieModel = require('../models/categorie.model');

exports.emdashboard = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/emconnexion');
      return;
    }

    const Vente = await venteQueries.getVentes({
      status_commande: { $in: ['Validée', 'Retour'] },
      employe_validate_id: req.session.user?._id,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      travail_pour: req.session?.user?.travail_pour,
    });

    const VenteEntente = await venteQueries.getVentes({
      status_commande: 'En attente',
      travail_pour: req.session?.user?.travail_pour,
    });

    const Categories = await categorieModel.find({});

    const newSave = req.session.newSave;

    req.session.newSave = false;

    const produit = await produitQueries.getProduitBySession(
      req.session.user.travail_pour
    );
    const employes = await employeQueries.getEmployeByEtablissement(
      req.session.user.travail_pour
    );

    const sum = Vente.result.reduce((total, vente) => total + vente.prix, 0);

    if (req.session.user.role === 'Barman') {
      res.render('emdashboard', {
        ventes: VenteEntente.result,
        newSave: newSave,
        user: req.session.user,
        // Produit: produit.result,
        produits: produit.result,
        emplnum: employes.length || 0,
        sum,
        categories: Categories,
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
