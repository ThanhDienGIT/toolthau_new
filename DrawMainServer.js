const { Builder, By, until } = require("selenium-webdriver");
const { checkListPackage, insertListPackage, updateStatusAndisGetPackage, updateStatusPackage, getAllDataListPackageServer2 } = require("./database/ListContractorsController")
const { checkDetailInfomationPackage, insertDetailInfomationPackage, getInfomationInfoPackage, updateDetailInfomationPackage, insertContractorsRelatedToTheBiddingPackage } = require("./database/DetailContractorsController")


const DrawGoiThau = async () => {
     let driver = await new Builder().forBrowser("chrome").build();
     try {
          const arrThau = await getAllDataListPackageServer2()
          const arrRun = await arrThau.filter(x => x.isGet === 0);
          await driver.get("https://muasamcong.mpi.gov.vn/");
          await driver.manage().window().maximize();
          let closeButton = await driver.wait(until.elementLocated(By.id('popup-close')), 100000);
          await closeButton.click();
          // Lặp qua tất cả các gói thầu trong DB
          for (let item of arrRun) {
               console.log(item)
               // Bảng list thì không có cut
               const magoithauItemNoCut = await item.magoithau
               //  Bảng detail cut bỏ -00
               const magoithauItem = await item.magoithau.slice(0, 12)
               const Itemtrangthaigoithau = await item.trangthaigoithau
               // Check tất cả gói thầu chưa lấy
               if (Number(item.isGet) === 0) {
                    let inputSearch = await driver.wait(until.elementLocated(By.name('keyword')), 100000);
                    await inputSearch.clear()
                    await inputSearch.sendKeys(magoithauItem);
                    // Nút tìm kiếm                                                                 
                    let searchButton = await driver.wait(until.elementLocated(By.className('search-button')), 100000)
                    await searchButton.click();

                    // Lấy trạng thái gói thầu
                    let DivStatus = await driver.wait(until.elementLocated(By.className('d-flex justify-content-between align-items-center')), 100000)
                    let Status = await DivStatus.findElement(By.css('span'))
                    const StatusText = await Status.getText()
                    // Bấm vào link thầu
                    let elementLink = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__contract__name format__text__title')), 100000);
                    await elementLink.click()

                    // Lấy thông tin gói thầu thông báo mời thầu
                    const arrInfomation = []
                    const arrInfomation2 = []
                    var infomationPackage = await driver.wait(until.elementsLocated(By.className('d-flex flex-row align-items-start infomation__content')), 100000)
                    for (let item of infomationPackage) {
                         arrInfomation.push(await item.getText())
                    }
                    var ThongTinChiTietGoiThau = {}
                    for (let ele of arrInfomation) {
                         const arrString = ele.split("\n");

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

                    // Kiểm tra xem gói thầu này đã có nhà trúng thầu chưa
                    let typeResultButton = await driver.wait(until.elementsLocated(By.className('nav-item')), 100000);

                    var conhatrungthau = false
                    if (typeResultButton.length > 0) {
                         for (let itemLuaChonThau of typeResultButton) {
                              if(await itemLuaChonThau.getText() === 'Kết quả lựa chọn nhà thầu'){
                                   const a = await itemLuaChonThau.findElement(By.css('a'))
                                        await a.click();
                                        conhatrungthau = true
                                   }
                              }
                         }
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    let infomationPackage2 = await driver.wait(until.elementsLocated(By.className('d-flex flex-row align-items-start infomation__content')), 100000)
                    for (let item2 of infomationPackage2) {
                         await arrInfomation2.push(await item2.getText())
                    }

                    for (let ele2 of arrInfomation2) {
                         arrString = ele2.split('\n')
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
                    if (conhatrungthau) {
                         console.log('Đang có nhà thầu trúng thầu')
                         let TableDataRow = await driver.wait(until.elementsLocated(By.className('card border--none card-expand')), 100000)
                         const nhatrungthau = []
                         const nhakhongtrungthau = []
                         const nhatrungthauliendoanh = []
                         for (let itemTable of TableDataRow) {

                              if ((await itemTable.getText()).includes('Liên danh')) {
                                   nhatrungthauliendoanh.push(await itemTable.getText())
                                   console.log("Có liên doanh")
                              } else {
                                   if ((await itemTable.getText()).includes('Thông tin Nhà thầu trúng thầu')) {
                                        nhatrungthau.push(await itemTable.getText())
                                        console.log("Có Nhà thầu trúng thầu")
                                   }
                              }
                              if ((await itemTable.getText()).includes('Thông tin Nhà thầu không được lựa chọn')) {
                                   nhakhongtrungthau.push(await itemTable.getText())
                                   console.log("Có Nhà thầu không được lựa chọn")
                              }
                         }

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
                              console.log("Liên doanh")
                              console.log("Giá dự thầu " + cutgiaduthau)
                              console.log("Giá trúng thầu " + cutgiatrungthau)
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
                    }

                    // Từ khúc này là check xem làm gì còn ở trên là chuẩn bị dữ liệu
                    // True là insert False là Update
                    const InsertOrUpdate = await checkDetailInfomationPackage(magoithauItem)
                    // Kiểm tra trạng thái hiện tại của gói thầu hiện tại có giống với gói thầu đang nằm trong DB hay không
                    // Nếu giống thì thực hiện lấy thông tin gói thầu không thì update lại trạng thái gói thầu ở bên bảng Global và tiến hành lấy thông tin gói thầu
                    if (InsertOrUpdate === 'false') {
                         console.log('Gói thầu hiện tại là insert')
                         const result = await insertDetailInfomationPackage(
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
                         if (Number(result.rowsAffected.length) > 0) {
                              console.log("Có thay đổi insert thì nên update isGet lại :")
                              if (StatusText === Itemtrangthaigoithau) {
                                   const alert = await updateStatusPackage(magoithauItemNoCut)
                                   console.log(alert)
                              }
                              else {
                                   const alert = await updateStatusAndisGetPackage(magoithauItemNoCut, StatusText)
                                   console.log(alert)
                              }
                         }


                         if (arrNhaTrung1Thau.length > 0) {
                              for (let itemNhatrung1Thau of arrNhaTrung1Thau) {
                                   const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, itemNhatrung1Thau.TENNHATHAU, itemNhatrung1Thau.MANHATHAU, itemNhatrung1Thau.GIADUTHAU, itemNhatrung1Thau.GIATRUNGTHAU, 'Trúng thầu')
                                   console.log(alert + " Trúng thầu")
                              }
                         }
                         if (arrNhaThauKhongTrungThau.length > 0) {
                              for (let itemNhaThauKhongTrungThau of arrNhaThauKhongTrungThau) {
                                   const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, itemNhaThauKhongTrungThau.TENNHATHAU, itemNhaThauKhongTrungThau.MANHATHAU, null, null, 'Không trúng thầu')
                                   console.log(alert + " Không Trúng thầu")
                              }
                         }
                         if (ArrayNhaThauLienDoanh.length > 0) {
                              for (let itemLienDoanh of ArrayNhaThauLienDoanh) {
                                   const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, itemLienDoanh.TENNHATHAU, itemLienDoanh.MANHATHAU, itemLienDoanh.GIADUTHAU, itemLienDoanh.GIATRUNGTHAU, 'Liên doanh')
                                   console.log(alert + " Liên doanh")
                              }
                         }

                    } else {
                         const ketqua = await getInfomationInfoPackage(magoithauItem)

                         console.log('Gói thầu hiện tại là update')
                         const result = await updateDetailInfomationPackage(
                              ThongTinChiTietGoiThau.TENDUTOANMUASAM,
                              ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU,
                              ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU,
                              ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU,
                              ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU,
                              ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU,
                              ThongTinChiTietGoiThau.TRANGTHAIGOITHAU,
                              magoithauItem)

                         if (Number(result) > 0) {


                              if (StatusText === Itemtrangthaigoithau) {
                                   const alert = await updateStatusPackage(magoithauItemNoCut)
                                   console.log(alert)
                              }
                              else {
                                   const alert = await updateStatusAndisGetPackage(magoithauItemNoCut, StatusText)
                                   console.log(alert)
                              }
                         }

                         if (arrNhaTrung1Thau.length > 0) {
                              for (let itemarrNhaTrung1Thau of arrNhaTrung1Thau) {
                                   const alert = await insertContractorsRelatedToTheBiddingPackage(ketqua.recordset[0].IDGOITHAU, itemarrNhaTrung1Thau.TENNHATHAU, itemarrNhaTrung1Thau.MANHATHAU, itemarrNhaTrung1Thau.GIADUTHAU, itemarrNhaTrung1Thau.GIATRUNGTHAU, 'Trúng thầu')
                                   console.log(alert + " Trúng thầu")
                              }
                         }
                         if (arrNhaThauKhongTrungThau.length > 0) {
                              for (let itemarrNhaThauKhongTrungThau of arrNhaThauKhongTrungThau) {
                                   const alert = await insertContractorsRelatedToTheBiddingPackage(ketqua.recordset[0].IDGOITHAU, itemarrNhaThauKhongTrungThau.TENNHATHAU, itemarrNhaThauKhongTrungThau.MANHATHAU, null, null, 'Không trúng thầu')
                                   console.log(alert + " Không Trúng thầu")
                              }
                         }
                         if (ArrayNhaThauLienDoanh.length > 0) {
                              for (let itemArrayNhaThauLienDoanh of ArrayNhaThauLienDoanh) {
                                   const alert = await insertContractorsRelatedToTheBiddingPackage(ketqua.recordset[0].IDGOITHAU, itemArrayNhaThauLienDoanh.TENNHATHAU, itemArrayNhaThauLienDoanh.MANHATHAU, itemArrayNhaThauLienDoanh.GIADUTHAU, itemArrayNhaThauLienDoanh.GIATRUNGTHAU, 'Liên doanh')
                                   console.log(alert + " Liên doanh")
                              }
                         }

                    }
               } else {
                    console.log('Đã có gói thầu này')
               }
               console.log("Đã xong gói thầu đến bước tiếp theo")
               console.log("")
               console.log("")
               console.log("----------------------------------")
               await driver.get("https://muasamcong.mpi.gov.vn/");
          }
     } catch (err) {
          console.log("lỗi")
          console.log(err)
     } finally {
          await driver.quit()
     }

}


DrawGoiThau()