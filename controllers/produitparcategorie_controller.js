const { produitQueries } = require("../requests/produitQueries");

exports.categorieProduct = async (req, res) => {};

exports.categorieProductPost = async (req, res) => {
  try {
    const CategoryId = req.body._id;
    const Session = req.body.session;
    let resultat = [];
    let cat = [];
    if (CategoryId !== null) {
      const Produit = await produitQueries.getProduit();
      if (Produit.result !== null) {
        Produit.result.forEach((el) => {
          console.log(el.categorie);
          cat.push(el.categorie);
          cat.forEach((ol) => {
            if (ol._id == CategoryId && el.session == Session) {
              resultat.push(el);
            }
          });
        });
        if (resultat.length <= 0) {
          res
            .status(400)
            .send({
              data: "cette categorie n'a pas de produit,veuillez en rajouter svp",
              success: false,
            });
        } else {
          res.status(200).send({ data: [...new Set(resultat)], success: true });
        }
      }
    }
  } catch (e) {
    console.log("err", e);
    res.redirect(e);
  }
};
