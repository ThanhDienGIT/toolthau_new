const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { Driver } = require("selenium-webdriver/chrome");
const {
  KiemTraTonTaiGoi,
  ThemGoiThau,
  TestADDSQL,
  selectDanhSachGoiThau,
} = require("./sql/DanhSachGoiThau");
const { Telegraf } = require("telegraf");
const { send_Test } = require("../FuncMain/sendMessage");
const bot = new Telegraf("6500184315:AAFDpDzHBE1AJmo9lut3AWtNJzvH35UJXfE", {
  handlerTimeout: 600000,
});

const convertString = (string) => {
  const array = string.split("/");
  return array[2] + "-" + array[1] + "-" + array[0];
};

const insert = async (data) => {
  const result = await ThemGoiThau(
    data.MA_TBMT,
    data.TENGOITHAU,
    data.BENMOITHAU,
    data.CHUDAUTU,
    data.NGAYDANGTAITHONGBAOTEXT,
    data.NGAYDANGTAITHONGBAO,
    data.LINHVUC,
    data.DIADIEM,
    data.THOIDIEMDONGTHAU,
    data.HINHTHUCDUTHAU,
    data.NHATRUNGTHAU,
    data.GIATRUNGTHAU,
    data.NGAYPHEDUYETKQLCNT,
    data.TRANGTHAIGOITHAU,
    data.URL
  );
  return result;
};

const today = new Date();

const formatgetToDay = () => {
  const ngay =
    today.getDate() > 9 ? today.getDate() : "0" + String(today.getDate());
  const thang =
    today.getMonth() + 1 > 9
      ? today.getMonth() + 1
      : "0" + String(today.getMonth() + 1);
  const nam = today.getFullYear();
  return ngay + "/" + thang + "/" + nam;
};

const objectNgay = {
  ngaybatdau: "12/06/2024",
  ngayketthuc: "21/06/2024",
  sodong: 3000,
};

const sendKeyToGetFuntionFollowWant = async (keyVaklue, idbot, idsend) => {
  if (keyVaklue === "GETDANHSACH") {
    GetListPackageEveryDay(idbot, idsend);
  }
};

const conFig = {
  sodong: 50,
  sotrang: 200,
};

