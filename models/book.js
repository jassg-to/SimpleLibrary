var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = Schema ({
  title : { type: String, required: true },
  author: { type: Schema.ObjectId,  ref: 'Author', required: true },
  author_name: {type: String, required: true},
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.ObjectId, ref: 'Genre' }],
});

BookSchema
.virtual('url')
.get(function() {
  return '/book/' + this._id;
});

BookSchema.set('toObject', { virtuals: true });
BookSchema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model('Book', BookSchema);