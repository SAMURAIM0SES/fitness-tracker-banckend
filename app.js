require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require('morgan');

// Setup your Middleware and API Router here

app.use(cors())
app.use(express.json())
app.use(morgan('dev'));


app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  
  console.log("<_____Body Logger END_____>");

  next();
});






const apiRouter = require('./api');
app.use('/api', apiRouter);

////need to add err handlers later(soonish)


module.exports = app;
