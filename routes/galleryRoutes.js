const express = require('express');
//sisselogimise kontrolli vahevara
const checkLogin = require('../src/checkLogin');

const router = express.Router();
//kontrollin sisselogimist
router.use(checkLogin.isLogin);

//kasutatavad kontrollerid
const {
	galleryPage
	} = require('../controllers/galleryControllers');

router.route('/').get(galleryPage);

module.exports = router;