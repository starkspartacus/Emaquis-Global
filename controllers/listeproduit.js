const { produitQueries } = require("../requests/produitQueries");
const { categorieQueries } = require("../requests/categorieQueries");
exports.produit = async (req, res) => {
    if (req.session.user) {
        const session = req.session.user
    try {
        const Produit = await produitQueries.getProduit();
        const Categorie =  await categorieQueries.getCategorie();

        const Produitid = await produitQueries.getProduitById(req.query.id);
        let Result=[];
        if (Produit.result !== null) {
            const produit = await produitQueries.getProduit(Produitid);
            let prod = produit.result;
            prod.forEach( async el=>{
                console.log(el)
                if(session.id ==  el.session ){
                   Result.push(el);
                }
            })
        }
        res.render("listeproduit",{Result})
    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
}else{
        res.redirect("/")
    }

};

exports.produitPost = async (req, res) => {
    if (req.session.user) {
    try {
        res.render('listeproduit')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
}else{
        res.redirect("/")
    }

};