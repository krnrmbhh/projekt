const textRef = 'public/txt/vanasonad.txt'
const fs = require('fs').promises
const vanasona = async (req, res)=> {
    try{
        const data = await fs.readFile(textRef, 'utf8')
        let folkWisdom = data.split(';')
        let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]
        res.render('wisdom', {wisdom: wisdom})
    }
    catch (err){
        console.log(err)
        res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud!'})
    }
}

module.exports = {
    vanasona
}