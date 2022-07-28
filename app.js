require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
// Setup your Middleware and API Router here

app.use(cors())





module.exports = app;
