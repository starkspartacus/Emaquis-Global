exports.contact = async(req,res)=>{
  
    try {
        sess= req.session.user;
     
        res.render("contact",{sess})

    } catch (error) {
        res.redirect(error)
    }

}

exports.contactPost = async(req,res)=>{
    if (req.session.user) {
    try {
        res.render("contact")

    } catch (error) {
        res.redirect(error)
    }  }else{
        res.redirect("/")
    }

}