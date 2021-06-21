var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var questionSchema = new Schema({
    quesno: {
      type: Number,
      require: true
    },
    question: {
      type: String,
      require: true,
      trim: true
    },
    Options: { // its must be array of objects
        type: { any: [Schema.Types.Mixed] }
    },
    image : {
      type: String,
      default: "",
      trim: true
    },
    correct_index: {
        type: Number,
        require: true 
    },
    status: {
      type: String,
      enum : ['active', 'inactive', 'delete'],
      default :"active"
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chapters",
        require: true
    },
    chapter_meta: {
        type: { any: [Schema.Types.Mixed] }
    },
   }, { versionKey: false, timestamps:true });

questionSchema.plugin(mongoosePaginate);
let QuestionModel = mongoose.model('questions', questionSchema);
module.exports = QuestionModel;