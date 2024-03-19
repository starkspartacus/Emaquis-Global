const mongoose = require('mongoose');
//const config = require('./config.json');

const connection = async () => {
  try {
    await mongoose.connect(
     process.env.MONGO_URI,
      {
        //   await mongoose.connect("mongodb://127.0.0.1:27017/emaquis", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log('serveur mongo connecté');
  } catch (e) {
    console.log('connection failed : ', e);
  }
};
module.exports = { dbConnection: connection, mongoose };
