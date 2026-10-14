const mysql = require('mysql2/promise');

//abifunktsioon: kontrollib, kas sisestatud tekst (AAAA-KK-PP) on reaalne kuupäev
//new Date('2026-02-31') ei anna viga, vaid läheb märtsi peale, seega võrdleme tulemust algse tekstiga
const isRealDate = (dateStr) => {
	if(!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)){
		return false;
	}
	const d = new Date(dateStr);
	return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === dateStr;
};

//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public

//app.get('/eestifilm', (req, res)=>{
const eestifilm = (req,  res) => {
	res.render('eestifilm');
};


//@desc home page for people involved in Estonian Film industry
//@route GET /eestifilm/film_inimesed
//@access public

//app.get('/eestifilm/eestifilminimesed', async (req, res)=>{
const eestifilmInimesed = async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//defineerimine SQL päringu
		let sqlReq = 'SELECT * FROM person';
		//käivitame päringu
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('film_inimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('film_inimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}; 

//@desc page for adding people involved in Estonian Film industry
//@route GET /eestifilm/lisa_film_inimesed
//@access public

//app.get('/eestifilm/lisa_film_inimesed', (req, res)=>{
const eestifilmInimesedLisa = (req, res) => {
	//lehe laadimisel on kõik sisendid tühjad (null)
	res.render('lisa_film_inimesed', {
		notice: 'Ootan sisestust!',
		errors: {},
		firstName: null,
		lastName: null,
		born: null,
		deceased: null
	});
};

//@desc page for adding people involved in Estonian Film industry
//@route POST /eestifilm/lisa_film_inimesed
//@access public

//app.post('/eestifilm/lisa_film_inimesed', async (req, res)=>{
const eestifilmInimesedLisaPost = async (req, res) => {
	console.log(req.body);
	const firstName = req.body.firstNameInput || '';
	const lastName = req.body.lastNameInput || '';
	const bornInput = req.body.bornInput || '';
	const deceasedInput = req.body.deceasedInput || '';
	
	//iga sisendi kontroll eraldi, vead kogume objekti
	let errors = {};
	const timeNow = new Date();
	
	if(firstName.trim() === ''){
		errors.firstName = 'Eesnimi puudub!';
	}
	
	if(lastName.trim() === ''){
		errors.lastName = 'Perekonnanimi puudub!';
	}
	
	//sünnikuupäev
	let bornDate = null;
	if(bornInput === ''){
		errors.born = 'Sünnikuupäev puudub!';
	}
	else if(!isRealDate(bornInput)){
		errors.born = 'Sünnikuupäev pole reaalne kuupäev!';
	}
	else {
		bornDate = new Date(bornInput);
		if(bornDate > timeNow){
			errors.born = 'Sünnikuupäev ei saa olla tulevikus!';
		}
	}
	
	//surmakuupäev pole kohustuslik, kontrollime ainult siis, kui see on sisestatud
	let deceasedDate = null;
	if(deceasedInput != ''){
		if(!isRealDate(deceasedInput)){
			errors.deceased = 'Surmakuupäev pole reaalne kuupäev!';
		}
		else {
			deceasedDate = new Date(deceasedInput);
			if(deceasedDate > timeNow){
				errors.deceased = 'Surmakuupäev ei saa olla tulevikus!';
			}
			else if(bornDate && deceasedDate < bornDate){
				errors.deceased = 'Surmakuupäev ei saa olla varasem kui sünnikuupäev!';
			}
		}
	}
	
	//kui on vigu, saadame sisestatud väärtused tagasi, et neid poleks vaja uuesti kirjutada
	if(Object.keys(errors).length > 0){
		console.log('Andmed pole korrektsed!');
		return res.render('lisa_film_inimesed', {
			notice: 'Sisestatud andmed pole korrektsed!',
			errors: errors,
			firstName: firstName,
			lastName: lastName,
			born: bornInput,
			deceased: deceasedInput
		});
	}
	
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, diceased) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			firstName,
			lastName,
			bornInput,
			deceasedInput != '' ? deceasedInput : null
		]);
		//korrektse salvestuse puhul jätame sisendid tühjaks (null)
		res.render('lisa_film_inimesed', {
			notice: firstName + ' ' + lastName + ' andmebaasi salvestatud.',
			errors: {},
			firstName: null,
			lastName: null,
			born: null,
			deceased: null
		});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		//andmebaasi viga: sisestatud väärtused jäävad alles
		res.render('lisa_film_inimesed', {
			notice: 'Salvestamine ebaõnnestus, proovi hiljem uuesti!',
			errors: {},
			firstName: firstName,
			lastName: lastName,
			born: bornInput,
			deceased: deceasedInput
		});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
	
};

