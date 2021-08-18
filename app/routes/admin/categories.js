const express = require('express');
const router = express.Router();

let categories = require('../../controllers/admin/categories');
router.post('/get-category',categories.get)
router.post('/add-category',categories.create)
router.get('/view-category',categories.viewCategory)
router.put('/edit-category',categories.editCategory)
router.get('/category-list',categories.getList)
router.delete('/delete-category',categories.delete)

module.exports = router;

