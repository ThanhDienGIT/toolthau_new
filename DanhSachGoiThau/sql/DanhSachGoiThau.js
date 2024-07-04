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

    selectDanhSachGoiThau: async () => {
        try {
        let pool = await mssql.connect(objectConnect);
        let sql ="select * from DanhSachGoiThau";
        let result = await pool.request().query(sql);
        return result.recordset;
        } catch (err) {
        console.log(colors.red(err));
        }
    },



    TestADDSQL : async (data) =>
    {
        console.log('data',data)
        let pool = await mssql.connect(objectConnect);
        const table = new pool.table("TEST") // Tạo bảng tạm thời
        console.log(table)
        table.create = true;
        table.columns.add('MA_TBMT', mssql.VarChar(100));
        // table.columns.add('TENGOITHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('BENMOITHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('CHUDAUTU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('NGAYDANGTAITHONGBAOTEXT', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('NGAYDANGTAITHONGBAO', mssql.Date,{ nullable: true });
        // table.columns.add('LINHVUC', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('DIADIEM', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('THOIDIEMDONGTHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('HINHTHUCDUTHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('NHATRUNGTHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('GIATRUNGTHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('NGAYPHEDUYETKQLCNT',  mssql.Date,{ nullable: true });
        // table.columns.add('TRANGTHAIGOITHAU', mssql.NVarChar(4000),{ nullable: true });
        // table.columns.add('ISGET', mssql.Int,{ nullable: true });
        // table.columns.add('CREATED_AT', mssql.DateTime,{ nullable: true });
        // table.columns.add('URL', mssql.NVarChar(4000),{ nullable: true });
        data.map(ele=>{
           // table.rows.add(ele.MA_TBMT,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
           table.rows.add(ele.MA_TBMT)
        })
        console.log(table)
        const request = pool.request();
        const result = request.bulk(table);
        // Chèn bảng tạm thời vào cơ sở dữ liệu
        return result;
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
