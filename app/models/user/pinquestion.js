var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var pinQuestionSchema = new Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    pin_status: {
        type: String,
        enum : ["0", "1"],
        default: "0"
    }
    
   }, { versionKey: false, timestamps:true });

pinQuestionSchema.plugin(mongoosePaginate);
let PinQuestionModel = mongoose.model('pinquestions', pinQuestionSchema);
module.exports = PinQuestionModel;