const pool = require('../modules/pool');

const main = {
    getMainInfo : async(userIdx) => {
        const nameQuery = `SELECT name FROM user WHERE userIdx = ?`;
        const deceasedQuery = `	SELECT ild.islandIdx, ild.deceasedName, ild.deceasedProfileImg
                                FROM island ild
                                JOIN bookmark bm ON ild.islandIdx = bm.islandIdx 
                                WHERE bm.userIdx = ?`;
        
        try {
            let result = {};
            let nameResult = await pool.queryParamArr(nameQuery, [userIdx]);
            let deceasedResult = await pool.queryParamArr(deceasedQuery, [userIdx]);

            await Promise.all(deceasedResult.map(async(element) => {
                let islandIdx = element.islandIdx;
                let isMyIsland = `SELECT IF(COUNT(usr_ild.islandIdx) > 0, true, false) AS madeByMyself
                                    FROM user_island usr_ild
                                    WHERE usr_ild.islandIdx = ${islandIdx} AND usr_ild.userIdx = ${userIdx}`;
                let isMyIslandResult = await pool.queryParam(isMyIsland);
                
                element.madeByMyself = isMyIslandResult[0].madeByMyself;
            }));

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
            const insertUserIsland = `INSERT INTO user_island(userIdx, islandIdx) VALUES(${userIdx}, ${islandIdx})`;
            const insertBookmark = `INSERT INTO bookmark(userIdx, islandIdx) VALUES(${userIdx}, ${islandIdx})`;

            await pool.queryParam(insertUserIsland);
            await pool.queryParam(insertBookmark);
            
            const resultQuery = `	SELECT islandIdx, deceasedName, deceasedBirth, deceasedDeath, deceasedProfileImg, userIdx, bookmark, relation, date_format(createDate, '%Y.%m.%d') as createDate
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

        const query = `SELECT ild.islandIdx, ild.deceasedProfileImg, ild.deceasedName, ild.deceasedBirth, ild.deceasedDeath, usr.id, ild.bookmark
                        FROM island ild
                        JOIN user usr ON ild.userIdx = usr.userIdx
                        WHERE ild.deceasedName = "${deceasedName}"
                        ORDER BY ild.bookmark DESC`;

        try {
            let result = await pool.queryParam(query);
            return result;
        } catch(err) {
            console.log('searchIsland err: ', err);
            throw err;
        }
    },

    isBookmark : async(userIdx, islandIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM bookmark WHERE userIdx = ${userIdx} and islandIdx = ${islandIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('isBookmark err: ', err);
        }throw err;
    },

    addBookmark : async(userIdx, islandIdx) => {
        const fields = `userIdx, islandIdx`;
        const question = `?,?`;
        const values = [userIdx, islandIdx];

        let query1 = `INSERT INTO bookmark(${fields}) VALUES(${question})`;
        let query2 = `UPDATE island SET bookmark = bookmark+1 WHERE islandIdx = ${islandIdx}`;
        let query3 = `SELECT bookmark AS bookmarkCount FROM island WHERE islandIdx = ${islandIdx}`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('addBookmark err: ', err);
        }throw err;
    },

    deleteBookmark : async(userIdx, islandIdx) =>{
        let query1 = `DELETE FROM bookmark WHERE userIdx = ${userIdx} and islandIdx = ${islandIdx}`;
        let query2 = `UPDATE island SET bookmark = bookmark-1 WHERE islandIdx = ${islandIdx}`;
        let query3 = `SELECT bookmark AS bookmarkCount FROM island WHERE islandIdx = ${islandIdx}`;
        try{
            let result1 = await pool.queryParam(query1);
            let result2 = await pool.queryParam(query2);
            let result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('deleteBookmark err: ', err);
        }throw err;
    },
}

module.exports = main;