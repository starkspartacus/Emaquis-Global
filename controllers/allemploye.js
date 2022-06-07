const { employeQueries } = require("../requests/EmployeQueries");
exports.allemploye = async (req, res) => {

    try {
        const employe = await employeQueries.getAllEmploye();
        
        if (employe.result !== null) {
             let resultat = employe.result
            console.log(resultat,"zoo")
            res.json({
                etat: true,
                data: resultat,
            });
        }

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }


};

exports.allemployePost = async (req, res) => {
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