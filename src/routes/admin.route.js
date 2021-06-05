const express = require('express')
const router = express.Router()



const adminController = require('../app/controllers/AdminController')

router.get('/truyen/them', adminController.createManga)
router.post('/them', adminController.create)
router.get('/', adminController.index)


module.exports = router