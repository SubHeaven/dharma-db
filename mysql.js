var _mysql = require('mysql');
const config = require('dharma-config');
var yaml = require('js-yaml');
var database = {}

database.pool = _mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.dbu,
    password: config.dbp,
    database: config.database
});

database.createTable = function(scheme) {
    let _sql = "CREATE TABLE IF NOT EXISTS " + scheme.name + " ( ";
    _sql += "id INT AUTO_INCREMENT, ";

    for (let i = 0; i < scheme.fields.length; i++) {
        if (scheme.fields[i].name != "id") {
            _nullable = "nullable" in scheme.fields[i] && scheme.fields[i].nullable === false ? "NOT NULL" : "";
            switch(scheme.fields[i].type) {
                case "string":
                    _sql += scheme.fields[i].name + " VARCHAR(" + scheme.fields[i].size + ") " + _nullable + ", ";
            }
        }
    }

    _sql += "PRIMARY KEY (id)) ENGINE=INNODB;"
    console.log(_sql);
}

database.createTableFromFile = function(filepath) {
}

database.loadScheme = function(filepath) {
    try {
        scheme = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));
        console.log(scheme);
    } catch (e) {
        console.log(e);
    }
}

database.query = function (sql, callback) {
    database.pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (typeof (callback) !== "undefined" && callback != null) {
            callback(results, fields)
        }
    });
};

module.exports = database;