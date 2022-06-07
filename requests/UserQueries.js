const User = require('../models/user.model');
const CryptoJS = require("crypto-js");
var bcrypt = require('bcryptjs');



exports.userQueries = class {

    static setUser(data) {
        return new Promise(async next => {
            const   encryptedPassword =  await bcrypt.hash(data.password, 10);

            const user = await new User({
                username: data.username,
                nom_etablissement: data.nom_etablissement,
                email: data.email,
                adresse: data.adresse,
                numero: data.numero,
                password: encryptedPassword,
                isAdmin : "false"
            });
            await user.save().then(res => {
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

    static getAllUSers() {
        return new Promise(async next => {
            User.find().then(data => {
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


    static getUser(data) {
        return new Promise(async next => {
            User.findOne({
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



    static deleteUser(id) {
        return new Promise(async next => {
            await User.deleteOne({
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