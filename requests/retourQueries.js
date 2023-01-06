const Retour = require("../models/retourproduit.model");

exports.retourQueries = class {
  static setRetour(data) {
    return new Promise(async (next) => {
      const rembrousement = new Retour(data);

      await rembrousement
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

  static getRetour(reqData) {
    return new Promise(async (next) => {
      Retour.find(reqData)
        .populate({
          path: 'produit',
          populate: {
            path: 'produit',
          },
        })
        .sort({ _id: -1 })
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

  static getRetourById(id) {
    try {
      return new Promise(async (next) => {
        Retour.findById({ _id: id })
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

  static deleteRetour(data) {
    try {
      return new Promise(async (next) => {
        Retour.findByIdAndDelete({ _id: data })
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
  static blindRetourAndOffer(data) {
    return new Promise(async (next) => {
      Retour.findOneAndUpdate(
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
