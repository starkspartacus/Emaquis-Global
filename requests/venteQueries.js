const Vente = require("../models/vente.model");

exports.venteQueries = class{
    static setVente({produit,quantite,employe,travail_pour}){
       return new Promise(async next =>{

        const vente = await new Vente({
            produit,
            quantite,
            employe,
            travail_pour,

        })

        await vente.save().then(res =>{
            next({
                etat:true,
                result:res
            })
        }).catch(err =>{
            next({
                etat:false,
                err:err
            })
        })
       })
    }


    static getVentes(){
        return new Promise(async next => {
            Vente.find().then(data => {
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



    static getVentesById(id) {

        try {
            return new Promise(async next => {
                Vente.findById({ _id: id }).then(data => {
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



    static deleteVente(data) {

        try {
            return new Promise(async next => {
               
                Vente.findByIdAndDelete({ _id: data }).then(data => {
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
    static blindVenteAndOffer(data){
        return new Promise(async next => {
            Vente.findOneAndUpdate({_id:data.fournisseurId},{
                "$set": {
                    "offreappel": data.apelOffreId
                }
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
}