require('dotenv').config();
const jwt = require('jsonwebtoken');
const employeModel = require('../models/employe.model');
const secret = process.env.SECRET;
const User = require('../models/user.model');

exports.authUser = async (req, res, next) => {
  const token = req.headers.token;
  if (!!!token) {
    res.status(404).send({ error: 'token not find' });
    return;
  }
  try {
    const tokenExist = await User.findOne({ token: token });
    if (tokenExist) {
      const data = jwt.verify(token, secret);
      req.user = {
        id: tokenExist._id,
        folders: tokenExist.folders,
        role: tokenExist.role,
      };
      if (data) {
        next();
      } else {
        res.status(401).send({ error: 'error signature' });
      }
    } else {
      res.status(404).send({ error: 'Token not find' });
      return;
    }
  } catch (err) {
    res.status(404).send({ error: err.message });
    return;
  }
};

exports.checkAuthUser = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/connexion');
  }
};

exports.authAdmin = async (req, res, next) => {
  const token = req.headers.token;
  if (!!!token) {
    res.status(404).send({ error: 'token not find' });
    return;
  }
  try {
    const tokenExist = await User.findOne({ token: token });
    if (tokenExist && tokenExist.role === 'ROLE_ADMIN') {
      const data = jwt.verify(token, secret);
      req.user = {
        id: tokenExist._id,
        folders: tokenExist.folders,
        role: tokenExist.role,
      };
      if (data) {
        next();
      } else {
        res.status(401).send({ error: 'error signature' });
      }
    } else {
      res.status(404).send({ error: "you are don't accès to this route" });
      return;
    }
  } catch (err) {
    res.status(404).send({ error: err.message });
    return;
  }
};

exports.authSuperAdmin = async (req, res, next) => {
  const isAdmin = req.session.user?.isAdmin;
  console.log(
    '👉 👉 👉  ~ file: auth.js:68 ~ isAdmin',
    isAdmin,
    req.session.user
  );
  if (!!!isAdmin) {
    res.redirect('/connexion');

    return;
  }

  next();
};

// Authorization Bearer token

exports.forceSession = async (req, res, next) => {
  const authorization = req.headers.authorization;

  // if (authorization && !req.session.user) {
  //   const token = authorization.split(' ')[1];
  //   const data = jwt.verify(token, secret);
  //   const employe = await employeModel.findOne({ _id: data?.employe_id });
  //   req.session.user = employe;
  // }

  // req.session.user = {
  //   deleted: false,
  //   isAdmin: false,
  //   _id: '63c31980dcfdae70c90f0621',
  //   nom: 'Ouattara',
  //   prenom: 'Mory',
  //   role: 'Barman',
  //   travail_pour: '62bba1bc9bace93c2139ccdc',
  //   statut: 'Actif',
  //   email: 'mory@gmail.com',
  //   numero: '0749601753',
  //   adresse: 'Koumassi',
  //   password: '$2a$10$xnwgrlKECAdb0.feYcZgtehriBSx40uTYky3mM1HcDEuJPsJCxfXa',
  //   createdAt: '2023-01-14T21:07:12.048Z',
  //   updatedAt: '2023-01-14T21:07:12.048Z',
  //   __v: 0,
  // };

  next();
};
