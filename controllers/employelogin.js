// const { employeQueries } = require('../requests/EmployeQueries');
const Employe = require('../models/employe.model');

const dotenv = require('dotenv').config();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.employelogin = async (req, res) => {
  try {
  } catch (e) {
    console.log('err', e);
    res.redirect(e);
  }
};

exports.employeloginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send('veuillez remplir tous les champs');
    }
    const employelogin = await Employe.findOne({ email });

    if (
      employelogin &&
      (await bcrypt.compare(password, employelogin.password))
    ) {
      const token = jwt.sign(
        { employe_id: employelogin._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '1h',
        }
      );

      employelogin.token = token;
      req.session.user = employelogin;
      res.status(200).send({ employelogin, token });
    } else {
      res.status(400).send('email ou mot de passe incorrect');
    }
  } catch (e) {
    console.log('err', e);
    res.status(400).send({ data: 'verifiez les champs', success: false });
  }
};
