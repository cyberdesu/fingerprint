const con = require('../Database/database');

const getDatasiswa = (req,res) => {
    const sql = "SELECT * FROM siswa"
    con.query(sql,function(err,result){
        if (err) throw err;
        res.status(200).set('Access-Control-Allow-Origin', '*')
        res.send({
            success: true,
            data: result
        })
    })
}

module.exports = {getDatasiswa}