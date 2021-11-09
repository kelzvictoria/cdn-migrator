const directory = "../uploaded-folder";

//const APP_PORT = 8080;
//const APP_PATH = "localhost:" + APP_PORT;

let stanbic_token, uploaded_file_name;

const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area"),
  p = document.querySelector("#browse"),
  uploadIcon = document.querySelector(".fa-cloud-upload-alt");
(downloadBtn = document.querySelector("#download-csv")),
  (downloadLink = document.querySelector("#download-link")),
  (downloadBtnDiv = document.querySelector(".btn-download-div")),
  (refreshBtn = document.querySelector("#refresh")),
  (refreshDiv = document.querySelector(".refresh-page")),
  (btnLogin = document.querySelector("#login")),
  (btnLogout = document.querySelector("#logout"));
deleteBtn = document.querySelector("#delete-link");

let is_file_uploaded = false;
let is_network_error = false;

let timer = 5000;

let fileContent;
let errors;
let window_location;

let errors_file_path;

function checkForCSV() {
  let file_name = uploaded_file_name;
  window_location = window.location.href;
  let appPath = window.location.href
    .split(window.location.host)[1]
    .split("/")[1];

  readErrorsFile(errors_file_path, function (text) {
    errors = JSON.parse(text);
  });

  let csvFileExists = FileExists(`../${appPath}/s3_orphan_urls.json`);

  let fileExists = csvFileExists ? true : false;
  let errorsExists = false;

  if (errors) {
    // errorsExists = true;
    errorsExists = errors[file_name.split(".")[0]] ? true : false;
  }

  console.log(
    "fileExisits",
    fileExists //, "errorsExists", errorsExists
  );

  if (fileExists) {
    HideMessage();
    clearInterval(interval);

    readJSONFile(`../${appPath}/s3_orphan_urls.json`, function (text) {
      let storageObj = JSON.parse(text);

      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(storageObj));
      var dlAnchorElem = document.getElementById("download-link");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "s3_orphan_urls.json");
      dlAnchorElem.click();
    });
  }

  console.log("errors", errors);

  if (
    errorsExists ||
    is_network_error
    // || errors[file_name]
  ) {
    console.log("error exists");
    ShowErrors();
  }
}

function readErrorsFile(file, callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", file, true);
  xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");

  // fallbacks for IE and older browsers:
  xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
  xhr.setRequestHeader("Pragma", "no-cache");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == "200") {
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}

function readJSONFile(file, callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", file, true);
  xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");

  // fallbacks for IE and older browsers:
  xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
  xhr.setRequestHeader("Pragma", "no-cache");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == "200") {
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}

function FileExists(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open("HEAD", urlToFile, false);
  xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");

  // fallbacks for IE and older browsers:
  xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
  xhr.setRequestHeader("Pragma", "no-cache");
  try {
    xhr.send();
    //  console.log("xhr.status", xhr.status);
    if (xhr.status == "404") {
      //console.log("File doesn't exist");
      return false;
    } else if (xhr.status == "502") {
      is_network_error = true;
      return false;
    } else {
      console.log("xhr responseText", xhr.responseText);
      console.log("File exists");
      return true;
    }
  } catch (err) {
    console.log("err", err);
    is_network_error = true;
  }
}

const toggleIsFileUploaded = () => {
  is_file_uploaded = !is_file_uploaded;
};

const toggleDisplayUploadBtn = (file_name) => {
  if (is_file_uploaded) {
    p.style.display = "none";
    uploadIcon.style.display = "none";
    ShowMessage();
  } else {
    p.style.display = "block";
    uploadIcon.style.display = "block";
    HideMessage();
  }
};

p.addEventListener("click", () => {
  fileInput.click();
  //  console.log("clicked");
});

refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.reload();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0];

  if (file) {
    let fileName = file.name;

    // console.log("fileName", fileName);

    if (fileName.length >= 12) {
      let splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName, file);
  }
};

function uploadFile(name, file) {
  //console.log("window.location", window.location);
  window_location = window.location.href;
  let appPath = window.location.href
    .split(window.location.host)[1]
    .split("/")[1];
  let upload_file_path = `//${window.location.host}/${appPath}/upload-file`;
  errors_file_path = `../${appPath}/errors.json`;
  //console.log("file.name", file.name);
  let file_name = file.name;
  uploaded_file_name = file_name;
  var formData = new FormData();
  formData.append("file", file);

  var xhr = new XMLHttpRequest();

  xhr.open("POST", upload_file_path, true);
  //console.log("xhr.status OPENED: ", xhr.status);

  xhr.onprogress = function () {
    console.log("xhr.status LOADING: ", xhr.status);

    if (
      //xhr.status >= 400 && xhr.status < 600 && xhr.status !== 504
      xhr.status === 502
    ) {
      is_network_error = true;
    }
  };
  //if (xhr.status !== 0 )

  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    fileTotal < 1024
      ? (fileSize = fileTotal + " KB")
      : (fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB");
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    //downloadLink.style.display = "none";
    progressArea.innerHTML = progressHTML;
    if (loaded == total) {
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.innerHTML = uploadedHTML;
      const cancelButton = document.querySelector(".btnCancel");
      cancelButton.addEventListener("click", () => {
        console.log("clicked cancel");
        form.reset();
        uploadedArea.innerHTML = "";
        xhr.abort();
        location.reload();
      });
      toggleIsFileUploaded();
      //console.log("is_file_uploaded", is_file_uploaded);
      toggleDisplayUploadBtn(file_name);
    }
  });

  let token = localStorage.getItem("access_token");
  //console.log("token", token);
  formData.append("access_token", token);

  xhr.onload = function () {
    console.log("xhr.status DONE: ", xhr.status);
  };
  xhr.send(formData);

  //alert(resp);
}

