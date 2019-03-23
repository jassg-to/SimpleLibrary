var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/book')
})

router.use('/book', require('./book'))
router.use('/author', require('./author'))
router.use('/genre', require('./genre'))
router.use('/member', require('./member'))
router.use('/bookinstance', require('./bookinstance'))

module.exports = router
