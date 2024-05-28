const { venteQueries } = require("../requests/venteQueries");
const { produitQueries } = require("../requests/produitQueries");
const Produits = require("../models/produit.model");
const Ventes = require("../models/vente.model");
const Retours = require("../models/retourproduit.model");
const { settingQueries } = require("../requests/settingQueries");
const { employeQueries } = require("../requests/EmployeQueries");
const { BilletQueries } = require("../requests/BilletQueries");
const { formatDate } = require("../utils/generateYear");
const { getDateByWeekendMonthYear } = require("../utils/generateWeekly");
const { userQueries } = require("../requests/UserQueries");
const { helperCurrentTime } = require("../utils/helperCurrentTime");
const { calculPromoTotal } = require("../utils/calculPromoTotal");

exports.venteByMonth = async (req, res) => {
  try {
    if (req.session.user) {
      console.log("ici", req.session.user);
      const userId = req.session.user._id;
      const { month, year, week } = req.query;

      // startDate with month and year with moment

      const { start, end } = getDateByWeekendMonthYear(week, month, year);

      const Vente = await venteQueries.getVentes({
        createdAt: {
          $gte: start,
          $lt: end,
        },
        travail_pour: userId,
        status_commande: { $in: ["Validée", "Retour"] },
      });

      // let employe = Employe.result;
      // let prod = Produit.result;
      let vente = Vente.result;

      let venteByDay = vente.reduce((acc, item) => {
        const date = new Date(item.createdAt);

        const key = formatDate(date);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

      res.send({
        success: true,
        data: venteByDay,
      });
    } else {
      res.status(401).send({
        etat: false,
        data: "error signature",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      etat: false,
    });
  }
};

exports.vente = async (req, res) => {
  try {
    const productRes = await produitQueries.getProduitBySession(
      req.session.user.travail_pour
    );

    res.render("vente", {
      produits: productRes.result || [],
      user: req.session.user,
    });
  } catch (error) {
    res.redirect(error);
  }
};

const checkMaquisIsOpen = async (userId) => {
  const userAdmin = await userQueries.getUserById(userId);

  if (userAdmin.result && userAdmin.result.timings?.length > 0) {
    const { startDate, endDate } = helperCurrentTime({
      timings: userAdmin.result.timings,
    });

    if (!startDate || !endDate) {
      return false;
    }
  }

  return true;
};

exports.ventePost = async (req, res) => {
  try {
    let sess = req.session.user;
    const vente = req.body;

    let Vente = {};
    // let prize = [];
    const formulesProduct = [];
    const product_unavailables = [];
    let produits = [];
    let sum = 0;

    if (vente !== null) {
      // get the price of each product
      for (let [index, prodId] of vente.produit.entries()) {
        const currentProduct = await produitQueries.getProduitById(prodId);

        if (currentProduct.result !== null) {
          // prize.push(currentProduct.result.prix_vente);
          let promo_quantity = 0;
          if (currentProduct.result.promo) {
            if (currentProduct.result.promo_quantity <= vente.quantite[index]) {
              promo_quantity = parseInt(
                vente.quantite[index] / currentProduct.result.promo_quantity
              );
            }
          }

          if (promo_quantity) {
            const prix =
              promo_quantity * currentProduct.result.promo_price +
              (vente.quantite[index] % currentProduct.result.promo_quantity) *
                currentProduct.result.prix_vente;

            sum += prix;

            formulesProduct.push({
              produit_name: currentProduct.result.produit.nom_produit,
              quantite: vente.quantite[index],
              prix: prix,
              prix_hors_promo:
                currentProduct.result.prix_vente * vente.quantite[index],
              promo: currentProduct.result.promo,
              promo_quantity: currentProduct.result.promo_quantity,
              promo_price: currentProduct.result.promo_price,
              taille: currentProduct.result.taille,
            });
          } else {
            sum += vente.quantite[index] * currentProduct.result.prix_vente;
          }

          if (
            !currentProduct.result.is_cocktail &&
            currentProduct.result.quantite < vente.quantite[index]
          ) {
            product_unavailables.push({
              nom_produit: currentProduct.result.produit.nom_produit,
              taille: currentProduct.result.taille,
              quantite: currentProduct.result.quantite,
            });
          }

          const { _id, ...data } =
            currentProduct.result._doc || currentProduct.result;

          produits.push({ ...data, productId: _id, produit: data.produit._id });
        }
      }

      const setting = await settingQueries.getSettingByUserId(
        sess.travail_pour
      );
      let billet = await BilletQueries.getBilletByEmployeId(vente.for_employe);

      const maquisIsOpen = await checkMaquisIsOpen(sess.travail_pour);

      if (!maquisIsOpen) {
        return res.status(400).json({
          message: "Le maquis est fermé",
        });
      }

      if (!billet.result) {
        res.status(400).json({
          message: "la caisse de ce barman est fermée",
        });
        return;
      }

      if (
        vente.table_number &&
        setting.result.numberOfTables < vente.table_number
      ) {
        res.status(400).json({
          message: "Numéro de table invalide",
        });
        return;
      }

      if (product_unavailables.length > 0) {
        res.status(400).json({
          message: "Produits non disponible",
          product_unavailables: product_unavailables,
        });
        return;
      }

      const barmans = await employeQueries.getBarmans(sess.travail_pour);

      let newVente = {
        produit: produits,
        quantite: vente.quantite,
        employe: sess._id,
        travail_pour: sess.travail_pour,
        status_commande: "En attente",
        prix: sum,
        somme_encaisse: vente.somme_encaisse,
        monnaie: vente.amount_collected ? vente.somme_encaisse - sum : 0,
        formules: formulesProduct,
        table_number: vente.table_number,
        amount_collected: vente.amount_collected,
        for_employe: vente.for_employe || barmans.result[0]?._id,
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
        req.app.io.emit(`${sess.travail_pour}-vente`, {
          vente: venteRes.result,
        });
      }

      res.json({
        etat: true,
        data: vente,
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

exports.editventePost = async (req, res) => {
  try {
    let sess = req.session.user;
    const venteId = req.params.id;
    let produits = [];

    if (!sess) {
      res.status(401).json({
        etat: false,
        data: "Error",
      });
      return;
    }
    const body = req.body;

    const formulesProduct = [];
    const product_unavailables = [];

    let sum = 0;

    if (body !== null) {
      const oldVente = await venteQueries.getVentesById(venteId);

      // get the price of each product
      for (let [index, prodId] of body.produit.entries()) {
        const currentProduct = await produitQueries.getProduitById(prodId);

        if (currentProduct.result !== null) {
          // prize.push(currentProduct.result.prix_vente);
          let promo_quantity = 0;
          if (currentProduct.result.promo) {
            if (currentProduct.result.promo_quantity <= body.quantite[index]) {
              promo_quantity = parseInt(
                body.quantite[index] / currentProduct.result.promo_quantity
              );
            }
          }

          if (promo_quantity) {
            const prix =
              promo_quantity * currentProduct.result.promo_price +
              (body.quantite[index] % currentProduct.result.promo_quantity) *
                currentProduct.result.prix_vente;

            sum += prix;

            formulesProduct.push({
              produit_name: currentProduct.result.produit.nom_produit,
              quantite: body.quantite[index],
              prix: prix,
              prix_hors_promo:
                currentProduct.result.prix_vente * body.quantite[index],
              promo: currentProduct.result.promo,
              promo_quantity: currentProduct.result.promo_quantity,
              promo_price: currentProduct.result.promo_price,
              taille: currentProduct.result.taille,
            });
          } else {
            sum += body.quantite[index] * currentProduct.result.prix_vente;
          }

          const product_in_old_vente_index = oldVente.result.produit.findIndex(
            (product) => "" + product.productId === prodId
          );

          const qty =
            oldVente?.result?.quantite[product_in_old_vente_index] || 0;

          if (
            !currentProduct.result.is_cocktail &&
            currentProduct.result.quantite + qty < body.quantite[index]
          ) {
            if (product_in_old_vente_index !== -1) {
              const qty = oldVente.result.quantite[product_in_old_vente_index];

              if (qty - body.quantite[index] > 0) {
                // return no do nothing
                continue;
              }
            }

            product_unavailables.push({
              nom_produit: currentProduct.result.produit.nom_produit,
              taille: currentProduct.result.taille,
              quantite: currentProduct.result.quantite,
            });
          }

          const { _id, ...data } =
            currentProduct.result._doc || currentProduct.result;

          produits.push({
            ...data,
            productId: _id,
            produit: data.produit._id,
          });
        }
      }

      const setting = await settingQueries.getSettingByUserId(
        sess.travail_pour
      );

      let billet = await BilletQueries.getBilletByEmployeId(
        oldVente.result?.for_employe
      );

      const maquisIsOpen = await checkMaquisIsOpen(sess.travail_pour);

      if (!maquisIsOpen) {
        return res.status(400).json({
          message: "Le maquis est fermé",
        });
      }

      if (!billet.result) {
        res.status(400).json({
          message: "la caisse de ce barman est fermée",
        });
        return;
      }

      if (
        body.table_number &&
        setting.result.numberOfTables < body.table_number
      ) {
        res.status(400).json({
          message: "Numéro de table invalide",
        });
        return;
      }

      if (product_unavailables.length > 0) {
        res.status(400).json({
          message: "Produits non disponible",
          product_unavailables: product_unavailables,
        });
        return;
      }

      const products = [];

      if (oldVente.result.produit.length > 0) {
        for (let [index, product] of oldVente.result.produit.entries()) {
          const productId = "" + product.productId;
          const productIdFinded = body.produit.find((id) => id === productId);

          if (productIdFinded) {
            const productIndex = body.produit.findIndex(
              (id) => id === productId
            );

            const currentProduct = await produitQueries.getProduitById(
              body.produit[productIndex]
            );

            if (currentProduct?.result?.taille === product.taille) {
              const quantite =
                body.quantite[productIndex] - oldVente.result.quantite[index];
              products.push({
                id: product.productId,
                quantite: quantite,
              });
            } else {
              products.push({
                id: product.productId,
                quantite: body.quantite[productIndex],
              });
            }
          } else {
            products.push({
              id: product.productId,
              quantite: -oldVente.result.quantite[index],
            });
          }
        }
      }

      let newVente = {
        produit: produits,
        quantite: body.quantite,
        employe: sess._id,
        travail_pour: sess.travail_pour,
        prix: sum,
        somme_encaisse: body.somme_encaisse,
        monnaie: body.amount_collected ? body.somme_encaisse - sum : 0,
        formules: formulesProduct,
        table_number: body.table_number ?? oldVente.result.table_number,
        amount_collected:
          body.amount_collected ?? oldVente.result.amount_collected,
      };

      if (body.update_for_collected_amount) {
        newVente.status_commande = "Validée";
        newVente.employe_validate_id = sess._id;
      }

      await venteQueries.updateVente(venteId, newVente);

      const allProducts = body.produit
        .filter((prodId) => !products.find((prod) => "" + prod.id === prodId))
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
      res.json({
        etat: false,
        data: "erreur",
      });
    }
  } catch (e) {
    res.status(500).json({
      etat: false,
      data: "Error",
    });
  }
};

exports.editStatusVente = async (req, res) => {
  const vente_id = req.params.venteId;
  let sess = req.session.user;
  const vente = await Ventes.findOne({
    _id: vente_id,
    status_commande: "En attente",
  });

  if (vente) {
    Ventes.updateOne(
      { _id: vente_id },
      {
        status_commande: req.body.type || "Validée",
        employe_validate_id: req.session.user._id,
      },

      {
        new: true,
      }
    )
      .then(async (r) => {
        req.session.newSave = true;

        if (req.body.type === "Annulée") {
          for (let [i, product] of vente.produit.entries()) {
            const produit = await produitQueries.getProduitById(
              product.productId
            );

            const newQte = produit.result.quantite + Number(vente.quantite[i]);

            await produitQueries.updateProduit(
              {
                produitId: product.productId,
                session: req.session.user.travail_pour,
              },
              { quantite: newQte }
            );
          }
        }

        res.redirect("/emdashboard");
      })
      .catch((err) => res.redirect("/emdashboard"));

    const venteRes = await venteQueries.getVentesById(sess.travail_pour);

    if (req.app.io) {
      // console.log(req.app.io, sess.travail_pour,"lkfjdkfjdlfjldkfjk");
      req.app.io.emit(`${sess.travail_pour}-editvente`, {
        vente: venteRes.result,
      });
    }
  }
};

exports.editStatusVenteApi = async (req, res) => {
  const vente_id = req.params.venteId;
  let sess = req.session.user;
  const vente = await Ventes.findOne({
    _id: vente_id,
    status_commande: "En attente",
  });

  if (sess) {
    if (vente) {
      Ventes.updateOne(
        { _id: vente_id },
        {
          status_commande: req.body.type || "Validée",
          employe_validate_id: sess._id,
        },
        {
          new: true,
        }
      )
        .then(async (r) => {
          if (req.body.type === "Annulée") {
            for (let [i, product] of vente.produit.entries()) {
              const produit = await produitQueries.getProduitById(
                product.productId
              );

              const newQte =
                produit.result.quantite + Number(vente.quantite[i]);

              await produitQueries.updateProduit(
                {
                  produitId: product.productId,
                  session: req.session.user.travail_pour,
                },
                { quantite: newQte }
              );
            }
          }

          res.json({
            etat: true,
            data: "success",
          });
        })
        .catch((err) => res.status(404).json({ etat: false, data: "error" }));

      const venteRes = await venteQueries.getVentesById(sess.travail_pour);

      if (req.app.io) {
        // console.log(req.app.io, sess.travail_pour,"lkfjdkfjdlfjldkfjk");
        req.app.io.emit(`${sess.travail_pour}-editvente`, {
          vente: venteRes.result,
        });
      }
    } else {
      res.status(401).json({
        etat: false,
        data: "La vente n'est pas en attente",
      });
    }
  } else {
    res.status(401).json({
      etat: false,
      data: "Vous n'êtes pas connecté",
    });
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

exports.venteBilan = async (req, res) => {
  try {
    if (req.session.user) {
      const query = req.query;

      const start =
        query.from !== "null"
          ? new Date(new Date(query.from).setHours(0, 0, 0))
          : null;
      const end =
        query.to !== "null"
          ? new Date(new Date(query.to).setHours(23, 59, 59))
          : null;

      const users = query.users
        ? query.users?.includes("[")
          ? JSON.parse(query.users || "[]")
          : [query.users]
        : null;

      let filter = {
        travail_pour: req.session.user._id,
        status_commande: {
          $in: ["Validée", "Retour"],
        },
      };

      if (start) {
        filter.createdAt = {
          $gte: start,
        };
      }

      if (end) {
        if (!filter.createdAt) {
          filter.createdAt = {};
        }

        filter.createdAt.$lte = end;
      }

      if (users?.length > 0) {
        filter.employe = {
          $in: users,
        };
      }

      const ventes = await venteQueries.getVentes(filter);

      let produits = [];

      // recupere les produits vendus
      for (let vente of ventes.result) {
        // tous produit dans chaque vente(par index et produit)
        for (let [produitIndex, produit] of vente.produit.entries()) {
          // fait un nouveau formatage de produit pour le bilan
          if (produit?.produit) {
            const total_vente =
              vente.quantite[produitIndex] < 0
                ? vente.prix
                : produit.promo
                ? calculPromoTotal(produit, vente.quantite[produitIndex])
                : produit.prix_vente * vente.quantite[produitIndex];

            const total_achat =
              produit.prix_achat * vente.quantite[produitIndex];

            const product = {
              nom: produit.produit?.nom_produit,
              categorie: produit.produit.categorie,
              prix_vente: produit.prix_vente,
              prix_achat: produit.prix_achat,
              quantite: vente.quantite[produitIndex],
              taille: produit.taille,
              _id: produit._id,
              productId: produit.productId,
              total_vente,
              benefice: total_vente - total_achat,
              employe: vente.employe,
              createdAt: vente.createdAt,
              retour_quantite:
                vente.quantite[produitIndex] < 0
                  ? vente.quantite[produitIndex]
                  : 0,
              prix: vente.quantite[produitIndex] < 0 ? vente.prix : 0,
            };

            produits.push(product);
          }
        }
      }

      res.send({
        etat: true,
        data: produits.filter((p) => !!p.employe),
      });
    } else {
      res.status(401).send({
        etat: false,
        data: "error signature",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({});
  }
};
