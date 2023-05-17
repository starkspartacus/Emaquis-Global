const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { employeQueries } = require('../requests/EmployeQueries');
const categorieModel = require('../models/categorie.model');
const billetModel = require('../models/billet.model');

exports.emdashboard = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/emconnexion');
      return;
    }

    let billet = await billetModel.findOne({
      employe_id: req.session.user._id,
      is_closed: false,
    });

    if (!billet) {
      const billets = await billetModel
        .find({
          employe_id: req.session.user._id,
          is_closed: true,
          close_hour: {
            $gte: new Date(new Date().setHours(0, 0, 0)),
          },
        })
        .sort({
          open_hour: -1,
        });
      if (billets && billets.length > 0) {
        billet = billets[0];
      }
    }

    const Vente = await venteQueries.getVentes({
      status_commande: { $in: ['Validée', 'Retour'] },
      employe_validate_id: req.session.user?._id,
      createdAt: {
        $gte: new Date(new Date(billet?.open_hour)),
        $lte: new Date(),
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

    const ventes = Vente.result?.filter((vente) => {
      return (
        !vente.for_employe ||
        '' + vente.for_employe === '' + req.session.user._id
      );
    });

    const ventesEntente = VenteEntente.result.filter((vente) => {
      return (
        !vente.for_employe ||
        '' + vente.for_employe === '' + req.session.user._id
      );
    });

    const sum = ventes?.reduce((total, vente) => total + vente.prix, 0) || 0;

    if (req.session.user.role === 'Barman') {
      res.render('emdashboard', {
        ventes: ventesEntente,
        newSave: newSave,
        user: req.session.user,
        produits: produit.result,
        emplnum: employes.length || 0,
        sum,
        categories: Categories,
        billet,
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