//@desc page for adding movies
//@route GET /eestifilm/lisa_film
//@access public
const eestifilmFilmLisa = (req, res) => {
	res.render('lisa_film', {
		notice: 'Ootan sisestust!',
		errors: {},
		title: null,
		productionYear: null,
		duration: null,
		description: null
	});
};

//@desc page for adding movies
//@route POST /eestifilm/lisa_film
//@access public
const eestifilmFilmLisaPost = async (req, res) => {
	console.log(req.body);
	const title = req.body.titleInput || '';
	const productionYear = req.body.productionYearInput || '';
	const duration = req.body.durationInput || '';
	const description = req.body.descriptionInput || '';
	
	let errors = {};
	const thisYear = new Date().getFullYear();
	
	if(title.trim() === ''){
		errors.title = 'Filmi pealkiri puudub!';
	}
	
	if(productionYear === ''){
		errors.productionYear = 'Valmimisaasta puudub!';
	}
	else {
		const yearNum = Number(productionYear);
		if(!Number.isInteger(yearNum) || yearNum < 1895 || yearNum > thisYear){
			errors.productionYear = 'Valmimisaasta peab olema täisarv vahemikus 1895 kuni ' + thisYear + '!';
		}
	}
	
	if(duration === ''){
		errors.duration = 'Kestus puudub!';
	}
	else {
		const durationNum = Number(duration);
		if(!Number.isInteger(durationNum) || durationNum < 1 || durationNum > 1000){
			errors.duration = 'Kestus peab olema täisarv minutites (1 kuni 1000)!';
		}
	}
	
	if(Object.keys(errors).length > 0){
		return res.render('lisa_film', {
			notice: 'Sisestatud andmed pole korrektsed!',
			errors: errors,
			title: title,
			productionYear: productionYear,
			duration: duration,
			description: description
		});
	}
	
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO movie (title, production_year, duration, description) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			title,
			productionYear,
			duration,
			description.trim() !== '' ? description : null
		]);
		res.render('lisa_film', {
			notice: 'Film "' + title + '" andmebaasi salvestatud.',
			errors: {},
			title: null,
			productionYear: null,
			duration: null,
			description: null
		});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('lisa_film', {
			notice: 'Salvestamine ebaõnnestus, proovi hiljem uuesti!',
			errors: {},
			title: title,
			productionYear: productionYear,
			duration: duration,
			description: description
		});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding positions (jobs) in films
//@route GET /eestifilm/lisa_amet
//@access public
const eestifilmAmetLisa = (req, res) => {
	res.render('lisa_amet', {
		notice: 'Ootan sisestust!',
		errors: {},
		positionName: null,
		description: null
	});
};

//@desc page for adding positions (jobs) in films
//@route POST /eestifilm/lisa_amet
//@access public
const eestifilmAmetLisaPost = async (req, res) => {
	console.log(req.body);
	const positionName = req.body.positionNameInput || '';
	const description = req.body.descriptionInput || '';
	
	let errors = {};
	
	if(positionName.trim() === ''){
		errors.positionName = 'Ametinimetus puudub!';
	}
	
	if(Object.keys(errors).length > 0){
		return res.render('lisa_amet', {
			notice: 'Sisestatud andmed pole korrektsed!',
			errors: errors,
			positionName: positionName,
			description: description
		});
	}
	
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO `position` (position_name, description) VALUES (?,?)';
		await conn.execute(sqlReq, [
			positionName,
			description.trim() !== '' ? description : null
		]);
		res.render('lisa_amet', {
			notice: 'Amet "' + positionName + '" andmebaasi salvestatud.',
			errors: {},
			positionName: null,
			description: null
		});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('lisa_amet', {
			notice: 'Salvestamine ebaõnnestus, proovi hiljem uuesti!',
			errors: {},
			positionName: positionName,
			description: description
		});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

module.exports = {
	eestifilm,
	eestifilmInimesed,
	eestifilmInimesedLisa,
	eestifilmInimesedLisaPost,
	eestifilmFilmLisa,
	eestifilmFilmLisaPost,
	eestifilmAmetLisa,
	eestifilmAmetLisaPost
};
