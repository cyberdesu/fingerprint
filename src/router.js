const { addfingerprint, home, deletefingerprint, getDatasiswa, DeviceMode, editMode, checkfingerID, getdatakelas, getFingerID, tambahsiswa } = require('./controller');

const router = require('express').Router();


router.get('/',home)
router.get('/addfinger',addfingerprint)
router.get('/deleteID/:deleteID/:Mode/',deletefingerprint)
router.get('/siswa',getDatasiswa)
router.get('/check/:mode/:finger',checkfingerID)
router.get('/device/:mode/:id',DeviceMode)
router.put('/device/edit/:id',editMode)
router.get('/siswa/kelas/:kelas',getdatakelas)
router.get('/getfingerid/:get_id/:id',getFingerID)
router.post('/siswa/tambah',tambahsiswa)
router.post('siswa/edit')

module.exports = router