require('dotenv').config();

const mongoose = require('mongoose');
//Mongo DB username and password (USERNAME) + (PASSWORD) is in the .env file
const connectionStr = `Your mongoDb URI`;
mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))  

mongoose.connection.on('error', err => {
  console.log(err)
})
