/* ===========================
   Main JavaScript for JDS Website
=========================== */

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("active");
        });
    }

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Lightbox effect for project images
    const images = document.querySelectorAll(".lightbox");
    const lightboxContainer = document.createElement("div");
    lightboxContainer.id = "lightbox";
    document.body.appendChild(lightboxContainer);

    images.forEach(image => {
        image.addEventListener("click", e => {
            lightboxContainer.classList.add("active");
            const img = document.createElement("img");
            img.src = image.src;
            while (lightboxContainer.firstChild) {
                lightboxContainer.removeChild(lightboxContainer.firstChild);
            }
            lightboxContainer.appendChild(img);
        });
    });

    lightboxContainer.addEventListener("click", e => {
        if (e.target !== e.currentTarget) return;
        lightboxContainer.classList.remove("active");
    });
});
