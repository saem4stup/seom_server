const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const userModel = require('../models/user');

module.exports = {
    signup : async(req, res) => {
        const {id, password, name, birth} = req.body;
        console.log('id: ', id);
        console.log('pw: ', password);
        console.log('name: ', name);
        console.log('birth: ', birth);
        const profile = req.files;
        console.log("img: ", profile);
        const imgLocation = profile.map(profile => profile.location);
        if(!id || !password || !name || !birth || profile === undefined) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } 

        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
        }

        const alreadyUserId = await userModel.checkAlreadyUserId(id);
        if(alreadyUserId) {
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ALREADY_ID, {duplicate : id}));
        }

        const idx = await userModel.signup(id, password, name, imgLocation, birth);
        
        if(idx == -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {userIdx:idx}));
    },

    signin : async(req, res) => {
        const {id, password} = req.body;
        console.log('id: ', id);
        console.log('pw: ', password);

        if(!id || !password) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }

        const user = await userModel.getUserById(id);

        if(user.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        if(user[0].password != password) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {userIdx: user[0].userIdx}));
    },

    check_id : async(req, res) => {
        const {id} = req.body;

        if(!id) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));   
        }

        const alreadyUserId = await userModel.checkAlreadyUserId(id);
        console.log(alreadyUserId)
        if(alreadyUserId) {
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ALREADY_ID, {duplicate : id}));
        }

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_DUPLICATE, {duplicate : 'available'}));
    }
}