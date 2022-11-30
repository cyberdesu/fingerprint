const con = require('../Database/database');

const getdatakelas = (req,res) => {
    kelas = req.params.kelas
    const sql = "SELECT * FROM siswa WHERE kelas=?"

    if(kelas =="smp"){
        sql2= "SELECT * FROM siswa WHERE kelas > 6"
        con.query(sql2,function(err,result){
            if (err) throw err;
            res.set('Access-Control-Allow-Origin', '*').send({
                status: true,
                message: "menampilkan data siswa SMP",
                data: result
            })
        })
    } else if (kelas == "sd"){
        sql3 = "SELECT * FROM siswa WHERE kelas < 7"
        con.query(sql3,function(err,result){
            if (err) throw err
            res.set('Access-Control-Allow-Origin', '*').send({
                status: true,
                message: "menampilkan data siswa SD",
                data: result
            })
        })
    } else if (kelas < 10){
        con.query(sql,[kelas],function(err,result){
            if (err) throw err;
            if (result.length == 0){
                res.set('Access-Control-Allow-Origin', '*').send({
                    status: false,
                    message: "data kosong"
                })
            }
            else {
                res.status(200).set('Access-Control-Allow-Origin', '*').send({
                    status: true,
                    message: "data didapatkan",
                    data: result
        
                })
            }
        })
    } else {
        res.status(404).send("kelas tidak ditemukan")
    }

}

module.exports =  {getdatakelas}