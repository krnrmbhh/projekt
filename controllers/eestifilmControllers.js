const mysql = require('mysql2/promise');

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

//@desc home page for people involved in Estonian Film industry
//@route GET /eestifilm/lisa_film_inimesed
//@access public

//app.get('/eestifilm/lisa_film_inimesed', (req, res)=>{
const eestifilmInimesedLisa = (req, res) => {
	res.render('lisa_film_inimesed', {notice: 'Ootan sisestust!'});
};

//@desc home page for people involved in Estonian Film industry
//@route POST /eestifilm/lisa_film_inimesed
//@access public

//app.post('/eestifilm/lisa_film_inimesed', async (req, res)=>{
const eestifilmInimesedLisaPost = async (req, res) => {
	console.log(req.body);
	//kontrollime andmeid, teeme kõige lahjema kontrolli
	let deceasedDate = null;
	if(req.body.deceasedInput != ''){
		deceasedDate = req.body.deceasedInput;
	}
	
	//sünnikuupäeva võrdlemine
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		console.log("Andmed pole korrektsed!");
		return res.render('lisa_film_inimesed', {notice: 'Sisestatud andmed pole korrektsed!'});
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
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('lisa_film_inimesed', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaai salvestatud.'});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		
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
    eestifilmInimesedLisaPost
}