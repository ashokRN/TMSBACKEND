const express = require('express')
const router = express.Router()

const passport = require('passport')
// const needsAuth = passport.authenticate('jwt', {session: false})
// require('./../middleware/Passport')(passport)


router.get('/', (req,res ) => {
    return res.status(200).json({message:'Welcome TMS Application, Now Route is ON!'});
})


module.exports = router;