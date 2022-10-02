const router = require('express').Router();
const { response } = require('express');
const con = require('./Database/database')

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
    })
}
module.exports = {addfingerprint}