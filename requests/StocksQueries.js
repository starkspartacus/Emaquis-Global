const stocksModel = require('../models/stocks');

exports.stockQueries = class {
  static setStock(data) {
    const newData = {
      quantity: data.quantity,
      produit: data.produit,
      user: data.user,
      categorie: data.categorie,
      image: data.image,
      size: data.size,
      travail_pour: data.travail_pour,
    };

    return new Promise(async (next) => {
      const stock = new stocksModel(newData);

      await stock
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

  static updateStock(id, data) {
    const newData = {
      quantity: data.quantity,
      produit: data.produit,
      user: data.user,
      categorie: data.categorie,
      image: data.image,
      size: data.size,
    };

    return new Promise(async (next) => {
      await stocksModel
        .updateOne(
          {
            _id: id,
          },
          {
            $set: newData,
          }
        )
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

  static getOneStockByQuery(query) {
    return new Promise(async (next) => {
      await stocksModel
        .findOne(query)
        .populate('produit')
        .populate('categorie')
        .populate('user')
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

  static getStockBySession(id) {
    return new Promise(async (next) => {
      await stocksModel
        .find({
          travail_pour: id,
        })
        .populate({
          path: 'produit',
          populate: {
            path: 'produit',
          },
        })
        .populate('categorie')
        .populate('user')
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

  static getStocksCountBySession(id) {
    return new Promise(async (next) => {
      await stocksModel
        .find({
          travail_pour: id,
        })
        .countDocuments()
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
};
