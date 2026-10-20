const express = require('express')
const router = express.Router()

const {
    minulugu
} = require('../controllers/minuluguControllers')

router.route('/').get(minulugu)

module.exports = router