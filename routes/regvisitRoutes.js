const express = require('express')
const router = express.Router()

const {
    registervisit,
    registervisitPost
} = require('../controllers/regvisitControllers')

router.route('/').get(registervisit)
router.route('/').post(registervisitPost)

module.exports = router