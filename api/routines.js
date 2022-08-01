const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
      const routines = await getAllPublicRoutines();
      res.send(routines);
    } catch (error) {
      next(error);
    }
  });

// POST /api/routines
router.post("/", requireUser, async (req, res, next)=>{
    try {
        const {name, goal} =req.body
        const newRoutine = await createRoutine({creatorId: req.user.id, isPublic: req.body.isPublic, name, goal})
        if(newRoutine){
            res.send(newRoutine)
            next({
                name:"error",
                message:"error"})
        
        }
        
    
    
    } catch (error) {
        next(error)
    }
})
    

// PATCH /api/routines/:routineId
// router.patch("/:routineId", requireUser, async (req, res, next)=>{
// try {
//     const {isPublic, name, goal} = req.body
//     const {routineId} = req.params
//     const oldRoutine = await getRoutineById(routineId)
//     if(req.user.id !== oldRoutine.creatorId){
//         res.status(403)
//         next({
//             name:"error",
//             message:"You must be logged in to perform this action"
//         })
//     }else{
        
//         const newRoutine = await updateRoutine({id: routineId, isPublic, name, goal})
//         if(newRoutine)
//         res.send(newRoutine)
//     }
// } catch (error) {
//     next(error)
// }
// })
router.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
  
    const updateFields = {};
  
    if (isPublic) {
      updateFields.isPublic = isPublic;
    }
  
    if (name) {
      updateFields.name = name;
    }
  
    if (goal) {
      updateFields.goal = goal;
    }
  
    try {
      const originalroutine = await getRoutineById(routineId);
  
      if (originalroutine.creatorId === req.user.id) {
        const updatedRoutine = await updateRoutine(routineId, updateFields);
        res.send(updatedRoutine )
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
