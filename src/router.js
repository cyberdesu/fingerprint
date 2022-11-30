const { daftarbot } = require('./bot-wa/bot');
const { botabsen } = require('./bot-wa/bot-handler');
const { checkfingerID } = require('./controller/checkfinger');
const { checkJadwal } = require('./controller/checkjadwal');
const { confirmID } = require('./controller/ConfirmID');
const {editMode,} = require('./controller/EditMode');
const { getDataAbsen } = require('./controller/DataAbsen');
const { getdatakelas } = require('./controller/DataKelas');
const { getDatasiswa } = require('./controller/DataSiswa');
const { deletefingerprint } = require('./controller/DeleteFinger');
const { deleteid } = require('./controller/DeleteID');
const { DeviceMode } = require('./controller/DeviceMode');
const { editjadwal } = require('./controller/editjadwal');
const { editsiswa } = require('./controller/editsiswa');
const { getFingerID } = require('./controller/GetFingerID');
const { tambahsiswa } = require('./controller/TambaSiswa');

const router = require('express').Router();


router.get('/deleteID/:deleteID/:Mode/',deletefingerprint)
router.get('/siswa/delete/:id',deleteid)
router.get('/siswa',getDatasiswa)
router.get('/check/:finger/:mode',checkfingerID) //arduino
router.get('/device/:mode/:id',DeviceMode) //arduino
router.post('/device/edit/:id',editMode) //untuk ubah mode ke daftar atau absen
router.get('/siswa/kelas/:kelas',getdatakelas) //front end
router.get('/getfingerid/:getfingerid/:id',getFingerID)
router.post('/siswa/tambah',tambahsiswa)
router.get('/confirm/:id/:confirmid',confirmID)
router.get('/absen/kelas/:kelas',getDataAbsen)
router.put('/siswa/edit/:id',editsiswa)
router.get('/absen/bot/check',botabsen)
router.get('/jadwal/kelas',checkJadwal)
router.post('/jadwal/edit/:kelas',editjadwal)

module.exports = router