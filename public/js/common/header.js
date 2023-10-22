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
        <img id="logo" src="/css/common/logo2.jpeg" alt="LOGO">
        <ul class="nav-links">
          <li><a href="/main/">Dashboard</a></li>
          <li><a href="/page/about-us">About Us</a></li>
          <li><a href="/page/contact-us">Contact Us</a></li>
          <li><a href="/user/my-team">My Team</a></li>
          <li><a href="/main/wallet">My Wallet</a></li>
          <li><a href="/main/tree">Team Tree</a></li>

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
        <img id="logo" src="/css/common/logo2.jpeg" alt="LOGO">
        <ul class="nav-links">
          <li><a href="/admin/main/">Dashboard</a></li>
          <li><a href="/page/about-us">About Us</a></li>
          <li><a href="/page/contact-us">Contact Us</a></li>
          <li><a href="/admin/request">Requests*</a></li>
          <li><a href="/admin/search-and-update">Search Board</a></li>
          <li><a href="/admin/tree">Tree</a></li>

        </ul>
      </div>
      <div class="user-button">
        <button>
          <a id="userName">${admin.name}</a>
        </button>
      </div>
    </div>`
    ;

}

