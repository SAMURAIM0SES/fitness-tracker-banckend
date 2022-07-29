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
        message: "A user by that username already exists",
      });
    } else if (password.length < 8) { res.status(401)
        console.log("line 21")
      next({
        name: "PasswordTooShort",
        message: "Password must be at least 8 characters",
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
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
