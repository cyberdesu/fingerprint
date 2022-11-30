const con = require('../Database/database');

const deletefingerprint = (req, res) => { //FOR ARDUINO

    deleteID = req.params.deleteID
    Mode = req.params.Mode

    if(deleteID = "check"){
        sql = "SELECT * FROM device WHERE device_id=?"
        con.query(sql,[Mode],function(err,result){
            if (err) throw err;
            if(result.length === 0) {
                res.status(500).send({
                    status: false,
                    message: "device mode salah"

                })
            } 
            else if (result.length > 0){
                data1 = result[0].Mode
                if(data1 == "0"){
                    sql2 = "SELECT id FROM siswa WHERE del_finger=1 LIMIT 1"
                    con.query(sql2,[deleteID],function(err,result){
                        if (err) throw err
                        //console.log(data)
                        if(result.length === 0){
                            res.send({
                                message: 'kosong',
                                data: result
                            })
                        } else if (result.length > 0){
                            res1 = result[0].id
                            sql3 = "DELETE FROM siswa WHERE del_finger=1 LIMIT 1"
                            con.query(sql3,function(err,result){
                                if (err) throw err
                                res.send({
                                    status: true,
                                    Message: "data berhasil dihapus",
                                    data: res1
                                })
                            })
    
                        }
    
                    })

                } else{
                    res.send({
                        status: false,
                        message: "device sedang dalam Mode Absen"
                    })
                }

            }
            
        })
    }

}

module.exports = {deletefingerprint}