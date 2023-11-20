const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function crawData() {
    // launch the browser
    const arr2 = []
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("https://muasamcong.mpi.gov.vn/web/guest/home");
        let closeButton = await driver.findElement(By.id('popup-close'));
        await new Promise(resolve => setTimeout(resolve, 1000));
        await closeButton.click();
        let searchButton = await driver.findElement(By.className('content__search__body__sub'));
        await searchButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        let multiSelect = await driver.findElement(By.className('ant-select-selection--multiple'));
        await multiSelect.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        let elements = await driver.findElements(By.className('ant-select-dropdown-menu-item'));
        for (let element of elements) {
            let outerHTML = await element.getAttribute('outerHTML');
            if (outerHTML.includes('Tỉnh Hậu Giang')) {
                await element.click();
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        let search = await driver.findElements(By.className('content__footer__btn'));
        for (let element of search) {
            let outerHTML = await element.getAttribute('outerHTML');
            if (outerHTML.includes('Tìm kiếm')) {
                await element.click();
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
        let elements2 = await driver.findElements(By.className('content__body__left__item__infor__contract__name format__text__title'));
        for (let element of elements2) {
            let outerHTML = await element.getText();
        }
        let tongsogoithau = await driver.findElement(By.className('text__size text__size__label'));
        var tongso = await tongsogoithau.getText()
        let selectElement = await driver.findElement(By.css('select'));
        await selectElement.findElement(By.css('option[value="50"]')).click();
        const sotrang = Math.ceil(Number(tongso.split(' ')[2]) / 50)
        await new Promise(resolve => setTimeout(resolve, 2000));
        for (i = 1; i <= 2; i++) {
            let itemTrang = await driver.findElements(By.className('number'));
            await new Promise(resolve => setTimeout(resolve, 2000));
            const arr = await itemTrang.slice(0,itemTrang.length / 2)
            for (let element of arr) {
                const ele = await element.getText()
                if (await Number(ele) === Number(i)) {
                    await element.click()
                }
            }
                await new Promise(resolve => setTimeout(resolve, 3000));
                let dulieucao = await driver.findElements(By.className('content__body__left__item__infor'));
                for (let el of dulieucao) {
                    let ModalTBMT = await el.findElement(By.className('d-flex justify-content-between align-items-center'))
                    let TBMT = await ModalTBMT.findElement(By.className('content__body__left__item__infor__code'));
                  
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
                    for (element of benmoithau) {
                        let text = await element.getText();
                        if (text.includes('Ngày đăng tải thông báo:')) {
                            ngaydangtaithongbaotext = await text.slice(24)
                        }
                        if (text.includes('Thời gian sửa TBMT:')) {
                            ngaydangtaithongbaotext = await text.slice(19)
                        }
                        if (text.includes('Chủ đầu tư:') || text.includes('Bên mời thầu:') && !text.includes('/ Bên mời thầu:')) {
                            if (text.includes('Chủ đầu tư:')) {
                                nhadaututext = await text.slice(11)
                            }
                            if (text.includes('Bên mời thầu:')) {
                                benmoithautext = await text.slice(13)
                            }
                        }
                        if (text.includes('Chủ đầu tư/ Bên mời thầu:')) {
                            nhadaututext = await text.slice(25)
                            benmoithautext = await text.slice(25)
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
                    var hinhthucData =  await hinhthucduthau;
                    var thoidiemdangData = await ngaydangtaithongbaotext;
                    var hanbanData = await hanban;
                    var urlremoteData =await  URL;
                    const object = await {
                        TBMT:SoTBMTData,
                        name:tenData,
                        benmoithau:benmoithauData,
                        nhadautu:nhadautuData,
                        hinhthuc:hinhthucData,
                        thoidiemdang:thoidiemdangData,
                        hanban:hanbanData,
                        url:urlremoteData
                    }
                    await arr2.push(object)
                }
        }
        
    } catch(err){
        console.log('Thất bại đang tiến hành cào lại dữ liệu')
        crawData()
    }
    finally {
        await driver.quit();
        return arr2;
    }
}


module.exports = crawData;
