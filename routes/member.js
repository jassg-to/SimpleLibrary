const { Router } = require('express')
const router = Router()
var { memberController } = require('../controllers')

/* GET request for list of all member items. */
router.get('/list', memberController.list)
// get request for creating books 
router.get('/list/load_grid', memberController.load_grid)

// get request for creating books 
router.get('/create', memberController.create_get)

/* POST request for creating member. */
router.post('/create', memberController.create_post)

/* GET request to delete member. */
router.get('/:id/delete', memberController.delete_get)

// POST request to delete member
router.post('/:id/delete', memberController.delete_post)

/* GET request to update member. */
router.get('/:id/update', memberController.update_get)

// POST request to update member
router.post('/:id/update', memberController.update_post)

/* GET request for one member. */
router.get('/:id', memberController.detail)


module.exports = router
