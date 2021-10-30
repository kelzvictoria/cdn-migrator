//BUDGET PLANNER

var canLog = false;

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

var useZeroes = true;
var monthlyInc = useZeroes ? 0 : 500000;
var otherIncome = useZeroes ? 0 : 120000;
var rentMortgages = useZeroes ? 0 : 125000;
var repairsMaintenance = useZeroes ? 0 : 10000;
var waterGasElectricity = useZeroes ? 0 : 25000;
var cableTv = useZeroes ? 0 : 15000;
var domesticStaff = useZeroes ? 0 : 20000;
var groceries = useZeroes ? 0 : 50000;
var fuel = useZeroes ? 0 : 20000;
var carRepairs = useZeroes ? 0 : 10000;
var taxiCab = useZeroes ? 0 : 0;
var carLoan = useZeroes ? 0 : 0;
var carInsurance = useZeroes ? 0 : 10000;
var schoolFees = useZeroes ? 0 : 50000;
var supplies = useZeroes ? 0 : 25000;
var clothing = useZeroes ? 0 : 10000;
var medical = useZeroes ? 0 : 20000;
var entertainment = useZeroes ? 0 : 10000;
var family = useZeroes ? 0 : 50000;
var phone = useZeroes ? 0 : 20000;
var debtRepayment = useZeroes ? 0 : 0;
var emergency = useZeroes ? 0 : 10000;
var otherInvestment = useZeroes ? 0 : 20000;
var retirement = useZeroes ? 0 : 40000;
var travel = useZeroes ? 0 : 20000;
var midTermGoals = useZeroes ? 0 : 20000;
var longTermGoals = useZeroes ? 0 : 20000;
var leftOverCash;

function assignBPValue() {
  if (!document.getElementById("monthly_income")) {
    return;
  }
  document.getElementById("monthly_income").value = numberWithCommas(
    monthlyInc
  );
  document.getElementById("other_income").value = numberWithCommas(otherIncome);
  document.getElementById("rent_mortgages").value = numberWithCommas(
    rentMortgages
  );
  document.getElementById("repairs_maintenance").value = numberWithCommas(
    repairsMaintenance
  );
  document.getElementById("water_gas_electricity").value = numberWithCommas(
    waterGasElectricity
  );
  document.getElementById("cable_tv_internet").value = numberWithCommas(
    cableTv
  );
  document.getElementById("domestic_staff").value = numberWithCommas(
    domesticStaff
  );
  document.getElementById("groceries").value = numberWithCommas(groceries);
  document.getElementById("petrol_fuel").value = numberWithCommas(fuel);
  document.getElementById("car_repairs").value = numberWithCommas(carRepairs);
  document.getElementById("taxi_cab").value = numberWithCommas(taxiCab);
  document.getElementById("car_loan").value = numberWithCommas(carLoan);
  document.getElementById("car_insurance").value = numberWithCommas(
    carInsurance
  );
  document.getElementById("school_fees").value = numberWithCommas(schoolFees);
  document.getElementById("stationery_supplies").value = numberWithCommas(
    supplies
  );
  document.getElementById("clothing").value = numberWithCommas(clothing);
  document.getElementById("medical_healthcare").value = numberWithCommas(
    medical
  );
  document.getElementById("entertainment").value = numberWithCommas(
    entertainment
  );
  document.getElementById("family_allowances").value = numberWithCommas(family);
  document.getElementById("phone_calls").value = numberWithCommas(phone);
  document.getElementById("debt_repayment").value = numberWithCommas(
    debtRepayment
  );
  document.getElementById("emergency_fund").value = numberWithCommas(emergency);
  document.getElementById("other_investment").value = numberWithCommas(
    otherInvestment
  );
  document.getElementById("retirement").value = numberWithCommas(retirement);
  document.getElementById("travel").value = numberWithCommas(travel);
  document.getElementById("mid_term_goals").value = numberWithCommas(
    midTermGoals
  );
  document.getElementById("long_term_goals").value = numberWithCommas(
    longTermGoals
  );

  computeTotals();
}

