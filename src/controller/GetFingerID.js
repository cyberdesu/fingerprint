const con = require('../Database/database');

const getFingerID = (req,res) => {
    const getfingerid = req.params.getfingerid
    const id = req.params.id

    sql = "SELECT* FROM device WHERE device_id=?"
    con.query(sql,[id],function(err,result){
        if (err) throw err;
        data = result[0].Mode
        if(data != "0"){
            res.status(500).send({
                status: false,
                message: "device sedang dalam mode presensi"
            })
        } else {
            if(getfingerid == "get_id"){
                sql2 = "SELECT id FROM siswa WHERE add_finger=1 LIMIT 1";
                con.query(sql2,[id],function(err,result){
                    if (err) throw err;
                    if (result.length > 0){
                        res1 = result[0].id
                        res.send({
                            data: res1
                        })


                    } else {
                        res.status(404).send({
                            status: false,
                            message: "tidak ada data id yang akan ditambahkan"
                        })
                    }

                    
                })
            } else{
                res.status(500).send({
                    status: false,
                    message: "get_id tidak ada di url?"

                })
            }
        }
    })

}

module.exports = {getFingerID}