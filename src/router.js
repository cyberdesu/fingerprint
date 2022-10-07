const { addfingerprint, home, deletefingerprint } = require('./controller');

const router = require('express').Router();


router.get('/',home)
router.get('/addfinger',addfingerprint)
router.delete('/deletefinger/:id',deletefingerprint)

module.exports = router