/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  
    const { rows: [user] } = await client.query(
      `INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING username;
    `, [username, password]);

    return user;
  }  
    
  
async function getUser({ username, password }) 
{ if (!username || !password) {
  return
}
try {
  const user = await getUserByUsername(username)
if (user && user.password === password){ delete user.password; 
return user;}
// const user = await getUserByUsername(username)
if (user && user.password !== password){ 
return }
}
  catch (error) {
  throw error
}
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) 

    {
      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
      `, [userName]);
  
      return user;
   
  
  }


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
