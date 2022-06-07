exports.addcat = async(req,res)=>{
    if (req.session.user) {
    try {
        sess= req.session.user;
       //console.log(sess.id,"sqddsddqs")
        res.render("ajoutercategorie",{sess})

    } catch (error) {
        res.redirect(error)
    }
}else{
        res.redirect("/")
    }
}

exports.addcatPost = async(req,res)=>{
    if (req.session.user) {
    try {
        res.render("ajoutercategorie")

    } catch (error) {
        res.redirect(error)
    }  }else{
        res.redirect("/")
    }

}