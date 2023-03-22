exports.config_profil = async(req,res)=>{

    try {
        res.render("config_profil")

    } catch (error) {
        res.redirect(error)

    }
}
