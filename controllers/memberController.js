var Member = require('../models/member');

var async = require('async');

// Display list of all books
exports.member_list = function (req, res, next) {
  Member.find()
    .exec(function (err, list_members) {
      if (err) return next(err);
      console.log(list_members[0]);
      res.render('member_list', { title: 'Member List', member_list: list_members });
    });
};

// Display detail page for a specific member
exports.member_detail = function (req, res) {
  Member.findById(req.params.id)
  .exec(function(err, memberInstance) {
    if (err) return next(err);
    res.render('member_detail', {title: 'Member Detail', member: memberInstance});
  });
};

// Display member create form on GET
exports.member_create_get = function (req, res, next) {
  res.render('member_form', { title: 'Create Member'});
};

// Handle member create on POST
exports.member_create_post = function (req, res, next) {

  sanitizeRequest(req);
  validateRequest(req);

  var member = createMemberFromRequest(req);
  console.log('member: ' + member);

  var errors = req.validationErrors();
  if (errors) {
    // Some problems so we need to re-render our member
    console.log('GENRE: ' + req.body.genre);

    console.log('ERRORS: ' + errors);
    
    res.render('member_form', { title: 'Create member', member: member, errors: errors });

  } else {
    // Data from form is valid.
    // We could check if member exists already, but lets just save.

    member.save(function (err) {
      if (err) { return next(err); }
      //successful - redirect to new member record.
      res.redirect(member.url);
    });
  }
};


exports.member_delete_get = function (req, res, next) {

  async.parallel({
    member: function (callback) {
      Member.findById(req.params.id).exec(callback)
    }
  }, function (err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('member_delete', { title: 'Delete member', member: results.member});
  });

};

// Handle member delete on POST
exports.member_delete_post = function (req, res, next) {

  //Assume the post will have id (ie no checking or sanitisation).

  async.parallel({
    member: function (callback) {
      Member.findById(req.params.id).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
      //Success - member found
      //Delete object and redirect to the list of member.  - Consider Soft Delete
      Member.findByIdAndRemove(req.body.id, function deleteMember(err) {
        if (err) { return next(err); }
        //Success - got to books list
        res.redirect('/catalog/members')
      })

    // }
  });

};

// Display book update form on GET
exports.member_update_get = function(req, res, next) {

  sanitizeId(req);

  Member.findById(req.params.id, function (err, member) {
    if (err) { return next(err); }
    //On success
    res.render('member_form', { title: 'Update Member', member: member });
  });
 
};

// Handle member update on POST
exports.member_update_post = function (req, res, next) {
  
  sanitizeRequest(req);
  validateRequest(req);

  var member = createMemberFromRequest(req);

  var errors = req.validationErrors();
  if (errors) {
    //If there are errors render the form again, passing the previously entered values and errors
    res.render('member_form', { title: 'Update Member', member: member, errors: errors });
    return;
  } else {
    // Data from form is valid. Update the record.
    Member.findByIdAndUpdate(req.params.id, member, {}, function (err, themember) {
      if (err) { return next(err); }
      //successful - redirect to genre detail page.
      res.redirect(themember.url);
    });
  }
};

sanitizeRequest = function (req) {
  req.sanitize('first_name').escape();
  req.sanitize('last_name').escape();
  req.sanitize('email').escape();
  req.sanitize('phone').escape();
  req.sanitize('since').trim();
  req.sanitize('last_renew').toDate();
  req.sanitize('code').trim();

  sanitizeId(req);
}

sanitizeId = function (req){
  //Sanitize id passed in. 
  req.sanitize('id').escape();
  req.sanitize('id').trim();
}

validateRequest = function (req) {
  //Check other data
  req.checkBody('first_name', 'First name must not be empty.').notEmpty();
  req.checkBody('last_name', 'Last name must not be empty').notEmpty();
  req.checkBody('phone', 'Phone must not be empty').notEmpty();
  req.checkBody('since', 'Since must not be empty').notEmpty();
  req.checkBody('last_renew', 'Last renew must not be empty').notEmpty();
  req.checkBody('code', 'Code must not be empty').notEmpty();
}

//create an instance of member from request
createMemberFromRequest = function (req) {
  return new Member(
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      since: req.body.since,
      last_renew: req.body.last_renew,
      code: req.body.code,
      _id: req.params.id || undefined//This is required, or a new ID will be assigned!
    });
}
