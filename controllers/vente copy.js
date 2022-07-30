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
            // console.log(vente)
            prod.forEach(async el =>{
                if(vente.travail_pour == el.session && vente.produit == el._id){
    
                  const up = el.quantite - vente.quantite
                 
                  
                  if(  up>0 ){
                      Vente = await venteQueries.setVente(vente);
                      rest = await  Produits.findByIdAndUpdate(el._id,{ quantite: up }, function(err, produit){ 
                    })
                    console.log(rest);
                    console.log(Vente);
                    res.send({
                        etat:true,
                        data: Vente.result,
                    })
              
                   }else if(  up==0 ){
                    Vente = await venteQueries.setVente(vente);
                    rest = await  Produits.findByIdAndUpdate(el._id,{ quantite: up }, function(err, produit){ 
                  })
                  console.log(rest);
                  console.log(Vente);
                  res.send({
                      etat:true,
                      data: Vente.result,
                  })
            
                 }else if(up <0 ){
                    res.send({
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



