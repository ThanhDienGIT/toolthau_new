const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { checkListPackage } = require("./database/ListContractorsController")
const { Driver } = require("selenium-webdriver/chrome");

const checkThau = async () => {
     console.log(await checkThauExists('IB2300358205-00'));
}

const arrTinhGlobal = [
     'Thành phố Hà Nội'
]

async function crawHaNoiHCM() {
     // launch the browser
     const arr2 = []
     let driver = await new Builder().forBrowser("chrome").build();
     try {
          // truy cập muasamcong
          await driver.get("https://muasamcong.mpi.gov.vn/");
          await driver.manage().window().maximize();
          // form thông báo
          let closeButton = await driver.findElement(By.id('popup-close'));
          await new Promise(resolve => setTimeout(resolve, 8000));
          await closeButton.click();
          console.log('Tắt nút')
          // Nút tìm kiếm nâng cao
          let searchButton = await driver.findElement(By.className('content__search__body__sub'));
          await searchButton.click();
          console.log('Đã vào trang tìm kiếm nâng cao')
          // Select danh sách tỉnh thành phố

          await new Promise(resolve => setTimeout(resolve, 10000));
          const datePicker = await driver.findElements(By.className('content__body__session'));
          for (var element of datePicker) {
               if (await element.getText() === 'Thời gian đăng tải') {
                    const pick = await element.findElements(By.className('width_date_antdv'));
                    pick[1].click()
                    console.log('Đã click vào date picker')
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const Datapicker = await driver.findElement(By.className('ant-calendar-prev-month-btn'))
                    for (i = 0; i < 9; i++) {
                         await new Promise(resolve => setTimeout(resolve, 1000));
                         await Datapicker.click();
                    }
                    console.log('Đã bấm tới tháng cần')
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const dateday = await driver.findElements(By.className('ant-calendar-date'));
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    for (var element of dateday) {
                         let number = await element.getText()
                         if (Number(number) === 11) {
                              console.log('đã bấm vào nút 11')
                              await element.click()
                         }
                    }
                    console.log('Hoàn thành chọn tháng')
               }
          }

          await new Promise(resolve => setTimeout(resolve, 9000));
          var multiSelect = await driver.findElement(By.className('ant-select-selection--multiple'));
          await multiSelect.click()
          console.log('Đã bấm vào select tỉnh thành phố')
          await new Promise(resolve => setTimeout(resolve, 9000));
          for (let nameTinh of arrTinhGlobal) {
               var i = 0;
               let elements2 = await driver.findElements(By.className('ant-select-dropdown-menu-item'));
               var search = await driver.findElements(By.className('content__footer__btn'));
               for (var element of elements2) {
                    if (await element.getText() === nameTinh) {
                         element.click()
                         console.log('Đã chọn vào ' + nameTinh)
                    }
               }

               // const checkbox = await driver.findElements(By.className('check-box-group-2 d-flex gap-8'));

               // for (let element of checkbox) {
               //     if (await element.getText() === 'Hàng hóa') {
               //         const checkboxclick = await element.findElement(By.name('ck-investField'));
               //         await checkboxclick.click()
               //     }
               // }

               await new Promise(resolve => setTimeout(resolve, 10000));
               // Nhấn nút tìm kiếm
               for (var elementsearch of search) {
                    var outerHTML = await elementsearch.getAttribute('outerHTML');
                    if (outerHTML.includes('Tìm kiếm')) {
                         await elementsearch.click();
                    }
               }
               console.log('Đã nhấn nút tìm kiếm')
               await new Promise(resolve => setTimeout(resolve, 10000));
               let selectElement = await driver.findElement(By.css('select'));
               await new Promise(resolve => setTimeout(resolve, 10000));
               let Element = await selectElement.findElement(By.css('option[value="50"]'))
               await new Promise(resolve => setTimeout(resolve, 10000));
               await driver.executeScript("arguments[0].value = '10000';", Element);
               await Element.click();
               console.log('Đã chọn xổ 10.000 dòng')
               await new Promise(resolve => setTimeout(resolve, 60000));
               let dulieucao = await driver.findElements(By.className('content__body__left__item__infor'));
               await new Promise(resolve => setTimeout(resolve, 10000));
               console.log('hoàn thành')
               if (dulieucao.length > 0) {
                    console.log('Đã vào vòng lặp get infomation')
                    for (let el of dulieucao) {
                         i++;
                         let ModalTBMT = await el.findElement(By.className('d-flex justify-content-between align-items-center'))
                         let TBMT = await ModalTBMT.findElement(By.className('content__body__left__item__infor__code'));
                         let trangthaigoithau = await el.findElement(By.css('span'))
                         let ModalRow = await el.findElement(By.className('row'))
                         let ModalTenGoiThau = await ModalRow.findElement(By.className('col-md-8 content__body__left__item__infor__contract'))
                         let link = await ModalTenGoiThau.findElement(By.css('a'))
                         let tengoithau = await ModalTenGoiThau.findElement(By.className('content__body__left__item__infor__contract__name format__text__title'))
                         let ModalRowIncontract = await ModalTenGoiThau.findElement(By.className('row'))
                         let ModalBenMoiThauVaNgayDangTaiThongBao = await ModalRowIncontract.findElement(By.className('col-md-8 content__body__left__item__infor__contract__other format__text'))
                         let benmoithau = await ModalBenMoiThauVaNgayDangTaiThongBao.findElements(By.css('h6'))
                         let nhadaututext = ''
                         let benmoithautext = ''
                         let ngaydangtaithongbaotext = ''
                         let diadiem = await ModalTenGoiThau.findElements(By.className('format__text__title'))
                         let diadiemtext = ''
                         for (element2 of diadiem) {
                              diadiemtext = await element2.getText()
                         }
                         for (element of benmoithau) {
                              let text = await element.getText();
                              if (text.includes('Ngày đăng tải thông báo :')) {
                                   ngaydangtaithongbaotext = await text.slice(25)
                              }
                              if (text.includes('Thời gian sửa TBMT :')) {
                                   ngaydangtaithongbaotext = await text.slice(19)
                              }
                              if (text.includes('Chủ đầu tư :') || text.includes('Bên mời thầu :') && !text.includes('Chủ đầu tư/ Bên mời thầu :')) {
                                   if (text.includes('Chủ đầu tư:')) {
                                        nhadaututext = await text.slice(11)
                                   }
                                   if (text.includes('Bên mời thầu :')) {
                                        benmoithautext = await text.slice(13)
                                   }
                              }
                              if (text.includes('Chủ đầu tư/ Bên mời thầu :')) {
                                   const arrString1 = await text.split('/')
                                   const arrStringSub1 = await arrString1[1].split(":")
                                   nhadaututext = await arrStringSub1[1]
                                   benmoithautext = await arrStringSub1[1]
                              }
                         }
                         let Modalthoidiemdongthauvahinhthucthau = await ModalRow.findElement(By.className('col-md-2 content__body__right__item__infor__contract'))
                         let contentthoidiemdongthauhinhthucduthau = await Modalthoidiemdongthauvahinhthucthau.findElements(By.css('h5'))
                         let hanban = await contentthoidiemdongthauhinhthucduthau[1].getText() + " " + await contentthoidiemdongthauhinhthucduthau[0].getText();
                         let hinhthucduthau = await contentthoidiemdongthauhinhthucduthau[2].getText();
                         let URL = await link.getAttribute('href')
                         let tengoithautext = await tengoithau.getText()
                         var SoTBMTData = await TBMT.getText();
                         var tenData = await tengoithautext;
                         var benmoithauData = await benmoithautext;
                         var nhadautuData = await nhadaututext;
                         var hinhthucData = await hinhthucduthau;
                         var thoidiemdangData = await ngaydangtaithongbaotext;
                         var hanbanData = await hanban;
                         var urlremoteData = await URL;
                         var trangthaigoithautext = await trangthaigoithau.getText();
                         const object = await {
                              TBMT: SoTBMTData,
                              name: tenData,
                              trangthaigoithau: trangthaigoithautext,
                              benmoithau: benmoithauData,
                              nhadautu: nhadautuData,
                              hinhthuc: hinhthucData,
                              diadiem: diadiemtext,
                              thoidiemdang: thoidiemdangData,
                              hanban: hanbanData,
                              url: urlremoteData
                         }
                         console.log(i)
                         if (await checkThauExistsGlobal(object.TBMT.slice(10)) === true) {
                              console.log('Đã có gối thầu này:' + object.TBMT.slice(10))
                         } else {
                              console.log('Đã insert vào:' + object.TBMT.slice(10))
                              await insertThauGlobal(object.TBMT.slice(10), object.thoidiemdang, object.trangthaigoithau, object.diadiem);
                         }
                    }
               }
               await new Promise(resolve => setTimeout(resolve, 10000));
               let searchButton2 = await driver.findElement(By.className('content__search__body__sub'));
               await searchButton2.click();
               await new Promise(resolve => setTimeout(resolve, 10000));
               var multiSelect2 = await driver.findElement(By.className('ant-select-selection--multiple'));
               await multiSelect2.click()
          }
     } catch (err) {
          console.log(err)
          console.log('Thất bại đang tiến hành cào lại dữ liệu')
          crawData()
     }
     finally {
          //  await driver.quit();
          return arr2;
     }
}
//crawHaNoiHCM()

