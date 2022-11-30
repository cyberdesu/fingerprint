const con = require('../Database/database');

const checkJadwal = (req,res) => {
    sql="SELECT kelas,jam_masuk,jam_pulang,COUNT(*) AS TOTAL FROM siswa GROUP BY kelas"
    con.query(sql,function(err,result){
        if(err) throw err
        res.send({
            status: true,
            message: "menampilkan total siswa",
            data: result
        })
    })
}
module.exports = {checkJadwal}