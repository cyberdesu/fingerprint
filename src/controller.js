const router = require('express').Router();
const { response } = require('express');
const con = require('./Database/database')


const home = (req,res) => {
    res.status(200)
    res.send("API aktifk bre")
}

const addfingerprint = (req, res) => {
    const sql = "INSERT INTO `siswa` (`id`, `nama`, `kelas`, `jenis kelamin`, `no_ortu`) VALUES (NULL, NULL, NULL, NULL, NULL)"

    con.query(sql,function(err,result,fields){
        if (err) throw err;
        res.status(200)
        res.send({
            success: 201,
            message: "id telah ditambahkan",
            data: {id: result.insertId}
        })
        console.log(result.insertId)
    })
}



const deletefingerprint = (req, res) => {

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
                                message: "Data kosong"
                            })
                        } else if (result.length > 0){
                            res1 = result[0].id
                            sql3 = "DELETE FROM siswa WHERE del_finger=1"
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

                }

            }
            
        })
    }

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
    } else{
        con.query(sql,[kelas],function(err,result){
            if (err) throw err;
            if (result.length == 0){
                res.set('Access-Control-Allow-Origin', '*').send({
                    status: false,
                    message: "tidak ada kelas yg ditemukan"
                })
            }
            else {
                res.status(404).set('Access-Control-Allow-Origin', '*').send({
                    status: true,
                    message: "data telah dapat",
                    data: result
        
                })
            }
        })
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
                        status: "Mode Absen"
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
    const sql = "SELECT * FROM device WHERE device_id=?"
    const sql2 = "SELECT * FROM siswa WHERE id=?"

    con.query(sql,[mode],function(err,result){
        if (err){
            console.log(err)
            throw err
        }
        res1 = result[0].Mode

        if (res1 == 1){
            con.query(sql2,[finger],function(err,result){
                if (err) throw err;
                res.send({
                    data: result
                })
            })
            
        }
        //if()
    })
    
}

const getFingerID = (req,res) => {
    const get_id = req.params.get_id
    const id = req.params.id

    sql = "SELECT* FROM device WHERE device_id=?"
    con.query(sql,[id],function(err,result){
        if (err) throw err;
        data = result[0].Mode
        if(data != "0"){
            res.status(500).send({
                status: false,
                message: "device sedang dalam mode absen"
            })
        } else {
            if(get_id == "get_id"){
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

            sql2 = "INSERT INTO siswa SET ?"
            con.query(sql2,data,function(err,result){
                if (err) throw err
                res.send({
                    status: true,
                    message: "data berhasil ditambah",
                    data: result
                })
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
                    res.set(404).send({
                        status: false,
                        message: "tidak ada fingeprint yg akan ditambah"
                    })
                } else{
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
                        res.set(404).send({
                            status: false,
                            message: "id fingerprint tidak cocok dengan database"
                        })
                    }
                }
            })
        }
    })

}
module.exports = {addfingerprint,home,deletefingerprint,getDatasiswa,DeviceMode,editMode,checkfingerID,getdatakelas,getFingerID,tambahsiswa,confirmID}