function computeTotals() {
  var incomeArr = document.getElementsByName("monIncome");

  var incomeTotal = 0;
  for (var i = 0; i < incomeArr.length; i++) {
    if (parseInt(incomeArr[i].value))
      /*console.log(
        "stripNonNumeric(incomeArr[i].value)= ",
        stripNonNumeric(incomeArr[i].value)
      );*/
      incomeTotal += parseInt(stripNonNumeric(incomeArr[i].value));
    /*console.log("incomeTotal= ", incomeTotal);*/
  }
  document.getElementById("income_total").innerHTML =
    "₦ " + numberWithCommas(incomeTotal.toFixed(0));

  //document.getElementById("chart-amt").innerHTML =
  document.getElementById("chart-amt").textContent =
    "₦" + numberWithCommas(incomeTotal.toFixed(0));

  //sumMonthlyIncome.innerHTML = "₦ " + numberWithCommas(incomeTotal.toFixed(0));

  //housing
  var housingArr = document.getElementsByName("housing");
  var housingTotal = 0;
  for (var i = 0; i < housingArr.length; i++) {
    if (parseInt(housingArr[i].value))
      housingTotal += parseInt(stripNonNumeric(housingArr[i].value));
  }
  document.getElementById("housing_total").innerHTML =
    "₦ " + numberWithCommas(housingTotal.toFixed(0));

  //sumHousingExpenses.innerHTML =
  "₦ " + numberWithCommas(housingTotal.toFixed(0));

  //transportation
  var transportationArr = document.getElementsByName("transportation");
  var transportationTotal = 0;
  for (var i = 0; i < transportationArr.length; i++) {
    if (parseInt(transportationArr[i].value))
      transportationTotal += parseInt(
        stripNonNumeric(transportationArr[i].value)
      );
  }
  document.getElementById("transportation_total").innerHTML =
    "₦ " + numberWithCommas(transportationTotal.toFixed(0));

  //sumTransportationExpenses.innerHTML =
  "₦ " + numberWithCommas(transportationTotal.toFixed(0));
  //education
  var educationArr = document.getElementsByName("education");
  var educationTotal = 0;
  for (var i = 0; i < educationArr.length; i++) {
    if (parseInt(educationArr[i].value))
      educationTotal += parseInt(stripNonNumeric(educationArr[i].value));
  }
  document.getElementById("education_total").innerHTML =
    "₦ " + numberWithCommas(educationTotal.toFixed(0));

  //sumEducationExpenses.innerHTML =
  "₦ " + numberWithCommas(educationTotal.toFixed(0));

  //personal
  var personalArr = document.getElementsByName("personal");
  var personalTotal = 0;
  for (var i = 0; i < personalArr.length; i++) {
    if (parseInt(personalArr[i].value))
      personalTotal += parseInt(stripNonNumeric(personalArr[i].value));
  }
  document.getElementById("personal_total").innerHTML =
    "₦ " + numberWithCommas(personalTotal.toFixed(0));

  //sumPersonalExpenses.innerHTML =
  "₦ " + numberWithCommas(personalTotal.toFixed(0));

  //savings
  var savingsArr = document.getElementsByName("savings");
  var savingsTotal = 0;
  for (var i = 0; i < savingsArr.length; i++) {
    if (parseInt(savingsArr[i].value))
      savingsTotal += parseInt(stripNonNumeric(savingsArr[i].value));
  }
  retirement = parseInt(stripNonNumeric(document.getElementById("retirement").value));
  
  //sumSavings.innerHTML = "₦ " + numberWithCommas(savingsTotal.toFixed(0));

  document.getElementById("monthly_savings_total").innerHTML =
    "₦ " + numberWithCommas(savingsTotal.toFixed(0));

  var monthlyExpenses =
    housingTotal + transportationTotal + educationTotal + personalTotal;

  document.getElementById("monthly_expenses_total").innerHTML =
    "₦ " + numberWithCommas(monthlyExpenses.toFixed(0));

  leftOverCash = incomeTotal - (monthlyExpenses + savingsTotal);
  var leftOverCashEl = document.getElementById("left_over_cash");
  leftOverCashEl.innerHTML = "₦ " + numberWithCommas(leftOverCash.toFixed(0));

  leftOverCashEl.classList.remove("positive");
  leftOverCashEl.classList.remove("negative");
  if (leftOverCash > 0) {
    leftOverCashEl.classList.add("positive");
  } else if (leftOverCash < 0) {
    leftOverCashEl.classList.add("negative");
  }

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

  if (canLog) {
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

  var isAllZero =
    income == 0 &&
    housing == 0 &&
    transportation == 0 &&
    education == 0 &&
    personal == 0 &&
    savings == 0;
  var adviceSummary = "";
  if (!isAllZero) {
    //document.getElementById("bp-advise").style.display = "block";
    //document.getElementById("left_over_cash").style.display = "none";
    var emphasis = leftOverCash > 0 ? "b" : "i";
    if (canLog) {
        console.log(
        "leftOverCash=",
        leftOverCash,
        "typeof leftOverCash",
        typeof leftOverCash
        );
    }
    adviceSummary = generateBPAdvice(leftOverCash, savingsTotal, retirement)

    /*adviceSummary =
      "It appears you still have <" +
      emphasis +
      ">&#8358;" +
      numberWithCommas(leftOverCash.toFixed(0)) +
      "</" +
      emphasis +
      "> left over after your monthly expenses and savings.";
    if (leftOverCash > 0) {
      adviceSummary +=
        "We recommend you put half of this into your voluntary contributions, that way, you save more towards your retirement.";
    }*/
  } else {
    adviceSummary = generateDefaultBPAdvice();
  }

  document.getElementById("advise").innerHTML = adviceSummary;
}

assignBPValue();

function generateBPAdvice(leftOverCash, savingsTotal, retirementSavings) {
    var adviceSummary;
    if (leftOverCash < 0) {
        if (savingsTotal == 0) {
            adviceSummary = "<p>Your budget is at a deficit. We suggest you review your expenses and set aside " +
                "savings to shelter you for the rainy day.</p>";
        } else {
            adviceSummary = "<p>Your budget is at a deficit. " +
                "We suggest that you review your expenses to prevent financial strain " +
                "whilst you continue to put money aside for your savings.</p>";
        }
    } else if (leftOverCash == 0) {
        if (savingsTotal != 0) {
            adviceSummary = 
                "<p>Well done on maximizing your budget! Review your savings and ensure your " +
                "retirement plans are being met by using the Pension Calculator.</p>";
        } else {
            adviceSummary = "<p>You have fully utilized your income with no consideration " +
                "for savings. We suggest you review your expenses and set aside money for the rainy day.</p>";
        }
    } else if (leftOverCash > 0) {
        if (savingsTotal != 0) {
            adviceSummary =
                "<p>You still have a surplus amount of <b>" +
                "&#8358;" +
                numberWithCommas(leftOverCash.toFixed(0)) +
                "</b>. " +
                "Why not boost your retirement savings today through " + (retirementSavings > 0 ? "additional " : "") + "Voluntary Contributions? Our Pension Calculator can estimate the future value of your RSA balance.</p>";
        } else {
            adviceSummary = "<p>You have a surplus amount of <b>&#8358;" + 
                numberWithCommas(leftOverCash.toFixed(0)) +
                "</b>. Why not set aside savings for the rainy day?</p>";
        }
    }
    return adviceSummary;
}
function generateDefaultBPAdvice() {
    return "<p>To see our recommendation, please fill the fields in each of the tabs</p>";
}

function svgToPng(selector, callback) {
  var img = new Image();
  img.onload = function (e) {
    var canvas = document.createElement("canvas");
    canvas.width = 300; //img.naturalWidth;
    canvas.height = 300; //img.naturalHeight;
    var ctxt = canvas.getContext("2d");
    ctxt.fillStyle = "#fff";
    ctxt.fillRect(0, 0, canvas.width, canvas.height);
    try {
        ctxt.drawImage(img, 0, 0);
        callback(selector, canvas.toDataURL("image/png"));
    } catch (e) {
        console.warn('Cannot convert SVG to PNG. Using data URI as is');
        callback(selector, img.src);
    }
  };
  var innerSvg = document.querySelector(selector);
  var svgText = new XMLSerializer().serializeToString(innerSvg);
  //img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svgText);
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgText)));
}

