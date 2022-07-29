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
// 404 handler
app.get('*', (req, res) => {
  res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
});
////need to add err handlers later(soonish)
app.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
    error: error.message
  });
});
///general and 404


module.exports = app;
