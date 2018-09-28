var _mysql = require('mysql');
const config = require('dharma-config');
var database = {}

database.checkconfig = function (callback) {
    _err = [];
    if (typeof (config.host) === "undefined") {
        _err.push("O atributo obrigatório [host] no arquivo de configuração não foi encontrado!");
    }
    if (typeof (config.dbu) === "undefined") {
        _err.push("O atributo obrigatório [dbu] no arquivo de configuração não foi encontrado!");
    }
    if (typeof (config.dbp) === "undefined") {
        _err.push("O atributo obrigatório [dbp] no arquivo de configuração não foi encontrado!");
    }
    if (typeof (config.database) === "undefined") {
        _err.push("O atributo obrigatório [database] no arquivo de configuração não foi encontrado!");
    }

    _result = _err.length <= 0;
    _err = _err.length > 0 ? _err.join("\n") : null;

    if (typeof (callback) === "undefined") {
        return _result, _err;
    } else {
        callback(_result, _err);
    }
}

database.pool = _mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.dbu,
    password: config.dbp,
    database: config.database
});

database.query = function (sql, callback, error) {
    database.checkconfig(function (result, err) {
        if (result) {
            database.pool.query(sql, function (err, results, fields) {
                if (err) {
                    if (typeof (error) !== "undefined" && error != null) {
                        error(err);
                    } else {
                        throw err;
                    }
                } else if (typeof (callback) !== "undefined" && callback != null) {
                    callback(results, fields)
                }
            });
        } else {
            if (typeof (error) !== "undefined" && error != null) {
                error(err);
            } else {
                throw err;
            }
        }
    });
};

module.exports = database;