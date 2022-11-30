const con = require('../Database/database');

const editjadwal = (req,res) => {
    const kelas = req.params.kelas
    let data = {
        jam_masuk : req.body.masuk,
        jam_pulang : req.body.pulang
    }
    sql = "SELECT jam_masuk,jam_pulang FROM siswa WHERE kelas=?"
    con.query(sql,kelas,function(err,result){
        if (err) throw err
        if(result.length > 0){
            sql2 ="UPDATE siswa SET ? WHERE kelas=?"
            con.query(sql2,[data,kelas],function(err,result){
                if (err) throw err
                res.send(result)
            })
        }
        
    })
}

module.exports = {editjadwal}