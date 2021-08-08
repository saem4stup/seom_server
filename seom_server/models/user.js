const pool = require('../modules/pool');
const table = 'user';

const user = {
    signup : async (id, password, name, profileImg, birth) => {
        const fields = 'id, password, name, profileImg, birth';
        const questions = `?, ?, ?, ?, ?`;
        const values = [id, password, name, profileImg, birth];
        const query = `INSERT INTO user(${fields}) VALUES(${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch(err) {
            console.log('signup error: ', err);
            throw err;
        }
    },

    getUserById : async(id) => {
        const query = `SELECT * FROM ${table} WHERE id = ?`;
        
        try {
            return await pool.queryParamArr(query, [id]);
        } catch(err) {
            console.log('getUserById err: ', err);
            throw err;
        }
    },

    checkAlreadyUserId : async(id) => {
        const query = `SELECT userIdx FROM ${table} WHERE id = ?`;

        try {
            const result = await pool.queryParamArr(query, [id]);
            
            if(result.length === 0) { //not used id
                return false;
            } else { //already used id
                return true;
            }
        } catch(err) {
            console.log('checkAlreadyUserId err: ', err);
            throw err;
        }
    }
}

module.exports = user;