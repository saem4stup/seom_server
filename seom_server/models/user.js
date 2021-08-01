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
}

module.exports = user;