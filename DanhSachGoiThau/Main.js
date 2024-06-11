const { Builder, By, until } = require("selenium-webdriver");
const { Driver } = require("selenium-webdriver/chrome");
const { KiemTraTonTaiGoi, ThemGoiThau } = require("./sql/DanhSachGoiThau");
const { Telegraf } = require("telegraf");
const bot = new Telegraf('6500184315:AAFDpDzHBE1AJmo9lut3AWtNJzvH35UJXfE', { handlerTimeout: 600000 });



const formatDate = (date) => {
  const data = new Date(date)
  const ngay = data.getDate();
  const thang = (data.getMonth()+1);
  const nam = data.getFullYear();
  return nam + "-" + thang + "-" + ngay;
}

const convertString = (string) => {
    const array = string.split("/")
    return array[2] + "-" + array[1] + '-' + array[0]
}




const insert = async  (data) => {
    const result = await ThemGoiThau(data.MA_TBMT,data.TENGOITHAU,data.BENMOITHAU,data.CHUDAUTU,data.NGAYDANGTAITHONGBAOTEXT,data.NGAYDANGTAITHONGBAO,data.LINHVUC,data.DIADIEM,
    data.THOIDIEMDONGTHAU,data.HINHTHUCDUTHAU,data.NHATRUNGTHAU,data.GIATRUNGTHAU,data.NGAYPHEDUYETKQLCNT,data.TRANGTHAIGOITHAU,data.URL)
    return result
}


