const colors = require("colors");
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const mssql = require("mssql");
const { config } = require("./config");

module.exports = {
    checkThauExists: async (so_tbmt) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM dulieu_thau WHERE so_tbmt = @so_tbmt";
            let result = await pool
                .request()
                .input("so_tbmt", so_tbmt)
                .query(sql);
            return !!result.recordset.length;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    
    insertThau: async (so_tbmt) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "INSERT INTO dulieu_thau (so_tbmt) VALUES (@so_tbmt);";
            let result = await pool
                .request()
                .input("so_tbmt", so_tbmt)
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
};
