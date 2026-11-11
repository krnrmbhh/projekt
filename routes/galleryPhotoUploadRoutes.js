const express = require('express');
const multer = require('multer');
//sisselogimise kontrollvahevara
const checkLogin = require('../src/checkLogin');

const router = express.Router();
//kontrollin siselogimist
router.use(checkLogin.isLogin);

const upload = multer({dest: './public/gallery/orig/'})

//kasutatavad kontrollerid
const {
    galleryPhotoUpload,
	galleryPhotoUploadPost
} = require('../controllers/galleryPhotoUploadControllers');

router.route('/').get(galleryPhotoUpload);

router.route('/').post(upload.single('photoInput'), galleryPhotoUploadPost);

module.exports = router;