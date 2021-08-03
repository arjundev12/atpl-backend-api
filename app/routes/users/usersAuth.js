const express = require('express');
const router = express.Router();

const uploadFile = require('../../middlewares/fileUploadHelper');
const upload=uploadFile.uploadFileMethod('ProfileImage');
// create login routes
const user_controller = require('../../controllers/users/userAuth');
const getNewsAndBlog = require('../../controllers/common/Common')
const wallet = require('../../controllers/users/wallet')

const validationData= require('../../middlewares/FrontendValidatorUser');

router.post('/sign-up',validationData.signUp,  user_controller.signUp);
router.post('/login',validationData.login, user_controller.login)
router.post('/reste-password', user_controller.setNewPassword)

router.put('/update-profile',validationData.updateProfile, user_controller.updateProfile)
router.get('/get-category', user_controller.getCategoryList)
router.get('/get-subcategory', user_controller.getSubCategoryList)
router.get('/get-chapters', user_controller.getChapterList)
router.post('/question-list', user_controller.getQuestionlist)

router.post('/submit-test', user_controller.submitTest)
router.post('/start-test', user_controller.startTest)
///////////////////////////////////subscription//////////////////////////////////////

router.post('/get-plans', user_controller.getPlans)
router.get('/get-plan-by-id', user_controller.getPlanById)
router.post('/buy-subscription', user_controller.buySubscription)

module.exports = router;

