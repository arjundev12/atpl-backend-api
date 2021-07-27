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
    attampt_question: {
        type: { any: [Schema.Types.Mixed] }
    },
    online_status: {
        type: String,
        enum: ['online', 'complete', 'pending', ],
        default: "online"
    },
}, { versionKey: false, timestamps: true });

mokcktestSchema.plugin(mongoosePaginate);
let MocktestModel = mongoose.model('mocktest', mokcktestSchema);
module.exports = MocktestModel;