const router = require('express').Router();
const { response } = require('express');




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












module.exports = {
    editMode,
    
}