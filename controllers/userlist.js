
const {employeQueries} = require("../requests/EmployeQueries");
exports.userlist = async (req, res) => {
    if (req.session.user) {
        const session = req.session.user
        console.log(session.id)
   try{
    const Employe = await employeQueries.getAllEmploye();
    let Result=[];
    if (Employe.result !== null) {
        let employe = Employe.result;
        employe.forEach( async el=>{
            if(session.id ==  el.travail_pour ){

               Result.push(el);
            }

        })
        console.log(Result,"zo");
        res.render('user_list',{Result})
    }
   }catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
}else{
        res.redirect("/")
    }
};
exports.userlistPost = async (req, res) => {
    if (req.session.user) {
    try{
            res.render('user_list')
       }catch (e) {
            console.log('err', e);
            res.redirect(e)
        }
    }else{
        res.redirect("/")
    }
    };
