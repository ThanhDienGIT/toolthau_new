const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { Telegraf } = require("telegraf");
const { getAllData, insertInfomationGoiThau, insertNhaThauLienQuanDenGoiThau, update_insertDuLieuThau, checkThauExistsThongTinGoiThau, update_infomationThongTinGoiThau } = require("./database/dulieu_thau")
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}

async function crawData() {
    // launch the browser
    const arrThau = await getAllData()

    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://muasamcong.mpi.gov.vn/");
    await driver.manage().window().maximize();
    let closeButton = await driver.findElement(By.id('popup-close'));
    await new Promise(resolve => setTimeout(resolve, 5000));
    await closeButton.click();
    try {
        for (let item of arrThau) {
            const magoithauItem = await item.magoithau.slice(0, 12)
            // Gói thầu tồn tại
            if (await checkThauExistsThongTinGoiThau(magoithauItem)) {
                if (item.trangthaigoithau === 'Có nhà thầu trúng thầu') {
                    if (Number(item.isGet) === 0) {
                        let inputSearch = await driver.findElement(By.name('keyword'))
                        await inputSearch.clear()
                        await inputSearch.sendKeys(magoithauItem);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        let searchButton = await driver.findElement(By.className('search-button'))
                        await searchButton.click();
                        element = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__contract__name format__text__title')), 10000);
                        element.click()
                        await new Promise(resolve => setTimeout(resolve, 8000));
                        const arrInfomation2 = []
                        let typeResultButton = await driver.findElements(By.className('nav-item'));
                        if (typeResultButton.length > 0) {
                            for (let item of typeResultButton) {
                                const a = await item.findElement(By.css('a'))
                                if (await a.getText() === 'Kết quả lựa chọn nhà thầu') {
                                    a.click();
                                }
                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        let infomationPackage2 = await driver.findElements(By.className('d-flex flex-row align-items-start infomation__content'))
                        for (let item of infomationPackage2) {
                            arrInfomation2.push(await item.getText())
                        }
                        let TableDataRow = await driver.findElements(By.className('card border--none card-expand'))
                        const nhatrungthau = []
                        const nhakhongtrungthau = []
                        const nhatrungthauliendoanh = []
                        for (let item of TableDataRow) {
                            console.log(await item.getText())
                            if ((await item.getText()).includes('Liên danh')) {
                                nhatrungthauliendoanh.push(await item.getText())
                            } else {
                                if ((await item.getText()).includes('Thông tin Nhà thầu trúng thầu')) {
                                    nhatrungthau.push(await item.getText())
                                }
                            }
                            if ((await item.getText()).includes('Thông tin Nhà thầu không được lựa chọn')) {
                                nhakhongtrungthau.push(await item.getText())
                            }
                        }
                        var ThongTinChiTietGoiThau = {}

                        for (let ele of arrInfomation2) {
                            arrString = ele.split('\n')
                            if (arrString[0].includes("Trạng thái KQLCNT")) {
                                ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày đăng tải")) {
                                ThongTinChiTietGoiThau.NGAYDANGTAI_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phiên bản thay đổi")) {
                                ThongTinChiTietGoiThau.PHIENBANTHAYDOI_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Dự toán gói thầu được duyệt sau khi phê duyệt KHLCNT")) {
                                ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Giá gói thầu")) {
                                ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Loại hợp đồng")) {
                                ThongTinChiTietGoiThau.LOAIHOPDONG_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày phê duyệt")) {
                                ThongTinChiTietGoiThau.NGAYPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Cơ quan phê duyệt")) {
                                ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET__KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.QUYETDINHPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Báo cáo đánh giá e-HSDT")) {
                                ThongTinChiTietGoiThau.BAOCAODANHGIA_EHSDT_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Kết quả đấu thầu")) {
                                ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                        }
                        const arrNhaTrung1Thau = []
                        const arrNhaThauKhongTrungThau = []
                        const ArrayNhaThauLienDoanh = []
                        // Xử lý nhà trúng thầu chỉ 1 nhà trúng
                        if (nhatrungthau.length > 0) {
                            const arrInfomationNhaTrungThau = nhatrungthau[0].split('\n')
                            const nhatrungthaustring = arrInfomationNhaTrungThau[arrInfomationNhaTrungThau.length - 1]
                            const nhatrungthaustringxuly = nhatrungthaustring.slice(15, nhatrungthaustring.indexOf('Xem chi tiết tại mẫu tiến độ'))
                            const manhathau = nhatrungthaustring.slice(2, 14);

                            // Sử dụng biểu thức chính quy để tìm kiếm tên công ty và giá trị
                            var match = nhatrungthaustringxuly.match(/^(.*?)\s+(\d{1,3}(?:\.\d{3})*)(?:\s+(\d{1,3}(?:\.\d{3})*))?/);
                            var tennhathautrungthau
                            var giaduthau
                            var giatrungthau

                            // Kiểm tra xem có kết quả khớp không
                            if (match) {
                                var companyName = match[1];
                                var value1 = match[2];
                                var value2 = match[3] || "Không có giá trị thứ hai";
                                tennhathautrungthau = companyName
                                giaduthau = value1
                                giatrungthau = value2

                                const object = {
                                    MANHATHAU: manhathau,
                                    TENNHATHAU: companyName,
                                    GIADUTHAU: giaduthau,
                                    GIATRUNGTHAU: giatrungthau,
                                }
                                arrNhaTrung1Thau.push(object)
                            } else {
                                console.log("Không tìm thấy thông tin phù hợp.");
                            }
                        }
                        if (nhakhongtrungthau.length > 0) {
                            // Xử lý nhà thầu không trúng thầu

                            if (nhakhongtrungthau[0].split('\n').length !== 0) {
                                if (nhakhongtrungthau[0].split('\n').length > 2) {
                                    let VariableFor = nhakhongtrungthau[0].split('\n').length

                                    for (let i = 2; i < VariableFor; i++) {

                                        const data = nhakhongtrungthau[0].split('\n')[i]
                                        let index
                                        if (data.includes("Giá xếp hạng")) {
                                            index = data.indexOf("Giá xếp hạng " + i)
                                        }
                                        if (data.includes("Không đánh giá")) {
                                            index = data.indexOf("Không đánh giá")
                                        }

                                        const stringxuly = data.slice(15, index)
                                        const object = {
                                            TENNHATHAU: stringxuly,
                                            MANHATHAU: data.slice(2, 14),
                                        }
                                        arrNhaThauKhongTrungThau.push(object)
                                    }
                                }
                            }
                        }
                        if (nhatrungthauliendoanh.length > 0) {
                            // xử lý nhà thầu liên doanh
                            const ArrString = nhatrungthauliendoanh[0].split('\n')
                            var giaduthau = 0
                            var giatrungthau = 0
                            var ngayhopdong = 0
                            const Datastring = ArrString[2]
                            const indexNameNhaThau = Datastring.indexOf('Liên danh')
                            const cutthoigianthuchienhopdong = Datastring.slice(0, Datastring.lastIndexOf(" "))
                            const thoigianthuchienhopdong = cutthoigianthuchienhopdong.slice(cutthoigianthuchienhopdong.lastIndexOf(" ")).trim()
                            ngayhopdong = thoigianthuchienhopdong
                            const cutgiaduthau = cutthoigianthuchienhopdong.slice(0, cutthoigianthuchienhopdong.lastIndexOf(" "))
                            const cutgiaduthau2 = cutgiaduthau.slice(cutgiaduthau.lastIndexOf(" ")).trim()
                            giaduthau = cutgiaduthau2
                            const cutgiatrungthau = cutgiaduthau.slice(0, cutgiaduthau.lastIndexOf(" "))
                            const cutgiatrungthau2 = cutgiatrungthau.slice(cutgiatrungthau.lastIndexOf(" ")).trim()
                            giatrungthau = cutgiatrungthau2
                            for (i = 2; i < ArrString.length; i++) {
                                const data = ArrString[i]
                                if (Number(i) === 2) {
                                    const object = {
                                        MANHATHAU: data.slice(2, 14),
                                        TENNHATHAU: data.slice(14, indexNameNhaThau - 1),
                                        THOIGIANTHUCHIENHOPDONG: ngayhopdong,
                                        GIADUTHAU: giaduthau,
                                        GIATRUNGTHAU: giatrungthau,
                                    }

                                    ArrayNhaThauLienDoanh.push(object)
                                } else {
                                    const object = {
                                        MANHATHAU: data.slice(0, 12),
                                        TENNHATHAU: data.slice(13),
                                        THOIGIANTHUCHIENHOPDONG: ngayhopdong,
                                        GIADUTHAU: giaduthau,
                                        GIATRUNGTHAU: giatrungthau,
                                    }
                                    ArrayNhaThauLienDoanh.push(object)
                                }

                            }
                        }

                        const result = await update_infomationThongTinGoiThau(
                            ThongTinChiTietGoiThau.TENDUTOANMUASAM, ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU, ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU,
                            ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU, ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU, ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU,
                            ThongTinChiTietGoiThau.TRANGTHAIGOITHAU,
                            ThongTinChiTietGoiThau.MATBMT)
                        if (arrNhaTrung1Thau.length > 0) {
                            for (let item of arrNhaTrung1Thau) {
                                const alert = await insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Trúng thầu')
                                console.log(alert + " Trúng thầu")
                            }
                        }
                        if (arrNhaThauKhongTrungThau.length > 0) {
                            for (let item of arrNhaThauKhongTrungThau) {
                                const alert = insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, null, null, 'Không trúng thầu')
                                console.log(alert + " Không Trúng thầu")
                            }
                        }
                        if (ArrayNhaThauLienDoanh.length > 0) {
                            for (let item of ArrayNhaThauLienDoanh) {
                                const alert = insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Liên doanh')
                                console.log(alert + " Liên doanh")
                            }
                        }
                        await update_insertDuLieuThau(item.magoithau)
                        await driver.get("https://muasamcong.mpi.gov.vn/");
                        await new Promise(resolve => setTimeout(resolve, 3000));

                    }
                }
            } else {
                if (item.trangthaigoithau === 'Có nhà thầu trúng thầu') {
                    if (Number(item.isGet) === 0) {
                        let inputSearch = await driver.findElement(By.name('keyword'))
                        await inputSearch.clear()
                        await inputSearch.sendKeys(magoithauItem);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        let searchButton = await driver.findElement(By.className('search-button'))
                        await searchButton.click();
                        element = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__contract__name format__text__title')), 10000);
                        element.click()
                        await new Promise(resolve => setTimeout(resolve, 8000));
                        const arrInfomation = []
                        const arrInfomation2 = []
                        var infomationPackage = await driver.findElements(By.className('d-flex flex-row align-items-start infomation__content'));
                        for (let item of infomationPackage) {
                            arrInfomation.push(await item.getText())
                        }
                        let typeResultButton = await driver.findElements(By.className('nav-item'));
                        if (typeResultButton.length > 0) {
                            for (let item of typeResultButton) {
                                const a = await item.findElement(By.css('a'))
                                if (await a.getText() === 'Kết quả lựa chọn nhà thầu') {
                                    a.click();
                                }
                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        let infomationPackage2 = await driver.findElements(By.className('d-flex flex-row align-items-start infomation__content'))
                        for (let item of infomationPackage2) {
                            arrInfomation2.push(await item.getText())
                        }
                        let TableDataRow = await driver.findElements(By.className('card border--none card-expand'))
                        const nhatrungthau = []
                        const nhakhongtrungthau = []
                        const nhatrungthauliendoanh = []
                        for (let item of TableDataRow) {
                            console.log(await item.getText())
                            if ((await item.getText()).includes('Liên danh')) {
                                nhatrungthauliendoanh.push(await item.getText())
                            } else {
                                if ((await item.getText()).includes('Thông tin Nhà thầu trúng thầu')) {
                                    nhatrungthau.push(await item.getText())
                                }
                            }
                            if ((await item.getText()).includes('Thông tin Nhà thầu không được lựa chọn')) {
                                nhakhongtrungthau.push(await item.getText())
                            }
                        }
                        var ThongTinChiTietGoiThau = {}
                        for (let ele of arrInfomation) {
                            const arrString = ele.split("\n");
                            //console.log(arrString[0] + ":" + arrString[1])
                            if (arrString[0].includes("Mã TBMT")) {
                                ThongTinChiTietGoiThau.MATBMT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phiên bản thay đổi")) {
                                ThongTinChiTietGoiThau.PHIENBANTHAYDOI = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày đăng tải")) {
                                ThongTinChiTietGoiThau.NGAYDANGTAI_THONGBAOMOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Mã KHLCNT")) {
                                ThongTinChiTietGoiThau.MAKHLCNT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phân loại KHLCNT")) {
                                ThongTinChiTietGoiThau.PHANLOAIKHLCNT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Tên dự toán mua sắm")) {
                                ThongTinChiTietGoiThau.TENDUTOANMUASAM = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quy trình áp dụng")) {
                                ThongTinChiTietGoiThau.QUYTRINHAPDUNG = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Tên gói thầu")) {
                                ThongTinChiTietGoiThau.TENGOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Bên mời thầu")) {
                                ThongTinChiTietGoiThau.BENMOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Chi tiết nguồn vốn")) {
                                ThongTinChiTietGoiThau.CHITIETNGUONGVON = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Lĩnh vực")) {
                                ThongTinChiTietGoiThau.LINHVUC = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hình thức lựa chọn nhà thầu")) {
                                ThongTinChiTietGoiThau.HINHTHUCLUACHONNHATHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Loại hợp đồng")) {
                                ThongTinChiTietGoiThau.LOAIHOPDONG = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Trong nước/ Quốc tế")) {
                                ThongTinChiTietGoiThau.TRONGNUOC_QUOCTE = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phương thức lựa chọn nhà thầu")) {
                                ThongTinChiTietGoiThau.PHUONGTHUCCHONNHATHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Thời gian thực hiện hợp đồng")) {
                                ThongTinChiTietGoiThau.THOIGIANTHUCHIENHOPDONG = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hình thức dự thầu")) {
                                ThongTinChiTietGoiThau.HINHTHUCDUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm phát hành e-HSMT")) {
                                ThongTinChiTietGoiThau.DIADIEMPHATHANH_EHSMT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Chi phí nộp e-HSDT")) {
                                ThongTinChiTietGoiThau.CHIPHINOP_EHSDT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm nhận e-HSDT")) {
                                ThongTinChiTietGoiThau.DIADIEMNHAN_EHSDT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm thực hiện gói thầu")) {
                                ThongTinChiTietGoiThau.DIADIEMTHUCHIENGOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Thời điểm mở thầu")) {
                                ThongTinChiTietGoiThau.THOIDIEMMOTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Thời điểm đóng thầu")) {
                                ThongTinChiTietGoiThau.THOIDIEMDONGTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm mở thầu")) {
                                ThongTinChiTietGoiThau.DIADIEMMOTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hiệu lực hồ sơ dự thầu")) {
                                ThongTinChiTietGoiThau.HIEULUCHOSODUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số tiền đảm bảo dự thầu")) {
                                ThongTinChiTietGoiThau.SOTIENDAMBAODUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hình thức đảm bảo dự thầu")) {
                                ThongTinChiTietGoiThau.HINHTHUCDAMBAODUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày phê duyệt")) {
                                ThongTinChiTietGoiThau.NGAYPHEDUYET = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Cơ quan ban hành quyết định")) {
                                ThongTinChiTietGoiThau.COQUANBANHANHQUYETDINH = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.QUYETDINHPHEDUYET = arrString[1] ? arrString[1] : null
                            }
                        }
                        for (let ele of arrInfomation2) {
                            arrString = ele.split('\n')
                            if (arrString[0].includes("Trạng thái KQLCNT")) {
                                ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày đăng tải")) {
                                ThongTinChiTietGoiThau.NGAYDANGTAI_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phiên bản thay đổi")) {
                                ThongTinChiTietGoiThau.PHIENBANTHAYDOI_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Dự toán gói thầu được duyệt sau khi phê duyệt KHLCNT")) {
                                ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Giá gói thầu")) {
                                ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Loại hợp đồng")) {
                                ThongTinChiTietGoiThau.LOAIHOPDONG_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày phê duyệt")) {
                                ThongTinChiTietGoiThau.NGAYPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Cơ quan phê duyệt")) {
                                ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET__KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.QUYETDINHPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Báo cáo đánh giá e-HSDT")) {
                                ThongTinChiTietGoiThau.BAOCAODANHGIA_EHSDT_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Kết quả đấu thầu")) {
                                ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                        }
                        const arrNhaTrung1Thau = []
                        const arrNhaThauKhongTrungThau = []
                        const ArrayNhaThauLienDoanh = []
                        // Xử lý nhà trúng thầu chỉ 1 nhà trúng
                        if (nhatrungthau.length > 0) {
                            const arrInfomationNhaTrungThau = nhatrungthau[0].split('\n')
                            const nhatrungthaustring = arrInfomationNhaTrungThau[arrInfomationNhaTrungThau.length - 1]
                            const nhatrungthaustringxuly = nhatrungthaustring.slice(15, nhatrungthaustring.indexOf('Xem chi tiết tại mẫu tiến độ'))
                            const manhathau = nhatrungthaustring.slice(2, 14);

                            // Sử dụng biểu thức chính quy để tìm kiếm tên công ty và giá trị
                            var match = nhatrungthaustringxuly.match(/^(.*?)\s+(\d{1,3}(?:\.\d{3})*)(?:\s+(\d{1,3}(?:\.\d{3})*))?/);
                            var tennhathautrungthau
                            var giaduthau
                            var giatrungthau

                            // Kiểm tra xem có kết quả khớp không
                            if (match) {
                                var companyName = match[1];
                                var value1 = match[2];
                                var value2 = match[3] || "Không có giá trị thứ hai";
                                tennhathautrungthau = companyName
                                giaduthau = value1
                                giatrungthau = value2

                                const object = {
                                    MANHATHAU: manhathau,
                                    TENNHATHAU: companyName,
                                    GIADUTHAU: giaduthau,
                                    GIATRUNGTHAU: giatrungthau,
                                }
                                arrNhaTrung1Thau.push(object)
                            } else {
                                console.log("Không tìm thấy thông tin phù hợp.");
                            }
                        }
                        if (nhakhongtrungthau.length > 0) {
                            // Xử lý nhà thầu không trúng thầu

                            if (nhakhongtrungthau[0].split('\n').length !== 0) {
                                if (nhakhongtrungthau[0].split('\n').length > 2) {
                                    let VariableFor = nhakhongtrungthau[0].split('\n').length

                                    for (let i = 2; i < VariableFor; i++) {

                                        const data = nhakhongtrungthau[0].split('\n')[i]
                                        let index
                                        if (data.includes("Giá xếp hạng")) {
                                            index = data.indexOf("Giá xếp hạng " + i)
                                        }
                                        if (data.includes("Không đánh giá")) {
                                            index = data.indexOf("Không đánh giá")
                                        }

                                        const stringxuly = data.slice(15, index)
                                        const object = {
                                            TENNHATHAU: stringxuly,
                                            MANHATHAU: data.slice(2, 14),
                                        }
                                        arrNhaThauKhongTrungThau.push(object)
                                    }
                                }
                            }
                        }
                        if (nhatrungthauliendoanh.length > 0) {
                            // xử lý nhà thầu liên doanh
                            const ArrString = nhatrungthauliendoanh[0].split('\n')

                            var giaduthau = 0
                            var giatrungthau = 0
                            var ngayhopdong = 0
                            const Datastring = ArrString[2]
                            const indexNameNhaThau = Datastring.indexOf('Liên danh')
                            const cutthoigianthuchienhopdong = Datastring.slice(0, Datastring.lastIndexOf(" "))
                            const thoigianthuchienhopdong = cutthoigianthuchienhopdong.slice(cutthoigianthuchienhopdong.lastIndexOf(" ")).trim()
                            ngayhopdong = thoigianthuchienhopdong
                            const cutgiaduthau = cutthoigianthuchienhopdong.slice(0, cutthoigianthuchienhopdong.lastIndexOf(" "))
                            const cutgiaduthau2 = cutgiaduthau.slice(cutgiaduthau.lastIndexOf(" ")).trim()
                            giaduthau = cutgiaduthau2
                            const cutgiatrungthau = cutgiaduthau.slice(0, cutgiaduthau.lastIndexOf(" "))
                            const cutgiatrungthau2 = cutgiatrungthau.slice(cutgiatrungthau.lastIndexOf(" ")).trim()
                            giatrungthau = cutgiatrungthau2
                            for (i = 2; i < ArrString.length; i++) {
                                const data = ArrString[i]
                                if (Number(i) === 2) {
                                    const object = {
                                        MANHATHAU: data.slice(2, 14),
                                        TENNHATHAU: data.slice(14, indexNameNhaThau - 1),
                                        THOIGIANTHUCHIENHOPDONG: ngayhopdong,
                                        GIADUTHAU: giaduthau,
                                        GIATRUNGTHAU: giatrungthau,
                                    }

                                    ArrayNhaThauLienDoanh.push(object)
                                } else {
                                    const object = {
                                        MANHATHAU: data.slice(0, 12),
                                        TENNHATHAU: data.slice(13),
                                        THOIGIANTHUCHIENHOPDONG: ngayhopdong,
                                        GIADUTHAU: giaduthau,
                                        GIATRUNGTHAU: giatrungthau,
                                    }
                                    ArrayNhaThauLienDoanh.push(object)
                                }

                            }
                        }
                        const result = await insertInfomationGoiThau(
                            ThongTinChiTietGoiThau.MATBMT, ThongTinChiTietGoiThau.NGAYDANGTAI_THONGBAOMOITHAU, ThongTinChiTietGoiThau.PHIENBANTHAYDOI, ThongTinChiTietGoiThau.MAKHLCNT, ThongTinChiTietGoiThau.PHANLOAIKHLCNT,
                            ThongTinChiTietGoiThau.TENDUTOANMUASAM, ThongTinChiTietGoiThau.QUYTRINHAPDUNG, ThongTinChiTietGoiThau.TENGOITHAU, ThongTinChiTietGoiThau.BENMOITHAU, ThongTinChiTietGoiThau.CHITIETNGUONGVON, ThongTinChiTietGoiThau.LINHVUC,
                            ThongTinChiTietGoiThau.HINHTHUCLUACHONNHATHAU, ThongTinChiTietGoiThau.LOAIHOPDONG, ThongTinChiTietGoiThau.TRONGNUOC_QUOCTE, ThongTinChiTietGoiThau.PHUONGTHUCCHONNHATHAU, ThongTinChiTietGoiThau.THOIGIANTHUCHIENHOPDONG, ThongTinChiTietGoiThau.HINHTHUCDUTHAU,
                            ThongTinChiTietGoiThau.DIADIEMPHATHANH_EHSMT, ThongTinChiTietGoiThau.CHIPHINOP_EHSDT, ThongTinChiTietGoiThau.DIADIEMNHAN_EHSDT, ThongTinChiTietGoiThau.DIADIEMTHUCHIENGOITHAU, ThongTinChiTietGoiThau.THOIDIEMDONGTHAU, ThongTinChiTietGoiThau.THOIDIEMMOTHAU,
                            ThongTinChiTietGoiThau.DIADIEMMOTHAU, ThongTinChiTietGoiThau.HIEULUCHOSODUTHAU, ThongTinChiTietGoiThau.SOTIENDAMBAODUTHAU, ThongTinChiTietGoiThau.HINHTHUCDAMBAODUTHAU, ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET, ThongTinChiTietGoiThau.NGAYPHEDUYET,
                            ThongTinChiTietGoiThau.COQUANBANHANHQUYETDINH, ThongTinChiTietGoiThau.QUYETDINHPHEDUYET, ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU, ThongTinChiTietGoiThau.NGAYDANGTAI_KETQUACHONTHAU, ThongTinChiTietGoiThau.PHIENBANTHAYDOI_KETQUACHONTHAU,
                            ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU, ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU, ThongTinChiTietGoiThau.LOAIHOPDONG_KETQUACHONTHAU, ThongTinChiTietGoiThau.HINHTHUCLUACHONNHATHAU,
                            ThongTinChiTietGoiThau.PHUONGTHUCCHONNHATHAU, ThongTinChiTietGoiThau.NGAYPHEDUYET_KETQUACHONTHAU, ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU, ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET__KETQUACHONTHAU, ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU,
                            ThongTinChiTietGoiThau.TRANGTHAIGOITHAU
                        )
                        if (arrNhaTrung1Thau.length > 0) {
                            for (let item of arrNhaTrung1Thau) {
                                insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Trúng thầu')
                            }
                        }
                        if (arrNhaThauKhongTrungThau.length > 0) {
                            for (let item of arrNhaThauKhongTrungThau) {
                                insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, null, null, 'Không trúng thầu')
                            }
                        }
                        if (ArrayNhaThauLienDoanh.length > 0) {
                            for (let item of ArrayNhaThauLienDoanh) {
                                insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Liên doanh')
                            }
                        }
                        await update_insertDuLieuThau(item.magoithau)
                        await driver.get("https://muasamcong.mpi.gov.vn/");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                } else {
                    if (Number(item.isGet) === 0) {
                        let inputSearch = await driver.findElement(By.name('keyword'))
                        await inputSearch.sendKeys(magoithauItem);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        let searchButton = await driver.findElement(By.className('search-button'))
                        await searchButton.click();
                        element = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__contract__name format__text__title')), 10000);
                        element.click()
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        const arrInfomation = []
                        const arrInfomation2 = []
                        var infomationPackage = await driver.findElements(By.className('d-flex flex-row align-items-start infomation__content'));
                        for (let item of infomationPackage) {
                            arrInfomation.push(await item.getText())
                        }
                        let typeResultButton = await driver.findElements(By.className('nav-item'));
                        var haveNhaThau = false
                        if (typeResultButton.length > 0) {
                            for (let item of typeResultButton) {
                                const a = await item.findElement(By.css('a'))
                                if (await a.getText() === 'Kết quả lựa chọn nhà thầu') {
                                    a.click();
                                    haveNhaThau = true
                                }

                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        let infomationPackage2 = await driver.findElements(By.className('d-flex flex-row align-items-start infomation__content'))
                        for (let item of infomationPackage2) {
                            arrInfomation2.push(await item.getText())
                        }
                        let TableDataRow = await driver.findElements(By.className('card border--none card-expand'))
                        const nhatrungthau = []
                        const nhakhongtrungthau = []
                        const nhatrungthauliendoanh = []
                        for (let item of TableDataRow) {
                            console.log(await item.getText())
                            if ((await item.getText()).includes('Liên danh')) {
                                nhatrungthauliendoanh.push(await item.getText())
                            } else {
                                if ((await item.getText()).includes('Thông tin Nhà thầu trúng thầu')) {
                                    nhatrungthau.push(await item.getText())
                                }
                            }
                            if ((await item.getText()).includes('Thông tin Nhà thầu không được lựa chọn')) {
                                nhakhongtrungthau.push(await item.getText())
                            }
                        }


                        const arrNhaTrung1Thau = []
                        const arrNhaThauKhongTrungThau = []
                        const ArrayNhaThauLienDoanh = []
                        // Xử lý nhà trúng thầu chỉ 1 nhà trúng
                        if (nhatrungthau.length > 0) {
                            const arrInfomationNhaTrungThau = nhatrungthau[0].split('\n')
                            const nhatrungthaustring = arrInfomationNhaTrungThau[arrInfomationNhaTrungThau.length - 1]
                            const nhatrungthaustringxuly = nhatrungthaustring.slice(15, nhatrungthaustring.indexOf('Xem chi tiết tại mẫu tiến độ'))
                            const manhathau = nhatrungthaustring.slice(2, 14);

                            // Sử dụng biểu thức chính quy để tìm kiếm tên công ty và giá trị
                            var match = nhatrungthaustringxuly.match(/^(.*?)\s+(\d{1,3}(?:\.\d{3})*)(?:\s+(\d{1,3}(?:\.\d{3})*))?/);
                            var tennhathautrungthau
                            var giaduthau
                            var giatrungthau

                            // Kiểm tra xem có kết quả khớp không
                            if (match) {
                                var companyName = match[1];
                                var value1 = match[2];
                                var value2 = match[3] || "Không có giá trị thứ hai";
                                tennhathautrungthau = companyName
                                giaduthau = value1
                                giatrungthau = value2

                                const object = {
                                    MANHATHAU: manhathau,
                                    TENNHATHAU: companyName,
                                    GIADUTHAU: giaduthau,
                                    GIATRUNGTHAU: giatrungthau,
                                }
                                arrNhaTrung1Thau.push(object)
                            } else {
                                console.log("Không tìm thấy thông tin phù hợp.");
                            }
                        }
                        if (nhakhongtrungthau.length > 0) {
                            // Xử lý nhà thầu không trúng thầu

                            if (nhakhongtrungthau[0].split('\n').length !== 0) {
                                if (nhakhongtrungthau[0].split('\n').length > 2) {
                                    let VariableFor = nhakhongtrungthau[0].split('\n').length

                                    for (let i = 2; i < VariableFor; i++) {

                                        const data = nhakhongtrungthau[0].split('\n')[i]
                                        let index
                                        if (data.includes("Giá xếp hạng")) {
                                            index = data.indexOf("Giá xếp hạng " + i)
                                        }
                                        if (data.includes("Không đánh giá")) {
                                            index = data.indexOf("Không đánh giá")
                                        }

                                        const stringxuly = data.slice(15, index)
                                        const object = {
                                            TENNHATHAU: stringxuly,
                                            MANHATHAU: data.slice(2, 14),
                                        }
                                        arrNhaThauKhongTrungThau.push(object)
                                    }
                                }
                            }
                        }
                        if (nhatrungthauliendoanh.length > 0) {
                            // xử lý nhà thầu liên doanh
                            const ArrString = nhatrungthauliendoanh[0].split('\n')
                            var giaduthau = 0
                            var giatrungthau = 0
                            var ngayhopdong = 0
                            const Datastring = ArrString[2]
                            const indexNameNhaThau = Datastring.indexOf('Liên danh')
                            const cutthoigianthuchienhopdong = Datastring.slice(0, Datastring.lastIndexOf(" "))
                            const thoigianthuchienhopdong = cutthoigianthuchienhopdong.slice(cutthoigianthuchienhopdong.lastIndexOf(" ")).trim()
                            ngayhopdong = thoigianthuchienhopdong
                            const cutgiaduthau = cutthoigianthuchienhopdong.slice(0, cutthoigianthuchienhopdong.lastIndexOf(" "))
                            const cutgiaduthau2 = cutgiaduthau.slice(cutgiaduthau.lastIndexOf(" ")).trim()
                            giaduthau = cutgiaduthau2
                            const cutgiatrungthau = cutgiaduthau.slice(0, cutgiaduthau.lastIndexOf(" "))
                            const cutgiatrungthau2 = cutgiatrungthau.slice(cutgiatrungthau.lastIndexOf(" ")).trim()
                            giatrungthau = cutgiatrungthau2
                            for (i = 2; i < ArrString.length; i++) {
                                const data = ArrString[i]
                                if (Number(i) === 2) {
                                    const object = {
                                        MANHATHAU: data.slice(2, 14),
                                        TENNHATHAU: data.slice(14, indexNameNhaThau - 1),
                                        THOIGIANTHUCHIENHOPDONG: ngayhopdong,
                                        GIADUTHAU: giaduthau,
                                        GIATRUNGTHAU: giatrungthau,
                                    }

                                    ArrayNhaThauLienDoanh.push(object)
                                } else {
                                    const object = {
                                        MANHATHAU: data.slice(0, 12),
                                        TENNHATHAU: data.slice(13),
                                        THOIGIANTHUCHIENHOPDONG: ngayhopdong,
                                        GIADUTHAU: giaduthau,
                                        GIATRUNGTHAU: giatrungthau,
                                    }
                                    ArrayNhaThauLienDoanh.push(object)
                                }

                            }
                        }

                        var ThongTinChiTietGoiThau = {}
                        for (let ele of arrInfomation) {
                            const arrString = ele.split("\n");
                            //console.log(arrString[0] + ":" + arrString[1])
                            if (arrString[0].includes("Mã TBMT")) {
                                ThongTinChiTietGoiThau.MATBMT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phiên bản thay đổi")) {
                                ThongTinChiTietGoiThau.PHIENBANTHAYDOI = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày đăng tải")) {
                                ThongTinChiTietGoiThau.NGAYDANGTAI_THONGBAOMOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Mã KHLCNT")) {
                                ThongTinChiTietGoiThau.MAKHLCNT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phân loại KHLCNT")) {
                                ThongTinChiTietGoiThau.PHANLOAIKHLCNT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Tên dự toán mua sắm")) {
                                ThongTinChiTietGoiThau.TENDUTOANMUASAM = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quy trình áp dụng")) {
                                ThongTinChiTietGoiThau.QUYTRINHAPDUNG = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Tên gói thầu")) {
                                ThongTinChiTietGoiThau.TENGOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Bên mời thầu")) {
                                ThongTinChiTietGoiThau.BENMOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Chi tiết nguồn vốn")) {
                                ThongTinChiTietGoiThau.CHITIETNGUONGVON = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Lĩnh vực")) {
                                ThongTinChiTietGoiThau.LINHVUC = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hình thức lựa chọn nhà thầu")) {
                                ThongTinChiTietGoiThau.HINHTHUCLUACHONNHATHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Loại hợp đồng")) {
                                ThongTinChiTietGoiThau.LOAIHOPDONG = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Trong nước/ Quốc tế")) {
                                ThongTinChiTietGoiThau.TRONGNUOC_QUOCTE = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phương thức lựa chọn nhà thầu")) {
                                ThongTinChiTietGoiThau.PHUONGTHUCCHONNHATHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Thời gian thực hiện hợp đồng")) {
                                ThongTinChiTietGoiThau.THOIGIANTHUCHIENHOPDONG = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hình thức dự thầu")) {
                                ThongTinChiTietGoiThau.HINHTHUCDUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm phát hành e-HSMT")) {
                                ThongTinChiTietGoiThau.DIADIEMPHATHANH_EHSMT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Chi phí nộp e-HSDT")) {
                                ThongTinChiTietGoiThau.CHIPHINOP_EHSDT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm nhận e-HSDT")) {
                                ThongTinChiTietGoiThau.DIADIEMNHAN_EHSDT = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm thực hiện gói thầu")) {
                                ThongTinChiTietGoiThau.DIADIEMTHUCHIENGOITHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Thời điểm mở thầu")) {
                                ThongTinChiTietGoiThau.THOIDIEMMOTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Thời điểm đóng thầu")) {
                                ThongTinChiTietGoiThau.THOIDIEMDONGTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Địa điểm mở thầu")) {
                                ThongTinChiTietGoiThau.DIADIEMMOTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hiệu lực hồ sơ dự thầu")) {
                                ThongTinChiTietGoiThau.HIEULUCHOSODUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số tiền đảm bảo dự thầu")) {
                                ThongTinChiTietGoiThau.SOTIENDAMBAODUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Hình thức đảm bảo dự thầu")) {
                                ThongTinChiTietGoiThau.HINHTHUCDAMBAODUTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày phê duyệt")) {
                                ThongTinChiTietGoiThau.NGAYPHEDUYET = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Cơ quan ban hành quyết định")) {
                                ThongTinChiTietGoiThau.COQUANBANHANHQUYETDINH = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.QUYETDINHPHEDUYET = arrString[1] ? arrString[1] : null
                            }
                        }
                        for (let ele of arrInfomation2) {
                            arrString = ele.split('\n')
                            if (arrString[0].includes("Trạng thái KQLCNT")) {
                                ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày đăng tải")) {
                                ThongTinChiTietGoiThau.NGAYDANGTAI_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Phiên bản thay đổi")) {
                                ThongTinChiTietGoiThau.PHIENBANTHAYDOI_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Dự toán gói thầu được duyệt sau khi phê duyệt KHLCNT")) {
                                ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Giá gói thầu")) {
                                ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Loại hợp đồng")) {
                                ThongTinChiTietGoiThau.LOAIHOPDONG_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Ngày phê duyệt")) {
                                ThongTinChiTietGoiThau.NGAYPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Cơ quan phê duyệt")) {
                                ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Số quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET__KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Quyết định phê duyệt")) {
                                ThongTinChiTietGoiThau.QUYETDINHPHEDUYET_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Báo cáo đánh giá e-HSDT")) {
                                ThongTinChiTietGoiThau.BAOCAODANHGIA_EHSDT_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                            if (arrString[0].includes("Kết quả đấu thầu")) {
                                ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU = arrString[1] ? arrString[1] : null
                            }
                        }

                        const result = await insertInfomationGoiThau(
                            ThongTinChiTietGoiThau.MATBMT, ThongTinChiTietGoiThau.NGAYDANGTAI_THONGBAOMOITHAU, ThongTinChiTietGoiThau.PHIENBANTHAYDOI, ThongTinChiTietGoiThau.MAKHLCNT, ThongTinChiTietGoiThau.PHANLOAIKHLCNT,
                            ThongTinChiTietGoiThau.TENDUTOANMUASAM, ThongTinChiTietGoiThau.QUYTRINHAPDUNG, ThongTinChiTietGoiThau.TENGOITHAU, ThongTinChiTietGoiThau.BENMOITHAU, ThongTinChiTietGoiThau.CHITIETNGUONGVON, ThongTinChiTietGoiThau.LINHVUC,
                            ThongTinChiTietGoiThau.HINHTHUCLUACHONNHATHAU, ThongTinChiTietGoiThau.LOAIHOPDONG, ThongTinChiTietGoiThau.TRONGNUOC_QUOCTE, ThongTinChiTietGoiThau.PHUONGTHUCCHONNHATHAU, ThongTinChiTietGoiThau.THOIGIANTHUCHIENHOPDONG, ThongTinChiTietGoiThau.HINHTHUCDUTHAU,
                            ThongTinChiTietGoiThau.DIADIEMPHATHANH_EHSMT, ThongTinChiTietGoiThau.CHIPHINOP_EHSDT, ThongTinChiTietGoiThau.DIADIEMNHAN_EHSDT, ThongTinChiTietGoiThau.DIADIEMTHUCHIENGOITHAU, ThongTinChiTietGoiThau.THOIDIEMDONGTHAU, ThongTinChiTietGoiThau.THOIDIEMMOTHAU,
                            ThongTinChiTietGoiThau.DIADIEMMOTHAU, ThongTinChiTietGoiThau.HIEULUCHOSODUTHAU, ThongTinChiTietGoiThau.SOTIENDAMBAODUTHAU, ThongTinChiTietGoiThau.HINHTHUCDAMBAODUTHAU, ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET, ThongTinChiTietGoiThau.NGAYPHEDUYET,
                            ThongTinChiTietGoiThau.COQUANBANHANHQUYETDINH, ThongTinChiTietGoiThau.QUYETDINHPHEDUYET, ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU, ThongTinChiTietGoiThau.NGAYDANGTAI_KETQUACHONTHAU, ThongTinChiTietGoiThau.PHIENBANTHAYDOI_KETQUACHONTHAU,
                            ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU, ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU, ThongTinChiTietGoiThau.LOAIHOPDONG_KETQUACHONTHAU, ThongTinChiTietGoiThau.HINHTHUCLUACHONNHATHAU,
                            ThongTinChiTietGoiThau.PHUONGTHUCCHONNHATHAU, ThongTinChiTietGoiThau.NGAYPHEDUYET_KETQUACHONTHAU, ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU, ThongTinChiTietGoiThau.SOQUYETDINHPHEDUYET__KETQUACHONTHAU, ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU,
                            ThongTinChiTietGoiThau.TRANGTHAIGOITHAU
                        )

                        if (haveNhaThau) {
                            if (arrNhaTrung1Thau.length > 0) {
                                for (let item of arrNhaTrung1Thau) {
                                    const alert = await insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Trúng thầu')
                                    console.log(alert + " Trúng thầu")
                                }
                            }
                            if (arrNhaThauKhongTrungThau.length > 0) {
                                for (let item of arrNhaThauKhongTrungThau) {
                                    const alert = await insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, null, null, 'Không trúng thầu')
                                    console.log(alert + " Không Trúng thầu")
                                }
                            }
                            if (ArrayNhaThauLienDoanh.length > 0) {
                                for (let item of ArrayNhaThauLienDoanh) {
                                    const alert = await insertNhaThauLienQuanDenGoiThau(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Liên doanh')
                                    console.log(alert + " Liên doanh")
                                }
                            }

                        }


                        await update_insertDuLieuThau(item.magoithau)
                        await driver.get("https://muasamcong.mpi.gov.vn/");
                        await new Promise(resolve => setTimeout(resolve, 3000));

                    }
                }
            }



        }
    } catch (err) {
        console.log(err)
        await driver.quit();
    } finally {
        await driver.quit();
    }


}

crawData()

module.exports = crawData;
