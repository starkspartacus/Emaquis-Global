const Fournisseur = require("../models/fournisseur.model");

exports.fournisseurQueries = class{
    static setFournisseur(data){
       return new Promise(async next =>{

        const fournisseur = await new Fournisseur({
            nom:data.nom,
            adresse:data.adresse,
            numero:data.numero,
            email:data.email,
            travail_pour:data.travail_pour,
            produit:data.produit,
            isAdmin:"false"
        })

        await fournisseur.save().then(res =>{
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


    static getFournisseurs(){
        return new Promise(async next => {
            Fournisseur.find().then(data => {
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



    static getFournisseursById(id) {

        try {
            return new Promise(async next => {
                Fournisseur.findById({ _id: id }).then(data => {
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
    static blindFournisseurAndOffer(data){
        return new Promise(async next => {
            Fournisseur.findOneAndUpdate({_id:data.fournisseurId},{
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


    static deleteFournisseur(data) {

        try {
            return new Promise(async next => {
               
                Fournisseur.findByIdAndDelete({ _id: data }).then(data => {
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
}