const MainFunction = async () => {
  console.log("Start");
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    console.log("open site");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.get("https://muasamcong.mpi.gov.vn/");
    await driver.manage().window().maximize();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let closeButton = await driver.wait(
      until.elementLocated(By.id("popup-close")),
      100000
    );
    await closeButton.click();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Nút tìm kiếm nâng cao
    const timkiemnangcao = await driver.wait(
      until.elementLocated(By.className("content__search__body__sub")),
      100000
    );
    await timkiemnangcao.click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    //   Thao tác với dataPicker
    const datePicker = await driver.wait(
      until.elementsLocated(By.className("content__body__session")),
      100000
    );

    for (var element of datePicker) {
      console.log(await element.getText());
      if ((await element.getText()) === "Thời gian đăng tải") {
        const pick = await element.findElements(
          By.className("width_date_antdv")
        );
        const batdau = await pick[0];
        const ketthuc = await pick[1];
        console.log("Đã click vào datePicker bắt đầu");
        batdau.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const inputBatDau = await driver.findElement(By.className('ant-calendar-input'))
        await inputBatDau.sendKeys('01/01/2022');
        console.log("Đã thao tác xong datapicker 1");
        console.log('Tiến hành thao tác datapicker 2')
        ketthuc.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const inputKetThuc = await driver.findElement(By.className('ant-calendar-input'))
        await inputKetThuc.sendKeys('14/10/2022');
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Bấm vào nút tìm kiếm
    const timkiem = await driver.findElements(
      By.className("content__footer__btn")
    );
    for (var item of timkiem) {
      if ((await item.getText()) === "Tìm kiếm") {
        await item.click();
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    //  Chọn xổ 10.000 dòng
    let selectElement = await driver.findElement(By.css("select"));
    let Element = await selectElement.findElement(By.css('option[value="50"]'));
    await driver.executeScript("arguments[0].value = '8000';", Element);
    await Element.click();
    console.log("Đã chọn xổ 8000 dòng");

    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Cào dữ liệu
    const arrData = [];
    let dulieucao = await driver.findElements(
      By.className("content__body__left__item__infor")
    );
    var i = 1;
    console.time('thoigianget');
    for (let el of dulieucao) {
        console.log(i)
        i++
        let ModalTBMT = await el.findElement(By.className('d-flex justify-content-between align-items-center'))
        let TBMT = await ModalTBMT.findElement(By.className('content__body__left__item__infor__code'));
        let trangthaigoithau = await ModalTBMT.findElement(By.css('span'))
        let ModalRow = await el.findElement(By.className('row'))
        let ModalTenGoiThau = await ModalRow.findElement(By.className('col-md-8 content__body__left__item__infor__contract'))
        let link = await ModalTenGoiThau.findElement(By.css('a'))
        let tengoithau = await ModalTenGoiThau.findElement(By.className('content__body__left__item__infor__contract__name format__text__title'))
        let ModalRowIncontract = await ModalTenGoiThau.findElement(By.className('row'))
        let ModalBenMoiThauVaNgayDangTaiThongBao = await ModalRowIncontract.findElement(By.className('col-md-8 content__body__left__item__infor__contract__other format__text'))
        let benmoithau = await ModalBenMoiThauVaNgayDangTaiThongBao.findElements(By.css('h6'))
        let diadiem = await ModalTenGoiThau.findElements(By.className('format__text__title'))
        let diadiemtext = ''
        for (element2 of diadiem) {
             diadiemtext = await element2.getText()
        }
        let Modalthoidiemdongthauvahinhthucthau = await ModalRow.findElement(By.className('col-md-2 content__body__right__item__infor__contract'))
        let contentthoidiemdongthauhinhthucduthau = await Modalthoidiemdongthauvahinhthucthau.findElements(By.css('h5'))
        let hanban = await contentthoidiemdongthauhinhthucduthau[1].getText() + " " + await contentthoidiemdongthauhinhthucduthau[0].getText();
        let hinhthucduthau = await contentthoidiemdongthauhinhthucduthau[2].getText();
        let URL = await link.getAttribute('href')
        let tengoithautext = await tengoithau.getText()
        var SoTBMTData = await TBMT.getText();
        var tenData = await tengoithautext;
        var hinhthucData = await hinhthucduthau;
        var hanbanData = await hanban;
        var urlremoteData = await URL;
        var trangthaigoithautext = await trangthaigoithau.getText();
        var nhatrungthaudata = []
        var dataChuDauTuText = ''
        var dataBenMoiThauText= ''
        var dataNgayDangTaiThongBaoText = ''
        for (const itemBenMoiThau of benmoithau){
             const dataText = await itemBenMoiThau.getText()
             if(dataText.includes('Bên mời thầu')){
                  dataBenMoiThauText = dataText.slice(15)
             }
             if(dataText.includes('Chủ đầu tư')){
                  dataChuDauTuText = dataText.slice(13)
             }
             if(dataText.includes('Ngày đăng tải thông báo')){
                  dataNgayDangTaiThongBaoText = dataText.slice(26)
             }
             if(dataText.includes('Thời gian sửa TBMT')){
                  dataNgayDangTaiThongBaoText = dataText.slice(21)
             }
        }
        var datatennhatrungthau =''
        var datagiatrungthau = ''
        var datangaypheduyet = ''
        if(trangthaigoithautext === 'Có nhà thầu trúng thầu'){
          try{
               let nhatrungthau = el.findElement(By.className('p-0 content__body__right__item__infor__contract__right'));
               nhatrungthaudata = await nhatrungthau.getText()
               const arrayNhatrungThauSplit = nhatrungthaudata.split("\n")
               datatennhatrungthau = arrayNhatrungThauSplit[1]
               datagiatrungthau = arrayNhatrungThauSplit[3]
               datangaypheduyet = arrayNhatrungThauSplit[5]
             }catch(err){}
        }
      const object = {
          MA_TBMT: SoTBMTData,
          TENGOITHAU: tenData,
          BENMOITHAU: dataBenMoiThauText,
          CHUDAUTU: dataChuDauTuText,
          HINHTHUCDUTHAU: hinhthucData,
          DIADIEM: diadiemtext.slice(11),
          NGAYDANGTAITHONGBAOTEXT: dataNgayDangTaiThongBaoText,
          NGAYDANGTAITHONGBAO: new Date(convertString(dataNgayDangTaiThongBaoText.slice(0,10))),
          THOIDIEMDONGTHAUTEXT: hanbanData,
          THOIDIEMDONGTHAU: new Date(convertString(hanbanData.slice(0,10))),
          URL: urlremoteData,
          TRANGTHAIGOITHAU: trangthaigoithautext,
          NHATRUNGTHAU: datatennhatrungthau,
          GIATRUNGTHAU: datagiatrungthau,
          NGAYPHEDUYETKQLCNT: datangaypheduyet
     }
     console.log(object)
    //  send mess
     if(object.DIADIEM.includes("Hậu Giang")){
      let strMessage = `Số TBMT: *${object.MA_TBMT.slice(9, 21)}* \n`;
        strMessage += `Tên: *${object.TENGOITHAU.toString().toUpperCase()}* \n`;
        strMessage += `Bên mời thầu: ${object.BENMOITHAU} \n`;
        strMessage += `Nhà đầu tư: ${object.CHUDAUTU} \n`;
        strMessage += `Hình thức: ${object.HINHTHUCDUTHAU} \n`;
        strMessage += `Thời điểm đăng: *${object.NGAYDANGTAITHONGBAOTEXT}* \n`;
        strMessage += `Hạn bán HSMT: *${object.THOIDIEMDONGTHAUTEXT}* \n`;
        url = object.URL

        await bot.telegram.sendMessage(6073926430, strMessage ,{
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "Xem gói thầu", url }]],
          },
        })

     }

     const check = await KiemTraTonTaiGoi(object.MA_TBMT);
     if(check.recordset[0].DataExists === 'true'){
       console.log('Đã có:' + object.MA_TBMT)
     }else{
       const result = await insert(object);
       console.log(result)
     }
   }
   console.timeEnd("thoigianget")
   await bot.telegram.sendMessage(6073926430, "Đã lấy xong")

  } catch (err) {
    console.log(err);
  } finally {
    //toolDriver.quit()
  }
  console.log("end");
};

MainFunction();

