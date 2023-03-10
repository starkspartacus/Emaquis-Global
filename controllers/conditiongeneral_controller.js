exports.condition_general = async(req,res)=>{

    try {
        res.render("condition_general",)

    } catch (error) {
        res.redirect(error)

    }
}
