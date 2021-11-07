require("dotenv").config();

const express = require("express");
const Tokens = require("csrf");
const cors = require("cors");
const formidable = require("formidable");

const fs = require("fs");
const csvtojson = require("csvtojson");

var session = require("express-session");

const path = require("path");

const utils = require("./app-utils");
const { default: axios } = require("axios");

var options = {
  key: fs.readFileSync("./certs/server-key.pem"),
  cert: fs.readFileSync("./certs/server-cert.pem"),
};

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

let err_path = path.join(staticDataPath, `errors.json`);
const err_file = require(err_path);

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

  let fileUploadErrorArr, fileN;

  let stanbic_access_token;

  let s3OrphanUrls;

  //https://www.section.io/engineering-education/uploading-files-using-formidable-nodejs/
  var form = new formidable.IncomingForm();
  //console.log("form", form);
  fileUploadErrorArr = [];

  fs.exists(
    path.join(
      generatedFileStaticPath,

      "s3_orphan_urls.json"
    ),
    function (exists) {
      // console.log("exists", exists);
      if (exists) {
        fs.unlinkSync(
          path.join(
            generatedFileStaticPath,

            "s3_orphan_urls.json"
          )
        );
      }
    }
  );

  const buildErrObj = (folder_name, entity_id, error) => {
    fileUploadErrorArr.push({
      folder_name,
      entity_id,
      error,
    });
  };

  form.multiples = false;
  form.uploadDir = uploaded_csv_path;
  //console.log("form", form);

  try {
    form.parse(req, async function (err, fields, files) {
      stanbic_access_token = fields.access_token;

      //console.log("stanbic_access_token", stanbic_access_token);
      let csvFilePath = files.file.path;

      let fileName = files.file.name.split(".")[0];
      fileN = fileName;
      let errorFileName = fileName;

      if (err_file[errorFileName]) {
        delete err_file[errorFileName];
        //+ timeStamp
        fs.writeFile(
          err_path,
          //errors,
          // `let ${errorFileName} =  ${JSON.stringify(fileUploadErrorArr)}`,
          JSON.stringify(err_file),
          (err) => {
            err && console.log("err", err);
          }
        );
      }

      let pfabo_files_json;
      let patched_documents = [];
      let failed_patches = [];
      let is_patch_complete = false;
      let patchTypes = ["pfabo-formelo", "formelo-pfabo"];
      let patchType = patchTypes[0];
      console.log("patchType: ", patchType);
      let error_occured = false;
      let no_of_times_reattempted = 0;
      let total_no_of_cdn_urls;
      let total_s3_orphan_urls = [];

      const patchDocuments = async (s3OrphanUrls, accessToken, patchType) => {
        //  var documentID, attributeKey, stanUrl, pfabo_cdn_url;
        console.log("s3OrphanUrls.length", s3OrphanUrls.length);
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
          let formeloUrl = s3OrphanUrls[i]["Formelo CDN URL"];
          //  console.log("stanUrl", stanUrl);

          try {
            console.log(
              "Patching document " + documentID,
              "attribute: " + attributeKey
            );
            await axios
              .patch(
                `https://formelo.stanbicibtcpension.com/api/documents/${documentID}.json`,
                {
                  id: documentID,
                  data: {
                    [attributeKey]:
                      patchType === "formelo-pfabo" ? stanUrl : formeloUrl,
                  },
                },
                {
                  headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                }
              )
              .then((res) => {
                //console.log("res", res);
                console.log(`Patch to ${documentID} completed succcessfully`);

                let record_exists_in_failed_arr = failed_patches.filter(
                  (f) =>
                    f["Formelo Entity ID"] === documentID &&
                    f["Formelo Attribute Key"] === attributeKey
                ).length
                  ? true
                  : false;

                if (record_exists_in_failed_arr) {
                  failed_patches = failed_patches.filter(
                    (f) =>
                      f["Formelo Entity ID"] !== documentID &&
                      f["Formelo Attribute Key"] !== attributeKey
                  );
                }
                patched_documents.push(documentID);
                total_s3_orphan_urls.push(s3OrphanUrls[i]);
                console.log(
                  "patched_documents.length",
                  patched_documents.length
                );

                console.log("patchDocuments in progress...");

                /* if (failed_patches.length) {
                  console.log("reattempting failed patches...");
                  patchDocuments(
                    failed_patches,
                    stanbic_access_token,
                    patchType
                  );
                } */
                if (
                  patched_documents.length === total_no_of_cdn_urls && //s3OrphanUrls.length
                  !failed_patches.length
                ) {
                  is_patch_complete = true;

                  console.log("is_patch_complete", is_patch_complete);
                  if (is_patch_complete) {
                    fs.writeFile(
                      "./generated-csv/s3_orphan_urls.json",
                      JSON.stringify(total_s3_orphan_urls),
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
                  }
                } else {
                  //console.log("fileUploadErrorArr", fileUploadErrorArr);
                  let timeStamp = new Date().getTime();
                  if (fileUploadErrorArr.length) {
                    err_file[errorFileName] = fileUploadErrorArr;
                    //+ timeStamp
                    fs.writeFile(
                      err_path,
                      //errors,
                      // `let ${errorFileName} =  ${JSON.stringify(fileUploadErrorArr)}`,
                      JSON.stringify(err_file),
                      (err) => {
                        err && console.log("err", err);
                      }
                    );
                    /*res.send({
                    status: 500,
                    msg: fileUploadErrorArr,
                  }); */
                  }
                }
              });
          } catch (err) {
            let errorMsg = `Failed to patch ${documentID} `;
            let record_exists_in_failed_arr = failed_patches.filter(
              (f) =>
                f["Formelo Entity ID"] === documentID &&
                f["Formelo Attribute Key"] === attributeKey
            ).length
              ? true
              : false;

            console.log(
              "record_exists_in_failed_arr",
              record_exists_in_failed_arr
            );

            if (!record_exists_in_failed_arr) {
              failed_patches.push(
                pfabo_files_json.filter(
                  (p) =>
                    p["Formelo Entity ID"] === documentID &&
                    p["Formelo Attribute Key"] === attributeKey
                )[0]
              );
            }
            error_occured = true;
            if (err.code !== "ETIMEDOUT") {
              buildErrObj(fileN, documentID, errorMsg);
              console.log(`patch to ${documentID} failed`, "error:", err);
            }
          }
        }
      };

      csvtojson()
        .fromFile(csvFilePath)
        .then(async (json) => {
          pfabo_files_json = json;
          total_no_of_cdn_urls = json.length;
          await patchDocuments(json, stanbic_access_token, patchType);
          console.log("error_occured", error_occured);

          if (error_occured && no_of_times_reattempted < 2) {
            console.log("an error has occured, reattempting failed patches...");
            no_of_times_reattempted = no_of_times_reattempted + 1;
            console.log("no_of_times_reattempted", no_of_times_reattempted);
            console.log("failed_patches", failed_patches);
            await patchDocuments(
              failed_patches,
              stanbic_access_token,
              patchType
            );
          }
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

/*var server = https.createServer(options, app).listen(port, function () {
  console.log("Express server listening on port " + port);
});*/
