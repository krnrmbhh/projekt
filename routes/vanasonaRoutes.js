const express = require('express')
const router = express.Router()

const {
    vanasona
} = require('../controllers/vanasonaControllers')

router.route('/').get(vanasona)

module.exports = router