const axios = require("axios");
//const utils = require("./utils")
//const DEMO_SECRET = process.env.DEMO_SECRET;
//const DEMO_ID = process.env.DEMO_ID;
//const DEMO_REALM_URL = process.env.DEMO_REALM_URL;

const STANBIC_IBTC_SECRET = process.env.STANBIC_IBTC_SECRET;
const STANBIC_IBTC_ID = process.env.STANBIC_IBTC_ID;
const STANBIC_IBTC_REALM_URL = process.env.STANBIC_IBTC_REALM_URL;

//const is_instacare_realm = utils.is_instacare_realm;

let demoRealmToken = "";
let stanbicRealmToken = "";

const getDemoRealmToken = async () => {
  try {
    let enc = encodeURIComponent || escape;
    await axios
      .post(
        DEMO_REALM_URL +
          "/oauth/token?scope=" +
          enc("*.*") +
          "&client_id=" +
          enc(DEMO_ID) +
          "&client_secret=" +
          enc(DEMO_SECRET) +
          "&grant_type=" +
          enc("client_credentials"),
        {
          // headers: {
          //   "Content-Type": "application/x-www-form-urlencoded",
          // },
        }
      )
      .then((res) => {
        demoRealmToken = res.data.access_token;
        // console.log(`token from  demo  realm`, demoRealmToken);
      });

    return demoRealmToken;
  } catch (err) {
    console.log("getToken error:", err);
  }
};

const getStanbicRealmToken = async () => {
  try {
    let enc = encodeURIComponent || escape;
    await axios
      .post(
        STANBIC_IBTC_REALM_URL +
          "/oauth/token?scope=" +
          enc("*.*") +
          "&client_id=" +
          enc(STANBIC_IBTC_ID) +
          "&client_secret=" +
          enc(STANBIC_IBTC_SECRET) +
          "&grant_type=" +
          enc("client_credentials"),
        {
          // headers: {
          //   "Content-Type": "application/x-www-form-urlencoded",
          // },
        }
      )
      .then((res) => {
        stanbicRealmToken = res.data.access_token;
        //console.log(`token from  stanbic  realm`, stanbicRealmToken);
      });

    return stanbicRealmToken;
  } catch (err) {
    console.log("getToken error:", err);
  }
};

//demoRealmToken = getDemoRealmToken();
//stanbicRealmToken = getStanbicRealmToken();

module.exports = {
  demoRealmToken,
  stanbicRealmToken,
};
