
exports.ajouteruser = async (req, res) => {
    if (req.session.user) {
    try{
        sess= req.session.user;
         res.render('add_new_user' ,{sess})

    }catch (e) {
         console.log('err', e);
         res.redirect(e)
     }
    }else{
        res.redirect("/")
    }
 };
 exports.ajouteruserPost = async (req, res) => {
    if (req.session.user) {
     try{
             res.render('add_new_user')
        }catch (e) {
             console.log('err', e);
             res.redirect(e)
         }
        }else{
            res.redirect("/")
        }
     };
