const mysql = require('mysql2/promise')

//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public
const eestifilm = (req,res) => {
res.render('eestifilm')
}

//@desc page for people involved in Estonian Film industry
//@route GET /eestifilm/film_inimesed
//@access public
const eestifilmInimesed = async (req,res)=>{
    let conn
    try{
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })
        //defineerime sql päringu
        let sqlReq = 'SELECT * FROM person'
        //käivitame päringu
        const [sqlRes] = await conn.execute(sqlReq)
        console.log(sqlRes)
        res.render('film_inimesed', {personList: sqlRes})
    }
    catch (err){
        console.log('Andmebaasiga suhtlemise viga' + err)
        res.render('film_inimesed', {personList: []})
    }
    finally{
        if (conn) {
            await conn.end()
        }
    }
}

//@desc page for adding people involved in Estonian Film industry
//@route GET /eestifilm/lisa_film_inimesed
//@access public

const eestifilmInimesedLisa = (req, res) => {
    res.render('lisa_film_inimesed', {
        notice: 'Ootan sisestust!',
        firstNameInput: '',
        lastNameInput: '',
        bornInput: '',
        deceasedInput: ''
    })
}

const eestifilmInimesedLisaPost = async (req, res) => {
    console.log(req.body)
    //sünnikuupäeva võrdlemine
    const bornDate = new Date(req.body.bornInput)
    const timeNow = new Date()
    //kontrollime andmeid, teeme kõige lahjema kontrolli
    let deceasedDate = null
    let deceasedDateObj = null
    if (req.body.deceasedInput != '') {
        deceasedDate = req.body.deceasedInput
        deceasedDateObj = new Date(req.body.deceasedInput)
    }
    const formData = {
        firstNameInput: req.body.firstNameInput,
        lastNameInput: req.body.lastNameInput,
        bornInput: req.body.bornInput,
        deceasedInput: req.body.deceasedInput
    }
    if (!req.body.firstNameInput) {
        return res.render('lisa_film_inimesed', {
          notice: 'Eesnimi on puudu!',
          ...formData
        })
      }
      if (!req.body.lastNameInput) {
        return res.render('lisa_film_inimesed', {
          notice: 'Perekonnanimi on puudu!',
          ...formData
        })
      }
      if (!req.body.bornInput || isNaN(bornDate.getTime())) {
        return res.render('lisa_film_inimesed', {
          notice: 'Sünnikuupäev on puudu või vale!',
          ...formData
        })
      }
      if (bornDate > timeNow) {
        return res.render('lisa_film_inimesed', {
          notice: 'Sünnikuupäev ei tohi olla tulevikus!',
          ...formData
        })
      }
      if (deceasedDateObj) {
        if (isNaN(deceasedDateObj.getTime())) {
          return res.render('lisa_film_inimesed', {
            notice: 'Surmakuupäev on vale!',
            ...formData
          })
        }
        if (deceasedDateObj < bornDate) {
          return res.render('lisa_film_inimesed', {
            notice: 'Surmakuupäev ei tohi olla enne sünnikuupäeva!',
            ...formData
          })
        }
        if (deceasedDateObj > timeNow) {
          return res.render('lisa_film_inimesed', {
            notice: 'Surmakuupäev ei tohi olla tulevikus!',
            ...formData
          })
        }
      }
    
    let conn
    try {
       conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
       })
       let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)'
       await conn.execute(sqlReq, [
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.bornInput,
        deceasedDate
       ])
       res.render('lisa_film_inimesed', {
        notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi ilusti salvestanud!',
        firstNameInput: '',
        lastNameInput: '',
        bornInput: '',
        deceasedInput: ''
    })
    } 
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga' + err)
        res.render('lisa_film_inimesed', {
            notice: 'Tekkis viga, andmeid ei salvestatud!',
            firstNameInput: req.body.firstNameInput,
            lastNameInput: req.body.lastNameInput,
            bornInput: req.body.bornInput,
            deceasedInput: req.body.deceasedInput
        })
    }
    finally{
        if (conn) {
            await conn.end()
        }
    }

}

const eestifilmLisaFilmid =(req, res) => {
    res.render('lisa_filmid', {
        notice: 'Ootan sisestust!',
        titleInput: '',
        releaseYearInput: '',
        durationInput: '',
        descriptionInput: ''
    })
}

