const { addfingerprint } = require('./controller');

const router = require('express').Router();

router.get('/addfinger',addfingerprint)

module.exports = router