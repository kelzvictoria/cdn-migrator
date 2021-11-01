require("dotenv").config();

const express = require("express");
const Tokens = require("csrf");
const cors = require("cors");
const formidable = require("formidable");

const fs = require("fs");
const csvtojson = require("csvtojson");
const request = require("request");

var session = require("express-session");
const utils = require("./app-utils");

var port = process.env["APP_PORT"] || 8080;
var appPath =
  process.env["APP_PATH"] ||
  //(isProd ? "/tools" :
  "/cdn-migrator-test";
//);
appPath = appPath.endsWith("/")
  ? appPath.substring(0, appPath.length - 1)
  : appPath;
var protocol = process.env["APP_SCHEME"] || "http";

const csrfTokenManager = new Tokens();
var csrfSecret =
  process.env["CSRF_SECRET_KEY"] || csrfTokenManager.secretSync();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const staticDataPath = __dirname + "/public";
const filesStaticDataPath = __dirname + "/uploads";
const generatedFileStaticPath = __dirname + "/generated-csv";

const viewDataPath = __dirname + "/views/_partials";

const app = express();
const router = express.Router();

router.use(function (req, res, next) {
  next();
});

// Handler for Static Files
app.use(
  appPath + "",
  express.static(staticDataPath, {
    maxAge: "1d",
  })
);

app.use(
  appPath + "",
  express.static(generatedFileStaticPath, {
    maxAge: "1d",
  })
);

app.use(
  appPath + "",
  express.static(filesStaticDataPath, {
    maxAge: "1d",
  })
);

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 20000,
    },
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.static("public"));

// Handler for parsing cookies

// Handler for parsing "application/json" data
app.use(express.json());

// Handler for parsing form / "application/x-www-form-urlencoded" data
app.use(express.urlencoded({ extended: true }));

// Handler for managing CORS requests
app.use(appPath + "", cors(corsOptions), router);

// Custom error handler for CSRF errors
app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send("form tampered with");
});

app.set("view engine", "ejs");

app.get(appPath, function (req, res) {
  res.redirect(appPath + "/index");
});

app.get(appPath + "/index", async (req, res) => {
  //stanbicRealmToken = await auth.stanbicRealmToken;

  console.log("req.get('host')", req.get("host"));
  var baseUrl = protocol + "://" + req.get("host") + appPath + "/";
  console.log("baseUrl", baseUrl);
  var redirect_uri = baseUrl + "progress";
  var next_uri =
    baseUrl + (req.path.startsWith("/") ? req.path.substring(1) : req.path);
  console.log("next_uri", next_uri);
  /*if (next_uri != redirect_uri && (config.appPath + req.path) != defaultPath) {
      redirect_uri += '?next_uri=' + encodeURIComponent(next_uri);
/  } */
  // res.redirect(appPath + '/login' + '?redirect_uri=' + encodeURIComponent(redirect_uri));

  res.render(viewDataPath + "/index", {
    appPath: appPath,
    pageName: "index",
    csrfToken: csrfTokenManager.create(csrfSecret),
    client_id: process.env["CLIENT_ID"],
    realm_url: process.env["REALM_URL"],
    port: process.env["APP_PORT"],
    redirect_uri: redirect_uri,
  });
});

app.get(appPath + "/progress", async (req, res) => {
  var baseUrl = protocol + "://" + req.get("host") + appPath + "/";
  var redirect_uri = baseUrl + "progress";

  res.render(viewDataPath + "/progress", {
    appPath: appPath,
    pageName: "progress",
    csrfToken: csrfTokenManager.create(csrfSecret),
    client_id: process.env["CLIENT_ID"],
    realm_url: process.env["REALM_URL"],
    redirect_uri: redirect_uri,
  });
});

app.get(appPath + "/cdn-migrator", async (req, res) => {
  var baseUrl = protocol + "://" + req.get("host") + appPath + "/";
  var redirect_uri = baseUrl + "progress";
  res.render(viewDataPath + "/csvGenerator", {
    appPath: appPath,
    pageName: "cdn-migrator",
    csrfToken: csrfTokenManager.create(csrfSecret),
    client_id: process.env["CLIENT_ID"],
    realm_url: process.env["REALM_URL"],
    redirect_uri: redirect_uri,
  });
});

