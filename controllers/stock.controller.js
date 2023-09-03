const { stockQueries } = require('../requests/StocksQueries');
const { produitQueries } = require('../requests/produitQueries');
const {
  generateQuantityByLocker,
} = require('../utils/generateQuantityByLocker');

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