const CapNhatTinhHinhGoiThauToanTinh = async () => {
     try {
          // Chạy server
          let driver = await new Builder().forBrowser("chrome").build();
          // truy cập muasamcong
          await driver.get("https://muasamcong.mpi.gov.vn/");
          await driver.manage().window().maximize();
          // form thông báo
          let closeButton = driver.wait(until.elementLocated(By.id('popup-close')), 100000)
          await closeButton.click();
          // Nút tìm kiếm nâng cao
          let searchButton = await driver.wait(until.elementLocated(By.className('content__search__body__sub')), 100000);
          await searchButton.click();
          // Select danh sách tỉnh thành phố
          var multiSelect = await driver.wait(until.elementLocated(By.className('ant-select-selection--multiple')), 100000);
          await multiSelect.click()

          let elements2 = await driver.wait(until.elementLocated(By.className('ant-select-dropdown-menu-item')), 100000);

          for (let nameTinh of arrTinhGlobal) {
               var i = 0;
               var search = await driver.findElements(By.className('content__footer__btn'));
               for (var element of elements2) {
                    if (await element.getText() === nameTinh) {
                         element.click()
                         console.log('Đã chọn vào ' + nameTinh)
                    }
               }
               // Nhấn nút tìm kiếm
               for (var elementsearch of search) {
                    var outerHTML = await elementsearch.getAttribute('outerHTML');
                    if (outerHTML.includes('Tìm kiếm')) {
                         await elementsearch.click();
                         console.log('Đã nhấn nút tìm kiếm')
                    }
               }

               let selectElement = await driver.wait(until.elementLocated(By.css('select')), 100000)
               let Element = await selectElement.findElement(By.css('option[value="50"]'))
               await driver.executeScript("arguments[0].value = '10000';", Element);
               await Element.click();
               console.log('Đã chọn xổ 10.000 dòng')

               let dulieucao = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor')), 100000)

               console.log('hoàn thành')

               if (dulieucao.length > 0) {

                    for (let el of dulieucao) {
                         i++;
                         let ModalTBMT = await el.findElement(By.className('d-flex justify-content-between align-items-center'))
                         let TBMT = await ModalTBMT.findElement(By.className('content__body__left__item__infor__code'));
                         let trangthaigoithau = await el.findElement(By.css('span'))
                         let ModalRow = await el.findElement(By.className('row'))
                         let ModalTenGoiThau = await ModalRow.findElement(By.className('col-md-8 content__body__left__item__infor__contract'))
                         let link = await ModalTenGoiThau.findElement(By.css('a'))
                         let tengoithau = await ModalTenGoiThau.findElement(By.className('content__body__left__item__infor__contract__name format__text__title'))
                         let ModalRowIncontract = await ModalTenGoiThau.findElement(By.className('row'))
                         let ModalBenMoiThauVaNgayDangTaiThongBao = await ModalRowIncontract.findElement(By.className('col-md-8 content__body__left__item__infor__contract__other format__text'))
                         let benmoithau = await ModalBenMoiThauVaNgayDangTaiThongBao.findElements(By.css('h6'))
                         let nhadaututext = ''
                         let benmoithautext = ''
                         let ngaydangtaithongbaotext = ''
                         let diadiem = await ModalTenGoiThau.findElements(By.className('format__text__title'))
                         let diadiemtext = ''
                         for (element2 of diadiem) {
                              diadiemtext = await element2.getText()
                         }
                         for (element of benmoithau) {
                              let text = await element.getText();
                              if (text.includes('Ngày đăng tải thông báo :')) {
                                   ngaydangtaithongbaotext = await text.slice(25)
                              }
                              if (text.includes('Thời gian sửa TBMT :')) {
                                   ngaydangtaithongbaotext = await text.slice(19)
                              }
                              if (text.includes('Chủ đầu tư :') || text.includes('Bên mời thầu :') && !text.includes('Chủ đầu tư/ Bên mời thầu :')) {
                                   if (text.includes('Chủ đầu tư:')) {
                                        nhadaututext = await text.slice(11)
                                   }
                                   if (text.includes('Bên mời thầu :')) {
                                        benmoithautext = await text.slice(13)
                                   }
                              }
                              if (text.includes('Chủ đầu tư/ Bên mời thầu :')) {
                                   const arrString1 = await text.split('/')
                                   const arrStringSub1 = await arrString1[1].split(":")
                                   nhadaututext = await arrStringSub1[1]
                                   benmoithautext = await arrStringSub1[1]
                              }
                         }
                         let Modalthoidiemdongthauvahinhthucthau = await ModalRow.findElement(By.className('col-md-2 content__body__right__item__infor__contract'))
                         let contentthoidiemdongthauhinhthucduthau = await Modalthoidiemdongthauvahinhthucthau.findElements(By.css('h5'))
                         let hanban = await contentthoidiemdongthauhinhthucduthau[1].getText() + " " + await contentthoidiemdongthauhinhthucduthau[0].getText();
                         let hinhthucduthau = await contentthoidiemdongthauhinhthucduthau[2].getText();
                         let URL = await link.getAttribute('href')
                         let tengoithautext = await tengoithau.getText()
                         var SoTBMTData = await TBMT.getText();
                         var tenData = await tengoithautext;
                         var benmoithauData = await benmoithautext;
                         var nhadautuData = await nhadaututext;
                         var hinhthucData = await hinhthucduthau;
                         var thoidiemdangData = await ngaydangtaithongbaotext;
                         var hanbanData = await hanban;
                         var urlremoteData = await URL;
                         var trangthaigoithautext = await trangthaigoithau.getText();
                         const object = await {
                              TBMT: SoTBMTData,
                              name: tenData,
                              trangthaigoithau: trangthaigoithautext,
                              benmoithau: benmoithauData,
                              nhadautu: nhadautuData,
                              hinhthuc: hinhthucData,
                              diadiem: diadiemtext,
                              thoidiemdang: thoidiemdangData,
                              hanban: hanbanData,
                              url: urlremoteData
                         }
                         console.log(i)
                         if (await checkThauExistsGlobal(object.TBMT.slice(10)) === true) {
                              console.log('Đã có gối thầu này:' + object.TBMT.slice(10))
                         } else {
                              console.log('Đã insert vào:' + object.TBMT.slice(10))
                              await insertThauGlobal(object.TBMT.slice(10), object.thoidiemdang, object.trangthaigoithau, object.diadiem);
                         }
                    }
               }

               let searchButton2 = await driver.wait(until.elementLocated(By.className('content__search__body__sub')), 100000);
               await searchButton2.click();
               var multiSelect2 = await driver.wait(until.elementLocated(By.className('ant-select-selection--multiple')), 100000);
               await multiSelect2.click()
          }
     } catch (err) {
          console.log(err)
          console.log('Thất bại đang tiến hành cào lại dữ liệu')
          crawData()
     }
     finally {
          await driver.quit();
     }
}
CapNhatTinhHinhGoiThauToanTinh()

