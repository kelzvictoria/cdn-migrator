// ENHANCED PENSION CALCULATOR

var canLog = false;

var useZeroes = true;
document.config = {
  gender: "male",
  ageArr: [18, 60],
  lumpSum: useZeroes ? 0 : 20000000,
  desiredAmt: useZeroes ? 0 : 300000,
  curPenValue: useZeroes ? 0 : 1000000,
  monthlyContrib: useZeroes ? 0 : 36000,
  voluntarilyContrib: useZeroes ? 0 : 0,
  monthlyIncome: useZeroes ? 0 : 200000,
};
var gender = document.config.gender;
var ageArr = document.config.ageArr;
var lumpSum = document.config.lumpSum;
var desiredAmt = document.config.desiredAmt;
var curPenValue = document.config.curPenValue;
var monthlyContrib = document.config.monthlyContrib;
var voluntarilyContrib = document.config.voluntarilyContrib;
//var contrib;
var monthlyIncome = document.config.monthlyIncome;
var projectedRSABalance;
var requiredRSABalance;
var monthlyShortfall;

var projectedLumpSum;
var projectedMonthlyPayment;

var p = document.getElementById("estimated_pension_value");
var pMobileView1 = document.getElementById("pmtView1");
var pMobileView2 = document.getElementById("pmtView2");

//var sumProfile = document.getElementById("sum-profile");
//var sumPensionBal = document.getElementById("sum-pension-bal");
//var sumIncome = document.getElementById("sum-income");
//var sumDesPension = document.getElementById("sum-des-pension");
//var sumContrib = document.getElementById("sum-contrib");

var userNper = 0;

function assignValue() {
  // desiredAmt = document.getElementById("desired-amt-mobile").value;
  // curPenValue = document.getElementById("current-amt-mobile").value;
  // monthlyContrib = document.getElementById("contribution-amt-mobile").value;

  gender = $('input[name="sex"]:checked').val();

  ageArr = [
    stripNonNumeric(document.getElementById("current_age").value),
    stripNonNumeric(document.getElementById("retirement_age").value),
  ];
  curPenValue = stripNonNumeric(document.getElementById("cpv").value);
  monthlyIncome = stripNonNumeric(document.getElementById("mi").value);
  lumpSum = stripNonNumeric(document.getElementById("desired_lump").value);
  desiredAmt = stripNonNumeric(document.getElementById("desired_amt").value);
  monthlyContrib = stripNonNumeric(document.getElementById("mc").value);
  voluntarilyContrib = stripNonNumeric(document.getElementById("vc").value);

  //parseFloat($("#cpv").val().replace(/,/g, "")).toLocaleString("en");

  //$("#age-slider-range").slider("option", "values", ageArr);
  //$("#lump-slider-range").slider("option", "value", lumpSum);
  //$("#amt-slider-range").slider("option", "value", desiredAmt);
  // $("#cpv-slider-range").slider("option", "value", curPenValue);
  // $("#mc-slider-range").slider("option", "value", monthlyContrib);
  // $("#vc-slider-range").slider("option", "value", voluntarilyContrib);
  // $("#mi-slider-range").slider("option", "value", monthlyIncome);

  calculatePMT();
}
/* Bind event handlers to gender */
var genderInputNodes = document.querySelectorAll('input[name="sex"]');
for (var i = 0; i < genderInputNodes.length; i++) {
  genderInputNodes[i].addEventListener("click", assignValue);
}
/* Bind event handlers to radio buttons */
var switchInputNodes = document.querySelectorAll(
  '.switch-field-input[name="goal-type"]'
);
for (var i = 0; i < switchInputNodes.length; i++) {
  switchInputNodes[i].addEventListener("change", switchInputChanged);
}
function switchInputChanged(event) {
  var switchInput = event.currentTarget;
  var goalID = event.currentTarget.getAttribute("for");
  //console.log("goalID=" + goalID);
  var goalContainers = document.querySelectorAll(".goal-container");
  for (var i = 0; i < goalContainers.length; i++) {
    if (goalContainers[i].getAttribute("id") == goalID) {
      goalContainers[i].classList.remove("display-none");
    } else {
      goalContainers[i].classList.add("display-none");
    }
  }
  calculatePMT();
}
/* Bind event handlers to slider inputs to update the associated range stop markers */
var sliderInputNodes = document.querySelectorAll(".slider-selected-value");
for (var i = 0; i < sliderInputNodes.length; i++) {
  sliderInputNodes[i].addEventListener("keyup", sliderInputChanged);
  sliderInputNodes[i].addEventListener("change", sliderInputChanged);
}
function sliderInputChanged(event) {
  var sliderInput = event.currentTarget;
  var sliderID = event.currentTarget.getAttribute("for");

  if (sliderInput.getAttribute("id") == "current_age") {
    $("#" + sliderID).slider(
      "values",
      0,
      stripNonNumeric($(sliderInput).val())
    );
  } else if (sliderInput.getAttribute("id") == "retirement_age") {
    $("#" + sliderID).slider(
      "values",
      1,
      stripNonNumeric($(sliderInput).val())
    );
  } else {
    $("#" + sliderID).slider("value", stripNonNumeric($(sliderInput).val()));
  }
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

      $("#lump-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        //console.log("lump-slider value=", value);
        //if (value !== 0) {
        lumpSum = value;
        //}
      });

      $("#amt-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        //console.log("amt-slider value=", value);
        //if (value !== 0) {
        desiredAmt = value;
        //}
      });

      $("#cpv-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        //if (value !== 0) {
        curPenValue = value;
        //}
      });

      $("#mc-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        //console.log("mc-slider value=", value, ', type=' + typeof value);
        //if (value !== 0) {
        monthlyContrib = value;
        //}
      });

      $("#vc-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        //if (value !== 0) {
        voluntarilyContrib = value;
        //}
      });

      $("#mi-slider-range").each(function () {
        var value = $(this).slider("option", "value");
        //if (value !== 0) {
        monthlyIncome = value;
        //}
      });

      calculatePMT();
    },
  })
  .slider();

