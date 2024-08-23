// const StringConnect = {
//     server: "10.102.24.83",
//     port: 1433,
//     database: "HGI_MUASAMCONG",
//     authentication: {
//         type: "default",
//         options: {
//             userName: "muasamcong",
//             password: "muasamcong123",
//         },
//     },
//     options: { encrypt: false },
// };
const StringConnect = {
    server: "10.102.13.18",
    port: 1433,
    database: "muasamcong",
    authentication: {
        options: {
            userName: "muasamcong",
            password: "muasamcong123",
        },
    },
    options: {
        encrypt: false, // Tắt mã hóa nếu không cần thiết
        enableArithAbort: true, // Bật để xử lý lỗi tính toán nhanh hơn
        enableImplicitTransactions: false, // Tắt implicit transactions để giảm độ trễ
        trustServerCertificate: true, // Bật trust server certificate để bỏ qua xác thực chứng chỉ
    },
};

module.exports = {StringConnect}




