const stocksModelImg = require('../models/stocks-img.model');

exports.stockImgQueries = class {
  static setStock(data) {
    const newData = {
      produit: data.produit,
      categorie: data.categorie,
      image: data.image,
      size: data.size,
      stockType: data.stockType,
    };

    return new Promise(async (next) => {
      const stock = new stocksModelImg(newData);

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

  static getStockImgs() {
    return new Promise(async (next) => {
      await stocksModelImg
        .find()
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
