const colors = require("colors");
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const mssql = require("mssql");
const config = require("./config");
const objectConnect = config.StringConnect;

// TABLE = DANHSACHGOITHAU

module.exports = {
    
    KiemTraTonTaiGoi: async (tbmt) => {
        try {
        let pool = await mssql.connect(objectConnect);
        let sql =
            "IF EXISTS (SELECT * FROM DANHSACHGOITHAU WHERE MA_TBMT = @tbmt) SELECT 'true' AS DataExists ELSE SELECT 'false' AS DataExists;";
        let result = await pool.request().input("tbmt", tbmt).query(sql);
        return result;
        } catch (err) {
        console.log(colors.red(err));
        }
    },

    ThemGoiThau: async (MA_TBMT,TENGOITHAU,BENMOITHAU,CHUDAUTU,NGAYDANGTAITHONGBAOTEXT,NGAYDANGTAITHONGBAO,LINHVUC,DIADIEM,
                        THOIDIEMDONGTHAU,HINHTHUCDUTHAU,NHATRUNGTHAU,GIATRUNGTHAU,NGAYPHEDUYETKQLCNT,TRANGTHAIGOITHAU,URL) => {
        try {
        let pool = await mssql.connect(objectConnect);
        let sql = `INSERT INTO DANHSACHGOITHAU 
                   (MA_TBMT,TENGOITHAU,BENMOITHAU,CHUDAUTU,NGAYDANGTAITHONGBAOTEXT,NGAYDANGTAITHONGBAO,LINHVUC,DIADIEM,
                   THOIDIEMDONGTHAU,HINHTHUCDUTHAU,NHATRUNGTHAU,GIATRUNGTHAU,NGAYPHEDUYETKQLCNT,TRANGTHAIGOITHAU,URL) 
                   OUTPUT INSERTED.MA_TBMT
                   VALUES 
                   (@MA_TBMT,@TENGOITHAU,@BENMOITHAU,@CHUDAUTU,@NGAYDANGTAITHONGBAOTEXT,@NGAYDANGTAITHONGBAO,@LINHVUC,@DIADIEM,
                   @THOIDIEMDONGTHAU,@HINHTHUCDUTHAU,@NHATRUNGTHAU,@GIATRUNGTHAU,@NGAYPHEDUYETKQLCNT,@TRANGTHAIGOITHAU,@URL)`
        let result = await pool.request()
                    .input("MA_TBMT", MA_TBMT)
                    .input("TENGOITHAU", TENGOITHAU)
                    .input("BENMOITHAU", BENMOITHAU)
                    .input("CHUDAUTU", CHUDAUTU)
                    .input("NGAYDANGTAITHONGBAOTEXT", NGAYDANGTAITHONGBAOTEXT)
                    .input("NGAYDANGTAITHONGBAO", NGAYDANGTAITHONGBAO)
                    .input("LINHVUC", LINHVUC)
                    .input("DIADIEM", DIADIEM)
                    .input("THOIDIEMDONGTHAU", THOIDIEMDONGTHAU)
                    .input("HINHTHUCDUTHAU", HINHTHUCDUTHAU)
                    .input("NHATRUNGTHAU", NHATRUNGTHAU)
                    .input("GIATRUNGTHAU", GIATRUNGTHAU)
                    .input("NGAYPHEDUYETKQLCNT", NGAYPHEDUYETKQLCNT)
                    .input("TRANGTHAIGOITHAU", TRANGTHAIGOITHAU)
                    .input("URL", URL)
                    .query(sql);
                    
        return result;
        } catch (err) {
        console.log(colors.red(err));
        }
    },
};
