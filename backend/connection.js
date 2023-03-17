require('dotenv').config();

const mongoose = require('mongoose');
//Mongo DB username and password (USERNAME) + (PASSWORD) is in the .env file
const connectionStr = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@cluster0.ddm4szo.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))  

mongoose.connection.on('error', err => {
  console.log(err)
})