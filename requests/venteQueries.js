const Vente = require('../models/vente.model');

exports.venteQueries = class {
  static setVente(data) {
    return new Promise(async (next) => {
      const vente = new Vente(data);

      await vente
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

  static getVente() {
    return new Promise(async (next) => {
      Vente.find()
        .populate({
          path: 'produit',
          populate: {
            path: 'produit',
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
  }

  static getVentes(query) {
    return new Promise(async (next) => {
      Vente.find(query)
        .populate([
          {
            path: 'produit',
            populate: {
              path: 'produit',
              populate: {
                path: 'categorie',
              },
            },
          },
          {
            path: 'employe',
            select: 'nom prenom',
          },
        ])
        .sort('-_id')
        .then((ventes) => {
          next({
            success: true,
            result: ventes,
          });
        })
        .catch((err) => {
          next({
            success: false,
            err: err,
          });
        });
    });
  }

  static getVentesById(id) {
    try {
      return new Promise(async (next) => {
        Vente.findById({ _id: id })
          .populate([
            {
              path: 'produit',
              populate: {
                path: 'produit',
                populate: {
                  path: 'categorie',
                },
              },
            },
            {
              path: 'employe',
              select: 'nom prenom',
            },
          ])
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

  static deleteVente(data) {
    try {
      return new Promise(async (next) => {
        Vente.findByIdAndDelete({ _id: data })
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
  static blindVenteAndOffer(data) {
    return new Promise(async (next) => {
      Vente.findOneAndUpdate(
        { _id: data.fournisseurId },
        {
          $set: {
            offreappel: data.apelOffreId,
          },
        }
      )
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
  }
};
