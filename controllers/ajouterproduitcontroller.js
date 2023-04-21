const { PRODUCT_SIZE } = require('../constants');
const { categorieQueries } = require('../requests/categorieQueries');
const { produitQueries } = require('../requests/produitQueries');
const {
  generateQuantityByLocker,
} = require('../utils/generateQuantityByLocker');

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
          update: false,
          product: null,
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
  const user = req.session.user;
  try {
    if (user) {
      const session = req.body.session || user.travail_pour;
      const data = {
        produit: req.body.produit,
        prix_vente: parseInt(req.body.prix_vente),
        prix_achat: parseInt(req.body.prix_achat),
        quantite: parseInt(
          req.body.stockType === 'locker'
            ? generateQuantityByLocker(req.body.quantite, req.body.taille)
            : req.body.quantite
        ),
        taille: req.body.taille,
        promo: req.body.promo,
        promo_quantity: parseInt(req.body.promo_quantity) || null,
        promo_price: parseInt(req.body.promo_price) || null,
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
        stockType: req.body.stockType,
        lockerQty: req.body.quantite,
        prix_vente: data.prix_vente,
        prix_achat: data.prix_achat,
        date: new Date(),
        add_by:
          user.nom && user.prenoms
            ? `${user.nom} ${user.prenoms}`
            : user.username,
      };

      if (produit_exist.etat && produit_exist.result) {
        result = await produitQueries.updateProduit(
          { produitId: produit_exist.result._id, session },
          {
            quantite: produit_exist.result.quantite + data.quantite,
            historiques: [...produit_exist.result.historiques, newHistorique],
          }
        );
      } else {
        data.historiques.push(newHistorique);
        result = await produitQueries.setProduit(data);
      }
      res.send(data);
    }
  } catch (error) {
    console.log(
      '👉 👉 👉  ~ file: ajouterproduitcontroller.js:119 ~ error:',
      error
    );
  }
};

exports.editProduit = async (req, res) => {
  if (req.session.user) {
    const produitId = req.query.productId;

    let sess = req.session.user;

    const Categorie = await categorieQueries.getCategorie();
    const resProduits = await produitQueries.getGlobalProduit();
    const resProduitsBySession = await produitQueries.getProduitBySession(
      sess.id || sess.travail_pour
    );

    const produit = await produitQueries.getProduitById(produitId);

    if (!produit.result) {
      res.redirect('/listeproduit');
      return;
    }

    res.render('ajouterproduit', {
      categories: Categorie.result,
      product: produit.result,
      globalProduits: resProduits.result,
      produits: resProduitsBySession.result,
      user: { ...sess, id: sess.id || sess._id },
      product_sizes: PRODUCT_SIZE,
      update: true,
    });
  } else {
    res.redirect('/connexion');
  }
};

exports.editproduitPost = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const session = req.body.session || user.travail_pour;
    const data = {
      produit: req.body.produit,
      prix_vente: parseInt(req.body.prix_vente),
      prix_achat: parseInt(req.body.prix_achat),
      quantite: parseInt(
        req.body.stockType === 'locker'
          ? generateQuantityByLocker(req.body.quantite, req.body.taille)
          : req.body.quantite
      ),
      taille: req.body.taille,
      promo: req.body.promo,
      promo_quantity: parseInt(req.body.promo_quantity) || null,
      promo_price: parseInt(req.body.promo_price) || null,
      session: session,
      historiques: [],
    };

    const produit_exist = await produitQueries.getProduitByData({
      produit: data.produit,
      session,
      taille: data.taille,
    });

    const newHistorique = {
      quantite: data.quantite,
      stockType: req.body.stockType,
      lockerQty: req.body.quantite,
      prix_vente: data.prix_vente,
      prix_achat: data.prix_achat,
      prev_quantite: produit_exist.result.quantite,
      date: new Date(),
      add_by:
        user.nom && user.prenoms
          ? `${user.nom} ${user.prenoms}`
          : user.username,
      update: true,
    };

    let result = await produitQueries.updateProduit(
      { produitId: req.body.productId, session },
      {
        ...data,
        quantite: data.quantite,
        historiques: [...produit_exist.result.historiques, newHistorique],
      }
    );

    if (result.etat) {
      res.json(data);
    } else {
      res.status(500).json({
        etat: false,
        message: "Une erreur s'est produite lors de la mise à jour du produit",
      });
    }
  }
};

exports.deleteProduit = async (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    const produitId = req.params.productId;
    const session = user.id || req.session.user.travail_pour;
    const result = await produitQueries.deleteProduit({
      _id: produitId,
      session,
    });
    res.json(result);
  } else {
    res.redirect('/connexion');
  }
};
