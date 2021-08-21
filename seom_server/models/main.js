const pool = require('../modules/pool');

const main = {
    getMainInfo : async(userIdx) => {
        const nameQuery = `SELECT name FROM user WHERE userIdx = ?`;
        const deceasedQuery = `		SELECT ild.islandIdx, ild.deceasedName, ild.deceasedProfileImg, IF(usr_ild.userIdx = ild.userIdx, true, false) AS madeByMyself
                                    FROM island ild
                                    JOIN user_island usr_ild ON usr_ild.islandIdx = ild.islandIdx 
                                    WHERE usr_ild.userIdx = ?`;
        
        try {
            let result = {};
            let nameResult = await pool.queryParamArr(nameQuery, [userIdx]);
            let deceasedResult = await pool.queryParamArr(deceasedQuery, [userIdx]);

            result.name = nameResult[0].name;
            result.deceasedInfo = deceasedResult;
            return result;
        } catch(err) {
            console.log('getMainInfo err: ', err);
            throw err;
        }
    },

    deleteIsland : async(userIdx, islandIdx) => {
        const query = `DELETE FROM user_island
                    WHERE user_island.userIdx = ${userIdx} AND user_island.islandIdx = ${islandIdx}`;
        
        try {
            let result = await pool.queryParam(query);
            return result;
        } catch(err) {
            console.log('deleteIsland err: ', err);
            throw err;
        }
    },

    addIsland : async(userIdx, deceasedName, deceasedBirth, deceasedDeath, relation, imgLocation) => {
        const fields = `userIdx, deceasedName, deceasedBirth, deceasedDeath, relation, deceasedProfileImg`;
        const question = `?,?,?,?,?,?`;
        const values = [userIdx, deceasedName, deceasedBirth, deceasedDeath, relation, imgLocation];

        const query = `INSERT INTO island(${fields}) VALUES(${question})`;
        try {
            let result = await pool.queryParamArr(query, values);
            
            let islandIdx = result.insertId;
            const query2 = `INSERT INTO user_island(userIdx, islandIdx) VALUES(${userIdx}, ${islandIdx})`;
            await pool.queryParam(query2);
            
            const resultQuery = `	SELECT islandIdx, deceasedName, deceasedBirth, deceasedDeath, deceasedProfileImg, userIdx, likes, relation, date_format(createDate, '%Y.%m.%d') as createDate
                                    FROM island
                                    WHERE islandIdx = ?`;
            
            const addResult = await pool.queryParamArr(resultQuery, [islandIdx]);
            return addResult;
        } catch(err) {
            console.log('addIsland err: ', err);
            throw err;
        }
    },

    searchIsland : async(deceasedName) => {
        const queryWords = deceasedName.replace(/(\s)/g, "%");

        const query = `SELECT ild.islandIdx, ild.deceasedProfileImg, ild.deceasedName, ild.deceasedBirth, ild.deceasedDeath, usr.id, ild.likes
                        FROM island ild
                        JOIN user usr ON ild.userIdx = usr.userIdx
                        WHERE ild.deceasedName = "${deceasedName}"
                        ORDER BY ild.likes DESC`;

        try {
            let result = await pool.queryParam(query);
            return result;
        } catch(err) {
            console.log('searchIsland err: ', err);
            throw err;
        }
    }
}

module.exports = main;