// Hàm lấy gói thầu hàng ngày
const GetListPackageEveryDay = async (botSend, IdSend) => {
  console.log("Start");
  const capabilities = Capabilities.chrome();
  capabilities.set("goog:chromeOptions", {
    excludeSwitches: ["enable-automation"],
  });
  const options = new chrome.Options();
  options.addArguments(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--profile-directory=Default");
  let driver = await new Builder()
    .withCapabilities(capabilities)
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    console.log("open site");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await driver.get(
      "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?render=index"
    );
    await driver.manage().window().maximize();
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // let closeButton = await driver.wait(
    //   until.elementLocated(By.id("popup-close")),
    //   100000
    // );
    //await closeButton.click();

    // Đợi load trang

    // // Nút tìm kiếm nâng cao
    // const timkiemnangcao = await driver.wait(
    //   until.elementLocated(By.className("content__search__body__sub")),
    //   100000
    // );
    // await timkiemnangcao.click();

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // const activeItem = await driver.findElement(By.className('content__body__left__nav'))
    // const navItem = await activeItem.findElements(By.tagName('li'));

    // for(const item of navItem){
    //     console.log(await item.getText())
    //     const textItem = await item.getText();
    //     if(textItem.includes('Chưa đóng thầu')){
    //        await item.click()
    //        break;
    //     }
    // }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    //  Chọn xổ n dòng
    let selectElement = await driver.findElement(By.css("select"));
    let Element = await selectElement.findElement(By.css('option[value="50"]'));
    await driver.executeScript(
      `arguments[0].value = '${conFig.sodong}';`,
      Element
    );
    await Element.click();
    console.log(`Đã chọn xổ ${conFig.sodong} dòng`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    var j = 1;
    var tongsogoithaudalay = 0
    var goithauHauGiang = 0;
    for (var i = 0; i < conFig.sotrang; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const arrayLi = await driver.findElements(By.className("number"));
      const arrayFor = arrayLi.slice(0, arrayLi.length / 2);
      for (var item of arrayFor) {
        const ItemNumber = await item.getText();

        if (Number(ItemNumber) === i + 1) {
          console.log(i + 1);
          console.log("Đã click vào phần tử", ItemNumber);
          await item.click();
          await new Promise((resolve) => setTimeout(resolve, 3000));

          let dulieucao = await driver.wait(
            until.elementsLocated(
              By.className("content__body__left__item__infor")
            ),
            100000
          );
          for (let el of dulieucao) {
            let ModalTBMT = await el.findElement(
              By.className("d-flex justify-content-between align-items-center")
            );
            let TBMT = await ModalTBMT.findElement(
              By.className("content__body__left__item__infor__code")
            );
            let trangthaigoithau = await ModalTBMT.findElement(By.css("span"));
            let ModalRow = await el.findElement(By.className("row"));
            let ModalTenGoiThau = await ModalRow.findElement(
              By.className(
                "col-md-8 content__body__left__item__infor__contract"
              )
            );
            let link = await ModalTenGoiThau.findElement(By.css("a"));
            let tengoithau = await ModalTenGoiThau.findElement(
              By.className(
                "content__body__left__item__infor__contract__name format__text__title"
              )
            );
            let ModalRowIncontract = await ModalTenGoiThau.findElement(
              By.className("row")
            );
            let ModalBenMoiThauVaNgayDangTaiThongBao =
              await ModalRowIncontract.findElement(
                By.className(
                  "col-md-8 content__body__left__item__infor__contract__other format__text"
                )
              );
            let benmoithau =
              await ModalBenMoiThauVaNgayDangTaiThongBao.findElements(
                By.css("h6")
              );
            let diadiem = await ModalTenGoiThau.findElements(
              By.className("format__text__title")
            );
            let diadiemtext = "";
            for (element2 of diadiem) {
              diadiemtext = await element2.getText();
            }
            let Modalthoidiemdongthauvahinhthucthau =
              await ModalRow.findElement(
                By.className(
                  "col-md-2 content__body__right__item__infor__contract"
                )
              );

            const divLinhVuc = await el.findElement(
              By.className(
                "col-md-4 content__body__left__item__infor__contract__other"
              )
            );

            const divh6 = await divLinhVuc.findElement(By.tagName("h6"));

            const linhvucData = await divh6.getText();

            let contentthoidiemdongthauhinhthucduthau =
              await Modalthoidiemdongthauvahinhthucthau.findElements(
                By.css("h5")
              );
            let hanban =
              (await contentthoidiemdongthauhinhthucduthau[1].getText()) +
              " " +
              (await contentthoidiemdongthauhinhthucduthau[0].getText());
            let hinhthucduthau =
              await contentthoidiemdongthauhinhthucduthau[2].getText();
            let URL = await link.getAttribute("href");
            let tengoithautext = await tengoithau.getText();
            var SoTBMTData = await TBMT.getText();
            var tenData = await tengoithautext;
            var hinhthucData = await hinhthucduthau;
            var hanbanData = await hanban;
            var urlremoteData = await URL;
            var trangthaigoithautext = await trangthaigoithau.getText();
            var nhatrungthaudata = [];
            var dataChuDauTuText = "";
            var dataBenMoiThauText = "";
            var dataNgayDangTaiThongBaoText = "";
            for (const itemBenMoiThau of benmoithau) {
              const dataText = await itemBenMoiThau.getText();
              if (dataText.includes("Bên mời thầu")) {
                dataBenMoiThauText = dataText.slice(15);
              }
              if (dataText.includes("Chủ đầu tư")) {
                dataChuDauTuText = dataText.slice(13);
              }
              if (dataText.includes("Ngày đăng tải thông báo")) {
                dataNgayDangTaiThongBaoText = dataText.slice(26);
              }
              if (dataText.includes("Thời gian sửa TBMT")) {
                dataNgayDangTaiThongBaoText = dataText.slice(21);
              }
            }
            var datatennhatrungthau = "";
            var datagiatrungthau = "";
            var datangaypheduyet = "";
            if (trangthaigoithautext === "Có nhà thầu trúng thầu") {
              try {
                let nhatrungthau = el.findElement(
                  By.className(
                    "p-0 content__body__right__item__infor__contract__right"
                  )
                );
                nhatrungthaudata = await nhatrungthau.getText();
                const arrayNhatrungThauSplit = nhatrungthaudata.split("\n");
                datatennhatrungthau = arrayNhatrungThauSplit[1];
                datagiatrungthau = arrayNhatrungThauSplit[3];
                datangaypheduyet = arrayNhatrungThauSplit[5];
              } catch (err) {}
            }
            const object = {
              MA_TBMT: SoTBMTData.slice(10),
              TENGOITHAU: tenData,
              BENMOITHAU: dataBenMoiThauText,
              CHUDAUTU: dataChuDauTuText,
              HINHTHUCDUTHAU: hinhthucData,
              DIADIEM: diadiemtext.slice(11),
              LINHVUC: linhvucData.slice(11),
              NGAYDANGTAITHONGBAOTEXT: dataNgayDangTaiThongBaoText,
              NGAYDANGTAITHONGBAO: new Date(
                convertString(dataNgayDangTaiThongBaoText.slice(0, 10))
              ),
              THOIDIEMDONGTHAUTEXT: hanbanData,
              THOIDIEMDONGTHAU: new Date(
                convertString(hanbanData.slice(0, 10))
              ),
              URL: urlremoteData,
              TRANGTHAIGOITHAU: trangthaigoithautext,
              NHATRUNGTHAU: datatennhatrungthau,
              GIATRUNGTHAU: datagiatrungthau,
              NGAYPHEDUYETKQLCNT: datangaypheduyet,
            };

            if (object.DIADIEM.includes("Hậu Giang")) {
              let strMessage = `Số TBMT: *${object.MA_TBMT}* \n`;
              strMessage += `Tên: *${object.TENGOITHAU.toString().toUpperCase()}* \n`;
              strMessage += `Bên mời thầu: ${object.BENMOITHAU} \n`;
              strMessage += `Nhà đầu tư: ${object.CHUDAUTU} \n`;
              strMessage += `Hình thức: ${object.HINHTHUCDUTHAU} \n`;
              strMessage += `Thời điểm đăng: *${object.NGAYDANGTAITHONGBAOTEXT}* \n`;
              strMessage += `Hạn bán HSMT: *${object.THOIDIEMDONGTHAUTEXT}* \n`;
              url = object.URL;

              await send_Test(strMessage,1,url)
            }
            const result = await insert(object);
            if (result) {
              tongsogoithaudalay++;
              console.log("Thêm thành công gói thầu", object);
            } else {
              j++;
              console.log("Đã có gói thầu này", object);
            }
          }
          break;
        }
        if(Number(j) > 150){
          console.log('Dừng lấy gói thầu')
          break;
        }
        console.log("Chuyển đến phần tử tiếp theo");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
    await send_Test(`Đã lấy xong ngày ${formatgetToDay()} + Tổng gói thầu mới là : ${tongsogoithaudalay}`)
  } catch (err) {
    console.log(err);
    await send_Test("Lỗi đang chạy lại :" + err)
    GetListPackageEveryDay();
  } finally {
    driver.quit();
    console.log('end')
  }
};

const MainFunction = async () => {
  console.log("Start");
  const ArrayInsert = [];
  const capabilities = Capabilities.chrome();
  capabilities.set("goog:chromeOptions", {
    excludeSwitches: ["enable-automation"],
  });
  const options = new chrome.Options();
  options.addArguments(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--profile-directory=Default");
  let driver = await new Builder()
    .withCapabilities(capabilities)
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
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

    await new Promise((resolve) => setTimeout(resolve, 10000));

    //   Thao tác với dataPicker
    const datePicker = await driver.wait(
      until.elementsLocated(By.className("content__body__session")),
      100000
    );

    for (var element of datePicker) {
      if ((await element.getText()) === "Thời gian đăng tải") {
        const pick = await element.findElements(
          By.className("width_date_antdv")
        );
        const batdau = await pick[0];
        const ketthuc = await pick[1];
        console.log("Đã click vào datePicker bắt đầu");
        batdau.click();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const inputBatDau = await driver.findElement(
          By.className("ant-calendar-input")
        );

        await inputBatDau.sendKeys(objectNgay.ngaybatdau);

        console.log("Đã thao tác xong datapicker 1");
        console.log("Tiến hành thao tác datapicker 2");
        ketthuc.click();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const inputKetThuc = await driver.findElement(
          By.className("ant-calendar-input")
        );

        await inputKetThuc.sendKeys(objectNgay.ngayketthuc);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Bấm vào nút tìm kiếm
    const timkiem = await driver.findElements(
      By.className("content__footer__btn")
    );
    for (var item of timkiem) {
      if ((await item.getText()) === "Tìm kiếm") {
        await item.click();
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));

    //  Chọn xổ 10.000 dòng
    let selectElement = await driver.findElement(By.css("select"));
    let Element = await selectElement.findElement(By.css('option[value="20"]'));
    await driver.executeScript(
      `arguments[0].value = '${objectNgay.sodong}';`,
      Element
    );
    await Element.click();
    console.log(`Đã chọn xổ ${objectNgay.sodong} dòng`);

    await new Promise((resolve) => setTimeout(resolve, 20000));
    const ul = await driver.findElement(By.className("el-pager"));
    const li = await ul.findElements(By.className("number"));
    const arrayLoop = [];

    for (const item of li) {
      if ((await item.getText()) != 1 && (await item.getText()) != 2) {
      }
      arrayLoop.push(await item.getText());
    }
    console.log("arrayLoop", arrayLoop);
    var j = 1;
    for (var i = 0; i < arrayLoop.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const arrayLi = await driver.findElements(By.className("number"));
      const arrayFor = arrayLi.slice(0, arrayLi.length / 2);
      console.log("Chuyển đến phần tử :", arrayLoop[i]);
      for (var item of arrayFor) {
        const ItemNumber = await item.getText();

        if (Number(ItemNumber) === Number(arrayLoop[i])) {
          console.log("Đã click vào phần tử", ItemNumber);
          await item.click();

          await new Promise((resolve) => setTimeout(resolve, 20000));

          await FunctionMainDrawInsert(driver, j);

          break;
        }
        console.log("Chuyển đến phần tử tiếp theo");
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
    }
    // Cào dữ liệu
    const arrData = [];
    await bot.telegram.sendMessage(
      6073926430,
      `Đã lấy xong ${objectNgay.ngaybatdau} - ${objectNgay.ngayketthuc}`
    );
  } catch (err) {
    console.log(err);
    await bot.telegram.sendMessage(6073926430, "Lỗi đang chạy lại :" + err);
    GetListPackageEveryDay();
  } finally {
    driver.quit();
  }
  console.log("end");
};

module.exports = { sendKeyToGetFuntionFollowWant };
