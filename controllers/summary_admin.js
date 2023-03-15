exports.summaryadmin = async(req,res)=>{

    try {
        res.render("summaryadmin",)

    } catch (error) {
        res.redirect(error)

    }
}
