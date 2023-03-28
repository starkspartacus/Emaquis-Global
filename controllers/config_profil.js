exports.config_profil = async(req,res)=>{

    try {
        res.render("config_profil")

    } catch (error) {
        res.redirect(error)

    }
}

exports.config_profilPost = async (req, res) => {
    try{
        res.render('config_profil')
        console.log('config_profilPost')
    }catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
};
