const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const userModel = require('../models/user');

module.exports = {
    signup : async(req, res) => {
        const {id, password, name, birth} = req.body;
        if(!id || !password || !name || !birth) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } 

        const idx = await userModel.signup(id, password, name, birth);
        console.log('idx: ', idx);
        
        if(idx == -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER));
    },

}