async function crawDataServer() {
     // launch the browser
     const arr2 = []
     let driver = await new Builder().forBrowser("chrome").build();
     try {
          await driver.get("https://muasamcong.mpi.gov.vn/");
          await driver.manage().window().maximize();
          await new Promise(resolve => setTimeout(resolve, 10000));
          let closeButton = await driver.findElement(By.id('popup-close'));
          await new Promise(resolve => setTimeout(resolve, 10000));
          await closeButton.click();
          let searchButton = await driver.findElement(By.className('search-button'));
          await searchButton.click();
          await new Promise(resolve => setTimeout(resolve, 10000));
          let selectElement = await driver.findElement(By.css('select'));
          let Element = await selectElement.findElement(By.css('option[value="50"]'))
          await driver.executeScript("arguments[0].value = '10000';", Element);
          await Element.click();
          await new Promise(resolve => setTimeout(resolve, 10000));
          let dulieucao = await driver.findElements(By.className('content__body__left__item__infor'));
          for (let el of dulieucao) {
               let ModalTBMT = await el.findElement(By.className('d-flex justify-content-between align-items-center'))
               let TBMT = await ModalTBMT.findElement(By.className('content__body__left__item__infor__code'));
               let trangthaigoithau = await el.findElement(By.css('span'))
               let ModalRow = await el.findElement(By.className('row'))
               let ModalTenGoiThau = await ModalRow.findElement(By.className('col-md-8 content__body__left__item__infor__contract'))
               let link = await ModalTenGoiThau.findElement(By.css('a'))
               let tengoithau = await ModalTenGoiThau.findElement(By.className('content__body__left__item__infor__contract__name format__text__title'))
               let ModalRowIncontract = await ModalTenGoiThau.findElement(By.className('row'))
               let ModalBenMoiThauVaNgayDangTaiThongBao = await ModalRowIncontract.findElement(By.className('col-md-8 content__body__left__item__infor__contract__other format__text'))
               let benmoithau = await ModalBenMoiThauVaNgayDangTaiThongBao.findElements(By.css('h6'))
               let nhadaututext = ''
               let benmoithautext = ''
               let ngaydangtaithongbaotext = ''
               let diadiem = await ModalTenGoiThau.findElements(By.className('format__text__title'))
               let diadiemtext = ''
               for (element2 of diadiem) {
                    diadiemtext = await element2.getText()
               }
               for (element of benmoithau) {
                    let text = await element.getText();
                    if (text.includes('Ngày đăng tải thông báo :')) {
                         ngaydangtaithongbaotext = await text.slice(25)
                    }
                    if (text.includes('Thời gian sửa TBMT :')) {
                         ngaydangtaithongbaotext = await text.slice(19)
                    }
                    if (text.includes('Chủ đầu tư :') || text.includes('Bên mời thầu :') && !text.includes('Chủ đầu tư/ Bên mời thầu :')) {
                         if (text.includes('Chủ đầu tư:')) {
                              nhadaututext = await text.slice(11)
                         }
                         if (text.includes('Bên mời thầu :')) {
                              benmoithautext = await text.slice(13)
                         }
                    }
                    if (text.includes('Chủ đầu tư/ Bên mời thầu :')) {
                         const arrString1 = await text.split('/')
                         const arrStringSub1 = await arrString1[1].split(":")
                         nhadaututext = await arrStringSub1[1]
                         benmoithautext = await arrStringSub1[1]
                    }
               }
               let Modalthoidiemdongthauvahinhthucthau = await ModalRow.findElement(By.className('col-md-2 content__body__right__item__infor__contract'))
               let contentthoidiemdongthauhinhthucduthau = await Modalthoidiemdongthauvahinhthucthau.findElements(By.css('h5'))
               let hanban = await contentthoidiemdongthauhinhthucduthau[1].getText() + " " + await contentthoidiemdongthauhinhthucduthau[0].getText();
               let hinhthucduthau = await contentthoidiemdongthauhinhthucduthau[2].getText();
               let URL = await link.getAttribute('href')
               let tengoithautext = await tengoithau.getText()
               var SoTBMTData = await TBMT.getText();
               var tenData = await tengoithautext;
               var benmoithauData = await benmoithautext;
               var nhadautuData = await nhadaututext;
               var hinhthucData = await hinhthucduthau;
               var thoidiemdangData = await ngaydangtaithongbaotext;
               var hanbanData = await hanban;
               var urlremoteData = await URL;
               var trangthaigoithautext = await trangthaigoithau.getText();
               const object = await {
                    TBMT: SoTBMTData,
                    name: tenData,
                    trangthaigoithau: trangthaigoithautext,
                    benmoithau: benmoithauData,
                    nhadautu: nhadautuData,
                    hinhthuc: hinhthucData,
                    diadiem: diadiemtext,
                    thoidiemdang: thoidiemdangData,
                    hanban: hanbanData,
                    url: urlremoteData
               }
               if (await checkListPackage(object.TBMT.slice(10)) === true) {
                    console.log('Đã có gối thầu này:' + object.TBMT.slice(10))
               } else {
                    console.log('Đã insert vào:' + object.TBMT.slice(10))
                    const ketqua = await insertListPackage(object.TBMT.slice(10), object.thoidiemdang, object.trangthaigoithau, object.diadiem);
                    console.log(ketqua)
               }
               //await arr2.push(object)
          }
     } catch (err) {
          console.log(err)
          console.log('Thất bại đang tiến hành cào lại dữ liệu')
          crawData()
     }
     finally {
          await driver.quit();
          return arr2;
     }
}


module.exports = {};
