var gender = "male";
var ageArr = [30, 65];
var desiredAmt = 100000;
var curPenValue = 1000000;
var monthlyContrib = 18000;
var voluntarilyContrib = 0;
var contrib;
var monthlyIncome = 100000;

var p = document.getElementById("estimated_pension_value");
var pMobileView1 = document.getElementById("pmtView1");
var pMobileView2 = document.getElementById("pmtView2");

var sumProfile = document.getElementById("sum-profile");
var sumPensionBal = document.getElementById("sum-pension-bal");
var sumIncome = document.getElementById("sum-income");
var sumDesPension = document.getElementById("sum-des-pension");
var sumContrib = document.getElementById("sum-contrib");

var userNper = 0;

function assignValue() {
  // desiredAmt = document.getElementById("desired-amt-mobile").value;
  // curPenValue = document.getElementById("current-amt-mobile").value;
  // monthlyContrib = document.getElementById("contribution-amt-mobile").value;

  gender = $('input[name="sex"]:checked').val();

  ageArr = [
    document.getElementById("current_age").value,
    document.getElementById("retirement_age").value,
  ];
  curPenValue = document.getElementById("cpv").value;
  monthlyIncome = document.getElementById("mi").value;
  desiredAmt = document.getElementById("desired_amt").value;
  monthlyContrib = document.getElementById("mc").value;
  voluntarilyContrib = document.getElementById("vc").value;

  //numberWithCommas(document.getElementById("cpv").value);

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
        //console.log("amt-slider value=", value);
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
  contrib = parseFloat(monthlyContrib) + parseFloat(voluntarilyContrib);

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
    ", contrib= ",
    contrib,
    ", monthlyIncome= ",
    monthlyIncome,
    ", gender= ",
    gender
  );

  var a = curPenValue;
  var x = monthlyContrib;
  var y = voluntarilyContrib;

  var z = parseFloat(x) + parseFloat(y);

  //console.log("x= ", x, "y= ", y, "z= ", z);

  var r = 1.000219;

  var currentAge = ageArr[0];
  var retirementAge = ageArr[1];

  var sex = gender;

  //console.log("maleNper: ", maleNper);

  var userLifeExpectancy;

  var nperObj = {};

  if (sex === "male") {
    nperObj = maleNper;
  } else if (sex === "female") {
    nperObj = femaleNper;
  }

  userLifeExpectancy = nperObj[retirementAge];

  userNper = (24 * (userLifeExpectancy - 11 / 24)).toFixed(7);

  console.log("userNper= ", userNper);

  var n = (retirementAge - currentAge) * 365;
  // console.log("n= ", n);

  var sumAwithZ = parseFloat(a) + parseFloat(z);

  //console.log("a= ", a, "z= ", z, "sumAwithZ= ", sumAwithZ);

  var FV = parseFloat((sumAwithZ * Math.pow(r, n - 1)).toFixed(2));

  /* 
      =====================================MONTHLY PAYMENT PLAN AFTER FUTURE VALUE===============
      To be retrieved from the most recent pension calculator (approved by PenCom) used in paying clients */

  var rate = 0.0063;

  var PMT = parseFloat(
    (
      (FV * rate * Math.pow(1 + rate, userNper)) /
      (Math.pow(1 + rate, userNper) - 1)
    ).toFixed(2)
  );

  console.log("PMT= ", numberWithCommas(PMT));
  console.log("FV= ", numberWithCommas(FV));

  gauge.set(FV);
  console.log("typeof FV", typeof FV);

  if (typeof FV != "number" || isNaN(FV)) {
    p.innerHTML = "loading...";
  } else {
    p.innerHTML = "₦ " + numberWithCommas(FV);
  }

  document.getElementById("advise1").innerHTML =
    "You would be eligible to a lump sum of " +
    "₦ " +
    numberWithCommas((FV / 4).toFixed(2)) +
    " and a monthly pension of " +
    "₦ " +
    numberWithCommas(PMT);
  document.getElementById("advise2").innerHTML =
    "You can start making Voluntary Contributions of " +
    "₦ " +
    numberWithCommas(50000) +
    " to reach your desired Pension Balance at retirement";

  pMobileView1.innerHTML = "₦ " + numberWithCommas(FV);
  pMobileView2.innerHTML = "₦ " + numberWithCommas(FV);

  if (gender == "male") {
    document.getElementById("male_svg").style.display = "block";
    document.getElementById("female_svg").style.display = "none";
  } else {
    document.getElementById("female_svg").style.display = "block";
    document.getElementById("male_svg").style.display = "none";
  }

  var profileHTML = capitalizeFirstLetter(gender) + " retiring in ";

  if (
    ageArr[1] - ageArr[0] < 0 ||
    document.getElementById("current_age").value < 10
  ) {
    profileHTML += "? years";
  } else {
    profileHTML += numberWithCommas(ageArr[1] - ageArr[0]) + " years";
  }
  sumProfile.innerHTML = profileHTML;
  console.log;
  if (curPenValue == 0) {
    sumPensionBal.innerHTML = "₦ 0.00";
  } else {
    sumPensionBal.innerHTML = "₦ " + numberWithCommas(curPenValue);
  }

  sumIncome.innerHTML = "₦ " + numberWithCommas(monthlyIncome);
  sumDesPension.innerHTML = "₦ " + numberWithCommas(desiredAmt);

  console.log("typeof contrib = ", typeof contrib);

  if (typeof contrib != "number" || isNaN(contrib)) {
    sumContrib.innerHTML = "₦ ?";
  } else {
    sumContrib.innerHTML = "₦ " + numberWithCommas(contrib);
  }
}

