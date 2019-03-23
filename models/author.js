var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var AuthorSchema = Schema(
  {
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
    formatted_date_of_birth: {type: String},
    formatted_date_of_death: {type: String}
  }
);

AuthorSchema
.virtual('name')
.get(function () {
  return this.last_name + ', ' + this.first_name;
});

AuthorSchema
.virtual('url')
.get(function() {
  return '/author/' + this._id;
});

AuthorSchema
.virtual('dob_formatted')
.get(function() {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : 'No info';
});

AuthorSchema
.virtual('dod_formatted')
.get(function() {
  return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : 'No info';
});

AuthorSchema.set('toObject', { virtuals: true });
AuthorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Author', AuthorSchema);