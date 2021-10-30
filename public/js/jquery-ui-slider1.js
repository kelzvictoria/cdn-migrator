$(function () {
  $("#age-slider-range").slider({
    range: true,
    min: 10,
    max: 85,
    values: [ageArr[0], ageArr[1]],
    slide: function (event, ui) {
      $("#current_age").val(ui.values[0]);
      $("#retirement_age").val(ui.values[1]);
    },
  });
  $("#current_age").val($("#age-slider-range").slider("values", 0));
  $("#retirement_age").val($("#age-slider-range").slider("values", 1));
});

$(function () {
  $("#amt-slider-range").slider({
    range: false,
    min: 0,
    max: 5000000,
    value: desiredAmt,
    slide: function (event, ui) {
      $("#desired_amt").val(ui.value);
    },
  });
  $("#desired_amt").val($("#amt-slider-range").slider("values", desiredAmt));
});

$(function () {
  $("#cpv-slider-range").slider({
    range: false,
    min: 0,
    max: 5000000,
    value: curPenValue,
    slide: function (event, ui) {
      $("#cpv").val(ui.value);
    },
  });
  $("#cpv").val($("#cpv-slider-range").slider("values", 0));
});

$(function () {
  $("#mc-slider-range").slider({
    range: false,
    min: 0,
    max: 1000000,
    value: monthlyContrib,
    slide: function (event, ui) {
      $("#mc").val(ui.value);
    },
  });
  $("#mc").val($("#mc-slider-range").slider("values", 0));
});

$(function () {
  $("#vc-slider-range").slider({
    range: false,
    min: 0,
    max: 1000000,
    value: voluntarilyContrib,
    slide: function (event, ui) {
      $("#vc").val(ui.value);
    },
  });
  $("#vc").val($("#vc-slider-range").slider("values", 0));
});

$(function () {
  $("#mi-slider-range").slider({
    range: false,
    min: 0,
    max: 5000000,
    value: monthlyIncome,
    slide: function (event, ui) {
      $("#mi").val(ui.value);
    },
  });
  $("#mi").val($("#mi-slider-range").slider("values", 0));
});