//BUDGET PLANNER

var sumMonthlyIncome = document.getElementById("sum-monthly-income");
var sumHousingExpenses = document.getElementById("sum-housing-expenses");
var sumTransportationExpenses = document.getElementById(
  "sum-transportation-expenses"
);
var sumEducationExpenses = document.getElementById("sum-education-expenses");
var sumPersonalExpenses = document.getElementById("sum-personal-expenses");
var sumSavings = document.getElementById("sum-savings");

var income;
var housing;
var transportation;
var education;
var personal;
var savings;

var housingPercent;
var transportationPercent;
var educationPercent;
var personalPercent;
var savingsPercent;

var monthlyInc = 500000;
var otherIncome = 120000;
var rentMortgages = 20000;
var repairsMaintenance = 2000;
var waterGasElectricity = 2000;
var cableTv = 5000;
var domesticStaff = 20000;
var groceries = 10000;
var fuel = 10000;
var carRepairs = 10000;
var taxiCab = 0;
var carLoan = 0;
var carInsurance = 10000;
var schoolFees = 20000;
var supplies = 10000;
var clothing = 50000;
var medical = 40000;
var entertainment = 10000;
var family = 100000;
var phone = 20000;
var debtRepayment = 0;
var emergency = 20000;
var otherInvestment = 20000;
var retirement = 20000;
var travel = 20000;
var midTermGoals = 20000;
var longTermGoals = 20000;

(function assignBPValue() {
  document.getElementById("monthly_income").value = monthlyInc;
  document.getElementById("other_income").value = otherIncome;
  document.getElementById("rent_mortgages").value = rentMortgages;
  document.getElementById("repairs_maintenance").value = repairsMaintenance;
  document.getElementById("water_gas_electricity").value = waterGasElectricity;
  document.getElementById("cable_tv_internet").value = cableTv;
  document.getElementById("domestic_staff").value = domesticStaff;
  document.getElementById("groceries").value = groceries;
  document.getElementById("petrol_fuel").value = fuel;
  document.getElementById("car_repairs").value = carRepairs;
  document.getElementById("taxi_cab").value = taxiCab;
  document.getElementById("car_loan").value = carLoan;
  document.getElementById("car_insurance").value = carInsurance;
  document.getElementById("school_fees").value = schoolFees;
  document.getElementById("stationery_supplies").value = supplies;
  document.getElementById("clothing").value = clothing;
  document.getElementById("medical_healthcare").value = medical;
  document.getElementById("entertainment").value = entertainment;
  document.getElementById("family_allowances").value = family;
  document.getElementById("phone_calls").value = phone;
  document.getElementById("debt_repayment").value = debtRepayment;
  document.getElementById("emergency_fund").value = emergency;
  document.getElementById("other_investment").value = otherInvestment;
  document.getElementById("retirement").value = retirement;
  document.getElementById("travel").value = travel;
  document.getElementById("mid_term_goals").value = midTermGoals;
  document.getElementById("long_term_goals").value = longTermGoals;

  computeTotals();
})();

