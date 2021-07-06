const express = require('express')
const router = express.Router()

const { requireAuth } = require('../app/middlewares/authMiddleware')
const usersController = require('../app/controllers/UsersController')

router.get('/', requireAuth, usersController.index)



module.exports = router