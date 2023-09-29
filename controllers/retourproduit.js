const { produitQueries } = require('../requests/produitQueries');
const { retourQueries } = require('../requests/retourQueries');
const { settingQueries } = require('../requests/settingQueries');
const Produits = require('../models/produit.model');
const { helperConverStrToArr } = require('../utils/helperConvertStrToArr');
const { TYPE_RETOUR_PRDUITS } = require('../constants');
const { venteQueries } = require('../requests/venteQueries');
const {
  helperFormatReturnProducts,
} = require('../utils/helperFormatReturnProducts');

exports.addback = async (req, res) => {
  try {
    if (req.session.user) {
      const userSession = req.session.user.travail_pour;

      const { result: products } = await produitQueries.getProduitBySession(
        userSession
      );

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

      const return_product_label = TYPE_RETOUR_PRDUITS.find(
        (item) => item.type === setting.product_return_type
      )?.nom;

      res.render('retour', {
        user: req.session.user,
        products,
        setting,
        return_product_label,
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
    const user = req.session.user;

    /// 1- remboursement total(on rembourse tout)(on recalcul le prix de vente avec le stock)
    //  2- remboursement partiel(on rembourse partiellement)(on deduire la somme dans la caisse)
    //  3- remboursement par avoir(ces boisons deviennent directement des pourboires)

    if (user) {
      const { result: setting } = await settingQueries.getSettingByUserId(
        user.travail_pour
      );

      const product_return_type = setting.product_return_type;

      let total = 0;

      const updateProductStock = async () => {
        let sum = 0;
        for (let [index, produit_id] of body.produit.entries()) {
          const reqData = {
            _id: produit_id,
            session: user.travail_pour,
          };

          const produit = await Produits.findOne(reqData);

          if (produit) {
            produit.quantite += parseInt(body.quantite[index]);
            sum += produit.prix_vente * parseInt(body.quantite[index]);
            await produit.save();
            body.produit[index] = {
              ...produit._doc,
              productId: produit._id,
            };
          }
        }

        return sum;
      };

      if (['full', 'half'].includes(product_return_type)) {
        total = await updateProductStock();

        let venteData = {
          produit: body.produit,
          quantite: body.quantite.map((q) => -q),
          travail_pour: user.travail_pour,
          employe: user._id,
          status_commande: 'Retour',
          prix: -(product_return_type === 'half'
            ? Number((total / 2).toFixed(2))
            : total),
          somme_encaisse: 0,
          monnaie: 0,
          employe_validate_id: user._id,
        };

        await venteQueries.setVente(venteData);
      }

      const retournData = await retourQueries.setRetour({
        ...body,
        travail_pour: user.travail_pour,
        employe: user._id,
        remboursement:
          product_return_type === 'half'
            ? Number((total / 2).toFixed(2))
            : total,
        product_return_type: product_return_type,
        confirm: ['full', 'half'].includes(product_return_type) ? true : false,
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

exports.confirmBackProduct = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/emconnexion');
      return;
    }

    const backProductId = req.params.id;

    const { result: backProduct } = await retourQueries.getRetourById(
      backProductId
    );

    if (!backProduct) {
      res.status(401).json({
        etat: false,
        message: 'Produit introuvable',
      });
      return;
    }

    const { result: retour } = await retourQueries.updateRetour(
      backProduct._id,
      {
        confirm: true,
        confirm_by: req.session.user._id,
      }
    );

    res.json({
      etat: true,
      message: 'Produit retourné avec succès',
      data: retour,
    });
  } catch (error) {
    res.redirect('/emconnexion');
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

    res.status(301).json({
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

exports.getProductsReturnValid = async (req, res) => {
  try {
    if (req.session.user) {
      const productsReturn = await retourQueries.getRetour({
        stock_return: false,
        confirm: false,
        dateline: {
          $gte: new Date(),
        },
        product_return_type: 'tip',
        travail_pour: req.session.user.travail_pour,
      });

      const data = productsReturn?.result;

      const products = helperFormatReturnProducts(data);

      res?.send({
        data: products || [],
      });
    } else {
      res.status(401).send({
        message: 'Unauthorized',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
