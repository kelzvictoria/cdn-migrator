// var chartValue = 0.0;
// //let max = 5000000.0;

// var yb = {
//   id: function (str) {
//     return document.getElementById(str);
//   },
// };

// function showChartValue() {
//   if (yb.id("chart-amt")) {
//     yb.id("chart-amt").innerHTML = "₦ " + chartValue.toFixed(2);
//   }
// }

// showChartValue();
//setProgress();

// yb.id('slider').oninput = function(){showSliderValue(); setProgress()};
// yb.id('slider').onchange = function(){showSliderValue(); setProgress()};

// function setProgress() {
//   var radius = yb.id("progress").getAttribute("r");
//   var circumference = 2 * Math.PI * radius;

//   var progress_in_percent = (chartValue * 100) / max;
//   console.log("progress_in_percent:", progress_in_percent);
//   var progress_in_pixels = (circumference * (100 - progress_in_percent)) / 100;
//   console.log("progress_in_pixels:", progress_in_pixels);
//   yb.id("progress").style.strokeDashoffset = progress_in_pixels + "px";

//   if (yb.id("slider").value < 25) {
//     yb.id("progress").style.stroke = "red";
//     yb.id("chart-amt").style.color = "red";
//   } else if (yb.id("slider").value >= 75) {
//     yb.id("progress").style.stroke = "#7df";
//     yb.id("chart-amt").style.color = "#7df";
//   } else {
//     yb.id("progress").style.stroke = "gold";
//     yb.id("chart-amt").style.color = "gold";
//   }
// }

// var canvas = document.getElementById("progressbg");
// var context = canvas.getContext("2d");

// // centre or center for US :) the drawing
// var w = canvas.width / 2;
// var h = canvas.height / 2;

// var housingBudget = (housingTotal / incomeTotal) * 360;
// var transportationBudget = (transportationTotal / incomeTotal) * 360;
// var educationBudget = (educationTotal / incomeTotal) * 360;
// var personalBudget = (personalTotal / incomeTotal) * 360;
// var savingsBudget = (savingsTotal / incomeTotal) * 360;
// var leftOverBudget = (leftOverCash / incomeTotal) * 360;

// var anglesArr = [
//   housingBudget,
//   transportationBudget,
//   educationBudget,
//   personalBudget,
//   savingsBudget,
//   leftOverBudget,
// ];

// var n = 1;

// // number of numOfSectors
// var numOfSectors = 6;

// var segmentWidth = 360 / numOfSectors;

// // begin at 0 and end at one segment width
// var startAngle = 0;
// // var endAngle = anglesArr[0];
// var endAngle = segmentWidth;

// // how thick you want a segment
// var segmentDepth = 150;

// function init() {
//   for (var i = 1; i <= n; i++) {
//     drawSegments(i * segmentDepth);
//     console.log("i= ", i, "segmentDepth= ", segmentDepth);
//   }
// }

// function drawSegments(radius) {
//   for (var i = 0; i < numOfSectors; i++) {
//     console.log("(startAngle * Math.PI)/180= ", (startAngle * Math.PI) / 180);
//     console.log("(endAngle * Math.PI)/180= ", (endAngle * Math.PI) / 180);
//     context.beginPath();
//     context.arc(
//       w,
//       h,
//       radius,
//       (startAngle * Math.PI) / 180,
//       (endAngle * Math.PI) / 180,
//       false
//     );
//     context.lineWidth = segmentDepth;
//     context.strokeStyle = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
//     context.stroke();

//     // increase per segment
//     startAngle += segmentWidth;
//     endAngle += segmentWidth;
//     // startAngle += anglesArr[i];
//     // endAngle += anglesArr[i];
//     console.log(
//       "startAngle= ",
//       startAngle,
//       "endAngle= ",
//       endAngle,
//       "context.strokeStyle= ",
//       context.strokeStyle
//     );
//   }
// }

// // start drawing our chart
// init();
