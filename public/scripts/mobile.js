const mobileMenuBtnElement = document.getElementById("menu-toggle");
const sideNavbarElement = document.getElementById("side-navbar");

function toggleSideNavbar() {
    sideNavbarElement.classList.toggle("show")
}

mobileMenuBtnElement.addEventListener("click", toggleSideNavbar);
