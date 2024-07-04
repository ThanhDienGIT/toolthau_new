const excelJS = require("exceljs");
const { getAllDataExport, selectNhaTrungThau, selectThongTinGoiThau } = require("./database/dulieu_thau");
const { selectDanhSachGoiThau } = require("./DanhSachGoiThau/sql/DanhSachGoiThau");

const formatDate = (dateformatData) => {
    const dateFormat = new Date(dateformatData)
    const ngay = dateFormat.getDate() > 9 ? dateFormat.getDate() : '0' + dateFormat.getDate(); 
    const thang = (dateFormat.getMonth() + 1) > 9 ? (dateFormat.getMonth() + 1) : '0' + (dateFormat.getMonth() + 1); 
    const nam  = dateFormat.getFullYear();
    return ngay + '/' + thang + '/' + nam;
}

const exportDanhSachGoiThauGlobal = async (req,res)=>{
    const arrExport = await selectDanhSachGoiThau()

    console.log(arrExport)

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define columns in the worksheet 
    worksheet.columns = [
        { header: "Mã gói thầu", key: "MA_TBMT", width: 30 },
        { header: "Tên gói thầu", key: "TENGOITHAU", width: 40 },
        { header: "Bên mời thầu", key: "BENMOITHAU", width: 30 },
        { header: "Chủ đầu tư", key: "CHUDAUTU", width: 30 },
        { header: "Ngày đăng tải mời thầu", key: "NGAYDANGTAITHONGBAOTEXT", width: 100 },
        { header: "Địa điểm", key: "DIADIEM", width: 30 },
        { header: "Thời điểm đóng thầu", key: "THOIDIEMDONGTHAU", width: 30 },
        { header: "Hình thức dự thầu", key: "HINHTHUCDUTHAU", width: 30 },
        { header: "Nhà trúng thầu", key: "NHATRUNGTHAU", width: 30 },
        { header: "Giá trúng thầu", key: "GIATRUNGTHAU", width: 30 },
        { header: "Ngày phê duyệt KQLCNT", key: "NGAYPHEDUYETKQLCNT", width: 30 },
        { header: "Trạng thái gói thầu", key: "TRANGTHAIGOITHAU", width: 30 },
        { header: "URL Gói thầu", key: "URL", width: 30 },
    ];

    // Add data to the worksheet 
   arrExport.forEach(ele => {
        ele['THOIDIEMDONGTHAU'] = formatDate(ele['THOIDIEMDONGTHAU'].slice(0,ele['THOIDIEMDONGTHAU'].length - 8))
        worksheet.addRow(ele);
    });

    // Set up the response headers 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "danhsachgoithau_HG.xlsx");

    // Write the workbook to the response object 
    workbook.xlsx.write(res).then(() => res.end());
} 