function getPV(FV, rate, periods) {
  return periods > 0 ? FV / Math.pow(rate, periods) : FV;
}
function getFV(principal, rate, periods) {
  return periods > 0 ? principal * Math.pow(rate, periods) : principal;
}

// Ref: https://www.calculatorsoup.com/calculators/financial/future-value-cash-flows-calculator.php
function calculateFV(startDate, endDate, balance, contribution, rate) {
  var totalDays = daysBetween(startDate, endDate) - 1;
  var finalDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    startDate.getFullYear() == endDate.getFullYear()
      ? endDate.getDate()
      : startDate.getDate()
  );
  var periodCount = 0,
    dayCount = 0;

  var aFV = getFV(balance, rate, totalDays);
  var cFV = 0;
  var baseUnitFV = getFV(1, rate, totalDays);
  var weightedAvg = 0;
  var canLog = false;
  if (canLog) {
    console.log(
      "startDate:" +
        startDate +
        ", endDate:" +
        endDate +
        ", totalDays:" +
        totalDays
    );
  }
  do {
    var lastDayOfCurrentMonth = null;
    if (
      startDate.getFullYear() == finalDate.getFullYear() &&
      startDate.getMonth() == finalDate.getMonth()
    ) {
      lastDayOfCurrentMonth = finalDate;
    } else if (startDate.getMonth() == 11) {
      lastDayOfCurrentMonth = new Date(startDate.getFullYear() + 1, 0, 0);
    } else {
      lastDayOfCurrentMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );
    }
    var daysInMonth = lastDayOfCurrentMonth.getDate() - startDate.getDate() + 1;
    var adjustFactor = daysInMonth / lastDayOfCurrentMonth.getDate();
    var c = getFV(contribution, rate, totalDays - dayCount);
    cFV += c;

    var unitFV = getFV(1, rate, totalDays - dayCount);
    weightedAvg =
      unitFV > 0
        ? (unitFV / baseUnitFV + weightedAvg * periodCount) / (periodCount + 1)
        : weightedAvg;

    if (canLog) {
      console.log(
        "[" +
          periodCount +
          "]: cFV:" +
          c +
          ", dayCount:" +
          dayCount +
          ", daysInMonth:" +
          daysInMonth +
          ", adjustFactor:" +
          adjustFactor
      );
    }
    //console.log('unitFV:' + unitFV + ', weightedAvg:'+weightedAvg)
    startDate =
      startDate.getMonth() == 11
        ? new Date(startDate.getFullYear() + 1, 0, 1)
        : new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    dayCount += daysInMonth;
    periodCount++;
  } while (startDate < endDate);
  if (canLog) {
    console.log(
      "startDate:" +
        startDate +
        ", endDate:" +
        endDate +
        ", totalDays:" +
        totalDays
    );
  }
  var values = {
    balanceFV: aFV,
    contributionFV: cFV,
    weightedAvg: weightedAvg,
  };
  if (canLog) {
    console.log("FV Values:", values);
  }
  return values;
}

