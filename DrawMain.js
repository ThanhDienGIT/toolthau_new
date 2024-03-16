const { Builder, By, until } = require("selenium-webdriver");
const { checkListPackage, insertListPackage, updateStatusAndisGetPackage, updateStatusPackage, getAllDataListPackage } = require("./database/ListContractorsController")
const { checkDetailInfomationPackage, insertDetailInfomationPackage, updateDetailInfomationPackage, insertContractorsRelatedToTheBiddingPackage } = require("./database/DetailContractorsController")


const DrawGoiThau = async () => {
     const arrThau = await getAllData()
     let driver = await new Builder().forBrowser("chrome").build();
     await driver.get("https://muasamcong.mpi.gov.vn/");
     await driver.manage().window().maximize();
     let closeButton = await driver.wait(until.elementLocated(By.id('popup-close')), 100000);
     await closeButton.click();
     // Lặp qua tất cả các gói thầu trong DB
     for (let item of arrThau) {
          // Bảng list thì không có cut
          const magoithauItemNoCut = await item.magoithau
          //  Bảng detail cut bỏ -00
          const magoithauItem = await item.magoithau.slice(0, 12)
          // Check tất cả gói thầu chưa lấy
          if (Number(item.isGet) === 0) {
               let inputSearch = await driver.wait(until.elementLocated(By.name('keyword')), 100000);
               await inputSearch.clear()
               await inputSearch.sendKeys(magoithauItem);
               // Nút tìm kiếm                                                                 
               let searchButton = await driver.wait(until.elementLocated(By.className('search-button')), 100000)
               await searchButton.click();
               // Lấy trạng thái gói thầu
               let Status = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__notice--be')), 100000)

               // Bấm vào link thầu
               element = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__contract__name format__text__title')), 100000);
               element.click()

               // Lấy thông tin gói thầu thông báo mời thầu
               let infomationPackage2 = await driver.wait(until.elementLocated(By.className('d-flex flex-row align-items-start infomation__content')), 100000)
               for (let item of infomationPackage2) {
                    arrInfomation2.push(await item.getText())
               }
               // Lấy thông tin chi tiết gói thầu
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
               // Kiểm tra xem gói thầu này đã có nhà trúng thầu chưa
               let typeResultButton = await driver.wait(until.elementLocated(By.className('nav-item')), 100000);

               var conhatrungthau = false
               if (typeResultButton.length > 0) {
                    for (let item of typeResultButton) {
                         const a = await item.findElement(By.css('a'))
                         if (await a.getText() === 'Kết quả lựa chọn nhà thầu') {
                              await a.click();
                              conhatrungthau = true
                         }
                    }
               }
               const arrNhaTrung1Thau = []
               const arrNhaThauKhongTrungThau = []
               const ArrayNhaThauLienDoanh = []
               if (conhatrungthau) {
                    let TableDataRow = await driver.wait(until.elementLocated(By.className('card border--none card-expand')), 100000)
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
               }
               // Từ khúc này là check xem làm gì còn ở trên là chuẩn bị dữ liệu

               // True là insert False là Update
               var InsertOrUpdate = false

               if (checkDetailInfomationPackage(magoithauItem)) {
                    InsertOrUpdate = true
               }
               // Chưa có gói thầu thì chỉ cần insert vào là xong
               else {
                    InsertOrUpdate = false
               }

               // Kiểm tra trạng thái hiện tại của gói thầu hiện tại có giống với gói thầu đang nằm trong DB hay không
               // Nếu giống thì thực hiện lấy thông tin gói thầu không thì update lại trạng thái gói thầu ở bên bảng Global và tiến hành lấy thông tin gói thầu

               if (InsertOrUpdate) {
                    console.log('Gói thầu hiện tại là insert')
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
                              const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Trúng thầu')
                              console.log(alert + " Trúng thầu")
                         }
                    }
                    if (arrNhaThauKhongTrungThau.length > 0) {
                         for (let item of arrNhaThauKhongTrungThau) {
                              const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, null, null, 'Không trúng thầu')
                              console.log(alert + " Không Trúng thầu")
                         }
                    }
                    if (ArrayNhaThauLienDoanh.length > 0) {
                         for (let item of ArrayNhaThauLienDoanh) {
                              const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Liên doanh')
                              console.log(alert + " Liên doanh")
                         }
                    }
                    // Kiểm tra update lại trang thái gói thầu
                    if (await Status.getText() === item.trangthaigoithau) {
                         updateStatusPackage(magoithauItemNoCut)
                    }
                    else {
                         updateStatusAndisGetPackage(magoithauItemNoCut, Status.getText())
                    }
               } else {
                    console.log('Gói thầu hiện tại là update')
                    const result = await updateDetailInfomationPackage(
                         ThongTinChiTietGoiThau.TENDUTOANMUASAM, ThongTinChiTietGoiThau.TRANGTHAIKQLCNT_KETQUACHONTHAU, ThongTinChiTietGoiThau.DUTOANGOITHAU_KETQUACHONTHAU,
                         ThongTinChiTietGoiThau.GIAGOITHAU_KETQUACHONTHAU, ThongTinChiTietGoiThau.COQUANPHEDUYET_KETQUACHONTHAU, ThongTinChiTietGoiThau.KETQUADAUTHAU_KETQUACHONTHAU,
                         ThongTinChiTietGoiThau.TRANGTHAIGOITHAU,
                         ThongTinChiTietGoiThau.MATBMT)
                    console.log(result)
                    if (arrNhaTrung1Thau.length > 0) {
                         for (let item of arrNhaTrung1Thau) {
                              const alert = await insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Trúng thầu')
                              console.log(alert + " Trúng thầu")
                         }
                    }
                    if (arrNhaThauKhongTrungThau.length > 0) {
                         for (let item of arrNhaThauKhongTrungThau) {
                              const alert = insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, null, null, 'Không trúng thầu')
                              console.log(alert + " Không Trúng thầu")
                         }
                    }
                    if (ArrayNhaThauLienDoanh.length > 0) {
                         for (let item of ArrayNhaThauLienDoanh) {
                              const alert = insertContractorsRelatedToTheBiddingPackage(result.recordset[0].IDGOITHAU, item.TENNHATHAU, item.MANHATHAU, item.GIADUTHAU, item.GIATRUNGTHAU, 'Liên doanh')
                              console.log(alert + " Liên doanh")
                         }
                    }
                    // Kiểm tra update lại trang thái gói thầu
                    if (await Status.getText() === item.trangthaigoithau) {
                         updateStatusPackage(magoithauItemNoCut)
                    }
                    else {
                         updateStatusAndisGetPackage(magoithauItemNoCut, Status.getText())
                    }
               }
          } else {
               console.log('Đã có gói thầu này')
          }
          await driver.get("https://muasamcong.mpi.gov.vn/");
     }
}


