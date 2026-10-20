const minulugu = async (req, res)=>{
    try{
        res.render('minulugu')
    }
    catch (err){
        console.log(err)
        res.render('minulugu')
    }
}

module.exports = {
    minulugu
}