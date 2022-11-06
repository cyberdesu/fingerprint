const router = require('express').Router();
const { response } = require('express');
const con = require('./Database/database');


const home = (req,res) => {
    res.status(200)
    res.render('/absensi/home/halaman.html',{root: __dirname})
}
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

const deleteid = (req,res) => {
    id = req.params.id
    sql = "UPDATE siswa SET del_finger=1 WHERE id=?"
    con.query(sql,id,function(err,result){
        if (err) throw err
        res.send({
            status: true,
            message: "data telah berhasil dihapus"
        })
    })
}

const getDatasiswa = (req,res) => {
    const sql = "SELECT * FROM siswa"
    con.query(sql,function(err,result){
        if (err) throw err;
        res.status(200).set('Access-Control-Allow-Origin', '*')
        res.send({
            success: true,
            data: result
        })
    })
}


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

const editMode = (req,res) => {
    const sql = "UPDATE device SET ? WHERE device_id=?"
    let data = {
        nama_device: req.body.nama,
        Mode: req.body.mode
    }
    let id = req.params.id
    con.query(sql,[data,id],function(err,result){
        if (err) throw err;
        res.send({
            success: true,
            data: result,

        })
    })
}

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
                                    sql4 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'hadir',NOW(),'2')"
                                    con.query(sql4,[finger,jam,pulang],function(err,result){
                                        if (err) throw err;
                                        success = result.affectedRows
                                        if(success == 1){
                                            res.send("selamat datang1 "+uname)
    
                                        }
                                    })
                                } else if (jam > masuk && jam <= pulang){
                                    sql5 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'telat hadir',NOW(),'2')"
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
                                    sql6 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'hadir',NOW(),'2')"
                                    con.query(sql6,[finger,jam,pulang],function(err,result){
                                        if (err) throw err;
                                        success = result.affectedRows
                                        if(success == 1){
                                         
                                            res.send("selamat datang3 "+uname)
    
                                        }
                                        
                                    })
                                } else if (jam > masuk && jam <= pulang && tgl_final != tanggal){
                                    sql7 = "INSERT INTO absen (id_sidikjari,jam_masuk,jam_pulang,status,tanggal,bot_absen) VALUES (?,?,?,'telat hadir',NOW(),'2')"
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

const detailsiswa =(req,res) =>{
    id = req.params.id
    sql = "SELECT * FROM siswa WHERE id=? LIMIT 1"
    con.query(sql,id,function(err,result){
        if(result.length > 0){
            res.sendFile(__dirname + "/absensi/home/edit.html")
            

        }
    })
}
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

const editjadwal = (req,res) => {
    const kelas = req.params.kelas
    let data = {
        jam_masuk : req.body.masuk,
        jam_pulang : req.body.pulang
    }
    sql = "SELECT jam_masuk,jam_pulang FROM siswa WHERE kelas=?"
    con.query(sql,kelas,function(err,result){
        if (err) throw err
        if(result.length > 0){
            sql2 ="UPDATE siswa SET ? WHERE kelas=?"
            con.query(sql2,[data,kelas],function(err,result){
                if (err) throw err
                res.send(result)
            })
        }
        
    })

}

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

module.exports = {home,
    editjadwal,
    detailsiswa,
    deletefingerprint,
    getDatasiswa,
    DeviceMode,
    editMode,
    checkfingerID,
    getdatakelas,
    getFingerID,
    tambahsiswa,
    confirmID,
    getDataAbsen,
    editsiswa,
    deleteid,
    checkJadwal
}