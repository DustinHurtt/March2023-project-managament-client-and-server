var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')


const Project = require('../models/Project');
const Task = require('../models/Task')

const isAuthenticated = require('../middleware/isAuthenticated')



router.get('/', isAuthenticated, (req, res, next) => {
    Project.find()
      .populate('tasks')
      .then(allProjects => res.json(allProjects))
      .catch(err => res.json(err));
  });

router.post("/", (req, res, next) => {

    const { title, description } = req.body;
   
    Project.create({ title, description, tasks: [] })
      .then(response => res.json(response))
      .catch(err => res.json(err));
  });

// routes/project.routes.js
// ...

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get('/:projectId', (req, res, next) => {
    console.log("Line 30")
    const { projectId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    // Each Project document has a `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Project.findById(projectId)
      .populate('tasks')
      .then(project => res.status(200).json(project))
      .catch(error => res.json(error));
  });
  
  
  // PUT  /api/projects/:projectId  -  Updates a specific project by id
  router.put('/:projectId', (req, res, next) => {
    const { projectId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Project.findByIdAndUpdate(projectId, req.body, { new: true })
      .then((updatedProject) => res.json(updatedProject))
      .catch(error => res.json(error));
  });
  
  
  // DELETE  /api/projects/:projectId  -  Deletes a specific project by id
  router.delete('/:projectId', (req, res, next) => {
    const { projectId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Project.findByIdAndRemove(projectId)
      .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
      .catch(error => res.json(error));
  });
  
  
  // ...
  
   

module.exports = router;