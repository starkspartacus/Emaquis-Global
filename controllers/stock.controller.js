const { START_TIP_DAY } = require('../constants');
const { stockQueries } = require('../requests/StocksQueries');
const { produitQueries } = require('../requests/produitQueries');
const { retourQueries } = require('../requests/retourQueries');
const { settingQueries } = require('../requests/settingQueries');
const {
  generateQuantityByLocker,
} = require('../utils/generateQuantityByLocker');
const {
  helperFormatReturnProducts,
} = require('../utils/helperFormatReturnProducts');

exports.stocksList = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const result = await stockQueries.getStockBySession(
      user?.id || user?._id || user.travail_pour
    );

    res.send({
      data: result.result,
      success: result.etat,
    });
  } else {
    res.send({
      data: [],
      success: false,
    });
  }
};

exports.addStock = async (req, res) => {
  const user = req.session.user;
  try {
    if (user) {
      const body = req.body;

      const { produit, categorie, size, productId, stockType } = body;

      const findProduct = await produitQueries.getProduitById(productId);

      // verifier si le produit existe sinon on renvoie une erreur

      if (!findProduct.result) {
        res.send({
          data: null,
          success: false,
        });
        return;
      }

      // verifier si le stock est de type locker

      const quantity = generateQuantityByLocker({
        locker: body.quantity,
        size,
        produit: findProduct.result?.produit,
        stockType,
      });

      // verifier si le stock existe

      const stock = await stockQueries.getOneStockByQuery({
        produit,
        categorie,
        size,
      });

      // si le stock existe, on met a jour la quantite

      if (stock.result) {
        const result = await stockQueries.updateStock(stock.result._id, {
          ...body,
          quantity: stock.result.quantity + quantity,
        });

        res.send({
          data: result.result,
          success: result.etat,
        });

        return;
      }

      // si le stock n'existe pas, on le cree

      const result = await stockQueries.setStock({
        ...body,
        quantity,
        user: user.id || user._id,
        travail_pour: user.id || user.travail_pour,
      });

      res.send({
        data: result.result,
        success: result.etat,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false });
  }
};

exports.returnStock = async (req) => {
  try {
    const session = req.session.user;

    if (session) {
      const userId = session.travail_pour || session.id || session._id;
      const settingAdmin = await settingQueries.getSettingByUserId(userId);

      if (settingAdmin.result.product_return_type === 'tip') {
        const result = await retourQueries.getRetour({
          stock_return: false,
          confirm: false,
          dateline: {
            $lte: new Date(),
            $gte: START_TIP_DAY,
          },
          product_return_type: 'tip',
          travail_pour: userId,
        });

        const productsReturn = helperFormatReturnProducts(result.result);

        const products = [];

        for (let productReturn of productsReturn) {
          const findProduct = await produitQueries.getProduitById(
            productReturn._id
          );

          if (findProduct.result) {
            products.push({
              ...findProduct.result._doc,
              oldQuantite: findProduct.result.quantite,
              quantite:
                Number(productReturn.quantite) +
                Number(findProduct.result.quantite),
              tipQuantite: productReturn.quantite,
              dateline: productReturn.dateline,
              product_return_type: productReturn.product_return_type,
              client_name: productReturn.client_name,
              code: productReturn.code,
            });

            await findProduct.result.updateOne({
              $inc: {
                quantite: Number(productReturn.quantite),
              },
            });

            await retourQueries.updateRetour(productReturn.tipId, {
              stock_return: true,
              stock_return_date: new Date(),
            });
          }
        }

        return products;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
};
