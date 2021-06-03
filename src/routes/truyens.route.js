const express = require('express')
const router = express.Router()
const truyen  = require('../app/models/Truyen')

const truyensController = require('../app/controllers/TruyensController')

router.get('/:id_truyen?', truyensController.findById)
router.use('/', truyensController.index)


module.exports = router