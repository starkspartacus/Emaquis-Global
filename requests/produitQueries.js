const Produit = require('../models/produit.model');
const produitGlobal = require('../models/produitglobal.model');

exports.produitQueries = class {
  static setProduit(data) {
    return new Promise(async (next) => {
      const produit = new Produit({
        produit: data.produit,
        prix_vente: data.prix_vente,
        prix_achat: data.prix_achat,
        quantite: data.quantite,
        taille: data.taille,
        promo: data.promo,
        promo_quantity: data.promo_quantity,
        promo_price: data.promo_price,

        historiques: data.historiques,

        session: data.session,
      });

      await produit
        .save()
        .then((res) => {
          next({
            etat: true,
            result: res,
          });
        })
        .catch((err) => {
          next({
            etat: false,
            err: err,
          });
        });
    });
  }

  static setGlobalProduit(data) {
    return new Promise(async (next) => {
      const produit = new produitGlobal({
        nom_produit: data.nom_produit,
        categorie: data.categorie,
        image: data.image,
      });

      await produit
        .save()
        .then((res) => {
          next({
            etat: true,
            result: res,
          });
        })
        .catch((err) => {
          next({
            etat: false,
            err: err,
          });
        });
    });
  }

  static getGlobalProduit() {
    try {
      return new Promise(async (next) => {
        produitGlobal
          .find()
          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static getProduit() {
    try {
      return new Promise(async (next) => {
        Produit.find()
          .populate({
            path: 'produit',
            populate: {
              path: 'categorie',
            },
          })

          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static getProduitBySession(sessionId) {
    try {
      return new Promise(async (next) => {
        Produit.find({
          session: sessionId,
        })
          .populate({
            path: 'produit',
            populate: {
              path: 'categorie',
            },
          })

          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static getProduitById(id) {
    try {
      return new Promise(async (next) => {
        Produit.findById({ _id: id })
          .populate({
            path: 'produit',
            populate: {
              path: 'categorie',
            },
          })
          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static getProduitByData(data) {
    try {
      return new Promise(async (next) => {
        Produit.findOne(data)
          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static getProduitByUser(id) {
    try {
      return new Promise(async (next) => {
        Produit.findById({ session: id })
          .then((data) => {
            next({
              etat: true,
              result: data,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static deleteProduit(data) {
    try {
      return new Promise(async (next) => {
        Produit.deleteOne(data)
          .then((res) => {
            next({
              etat: true,
              result: res,
            });
          })
          .catch((err) => {
            next({
              etat: false,
              err: err,
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static updateProduit({ produitId, session }, data) {
    return new Promise(async (next) => {
      Produit.updateOne({ _id: produitId, session }, data)
        .then((data) => {
          next({ etat: true, result: data });
        })
        .catch((err) => {
          next({ etat: false, err: err });
        });
    });
  }
};
