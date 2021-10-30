document.querySelector(".menu-btn").addEventListener("click", function () {
  document.querySelector(".main-menu").classList.toggle("show");
});

// Get modal element
var modal = document.getElementById("get-result-modal");
var bpModal = document.getElementById("get-bp-result-modal");
// Get open modal button
var modalBtn = document.getElementById("get-result-modalbtn");
var bpModalBtn = document.getElementById("get-bp-result-modalbtn");
// Get close button
var closeBtn = document.getElementsByClassName("closeBtn")[0];

var closeBP = document.getElementById("bp-cancel");

// Listen for open click
if (modalBtn) {
  modalBtn.addEventListener("click", openModal);
}

if (bpModalBtn) {
  bpModalBtn.addEventListener("click", openBPModal);
}

// Listen for close click

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

if (closeBP) {
  closeBP.addEventListener("click", closeBPModal);
}

// Listen for outside click
window.addEventListener("click", outsideClick);

// Open modal
function openModal() {
  document.getElementById("modal-cover").style.display = "block";
  modal.style.zIndex = "10100";
  modal.style.display = "flex";
}

function openBPModal() {
  document.getElementById("bp-modal-cover").style.display = "block";
  bpModal.style.zIndex = "10100";
  bpModal.style.display = "flex";
}

// Close modal
function closeModal() {
  document.getElementById("modal-cover").style.display = "none";
  modal.style.display = "none";
}
function closeBPModal() {
  document.getElementById("bp-modal-cover").style.display = "none";
  bpModal.style.display = "none";
}

// Click outside and close
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
    bPmodal.style.display = "none";
  }
}

var checker = document.getElementById("checker");
var sendbtn = document.getElementById("send-result");
// when unchecked or checked, run the function
// checker.onchange = function () {
//   if (this.checked) {
//     sendbtn.disabled = false;
//   } else {
//     sendbtn.disabled = true;
//   }
// };
