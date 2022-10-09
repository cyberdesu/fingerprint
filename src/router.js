const { addfingerprint, home, deletefingerprint, getDatasiswa, DeviceMode, editMode } = require('./controller');

const router = require('express').Router();


router.get('/',home)
router.get('/addfinger',addfingerprint)
router.delete('/deletefinger/:id',deletefingerprint)
router.get('/siswa',getDatasiswa)
router.get('/device/:mode/:id',DeviceMode)
router.put('/device/edit/:id',editMode)

module.exports = router