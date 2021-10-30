var speed = 200;
$(".accordion .accordion-title .expanded + .accordion-content").slideDown(
  speed
);

$(".accordion .accordion-title").on("click", function () {
  var that = $(this);

  if (that.parent().hasClass("collapsable")) {
    if (!that.hasClass("expanded")) {
      that
        .siblings(".accordion-title")
        .removeClass("expanded")
        .next(".accordion-content")
        .slideUp(speed);
    }

    that.toggleClass("expanded").next(".accordion-content").slideToggle(speed);
  }
});
