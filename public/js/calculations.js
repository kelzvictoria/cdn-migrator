var ageArr = [];
var desiredAmt = 0;
var curPenValue = 0;
var monthlyContrib = 0;
var voluntarilyContrib = 0;
var monthlyIncome = 0;

var p = document.getElementById("estimated_pension_value");
var pMobileView1 = document.getElementById("pmtView1");
var pMobileView2 = document.getElementById("pmtView2");

function assignValue() {
  desiredAmt = document.getElementById("desired-amt-mobile").value;
  curPenValue = document.getElementById("current-amt-mobile").value;
  monthlyContrib = document.getElementById("contribution-amt-mobile").value;

  calculatePMT();
}

$(".slider")
  .bind({
    slidechange: function (event, ui) {
      ageArr = [];
      $("#age-slider-range").each(function () {
        var value = $(this).slider("option", "values");
        if (value.length > -1) {
          ageArr = value;
        }
      });

      $("#amt-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        if (value !== 0) {
          desiredAmt = value;
        }
      });

      $("#cpv-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        if (value !== 0) {
          curPenValue = value;
        }
      });

      $("#mc-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        if (value !== 0) {
          monthlyContrib = value;
        }
      });

      $("#vc-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        if (value !== 0) {
          voluntarilyContrib = value;
        }
      });

      $("#mi-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        if (value !== 0) {
          monthlyIncome = value;
        }
      });

      calculatePMT();
    },
  })
  .slider();

function calculatePMT() {
  var gender = $('input[name="sex"]:checked').val();
  console.log(
    "ageArr= ",
    ageArr,
    ", desiredAmt= ",
    desiredAmt,
    ", curPenValue= ",
    curPenValue,
    ", monthlyContrib= ",
    monthlyContrib,
    ", voluntarilyContrib= ",
    voluntarilyContrib,
    ", monthlyIncome= ",
    monthlyIncome,
    ", gender= ",
    gender
  );

  var a = curPenValue;
  var x = monthlyContrib;
  var y = voluntarilyContrib;

  var z = x + y;

  // console.log("z= ", z);

  var r = 1.000219;

  var currentAge = ageArr[0];
  var retirementAge = ageArr[1];

  var sex = gender;

  //console.log("maleNper: ", maleNper);

  var userNper;

  var nperObj = {};

  if (sex === "male") {
    nperObj = maleNper;
  } else if (sex === "female") {
    nperObj = femaleNper;
  }

  userNper = nperObj[currentAge];

  console.log("userNper= ", userNper);

  var n = (retirementAge - currentAge) * 365;
  // console.log("n= ", n);

  var FV = (a + z) * Math.pow(r, n - 1);

  console.log("FV= ", FV);

  /* 
      =====================================MONTHLY PAYMENT PLAN AFTER FUTURE VALUE===============
      To be retrieved from the most recent pension calculator (approved by PenCom) used in paying clients */

  var rate = 7.58;

  var PMT = (
    (FV * rate * Math.pow(1 + rate, userNper)) /
    (Math.pow(1 + rate, userNper) - 1)
  ).toFixed(2);
  console.log("PMT= ", numberWithCommas(PMT));

  // var wrapperZero = $(".zero");
  // var wrapperOne = $(".one");
  // var wrapperTwo = $(".two");
  // var wrapperThree = $(".three");
  // var wrapperFour = $(".four");
  // var wrapperFive = $(".line-middle");
  // var wrapperSix = $(".six");
  // var wrapperSeven = $(".seven");
  // var wrapperEight = $(".eight");
  // var wrapperNine = $(".nine");
  // var wrapperTen = $(".ten");
  // var wrapperEleven = $(".eleven");

  // var vbar = `
  // <div class="v-bar"></div>
  // `;

  // if (PMT == 0.0) {
  //   wrapperZero.append(vbar);
  // } else if (0.0 < PMT >= 1250000) {
  //   wrapperTwo.append(vbar);
  // } else if (1250000 < PMT >= 2500000) {
  //   wrapperFive.append(vbar);
  // } else if (250000 < PMT >= 3750000) {
  //   wrapperNine.append(vbar);
  // } else if (3750000 < PMT >= 5000000) {
  //   wrapperEleven.append(vbar);
  // }

  p.innerHTML = "₦" + numberWithCommas(PMT.toFixed(2));
  pMobileView1.innerHTML = "₦" + numberWithCommas(PMT.toFixed(2));
  pMobileView2.innerHTML = "₦" + numberWithCommas(PMT.toFixed(2));
}

//BUDGET PLANNER

function computeTotals() {
  var incomeArr = document.getElementsByName("monIncome");
  var incomeTotal = 0;
  for (var i = 0; i < incomeArr.length; i++) {
    if (parseInt(incomeArr[i].value))
      incomeTotal += parseInt(incomeArr[i].value);
  }
  document.getElementById("income_total").innerHTML =
    "₦" + numberWithCommas(incomeTotal.toFixed(2));
  document.getElementById("chart-amt").innerHTML =
    "₦" + numberWithCommas(incomeTotal.toFixed(2));

  //housing
  var housingArr = document.getElementsByName("housing");
  var housingTotal = 0;
  for (var i = 0; i < housingArr.length; i++) {
    if (parseInt(housingArr[i].value))
      housingTotal += parseInt(housingArr[i].value);
  }
  document.getElementById("housing_total").innerHTML =
    "₦" + numberWithCommas(housingTotal.toFixed(2));

  //transportation
  var transportationArr = document.getElementsByName("transportation");
  var transportationTotal = 0;
  for (var i = 0; i < transportationArr.length; i++) {
    if (parseInt(transportationArr[i].value))
      transportationTotal += parseInt(transportationArr[i].value);
  }
  document.getElementById("transportation_total").innerHTML =
    "₦" + numberWithCommas(transportationTotal.toFixed(2));

  //education
  var educationArr = document.getElementsByName("education");
  var educationTotal = 0;
  for (var i = 0; i < educationArr.length; i++) {
    if (parseInt(educationArr[i].value))
      educationTotal += parseInt(educationArr[i].value);
  }
  document.getElementById("education_total").innerHTML =
    "₦" + numberWithCommas(educationTotal.toFixed(2));

  //personal
  var personalArr = document.getElementsByName("personal");
  var personalTotal = 0;
  for (var i = 0; i < personalArr.length; i++) {
    if (parseInt(personalArr[i].value))
      personalTotal += parseInt(personalArr[i].value);
  }
  document.getElementById("personal_total").innerHTML =
    "₦" + numberWithCommas(personalTotal.toFixed(2));

  //savings
  var savingsArr = document.getElementsByName("savings");
  var savingsTotal = 0;
  for (var i = 0; i < savingsArr.length; i++) {
    if (parseInt(savingsArr[i].value))
      savingsTotal += parseInt(savingsArr[i].value);
  }
  document.getElementById("monthly_savings_total").innerHTML =
    "₦" + numberWithCommas(savingsTotal.toFixed(2));

  var monthlyExpenses =
    housingTotal + transportationTotal + educationTotal + personalTotal;

  document.getElementById("monthly_expenses_total").innerHTML =
    "₦" + numberWithCommas(monthlyExpenses.toFixed(2));

  var leftOverCash = incomeTotal - (monthlyExpenses + savingsTotal);

  document.getElementById("left_over_cash").innerHTML =
    "₦" + numberWithCommas(leftOverCash.toFixed(2));
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
