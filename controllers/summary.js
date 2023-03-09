exports.summary = async (req, res) => {
  if (req.session.user) {
    try {
      let sess = req.session.user;;
      //console.log(sess.id,"sqddsddqs")
      res.render('summary', {   user: sess, });
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.summaryPost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('summary');
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

exports.paiement = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('paiement');
    } catch (error) {
      res.redirect(error);
    }
  } else {
    res.redirect('/');
  }
};

