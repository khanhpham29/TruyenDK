const express = require('express')
const router = express.Router()



const truyensController = require('../app/controllers/TruyensController')

router.get('/:slug', truyensController.show)
router.get('/', truyensController.index)


module.exports = router