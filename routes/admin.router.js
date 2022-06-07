const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const User = require('../models/user.model')
const Barman = require('../models/barman.model')
const Categorie = require('../models/categorie.model')
const Commande = require('../models/commande.model')
const Employe = require('../models/employe.model')
const Fournisseur = require('../models/fournisseur.model')
const Produit = require('../models/produit.model')
// const Roles = require('../models/role.model')
const Vente = require('../models/vente.model')

const mongoose = require('mongoose')


AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  resources: [
  { resource: User,
    //    options: {
    //     parent:{
    //       name:"Admin content",
    //       icon:"fas fa-cogs"
    //     }
    // }
  },
  { resource: Barman},
  { resource: Categorie},
  { resource: Commande},
  { resource: Employe},
  { resource: Fournisseur},
  { resource: Produit},
  // { resource: Roles} ,
  { resource: Vente},
  ],
  rootPath: '/admin',
  branding:{
    logo : 'https://www.logolynx.com/images/logolynx/c1/c15a8696ea4b0df7ce5f73426ed077e3.png',
  }
})

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'aniki@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'anikileboss',
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
  cookiePassword: process.env.ADMIN_COOKIE_PASS || 'supersecret-and-long-password-for-a-cookie-in-the-browser',
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN
      

    }
    return null
  }
})


module.exports = router
