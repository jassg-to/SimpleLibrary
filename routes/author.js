const { Router } = require('express')
const router = Router()
var { authorController } = require('../controllers');

/* GET request for list of all Authors. */
router.get('/list', authorController.list);  
// get request for creating books 
router.get('/list/load_grid', authorController.load_grid);

/* GET request for creating Author. NOTE This must come before route for id (i.e. display author) */
router.get('/create', authorController.create_get);

/* POST request for creating Author. */
router.post('/create', authorController.create_post);

/* GET request to delete Author. */
router.get('/:id/delete', authorController.delete_get);

// POST request to delete Author
router.post('/:id/delete', authorController.delete_post);

/* GET request to update Author. */
router.get('/:id/update', authorController.update_get);

// POST request to update Author
router.post('/:id/update', authorController.update_post);

/* GET request for one Author. */
router.get('/:id', authorController.detail);

module.exports = router