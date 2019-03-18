var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

exports.index = function (req, res) {
  async.parallel({
    book_count: function (callback) {
      Book.count(callback);
    },
    book_instance_count: function (callback) {
      BookInstance.count(callback);
    },
    book_instance_available_count: function (callback) {
      BookInstance.count({ status: 'Available'}, callback);
    },
    author_count: function (callback) {
      Author.count(callback);
    },
    genre_count: function (callback) {
      Genre.count(callback);
    },
  }, function (err, results) {
    res.render('index', { title: 'Jassg Library', error: err, data: results })
  });
};

// Display list of all books
exports.book_list = function (req, res, next) {
  res.render('book_list', {title: 'Book List'});
};

exports.book_load_grid = function (req, res, next){
  Book.find(regexBookFilter(req))
    .exec(function (err, list_books) {
      if (err) return next(err);
      console.log(list_books);
      return res.end(JSON.stringify(list_books));
    });
}

regexBookFilter = function (req) {
  var filter = Object.assign({},req.query)
  Object.keys(filter).map(key => (filter[key] = new RegExp( filter[key], "i")))
  return filter
}

// Display detail page for a specific book
exports.book_detail = function (req, res) {
  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function (callback) {
      BookInstance.find({ 'book': req.params.id })
        .exec(callback);
    },
  }, function (err, results) {
    if (err)  return next(err); 
    res.render('book_detail', { title: 'Title', book: results.book, book_instances: results.book_instance });
  });
};

// Display book create form on GET
exports.book_create_get = function (req, res, next) {
  async.parallel({
    authors: function (callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

// Handle book create on POST
exports.book_create_post = function (req, res, next) {
  sanitizeBookRequest(req);
  validateBookRequest(req);

  Author.findById(req.body.author).then((author) => {
    return createBookFromRequest(req, author);
  }).then((book) => {
    var errors = req.validationErrors();
    if (errors) {
        responseBookErrors(book, 'Create Book', errors, res)
    } else {
      // Data from form is valid.
      // We could check if book exists already, but lets just save.
        book.save(function (err) {
        if (err) { return next(err); }
        //successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  })
};

responseBookErrors = function (book, pageTitle, errors, res) {
  console.log('ERRORS: ' + errors);
  //Get all authors and genres for form
  async.parallel({
    authors: function (callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }

    // Mark our selected genres as checked
    for (i = 0; i < results.genres.length; i++) {
      if (book.genre.indexOf(results.genres[i]._id) > -1) {
        //Current genre is selected. Set "checked" flag.
        results.genres[i].checked = 'true';
      }
    }
    res.render('book_form', { title: pageTitle, authors: results.authors, genres: results.genres, book: book, errors: errors });
  });
}


exports.book_delete_get = function (req, res, next) {

  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback)
    },
    book_bookinstances: function (callback) {
      BookInstance.find({ 'book': req.params.id }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances });
  });

};

// Handle book delete on POST
exports.book_delete_post = function (req, res, next) {

  //Assume the post will have id (ie no checking or sanitisation).

  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback)
    },
    book_bookinstances: function (callback) {
      BookInstance.find({ 'book': req.params.id }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
    //Success
    if (results.book_bookinstances > 0) {
      //Book has book_instances. Render in same way as for GET route.
      res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances });
      return;
    }
    else {
      //Book has no bookinstances. Delete object and redirect to the list of books.
      Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
        if (err) { return next(err); }
        //Success - got to books list
        res.redirect('/catalog/books')
      })

    }
  });

};

// Display book update form on GET
exports.book_update_get = function(req, res, next) {

  sanitizeId(req);

  //Get book, authors and genres for form
  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    authors: function (callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }

    // Mark our selected genres as checked
    for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
      for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
        if (results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()) {
          results.genres[all_g_iter].checked = 'true';
        }
      }
    }
    res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
  });

};

// Handle book update on POST
exports.book_update_post = function (req, res, next) {
  sanitizeBookRequest(req);
  validateBookRequest(req);

  Author.findById(req.body.author).then((author) => {
    return createBookFromRequest(req, author);
  }).then((book) => {
    var errors = req.validationErrors();
    if (errors) {
      responseBookErrors(book, 'Update Book', errors, res)
    } else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
        if (err) { return next(err); }
        //successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  });
};

sanitizeBookRequest = function (req) {
  req.sanitize('title').escape();
  req.sanitize('author').escape();
  req.sanitize('summary').escape();
  req.sanitize('isbn').escape();
  req.sanitize('title').trim();
  req.sanitize('author').trim();
  req.sanitize('summary').trim();
  req.sanitize('isbn').trim();
  req.sanitize('genre').escape();

  sanitizeId(req);
}

sanitizeId = function (req){
  //Sanitize id passed in. 
  req.sanitize('id').escape();
  req.sanitize('id').trim();
}

validateBookRequest = function (req) {
  //Check other data
  req.checkBody('title', 'Title must not be empty.').notEmpty();
  req.checkBody('author', 'Author must not be empty').notEmpty();
  req.checkBody('summary', 'Summary must not be empty').notEmpty();
  req.checkBody('isbn', 'ISBN must not be empty').notEmpty();
}

//create an instance of Book from request
createBookFromRequest = async function (req, author) {
  return new Book({
    title: req.body.title,
    author: req.body.author,
    author_name: author.name,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre.split(","),
    _id: req.params.id || undefined//This is required, or a new ID will be assigned!
  }); 
}
