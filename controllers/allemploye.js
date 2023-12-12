const { employeQueries } = require('../requests/EmployeQueries');

exports.allemploye = async (req, res) => {
  try {
    const user = req.session.user;
    if (user) {
      const employe = await employeQueries.getEmployeByEtablissement(
        user.id || user._id || user.travail_pour
      );

      if (employe.result !== null) {
        let resultat = employe.result;
        res.json({
          etat: true,
          data: resultat,
          user: req.session.user,
        });
      }
    } else {
      res.status(401).send({
        etat: false,
        data: 'error',
      });
    }
  } catch (e) {
    console.log('err', e);
    res.redirect(e);
  }
};



exports.allBarmans = async (req, res) => {
  if (req.session.user) {
    const body = req.body;
    console.log('👉 👉 👉  ~ file: allemploye.js:23 ~ body:', body);
    try {
      const barmans = await employeQueries.getBarmans(body.travail_pour);
      if (barmans.result !== null) {
        let resultat = barmans.result;
        res.json({
          etat: true,
          data: resultat,
        });
      }
    } catch (e) {
      console.log('👉 👉 👉  ~ file: allemploye.js:34 ~ e:', e);
      res.status(500).send({
        error: 'error',
      });
    }
  } else {
    res.status(401).send({
      error: 'error signature',
    });
  }
};

exports.allemployePost = async (req, res) => {
  if (req.session.user) {
    try {
      res.render('listecategories');
    } catch (e) {
      console.log('err', e);
      res.redirect(e);
    }
  } else {
    res.redirect('/');
  }

  exports.addEmployeeImage = async (req, res) => {
    // const user = req.session.user;
    try {
      // if (user) {
        const { id } = req.params;
        console.log("id")
        // let image = '';
        // if (req.file) {
        //   const file = req.file;
        //   const result = await uploadFile(file);
        //   if (result) {
        //     image = result.Location;
        //   }
        // } else {
        //   image = req.body.image;
        // }
        // const result = await employeQueries.updateEmployeePhotoById(id, image);
        // res.send({
        //   data: result.result,
        //   success: result.etat,
        // });
      // }
    } catch (e) {
      console.log(e);
      // res.status(500).send({ success: false });
    }
  };
};
