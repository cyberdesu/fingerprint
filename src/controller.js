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

    let id =  req.params.id
    const sql = "DELETE FROM siswa WHERE id = ?"
    con.query(sql,[id],function(err,result,fields){
        if (err) throw err;
        res.status(200).set('Access-Control-Allow-Origin', '*')
        if (result.affectedRows == 0){
            res.send({
                success: false,
                message: "id siswa sudah dihapus atau kosong"
            })
        } else{
            res.status(500).set('Access-Control-Allow-Origin', '*')
            res.send({
                success: true,
                message: "id siswa telah dihapus"
            })
        }
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

const DeviceMode = (req, res) => {
    let id = req.params.id
    let mode = req.params.mode
    const sql = "SELECT * FROM device WHERE device_id=? "
    if(id = !undefined && mode == "check"){
        con.query(sql,[id],function(err,result){
            if (err) throw err;
            res.set('Access-Control-Allow-Origin', '*')
            const data =result[0].Mode
            if(data == "0"){
                res.send({
                    success:true,
                    data: {
                        Mode:result[0].Mode,
                        status: "Mode Daftar"
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
            data: result
        })
    })
} 
module.exports = {addfingerprint,home,deletefingerprint,getDatasiswa,DeviceMode,editMode}