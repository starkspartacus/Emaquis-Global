exports.config_profil = async(req,res)=>{
    if (req.session.user) {
    try {
        res.render("config_profil")

    } catch (error) {
        res.redirect(error)

    }
} else {
    res.redirect('/');
  }
}

exports.config_profilPost = async (req, res) => {
    if (req.session.user) {
    try{
        res.render('config_profil')
        console.log('config_profilPost')
    }catch (e) {
        console.log('err', e);
        res.redirect(e)
    }
} else {
    res.redirect('/');
  }
};
