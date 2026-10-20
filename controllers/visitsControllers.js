const regTextRef = 'public/txt/visits.txt'


const visits = async (req, res)=>{
    try{
        const data = await fs.readFile(regTextRef, 'utf8')
        let lines = data.trim().split('\n').filter(line => line.trim() !== '')
        let parts = (lines[lines.length - 1] || '').split(';')
        res.render('visits', {name: parts[0], date: parts[1], time: parts[2], day: parts[3]})
    }
    catch (err){
        console.log(err)
        res.render('visits', {name: '', date: '', time: '', day: ''})
    }
}

module.exports = {
    visits
}