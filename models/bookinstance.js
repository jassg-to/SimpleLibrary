var mongoose = require('mongoose')
var Schema = mongoose.Schema
var moment = require('moment')

var BookInstanceSchema = Schema ({
  book: { type: Schema.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  code: {type: String, required: true}
})

BookInstanceSchema
.virtual('url')
.get(function() {
  return '/bookinstance/' + this._id
})

module.exports = mongoose.model('BookInstance', BookInstanceSchema)



