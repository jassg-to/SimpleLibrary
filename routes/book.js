const { Router } = require('express')
const router = Router()
var { bookController } = require('../controllers');

/* get request for list of all Book items. */
router.get('/', bookController.index);

/* POST request for list of all Book items. */
router.get('/list', bookController.list);
// get request for creating books 
router.get('/list/load_grid', bookController.load_grid);

// get request for creating books 
router.get('/create', bookController.create_get);

/* POST request for creating Book. */
router.post('/create', bookController.create_post);

/* GET request to delete Book. */
router.get('/:id/delete', bookController.delete_get);

// POST request to delete Book
router.post('/:id/delete', bookController.delete_post);

/* GET request to update Book. */
router.get('/:id/update', bookController.update_get);

// POST request to update Book
router.post('/:id/update', bookController.update_post);

/* GET request for one Book. */
router.get('/:id', bookController.detail);


module.exports = router