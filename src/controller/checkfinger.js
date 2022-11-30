const con = require('../Database/database');

const checkfingerID = (req,res) => {
    const mode = req.params.mode
    const finger = req.params.finger
    sql = "SELECT * FROM device WHERE device_id=?"
    sql2 = "SELECT * FROM siswa WHERE id=?"

    con.query(sql,[mode],function(err,result){
        if (err){
            console.log(err)
            throw err
        }
        res1 = result[0].Mode

        if (res1 == 1){
            con.query(sql2,[finger],function(err,result){
                if (err) throw err;
                if (result.length > 0){
                    add = result[0].add_finger
                    masuk = result[0].jam_masuk
                    pulang = result[0].jam_pulang
                    uname = result[0].nama
    
                    if(add == 0){
                        const addZero = i => {
                            if (i < 10) {i = "0" + i}
                            return i;
                          }
                        const waktu = new Date()
                        const jam = addZero(waktu.getHours())+":"+addZero(waktu.getMinutes())+":"+addZero(waktu.getSeconds())
                        const month = ["01","02","03","04","05","06","07","08","09","10","11","12"];
                        const tanggal = addZero(waktu.getFullYear())+"-"+month[waktu.getMonth()]+"-"+addZero(waktu.getDate())
    
                        sql3 = "SELECT tanggal FROM absen WHERE id_sidikjari=? ORDER BY tanggal DESC LIMIT 1"
                        con.query(sql3,finger,function(err,result){
                            if (err) throw err;
                            if(result.length == 0){
                                if(jam <= masuk && jam <= pulang){
                                    sql4 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'hadir',NOW(),'3')"
                                    con.query(sql4,[finger,jam,pulang],function(err,result){
                                        if (err) throw err;
                                        success = result.affectedRows
                                        if(success == 1){
                                            res.send("selamat datang1 "+uname)
    
                                        }
                                    })
                                } else if (jam > masuk && jam <= pulang){
                                    sql5 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'telat hadir',NOW(),'3')"
                                    con.query(sql5,[finger,jam,pulang],function(err,result){
                                        if (err) throw err;
                                        success = result.affectedRows
                                        if(success == 1){
                                            res.send("telat1"+uname)
    
                                        }
                                    })
                                } else {
                                    res.send("sudah absen woi")
                                    console.log(masuk)
                                    console.log(pulang)
                                }
                            }  else if (result.length > 0) {
                                if(jam < masuk){
                                    console.log("blom telat coy")
                                }
                                else{
                                    console.log("lu telat ajg")
                                }
                                tgl = new Date(result[0].tanggal)
                                tgl_final = addZero(tgl.getFullYear())+"-"+month[tgl.getMonth()]+"-"+addZero(tgl.getDate())


                                if(jam <= masuk && jam <= pulang &&  tgl_final != tanggal){
                                    console.log("tanggal berapa:"+tanggal)
                                    sql6 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'hadir',NOW(),'3')"
                                    con.query(sql6,[finger,jam,pulang],function(err,result){
                                        if (err) throw err;
                                        success = result.affectedRows
                                        if(success == 1){
                                         
                                            res.send("selamat datang3 "+uname)
    
                                        }
                                        
                                    })
                                } else if (jam > masuk && jam <= pulang && tgl_final != tanggal){
                                    sql7 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'telat hadir',NOW(),'3')"
                                    con.query(sql7,[finger,jam,pulang],function(err,result){
                                        if (err) throw err;
                                        success = result.affectedRows
                                        if(success == 1){
                                            res.send("telat2"+uname)
    
                                        }
                                    })
                                } else {
                                    res.send("sudah absen woi 2")
                                    console.log(tanggal)
                                    console.log("sudah absen pada tanggal:"+tgl_final)
                                }
                            }
                            
                        })
                        
                    } else {
                        res.status(500).send("tidak ada id yang akan diabsen")
                    }
                    
                } else {
                    res.status(404).send("id siswa tidak ditemukan")
                }
   

            })
            
        } else if (res1 == 0){
            sql = "SELECT * FROM siswa WHERE id=?"
            con.query(sql,finger,function(err,result){
                if (err) throw err
                if (result.length == 0){
                    res.send({
                        status: false,
                        message: "device sedang dalam mode daftar atau hapus",
                        data: "id tidak ditemukan saat absensi"
                    })
                } else {
                    add = result[0].add_finger
                    del = result[0].del_finger

                    if (add == 0 && del == 0  ){
                        res.send("id sudah sukses ditambahkan ke database")
                    }
                }

            })
        }
    })
    
}

module.exports = {checkfingerID}