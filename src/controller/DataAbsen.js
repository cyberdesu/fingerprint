const con = require('../Database/database');

const getDataAbsen = (req,res) => {
    kelas = req.params.kelas
    if (kelas == "sd"){
        sql = "SELECT absen.tanggal,siswa.nama,siswa.jenis_kelamin,siswa.kelas,absen.status FROM siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari WHERE siswa.kelas < 7 ORDER BY absen.id_absen DESC "
        con.query(sql,function(err,result){
            if (err) throw err
            res.send({
                data: result
            })
        })

    } else if (kelas == "smp"){
        sql2 = "SELECT absen.tanggal,siswa.nama,siswa.jenis_kelamin,siswa.kelas,absen.status FROM siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari WHERE siswa.kelas > 6 ORDER BY absen.id_absen DESC "
        con.query(sql2,function(err,result){
            if (err) throw err
            res.send({
                message: "data smp",
                data: result
            })
        })
    } else if (kelas < 10){
        sql3 = "SELECT absen.tanggal,siswa.nama,siswa.jenis_kelamin,siswa.kelas,absen.status FROM siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari WHERE siswa.kelas = ?"
        con.query(sql3,kelas,function(err,result){
            if (err) throw err
            res.send({
                data: result
            })
        })
    } else {
        res.status(404).send("kelas tidak ditemukan")
    }

}
module.exports = {getDataAbsen}