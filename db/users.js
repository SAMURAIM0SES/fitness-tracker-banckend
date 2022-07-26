/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password}) {
  try{
    const { rows: [user] } = await client.query(
      `INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);

    delete user.password
    return user;
  }catch (error){
    throw error;
  }  
}  
  
async function getUser({ username, password }) 
{ if (!username || !password) {
  return
}
try {
  const user = await getUserByUsername(username)
if (user && user.password === password){ delete user.password; 
return user;}
if (user && user.password !== password){ 
return }
}
  catch (error) {
  throw error
}
}


async function getUserById(userId) {
  try {
const { rows: [user]
} = await client.query(`
  SELECT username, id FROM users WHERE id=$1;
`, [userId]);
if (!user) 
  return null;

  delete user.password;
  return user;

}catch (error){
 throw(error)
}
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