function calculatePMT() {
  var contrib = parseFloat(monthlyContrib) + parseFloat(voluntarilyContrib);
  //setMaxGuageValue();
  //guaugeMaxValue = desiredAmt * 20 * 12;
  //console.log("guageMaxValue=", guaugeMaxValue);
  if (canLog) {
    console.log(
      "ageArr= ",
      ageArr,
      ", lumpSum= ",
      lumpSum,
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
  }

  var a = curPenValue;
  var x = monthlyContrib;
  var y = voluntarilyContrib;

  //var z = parseFloat(x) + parseFloat(y);

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

  if (canLog) {
    console.log("userNper= ", userNper);
  }

  var activeYears = Math.max(1, retirementAge - currentAge);
  var n = activeYears * 365;

  var now = new Date();

  //var startDate = new Date(now.getFullYear(), 0, 1);
  var startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  var endDate =
    startDate.getMonth() == 11
      ? new Date(startDate.getFullYear() + activeYears + 1, 0, 1)
      : new Date(
          startDate.getFullYear() + activeYears,
          startDate.getMonth(),
          1
        );
  var fvValues = calculateFV(startDate, endDate, a + y, x, r);
  projectedRSABalance = fvValues.balanceFV + fvValues.contributionFV;
  var weightedAvg = fvValues.weightedAvg;

  var m = activeYears * 12;

  // console.log("a after loop=", a);
  if (canLog) {
    console.log("after projectedRSABalance+z= ", projectedRSABalance);
  }
  /* 
      =====================================MONTHLY PAYMENT PLAN AFTER FUTURE VALUE===============
      To be retrieved from the most recent pension calculator (approved by PenCom) used in paying clients */

  var rate = 0.0063;

  var derivedLumpSum = projectedRSABalance / 4;

  var PMT =
    ((projectedRSABalance - derivedLumpSum) *
      rate *
      Math.pow(1 + rate, userNper)) /
    (Math.pow(1 + rate, userNper) - 1);

  //final result guage meter start
  var inLumpSumMode =
    document.querySelector('input[name="goal-type"]:checked').value ==
    "lumpsum";
  //requiredRSABalance = inLumpSumMode ? lumpSum * 4 : (desiredAmt * userNper) / 0.75;
  if (inLumpSumMode) {
    requiredRSABalance = lumpSum * 4;
  } else {
    // Refactor the PMT calculation avove to solve for the base value
    requiredRSABalance =
      (desiredAmt * (Math.pow(1 + rate, userNper) - 1)) /
      (rate * Math.pow(1 + rate, userNper));
    // Then add the 25% lump sum back into it
    requiredRSABalance /= 0.75;
  }

  var activeMonths = activeYears * 12;
  monthlyShortfall = Math.max(
    0,
    getPV(requiredRSABalance - projectedRSABalance, r, n) / activeMonths
  );
  if (monthlyShortfall > 0) {
    if (weightedAvg > 0) {
      monthlyShortfall /= weightedAvg;
    }
    var ms = new Number(monthlyShortfall);
    monthlyShortfall = ms.toPrecision(2) * 1; //ms.toString(2))
  }

  var guaugeMaxValue = 100;

  projectedLumpSum = derivedLumpSum;
  projectedMonthlyPayment = PMT;

  if (canLog) {
    console.log("lumpSum=" + lumpSum + ", typeof=" + typeof lumpSum);
    console.log(
      "currentAge=" + currentAge + ", retirementAge=" + retirementAge
    );
    console.log(
      "activeMonths=" + activeMonths + ", monthlyShortfall=" + monthlyShortfall
    );
    console.log(
      "requiredRSABalance=" +
        requiredRSABalance.toFixed(0) +
        ", projectedRSABalance=" +
        projectedRSABalance.toFixed(0)
    );
    console.log(
      "projectedLumpSum= ",
      projectedLumpSum.toFixed(0),
      ", projectedMonthlyPayment= ",
      projectedMonthlyPayment.toFixed(0)
    );
  }

  var firstTick = (14 / 100) * guaugeMaxValue;
  var secondTick = (20 / 100) * guaugeMaxValue;
  var thirdTick = (80 / 100) * guaugeMaxValue;
  var fourthTick = (86 / 100) * guaugeMaxValue;

  var opts = {
    // color configs
    // colorStart: "#6fadcf",
    // colorStop: void 0,
    // gradientType: 0,
    // strokeColor: "#e0e0e0",
    // generateGradient: true,
    // percentColors: [
    //   [0.0, "#a9d70b"],
    //   [0.5, "#f9c802"],
    //   [1.0, "#ff0000"],
    // ],

    // customize pointer
    pointer: {
      length: 0.8,
      strokeWidth: 0.055,
      iconScale: 1.0,
      color: "#0033a1",
    },

    // static labels
    staticLabels: {
      font: "10px sans-serif",
      labels: [
        0,
        guaugeMaxValue * 0.25,
        guaugeMaxValue * 0.5,
        guaugeMaxValue * 0.75,
        guaugeMaxValue,
      ],
      fractionDigits: 0,
      format: function (value) {
        return typeof value == "number"
          ? numberWithCommas(value.toFixed(0)) + "%"
          : value;
      },
    },

    // static zones
    staticZones: [
      { strokeStyle: "#E74C3C", min: 0, max: firstTick },
      { strokeStyle: "#fbc5bf", min: firstTick, max: secondTick },
      { strokeStyle: "#d2e8fb", min: secondTick, max: thirdTick },
      { strokeStyle: "#98d4b1", min: thirdTick, max: fourthTick },
      { strokeStyle: "#25C769", min: fourthTick, max: guaugeMaxValue },
    ],

    // render ticks
    renderTicks: {
      // divisions: 5,
      divWidth: 1.8,
      divLength: 0.9,
      // divColor: "#F7F8FC",
      // subDivisions: 3,
      subLength: 0.5,
      subWidth: 0.6,
      // subColor: "#F7F8FC",
    },

    // the span of the gauge arc
    angle: 0.15,

    // line thickness
    lineWidth: 0.44,

    // radius scale
    radiusScale: 1.0,

    // font size
    fontSize: 40,

    // if false, max value increases automatically if value > maxValue
    limitMax: true,

    // if true, the min value of the gauge will be fixed
    limitMin: true,

    // High resolution support
    highDpiSupport: true,
  };
  var target = document.getElementById("epc_canvas");
  var gauge = new Gauge(target).setOptions(opts);

  document.getElementById("preview-textfield").className = "preview-textfield";
  gauge.setTextField(document.getElementById("preview-textfield"));

  gauge.maxValue = guaugeMaxValue;
  gauge.setMinValue(0);

  gauge.animationSpeed = 32;

  /*console.log(
    "projectedRSABalance: ",
    projectedRSABalance,
    "requiredRSABalance: ",
    requiredRSABalance,
    "projectedRSABalance * 100: ",
    projectedRSABalance * 100,
    "(projectedRSABalance / requiredRSABalance) * 100",
    (projectedRSABalance / requiredRSABalance) * 100
  );*/

  /* if (requiredRSABalance == 0) {
    gauge.set(projectedRSABalance * 100);
  } else {*/
  gauge.set((projectedRSABalance / requiredRSABalance) * 100);
  /*}*/

  //final result guage meter end
  //console.log("projectedRSABalance:" + projectedRSABalance +", typeof projectedRSABalance", typeof projectedRSABalance);

  if (typeof projectedRSABalance != "number" || isNaN(projectedRSABalance)) {
    p.innerHTML = "loading...";
  } else {
    p.innerHTML = "&#8358; " + numberWithCommas(projectedRSABalance.toFixed(0));

    p.classList.remove("positive");
    p.classList.remove("negative");
    if (projectedRSABalance >= requiredRSABalance * 0.8) {
      p.classList.add("positive");
    } else if (projectedRSABalance <= requiredRSABalance * 0.2) {
      p.classList.add("negative");
    }
  }
  var getResultBtn = document.getElementById("get-result-modalbtn");
  //console.log('lumpSum:' + lumpSum + ', desiredAmt:'+desiredAmt+ ', inLumpSumMode:'+inLumpSumMode)

  if ((lumpSum > 0 && inLumpSumMode) || (desiredAmt > 0 && !inLumpSumMode)) {
    adviceSummary = generateEPCAdvice(
      lumpSum,
      projectedLumpSum,
      desiredAmt,
      projectedMonthlyPayment,
      monthlyShortfall,
      inLumpSumMode
    );
    getResultBtn.disabled = false;
  } else {
    adviceSummary = generateDefaultEPCAdvice();
    getResultBtn.disabled = true;
  }

  document.getElementById("advise").innerHTML = adviceSummary;

  pMobileView1.innerHTML =
    "&#8358; " + numberWithCommas(projectedRSABalance.toFixed(0));
  pMobileView2.innerHTML =
    "&#8358; " + numberWithCommas(projectedRSABalance.toFixed(0));

  var maleSVG = document.getElementById("male_svg");
  var femaleSVG = document.getElementById("female_svg");
  if (maleSVG && femaleSVG) {
    if (gender == "male") {
      maleSVG.style.display = "block";
      femaleSVG.style.display = "none";
    } else {
      femaleSVG.style.display = "block";
      maleSVG.style.display = "none";
    }
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
  //sumProfile.innerHTML = profileHTML;
  //console.log(1233333);
  if (curPenValue == 0) {
    //sumPensionBal.innerHTML = "&#8358; 0.00";
  } else {
    //sumPensionBal.innerHTML = "&#8358; " + numberWithCommas(curPenValue);
  }

  //sumIncome.innerHTML = "&#8358; " + numberWithCommas(monthlyIncome);
  //sumDesPension.innerHTML = "&#8358; " + numberWithCommas(desiredAmt);

  //console.log("typeof contrib = ", typeof contrib);

  if (typeof contrib != "number" || isNaN(contrib)) {
    // sumContrib.innerHTML = "&#8358; ?";
  } else {
    //sumContrib.innerHTML = "&#8358; " + numberWithCommas(contrib);
  }
}
function generateEPCAdvice(
  lumpSum,
  projectedLumpSum,
  desiredAmt,
  projectedMonthlyPayment,
  monthlyShortfall,
  inLumpSumMode
) {
  var adviceSummary;
  if (inLumpSumMode) {
    if (projectedRSABalance < 550000) {
      adviceSummary =
        "<p>The total amount of your Pension would be paid to you en bloc as it is less than <b>&#8358;550,000.00</b></p>";
    } else {
      adviceSummary =
        "<p>You would be eligible for an estimated lump sum of <b>&#8358;" +
        numberWithCommas(projectedLumpSum.toFixed(0)) +
        "</b> " +
        "and a monthly pension of <b>&#8358;" +
        numberWithCommas(projectedMonthlyPayment.toFixed(0)) +
        "</b>.</p>";
    }
  } else {
    if (projectedRSABalance < 550000) {
      adviceSummary =
        "<p>The total amount of your Pension would be paid to you en bloc as it is less than <b>&#8358;550,000.00</b></p>";
    } else {
      adviceSummary =
        "<p>You would be eligible for an estimated monthly pension of <b>&#8358;" +
        numberWithCommas(projectedMonthlyPayment.toFixed(0)) +
        "</b></p>";
    }
  }
  if (monthlyShortfall.toFixed(0) > 0) {
    if (inLumpSumMode) {
      adviceSummary +=
        "<p>To attain your desired lump sum of <b>&#8358;" +
        numberWithCommas(lumpSum.toFixed(0)) +
        "</b>, you would need to make additional monthly Voluntary Contributions of <i>&#8358;" +
        numberWithCommas(monthlyShortfall.toFixed(0)) +
        "</i> from now until retirement.</p>";
    } else {
      adviceSummary +=
        "<p>To attain your monthly payment of <b>&#8358;" +
        numberWithCommas(desiredAmt.toFixed(0)) +
        "</b>, you would need to make additional monthly Voluntary Contributions of <i>&#8358;" +
        numberWithCommas(monthlyShortfall.toFixed(0)) +
        "</i> from now until retirement.</p>";
    }
  } else {
    adviceSummary +=
      "<p>Well done! You are in the right direction in attaining your financial goals! " +
      "You may explore other investment opportunities if you wish to exceed your goals.</p>";
  }
  return adviceSummary;
}
function generateDefaultEPCAdvice() {
  return "<p>To see our recommendations, please provide values in the Contribution or Savings tabs, and state your retirement goal in the Goals tab.</p";
  ("<p>To see our recommendations, please provide values in the Contribution or Savings tabs, and state your retirement goal in the Goals tab.</p");
  /*"<p>To see our recommendations, please specify your retirement goal in the Goal tab.</p>";*/
}

function sendData(event) {
  event.preventDefault();
  var inLumpSumMode =
    document.querySelector('input[name="goal-type"]:checked').value ==
    "lumpsum";
  var data = {
    _csrf: document.getElementById("_csrf").value,
    type: "pension-calculator",
    email_address: document.getElementById("email").value,
    gender: gender == "male" ? "M" : "F",
    current_age: ageArr[0] || 0,
    retirement_age: ageArr[1] || 0,
    monthly_income: monthlyIncome
      ? numberWithCommas(monthlyIncome.toFixed(0))
      : 0,
    monthly_contribution: monthlyContrib
      ? numberWithCommas(monthlyContrib.toFixed(0))
      : 0,
    rsa_balance: curPenValue ? numberWithCommas(curPenValue.toFixed(0)) : 0,
    vc_balance: voluntarilyContrib
      ? numberWithCommas(voluntarilyContrib.toFixed(0))
      : 0,
    goal_type: inLumpSumMode ? "lumpsum" : "withdrawal",
    target_lump_sum: lumpSum ? numberWithCommas(lumpSum.toFixed(0)) : 0,
    target_monthly_pension: desiredAmt
      ? numberWithCommas(desiredAmt.toFixed(0))
      : 0,
    projected_rsa_balance: projectedRSABalance
      ? numberWithCommas(projectedRSABalance.toFixed(0))
      : 0,
    required_rsa_balance: requiredRSABalance
      ? numberWithCommas(requiredRSABalance.toFixed(0))
      : 0,
    monthly_contribution_shortfall: monthlyShortfall
      ? numberWithCommas(monthlyShortfall.toFixed(0))
      : 0,
    projected_lump_sum: projectedLumpSum
      ? numberWithCommas(projectedLumpSum.toFixed(0))
      : 0,
    projected_monthly_payment: projectedMonthlyPayment
      ? numberWithCommas(projectedMonthlyPayment.toFixed(0))
      : 0,
    is_consent_given: document.getElementById("checker").checked,
    image_url: target.toDataURL(),
  };

  var sendButton = document.getElementById("send-result");
  sendButton.disabled = true;
  $.ajax({
    type: "POST",
    url: "./send-summary",
    data: data,
  })
    .done(closeModal)
    .always(function () {
      sendButton.disabled = false;
    });
}
var sendSummaryForm = document.getElementById("send-result-form");
if (sendSummaryForm) {
  sendSummaryForm.addEventListener("submit", sendData);
}

// function onFocus() {
//   $("#cpv").on("click", function () {
//     var x = $("#cpv").val();
//     $("#cpv").val(addCommas(x));
//   });
//}
