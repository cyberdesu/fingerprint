const con = require('../Database/database');

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

module.exports = {deleteid}