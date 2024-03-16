const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { getAllData, insertThauNew, checkThauExistsNew } = require("./database/dulieu_thau")
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
    // Remove punctuationsl
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}

const Arrnew = [
    "IB2300296113",
    "IB2300220089",
    "IB2300193120",
    "IB2300173405",
    "IB2300013819",
    "IB2200065156",
    "IB2200039103",
    "IB2200047288",
    "IB2300346143",
    "IB2300344951",
    "IB2300327826",
    "IB2300331438",
    "IB2300328009",
    "IB2300323011",
    "IB2300321647",
    "IB2300317998",
    "IB2300305254",
    "IB2300310335",
    "IB2300305001",
    "IB2300302200",
    "IB2300299502",
    "IB2300298379",
    "IB2300291392",
    "IB2300295704",
    "IB2300289920",
    "IB2300293666",
    "IB2300278535",
    "IB2300289662",
    "IB2300288941",
    "IB2300279948",
    "IB2300284018",
    "IB2300284605",
    "IB2300283400",
    "IB2300280977",
    "IB2300280890",
    "IB2300279182",
    "IB2300265029",
    "IB2300276706",
    "IB2300275462",
    "IB2300269186",
    "IB2300269049",
    "IB2300270990",
    "IB2300265364",
    "IB2300269258",
    "IB2300262017",
    "IB2300257925",
    "IB2300264292",
    "IB2300261072",
    "IB2300260919",
    "IB2300260628",
    "IB2300252231",
    "IB2300254526",
    "IB2300252930",
    "IB2300252089",
    "IB2300250411",
    "IB2300250363",
    "IB2300247715",
    "IB2300246495",
    "IB2300240269",
    "IB2300234969",
    "IB2300233465",
    "IB2300230388",
    "IB2300228109",
    "IB2300212892",
    "IB2300221940",
    "IB2300207266",
    "IB2300208227",
    "IB2300201020",
    "IB2300204433",
    "IB2300196163",
    "IB2300200920",
    "IB2300196638",
    "IB2300197678",
    "IB2300195484",
    "IB2300191734",
    "IB2300190950",
    "IB2300190284",
    "IB2300151450",
    "IB2300150171",
    "IB2300090157",
    "IB2300175230",
    "IB2300169184",
    "IB2300170420",
    "IB2300170085",
    "IB2300169544",
    "IB2300167447",
    "IB2300157998",
    "IB2300158721",
    "IB2300132946",
    "IB2300118181",
    "IB2300108717",
    "IB2300119687",
    "IB2300114691",
    "IB2300117451",
    "IB2300113955",
    "IB2300110288",
    "IB2300089212",
    "IB2300075194",
    "IB2300101987",
    "IB2300100853",
    "IB2300093152",
    "IB2300051236",
    "IB2300089114",
    "IB2300086139",
    "IB2300085838",
    "IB2300080939",
    "IB2300079966",
    "IB2300076076",
    "IB2300075504",
    "IB2300025067",
    "IB2300055013",
    "IB2300054092",
    "IB2300045705",
    "IB2300030449",
    "IB2300030058",
    "IB2300023302",
    "IB2300020579",
    "IB2300022995",
    "IB2300022380",
    "IB2300019892",
    "IB2300016481",
    "IB2300009348",
    "IB2300002459",
    "IB2200106420",
    "IB2200088430",
    "IB2200101708",
    "IB2200101904",
    "IB2200100721",
    "IB2200099571",
    "IB2200098713",
    "IB2200098730",
    "IB2200097326",
    "IB2200097037",
    "IB2200095969",
    "IB2200091902",
    "IB2200093693",
    "IB2200092947",
    "IB2200092426",
    "IB2200090267",
    "IB2200067253",
    "IB2200088072",
    "IB2200071975",
    "IB2200057323",
    "IB2200084133",
    "IB2200084062",
    "IB2200085005",
    "IB2200081266",
    "IB2200083951",
    "IB2200079017",
    "IB2200083420",
    "IB2200083041",
    "IB2200082404",
    "IB2200082698",
    "IB2200062507",
    "IB2200057398",
    "IB2200081778",
    "IB2200072695",
    "IB2200080911",
    "IB2200080338",
    "IB2200080477",
    "IB2200080305",
    "IB2200079773",
    "IB2200078689",
    "IB2200078671",
    "IB2200074700",
    "IB2200076627",
    "IB2200075717",
    "IB2200073610",
    "IB2200075055",
    "IB2200074724",
    "IB2200074171",
    "IB2200073401",
    "IB2200071385",
    "IB2200070766",
    "IB2200070463",
    "IB2200070353",
    "IB2200069812",
    "IB2200070057",
    "IB2200069777",
    "IB2200069045",
    "IB2200066190",
    "IB2200066166",
    "IB2200065894",
    "IB2200062314",
    "IB2200058925",
    "IB2200063545",
    "IB2200063312",
    "IB2200061605",
    "IB2200060126",
    "IB2200059975",
    "IB2200058788",
    "IB2200059747",
    "IB2200056100",
    "IB2200057488",
    "IB2200055495",
    "IB2200054407",
    "IB2200054518",
    "IB2200053718",
    "IB2200038715",
    "IB2200050356",
    "IB2200050642",
    "IB2200010543",
    "IB2200049643",
    "IB2200046253",
    "IB2200042663",
    "IB2200041759",
    "IB2200040415",
    "IB2200036058",
    "IB2200037012",
    "IB2200032874",
    "IB2200033774",
    "IB2200029817",
    "IB2200030759",
    "IB2200025809",
    "IB2200023867",
    "IB2200029349",
    "IB2200028027",
    "IB2200020771",
    "IB2200025539",
    "IB2200016293",
    "IB2200022007",
    "IB2200019457",
    "IB2200016838",
    "IB2200017404",
    "IB2200013729",
    "IB2200012950",
    "IB2200008215",
    "IB2200010039",
    "IB2200002680",
    "IB2200005012",
    "IB2200002195",
    "IB2200002266",
    "IB2300319175",
    "IB2300313443",
    "IB2300299114",
    "IB2300300123",
    "IB2300299394",
    "IB2300276947",
    "IB2300250704",
    "IB2300232561",
    "IB2300244497",
    "IB2300235010",
    "IB2300218344",
    "IB2300218398",
    "IB2300229082",
    "IB2300206785",
    "IB2300214122",
    "IB2300215742",
    "IB2300211616",
    "IB2300211574",
    "IB2300207406",
    "IB2300208901",
    "IB2300194944",
    "IB2300176302",
    "IB2300179859",
    "IB2300163518",
    "IB2300154938",
    "IB2300150202",
    "IB2300156067",
    "IB2300141777",
    "IB2300127458",
    "IB2300116818",
    "IB2300124138",
    "IB2300126708",
    "IB2300070698",
    "IB2300120633",
    "IB2300117498",
    "IB2300116719",
    "IB2300111261",
    "IB2300107797",
    "IB2300090001",
    "IB2300094959",
    "IB2300092671",
    "IB2300088234",
    "IB2300083731",
    "IB2300083850",
    "IB2300081917",
    "IB2300080103",
    "IB2300079663",
    "IB2300077724",
    "IB2300077330",
    "IB2300067978",
    "IB2300056947",
    "IB2300055350",
    "IB2300021303",
    "IB2300042266",
    "IB2300035883",
    "IB2300028553",
    "IB2300021353",
    "IB2300002016",
    "IB2200096703",
    "IB2200094821",
    "IB2200094598",
    "IB2200094597",
    "IB2200094596",
    "IB2200094595",
    "IB2200087846",
    "IB2200089986",
    "IB2200085836",
    "IB2200079754",
    "IB2200080520",
    "IB2200078006",
    "IB2200077273",
    "IB2200077051",
    "IB2200066812",
    "IB2200067995",
    "IB2200057834",
    "IB2200051576",
    "IB2200047421",
    "IB2200055134",
    "IB2200049726",
    "IB2200047662",
    "IB2200047013",
    "IB2200026925",
    "IB2200033497",
    "IB2200030191",
    "IB2200028752",
    "IB2200023734",
    "IB2200009483",
    "IB2200020632",
    "IB2200012222",
    "IB2200009076",
]


