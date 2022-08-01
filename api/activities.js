const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  try {
    const routines = await getPublicRoutinesByActivity({
      id: req.params.activityId,
    });
    if(!routines){
    next({
        name: "CannotFindActivity",
        message: `Activity ${req.params.activityId} not found`
      });////////getting an array back???
    }
     else {
        if (routines) {
            res.send(routines);
      
    }
  }} catch (error) {
    next(error);
  }
});

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const _activity = await getActivityByName(name);
    if (_activity) {
      res.status(401);
      next({
        name: "ActivityExistsError",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const activity = await createActivity({ name, description });
      res.send(activity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { name } = req.body;
    const originalActivity = await getActivityById(activityId);
    const _name = await getActivityByName(name);
    if (!originalActivity) {
      next({
        error: res.status(404),
        name: "ActivityNotFound",
        message: `Activity ${activityId} not found`,
      });
    }
    if (_name) {
      next({
        error: res.status(401),
        name: "ActivitNameAlreadyExists",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const { name, description } = req.body;
      const updatedActivity = await updateActivity({
        id: activityId,
        name,
        description,
      });
      if (updateActivity) {
        res.send(updatedActivity);
        next();
      }
    }
  } catch ({ error }) {
    next({ error });
  }
});

module.exports = router;
