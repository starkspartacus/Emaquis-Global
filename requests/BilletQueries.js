const billetModel = require('../models/billet.model');

exports.BilletQueries = class {
  static setBillet(data) {
    return new Promise(async (next) => {
      const billet = new billetModel(data);
      billet
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

  static getBilletByEmployeId(id) {
    return new Promise(async (next) => {
      billetModel
        .findOne({
          employe_id: id,
          is_closed: false,
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

  static getBilletByQuery(query) {
    return new Promise(async (next) => {
      billetModel
        .find(query)
        .sort({
          open_hour: -1,
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

  static updateBilletById(id, data) {
    return new Promise(async (next) => {
      billetModel
        .updateOne({ _id: id }, data)
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
