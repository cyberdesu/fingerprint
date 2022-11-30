const con = require('../Database/database');

const confirmID = (req,res) => {
    id = req.params.id
    const confirmid = req.params.confirmid

    sql = "SELECT * FROM device WHERE device_id=?"

    con.query(sql,id,function(err,result){
        if (err) throw err;
        mode = result[0].Mode
        if(mode == "0"){
            sql2 = "SELECT id FROM siswa WHERE add_finger=1 LIMIT 1"
            con.query(sql2,function(err,result){
                console.log(result)
                if(result.length === 0){
                    res.status(404).send({
                        status: false,
                        message: "tidak ada fingeprint yg akan ditambah"
                    })
                } else  {
                    res1 = result[0].id
                    if(res1 == confirmid){
                        sql3 = "UPDATE siswa SET add_finger=0 WHERE id=?"
                        con.query(sql3,confirmid,function(err,result){
                            if (err) throw err;
                            res.send({
                                status: true,
                                message: "fingerprint telah suskses ditambahkan"
                            })
                        })

                    } else {
                        res.status(404).send({
                            status: false,
                            message: "id fingerprint tidak cocok dengan database"
                        })
                    }
                }
            })
        } else {
            res.status(500).send({
                status: false,
                message: "silahkan ubah terlebih dahulu ke Mode Daftar"
            })
        }
    })

}

module.exports = {confirmID}