const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { employeQueries } = require('../requests/EmployeQueries');
const categorieModel = require('../models/categorie.model');
const { BilletQueries } = require('../requests/BilletQueries');
const { settingQueries } = require('../requests/settingQueries');

exports.emdashboard = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/emconnexion');
      return;
    }

    let billet = await BilletQueries.getBilletByEmployeId(req.session.user._id);

    if (!billet.result) {
      const billets = await BilletQueries.getBilletByQuery({
        employe_id: req.session.user._id,
        is_closed: true,
        close_hour: {
          $gte: new Date(new Date().setHours(0, 0, 0)),
        },
      });
      if (billets && billets.result.length > 0) {
        billet = billets.result[0];
      } else {
        billet = null;
      }
    } else {
      billet = billet.result;
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

    const parentSetting = await settingQueries.getSettingByUserId(
      req.session.user.travail_pour
    );

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
      const { password, ...data } = req.session.user;
      res.render('emdashboard', {
        ventes: ventesEntente,
        newSave: newSave,
        user: {
          ...data,
          product_return_type: parentSetting?.result?.product_return_type,
        },
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
