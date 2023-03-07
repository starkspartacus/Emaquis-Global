const Paiement = require('../models/paiement.model')
const CryptoJS = require("crypto-js");


exports.paiementQueries = class {

    static setPaiement(data) {

        return new Promise(async next => {
            const paiement =  new Paiement({
                user: data.user,
                montant: data.montant,
            });
            await paiement.save().then(res => {
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

    static getAllPaiement() {
        return new Promise(async next => {
            Paiement.find().then(data => {
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


    static getPaiement(data) {
        return new Promise(async next => {
            Paiement.findOne({
                user: data.user,
                montant: data.montant
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



    static deletePaiement(id) {
        return new Promise(async next => {
            await Paiement.deleteOne({
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