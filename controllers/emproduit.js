const {categorieQueries} = require("../requests/categorieQueries");
exports.addproduit = async(req,res)=>{
    // if (req.session.user) {
    try {
        let categorie= [];
      let sess= req.session.user;
        const Categorie = await categorieQueries.getCategorie();

        if (Categorie.result !== null) { 
          const categories = Categorie.result;
            categories.forEach(el => {
            if(el.categorie_pour == "62bba1bc9bace93c2139ccdc"){ 
                categorie.push(el);
                console.log(categorie)
                }
            });
            res.render("emproduit", {categorie})
        }
    } catch (error) {
        res.redirect(error)
    }
// }else{
//     res.redirect("/")
// }
}

exports.addproduitPost = async(req,res)=>{
    // if (req.session.user) {
    try {
        res.render("emproduit")

    } catch (error) {
        res.redirect(error)
    }
// }else{
//     res.redirect("/")
// }
}