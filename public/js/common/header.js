document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".nav-links");

  mobileMenu.classList.toggle("active");

  hamburger.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
  });
});

