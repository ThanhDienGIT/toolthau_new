const { send_Test } = require("./sendMessage");
const { sendKeyToGetFuntionFollowWant } = require("../DanhSachGoiThau/Main");
const TokenStorage = require("./TokenStorage");
const storeData = new TokenStorage();
const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {
  KiemTraTonTaiGoi,
  ThemGoiThau,
  TestADDSQL,
  selectDanhSachGoiThau,
} = require("../DanhSachGoiThau/sql/DanhSachGoiThau");

const today = new Date();

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

var checkToolLoi = 1;
var ThoiGianCho = 3000;

const MainFunction = async () => {
  send_Test(
    "Start",
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear()
  );

  // Khởi chạy
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

  // Bắt đầu chạy

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    await driver.get(
      "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?render=index"
    );
    await driver.manage().window().maximize();
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    let selectElement = await driver.findElement(By.css("select"));
    let Element = await selectElement.findElement(By.css('option[value="50"]'));
    await Element.click();

    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    var tongsogoithaudalay = 0;
    var j = 0;
    for (var i = 1; i <= 200; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, ThoiGianCho * checkToolLoi)
      );
      await driver.wait(
        until.elementsLocated(By.className("number")),
        ThoiGianCho * checkToolLoi
      );
      const arrayLi = await driver.findElements(By.className("number"));
      const arrayFor = arrayLi.slice(0, arrayLi.length / 2);

      console.log("arrayFor", arrayFor);

      for (var item of arrayFor) {
        const ItemNumber = await item.getText();
        console.log("ItemNumber", ItemNumber);
        console.log("i", i);
        if (Number(ItemNumber) === i) {
          console.log(i);
          console.log("Đã click vào phần tử", ItemNumber);
          await item.click();
          await new Promise((resolve) =>
            setTimeout(resolve, ThoiGianCho * checkToolLoi)
          );
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

            console.log("object", object);
            console.log("object", object.DIADIEM);

            tongsogoithaudalay++;
            console.log("tongsogoithaudalay", tongsogoithaudalay);
            const result = await insert(object);
            if (result) {
              tongsogoithaudalay++;
              console.log("Thêm thành công gói thầu", object);
              if (object.DIADIEM.includes("Hậu Giang")) {
                let strMessage = `Số TBMT: *${object.MA_TBMT}* \n`;
                strMessage += `Tên: *${object.TENGOITHAU.toString().toUpperCase()}* \n`;
                strMessage += `Bên mời thầu: ${object.BENMOITHAU} \n`;
                strMessage += `Nhà đầu tư: ${object.CHUDAUTU} \n`;
                strMessage += `Hình thức: ${object.HINHTHUCDUTHAU} \n`;
                strMessage += `Thời điểm đăng: *${object.NGAYDANGTAITHONGBAOTEXT}* \n`;
                strMessage += `Hạn bán HSMT: *${object.THOIDIEMDONGTHAUTEXT}* \n`;
                url = object.URL;

                await send_GroupThau(strMessage, 1, url);
              }
            } else {
              j++;
              console.log("Đã có gói thầu này", object);
            }
            console.log(result);
          }
          await new Promise((resolve) =>
            setTimeout(resolve, ThoiGianCho * checkToolLoi)
          );
          break;
        }
        console.log("Chuyển đến phần tử tiếp theo");
      }
    }
  } catch (err) {
    driver.quit();
    checkToolLoi++;

    if (checkToolLoi <= 5) {
      send_Test(`Lỗi : tool đang chạy lại lần thứ ${checkToolLoi}`, 0);
      MainFunction_HG();
      console.log(err);
    } else {
      send_Test(`Lỗi : tool 4 lần hủy bỏ chạy`, 0);
    }
  } finally {
    send_Test(
      `Đã chạy xong với số lần lỗi là ${checkToolLoi} và thời gian chờ lỗi là ${today.getDate()} - ${today.getMonth()} - ${today.getFullYear()}`,
      0
    );
    driver.quit();
  }
};

