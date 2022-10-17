const {home, deletefingerprint, getDatasiswa, DeviceMode, editMode, checkfingerID, getdatakelas, getFingerID, tambahsiswa, confirmID } = require('./controller');

const router = require('express').Router();


router.get('/',home)
router.get('/deleteID/:deleteID/:Mode/',deletefingerprint)
router.get('/siswa',getDatasiswa)
router.get('/check/:mode/:finger',checkfingerID)
router.get('/device/:mode/:id',DeviceMode)
router.put('/device/edit/:id',editMode)
router.get('/siswa/kelas/:kelas',getdatakelas)
router.get('/getfingerid/:getfingerid/:id',getFingerID)
router.post('/siswa/tambah',tambahsiswa)
router.post('siswa/edit')
router.get('/confirm/:id/:confirmid',confirmID)

module.exports = router