function sendData(event) {
  event.preventDefault();

  var data = {
    _csrf: document.getElementById("_csrf").value,
    type: "budget-planner",
    email_address: document.getElementById("email")
      .value /*
        salary_income: monthlyInc ? numberWithCommas(monthlyInc.toFixed(0)) : 0,
        other_income: otherIncome ? numberWithCommas(otherIncome.toFixed(0)) : 0,
        rent_loan_expense: rentMortgages ? numberWithCommas(rentMortgages.toFixed(0)) : 0,
        home_maintenance_expense: repairsMaintenance ? numberWithCommas(repairsMaintenance.toFixed(0)) : 0,
        utility_expense: waterGasElectricity ? numberWithCommas(waterGasElectricity.toFixed(0)) : 0,
        cable_tv_expense: cableTv ? numberWithCommas(cableTv.toFixed(0)) : 0,
        domestic_staff_expense: domesticStaff ? numberWithCommas(domesticStaff.toFixed(0)) : 0,
        groceries_expense: groceries ? numberWithCommas(groceries.toFixed(0)) : 0,
        vehicle_fuel_expense: fuel ? numberWithCommas(fuel.toFixed(0)) : 0,
        vehicle_maintenance_expense: carRepairs ? numberWithCommas(carRepairs.toFixed(0)) : 0,
        vehicle_taxi_expense: taxiCab ? numberWithCommas(taxiCab.toFixed(0)) : 0,
        vehicle_loan_expense: carLoan ? numberWithCommas(carLoan.toFixed(0)) : 0,
        vehicle_insurance_expense: carInsurance ? numberWithCommas(carInsurance.toFixed(0)) : 0,
        school_fees_expense: schoolFees ? numberWithCommas(schoolFees.toFixed(0)) : 0,
        school_supplies_expense: supplies ? numberWithCommas(supplies.toFixed(0)) : 0,
        clothing_expense: clothing ? numberWithCommas(clothing.toFixed(0)) : 0,
        healthcare_expense: medical ? numberWithCommas(medical.toFixed(0)) : 0,
        entertainment_expense: entertainment ? numberWithCommas(entertainment.toFixed(0)) : 0,
        dependants_expense: family ? numberWithCommas(family.toFixed(0)) : 0,
        phone_bill_expenses: phone ? numberWithCommas(phone.toFixed(0)) : 0,
        debt_repayment_expenses: debtRepayment ? numberWithCommas(debtRepayment.toFixed(0)) : 0,
        emergency_savings: emergency ? numberWithCommas(emergency.toFixed(0)) : 0,
        investment_savings: otherInvestment ? numberWithCommas(otherInvestment.toFixed(0)) : 0,
        voluntary_retirement_savings: retirement ? numberWithCommas(retirement.toFixed(0)) : 0,
        travel_savings: travel ? numberWithCommas(travel.toFixed(0)) : 0,
        mid_term_goals_savings: midTermGoals ? numberWithCommas(midTermGoals.toFixed(0)) : 0,
        long_term_goals_savings: longTermGoals ? numberWithCommas(longTermGoals.toFixed(0)) : 0,*/,

    total_income: income ? numberWithCommas(income.toFixed(0)) : 0,
    total_housing: housing ? numberWithCommas(housing.toFixed(0)) : 0,
    total_transportation: transportation
      ? numberWithCommas(transportation.toFixed(0))
      : 0,
      total_education: education ? numberWithCommas(education.toFixed(0)) : 0,
      total_personal: personal ? numberWithCommas(personal.toFixed(0)) : 0,
      total_savings: savings ? numberWithCommas(savings.toFixed(0)) : 0,
    retirement_savings: retirement ? numberWithCommas(retirement.toFixed(0)) : 0,
    leftover: leftOverCash ? numberWithCommas(leftOverCash.toFixed(0)) : 0,
    is_consent_given: document.getElementById("checker").checked,
    image_url: null,
  };
  
  svgToPng("#svgcontainer svg", function (selector, dataUrl) {
    data.image_url = dataUrl;
    var sendButton = document.getElementById("send-result");
    sendButton.disabled = true;
    $.ajax({
      type: "POST",
      url: "./send-summary",
      data: data,
    })
      .done(closeBPModal)
      .always(function () {
        sendButton.disabled = false;
      });
  });
}
var sendSummaryForm = document.getElementById("send-result-form");
if (sendSummaryForm) {
  sendSummaryForm.addEventListener("submit", sendData);
}
