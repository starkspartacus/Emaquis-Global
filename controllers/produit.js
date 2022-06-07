const { produitQueries } = require("../requests/produitQueries");
exports.produits = async (req, res) => {
    if (req.session.user) {
    try {
        sess= req.session.user;
        const Produit = await produitQueries.getProduit();
        const ProduitbyID = await produitQueries.getProduitById(req.query.id);
        if (Produit.result !== null) {
            const Produit = await produitQueries.getProduit(ProduitbyID);
            res.render('ajouterproduit', {data : Produit.result, sess})
        }

        //


    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }}else{
        res.redirect("/")
    }

};

exports.produitsPost = async (req, res) => {
    if (req.session.user) {
    try {
        res.render('ajouterproduit')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }}else{
        res.redirect("/")
    }

};