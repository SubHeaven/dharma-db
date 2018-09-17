var _mysql = require('mysql');
const config = require('dharma-config');
var database = {}

database.pool = _mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.dbu,
    password: config.dbp,
    database: config.database
});

database.query = function (sql, callback) {
    database.pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (typeof (callback) !== "undefined" && callback != null) {
            callback(results, fields)
        }
    });
};

module.exports = database;