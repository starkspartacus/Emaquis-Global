const { employeQueries } = require("../requests/EmployeQueries");

exports.barmanparuser = async (req, res) => {
   
    try {
        user_sess= req.body;
        console.log(user_sess)
        let resultat =[];
        console.log(user_sess)
        if (user_sess !== null ){
            const Barman = await employeQueries.getAllEmploye();
            if( Barman.result !== null){
                console.log(Barman.result)
                Barman.result.forEach(el => {
                    if(el.travail_pour == user_sess.session && el.role == "Barman"){
                        resultat.push(el);
                    }
                });   
            }
            console.log(resultat,"zoo");
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

exports.barmanparuserPost = async (req, res) => {
    if (req.session.user) {
    try {
        res.render('usercategories')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }}else{
        res.redirect("/")
    }

};