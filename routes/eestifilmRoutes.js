const express = require('express');
const router = express.Router();

//kasutatavad kontrollerid
const {
	eestifilm,
	eestifilmInimesed,
	eestifilmInimesedLisa,
	eestifilmInimesedLisaPost,
	eestifilmFilmLisa,
	eestifilmFilmLisaPost,
	eestifilmAmetLisa,
	eestifilmAmetLisaPost
} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);

router.route('/film_inimesed').get(eestifilmInimesed);

router.route('/lisa_film_inimesed').get(eestifilmInimesedLisa);

router.route('/lisa_film_inimesed').post(eestifilmInimesedLisaPost);

router.route('/lisa_film').get(eestifilmFilmLisa);

router.route('/lisa_film').post(eestifilmFilmLisaPost);

router.route('/lisa_amet').get(eestifilmAmetLisa);

router.route('/lisa_amet').post(eestifilmAmetLisaPost);

module.exports = router;
