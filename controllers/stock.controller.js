const { stockQueries } = require('../requests/StocksQueries');
const { produitQueries } = require('../requests/produitQueries');
const {
  generateQuantityByLocker,
} = require('../utils/generateQuantityByLocker');
const { uploadFile } = require('../utils/uploadFile');

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

      let image = '';

      if (req.file) {
        const file = req.file;
        const result = await uploadFile(file);

        if (result) {
          image = result.Location;
        }
      } else {
        image = body.image;
      }

      const { produit, categorie, size } = body;

      const findProduct = await produitQueries.getProduitById(produit);

      if (!findProduct.result) {
        res.send({
          data: null,
          success: false,
        });
        return;
      }

      const quantity = generateQuantityByLocker(
        body.quantity,
        size,
        findProduct.result
      );

      const stock = await stockQueries.getOneStockByQuery({
        produit,
        categorie,
        size,
      });

      if (stock.result) {
        const result = await stockQueries.updateStock(stock.result._id, {
          ...body,
          image,
          quantity: stock.result.quantity + quantity,
        });

        res.send({
          data: result.result,
          success: result.etat,
        });

        return;
      }

      const result = await stockQueries.setStock({
        ...body,
        quantity,
        user: user.id || user._id,
        travail_pour: user.id || user.travail_pour,
        image,
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
