const Employe = require('../models/employe.model');
const CryptoJS = require("crypto-js");


exports.employeQueries = class {

    static setEmploye(data) {

        return new Promise(async next => {
            const employe = await new Employe({
                nom: data.nom,
                prenom: data.prenom,
                role: data.role,
                travail_pour: data.chef_etablissement,
                statut: "Actif",
                email: data.email,
                numero: data.numero,
                adresse: data.adresse,
                password: data.password,
                isAdmin : "false"
            });
            await employe.save().then(res => {
                next({
                    etat: true,
                    result: res
                });
            }).catch(err => {
                next({
                    etat: false,
                    err: err
                });
            })
        })

    }

    static getAllEmploye() {
        return new Promise(async next => {
            Employe.find().then(data => {
                next({
                    etat: true,
                    result: data
                });
            }).catch(err => {
                next({
                    etat: false,
                    err: err
                });
            })
        })
    }


    static getEmploye(data) {
        return new Promise(async next => {
            Employe.findOne({
                email: data.email,
                password: data.password
            }).then(data => {
                next({
                    etat: true,
                    result: data
                });
            }).catch(err => {
                next({
                    etat: false,
                    err: err
                });
            })
        })
    }



    static deleteEmploye(id) {
        return new Promise(async next => {
            await Employe.deleteOne({
                _id: id
            }).then(data => {
                next({
                    etat: true,
                    result: data
                });
            }).catch(rr => {
                next({
                    etat: false,
                    err: rr
                });
            })
        })
    }

};