// Tabs Action
var tabLink = document.querySelectorAll(".tab-menu-link");
var tabContent = document.querySelectorAll(".tab-bar-content");

//tabLink.forEach(function(el) {
for (var i = 0; i < tabLink.length; i++) {
  tabLink[i].addEventListener("click", activeTab);
};

function activeTab(el) {
  var btnTarget = el.currentTarget;
  //var content = btnTarget.dataset.content;
  var content = btnTarget.getAttribute("data-content");

  for (var i = 0; i < tabContent.length; i++) {
    tabContent[i].classList.remove("active");
  };

  for (var i = 0; i < tabLink.length; i++) {
    tabLink[i].classList.remove("active");
  }

  document.querySelector("#" + content).classList.add("active");
  btnTarget.classList.add("active");
}