const express = require('express');
const router = express.Router();

const uploadFile = require('../../middlewares/fileUploadHelper');
const upload=uploadFile.uploadFileMethod('NewsAndBlogs');
// create login routes
let getNewsAndBlog = require('../../controllers/common/Common');
let cms = require('../../controllers/admin/cms');
let validationData= require('../../middlewares/FrontendValidator');
// upload.single('profile_image')
const Auth = require("../../middlewares/loginToken")
router.post('/cms/create',cms.create)
router.put('/cms/update',cms.update)
router.post('/get-cms',cms.get)
router.get('/view-cms',cms.viewcms)
router.delete('/delete-cms', cms.delete)



module.exports = router;

