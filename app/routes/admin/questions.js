const express = require('express');
const router = express.Router();

let questions = require('../../controllers/admin/questions');
router.post('/get-questions',questions.get)
router.post('/add-question',questions.create)


module.exports = router;

