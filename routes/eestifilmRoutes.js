const express = require('express');
const router = express.Router();

//kasutatavad kontrollerid
const {
    eestifilm,
    eestifilmInimesed,
    eestifilmInimesedLisa,
    eestifilmInimesedLisaPost
} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);

router.route('/film_inimesed').get(eestifilmInimesed);

router.route('/lisa_film_inimesed').get(eestifilmInimesedLisa);

router.route('/lisa_film_inimesed').post(eestifilmInimesedLisaPost);

module.exports = router;

