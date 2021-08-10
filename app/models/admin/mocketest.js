var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var mokcktestSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    start_time: {
        type: String,
        default: "",
        trim: true
    },
    end_time: {
        type: String,
        default: "",
        trim: true
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chapters",
    },
    chapter_meta: {
        type: { any: [Schema.Types.Mixed] }
    },
    attampt_questions: {
        type: { any: [Schema.Types.Mixed] }
    },
    online_status: {
        type: String,
        enum: ['online', 'complete', 'pending', ],
        default: "online"
    },
    // correct_question: {
    //     type: { any: [Schema.Types.Mixed] }
    // },
    correct_answer: {
        type: String,
        trim: true
    },
    wrong_questions: {
        type: String,
        trim: true
    },
    wrong_questions_meta: {
       type: { any: [Schema.Types.Mixed] }
    },
    correct_answer_meta: {
       type: { any: [Schema.Types.Mixed] }
    },
   
    attampt_total: {
        type: String,
        trim: true
    },
    total_questions: {
        type: String,
        trim: true
    },
    percentage: {
        type: String,
        trim: true
    },
    tag: {
        type: String,
        trim: true
    },
    online_time: {
        type: String,
        trim: true
    },
}, { versionKey: false, timestamps: true });

mokcktestSchema.plugin(mongoosePaginate);
let MocktestModel = mongoose.model('mocktest', mokcktestSchema);
module.exports = MocktestModel;