const { produitQueries } = require("../requests/produitQueries");
const { retourQueries } = require("../requests/retourQueries")
exports.addback = async (req, res) => {
  try {
    const { result: products } = await produitQueries.getProduit();

    res.render("retour", {
      user: req.session.user,
      products,
    });
  } catch (error) {
    res.redirect(error);
  }
};

exports.addbackPost = async (req, res) => {
  try {
    console.log(req.body, "body");
    res.render("retour");
  } catch (error) {
    res.redirect(error);
  }
};

exports.listeRetour = async ( req,res)=>{

  try{
  const { Result: retour } = await retourQueries.getRetour();
    console.log(Result)
    // res.render("listeretournerproduit", {
    //   user: req.session.user,
    //   Result,
    // });
  
  }catch (error){

  }
}
