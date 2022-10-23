
const con = require('../Database/database');
const { bot, botsession } = require('./bot');

const botabsen = async(req,res) => {
    //await botsession()
    sql = "SELECT siswa.nama,absen.tanggal,absen.jam_masuk,absen.jam_pulang,absen.status,siswa.no_ortu FROM siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari WHERE absen.bot_absen=1 LIMIT 1"
    con.query(sql,function(err,result){
        if (err) throw err
        if (result.length != 0){
            nama = result[0].nama
            tanggal = result[0].tanggal
            masuk = result[0].jam_masuk
            keluar = result[0].jam_keluar
            stat = result[0].status
            no_ortu = result[0].no_ortu

            const sql2= "UPDATE siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari SET bot_absen=0 WHERE absen.bot_absen=1 LIMIT 1"
            if(!no_ortu){
                
                con.query(sql2,function(err,result){
                    if(err) throw err
                    res.send('no hp gada,jadi gausah kirim notif ye:v')
                })
                
            }
            const chatid = no_ortu + "@c.us"
            console.log(chatid)

            const pesan = ` ${nama} telah ${stat} sekolah pada jam ${masuk} ` 
            //sql2= "UPDATE siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari SET bot_absen=0 WHERE absen.bot_absen=1 LIMIT 1"
            con.query(sql2,function(err,result){
                if(err) throw err
                bot.sendMessage(chatid,pesan).then(res.send('eaaaa'))
            })
            
        } else{
            res.status(404).send("gada no yang harus  dikirim notif wa")
        }
    })
}



module.exports = {botabsen}