
const { response } = require('express');
const con = require('../Database/database');
const { bot, botsession } = require('./bot');



const botabsen = async(req,res) => {
    //await botsession()
    sql = "SELECT siswa.nama,absen.tanggal,absen.jam_masuk,absen.jam_pulang,absen.status,siswa.no_ortu,absen.bot_absen FROM siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari WHERE absen.bot_absen=2 OR absen.bot_absen=1 LIMIT 1"
    con.query(sql,function(err,result){
        if (err) throw err
        if (result.length != 0){
            nama = result[0].nama
            tgl = result[0].tanggal
            masuk = result[0].jam_masuk
            pulang = result[0].jam_pulang
            stat = result[0].status
            no_ortu = result[0].no_ortu
            absen = result[0].bot_absen
            console.log(result)
            

            const sql2= "UPDATE siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari SET bot_absen=0 WHERE absen.bot_absen=2 LIMIT 1" // UNTUK NO HP yg tidak ada
            const sql3= "UPDATE siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari SET bot_absen=1 WHERE absen.bot_absen=2 LIMIT 1"
            const sql4= "UPDATE siswa INNER JOIN absen ON siswa.id=absen.id_sidikjari SET bot_absen=0 WHERE absen.bot_absen=1 LIMIT 1"
            if(!no_ortu){
                con.query(sql2,function(err,result){
                    if(err) throw err
                    res.send('no hp gada,jadi gausah kirim notif ye:v')
                })
                
            } else if(no_ortu.length != 13){
                con.query(sql2,function(err,result){
                    if(err) throw err
                    res.status(500)
                    res.send("no invalid cok")
                })
            } else {
                const addZero = i => {
                    if (i < 10) {i = "0" + i}
                    return i;
                }
                const waktu = new Date()
                const jam = addZero(waktu.getHours())+":"+addZero(waktu.getMinutes())+":"+addZero(waktu.getSeconds())
                const month = ["01","02","03","04","05","06","07","08","09","10","11","12"];
                const tanggal = addZero(waktu.getFullYear())+"-"+month[waktu.getMonth()]+"-"+addZero(waktu.getDate())
                const tgl_final = addZero(tgl.getFullYear())+"-"+month[tgl.getMonth()]+"-"+addZero(tgl.getDate())


                const chatid = no_ortu + "@c.us"
                //console.log(chatid)
                const pesan = ` ${nama} telah ${stat} sekolah pada jam ${masuk}  tanggal ${tgl_final} ` 
                console.log(absen)
                

                if(pulang >= jam && tanggal >= tgl_final && absen == "1"){
                    const pesan = `${nama} telah pulang sekolah pada jam ${pulang} tanggal ${tgl_final} ` 
                    bot.sendMessage(chatid,pesan).then(response => {
                        con.query(sql4,function(err,result){
                            if(err) throw err
                            res.send({
                                status: true,
                                message: "notif sudah terkirim bre",
                                data: response
        
                            })
                        })
                    }).catch(err => {
                        res.status(500).send('bot blom aktif')
    
                    })
                    
                }else{
                    bot.sendMessage(chatid,pesan).then(response => {
                        con.query(sql3,function(err,result){
                            if(err) throw err
                            res.send({
                                status: true,
                                message: "notif sudah terkirim bre",
                                data: response
        
                            })
                        })
                    }).catch(err => {
                        res.status(500).send('bot blom aktif')
    
                    })

                }

            }
        } else {
            res.status(404).send("gada no yang harus  dikirim notif wa")
        }
    })
}


const aksesbot = async () =>{
    const botcheck = await botsession()

    const url = `http://localhost:4000`
    console.log('check notif bot')

    fetch(url)
        .then(response.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
}

module.exports = {botabsen,aksesbot}