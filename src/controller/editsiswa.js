const con = require('../Database/database');

const editsiswa = (req,res) => {
    const id = req.params.id
    let data = {
        nama : req.body.nama,
        kelas : req.body.kelas,
        jenis_kelamin: req.body.kelamin,
        no_ortu: req.body.no,
    }
    sql = "SELECT id FROM siswa WHERE id =? LIMIT 1"
    con.query(sql,id,function(err,result){
        if (err) throw err;
        if (result.length == 0){
            res.send("data tidak ada")
        } else {
            idsiswa = result[0].id
            sql2 = "UPDATE siswa SET ? WHERE id =?"
            con.query(sql2,[data,idsiswa],function(err,result){

                res.send({
                    status: true,
                    message: "data telah berhasil di update"

                })

            })
        }
    })
    
}

module.exports = {editsiswa}