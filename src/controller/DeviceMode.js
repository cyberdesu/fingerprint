const con = require('../Database/database');

const DeviceMode = (req, res) => {
    let id = req.params.id
    let mode = req.params.mode
    const sql = "SELECT * FROM device WHERE device_id=? "
    if(id == !undefined && mode == "check"){
        con.query(sql,[id],function(err,result){
            if (err) throw err;
            res.set('Access-Control-Allow-Origin', '*')
            const data =result[0].Mode
            if(data == "0"){
                res.send({
                    success:true,
                    data: {
                        Mode:result[0].Mode,
                        status: "Mode Daftar/delete"
                    }

                })
            }
            else if(data == "1"){
                res.send({
                    success:true,
                    data: {
                        Mode:result[0].Mode,
                        status: "Presensi"
                    }
                })

            }

        })
    } else if (id == 0 && mode == "baru"){

    }
}

module.exports = {DeviceMode}