const colors = require("colors");
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const mssql = require("mssql");
const { config } = require("./config");

module.exports = {
    checkThauExists: async (so_tbmt) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM BangDuLieuThau WHERE so_tbmt = @so_tbmt";
            let result = await pool
                .request()
                .input("so_tbmt", so_tbmt)
                .query(sql);
            return !!result.recordset.length;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    checkThauExistsGlobal: async (so_tbmt) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM BangDuLieuThauGlobal WHERE magoithau = @so_tbmt";
            let result = await pool
                .request()
                .input("so_tbmt", so_tbmt)
                .query(sql);
            return !!result.recordset.length;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    insertThauGlobal: async (magoithau, ngaythem, trangthaigoithau, diachigoi) => {
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
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    getAllData: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM BangDuLieuThauGlobal";
            let result = await pool.request().query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    getAllData2: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM BangDuLieuThauGlobal where id >= 100000";
            let result = await pool.request().query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    getAllData3: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM BangDuLieuThauGlobal where id >= 150000";
            let result = await pool.request().query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    getAllData4: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM BangDuLieuThauGlobal where id >= 200000";
            let result = await pool.request().query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    insertThau: async (so_tbmt, ngaythem) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "INSERT INTO BangDuLieuThau (magoithau,ngaydang) VALUES (@so_tbmt,@ngaythem)";
            let result = await pool
                .request()
                .input("so_tbmt", so_tbmt)
                .input("ngaythem", ngaythem)
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    // 
    checkThauExistsNew: async (magoithau) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM listdanhsachthaucanget WHERE magoithau = @magoithau";
            let result = await pool
                .request()
                .input("magoithau", magoithau)
                .query(sql);
            return !!result.recordset.length;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    insertThauNew: async (magoithau, sotien) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "insert into listdanhsachthaucanget(magoithau,sotien,trangthai) values (@magoithau,@sotien,1)";
            let result = await pool
                .request()
                .input("magoithau", magoithau)
                .input("sotien", sotien)
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    getAllDataExport: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT magoithau, sotien  FROM listdanhsachthaucanget";
            let result = await pool
                .request()
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    insertInfomationGoiThau: async (
        MATBMT, NGAYDANGTAI_THONGBAOMOITHAU, PHIENBANTHAYDOI_THONGTAOMOITHAU, MAKHLCNT, PHANLOAIKHLCNT, TENDUTOANMUASAM, QUYTRINHAPDUNG, TENGOITHAU, BENMOITHAU, CHITIETNGUONVON, LINHVUC, HINHTHUCLUACHONNHATHAU, LOAIHOPDONG,
        TRONGNUOC_QUOCTE, PHUONGTHUCCHONNHATHAU, THOIGIANTHUCHIENHOPDONG, HINHTHUCDUTHAU, DIAIEMPHATHANH_EHSMT, CHIPHINOP_EHSDT, DIADIEMNHAN_EHSDT, DIADIEMTHUCHIENGOITHAU, THOIDIEMDONGTHAU, THOIDIEMMOTHAU, DIADIEMMOTHAU,
        HIEULUCHOSODUTHAU, SOTIENDAMBAODUTHAU, HINHTHUCDAMBAODUTHAU, SOQUYETDINHPHEDUYET, NGAYPHEDUYET, COQUANBANHANHQUYETDINH, QUYETDINHPHEDUYET, TRANGTHAIKQLCNT_KETQUAMOITHAU, NGAYDANGTAI_KETQUAMOITHAU, PHIENBANTHAYDOI_KETQUAMOITHAU,
        DUTOANGOITHAU_KETQUAMOITHAU, GIAGOITHAU_KETQUAMOITHAU, LOAIHOPDONG_KETQUAMOITHAU, HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU, PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU, NGAYPHEDUYET_KETQUAMOITHAU, COQUANPHEDUYET_KETQUAMOITHAU,
        SOQUYETDINHPHEDUYET_KETQUAMOITHAU, KETQUADAUTHAU, TRANGTHAIGOITHAU
    ) => {
        try {
            let pool = await mssql.connect(config);
            let sql = 'insert into THONGTINGOITHAU' +
                '(MATBMT,NGAYDANGTAI_THONGBAOMOITHAU,PHIENBANTHAYDOI_THONGTAOMOITHAU,MAKHLCNT,PHANLOAIKHLCNT,TENDUTOANMUASAM,QUYTRINHAPDUNG,TENGOITHAU,BENMOITHAU,CHITIETNGUONGVON,LINHVUC,HINHTHUCLUACHONNHATHAU,LOAIHOPDONG,' +
                'TRONGNUOC_QUOCTE,PHUONGTHUCCHONNHATHAU,THOIGIANTHUCHIENHOPDONG,HINHTHUCDUTHAU,DIAIEMPHATHANH_EHSMT,CHIPHINOP_EHSDT,DIADIEMNHAN_EHSDT,DIADIEMTHUCHIENGOITHAU,THOIDIEMDONGTHAU,THOIDIEMMOTHAU,DIADIEMMOTHAU,' +
                'HIEULUCHOSODUTHAU,SOTIENDAMBAODUTHAU,HINHTHUCDAMBAODUTHAU,SOQUYETDINHPHEDUYET,NGAYPHEDUYET,COQUANBANHANHQUYETDINH,QUYETDINHPHEDUYET,TRANGTHAIKQLCNT_KETQUAMOITHAU,NGAYDANGTAI_KETQUAMOITHAU,PHIENBANTHAYDOI_KETQUAMOITHAU,' +
                'DUTOANGOITHAU_KETQUAMOITHAU,GIAGOITHAU_KETQUAMOITHAU,LOAIHOPDONG_KETQUAMOITHAU,HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU,PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU,NGAYPHEDUYET_KETQUAMOITHAU,COQUANPHEDUYET_KETQUAMOITHAU,' +
                'SOQUYETDINHPHEDUYET_KETQUAMOITHAU,KETQUADAUTHAU,TRANGTHAIGOITHAU)' + 'OUTPUT INSERTED.IDGOITHAU ' +
                'values' +
                '(@MATBMT,@NGAYDANGTAI_THONGBAOMOITHAU,@PHIENBANTHAYDOI_THONGTAOMOITHAU,@MAKHLCNT,@PHANLOAIKHLCNT,@TENDUTOANMUASAM,@QUYTRINHAPDUNG,@TENGOITHAU,@BENMOITHAU,@CHITIETNGUONGVON,@LINHVUC,@HINHTHUCLUACHONNHATHAU,@LOAIHOPDONG,' +
                '@TRONGNUOC_QUOCTE,@PHUONGTHUCCHONNHATHAU,@THOIGIANTHUCHIENHOPDONG,@HINHTHUCDUTHAU,@DIAIEMPHATHANH_EHSMT,@CHIPHINOP_EHSDT,@DIADIEMNHAN_EHSDT,@DIADIEMTHUCHIENGOITHAU,@THOIDIEMDONGTHAU,@THOIDIEMMOTHAU,@DIADIEMMOTHAU,' +
                '@HIEULUCHOSODUTHAU,@SOTIENDAMBAODUTHAU,@HINHTHUCDAMBAODUTHAU,@SOQUYETDINHPHEDUYET,@NGAYPHEDUYET,@COQUANBANHANHQUYETDINH,@QUYETDINHPHEDUYET,@TRANGTHAIKQLCNT_KETQUAMOITHAU,@NGAYDANGTAI_KETQUAMOITHAU,@PHIENBANTHAYDOI_KETQUAMOITHAU,' +
                '@DUTOANGOITHAU_KETQUAMOITHAU,@GIAGOITHAU_KETQUAMOITHAU,@LOAIHOPDONG_KETQUAMOITHAU,@HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU,@PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU,@NGAYPHEDUYET_KETQUAMOITHAU,@COQUANPHEDUYET_KETQUAMOITHAU,' +
                '@SOQUYETDINHPHEDUYET_KETQUAMOITHAU,@KETQUADAUTHAU,@TRANGTHAIGOITHAU)'
            let result = await pool
                .request()
                .input('MATBMT', MATBMT)
                .input('NGAYDANGTAI_THONGBAOMOITHAU', NGAYDANGTAI_THONGBAOMOITHAU)
                .input('PHIENBANTHAYDOI_THONGTAOMOITHAU', PHIENBANTHAYDOI_THONGTAOMOITHAU)
                .input('MAKHLCNT', MAKHLCNT)
                .input('PHANLOAIKHLCNT', PHANLOAIKHLCNT)
                .input('TENDUTOANMUASAM', TENDUTOANMUASAM)
                .input('QUYTRINHAPDUNG', QUYTRINHAPDUNG)
                .input('TENGOITHAU', TENGOITHAU)
                .input('BENMOITHAU', BENMOITHAU)
                .input('CHITIETNGUONGVON', CHITIETNGUONVON)
                .input('LINHVUC', LINHVUC)
                .input('HINHTHUCLUACHONNHATHAU', HINHTHUCLUACHONNHATHAU)
                .input('LOAIHOPDONG', LOAIHOPDONG)
                .input('TRONGNUOC_QUOCTE', TRONGNUOC_QUOCTE)
                .input('PHUONGTHUCCHONNHATHAU', PHUONGTHUCCHONNHATHAU)
                .input('THOIGIANTHUCHIENHOPDONG', THOIGIANTHUCHIENHOPDONG)
                .input('HINHTHUCDUTHAU', HINHTHUCDUTHAU)
                .input('DIAIEMPHATHANH_EHSMT', DIAIEMPHATHANH_EHSMT)
                .input('CHIPHINOP_EHSDT', CHIPHINOP_EHSDT)
                .input('DIADIEMNHAN_EHSDT', DIADIEMNHAN_EHSDT)
                .input('DIADIEMTHUCHIENGOITHAU', DIADIEMTHUCHIENGOITHAU)
                .input('THOIDIEMDONGTHAU', THOIDIEMDONGTHAU)
                .input('THOIDIEMMOTHAU', THOIDIEMMOTHAU)
                .input('DIADIEMMOTHAU', DIADIEMMOTHAU)
                .input('HIEULUCHOSODUTHAU', HIEULUCHOSODUTHAU)
                .input('SOTIENDAMBAODUTHAU', SOTIENDAMBAODUTHAU)
                .input('HINHTHUCDAMBAODUTHAU', HINHTHUCDAMBAODUTHAU)
                .input('SOQUYETDINHPHEDUYET', SOQUYETDINHPHEDUYET)
                .input('NGAYPHEDUYET', NGAYPHEDUYET)
                .input('COQUANBANHANHQUYETDINH', COQUANBANHANHQUYETDINH)
                .input('QUYETDINHPHEDUYET', QUYETDINHPHEDUYET)
                .input('TRANGTHAIKQLCNT_KETQUAMOITHAU', TRANGTHAIKQLCNT_KETQUAMOITHAU)
                .input('NGAYDANGTAI_KETQUAMOITHAU', NGAYDANGTAI_KETQUAMOITHAU)
                .input('PHIENBANTHAYDOI_KETQUAMOITHAU', PHIENBANTHAYDOI_KETQUAMOITHAU)
                .input('DUTOANGOITHAU_KETQUAMOITHAU', DUTOANGOITHAU_KETQUAMOITHAU)
                .input('GIAGOITHAU_KETQUAMOITHAU', GIAGOITHAU_KETQUAMOITHAU)
                .input('LOAIHOPDONG_KETQUAMOITHAU', LOAIHOPDONG_KETQUAMOITHAU)
                .input('HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU', HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU)
                .input('PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU', PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU)
                .input('NGAYPHEDUYET_KETQUAMOITHAU', NGAYPHEDUYET_KETQUAMOITHAU)
                .input('COQUANPHEDUYET_KETQUAMOITHAU', COQUANPHEDUYET_KETQUAMOITHAU)
                .input('SOQUYETDINHPHEDUYET_KETQUAMOITHAU', SOQUYETDINHPHEDUYET_KETQUAMOITHAU)
                .input('KETQUADAUTHAU', KETQUADAUTHAU)
                .input('TRANGTHAIGOITHAU', TRANGTHAIGOITHAU)
                .query(sql);
            return result;
        } catch (err) {
            console.log(colors.red(err));
        }
    },


    update_infomationThongTinGoiThau: async (TENDUTOANMUASAM, TRANGTHAIKQLCNT_KETQUAMOITHAU, DUTOANGOITHAU_KETQUAMOITHAU,
        GIAGOITHAU_KETQUAMOITHAU, COQUANPHEDUYET_KETQUAMOITHAU, KETQUADAUTHAU, TRANGTHAIGOITHAU, MATBMT) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "UPDATE THONGTINGOITHAU" +
                " SET " +
                "TENDUTOANMUASAM = @TENDUTOANMUASAM, " +
                "TRANGTHAIKQLCNT_KETQUAMOITHAU = @TRANGTHAIKQLCNT_KETQUAMOITHAU, " +
                "DUTOANGOITHAU_KETQUAMOITHAU = @DUTOANGOITHAU_KETQUAMOITHAU, " +
                "GIAGOITHAU_KETQUAMOITHAU = @GIAGOITHAU_KETQUAMOITHAU, " +
                "COQUANPHEDUYET_KETQUAMOITHAU = @COQUANPHEDUYET_KETQUAMOITHAU, " +
                "KETQUADAUTHAU = @KETQUADAUTHAU, " +
                "TRANGTHAIGOITHAU = @TRANGTHAIGOITHAU, " +
                " WHERE MATBMT = @MATBMT";
            let result = await pool
                .request()
                .input('TENDUTOANMUASAM', TENDUTOANMUASAM)
                .input('TRANGTHAIKQLCNT_KETQUAMOITHAU', TRANGTHAIKQLCNT_KETQUAMOITHAU)
                .input('DUTOANGOITHAU_KETQUAMOITHAU', DUTOANGOITHAU_KETQUAMOITHAU)
                .input('GIAGOITHAU_KETQUAMOITHAU', GIAGOITHAU_KETQUAMOITHAU)
                .input('COQUANPHEDUYET_KETQUAMOITHAU', COQUANPHEDUYET_KETQUAMOITHAU)
                .input('KETQUADAUTHAU', KETQUADAUTHAU)
                .input('TRANGTHAIGOITHAU', TRANGTHAIGOITHAU)
                .input('MATBMT', MATBMT)
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },


    update_insertDuLieuThau: async (magoithau) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "update BangDuLieuThauGlobal set isGet = 1 WHERE magoithau =@magoithau";
            let result = await pool
                .request()
                .input('magoithau', magoithau)
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    insertNhaThauLienQuanDenGoiThau: async (IDGOITHAU, TENNHATHAU, MADINHDANH, GIADUTHAU, GIATRUNGTHAU, MOTA) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "insert into NHATRUNGTHAU(IDGOITHAU, TENNHATHAU, MADINHDANH, GIADUTHAU, GIATRUNGTHAU, MOTA) values(@IDGOITHAU, @TENNHATHAU, @MADINHDANH, @GIADUTHAU, @GIATRUNGTHAU, @MOTA)";
            let result = await pool
                .request()
                .input('IDGOITHAU', IDGOITHAU)
                .input('TENNHATHAU', TENNHATHAU)
                .input('MADINHDANH', MADINHDANH)
                .input('GIADUTHAU', GIADUTHAU)
                .input('GIATRUNGTHAU', GIATRUNGTHAU)
                .input('MOTA', MOTA)
                .query(sql);
            return "insert thành công";
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    selectThongTinGoiThau: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "select * from THONGTINGOITHAU";
            let result = await pool
                .request()
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

    selectNhaTrungThau: async () => {
        try {
            let pool = await mssql.connect(config);
            let sql = "select * from NHATRUNGTHAU";
            let result = await pool
                .request()
                .query(sql);
            return result.recordset;
        } catch (err) {
            console.log(colors.red(err));
        }
    },


    checkThauExistsThongTinGoiThau: async (so_tbmt) => {
        try {
            let pool = await mssql.connect(config);
            let sql = "SELECT * FROM THONGTINGOITHAU WHERE MATBMT = @so_tbmt";
            let result = await pool
                .request()
                .input("so_tbmt", so_tbmt)
                .query(sql);
            return !!result.recordset.length;
        } catch (err) {
            console.log(colors.red(err));
        }
    },

};

