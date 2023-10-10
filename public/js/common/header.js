let admin = JSON.parse(localStorage.getItem("user"));

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".nav-links");

  mobileMenu.classList.toggle("active");

  hamburger.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
  });
});

if (admin.type === "user") {
  document.getElementById("navbar").innerHTML = `
    <div class="container">
      <div class="logo-and-links">
        <a href="#" class="logo">Your Logo</a>
        <ul class="nav-links">
          <li><a href="/main/">Home</a></li>
          <li><a href="/page/about-us">About Us</a></li>
          <li><a href="/page/contact-us">Contact Us</a></li>
          <li><a href="/main/wallet">My Wallet</a></li>
        </ul>
      </div>

      <div class="user-button">
        <button>
          <a id="userName" href="/page/user">${admin.name}</a>
        </button>
      </div>
    </div>`
    ;
}
else{
  document.getElementById("navbar").innerHTML = `
    <div class="container">
      <div class="logo-and-links">
        <a href="#" class="logo">Your Logo</a>
        <ul class="nav-links">
          <li><a href="/admin/main/">Dashboard</a></li>
          <li><a href="/page/about-us">About Us</a></li>
          <li><a href="/page/contact-us">Contact Us</a></li>
          <li><a href="/admin/request">Requests</a></li>
          <li><a href="/admin/search-and-update">Search Board</a></li>
        </ul>
      </div>
      <div class="user-button">
        <button>
          <a id="userName" href="/page/user">${admin.name}</a>
        </button>
      </div>
    </div>`
    ;

}
