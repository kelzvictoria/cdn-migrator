// COMMON FUNCTIONS
function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}
function stripNonNumeric(x) {
  x = x !== undefined ? x.toString() : '';
  var n = parseFloat((x.charAt(0) == '-' ? '-' : '') + (x.replace(/[^0-9]+/g, '')));
  return isNaN(n) ? 0 : n;
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
var validations = {
  email: [
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    "Please enter a valid email address",
  ],
};
$(document).ready(function () {
  // Check all the input fields of type email. This function will handle all the email addresses validations
  $("input[type=email]").change(function () {
    // Set the regular expression to validate the email
    validation = new RegExp(validations["email"][0]);
    // validate the email value against the regular expression
    if (!validation.test(this.value)) {
      // If the validation fails then we show the custom error message
      this.setCustomValidity(validations["email"][1]);
      return false;
    } else {
      // This is really important. If the validation is successful you need to reset the custom error message
      this.setCustomValidity("");
    }
  });
});

function reFormatStringWithCommas(id) {
  //console.log(id);
  var item = stripNonNumeric(document.getElementById(id).value);

  document.getElementById(id).value = numberWithCommas(item);
}
