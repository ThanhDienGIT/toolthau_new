const colors = require("colors");
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const mssql = require("mssql");
const { config } = require("./config");

module.exports = {

     checkListPackage: async (so_tbmt) => {
          try {
               let pool = await mssql.connect(config);
               let sql = "IF EXISTS (SELECT * FROM BangDuLieuThauGlobal WHERE magoithau = @so_tbmt) SELECT 'true' AS DataExists ELSE SELECT 'false' AS DataExists;";
               let result = await pool
                    .request()
                    .input("so_tbmt", so_tbmt)
                    .query(sql);
               return result.recordset[0].DataExists;
          } catch (err) {
               console.log(colors.red(err));
          }
     },

     insertListPackage: async (magoithau, ngaythem, trangthaigoithau, diachigoi) => {
          try {
               let pool = await mssql.connect(config);
               let sql = "INSERT INTO BangDuLieuThauGlobal (magoithau,ngaydang,trangthaigoithau,diachigoi) VALUES (@magoithau,@ngaythem,@trangthaigoithau,@diachigoi)";
               let result = await pool
                    .request()
                    .input("magoithau", magoithau)
                    .input("ngaythem", ngaythem)
                    .input("trangthaigoithau", trangthaigoithau)
                    .input("diachigoi", diachigoi)
                    .query(sql);
               return `Thêm thành công gối thầu có mã : ${magoithau} với trạng trạng thái gói thầu là ${trangthaigoithau}`;
          } catch (err) {
               console.log(colors.red(err));
          }
     },

     updateStatusAndisGetPackage: async (magoithau, trangthaigoithau) => {
          try {
               let pool = await mssql.connect(config);
               let sql = "UPDATE BangDuLieuThauGlobal SET isGet = 1,trangthaigoithau=@trangthaigoithau  WHERE magoithau = @magoithau;"

               let result = await pool
                    .request()
                    .input("magoithau", magoithau)
                    .input("trangthaigoithau", trangthaigoithau)
                    .query(sql);
               return `Cập nhật thành công gói thầu ${magoithau} với trạng trạng thái gói thầu là ${trangthaigoithau}`;
          } catch (err) {
               console.log(colors.red(err));
          }
     },

     updateStatusPackage: async (magoithau, trangthaigoithau) => {
          try {
               let pool = await mssql.connect(config);
               let sql = "UPDATE BangDuLieuThauGlobal SET isGet = 1 WHERE magoithau = @magoithau;"
               let result = await pool
                    .request()
                    .input("magoithau", magoithau)
                    .input("trangthaigoithau", trangthaigoithau)
                    .query(sql);
               return `Cập nhật thành công gói thầu ${magoithau} với trạng trạng thái gói thầu là ${trangthaigoithau}`;
          } catch (err) {
               console.log(colors.red(err));
          }
     },

     getAllDataListPackage: async () => {
          try {
               let pool = await mssql.connect(config);
               let sql = "SELECT * FROM BangDuLieuThauGlobal";
               let result = await pool.request().query(sql);
               return result.recordset;
          } catch (err) {
               console.log(colors.red(err));
          }
     },



}