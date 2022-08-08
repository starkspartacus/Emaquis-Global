const { venteQueries } = require("../requests/venteQueries");
const { produitQueries } = require("../requests/produitQueries");
const { retourQueries } = require("../requests/retourQueries");
const Produits = require("../models/produit.model");
const Ventes = require("../models/vente.model");
const Retours = require("../models/retourproduit.model");
exports.vente = async (req, res) => {
    try {
        sess = req.session.user;

        if (Vente.result !== null) {
            res.json({
                etat: true,
                data: Vente.result,
            });
        } else {
            res.json({
                etat: false,
                data: "erreur",
            });
        }
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};

exports.ventePost = async (req, res) => {
    try {
        sess = req.session.user;
        const vente = req.body;
        let Vente = {};
        const Produit = await produitQueries.getProduit();
        let rest;
        let uniq;

        let resultqte = [];
        let prize = [];
        let qte = vente.quantite;
        let multArray = [];
        let sum = 0;
        if (vente !== null) {
            let prod = Produit.result;
            prod.forEach(async (el) => {
                if (vente.travail_pour == el.session) {
                    for (let i = 0; i < vente.produit.length; i++) {
                        if (vente.produit[i] == el._id) {
                            resultqte.push(el.quantite);
                        }
                    }
                }
                prize.push(el.prix_vente);
            });
            for (let i = 0; i < Math.min(vente.quantite.length, prize.length); i++) {
                sum += vente.quantite[i] * prize[i];
            }
            let mory = {
                produit: vente.produit,
                quantite: vente.quantite,
                employe: vente.employe,
                travail_pour: vente.travail_pour,
                prix: sum,
            };
            Vente = await venteQueries.setVente(mory);
            vente.produit.forEach((produit_id, index) => {
                console.log(
                    produit_id,
                    index,
                    vente.quantite[index],
                    vente.travail_pour
                );
                Produits.updateOne(
                    { session: vente.travail_pour, _id: produit_id },
                    { $inc: { quantite: - vente.quantite[index] } },
                    { new: true },
                    (err, data) => {
                        if (err) {
                            console.log("error update", err);
                            return;
                        }
                        console.log("produit update => data", data);
                    }
                );
            });
            console.log(resultqte);
            console.log(vente.quantite);
        } else {
            res.json({
                etat: false,
                data: "erreur",
            });
        }
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};


exports.editventePost = async (req, res) => {
    try {
        const vente = req.body;
        const Produit = await produitQueries.getProduit();
        let rebour = 0;
        let resultqte = [];
        let prize = [];
        let Retourproduit = {};

        let lastprize;
        if (vente !== null) {
            let prod = Produit.result;
            prod.forEach(async (el) => {
                if (vente.travail_pour == el.session) {
                    for (let i = 0; i < vente.produit.length; i++) {
                        if (vente.produit[i] == el._id) {
                            resultqte.push(el.quantite);
                          
                        }
                    }
                }
                prize.push(el.prix_vente);
            });
            for (let i = 0; i < Math.min(vente.quantite.length, prize.length); i++) {
                rebour += vente.quantite[i] * prize[i];
            }
          
            let mory = {
                produit: vente.produit,
                quantite: vente.quantite,
                employe: vente.employe,
                travail_pour: vente.travail_pour,
                remboursement: rebour,
            };
            
            Retourproduit = await retourQueries.setRetour(mory);
            vente.produit.forEach((produit_id, index) => {
                console.log(
                    produit_id,
                    index,
                    vente.quantite[index],
                    vente.travail_pour
                );
                Produits.updateOne(
                    { session: vente.travail_pour, _id: produit_id },
                    { $inc: { quantite: + vente.quantite[index] } },
                    { new: true },
                    (err, data) => {
                        if (err) {
                            console.log("error update", err);
                            return;
                        }
                        console.log("produit update => data", data);
                       
                    }
                );
            });
        }
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};

exports.venteListe = async (req, res) => {
    try {
        const maquisID = req.body.id;
        const maquiSell = await Ventes.find({ travail_pour: maquisID });
        res.json({
            etat: true,
            historique_vente: maquiSell,
        });
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};


exports.retourListe = async (req, res) => {
    try {
        const maquisID = req.body.id;
        const maquiback = await Retours.find({ travail_pour: maquisID });
        res.json({
            etat: true,
            historique_retour: maquiback,
        });
    } catch (e) {
        res.json({
            etat: false,
            data: "Error",
        });
    }
};

