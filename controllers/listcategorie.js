const { categorieQueries } = require("../requests/categorieQueries");
exports.seecat = async (req, res) => {
    if (req.session.user) {
        const session = req.session.user
    try {
        const Categorie = await categorieQueries.getCategorie();
        const Categorieid = await categorieQueries.getCategorieById(req.query.id);
        let Result=[];
        if (Categorie.result !== null) {
            const categorie = await categorieQueries.getCategorie(Categorieid);
            let cate = categorie.result
            cate.forEach( async el=>{
                if(session.id ==  el.categorie_pour ){
    
                   Result.push(el);
                }
    
            })
            console.log(Result,"zoo")
            res.render("listecategories",{Result})
        }

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
}else{
        res.redirect("/")
    }

};

exports.seecatPost = async (req, res) => {
    if (req.session.user) {
    try {
        res.render('listecategories')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
}else{
        res.redirect("/")
    }

};