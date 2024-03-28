const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { checkListPackage, insertListPackage } = require("./database/ListContractorsController")
const { Driver } = require("selenium-webdriver/chrome");


async function crawDataServer() {
     // launch the browser
     const arr2 = []
     let driver = await new Builder().forBrowser("chrome").build();
     try {
          await driver.get("https://muasamcong.mpi.gov.vn/");
          await driver.manage().window().maximize();
          await new Promise(resolve => setTimeout(resolve, 5000));
          let closeButton = await driver.findElement(By.id('popup-close'));
          await closeButton.click();
          let inputSearch = await driver.wait(until.elementLocated(By.name('keyword')), 100000);
          await inputSearch.clear()
          await inputSearch.sendKeys('Trợ lý ảo');
          let searchButton = await driver.findElement(By.className('search-button'));
          await searchButton.click();
          await new Promise(resolve => setTimeout(resolve, 5000));
          let selectElement = await driver.findElement(By.css('select'));
          let Element = await selectElement.findElement(By.css('option[value="50"]'))
          await driver.executeScript("arguments[0].value = '100';", Element);
          await Element.click();
          await new Promise(resolve => setTimeout(resolve, 20000));
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
               arr2.push(object)
          }
     } catch (err) {
          console.log(err)
          console.log('Thất bại đang tiến hành cào lại dữ liệu')
          crawData()
     }
     finally {
          await driver.quit();
          console.log(arr2)
          return arr2;
     }
}


crawDataServer()
module.exports = {};
