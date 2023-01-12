const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { retourQueries } = require('../requests/retourQueries');
const Produits = require('../models/produit.model');
const Ventes = require('../models/vente.model');
const Retours = require('../models/retourproduit.model');
exports.vente = async (req, res) => {
  try {
    const productRes = await produitQueries.getProduit();

    res.render('vente', {
      produits: productRes.result || [],
    });
  } catch (error) {
    res.redirect(error);
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
        status_commande: 'En attente',
        prix: sum,
        somme_encaisse: vente.somme_encaisse,
        monnaie: vente.somme_encaisse - sum,
      };
      console.log('👉 👉 👉  ~ file: vente.js ~ line 58 ~ mory', mory);
      // il fait pas l setvente or il fait update  de produit
      Vente = await venteQueries.setVente(mory);
      vente.produit.forEach((produit_id, index) => {
        Produits.updateOne(
          { session: vente.travail_pour, _id: produit_id },
          { $inc: { quantite: -vente.quantite[index] } },
          { new: true },
          (err, data) => {
            console.log('👉 👉 👉  ~ file: vente.js ~ line 65 ~ data', data);
            if (err) {
              console.log('error update', err);
              return;
            }
          }
        );
      });

      res.json({
        etat: true,
        data: vente,
      });
    } else {
      console.log('iiiiicccciiiiii');
      res.json({
        etat: false,
        data: 'erreur',
      });
    }
  } catch (e) {
    console.log('👉 👉 👉  ~ file: vente.js ~ line 105 ~ e', e);
    res.json({
      etat: false,
      data: 'Error',
    });
  }
};

exports.editventePost = async (req, res) => {
  try {
    const vente = req.body;
    console.log('👉 👉 👉  ~ file: vente.js ~ line 98 ~ vente', vente);
    const Produit = await produitQueries.getProduit();
    let rebour = 0;
    let resultqte = [];
    let prize = [];
    let Retourproduit = {};

    /// 1- remboursement total(on rembourse tout)(on recalcul le prix de vente avec le stock)
    //  2- remboursement partiel(on rembourse partiellement)(on deduire la somme dans la caisse)
    //  3- remboursement par avoir(ces boisons devienne directement des pourboires)

    // let lastprize;
    // if (vente !== null) {
    //   let prod = Produit.result;
    //   prod.forEach(async (el) => {
    //     if (vente.travail_pour == el.session) {
    //       for (let i = 0; i < vente.produit.length; i++) {
    //         if (vente.produit[i] == el._id) {
    //           resultqte.push(el.quantite);
    //         }
    //       }
    //     }
    //     prize.push(el.prix_vente);
    //   });
    //   for (let i = 0; i < Math.min(vente.quantite.length, prize.length); i++) {
    //     rebour += vente.quantite[i] * prize[i];
    //   }

    //   let mory = {
    //     produit: vente.produit,
    //     quantite: vente.quantite,
    //     employe: vente.employe,
    //     travail_pour: vente.travail_pour,
    //     remboursement: rebour,
    //   };

    //   Retourproduit = await retourQueries.setRetour(mory);
    //   vente.produit.forEach((produit_id, index) => {
    //     Produits.updateOne(
    //       { session: vente.travail_pour, _id: produit_id },
    //       { $inc: { quantite: +vente.quantite[index] } },
    //       { new: true },
    //       (err, data) => {
    //         if (err) {
    //           console.log("error update", err);
    //           return;
    //         }
    //         console.log("produit update edit => data", data);
    //       }
    //     );
    //   });
    // }
  } catch (e) {
    res.json({
      etat: false,
      data: 'Error',
    });
  }
};

exports.editStatusVente = async (req, res) => {
  const vente_id = req.params.venteId;
  console.log('👉 👉 👉  ~ file: vente.js:160 ~ vente_id', vente_id);

  const vente = await Ventes.findOne({
    _id: vente_id,
    status_commande: 'En attente',
  });

  if (vente) {
    Ventes.updateOne({ _id: vente_id }, { status_commande: 'Validée' })
      .then((r) => {
        req.session.newSave = true;
        res.redirect('/emdashboard');
      })
      .catch((err) => res.redirect('/emdashboard'));
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
      data: 'Error',
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
      data: 'Error',
    });
  }
};
