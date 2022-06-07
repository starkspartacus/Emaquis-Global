const mongoose = require('mongoose');
//const config = require('./config.json');

const connection = async() => {
    try {
        
        await mongoose.connect("mongodb+srv://aniki:anikileboss@cluster0.bzpyn.mongodb.net/emaquis?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('serveur mongo connecté')
    } catch (e) {
        console.log('connection failed : ', e);
    }
}
module.exports = connection;
