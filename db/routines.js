/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");
const { getUserByUsername, getUser, getUserById } = require("./users");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const { rows: [routines] } = await client.query(
      `INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES($1, $2, $3, $4)  
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routines;
  }catch (error){
    throw error;
  }  
}  

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {
 try{
   const { rows: routines } = await client.query(
    `SELECT routines.*, users.username AS "creatorName"
    FROM routines JOIN users ON routines."creatorId" = users.id;
    
  `);
  return attachActivitiesToRoutines(routines);
   }catch(error){
    throw error;
  }
}

async function getAllPublicRoutines() {
  try{
    
    const { rows: routines } = await client.query(
      `SELECT routines.*, users.username AS "creatorName"
      FROM routines JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = true;
      `);
   return attachActivitiesToRoutines(routines);
    }catch(error){
     throw error;
   }
 }


async function getAllRoutinesByUser({ username }) {
  try{
    const {creatorName} = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `SELECT routines.*, users.username AS "creatorName"
      FROM routines JOIN users ON routines."creatorId" = users.id
      WHERE "creatorId" = $1;
     
      
      
    `[creatorName]);
    return attachActivitiesToRoutines(routines);
     }catch(error){
      throw error;
    }
  }


async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