const exportData = async (req, res) => {

    const arr = await selectThongTinGoiThau()
    const arr2 = await selectNhaTrungThau()
    const arrayExport = []
    for (let itemThongTinGoiThau of arr) {
        var nhatrungthau = ''
        var nhakhongtrungthau = ''
        var liendoanh = ''
        var giaduthau = 0
        var giatrungthau = 0
        for (let itemNhaTrungThau of arr2) {
            if (Number(itemNhaTrungThau.IDGOITHAU) === Number(itemThongTinGoiThau.IDGOITHAU)) {
                if (itemNhaTrungThau.MOTA === 'Trúng thầu') {
                    nhatrungthau = itemNhaTrungThau.TENNHATHAU
                    giaduthau = itemNhaTrungThau.GIADUTHAU
                    giatrungthau = itemNhaTrungThau.GIATRUNGTHAU
                }

                if (itemNhaTrungThau.MOTA === 'Không trúng thầu') {
                    nhakhongtrungthau += itemNhaTrungThau.TENNHATHAU + ", "
                }

                if (itemNhaTrungThau.MOTA === 'Liên doanh') {
                    liendoanh += itemNhaTrungThau.TENNHATHAU + ", "
                    giaduthau = itemNhaTrungThau.GIADUTHAU
                    giatrungthau = itemNhaTrungThau.GIATRUNGTHAU
                }
            }
        }
        const object = {
            MATBMT: itemThongTinGoiThau.MATBMT,
            NGAYDANGTAI_THONGBAOMOITHAU: itemThongTinGoiThau.NGAYDANGTAI_THONGBAOMOITHAU,
            PHIENBANTHAYDOI_THONGTAOMOITHAU: itemThongTinGoiThau.PHIENBANTHAYDOI_THONGTAOMOITHAU,
            MAKHLCNT: itemThongTinGoiThau.MAKHLCNT,
            PHANLOAIKHLCNT: itemThongTinGoiThau.PHANLOAIKHLCNT,
            TENDUTOANMUASAM: itemThongTinGoiThau.TENDUTOANMUASAM,
            QUYTRINHAPDUNG: itemThongTinGoiThau.QUYTRINHAPDUNG,
            TENGOITHAU: itemThongTinGoiThau.TENGOITHAU,
            BENMOITHAU: itemThongTinGoiThau.BENMOITHAU,
            CHITIETNGUONGVON: itemThongTinGoiThau.CHITIETNGUONGVON,
            LINHVUC: itemThongTinGoiThau.LINHVUC,
            HINHTHUCLUACHONNHATHAU: itemThongTinGoiThau.HINHTHUCLUACHONNHATHAU,
            LOAIHOPDONG: itemThongTinGoiThau.LOAIHOPDONG,
            TRONGNUOC_QUOCTE: itemThongTinGoiThau.TRONGNUOC_QUOCTE,
            PHUONGTHUCCHONNHATHAU: itemThongTinGoiThau.PHUONGTHUCCHONNHATHAU,
            THOIGIANTHUCHIENHOPDONG: itemThongTinGoiThau.THOIGIANTHUCHIENHOPDONG,
            HINHTHUCDUTHAU: itemThongTinGoiThau.HINHTHUCDUTHAU,
            DIAIEMPHATHANH_EHSMT: itemThongTinGoiThau.DIAIEMPHATHANH_EHSMT,
            CHIPHINOP_EHSDT: itemThongTinGoiThau.CHIPHINOP_EHSDT,
            DIADIEMNHAN_EHSDT: itemThongTinGoiThau.DIADIEMNHAN_EHSDT,
            DIADIEMTHUCHIENGOITHAU: itemThongTinGoiThau.DIADIEMTHUCHIENGOITHAU,
            THOIDIEMDONGTHAU: itemThongTinGoiThau.THOIDIEMDONGTHAU,
            THOIDIEMMOTHAU: itemThongTinGoiThau.THOIDIEMMOTHAU,
            DIADIEMMOTHAU: itemThongTinGoiThau.DIADIEMMOTHAU,
            HIEULUCHOSODUTHAU: itemThongTinGoiThau.HIEULUCHOSODUTHAU,
            SOTIENDAMBAODUTHAU: itemThongTinGoiThau.SOTIENDAMBAODUTHAU,
            HINHTHUCDAMBAODUTHAU: itemThongTinGoiThau.HINHTHUCDAMBAODUTHAU,
            SOQUYETDINHPHEDUYET: itemThongTinGoiThau.SOQUYETDINHPHEDUYET,
            NGAYPHEDUYET: itemThongTinGoiThau.NGAYPHEDUYET,
            COQUANBANHANHQUYETDINH: itemThongTinGoiThau.COQUANBANHANHQUYETDINH,
            QUYETDINHPHEDUYET: itemThongTinGoiThau.QUYETDINHPHEDUYET,
            TRANGTHAIKQLCNT_KETQUAMOITHAU: itemThongTinGoiThau.TRANGTHAIKQLCNT_KETQUAMOITHAU,
            NGAYDANGTAI_KETQUAMOITHAU: itemThongTinGoiThau.NGAYDANGTAI_KETQUAMOITHAU,
            PHIENBANTHAYDOI_KETQUAMOITHAU: itemThongTinGoiThau.PHIENBANTHAYDOI_KETQUAMOITHAU,
            DUTOANGOITHAU_KETQUAMOITHAU: itemThongTinGoiThau.DUTOANGOITHAU_KETQUAMOITHAU,
            GIAGOITHAU_KETQUAMOITHAU: itemThongTinGoiThau.GIAGOITHAU_KETQUAMOITHAU,
            LOAIHOPDONG_KETQUAMOITHAU: itemThongTinGoiThau.LOAIHOPDONG_KETQUAMOITHAU,
            HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU: itemThongTinGoiThau.HINHTHUCLUACHONNHATHAU_KETQUAMOITHAU,
            PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU: itemThongTinGoiThau.PHUONGTHUCLUACHONNHATHAU_KETQUAMOITHAU,
            NGAYPHEDUYET_KETQUAMOITHAU: itemThongTinGoiThau.NGAYPHEDUYET_KETQUAMOITHAU,
            COQUANPHEDUYET_KETQUAMOITHAU: itemThongTinGoiThau.COQUANPHEDUYET_KETQUAMOITHAU,
            SOQUYETDINHPHEDUYET_KETQUAMOITHAU: itemThongTinGoiThau.SOQUYETDINHPHEDUYET_KETQUAMOITHAU,
            KETQUADAUTHAU: itemThongTinGoiThau.KETQUADAUTHAU,
            TRANGTHAIGOITHAU: itemThongTinGoiThau.TRANGTHAIGOITHAU,
            NHATRUNGTHAU: nhatrungthau,
            NHAKHONGTRUNGTHAU: nhakhongtrungthau,
            LIENDOANH: liendoanh,
            GIADUTHAU: giaduthau,
            GIATRUNGTHAU: giatrungthau,
        }
        arrayExport.push(object)
    }
    res.statusCode = 200;
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define columns in the worksheet 
    worksheet.columns = [
        { header: "Mã gói thầu", key: "MATBMT", width: 30 },
        { header: "Ngày đăng tải", key: "NGAYDANGTAI_THONGBAOMOITHAU", width: 30 },
        { header: "Mã KHLCNT", key: "MAKHLCNT", width: 30 },
        { header: "Phân Loại KHLCNT", key: "PHANLOAIKHLCNT", width: 30 },
        { header: "Tên dự toán mua sắm", key: "TENDUTOANMUASAM", width: 100 },
        { header: "Quy trình áp dụng", key: "QUYTRINHAPDUNG", width: 30 },
        { header: "Tên gói thầu", key: "TENGOITHAU", width: 30 },
        { header: "Bên mời thầu", key: "BENMOITHAU", width: 30 },
        { header: "Chi tiết nguồn vốn", key: "CHITIETNGUONGVON", width: 30 },
        { header: "Lĩnh vực", key: "LINHVUC", width: 30 },
        { header: "Hình thức lựa chọn nhà thầu", key: "HINHTHUCLUACHONNHATHAU", width: 30 },
        { header: "Loại hợp đồng", key: "LOAIHOPDONG", width: 30 },
        { header: "Trong nước/Quốc tế", key: "TRONGNUOC_QUOCTE", width: 30 },
        { header: "Phương thức chọn nhà thầu", key: "PHUONGTHUCCHONNHATHAU", width: 30 },
        { header: "Thời gian thực hiện hợp đồng", key: "THOIGIANTHUCHIENHOPDONG", width: 30 },
        { header: "Hình thức dự thầu", key: "HINHTHUCDUTHAU", width: 30 },
        { header: "Địa điểm phát hành E-HSMT", key: "DIAIEMPHATHANH_EHSMT", width: 30 },
        { header: "Chi phí nộp E-HSMT", key: "CHIPHINOP_EHSDT", width: 30 },
        { header: "Điểm điểm nhận E-HSMT", key: "DIADIEMNHAN_EHSDT", width: 30 },
        { header: "Địa điểm thực hiện gói thầu", key: "DIADIEMTHUCHIENGOITHAU", width: 30 },
        { header: "Thời điểm đóng thầu", key: "THOIDIEMDONGTHAU:", width: 30 },
        { header: "Thời điểm mở thầu", key: "THOIDIEMMOTHAU", width: 30 },
        { header: "Địa điểm mở thầu", key: "DIADIEMMOTHAU", width: 30 },
        { header: "Hiệu lực cho hồ sơ thầu", key: "HIEULUCHOSODUTHAU", width: 30 },
        { header: "Số tiền đảm bảo dự thầu", key: "SOTIENDAMBAODUTHAU", width: 30 },
        { header: "Hình thức đảm bảo dự thầu", key: "HINHTHUCDAMBAODUTHAU", width: 30 },
        { header: "Số quyết định phế duyệt", key: "SOQUYETDINHPHEDUYET", width: 30 },
        { header: "Ngày phê duyệt", key: "NGAYPHEDUYET", width: 30 },
        { header: "Cơ quan ban hành quyết định", key: "COQUANBANHANHQUYETDINH", width: 30 },
        { header: "Quyết định phê duyệt", key: "QUYETDINHPHEDUYET", width: 30 },
        { header: "Trạng Thái KQLCNT", key: "TRANGTHAIKQLCNT_KETQUAMOITHAU", width: 30 },
        { header: "Ngày đăng tải kết quả", key: "NGAYDANGTAI_KETQUAMOITHAU:", width: 30 },
        { header: "Dự toán gói thầu", key: "DUTOANGOITHAU_KETQUAMOITHAU", width: 30 },
        { header: "Giá gói thầu", key: "GIAGOITHAU_KETQUAMOITHAU", width: 30 },
        { header: "Loại hợp đồng", key: "LOAIHOPDONG_KETQUAMOITHAU", width: 30 },
        { header: "Ngày phế duyệt kết quả mời thầu", key: "NGAYPHEDUYET_KETQUAMOITHAU:", width: 30 },
        { header: "Cơ quan phê duyệt kết quả mời thầu", key: "COQUANPHEDUYET_KETQUAMOITHAU", width: 30 },
        { header: "Số quyết định phê duyệt", key: "SOQUYETDINHPHEDUYET_KETQUAMOITHAU", width: 30 },
        { header: "Kết quả đấu thầu", key: "KETQUADAUTHAU", width: 30 },
        { header: "Nhà trúng thầu", key: "NHATRUNGTHAU", width: 30 },
        { header: "Nhà không trúng thầu", key: "NHAKHONGTRUNGTHAU", width: 30 },
        { header: "Liên doanh", key: "LIENDOANH", width: 30 },
        { header: "Giá dự thầu", key: "GIADUTHAU", width: 30 },
        { header: "Giá trúng thầu", key: "GIATRUNGTHAU", width: 30 },
    ];

    // Add data to the worksheet 
    arrayExport.forEach(goithau => { worksheet.addRow(goithau); });

    // Set up the response headers 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "danhsachgoithau_HG.xlsx");

    // Write the workbook to the response object 
    workbook.xlsx.write(res).then(() => res.end());
}

const exportUser = async (req, res) => {
    res.statusCode = 200;
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define columns in the worksheet 
    worksheet.columns = [
        { header: "Mã gói thầu", key: "magoithau", width: 20 },
        { header: "Giá tiền", key: "sotien", width: 30 },
    ];
    const arr = await getAllDataExport()
    // Add data to the worksheet 
    arr.forEach(goithau => { worksheet.addRow(goithau); });

    // Set up the response headers 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "users.xlsx");

    // Write the workbook to the response object 
    workbook.xlsx.write(res).then(() => res.end());
};


module.exports = { exportUser, exportData,exportDanhSachGoiThauGlobal };