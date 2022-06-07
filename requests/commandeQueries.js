const Commande = require("../models/commande.model");

exports.commandeQueries = class{
    static setCommande({produit,employe,quantite,travail_pour,barman,statut_commande}){
       return new Promise(async next =>{

        const commande = await new Commande({
            produit,
            quantite,
            employe,
            travail_pour,
            barman,
            statut_commande

        })

        await commande.save().then(res =>{
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


    static getCommande(){
        return new Promise(async next => {
            Commande.find().then(data => {
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



    static getCommandeById(id) {

        try {
            return new Promise(async next => {
                Commande.findById({ _id: id }).then(data => {
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



    static deleteCommande(data) {

        try {
            return new Promise(async next => {
               
                Commande.findByIdAndDelete({ _id: data }).then(data => {
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