/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const { getUserByUsername, createUser } = require("../db/users");
const jwt = require("jsonwebtoken");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    console.log("helloo!!!")
  try {
    const { username, password } = req.body;
    const _user = await getUserByUsername(username);
    console.log(_user,"hey im a user!")
    
    if (_user) { res.status(401)
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) { res.status(401)
        console.log("line 21")
      next({
        name: "PasswordTooShort",
        message: "Password Too Short!",
      });
    } else { console.log("line 25")
      const user = await createUser({
        username,
        password,
      });
console.log(user, "line 30")
      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );

        res.send({
          message: "thank you for signing up",
          token,
          user,
        });
      }
    }
  } catch (error ) {
    next( error );
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
     const token = jwt.sign({
      id: user.id,
      username
     },process.env.JWT_SECRET, {
      expiresIn: "2w"
     })
      // create token & return to user
      res.send({ user, message: "you're logged in!", token });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
  return
});

// GET /api/users/me


// GET /api/users/:username/routines

module.exports = router;
