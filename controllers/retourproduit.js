const { produitQueries } = require('../requests/produitQueries');
const { retourQueries } = require('../requests/retourQueries');
const { settingQueries } = require('../requests/settingQueries');
const Produits = require('../models/produit.model');
const { helperConverStrToArr } = require('../utils/helperConvertStrToArr');
const { TYPE_RETOUR_PRDUITS } = require('../constants');

exports.addback = async (req, res) => {
  try {
    if (req.session.user) {
      const userSession = req.session.user.travail_pour;

      const { result: products } = await produitQueries.getProduit({
        session: userSession,
      });

      let { result: setting } = await settingQueries.getSettingByUserId(
        userSession
      );

      if (!setting) {
        let res = await settingQueries.setSetting({
          travail_pour: userSession,
        });

        if (res.etat) {
          setting = res.result;
        }
      }

      let retournData = null;

      if (req.session.retournData) {
        retournData = req.session.retournData;
        delete req.session.retournData;
      }

      res.render('retour', {
        user: req.session.user,
        products,
        setting,
        retournData,
        code: retournData?._id?.slice(-6).toUpperCase(),
      });
    } else {
      res.redirect('emconnexion');
    }
  } catch (error) {
    res.redirect(error);
  }
};

exports.addbackPost = async (req, res) => {
  try {
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

          if (produit) {
            produit.quantite += parseInt(body.quantite[index]);
            sum += produit.prix_vente * parseInt(body.quantite[index]);
            await produit.save();
          }
        }

        return sum;
      };

      switch (setting.product_return_type) {
        case 'full':
          // remboursement total(on rembourse tout)(on recalcul le prix de vente avec le stock)
          total = await updateProductStock();
          break;
        case 'half':
          //  2- remboursement partiel(on rembourse partiellement)(on deduire la somme dans la caisse)
          total = await updateProductStock();
          break;
      }

      const retournData = await retourQueries.setRetour({
        ...body,
        travail_pour: req.session.user.travail_pour,
        employe: req.session.user._id,
        remboursement: total,
        product_return_type: setting.product_return_type,
      });

      req.session.retournData = retournData.result;

      res.redirect('retournerproduit');
    } else {
      res.redirect('emconnexion');
    }
  } catch (error) {
    res.redirect(error);
  }
};

exports.listeRetour = async (req, res) => {
  try {
    const { result: retourProduits } = await retourQueries.getRetour({
      travail_pour: req.session.user.travail_pour,
      employe: req.session.user._id,
    });

    res.render('listeretournerproduit', {
      user: req.session.user,
      retourProduits,
      type_retour_produit: TYPE_RETOUR_PRDUITS,
    });
  } catch (error) {}
};

exports.getProductReturn = async (req, res) => {
  try {
    const code = req.params.code;

    const data = await retourQueries.getRetourByCode(
      new RegExp(`${code.toLowerCase()}$`)
    );

    if (!data.etat)
      return res.status(404).json({ etat: false, message: 'Not found' });

    const return_product = data.result[0];

    if (return_product.product_return_type === 'tip') {
      if (new Date().getTime() <= new Date(return_product.dateline).getTime()) {
        return res.status(200).json({
          etat: true,
          message: `Ce code est valide jusqu'au ${new Date(
            return_product.dateline
          ).toLocaleString('fr-fr')}`,
          data: return_product,
        });
      }
    }

    res.status(200).json({
      etat: true,
      message: `Ce code est expiré depuis le ${new Date(
        return_product.createdAt
      ).toLocaleString('fr-fr')}`,
      code,
    });
  } catch (error) {
    res.status(500).json({
      etat: false,
      message: error.message,
    });
  }
};