const eestifilmLisaFilmidPost = async (req, res) => {
    console.log(req.body)
    const currentYear = new Date().getFullYear()
    const releaseYear = Number(req.body.releaseYearInput)
    const duration = Number(req.body.durationInput)
    let description = null
    if (req.body.descriptionInput && req.body.descriptionInput.trim() !== '') {
        description = req.body.descriptionInput.trim()
    }
    const formData = {
        titleInput: req.body.titleInput,
        releaseYearInput: req.body.releaseYearInput,
        durationInput: req.body.durationInput,
        descriptionInput: req.body.descriptionInput
    }
    if (!req.body.titleInput || req.body.titleInput.trim() === '') {
        return res.render('lisa_filmid', {
            notice: 'Filmi pealkiri on puudu!',
            ...formData
        })
    }
    if (!req.body.releaseYearInput || isNaN(releaseYear)) {
        return res.render('lisa_filmid', {
            notice: 'Esilinastusaasta on puudu või vale!',
            ...formData
        })
    }
    if (releaseYear > currentYear) {
        return res.render('lisa_filmid', {
            notice: 'Esilinastusaasta ei tohi olla tulevikus!',
            ...formData
        })
    }
    if (!req.body.durationInput || isNaN(duration) || duration <= 0) {
        return res.render('lisa_filmid', {
            notice: 'Kestus peab olema positiivne arv!',
            ...formData
        })
    }

    let conn
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })
        let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)'
        await conn.execute(sqlReq, [
            req.body.titleInput.trim(),
            releaseYear,
            duration,
            description
        ])
        res.render('lisa_filmid', {
            notice: req.body.titleInput.trim() + ' andmebaasi ilusti salvestatud!',
            titleInput: '',
            releaseYearInput: '',
            durationInput: '',
            descriptionInput: ''
        })
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga' + err)
        res.render('lisa_filmid', {
            notice: 'Tekkis viga, andmeid ei salvestatud!',
            ...formData
        })
    }
    finally {
        if (conn) {
            await conn.end()
        }
    }
}

async function loadRelationLists() {
    let conn
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })
        const [personList] = await conn.execute('SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name')
        const [movieList] = await conn.execute('SELECT id, title, release_year FROM movie ORDER BY title')
        const [professionList] = await conn.execute('SELECT id, title FROM profession ORDER BY id')
        return { personList, movieList, professionList }
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga' + err)
        return { personList: [], movieList: [], professionList: [] }
    }
    finally {
        if (conn) {
            await conn.end()
        }
    }
}

const eestifilmPersonInMovie = async (req, res) => {
    const lists = await loadRelationLists()
    res.render('lisa_person_in_movie', {
        notice: 'Ootan sisestust!',
        characterNameInput: '',
        personIdInput: '',
        movieIdInput: '',
        professionIdInput: '',
        ...lists
    })
}

const eestifilmPersonInMoviePost = async (req, res) => {
    console.log(req.body)
    const lists = await loadRelationLists()
    let characterName = null
    if (req.body.characterNameInput && req.body.characterNameInput.trim() !== '') {
        characterName = req.body.characterNameInput.trim()
    }
    const formData = {
        characterNameInput: req.body.characterNameInput,
        personIdInput: req.body.personIdInput,
        movieIdInput: req.body.movieIdInput,
        professionIdInput: req.body.professionIdInput,
        ...lists
    }
    if (!req.body.personIdInput) {
        return res.render('lisa_person_in_movie', {
            notice: 'Filmiinimene on valimata!',
            ...formData
        })
    }
    if (!req.body.movieIdInput) {
        return res.render('lisa_person_in_movie', {
            notice: 'Film on valimata!',
            ...formData
        })
    }
    if (!req.body.professionIdInput) {
        return res.render('lisa_person_in_movie', {
            notice: 'Amet / roll on valimata!',
            ...formData
        })
    }

    let conn
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })
        let sqlReq = 'INSERT INTO person_in_movie (character_name, person_id, movie_id, profession_id) VALUES (?,?,?,?)'
        await conn.execute(sqlReq, [
            characterName,
            Number(req.body.personIdInput),
            Number(req.body.movieIdInput),
            Number(req.body.professionIdInput)
        ])
        res.render('lisa_person_in_movie', {
            notice: 'Seos andmebaasi ilusti salvestatud!',
            characterNameInput: '',
            personIdInput: '',
            movieIdInput: '',
            professionIdInput: '',
            ...lists
        })
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga' + err)
        res.render('lisa_person_in_movie', {
            notice: 'Tekkis viga, andmeid ei salvestatud!',
            ...formData
        })
    }
    finally {
        if (conn) {
            await conn.end()
        }
    }
}

module.exports = {
    eestifilm,
    eestifilmInimesed,
    eestifilmInimesedLisa,
    eestifilmInimesedLisaPost,
    eestifilmLisaFilmid,
    eestifilmLisaFilmidPost,
    eestifilmPersonInMovie,
    eestifilmPersonInMoviePost
}