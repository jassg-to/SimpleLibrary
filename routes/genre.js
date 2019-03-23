const { Router } = require('express')
const router = Router()
var { genreController } = require('../controllers')

/* GET request for list of all Genre. */
router.get('/list', genreController.list)

/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/create', genreController.create_get)

/* POST request for creating Genre. */
router.post('/create', genreController.create_post)

/* GET request to delete Genre. */
router.get('/:id/delete', genreController.delete_get)

// POST request to delete Genre
router.post('/:id/delete', genreController.delete_post)

/* GET request to update Genre. */
router.get('/:id/update', genreController.update_get)

// POST request to update Genre
router.post('/:id/update', genreController.update_post)

/* GET request for one Genre. */
router.get('/:id', genreController.detail)

module.exports = router