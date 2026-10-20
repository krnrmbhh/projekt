const express = require('express')
const router = express.Router()

//kasutatavad kontrollerid
const {
    eestifilm,
    eestifilmInimesed,
    eestifilmInimesedLisa,
    eestifilmInimesedLisaPost,
    eestifilmLisaFilmid,
    eestifilmLisaFilmidPost,
    eestifilmPersonInMovie,
    eestifilmPersonInMoviePost
} = require('../controllers/eestifilmControllers')

router.route('/').get(eestifilm)
router.route('/film_inimesed').get(eestifilmInimesed)
router.route('/lisa_film_inimesed').get(eestifilmInimesedLisa)
router.route('/lisa_film_inimesed').post(eestifilmInimesedLisaPost)
router.route('/lisa_filmid').get(eestifilmLisaFilmid)
router.route('/lisa_filmid').post(eestifilmLisaFilmidPost)
router.route('/lisa_person_in_movie').get(eestifilmPersonInMovie)
router.route('/lisa_person_in_movie').post(eestifilmPersonInMoviePost)


module.exports = router