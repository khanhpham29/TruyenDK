const express = require('express')
const router = express.Router()

const { requireAuth } = require('../app/middlewares/authMiddleware')


const usersController = require('../app/controllers/UsersController')
router.use('/', requireAuth, usersController.index)

module.exports = router