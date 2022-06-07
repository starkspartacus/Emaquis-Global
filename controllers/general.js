exports.index = async (req, res) => {

    try {
        res.render('landing')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }

};

exports.indexPost = async (req, res) => {

    try {
        res.render('landing')

    } catch (e) {
        console.log('err', e);
        res.redirect(e)
    }

};



