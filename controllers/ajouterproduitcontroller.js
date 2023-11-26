const { PRODUCT_SIZE, MARQUES, PAYS } = require('../constants');
const { stockQueries } = require('../requests/StocksQueries');
const { categorieQueries } = require('../requests/categorieQueries');
const { produitQueries } = require('../requests/produitQueries');
const { settingQueries } = require('../requests/settingQueries');
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
      const setting = await settingQueries.getSettingByUserId(
        sess.id || sess._id
      );

      if (Categorie.result !== null) {
        const categories = Categorie.result;

        res.render('ajouterproduit', {
          categories: categories,
          globalProduits: resProduits.result,
          produits: resProduitsBySession.result,
          user: {
            ...sess,
            id: sess.id || sess._id,
            hasStock: setting.result.hasStock,
          },
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
          brands: MARQUES,
          pays: PAYS,
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

      const produit = await produitQueries.getGlobalProduitById(
        req.body.produit
      );

      const setting = await settingQueries.getSettingByUserId(
        session || user.id
      );

      const stock = await stockQueries.getOneStockByQuery({
        produit: req.body.produit,
        categorie: produit.result?.categorie?._id,
        size: req.body.taille,
      });

      if (setting.result.hasStock && !req.body.is_cocktail) {
        if (!stock.result && req.body.quantite > 0) {
          res.status(401).send({
            message: "Le stock n'existe pas",
            success: false,
          });
          return;
        } else if (
          setting.result.hasStock &&
          stock.result?.quantity < req.body.quantite
        ) {
          res.status(401).send({
            message: 'Le stock est insuffisant',
            success: false,
          });
          return;
        }
      }

      const data = {
        produit: req.body.produit,
        prix_vente: parseInt(req.body.prix_vente),
        prix_achat: parseInt(req.body.prix_achat),
        quantite: parseInt(
          ['cardboard', 'locker'].includes(req.body.stockType)
            ? generateQuantityByLocker({
                locker: req.body.quantite,
                size: req.body.taille,
                produit: produit.result,
              })
            : req.body.quantite
        ),
        taille: req.body.taille,
        promo: req.body.promo,
        promo_quantity: parseInt(req.body.promo_quantity) || null,
        promo_price: parseInt(req.body.promo_price) || null,
        session: session,
        historiques: [],
        is_cocktail: req.body.is_cocktail,
      };

      const produit_exist = await produitQueries.getProduitByData({
        produit: data.produit,
        session,
        taille: data.taille,
      });

      let result = null;

      if (
        stock.result &&
        setting.result.hasStock &&
        !produit_exist.result.is_cocktail
      ) {
        await stock.result.updateOne({
          $inc: {
            quantity: -data.quantite,
          },
        });
      }

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

      if (
        produit_exist.etat &&
        produit_exist.result &&
        !produit_exist.result.is_cocktail
      ) {
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
    const setting = await settingQueries.getSettingByUserId(
      sess.id || sess._id
    );

    if (!produit.result) {
      res.redirect('/listeproduit');
      return;
    }

    res.render('ajouterproduit', {
      categories: Categorie.result,
      product: produit.result,
      globalProduits: resProduits.result,
      produits: resProduitsBySession.result,
      user: {
        ...sess,
        id: sess.id || sess._id,
        hasStock: setting.result.hasStock,
      },
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

    const produit = await produitQueries.getGlobalProduitById(req.body.produit);

    const setting = await settingQueries.getSettingByUserId(session || user.id);

    const stock = await stockQueries.getOneStockByQuery({
      produit: req.body.produit,
      categorie: produit.result?.categorie?._id,
      size: req.body.taille,
    });

    if (setting.result.hasStock && !req.body.is_cocktail) {
      if (!stock.result && req.body.quantite > 0) {
        res.status(401).send({
          message: "Le stock n'existe pas",
          success: false,
        });
        return;
      } else if (
        setting.result.hasStock &&
        stock.result?.quantity < req.body.quantite
      ) {
        res.status(401).send({
          message: 'Le stock est insuffisant',
          success: false,
        });
        return;
      }
    }

    // casier passe, mais ça fait en 12 ou 24 ?? ok

    const data = {
      produit: req.body.produit,
      prix_vente: parseInt(req.body.prix_vente),
      prix_achat: parseInt(req.body.prix_achat),
      quantite: parseInt(
        ['cardboard', 'locker'].includes(req.body.stockType)
          ? generateQuantityByLocker({
              locker: req.body.quantite,
              size: req.body.taille,
              produit: produit.result,
              stockType: req.body.stockType,
            })
          : req.body.quantite
      ),
      taille: req.body.taille,
      promo: req.body.promo,
      promo_quantity: parseInt(req.body.promo_quantity) || null,
      promo_price: parseInt(req.body.promo_price) || null,
      session: session,
      historiques: [],
    };

    // ok on fait le test maintenant

    if (stock.result && setting.result.hasStock && !req.body.is_cocktail) {
      await stock.result.updateOne({
        $inc: {
          quantity: -data.quantite,
        },
      });
    }

    const produit_exist = await produitQueries.getProduitByData({
      produit: data.produit,
      session,
      taille: data.taille,
    });

    const newQty = req.body.is_cocktail
      ? 0
      : data.quantite + produit_exist.result.quantite;

    const newHistorique = {
      quantite: newQty,
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
        quantite: newQty,
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
