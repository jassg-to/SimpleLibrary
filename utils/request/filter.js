regexReqFilter = (req) => {
  var filter =Object.assign({},req.query)
  removeEmptyAttributes(filter)
  Object.keys(filter).map(key => (filter[key] = new RegExp( escapingRegExCharacters(filter[key]), "i")))
  return filter
}

removeEmptyAttributes = (myObj) => Object.keys(myObj).forEach((key) => (myObj[key] == null || myObj[key] == '' ) && delete myObj[key])

escapingRegExCharacters = (value) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

module.exports = {
  regexReqFilter,
  removeEmptyAttributes,
  escapingRegExCharacters
}