const { employeQueries } = require("../requests/EmployeQueries");
const { produitQueries } = require("../requests/produitQueries");
exports.dashboard = async (req, res) => {
    if (req.session.user) {
        let  totalemploye;
        res.setHeader('Content-Type', 'text/html')
        const session = req.session.user
    try {
        const Employe = await employeQueries.getAllEmploye();
        const Produit = await produitQueries.getProduit();
        let Result=[];
        let Tab = [];
        if (Employe.result !== null && Produit.result !== null) {
            let employe = Employe.result;
            let prod = Produit.result;
            employe.forEach( async el=>{
                if(session.id ==  el.travail_pour ){
                    Result.push(el);
                 }
            })
            prod.forEach( async el=>{
                //console.log(el)
                if(session.id ==  el.session ){
                    Tab.push(el);
                    console.log(Tab,'tab')
                }
            })
            totalemploye = Result.length
           // console.log(totalemploye,"employé test")
            res.render('dashboard', {totalemploye,Tab})
        }

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
    }else{
        res.redirect("/")
    }
};

exports.dashboardPost = async (req, res) => {
    if (req.session.user) {
        res.setHeader('Content-Type', 'text/html')
    try {
        res.render('dashboard')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
    }else{
        res.redirect("/")
    }
};



