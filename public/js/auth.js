(function () {
  //"use strict";

  let local_token = localStorage.getItem("access_token");
  var timerHandle = setInterval(function () {
    if (window.location.href.indexOf("access_token") !== -1) {
      var access_token = window.location.href
        .match(/#access_token=(.*)$/)[1]
        .split("&")[0];
      clearInterval(timerHandle);
      // USE THE TOKEN...
      // console.log("token", access_token);
      localStorage.setItem("access_token", access_token);

      console.log("local_token", local_token);
      window.location.href = window.location.href =
        "http://localhost:8080/cdn-migrator-test/cdn-migrator";
    }

    // else {
    //   if (local_token) {
    //     stanbic_token = local_token;
    //   }
    //   else {
    //     window.location.href =
    //       "http://localhost:8080/tools-test/outstanding-docs";
    //   }
    // }
  }, 3000);
  return true;
})();
