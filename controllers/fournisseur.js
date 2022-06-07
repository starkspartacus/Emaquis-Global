

exports.fournisseur = async (req, res) => {
    if (req.session.user) {
    try{
        sess= req.session.user;
        
         res.render('fournisseur', {sess})
    }catch (e) {
         console.log('err', e);
         res.redirect(e)
     } }else{
        res.redirect("/")
    }
 };
 exports.fournisseurPost = async (req, res) => {
    if (req.session.user) {
     try{
             res.render('fournisseur')
        }catch (e) {
             console.log('err', e);
             res.redirect(e)
         }
        }else{
            res.redirect("/")
        }
     };