async function crawData() {
    // launch the browser
    const arr2 = []
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        // Truy cập và mở max màn hình
        await driver.get("https://muasamcong.mpi.gov.vn/");
        await driver.manage().window().maximize();

        // Đóng form quảng cáo lại
        let closeButton = await driver.findElement(By.id('popup-close'));
        await new Promise(resolve => setTimeout(resolve, 3000));
        await closeButton.click();

        // Tìm thnh search
        for (let item of Arrnew) {

            if (await checkThauExistsNew(item) === false) {
                let inputSearch = await driver.findElement(By.name('keyword'))
                // Truyền dữ liệu vào thanh search
                //await inputSearch.sendKeys('IB2300275363');

                await inputSearch.sendKeys(item);
                // Đợi 5 giây
                await new Promise(resolve => setTimeout(resolve, 2000));
                //Tìm nút tìm kiếm
                let searchButton = await driver.findElement(By.className('search-button'))
                // Bấm nút tìm kiếm
                await searchButton.click();

                // let searchButton2 = await driver.findElements(By.css('button'))

                // for (let item of searchButton2) {
                //     if (await item.getText() === 'Tìm kiếm') {
                //         await item.click()
                //     }
                // }
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Tìm chỗ gói thầu
                let element = await driver.wait(until.elementLocated(By.className('content__body__left__item__infor__contract__name format__text__title')), 7000);
                // Nhấn vào gói thầu
                element.click()
                await new Promise(resolve => setTimeout(resolve, 7000));
                const arrInfomation3 = []
                let typeResultButton = await driver.findElements(By.className('nav-item'));
                if (typeResultButton.length > 0) {
                    for (let item of typeResultButton) {
                        const a = await item.findElement(By.css('a'))
                        if (await a.getText() === 'Biên bản mở thầu') {
                            a.click();
                        }
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
                var infomationPackage = await driver.findElements(By.className('d-flex flex-row align-items-start infomation__content'));
                for (let item of infomationPackage) {
                    arrInfomation3.push(await item.getText())
                }

                var getnhanhgoithau = {}

                for (let ele of arrInfomation3) {
                    const arrString = ele.split("\n");
                    if (arrString[0].includes("Mã TBMT")) {
                        getnhanhgoithau.MATBMT = arrString[1]

                    }
                    if (arrString[0].includes("Giá gói thầu")) {
                        console.log(arrString[1])
                        const sotienxuly = arrString[1].slice(0, arrString[1].lastIndexOf(" "))
                        getnhanhgoithau.GIAGOITHAU = sotienxuly.split('.').join("")
                    }
                }
                insertThauNew(getnhanhgoithau.MATBMT, getnhanhgoithau.GIAGOITHAU)
                const buttonQuayLai = driver.findElement(By.className('btn btn-primary button-back'));
                buttonQuayLai.click()
            }
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

crawData()

module.exports = crawData;
