var BookInstance = require('../models/bookinstance')
var Book = require('../models/book')
var async = require('async')

// Display list of all book instances
list = function (req, res, next) {
  BookInstance.find().populate('book').exec(function(err, list_bookinstances) {
    res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances })
  })
}

// Display detail page for a specific BookInstance
detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance) {
      if (err) return next(err)
      res.render('bookinstance_detail', {title: 'Book: ', bookinstance: bookinstance})
    })
}

// Display BookInstance create form on GET
create_get = function (req, res, next) {
  Book.find({}, 'title')
    .exec(function (err, books) {
      if (err) { return next(err) }
      //Successful, so render
      res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books })
    })
}

// Handle BookInstance create on POST
create_post = function (req, res, next) {
  sanitizeRequest(req)
  validateRequest(req)

  var bookinstance = createObjectFromRequest(req)

  var errors = req.validationErrors()
  if (errors) {

    Book.find({}, 'title')
      .exec(function (err, books) {
        if (err) { return next(err) }
        //Successful, so render
        res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors, bookinstance: bookinstance })
      })
    return
  } else {
    // Data from form is valid

    bookinstance.save(function (err) {
      if (err) { return next(err) }
      //successful - redirect to new book-instance record.
      res.redirect(bookinstance.url)
    })
  }

}

// Display BookInstance delete form on GET
delete_get = function (req, res, next) {

  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err) }
      //Successful, so render
      res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance: bookinstance })
    })

}

// Handle BookInstance delete on POST
delete_post = function (req, res, next) {
  //Assume valid bookinstance id in field (should check)
  BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
    if (err) { return next(err) }
    //success, so redirect to list of bookinstances.
    res.redirect('/bookinstances')
  })

}

// Display BookInstance update form on GET
update_get = function (req, res, next) {
  sanitizeId(req)

  //Get book, authors and genres for form
  async.parallel({
    bookinstance: function (callback) {
      BookInstance.findById(req.params.id).populate('book').exec(callback)
    },
    books: function (callback) {
      Book.find(callback)
    },

  }, function (err, results) {
    if (err) { return next(err) }

    res.render('bookinstance_form', { title: 'Update  BookInstance', book_list: results.books, selected_book: results.bookinstance.book._id, bookinstance: results.bookinstance })
  })

}

// Handle bookinstance update on POST
update_post = function (req, res, next) {
  sanitizeRequest(req)
  validateRequest(req)
  var bookinstance = createObjectFromRequest(req)

  var errors = req.validationErrors()
  if (errors) {
    Book.find({}, 'title')
      .exec(function (err, books) {
        if (err) { return next(err) }
        //Successful, so render
        res.render('bookinstance_form', { title: 'Update BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors, bookinstance: bookinstance })
      })
    return
  } else {
    // Data from form is valid
    BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance) {
      if (err) return next(err) 
      res.redirect(thebookinstance.url)
    })
  }

}

const sanitizeRequest = function (req) {
  req.sanitize('book').escape()
  req.sanitize('imprint').escape()
  req.sanitize('book').trim()
  req.sanitize('imprint').trim()
  req.sanitize('code').escape()
  req.sanitize('code').trim()

  sanitizeId(req)
}

const sanitizeId = function (req){
  //Sanitize id passed in. 
  req.sanitize('id').escape()
  req.sanitize('id').trim()
}

const validateRequest = function (req) {
  req.checkBody('book', 'Book must be specified').notEmpty()
  req.checkBody('imprint', 'Imprint must be specified').notEmpty()
  req.checkBody('code', 'Barcode must be specified').notEmpty()
}

//create an instance of Book from request
const createObjectFromRequest = function (req) {
  return new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    code: req.body.code,
    _id: req.params.id || undefined//This is required, or a new ID will be assigned!
  })
}

module.exports = {
  list,
  detail,
  create_get,
  create_post,
  delete_get,
  delete_post,
  update_get,
  update_post
}