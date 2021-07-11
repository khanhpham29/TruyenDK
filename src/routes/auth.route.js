const express = require('express')
const router = express.Router()
const authController = require('../app/controllers/AuthController')


router.get('/register', authController.registerGet)
router.post('/register', authController.registerPost)

// router.get('/signup', authController.signupGet)
// router.post('/signup', authController.signupPost)
router.get('/login', authController.loginGet)
router.post('/login', authController.loginPost)
router.get('/logout', authController.logout_get)


module.exports = router