const Employe = require('../models/employe.model');
const CryptoJS = require('crypto-js');
var bcrypt = require('bcryptjs');

exports.employeQueries = class {
  static setEmploye(data) {
    return new Promise(async (next) => {
      const encryptedPassword = await bcrypt.hash(data.password, 10);

      const employe = await new Employe({
        nom: data.nom,
        prenom: data.prenom,
        role: data.role,
        travail_pour: data.chef_etablissement,
        statut: 'Actif',
        // email: data.email,
        numero: data.numero,
        adresse: data.adresse,
        password: encryptedPassword,
        isAdmin: 'false',
      });
      await employe
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

  static getEmployeByEmail(email) {
    return new Promise(async (next) => {
      await Employe.findOne({
        email: email,
        deleted: false,
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

  static getEmployeByNumber(numero) {
    return new Promise(async (next) => {
      await Employe.findOne({
        numero: numero,
        deleted: false,
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

  static getEmployeById(id) {
    return new Promise(async (next) => {
      await Employe.findOne({
        _id: id,
        deleted: false,
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

  static getAllEmploye() {
    return new Promise(async (next) => {
      Employe.find({
        deleted: false,
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

  static getEmployeByEtablissement(id) {
    return new Promise(async (next) => {
      Employe.find({
        travail_pour: id,
        deleted: false,
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

  static deleteEmploye(id) {
    return new Promise(async (next) => {
      await Employe.updateOne(
        {
          _id: id,
        },
        {
          deleted: true,
        }
      )
        .then((data) => {
          next({
            etat: true,
            result: data,
          });
        })
        .catch((rr) => {
          next({
            etat: false,
            err: rr,
          });
        });
    });
  }

  static updateEmploye(id, data) {
    const updateData = {
      nom: data.nom,
      prenom: data.prenom,
      role: data.role,
      email: data.email,
      numero: data.numero,
      adresse: data.adresse,
    };

    if (data.password) {
      updateData.password = bcrypt.hashSync(data.password, 10);
    }

    return new Promise((next) => {
      Employe.updateOne(
        {
          _id: id,
        },
        {
          $set: updateData,
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

  static getBarmans(travail_pour) {
    return new Promise(async (next) => {
      await Employe.find({
        travail_pour: travail_pour,
        role: 'Barman',
        deleted: false,
      })
        .select('_id nom prenom travail_pour')
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
