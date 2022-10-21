const {home, deletefingerprint, getDatasiswa, DeviceMode, editMode, checkfingerID, getdatakelas, getFingerID, tambahsiswa, confirmID, getDataAbsen, editsiswa, deleteid} = require('./controller');

const router = require('express').Router();


router.get('/',home)
router.get('/deleteID/:deleteID/:Mode/',deletefingerprint)
router.get('/siswa/delete/:id',deleteid)
router.get('/siswa',getDatasiswa)
router.get('/check/:finger/:mode',checkfingerID) //arduino
router.get('/device/:mode/:id',DeviceMode) //arduino
router.post('/device/edit/:id',editMode) //untuk ubah mode ke daftar atau absen
router.get('/siswa/kelas/:kelas',getdatakelas) //front end
router.get('/getfingerid/:getfingerid/:id',getFingerID)
router.post('/siswa/tambah',tambahsiswa)
router.post('siswa/edit')
router.get('/confirm/:id/:confirmid',confirmID)
router.get('/absen/kelas/:kelas',getDataAbsen)
router.put('/siswa/edit/:id',editsiswa)

module.exports = router