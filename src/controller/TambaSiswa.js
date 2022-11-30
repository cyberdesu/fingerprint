const con = require('../Database/database');

const tambahsiswa = (req,res) => {
    sql = "SELECT * FROM device WHERE device_id=1"
    let data = {
        nama : req.body.nama,
        kelas : req.body.kelas,
        jenis_kelamin: req.body.kelamin,
        no_ortu: req.body.no,
        add_finger: 1,
        del_finger: 0
    }

    con.query(sql,function(err,result){
        if (err) throw err;
        device = result[0].Mode

        if(device == "0"){

            sql2= "SELECT jam_masuk,jam_pulang FROM siswa WHERE kelas=? LIMIT 1"
            con.query(sql2,[data.kelas],function(err,result){
                if (err) throw err
                if (result.length !=0){
                    masuk = result[0].jam_masuk
                    pulang = result[0].jam_pulang
                    
                    const sql3 = "INSERT INTO siswa SET  ?, jam_masuk=?, jam_pulang=?"
                    con.query(sql3,[data,masuk,pulang],function(err,result){
                        if (err) throw err
                        res.send({
                            status: true,
                            message: "data berhasil ditambah",
                            data: result
                        })
                    })

                } else {
                    sql4 = "INSERT INTO siswa SET  ?"
                    con.query(sql4,data,function(err,result){
                        if (err) throw err
                        res.send({
                            status: true,
                            message: 'data berhasil ditambah2 '
                        })
                    })

                }
            })

        } else {
            res.status(500).send({
                status: false,
                message: "device sedang dalam mode absen, mohon diubah dulu ke mode daftar atau hapus"
            })
        }
    })
}

module.exports = {tambahsiswa}