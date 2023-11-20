const https = require("https");
const axios = require("axios");

const { PROV_CODE } = process.env;

const getData = async (from, to, pageSize = 10, pageNumber = 0) => {
  if (pageNumber == 0) pageNumber = -1;
  var data = JSON.parse(
    JSON.stringify({
      pageSize,
      pageNumber,
      query: {
        index: "es-notify-contractor",
        keyWord: null,
        matchFields: ["bidName", "procuringEntityName", "notifyNo"],
        filters: [
          {
            fieldName: "isInternet",
            searchType: "IN",
            fieldValues: [1, 0],
          },
          {
            fieldName: "bidPrice",
            searchType: "RANGE",
            from: 0,
            to: 999999999999999,
          },
          {
            fieldName: "publicDate",
            searchType: "RANGE",
            from,
            to,
          },
        ],
      },
    })
  );

  var config = {
    method: "post",
    url: "https://muasamcong.mpi.gov.vn/o/egp-portal-contractor-selection/services/smart/search",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  };

  try {
    let response = await axios(config);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getData_v2 = async (from, to, pageSize = 10, pageNumber = 0) => {
  if (pageNumber == 0) pageNumber = -1;
  var data = JSON.parse(
    JSON.stringify([{
      pageSize,
      pageNumber,
      query: [
        {
          index: "es-contractor-selection",
          matchType: "any",
          matchFields: ["notifyNo", "bidName"],
          filters: [
            {
              fieldName: "publicDate",
              searchType: "range",
              from,
              to,
            },
            {
              fieldName: "type",
              searchType: "in",
              fieldValues: ["es-notify-contractor"],
            },
            {
              fieldName: "locations.provCode",
              searchType: "in",
              fieldValues: [PROV_CODE],
            },
          ],
        },
      ],
    }])
  );

  var config = {
    method: "post",
    url: "https://muasamcong.mpi.gov.vn/o/egp-portal-contractor-selection-v2/services/smart/search",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  };

  try {
    let response = await axios(config);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getData, getData_v2 };
