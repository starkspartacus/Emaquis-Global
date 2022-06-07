const Barman = require('../models/barman.model');

exports.barmanQueries = class {

    static setBarman(data) {

        return new Promise(async next => {
            const barman = await new Barman({
                nom: data.nom,
                prenom: data.prenom,
                adresse: data.adresse,
                numero: data.numero,
                email: data.email,
                travail_pour: data.travail_pour,
                isAdmin: data.isAdmin,
            });
            await barman.save().then(res => {
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



    static getBarman(data) {
        try {
            return new Promise(async next => {
                Barman.find().then(data => {
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
        } catch (error) {
            console.log(error);
        }
    }


    static getBarmanById(id) {

        try {
            return new Promise(async next => {
                Barman.findById({ _id: id }).then(data => {
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
        } catch (error) {
            console.log(error);
        }

    }
    static deleteBarman(id) {
        return new Promise(async next => {
            await Barman.deleteOne({
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