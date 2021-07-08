const express = require('express')
const router = express.Router()

const { requireAuth } = require('../app/middlewares/authMiddleware')


const usersController = require('../app/controllers/UsersController')
router.use('/', requireAuth, usersController.index)

router.get('/autocomplete', usersController.autocomplete)

module.exports = router