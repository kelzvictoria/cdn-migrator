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
  // staticLabels: {
  //   font: "10px sans-serif",
  //   labels: [1000000, 2500000, 4000000, 5000000],
  //   fractionDigits: 0,
  // },

  // static zones
  staticZones: [
    { strokeStyle: "#E74C3C", min: 0, max: 7000000 },
    { strokeStyle: "#ffffff", min: 7000000, max: 10000000 },
    { strokeStyle: "#E0E0E0", min: 10000000, max: 40000000 },
    { strokeStyle: "#ffffff", min: 40000000, max: 43000000 },
    { strokeStyle: "#25C769", min: 43000000, max: 50000000 },
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

gauge.maxValue = 50000000;
gauge.setMinValue(0);

gauge.animationSpeed = 32;
