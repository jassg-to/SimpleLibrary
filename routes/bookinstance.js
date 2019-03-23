const { Router } = require('express')
const router = Router()
var { bookinstanceController } = require('../controllers')

/* GET request for list of all BookInstance. */
router.get('/list', bookinstanceController.list)

/* GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id) */
router.get('/create', bookinstanceController.create_get)

/* POST request for creating BookInstance. */
router.post('/create', bookinstanceController.create_post)

/* GET request to delete BookInstance. */
router.get('/:id/delete', bookinstanceController.delete_get)

// POST request to delete BookInstance
router.post('/:id/delete', bookinstanceController.delete_post)

/* GET request to update BookInstance. */
router.get('/:id/update', bookinstanceController.update_get)

// POST request to update BookInstance
router.post('/:id/update', bookinstanceController.update_post)

/* GET request for one BookInstance. */
router.get('/:id', bookinstanceController.detail)

module.exports = router