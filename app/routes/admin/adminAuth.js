const express = require('express');
const router = express.Router();

const uploadFile = require('../../middlewares/fileUploadHelper');
const upload=uploadFile.uploadFileMethod('QuestionsImage');
// create login routes
const admin_controller = require('../../controllers/admin/admin');
// const user_controller = require('../../controllers/users/userAuth');
const wallet = require('../../controllers/admin/wallet')
const validationData= require('../../middlewares/FrontendValidator');
const Auth = require("../../middlewares/loginToken");
const admin = require('../../controllers/admin/admin');
// upload.single('profile_image')
router.post('/login',validationData.login, admin_controller.loginAdmin)
// router.post('/get-user',Auth.jwtVerify, admin_controller.getUser)
router.post('/get-transaction',Auth.jwtVerify, admin_controller.getTransaction)
router.get('/get-Kyc',Auth.jwtVerify, admin_controller.getKycDoc)
router.post('/get-kyc-user',Auth.jwtVerify, admin_controller.getUserKyc)
router.get('/wallet',Auth.jwtVerify, wallet.getWallet)
router.get('/get-total',Auth.jwtVerify, admin_controller.getTotalCount)

// router.post('/update-profile',Auth.jwtVerify,validationData.update, user_controller.UpdateProfile)
// router.get('/user-details',Auth.jwtVerify, user_controller.getUserDetails)
////////////////////////////////////////////////////////////////
router.post('/add-user', admin_controller.adminAddUser)
router.post('/get-user', admin_controller.getUser)
router.get('/get-user-details', admin_controller.getUserDetails)
router.put('/update-user', admin_controller.AdminUpdateUser)
router.delete('/delete-user', admin_controller.deleteUser)

router.get('/get-total-subscription', admin_controller.getTotalSubscription)

router.get('/get-user-plans', admin_controller.getplansByUserId)
router.get('/get-mocktest', admin_controller.getMocktestByUserId)
router.get('/get-mocktest-by-id', admin_controller.getMocktestById)



module.exports = router;
