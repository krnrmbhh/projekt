const express = require('express');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks, koos async võimalustega
const mysql = require('mysql2/promise');
const dateET = require('./src/dateTimeET');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//käivitan express() funktsiooni ja tähistan töötava asja nimega "app"
const app = express();
//määrame veebilehe mallide järgi renderdamise mootori (EJS)
app.set('view engine', 'ejs');
//muudan "public" veebiserverile kättesaadavaks
app.use(express.static('public'));
//hakkame päringuid parsima
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', (req, res)=>{
	//res.send('Express.js veeb käivitus!');
	const day = dateET.dayET();
	const date = dateET.dateET(0);
	const time = dateET.timeET();
	res.render('index', {day: day, date: date, time: time});
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, 'utf8');
		let folkWisdom = data.split(';');
		let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
		res.render('wisdom', {wisdom: wisdom});
	}
	catch (err){
		console.log(err);
		res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud!'});
	}
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
	console.log(req.body);
	try {
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ';');
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}	
});

app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
});

app.get('/eestifilm/film_inimesed', (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection({
			host: 'localhost', 
			user: 'if26'
			password: 'ifikas26'
			database: 'if26_karina_rumbahh_AA'
		});
		//defineerimine SQL päringu
		let sqlReq = 'SELECT * FROM person';
		//käivitame päringu
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('film_inimesed');
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('film_inimesed');
	}
	
});

app.listen(5322);