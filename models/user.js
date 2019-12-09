var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  id: {type: String, required: true, index: true, unique: true, trim: true},
  name: {type: String, required: true, trim: true},
  password: {type: String},
  group: {type: Number, default: 1},
  intro: {type: String, required: false},
  createdAt: {type: Date, default: Date.now}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var User = mongoose.model('User', schema);

module.exports = User;
