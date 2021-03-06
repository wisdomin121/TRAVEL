var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  guide: {type: Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, trim: true, required: true},
  price: {type: Number, required: true},
  max_num: {type: Number, required: true},
  place: [String],
  i_info: {type: String, trim: true, required: true},
  c_info: [{type: String, trim: true, required: true}],
  special: {type: String, required: false},
  view: {type: Number, default: 0},
  d_date: {type: Date, required: true},
  a_date: {type: Date, required: true},
  p_date: {type: Date, default: Date.now},
  now_num: {type: Number, default: 0},
  c_info_length: {type: Number}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Item = mongoose.model('Item', schema);

module.exports = Item;
