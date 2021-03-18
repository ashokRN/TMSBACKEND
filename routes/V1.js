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
router.get('/user/getAll',needsAuth, UserController.GetAll);
router.post('/user/addUser',needsAuth, UserController.addUser);

// DEPARTMENT ROUTE'S
router.post('/dept/create',needsAuth, DepartmentController.create );
router.get('/dept/getAll',needsAuth, DepartmentController.getAll);

// MODULE ROUTE'S
router.post('/module/create',needsAuth, ModuleController.create );
router.get('/module/getAll',needsAuth, ModuleController.getAll );


//TOOL ROUTE'S
router.post('/tool/create',needsAuth, ToolController.create );
router.get('/tool/getAll',needsAuth, ToolController.getAll ); 

//PROJECT ROUTE'S
router.post('/project/create', needsAuth, ProjectController.create);
router.get('/project/getAll', needsAuth, ProjectController.getAll);
router.get('/project/getOne/:id', needsAuth, ProjectController.getOne);
router.post('/project/addModule', needsAuth, ProjectController.addModule);
router.post('/project/addDeveloper', needsAuth, ProjectController.addDeveloper);


//TASK ROUTE'S
router.post('/task/create',needsAuth, TaskController.create );



module.exports = router;