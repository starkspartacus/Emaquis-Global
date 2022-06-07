const Role = require('../models/role.model');
const CryptoJS = require("crypto-js");


exports.roleQueries = class {

    static setRole(data) {

        return new Promise(async next => {
            const role = await new Role({
                statut: data.statut,
            });
            await role.save().then(res => {
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

    static getAllRole() {
        return new Promise(async next => {
            Role.find().then(data => {
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


    static getRole(data) {
        return new Promise(async next => {
            Role.findOne({
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



    static deleteRole(id) {
        return new Promise(async next => {
            await Role.deleteOne({
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