deleteBtn.addEventListener("click", () => {
  deleteS3Orphans();
});

function deleteS3Orphans() {
  var xhr = new XMLHttpRequest();
  let appPath = window.location.href
    .split(window.location.host)[1]
    .split("/")[1];
  var delete_file_route = `//${window.location.host}/${appPath}/delete-s3-files`;
  xhr.open("POST", delete_file_route, true);

  xhr.onprogress = function () {
    console.log("delete xhr.status LOADING: ", xhr.status);

    if (
      //xhr.status >= 400 && xhr.status < 600 && xhr.status !== 504
      xhr.status === 502
    ) {
      is_network_error = true;
    }
  };

  try {
    xhr.onload = function () {
      console.log("delete xhr.status DONE: ", xhr.status);
    };
    xhr.send(null);
  } catch (err) {
    // alert("s3 orphans failed to delete successfully");
    console.log("s3 orphans failed to delete successfully", err);
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      //  alert(xhr.responseText);
      let res = JSON.parse(xhr.responseText);
      console.log("res.status", res.status);
      if (res.status === true) {
        console.log("s3 orphans have been deleted successfully");
        alert("S3 orphans have been deleted successfully");
      } else if (res.status === false) {
        console.log("s3 orphans failed to delete successfully", err);
      }
    }
  };
}

let interval = null;

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  var allText;
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
        // alert(allText);
      }
    }
  };
  rawFile.send(null);
  return allText;
}

function ShowErrors() {
  let file_name = uploaded_file_name;
  console.log("file_name", file_name);
  $("#message-text2").hide();

  if (is_network_error) {
    $("#message-text3").text("A network error has occured...");
  }
  if (errors) {
    let error = errors[file_name.split(".")[0]];

    if (error) {
      console.log("error", error);
      let errorMsg = "";

      for (let i = 0; i < error.length; i++) {
        errorMsg += `PIN: ${error[i].entity_id}, ${error[i].error}. `;
      }
      $("#message-text3").text(
        errorMsg
        //"Something went wrong, please try again later..."
      );
    }
  }

  $("#message-text3").show();
  clearInterval(interval);
  $(".refresh-page").show();
}

function ShowMessage() {
  $("#message-text1").text("CSV file has been uploaded successfully.");
  $("#message-text2").text(
    "Please wait while S3 Orphan URLs CSV file is being generated..."
  );
  $("#message").show();
  $("#message-text2").hide();
  $("#download-link").hide();
  interval = setInterval(function () {
    $("#message-text1").hide();
    $("#message-text2").show();
    checkForCSV();
  }, timer);
}

function HideMessage() {
  //$("#message").hide();
  $("#message-text1").show();
  $("#message-text2").hide();
  $("#message-text1").text("CDN URLs have been migrated");

  $("#message").hide();
  $("#download-link").show();
  $("#delete-link").show();
  $(".refresh-page").show();
}

(function () {
  //console.log("in here");
  //"use strict";
  let local_token = localStorage.getItem("access_token");
  if (local_token) {
    btnLogout.style.display = "block";
    btnLogin.style.display = "none";
  }
  var timerHandle = setInterval(function () {
    if (window.location.href.indexOf("access_token") !== -1) {
      var access_token = window.location.href
        .match(/#access_token=(.*)$/)[1]
        .split("&")[0];
      clearInterval(timerHandle);
      // USE THE TOKEN...
      // console.log("token", access_token);
      localStorage.setItem("access_token", access_token);

      btnLogout.style.display = "block";
      btnLogin.style.display = "none";
      stanbic_token = access_token;
      // console.log("local_token", local_token);
      // if (access_token || local_token) {
      //   stanbic_token = access_token;
      // }
    }
  }, 3000);
  return true;
})();

(function () {
  //"use strict";
  let window_location = window.location;
  var timerHandle = setInterval(function () {
    let local_token = localStorage.getItem("access_token");
    if (!local_token) {
      window.location.href =
        window.location.href = `${window_location.origin}/cdn-migrator-test/`;
    } else {
      clearInterval(timerHandle);
    }
  }, 500);
  return true;
})();
