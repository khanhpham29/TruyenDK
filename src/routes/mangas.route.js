const express = require('express')
const router = express.Router()



const mangasController = require('../app/controllers/MangasController')

router.get('/:slug', mangasController.show)
router.get('/', mangasController.index)


module.exports = router