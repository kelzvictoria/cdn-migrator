function generateCSV(event) {
  event.preventDefault();

  var data = {};
  $.ajax({
    type: "POST",
    url: "./generate-csv",
    data: data,
  });
}

var generateCSVForm = document.getElementById("generate-csv-form");
if (generateCSVForm) {
  generateCSVForm.addEventListener("submit", generateCSV);
}
