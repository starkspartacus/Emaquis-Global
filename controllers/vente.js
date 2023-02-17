const { venteQueries } = require('../requests/venteQueries');
const { produitQueries } = require('../requests/produitQueries');
const { retourQueries } = require('../requests/retourQueries');
const Produits = require('../models/produit.model');
const Ventes = require('../models/vente.model');
const Retours = require('../models/retourproduit.model');
exports.vente = async (req, res) => {
  try {
    const productRes = await produitQueries.getProduitBySession(
      req.session.user.travail_pour
    );

    res.render('vente', {
      produits: productRes.result || [],
      user: req.session.user,
    });
  } catch (error) {
    res.redirect(error);
  }
};

exports.ventePost = async (req, res) => {
  try {
    let sess = req.session.user;
    const vente = req.body;

    let Vente = {};
    let prize = [];
    let sum = 0;

    if (vente !== null) {
      // get the price of each product
      for (let prodId of vente.produit) {
        const currentProduct = await produitQueries.getProduitById(prodId);
        prize.push(currentProduct.result.prix_vente);
      }

      for (let i = 0; i < Math.min(vente.quantite.length, prize.length); i++) {
        sum += vente.quantite[i] * prize[i];
      }

      let newVente = {
        produit: vente.produit,
        quantite: vente.quantite,
        employe: sess._id,
        travail_pour: sess.travail_pour,
        status_commande: 'En attente',
        prix: sum,
        somme_encaisse: vente.somme_encaisse,
        monnaie: vente.somme_encaisse - sum,
      };
      // il fait pas l setvente or il fait update  de produit
      Vente = await venteQueries.setVente(newVente);
      vente.produit.forEach((produit_id, index) => {
        Produits.updateOne(
          { session: sess.travail_pour, _id: produit_id },
          { $inc: { quantite: -vente.quantite[index] } },
          { new: true },
          (err, data) => {
            if (err) {
              return;
            }
          }
        );
      });

      const venteRes = await venteQueries.getVentesById(Vente.result?._id);

      if (req.app.io) {
        console.log(req.io, sess.travail_pour);
        req.app.io.emit(`${sess.travail_pour}-vente`, {
          vente: venteRes.result,
        });
      }

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
    let sess = req.session.user;
    const venteId = req.params.id;

    if (!sess) {
      res.status(401).json({
        etat: false,
        data: 'Error',
      });
      return;
    }
    const body = req.body;

    let Vente = {};
    let prize = [];
    let sum = 0;

    if (body !== null) {
      // get the price of each product
      for (let prodId of body.produit) {
        const currentProduct = await produitQueries.getProduitById(prodId);

        prize.push(currentProduct.result.prix_vente);
      }

      for (let i = 0; i < Math.min(body.quantite.length, prize.length); i++) {
        sum += (body.quantite[i] + body.quantite_already_sold[i]) * prize[i];
      }

      const oldVente = await venteQueries.getVentesById(venteId);
      const products = [];

      if (oldVente.result.produit.length > 0) {
        for (let [index, product] of oldVente.result.produit.entries()) {
          const productId = '' + product._id;
          const productIdFinded = body.produit.find((id) => id === productId);

          if (productIdFinded) {
            const productIndex = body.produit.findIndex(
              (id) => id === productId
            );

            const currentProduct = await produitQueries.getProduitById(
              body.produit[productIndex]
            );

            if (currentProduct.result.taille === product.taille) {
              const quantite =
                body.quantite[productIndex] - oldVente.result.quantite[index];
              products.push({
                id: product._id,
                quantite: quantite,
              });
            } else {
              products.push({
                id: product._id,
                quantite: body.quantite[productIndex],
              });
            }
          } else {
            products.push({
              id: product._id,
              quantite: -oldVente.result.quantite[index],
            });
          }
        }
      }

      let newVente = {
        produit: body.produit,
        quantite: body.quantite,
        employe: sess._id,
        travail_pour: sess.travail_pour,
        prix: sum,
        somme_encaisse: body.somme_encaisse,
        monnaie: body.somme_encaisse - sum,
      };

      Vente = await venteQueries.updateVente(venteId, newVente);
      const allProducts = body.produit
        .filter((prodId) => !products.find((prod) => '' + prod.id === prodId))
        .map((prodId) => {
          const productIndex = body.produit.findIndex((id) => id === prodId);
          return {
            id: prodId,
            quantite: body.quantite[productIndex],
          };
        })
        .concat(products);

      allProducts.forEach((product, index) => {
        Produits.updateOne(
          { session: sess.travail_pour, _id: product.id },
          { $inc: { quantite: -product.quantite } },
          { new: true },
          (err, data) => {
            if (err) {
              return;
            }
          }
        );
      });

      const venteRes = await venteQueries.getVentesById(venteId);

      if (req.app.io) {
        console.log(req.io, sess.travail_pour);
        req.app.io.emit(`${sess.travail_pour}-edit-vente`, {
          vente: venteRes.result,
          allProducts,
        });
      }

      res.json({
        etat: true,
        data: venteRes?.result,
      });
    } else {
      console.log('iiiiicccciiiiii');
      res.json({
        etat: false,
        data: 'erreur',
      });
    }
  } catch (e) {
    res.status(500).json({
      etat: false,
      data: 'Error',
    });
  }
};

exports.editStatusVente = async (req, res) => {
  const vente_id = req.params.venteId;
  let sess = req.session.user;
  const vente = await Ventes.findOne({
    _id: vente_id,
    status_commande: 'En attente',
  });

  if (vente) {
    Ventes.updateOne(
      { _id: vente_id },
      {
        status_commande: req.body.type || 'Validée',
        employe_validate_id: req.session.user._id,
      },

      {
        new: true,
      }
    )
      .then(async (r) => {
        req.session.newSave = true;

        if (req.body.type === 'Annulée') {
          for (let [i, product] of vente.produit.entries()) {
            const produit = await produitQueries.getProduitById(product);
            const newQte = produit.result.quantite + Number(vente.quantite[i]);

            await produitQueries.updateProduit(
              { produitId: product, session: req.session.user.travail_pour },
              { quantite: newQte }
            );
          }
        }

        res.redirect('/emdashboard');
      })
      .catch((err) => res.redirect('/emdashboard'));

    const venteRes = await venteQueries.getVentesById(sess.travail_pour);

    if (req.app.io) {
      // console.log(req.app.io, sess.travail_pour,"lkfjdkfjdlfjldkfjk");
      req.app.io.emit(`${sess.travail_pour}-editvente`, {
        vente: venteRes.result,
      });
    }
  }
};

exports.venteListe = async (req, res) => {
  try {
    // const maquisID = req.body.id;
    console.log(req.session.user._id);
    const maquiSell = await Ventes.find({ travail_pour: req.session._id });
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
