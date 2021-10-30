$(document).ready(function () {
  var ageArr = document.config.ageArr;
  $("#age-slider-range").slider({
    range: true,
    min: 18,
    max: 85,
    values: [ageArr[0], ageArr[1]],
    slide: function (event, ui) {
      $("#current_age").val(ui.values[0]);
      $("#retirement_age").val(ui.values[1]);
    },
  });
  //$("#current_age").val($("#age-slider-range").slider("values", 0));
  //$("#retirement_age").val($("#age-slider-range").slider("values", 1));
  $("#current_age").val(ageArr[0]);
  $("#retirement_age").val(ageArr[1]);
});

$(document).ready(function () {
  var lumpSum = document.config.lumpSum;
  $("#lump-slider-range").slider({
    range: false,
    min: 0,
    max: 100000000,
    value: lumpSum,
    slide: function (event, ui) {
      $("#desired_lump").val(numberWithCommas(ui.value));
    },
  });
  $("#desired_lump").val(numberWithCommas(lumpSum));
});

$(document).ready(function () {
  var desiredAmt = document.config.desiredAmt;
  $("#amt-slider-range").slider({
    range: false,
    min: 0,
    max: 10000000,
    value: desiredAmt,
    slide: function (event, ui) {
      $("#desired_amt").val(numberWithCommas(ui.value));
    },
  });
  $("#desired_amt").val(numberWithCommas(desiredAmt));
});

$(document).ready(function () {
  var curPenValue = document.config.curPenValue;
  $("#cpv-slider-range").slider({
    range: false,
    min: 0,
    max: 500000000,
    value: curPenValue,
    slide: function (event, ui) {
      $("#cpv").val(numberWithCommas(ui.value));
    },
  });
  $("#cpv").val(numberWithCommas(curPenValue));
});

$(document).ready(function () {
  var monthlyContrib = document.config.monthlyContrib;
  $("#mc-slider-range").slider({
    range: false,
    min: 0,
    max: 2000000,
    value: monthlyContrib,
    slide: function (event, ui) {
      $("#mc").val(numberWithCommas(ui.value));
    },
  });
  $("#mc").val(numberWithCommas(monthlyContrib));
  //$("#mc").val(numberWithCommas(document.config.monthlyContrib));
  //console.log('AAAAAA: ' + document.config.monthlyContrib)
  //console.log('BBBBBB: ' + $("#mc-slider-range").slider("values", 0))
  //console.log('CCCCCC: ' + $("#mc").val())
});

$(document).ready(function () {
  var voluntarilyContrib = document.config.voluntarilyContrib;
  $("#vc-slider-range").slider({
    range: false,
    min: 0,
    max: 50000000,
    value: voluntarilyContrib,
    slide: function (event, ui) {
      $("#vc").val(numberWithCommas(ui.value));
    },
  });
  $("#vc").val(numberWithCommas(voluntarilyContrib));
});

$(document).ready(function () {
  var monthlyIncome = document.config.monthlyIncome;
  $("#mi-slider-range").slider({
    range: false,
    min: 0,
    max: 10000000,
    value: monthlyIncome,
    slide: function (event, ui) {
      $("#mi").val(numberWithCommas(ui.value));
    },
  });
  $("#mi").val(numberWithCommas(monthlyIncome));
});
//calculatePMT();