const MainFunction_HG = async () => {
  send_Test(
    "Start",
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear()
  );

  // Khởi chạy
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

  // Bắt đầu chạy

  try {
    await driver.get("https://muasamcong.mpi.gov.vn/");
    await driver.manage().window().maximize();
    let closeButton = await driver.findElement(By.id("popup-close"));
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    await closeButton.click();
    let searchButton = await driver.findElement(
      By.className("content__search__body__sub")
    );
    await searchButton.click();
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    let multiSelect = await driver.findElements(
      By.className("ant-select-selection--multiple")
    );
    await multiSelect[1].click();
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );

    let elements = await driver.findElements(
      By.className("ant-select-dropdown-menu-item")
    );
    for (let element of elements) {
      let outerHTML = await element.getAttribute("outerHTML");
      if (outerHTML.includes("Tỉnh Hậu Giang")) {
        await element.click();
      }
    }
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    let search = await driver.findElements(
      By.className("content__footer__btn")
    );
    for (let element of search) {
      let outerHTML = await element.getAttribute("outerHTML");
      if (outerHTML.includes("Tìm kiếm")) {
        await element.click();
      }
    }
    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    let selectElement = await driver.findElement(By.css("select"));
    let Element = await selectElement.findElement(By.css('option[value="50"]'));
    await Element.click();

    await new Promise((resolve) =>
      setTimeout(resolve, ThoiGianCho * checkToolLoi)
    );
    var tongsogoithaudalay = 0;
    var j = 0;
    for (var i = 1; i <= 200; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, ThoiGianCho * checkToolLoi)
      );
      await driver.wait(
        until.elementsLocated(By.className("number")),
        ThoiGianCho * checkToolLoi
      );
      const arrayLi = await driver.findElements(By.className("number"));
      const arrayFor = arrayLi.slice(0, arrayLi.length / 2);

      console.log("arrayFor", arrayFor);

      for (var item of arrayFor) {
        const ItemNumber = await item.getText();
        console.log("ItemNumber", ItemNumber);
        console.log("i", i);
        if (Number(ItemNumber) === i) {
          console.log(i);
          console.log("Đã click vào phần tử", ItemNumber);
          await item.click();
          await new Promise((resolve) =>
            setTimeout(resolve, ThoiGianCho * checkToolLoi)
          );
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

            console.log("object", object);
            console.log("object", object.DIADIEM);

            tongsogoithaudalay++;
            console.log("tongsogoithaudalay", tongsogoithaudalay);
            const result = await insert(object);
            if (result) {
              tongsogoithaudalay++;
              console.log("Thêm thành công gói thầu", object);
              if (object.DIADIEM.includes("Hậu Giang")) {
                let strMessage = `Số TBMT: *${object.MA_TBMT}* \n`;
                strMessage += `Tên: *${object.TENGOITHAU.toString().toUpperCase()}* \n`;
                strMessage += `Bên mời thầu: ${object.BENMOITHAU} \n`;
                strMessage += `Nhà đầu tư: ${object.CHUDAUTU} \n`;
                strMessage += `Hình thức: ${object.HINHTHUCDUTHAU} \n`;
                strMessage += `Thời điểm đăng: *${object.NGAYDANGTAITHONGBAOTEXT}* \n`;
                strMessage += `Hạn bán HSMT: *${object.THOIDIEMDONGTHAUTEXT}* \n`;
                url = object.URL;
                await send_GroupThau(strMessage, 1, url);
              }
            } else {
              j++;
              console.log("Đã có gói thầu này", object);
            }
            console.log(result);
          }
          await new Promise((resolve) =>
            setTimeout(resolve, ThoiGianCho * checkToolLoi)
          );
          break;
        }
        console.log("Chuyển đến phần tử tiếp theo");
      }
    }
  } catch (err) {
    driver.quit();
    checkToolLoi++;

    if (checkToolLoi <= 5) {
      send_Test(`Lỗi : tool đang chạy lại lần thứ ${checkToolLoi}`, 0);
      MainFunction_HG();
      console.log(err);
    } else {
      send_Test(`Lỗi : tool 4 lần hủy bỏ chạy`, 0);
    }
  } finally {
    send_Test(
      `Đã chạy xong với số lần lỗi là ${checkToolLoi} và thời gian chờ lỗi là ${today.getDate()} - ${today.getMonth()} - ${today.getFullYear()}`,
      0
    );
    driver.quit();
  }
};

const Func_ChiDinhTool = (status) => {
  // Nếu = 1 là row toàn bộ, 0 là row Hậu Giang

  if (status == 1) {
    MainFunction();
  }

  if (status == 0) {
    MainFunction_HG();
  }
};

module.exports = { Func_ChiDinhTool };