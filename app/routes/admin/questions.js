const express = require('express');
const router = express.Router();

const uploadFile = require('../../middlewares/fileUploadHelper');
const upload=uploadFile.uploadFileMethod('QuestionsImage');
let questions = require('../../controllers/admin/questions');


router.post('/upload-image',questions.uploadeImagebase64)
router.post('/get-questions',questions.get)
router.post('/add-question',questions.create)
router.delete('/delete-question',questions.delete)



module.exports = router;

