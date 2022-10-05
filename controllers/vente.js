const {venteQueries} = require("../requests/venteQueries");
const {produitQueries} = require("../requests/produitQueries");
const Produits = require("../models/produit.model")
exports.vente = async (req, res) => {

    try {
        sess= req.session.user;

        if(Vente.result !== null ){
            res.json({
                etat:true,
                data: Vente.result
            })
        }else{
            res.json({
                etat : false ,
                data : "erreur"
            })
        }

    } catch (e) {
        res.json({
            etat:false,
            data:"Error"
        })
    }

};

exports.ventePost = async (req, res) => {
    try {
        sess= req.session.user;
        const vente = req.body;
       let Vente={};
        const Produit = await produitQueries.getProduit();
        let rest;
        if(vente !== null ){
            let prod = Produit.result
            prod.forEach(async el =>{
                if(vente.travail_pour == el.session){
    
                  const up = el.quantite - vente.quantite
                  if(up>0){
                      Vente = await venteQueries.setVente(vente);
                      rest = await  Produits.findByIdAndUpdate(el._id,{ quantite: up }, function(err, produit){ 
                    })
                    res.json({
                        etat:true,
                        data: Vente.result,
                        message:"okoko"
                    })
                  }
                  if(up <0 ){
                    res.json({
                        etat : false ,
                        data : " votre stock  pour ce produit est vide",
                    })
                  }
                } 
            })   
        }else{
            res.json({
                etat : false ,
                data : "erreur",
            })
        }

    } catch (e) {
        res.json({
            etat:false,
            data:"Error"
        })
    }

};



