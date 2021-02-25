const express = require('express')
const router = express.Router()

const passport = require('passport')
const needsAuth = passport.authenticate('jwt', {session: false})
require('./../middleware/Passport')(passport)

const UserController = require('../controllers/User.controller');


router.get('/', (req,res ) => {
    return res.status(200).json({message:'Welcome TMS Application, Now Route is ON!'});
});

router.post('/user/create', UserController.Reg_user);
router.post('/user/login', UserController.Login);
router.get('/user/get',needsAuth, UserController.Get_User);


module.exports = router;