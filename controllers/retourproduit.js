const { produitQueries } = require("../requests/produitQueries");
const { retourQueries } = require("../requests/retourQueries");
const { settingQueries } = require("../requests/settingQueries");
const Produits = require("../models/produit.model");
const { helperConverStrToArr } = require("../utils/helperConvertStrToArr");

exports.addback = async (req, res) => {
  try {
    if (req.session.user) {
      const { result: products } = await produitQueries.getProduit({session :  req.session.user.travail_pour});

      let { result: setting } = await settingQueries.getSettingByUserId(
        req.session.user.travail_pour
      );
// j'appel sur wha 
      if (!setting) {
        let res = await settingQueries.setSetting({
          travail_pour: req.session.user.travail_pour,
        });

        if (res.etat) {
          setting = res.result;
        }
      }

      // donne ton idée ... y'a un truc pas normal meme un find il ramene tout
      console.log(products,'products')
      //voila le log modiaaaaaaaaa t'es dou oh
      res.render("retour", {
        user: req.session.user,
        products,
        setting,
        
      });
    } else {
      res.redirect("emconnexion");
    }
  } catch (error) {
    res.redirect(error);
  }
};

exports.addbackPost = async (req, res) => {
  try {
    console.log(req.body, "body");
    const body = {
      ...req.body,
      produit: helperConverStrToArr(req.body.produit),
      quantite: helperConverStrToArr(req.body.quantite),
    };

    /// 1- remboursement total(on rembourse tout)(on recalcul le prix de vente avec le stock)
    //  2- remboursement partiel(on rembourse partiellement)(on deduire la somme dans la caisse)
    //  3- remboursement par avoir(ces boisons deviennent directement des pourboires)

    if (req.session.user) {
      const { result: setting } = await settingQueries.getSettingByUserId(
        req.session.user.travail_pour
      );

      let total = 0;

      const updateProductStock = async () => {
        let sum = 0;
        for (let [index, produit_id] of body.produit.entries()) {
          const reqData = {
            _id: produit_id,
            session: req.session.user.travail_pour,
          };

          const produit = await Produits.findOne(reqData);
          console.log(
            "👉 👉 👉  ~ file: retourproduit.js ~ line 67 ~ produit",
            produit
          );

          if (produit) {
            produit.quantite += parseInt(body.quantite[index]);
            sum += produit.prix_vente * parseInt(body.quantite[index]);
            await produit.save();
          }
        }

        return sum;
      };

      switch (setting.product_return_type) {
        case "full":
          // remboursement total(on rembourse tout)(on recalcul le prix de vente avec le stock)
          total = await updateProductStock();
          break;
        case "half":
          //  2- remboursement partiel(on rembourse partiellement)(on deduire la somme dans la caisse)
          total = await updateProductStock();
          break;
        case "tip":
          //TODO cron job to add tip to user with
          break;
      }

      const retournData = await retourQueries.setRetour({
        ...body,
        travail_pour: req.session.user.travail_pour,
        employe: req.session.user._id,
        remboursement: total,
        product_return_type: setting.product_return_type,
        
      });
      console.log(
        "👉 👉 👉  ~ file: retourproduit.js ~ line 107 ~ retournData",
        retournData,
        total
      );

      res.redirect("retournerproduit");
    } else {
      res.redirect("emconnexion");
    }
  } catch (error) {
    console.log("👉 👉 👉  ~ file: retourproduit.js ~ line 107 ~ error", error);
    res.redirect(error);
  }
};

exports.listeRetour = async (req, res) => {
  try {
    const { result: retourProduits } = await retourQueries.getRetour({
      travail_pour: req.session.user.travail_pour,
      employe: req.session.user._id,
    });
    console.log(retourProduits[0].produit,"produit")
    res.render("listeretournerproduit", {
      user: req.session.user,
      retourProduits,
    });
  } catch (error) {}
};
