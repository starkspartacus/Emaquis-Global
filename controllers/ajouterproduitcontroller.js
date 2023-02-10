const { PRODUCT_SIZE } = require('../constants');
const { categorieQueries } = require('../requests/categorieQueries');
const { produitQueries } = require('../requests/produitQueries');

exports.addproduit = async (req, res) => {
  if (req.session.user) {
    try {
      let sess = req.session.user;
      const Categorie = await categorieQueries.getCategorie();
      const resProduits = await produitQueries.getGlobalProduit();
      const resProduitsBySession = await produitQueries.getProduitBySession(
        sess.id || sess.travail_pour
      );

      if (Categorie.result !== null) {
        const categories = Categorie.result;

        res.render('ajouterproduit', {
          categories: categories,
          globalProduits: resProduits.result,
          produits: resProduitsBySession.result,
          user: { ...sess, id: sess.id || sess._id },
          product_sizes: PRODUCT_SIZE,
        });
      }
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.addproduitGlobal = async (req, res) => {
  if (req.session.user) {
    try {
      let sess = req.session.user;
      const Categorie = await categorieQueries.getCategorie();

      if (Categorie.result !== null) {
        const categories = Categorie.result;

        res.render('ajouter_produit_global', {
          categories: categories,
          user: sess,
        });
      }
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.addproduitPost = async (req, res) => {
  if (req.session.user) {
    const session = req.body.session || req.session.user.travail_pour;
    const data = {
      produit: req.body.produit,
      prix_vente: parseInt(req.body.prix_vente),
      prix_achat: parseInt(req.body.prix_achat),
      quantite: parseInt(req.body.quantite),
      taille: req.body.taille,
      session: session,
      historiques: [],
    };

    const produit_exist = await produitQueries.getProduitByData({
      produit: data.produit,
      session,
      taille: data.taille,
    });

    let result = null;

    const newHistorique = {
      quantite: data.quantite,
      prix_vente: data.prix_vente,
      prix_achat: data.prix_achat,
      date: new Date(),
      add_by: `${req.session.user.nom} ${req.session.user.prenom}`,
    };

    if (produit_exist.etat && produit_exist.result) {
      result = await produitQueries.updateProduit(
        { produitId: produit_exist.result._id, session },
        {
          ...data,
          quantite: produit_exist.result.quantite + data.quantite,
          historiques: [...produit_exist.result.historiques, newHistorique],
        }
      );
    } else {
      data.historiques.push(newHistorique);
      result = await produitQueries.setProduit(data);
    }
    res.redirect('/listeproduit');
  }

  const description = req.body.description;
};
