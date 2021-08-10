const commenFunction = require('../../middlewares/common')
const UsersModel = require('../../models/user/users');
const moment = require("moment");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const _ = require('underscore');
const mongoose = require('mongoose')
const CategoryModel = require('../../models/admin/categories')
// const moment = require("moment");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken')
// const Constant = require('../../utilities/constants')
const SubCategoryModel = require('../../models/admin/subcategories')
const ChapterModel = require('../../models/admin/chapters')
const QuestionModel = require('../../models/admin/questions');
const constants = require('../../utilities/constants');
const MocktestModel = require('../../models/admin/mocketest');
const SubscriptionModel = require('../../models/admin/subscription');
const BuySubscriptionModel = require('../../models/user/buySubscription');
const CmsModel = require('../../models/user/cms');
const FlageModel = require('../../models/user/questionflag');
const PinQuestionModel = require('../../models/user/pinquestion');
class users {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            login: this.login.bind(this),
            updateProfile: this.updateProfile.bind(this),
            getCategoryList: this.getCategoryList.bind(this),
            getSubCategoryList: this.getSubCategoryList.bind(this),
            getChapterList: this.getChapterList.bind(this),
            getQuestionlist: this.getQuestionlist.bind(this),
            submitTest: this.submitTest.bind(this),
            startTest: this.startTest.bind(this),
            getPlans: this.getPlans.bind(this),
            getPlanById: this.getPlanById.bind(this),
            buySubscription: this.buySubscription.bind(this),
            setNewPassword: this.setNewPassword.bind(this),
            getcms: this.getcms.bind(this),
            getcmsById: this.getcmsById.bind(this),
            getResult: this.getResult.bind(this),
            flageQuestion: this.flageQuestion.bind(this),
            pinQuestions: this.pinQuestions.bind(this),
            SearchApi: this.SearchApi.bind(this),
            //     getResult: this.getResult.bind(this),
            //     flageQuestion: this.flageQuestion.bind(this),
            //     pinQuestions: this.pinQuestions.bind(this),
            //     SearchApi: this.SearchApi.bind(this)
        }
    }
    //create sign_up Api
    async _generateRefID() {
        try {
            let flage = false
            let fourDigitsRandom
            do {
                fourDigitsRandom = await Math.floor(1000 + Math.random() * 9000);
                let getData = await UsersModel.find({ Referral_id: fourDigitsRandom.toString() })
                if (getData.length > 0) {
                    flage = true
                } else {
                    flage = false
                }
            }
            while (flage);
            return '@' + fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async rendomOtp() {
        try {
            let fourDigitsRandom
            fourDigitsRandom = await Math.floor(1000 + Math.random() * 9000);
            return fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async signUp(req, res) {
        try {
            let saveData
            let data = {}
            let stoken
            let error
            let getUser
            let { name, email, profile_pic, state, country, pin, country_code, device_type, contact_number, gender, address, DOB, social_id, password, social_type, user_id } = req.body
            if (social_type == 'manual') {
                getUser = await UsersModel.findOne({ $and: [{ user_id: user_id }, { social_type: social_type }, { user_type: 'user' }] })
                // console.log("getUser", getUser)
                if (getUser) {
                    error = true
                } else {
                    // let imagePath
                    // if (profile_pic && profile_pic != "") {
                    //     let data = await commenFunction._uploadBase64image(profile_pic, 'ProfileImage')
                    //     imagePath = data.replace(/\\/g, "/");
                    // }

                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    saveData = new UsersModel({
                        name: name,
                        user_id: user_id,
                        profile_pic: profile_pic,
                        email: email,
                        password: hash,
                        contact_number: contact_number,
                        gender: gender,
                        address: address,
                        country_code: country_code,
                        pin: pin,
                        state: state,
                        country: country,
                        DOB: DOB,
                        social_id: "",
                        social_type: social_type,
                        device_type: device_type
                    })
                    data = await saveData.save();
                }
            } else {
                getUser = await UsersModel.findOne({ $and: [{ social_id: social_id }, { social_type: social_type }, { user_type: 'user' }] })
                if (getUser) {
                    data = getUser
                } else {
                    // let imagePath
                    // if (profile_pic && profile_pic != "") {
                    //     let data = await commenFunction._uploadBase64image(profile_pic, 'ProfileImage')
                    //     imagePath = data.replace(/\\/g, "/");
                    // }
                    // const salt = bcrypt.genSaltSync(10);
                    // const hash = bcrypt.hashSync(password, salt);
                    console.log()
                    saveData = new UsersModel({
                        name: name,
                        profile_pic: profile_pic,
                        user_id: user_id,
                        email: email,
                        contact_number: contact_number,
                        gender: gender,
                        address: address,
                        country_code: country_code,
                        pin: pin,
                        state: state,
                        country: country,
                        DOB: DOB,
                        social_id: social_id,
                        social_type: social_type,
                        device_type: device_type
                    })
                    console.log("saveData", saveData)
                    data = await saveData.save();
                }
            }
            if (data && !_.isEmpty(data)) {
                stoken = {
                    _id: data._id,
                    user_id: social_type != 'manual' ? data.social_id : data.user_id
                }
                let data1 = await UsersModel.findOne({ _id: data._id }).lean()
                console.log("dataatatat", data)
                // let token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '7d' });
                data1.token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '7d' });
                // data1.dictionary = data
                return res.json({ code: 200, success: true, message: 'Data save successfully', data: data1 })
            } else if (error) {
                res.json({ code: 404, success: false, message: 'Email/Number already exist', data: getUser.user_id })
            } else {
                res.json({ success: false, message: "Somthing went wrong", })
            }

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ success: false, message: "Somthing went wrong", })
        }

    }
    async login(req, res) {
        try {
            let { user_id, contact_number, password } = req.body
            let getUser = await UsersModel.findOne({ $and: [{ user_id: user_id }, { social_type: 'manual' }, { user_type: 'user' }] }).lean()
            if (getUser) {
                if (getUser.block_user == '1') {
                    return res.json({ code: 404, success: false, message: 'User is blocked by admin', })
                } else {
                    let verifypass = await bcrypt.compareSync(password, getUser.password);
                    if (verifypass) {
                        let stoken = {
                            _id: getUser._id,
                            user_id: getUser.user_id
                        }
                        // getUser.token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '7d' });
                        let data1 = getUser
                        data1.token = await jwt.sign(stoken, process.env.SUPERSECRET, { expiresIn: '7d' });
                        // data1.dictionary = getUser
                        res.json({ code: 200, success: true, message: 'login successfully', data: data1 })
                    } else {
                        res.json({ code: 404, success: false, message: 'invalid password', })
                    }
                }

            } else {
                res.json({ code: 404, success: false, message: 'Email is not register', })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ success: false, message: "Somthing went wrong", })
        }
    }
    async setNewPassword(req, res) {
        try {
            let { user_id, password } = req.body
            let getUser = await UsersModel.findOne({ $and: [{ user_id: user_id }, { social_type: 'manual' }, { user_type: 'user' }] }).lean()
            if (getUser) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                getUser.password = hash
                let updatedata = await UsersModel.findOneAndUpdate({ _id: getUser._id }, { $set: getUser })
                res.json({ code: 200, success: false, message: 'password is successfully Updated', })
            } else {
                res.json({ code: 404, success: false, message: 'Email/number is not register', })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ success: false, message: "Somthing went wrong", })
        }
    }
    async updateProfile(req, res) {
        try {
            let { user_id, name, profile_pic, contact_number, gender, address, DOB, email, social_type } = req.body
            let getUser = await UsersModel.findOne({ $and: [{ user_id: user_id }, { social_type: social_type }, { user_type: 'user' }] }).lean()
            if (getUser) {
                if (getUser.block_user == '1') {
                    return res.json({ code: 404, success: false, message: 'User is blocked by admin', })
                } else {
                    if (name && name != "") {
                        getUser.name = name
                    }
                    if (profile_pic && profile_pic != "") {
                        // let data = await commenFunction._uploadBase64image(profile_pic, 'ProfileImage')
                        // getUser.profile_pic = data.replace(/\\/g, "/");
                        getUser.profile_pic = profile_pic
                    }
                    if (contact_number && contact_number != "") {
                        getUser.contact_number = contact_number
                    }
                    if (gender && gender != "") {
                        getUser.gender = gender
                    }
                    if (address && address != "") {
                        getUser.address = address
                    }
                    if (DOB && DOB != "") {
                        getUser.DOB = DOB
                    }
                    if (email && email != "") {
                        getUser.email = email
                    }
                    let data1 = {}
                    data1 = await UsersModel.findOneAndUpdate({ user_id: user_id }, { $set: getUser }, { new: true })
                    res.json({ code: 200, success: true, message: 'login successfully', data: data1 })
                }
            } else {
                res.json({ code: 404, success: false, message: 'Email is not register', })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ success: false, message: "Somthing went wrong", })
        }
    }

    async getCategoryList(req, res) {
        try {
            let data = await CategoryModel.find({ status: 'active' })
            // console.log("news", data)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getSubCategoryList(req, res) {
        try {
            if (req.query._id) {
                let data = {}
                data.categorylist = await SubCategoryModel.find({ category: req.query._id, status: 'active' }, { category_meta: 0 }).lean()
                data.images = constants.subcategoryImageArray
                // data.push(constants.subcategoryImageArray)
                res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getChapterList(req, res) {
        try {
            let data = await ChapterModel.find({ subcategory: req.query._id }, { subcategory_meta: 0, category_meta: 0 })
            // console.log("news", data)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getQuestionlist(req, res) {
        try {
            let { category, subcategory, chapter, difficulty_level, page, limit } = req.body
            let options = {
                page: Number(page) || 1,
                limit: Number(limit) || 20,
                sort: { createdAt: -1 },
                lean: true,
                select: {
                    "question": 1,
                    "options": 1,
                    // "chapter_meta": 1,
                    "info": 1,
                    "difficulty_level": 1,
                    "category_meta.name": 1,
                    "subcategory_meta.name": 1,
                    "chapter_meta.name": 1,
                    "chapter": 1,
                    "correct_index": 1,
                    "is_image": 1,
                    // 'question options info chapter_meta'
                }
            }
            let query = {}
            if (category) { query.category = req.body.category }
            if (subcategory) {
                // query['chapter_meta.subcategory'] = req.body.subcategory
                query.subcategory = req.body.subcategory
            }
            if (difficulty_level) {
                query.difficulty_level = req.body.difficulty_level
            }
            let get_chapter
            if (chapter) {
                query.chapter = req.body.chapter
                get_chapter = await ChapterModel.findOne({ _id: req.body.chapter })
            }
            console.log("query", query)

            let data = await QuestionModel.paginate(query, options)
            // console.log("news", data)
            data.time = Number(get_chapter.time.split("m")[0]);
            res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async startTest(req, res) {
        try {
            const { user_id, chapter_id } = req.body
            // let data ={}
            const start_time = moment().utcOffset("+05:30").format("DD.MM.YYYY HH.mm.ss")
            let data = await MocktestModel.findOne({ user_id: user_id, chapter: chapter_id }).lean()
            if (data) {
                data.start_time = start_time
                data.online_status = 'online'
                data = await MocktestModel.findOneAndUpdate({ user_id: user_id, chapter: chapter_id },
                    { $set: data }, { new: true }).lean()
                res.json({ code: 200, success: true, message: "Test update successfully ", data: data })
            } else {
                let saveData = new MocktestModel({
                    user_id: user_id,
                    start_time: start_time,
                    chapter: chapter_id,
                    online_status: 'online',
                })
                let data1 = await saveData.save();
                res.json({ code: 200, success: true, message: "Test create successfully ", data: data1 })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    ///// enum: ['online', 'complete', 'pending', ],
    async submitTest(req, res) {
        try {
            const { user_id, chapter_id, attampt_question, end_time, start_time } = req.body
            // let getData = await MocktestModel.findOne({ user_id: user_id, chapter: chapter_id }).lean()
            // if (getData) {
            //     res.json({ code: 200, success: true, message: "Already submit successfully ", data: getData })

            // } else {
                // let newArray = JSON.parse(attampt_question)
                await MocktestModel.deleteOne({ user_id: user_id, chapter: chapter_id }).lean()

                var mins = moment.utc(moment(end_time, "HH:mm:ss").diff(moment(start_time, "HH:mm:ss"))).format("HH:mm:ss")

                let totalQuestionNo = attampt_question.length
                let attampt_question1 = await attampt_question.filter((item) => {
                    if (item.questionId != "") {
                        return item
                    }
                });
                let correct_question1 = await attampt_question1.filter((item) => item.currectOption == item.selectedOption);
                let wrong_question1 = await attampt_question1.filter((item) => item.currectOption != item.selectedOption);
                let percentage = ((correct_question1.length / attampt_question.length) * 100).toFixed(2)
                let tag = percentage < 30 ? 'fail' : percentage > 30 && percentage < 50 ? "poor" : percentage > 50 && percentage < 70 ? "good" : 'excellent'
                let saveData = new MocktestModel({
                    user_id: user_id,
                    end_time: end_time,
                    start_time: start_time,
                    chapter: chapter_id,
                    online_status: 'complete',
                    attampt_questions: attampt_question1,
                    attampt_total: attampt_question1.length,
                    correct_answer: correct_question1.length,
                    wrong_questions_meta: wrong_question1,
                    correct_answer_meta: correct_question1,
                    wrong_questions: (attampt_question1.length - correct_question1.length),
                    total_questions: totalQuestionNo,
                    percentage: percentage + "%",
                    tag: tag,
                    online_time: mins
                })
                let data1 = await saveData.save();
                res.json({ code: 200, success: true, message: "submit successfully ", data: data1 })
            // }

            // const end_time = moment().utcOffset("+05:30").format("DD.MM.YYYY HH.mm.ss")
            // let data = await MocktestModel.findOne({ user_id: user_id, chapter: chapter_id }).lean()
            // console.log("data",data)
            // if (data.online_status == 'complete') {
            //     res.json({ code: 200, success: true, message: "Already submit successfully ", data: data })
            // } else if (data) {
            //     data.end_time = end_time
            //     data.attampt_question = attampt_question
            //     data.online_status = 'complete'
            //     data = await MocktestModel.findOneAndUpdate({ user_id: user_id, chapter: chapter_id },
            //         { $set: data }, { new: true }).lean()
            //     res.json({ code: 200, success: true, message: "submit successfully ", data: data })
            // } else {
            //     res.json({ code: 200, success: true, message: "first need to start test ", })
            // }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }

    async getPlans(req, res) {
        try {
            let options = {
                page: Number(req.body.page) || 1,
                limit: Number(req.body.limit) || 10,
                sort: { createdAt: -1 },
                lean: true,
            }
            let query = {}
            if (req.body.searchData) {
                query = { $or: [{ question: { $regex: req.body.searchData, $options: "i" } }, { content: { $regex: req.body.searchData, $options: "i" } }] }
            }
            let data = await SubscriptionModel.paginate(query, options)
            // console.log("news", data)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Somthing went wrong", })
        }
    }
    async getPlanById(req, res) {
        try {
            let id = req.query._id
            //    console.log("hiiii", category_meta, subcategory_meta, chapter_meta )
            let getdata = await SubscriptionModel.findOne({ _id: id })

            res.json({ code: 200, success: true, message: 'Update successfully', data: getdata })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async buySubscription(req, res) {
        try {
            const { user_id, subscription_id, payment_id } = req.body
            let getPlane = await SubscriptionModel.findOne({ _id: subscription_id }).lean()
            if (getPlane) {
                const buy_date = moment().utcOffset("+05:30").format("DD.MM.YYYY HH.mm.ss");
                const expire_date = moment(buy_date, "DD.MM.YYYY HH.mm.ss").add(Number(getPlane.days), 'days')
                // console.log("buy_date  expire_date", buy_date, expire_date)
                // let getBuyPlane = await BuySubscriptionModel.findOne({ subscription_id: subscription_id, user_id: user_id }).lean()
                let data = {}
                // if (getBuyPlane) {
                //     data = await BuySubscriptionModel.findOneAndUpdate({ subscription_id: subscription_id, user_id: user_id },
                //         {
                //             $set: {
                //                 buy_date: buy_date,
                //                 expire_date: expire_date,
                //                 status: 'active',
                //                 // buy_count: getBuyPlane.buy_count +1
                //             },
                //             $inc :{buy_count:1}

                //         }, {new: true}).lean()
                // } else {

                // }
                let saveData = new BuySubscriptionModel({
                    user_id: user_id,
                    subscription_id: subscription_id,
                    buy_date: buy_date,
                    expire_date: expire_date,
                    plan_meta: getPlane,
                    payment_id: payment_id,
                })
                data = await saveData.save();

                res.json({ code: 200, success: true, message: 'Buy successfully', data: data })
            } else {
                res.json({ code: 404, success: true, message: 'Data not found' })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async getcms(req, res) {
        try {
            let options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // select: 'name user_type minner_Activity createdAt',
            }
            let query = {}
            let getUser = await CmsModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully ", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }

    }
    async getcmsById(req, res) {
        try {
            let id = req.query._id
            //    console.log("hiiii", category_meta, subcategory_meta, chapter_meta )
            let getdata = await CmsModel.findOne({ _id: id })

            res.json({ code: 200, success: true, message: 'Update successfully', data: getdata })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async getResult(req, res) {
        try {
            const { user_id, chapter_id } = req.body
            let getData = await MocktestModel.findOne({ user_id: user_id, chapter: chapter_id }).lean()
            getData.attampt_question = JSON.parse(getData.attampt_question)
            // console.log( typeof JSON.parse(getData.attampt_question))
            getData.totalCurrectAns = await getData.attampt_question.filter((item) => {
                if (item.questionId != "") {
                    return item.currectOption == item.selectedOption
                }
            });
            res.json({ code: 200, success: true, message: 'Update successfully', data: getData })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    async flageQuestion(req, res) {
        try {
            const { user_id, question_id, status } = req.body
            let getQuestion = await FlageModel.findOne({ user_id: user_id, question_id: question_id }).lean()
            if (getQuestion) {
                let update
                if (status == '0') {
                    update = await FlageModel.deleteOne({ user_id: user_id, question_id: question_id })
                } else {
                    update = await FlageModel.findOneAndUpdate({ user_id: user_id, question_id: question_id }, { $set: { flag: status } }, { new: true })
                }
                res.json({ code: 200, success: true, message: 'flag update successfully', data: ""  })
            } else {
                let getQuestion1 = await QuestionModel.findOne({ _id: question_id }).lean()
                let saveData = new FlageModel({
                    user_id: user_id,
                    question_id: question_id,
                    flag: status,
                    meta_data: getQuestion1
                })
                let data = await saveData.save();
                res.json({ code: 404, success: true, message: 'flag successfully', data: "" })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async pinQuestions(req, res) {
        try {
            const { user_id, question_id, status } = req.body
            let getQuestion = await PinQuestionModel.findOne({ user_id: user_id, question_id: question_id }).lean()
            if (getQuestion) {
                let update
                if (status == '0') {
                    update = await PinQuestionModel.deleteOne({ user_id: user_id, question_id: question_id })
                } else {
                    update = await PinQuestionModel.findOneAndUpdate({ user_id: user_id, question_id: question_id }, { $set: { pin_status: status } }, { new: true }).lean()
                }

                res.json({ code: 200, success: true, message: 'pin update successfully', data: ""  })
            } else {
                let getQuestion1 = await QuestionModel.findOne({ _id: question_id }).lean()
                let saveData = new PinQuestionModel({
                    user_id: user_id,
                    question_id: question_id,
                    pin_status: status,
                    meta_data: getQuestion1
                })
                let data = await saveData.save();

                res.json({ code: 404, success: true, message: 'pin successfully', data: "" })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }
    // [category ,subcategory, pin, flag, question, chapters]
    async SearchApi(req, res) {
        try {
            const { user_id, search_data, } = req.body
           let search_types = req.body.search_types || ['category' ,'subcategory', 'pin', 'flag', 'question', 'chapter']
            
            let data = {};
            let categoryData;
            let subcategoryData;
            let pinData;
            let flageData;
            let QuestionData;
            let chapterData;
            if (search_types.length > 0) {
                for (let iterator of search_types) {
                    if (iterator == 'category') {
                        categoryData = await this._categorySearch(search_data)
                        data.categories = categoryData
                    }
                    if (iterator == 'subcategory') {
                        subcategoryData = await this._subcategorySearch(search_data)
                        data.subcategories = subcategoryData
                    }
                    if (iterator == 'pin') {
                        pinData = await this._pinSearch(user_id, search_data)
                        data.pin_questions = pinData
                    }
                    if (iterator == 'flag') {
                        flageData = await this._flageSearch(user_id, search_data)
                        data.flag_question = flageData
                    }
                    if (iterator == 'question') {
                        QuestionData = await this._questionSearch(search_data)
                        data.questions = QuestionData
                    }
                    if (iterator == 'chapter') {
                        chapterData = await this._chapterSearch(search_data)
                        data.chapters = chapterData
                    }
                }
            }



            res.json({ code: 200, success: true, message: 'get successfully', data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", })
        }
    }

    async _categorySearch(data) {
        let searchData = data
        try {
            let SearchResult = await CategoryModel.aggregate([{ $match: { $or: [{ name: { $regex: searchData, $options: "i" } }, { content: { $regex: searchData, $options: "i" } }] } }])
            // let newArray = [];
            // for (let element of articleSearchResult) {
            //     let newObj = {}
            //     newObj.image = "http://52.14.78.31:5000/company_project/thumbnailimage/image-1591176387819.jpg"
            //     if (element.header_media.type == "image") {
            //         if (Array.isArray(element.header_media)) {
            //             newObj.image = element.header_media[0].url
            //         } else {
            //             newObj.image = element.header_media.url
            //         }

            //     }
            //     newObj._id = element._id
            //     newObj.title = element.title
            //     newObj.type = element.type

            //     newArray.push(newObj)

            // }
            return SearchResult;
        } catch (err) {
            console.log("err", err)
            throw err
        }
    }
    async _questionSearch(data) {
        let searchData = data
        try {
            let SearchResult = await QuestionModel.aggregate([{ $match: { $or: [{ question: { $regex: searchData, $options: "i" } }] } }, { $project: { question: 1 } }])
            return SearchResult;
        } catch (err) {
            console.log("err", err)
            throw err
        }
    }
    async _chapterSearch(data) {
        let searchData = data
        try {
            let SearchResult = await ChapterModel.aggregate([{ $match: { $or: [{ name: { $regex: searchData, $options: "i" } }] } }, { $project: { name: 1, is_mocktest: 1, questions: 1, time: 1, marks: 1 } }])
            return SearchResult;
        } catch (err) {
            console.log("err", err)
            throw err
        }
    }
    async _subcategorySearch(data) {
        let searchData = data
        try {
            let SearchResult = await SubCategoryModel.aggregate([{ $match: { $or: [{ name: { $regex: searchData, $options: "i" } }] } }, { $project: { name: 1, status: 1, "category_meta.name": 1 } }])
            return SearchResult;
        } catch (err) {
            console.log("err", err)
            throw err
        }
    }
    async _flageSearch(user_id, data) {
        let searchData = data
        let id = mongoose.Types.ObjectId(user_id);
        try {
            let SearchResult = await FlageModel.aggregate([{
                $match: {
                    $and: [{user_id: id},{'meta_data.question': { $regex: searchData, $options: "i" } }]
                }
            }, { $project: {user_id:1, flag: 1, "meta_data.question": 1 } }])
            return SearchResult;
        } catch (err) {
            console.log("err", err)
            throw err
        }
    }

    async _pinSearch(user_id, data) {
        let searchData = data
        let id = mongoose.Types.ObjectId(user_id);
        try {
            let SearchResult = await PinQuestionModel.aggregate([{
                $match: {
                    $and: [{user_id: id},{'meta_data.question': { $regex: searchData, $options: "i" } }]
                }
            }, { $project: {user_id:1, pin_status: 1, "meta_data.question": 1 } }])
             return SearchResult;
        } catch (err) {
            console.log("err", err)
            throw err
        }
    }

    //////////////////////////////////////////////////////////////////////////////////end aipl/////////////////////////////////////////

    async verifyOtp(req, res) {
        try {

            let { number, otp } = req.body
            let getUser = await UsersModel.findOne({ number: Number(number) }).lean();
            // console.log("getUser", getUser)
            if (getUser) {
                let dt = moment().utcOffset("+05:30").format("DD.MM.YYYY HH.mm.ss");
                let endDate = moment(dt, "DD.MM.YYYY HH.mm.ss");
                let startDate = moment(getUser.otp_details.otp_time, "DD.MM.YYYY HH.mm.ss");
                // console.log(",,,", getUser.otp_details.otp != Number(otp), getUser.otp_details.otp, Number(otp))
                if (getUser.otp_details.otp != Number(otp)) {
                    errorMessage = "Otp is invalid"
                }
                if (Number(endDate.diff(startDate, 'seconds')) > 120) {
                    errorMessage = "Time is expired"

                } if (Number(endDate.diff(startDate, 'seconds')) <= 120 && getUser.otp_details.otp == Number(otp)) {
                    getUser.otp_details.status = true
                    getUser.otp_details.otp = 0
                    data = await UsersModel.findOneAndUpdate({ _id: getUser._id }, getUser)
                    successMessage = "Otp verified successfully"
                }
            } else {
                errorMessage = "Authentication is Failed"
            }
            if (errorMessage) {
                res.json({ success: false, message: errorMessage })
            } else {
                res.json({ success: true, message: successMessage })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ success: false, message: "Somthing went wrong", data: null })
        }
    }

}

module.exports = new users();