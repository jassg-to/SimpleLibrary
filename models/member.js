var mongoose = require('mongoose');
var moment = require('moment')
var Schema = mongoose.Schema;

var MemberSchema = Schema ({
  first_name: { type: String, required: true},
  last_name: { type: String, required: true},
  email: { type: String, required: false},
  phone: { type: String, required: true},
  since: { type: String, required: true},
  last_renew: { type: Date, required: true},
  code: { type: String, required: true},
});

MemberSchema
.virtual('url')
.get(function (){
  return '/catalog/member/' + this._id;
});

MemberSchema
.virtual('last_renew_formatted')
.get(function () {
return moment(this.last_renew).format('YYYY-MM-DD');
});


module.exports = mongoose.model('Member', MemberSchema)
