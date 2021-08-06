var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var questionSchema = new Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    flag: {
        type: String,
        enum : ["0", "1"],
        default: "0"
    },
    
   }, { versionKey: false, timestamps:true });

questionSchema.plugin(mongoosePaginate);
let FlageModel = mongoose.model('flagquestions', questionSchema);
module.exports = FlageModel;