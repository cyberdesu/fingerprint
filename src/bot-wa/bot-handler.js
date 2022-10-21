const con = require('../Database/database');
const { bot } = require('./bot');

const botabsen = (req,res) => {
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

            const sanitized_number = no_ortu.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
            const final_number = `62${sanitized_number.substring(sanitized_number.length - 12)}`; // add 91 before the number here 91 is country code of India
            const chatid = final_number + "@c.us"
            bot.sendMessage(chatid,`${nama} telah ${stat} pada jam ${masuk}`)
            

            
        } 
    })
}

module.exports = {botabsen}