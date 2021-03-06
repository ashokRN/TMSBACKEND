const express = require('express')
const router = express.Router()

const passport = require('passport')
const needsAuth = passport.authenticate('jwt', {session: false})
require('./../middleware/Passport')(passport)

const UserController = require('../controllers/User.ctrl');
const DepartmentController = require('../controllers/Department.ctrl');
const ModuleController = require('../controllers/Module.ctrl');
const ToolController = require('../controllers/Tool.ctrl');
const ProjectController = require('../controllers/Project.ctrl');
const TaskController = require('../controllers/Task.ctrl');


router.get('/', (req,res ) => {
    return res.status(200).json({message:'Welcome TMS Application, Now Route is ON!'});
});

// USER ROUTE'S
router.post('/user/create', UserController.Reg_user);
router.post('/user/login', UserController.Login);
router.get('/user/get',needsAuth, UserController.Get_User);

// DEPARTMENT ROUTE'S
router.post('/dept/create',needsAuth, DepartmentController.create );
router.get('/dept/getAll',needsAuth, DepartmentController.getAll);

// MODULE ROUTE'S
router.post('/module/create',needsAuth, ModuleController.create );
router.get('/module/getAll',needsAuth, ModuleController.getAll );


//TOOL ROUTE'S
router.post('/tool/create',needsAuth, ToolController.create );

//PROJECT ROUTE'S
router.post('/project/create', needsAuth, ProjectController.create);


//TASK ROUTE'S
router.post('/task/create',needsAuth, TaskController.create );



module.exports = router;