function computeTotals() {
  var incomeArr = document.getElementsByName("monIncome");
  var incomeTotal = 0;
  for (var i = 0; i < incomeArr.length; i++) {
    if (parseInt(incomeArr[i].value))
      incomeTotal += parseInt(incomeArr[i].value);
  }
  document.getElementById("income_total").innerHTML =
    "₦ " + numberWithCommas(incomeTotal.toFixed(2));

  document.getElementById("chart-amt").innerHTML =
    "₦" + numberWithCommas(incomeTotal.toFixed(2));

  sumMonthlyIncome.innerHTML = "₦ " + numberWithCommas(incomeTotal.toFixed(2));

  //housing
  var housingArr = document.getElementsByName("housing");
  var housingTotal = 0;
  for (var i = 0; i < housingArr.length; i++) {
    if (parseInt(housingArr[i].value))
      housingTotal += parseInt(housingArr[i].value);
  }
  document.getElementById("housing_total").innerHTML =
    "₦ " + numberWithCommas(housingTotal.toFixed(2));

  sumHousingExpenses.innerHTML =
    "₦ " + numberWithCommas(housingTotal.toFixed(2));

  //transportation
  var transportationArr = document.getElementsByName("transportation");
  var transportationTotal = 0;
  for (var i = 0; i < transportationArr.length; i++) {
    if (parseInt(transportationArr[i].value))
      transportationTotal += parseInt(transportationArr[i].value);
  }
  document.getElementById("transportation_total").innerHTML =
    "₦ " + numberWithCommas(transportationTotal.toFixed(2));

  sumTransportationExpenses.innerHTML =
    "₦ " + numberWithCommas(transportationTotal.toFixed(2));
  //education
  var educationArr = document.getElementsByName("education");
  var educationTotal = 0;
  for (var i = 0; i < educationArr.length; i++) {
    if (parseInt(educationArr[i].value))
      educationTotal += parseInt(educationArr[i].value);
  }
  document.getElementById("education_total").innerHTML =
    "₦ " + numberWithCommas(educationTotal.toFixed(2));

  sumEducationExpenses.innerHTML =
    "₦ " + numberWithCommas(educationTotal.toFixed(2));

  //personal
  var personalArr = document.getElementsByName("personal");
  var personalTotal = 0;
  for (var i = 0; i < personalArr.length; i++) {
    if (parseInt(personalArr[i].value))
      personalTotal += parseInt(personalArr[i].value);
  }
  document.getElementById("personal_total").innerHTML =
    "₦ " + numberWithCommas(personalTotal.toFixed(2));

  sumPersonalExpenses.innerHTML =
    "₦ " + numberWithCommas(personalTotal.toFixed(2));

  //savings
  var savingsArr = document.getElementsByName("savings");
  var savingsTotal = 0;
  for (var i = 0; i < savingsArr.length; i++) {
    if (parseInt(savingsArr[i].value))
      savingsTotal += parseInt(savingsArr[i].value);
  }

  sumSavings.innerHTML = "₦ " + numberWithCommas(savingsTotal.toFixed(2));

  document.getElementById("monthly_savings_total").innerHTML =
    "₦ " + numberWithCommas(savingsTotal.toFixed(2));

  var monthlyExpenses =
    housingTotal + transportationTotal + educationTotal + personalTotal;

  document.getElementById("monthly_expenses_total").innerHTML =
    "₦ " + numberWithCommas(monthlyExpenses.toFixed(2));

  var leftOverCash = incomeTotal - (monthlyExpenses + savingsTotal);

  document.getElementById("left_over_cash").innerHTML =
    "₦ " + numberWithCommas(leftOverCash.toFixed(2));

  income = incomeTotal;
  housing = housingTotal;
  transportation = transportationTotal;
  education = educationTotal;
  personal = personalTotal;
  savings = savingsTotal;

  housingPercent = (housing / income) * 100;
  transportationPercent = (transportation / income) * 100;
  educationPercent = (education / income) * 100;
  personalPercent = (personal / income) * 100;
  savingsPercent = (savings / income) * 100;

  var hSegment = document.getElementById("housing-segment");
  var tSegment = document.getElementById("transportation-segment");
  var eSegment = document.getElementById("education-segment");
  var pSegment = document.getElementById("personal-segment");
  var sSegment = document.getElementById("savings-segment");

  hSegment.style.transition =
    "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
  hSegment.style.strokeDasharray =
    housingPercent + " " + (100 - housingPercent);
  hSegment.style.strokeDashoffset = 25;

  tSegment.style.transition =
    "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
  tSegment.style.strokeDasharray =
    transportationPercent + " " + (100 - transportationPercent);
  tSegment.style.strokeDashoffset = 100 - housingPercent + 25;

  eSegment.style.transition =
    "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
  eSegment.style.strokeDasharray =
    educationPercent + " " + (100 - educationPercent);
  eSegment.style.strokeDashoffset =
    100 - (housingPercent + transportationPercent) + 25;

  pSegment.style.transition =
    "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
  pSegment.style.strokeDasharray =
    personalPercent + " " + (100 - personalPercent);
  pSegment.style.strokeDashoffset =
    100 - (housingPercent + transportationPercent + educationPercent) + 25;

  sSegment.style.transition =
    "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
  sSegment.style.strokeDasharray =
    savingsPercent + " " + (100 - savingsPercent);
  sSegment.style.strokeDashoffset =
    100 -
    (housingPercent +
      transportationPercent +
      educationPercent +
      personalPercent) +
    25;

  console.log(
    "income = ",
    income,
    "housingPercent = ",
    housingPercent,
    "transportationPercent = ",
    transportationPercent,
    "educationPercent = ",
    educationPercent,
    "personalPercent = ",
    personalPercent
  );
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// (function loadDonut() {
//   document.getElementById("bp-donut").innerHTML = `
//   <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut">
//   <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
//   <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" stroke-width="3"></circle>

//   <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#119bd2" stroke-width="3" stroke-dasharray=${housingPercent(
//     100 - housingPercent
//   )} stroke-dashoffset="25"></circle>
//   <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#8363f9" stroke-width="3" stroke-dasharray=${transportationPercent(
//     100 - transportationPercent
//   )} stroke-dashoffset=${100 - housingPercent + 25}></circle>

//   <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#fdc42a" stroke-width="3" stroke-dasharray=${educationPercent(
//     100 - educationPercent
//   )} stroke-dashoffset=${
//     100 - (housingPercent + transportationPercent) + 25
//   }></circle>

//   <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#fe67ad" stroke-width="3" stroke-dasharray=${personalPercent(
//     100 - personalPercent
//   )} stroke-dashoffset=${
//     100 - (housingPercent + transportationPercent + educationPercent) + 25
//   }></circle>

//   <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#b1c94e" stroke-width="3" stroke-dasharray=${savingsPercent(
//     100 - savingsPercent
//   )} stroke-dashoffset=${
//     100 -
//     (housingPercent +
//       transportationPercent +
//       educationPercent +
//       personalPercent) +
//     25
//   }></circle>

//   <g class="chart-text" id="chartvalue">
//       <text x="50%" y="50%" id="chart-amt" class="chart-number">

//       </text>
//       <text x="50%" y="50%" class="chart-label">
//         Income
//       </text>
//   </g>
//   </svg>
//   `;
// })();