router.post("/upload-file", async (req) => {
  let uploaded_csv_path = filesStaticDataPath;

  let fileUploadErrorArr;

  let stanbic_access_token;

  let s3OrphanUrls;

  let patched_documents = [];

  //https://www.section.io/engineering-education/uploading-files-using-formidable-nodejs/
  var form = new formidable.IncomingForm();
  //console.log("form", form);
  fileUploadErrorArr = [];

  form.multiples = false;
  form.uploadDir = uploaded_csv_path;
  //console.log("form", form);

  try {
    form.parse(req, async function (err, fields, files) {
      stanbic_access_token = fields.access_token;

      //console.log("stanbic_access_token", stanbic_access_token);
      let csvFilePath = files.file.path;
      //console.log("filePath", csvFilePath);

      //put your logic here

      //i.e do stage 1 and stage 2 here
      let is_patch_complete = false;
      const patchDocuments = (s3OrphanUrls, accessToken) => {
        //  var documentID, attributeKey, stanUrl, pfabo_cdn_url;

        for (let i = 0; i < s3OrphanUrls.length; i++) {
          delete s3OrphanUrls[i]["Formelo DB ID"];
          delete s3OrphanUrls[i]["Size"];
          delete s3OrphanUrls[i]["Raw Data ID"];
          delete s3OrphanUrls[i]["MSSQL Table"];
          delete s3OrphanUrls[i]["MSSQL Column"];
          delete s3OrphanUrls[i]["MSSQL Record Code"];

          let pfabo_cdn_url = s3OrphanUrls[i]["PFABO CDN URL"];
          let stringArr = pfabo_cdn_url.split(".com");

          let documentID = s3OrphanUrls[i]["Formelo Entity ID"];
          let attributeKey = s3OrphanUrls[i]["Formelo Attribute Key"];

          s3OrphanUrls[i]["Stanbic CDN URL"] =
            stringArr[0] === "https://cdn-staging.stanbicibtcpension" ||
            "https://formelo.stanbicibtcpension"
              ? s3OrphanUrls[i]["PFABO CDN URL"]
              : "https://formelo.stanbicibtcpension.com" + stringArr[1];

          s3OrphanUrls[i]["Formelo Entity URL"] =
            "https://formelo.stanbicibtcpension.com/data/collections/documents/edit/" +
            documentID;

          let stanUrl = s3OrphanUrls[i]["Stanbic CDN URL"];
          //  console.log("stanUrl", stanUrl);

          try {
            /* await utils.patchDocument(
              documentID,
              attributeKey,
              stanUrl,
              stanbic_access_token
            ); */

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
            request(options, function (error, response, body) {
              console.log("Patching document " + documentID);
              if (error) {
                throw new Error(error);
              } else if (
                response.statusCode >= 500 &&
                response.statusCode < 600
              ) {
                let errorMsg = `Failed to patch ${documentID} `;
                console.log(errorMsg);
              } else {
                console.log(`Patch to ${documentID} completed succcessfully`);
                patched_documents.push(documentID);
                console.log(
                  "patched_documents.length",
                  patched_documents.length
                );

                if (patched_documents.length === s3OrphanUrls.length) {
                  is_patch_complete = true;

                  console.log("is_patch_complete", is_patch_complete);
                  if (is_patch_complete) {
                    fs.writeFile(
                      "./generated-csv/s3_orphan_urls.json",
                      JSON.stringify(s3OrphanUrls),
                      "utf-8",
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(
                            "s3_orphan_urls.json has been created successfully"
                          );
                        }
                      }
                    );
                  } else {
                    console.log("patchDocuments in progress...");
                  }
                }
              }
            });
          } catch (err) {
            console.log(`patch to ${documentID} failed`, "error:", err);
          }
        }
      };

      csvtojson()
        .fromFile(csvFilePath)
        .then(async (json) => {
          await patchDocuments(json, stanbic_access_token);
          // console.log("s3OrphanUrls", s3OrphanUrls);
        });
    });
  } catch (err) {
    console.log("/upload-post error", err);
  }
});

app.listen(port, function () {
  console.log("tools listening at port: " + port);
});
