const pool = require('../modules/pool');

const user = {
    signup : async (id, password, name, birth) => {
        const fields = 'id, password, name, birth';
        const questions = `?, ?, ?, ?`;
        const values = [id, password, name, birth];
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