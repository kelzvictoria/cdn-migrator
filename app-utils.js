var FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const request = require("request");

const patchDocument = async (
  documentID,
  attributeKey,
  stanUrl,
  accessToken
) => {
  //console.log("accessToken", accessToken);
  //console.log("s3_orphan_urls", s3_orphan_urls);

  var options = {
    method: "POST",
    url: `https://formelo.stanbicibtcpension.com/api/documents/process`,
    qs: {
      id: documentID, //entity id,
      action: "patch",
      data: JSON.stringify({
        data: {
          [attributeKey]: stanUrl,
        },
      }),
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: false,
  };
  // console.log("options", options);
  request(options, async function (error, response, body) {
    if (error) {
      throw new Error(error);
    } else if (response.statusCode >= 500 && response.statusCode < 600) {
      let errorMsg = `Failed to patch ${documentID} `;
      console.log(errorMsg);
    } else {
      await console.log(`Patch to ${documentID} completed succcessfully`);
    }
  });
};

module.exports = {
  patchDocument,
};
