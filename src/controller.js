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
        res.status(200)
        if (result.affectedRows == 0){
            res.send({
                success: false,
                message: "id siswa sudah dihapus atau kosong"
            })
        } else{
            res.send({
                success: true,
                message: "id siswa telah dihapus"
            })
        }
    })
}


module.exports = {addfingerprint,home,deletefingerprint}