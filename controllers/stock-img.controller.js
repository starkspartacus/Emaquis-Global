const { stockImgQueries } = require('../requests/StocksImgQueries');
const { uploadFile } = require('../utils/uploadFile');

exports.stocksImageList = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const result = await stockImgQueries.getStockImgs();

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

exports.addStockImage = async (req, res) => {
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

      const result = await stockImgQueries.setStock({
        ...body,
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
