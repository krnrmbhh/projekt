const express = require('express')
const router = express.Router()

const {
    visits
} = require('../controllers/visitsControllers')

router.route('/').get(visits)


module.exports = router