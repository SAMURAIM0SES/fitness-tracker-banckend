/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser } = require('./utils');
const {getUserByUsername, createUser} = require('../db/users')
const jwt = require('jsonwebtoken');


// POST /api/users/register
router.post('/api/users/register', async (req, res, next) => {
    const { username, password} = req.db;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
      if(password.length < 9){
        next({
            name:'PasswordTooShort',
            message: 'password needs to be at least 8 characters'
        })
      }

      const user = await createUser({
        username,
        password
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
