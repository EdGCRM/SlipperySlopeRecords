/* Slippery Slope Records — shared behavior */
(function () {
  "use strict";

  /* Header shadow/blur on scroll */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    toggleBackToTop();
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  var navScrim = document.querySelector(".nav-scrim");
  function closeNav() {
    if (!navToggle) return;
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    navScrim && navScrim.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open", open);
      navScrim && navScrim.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navScrim && navScrim.addEventListener("click", closeNav);
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Track accordions: expand/collapse + story/lyrics tabs */
  document.querySelectorAll(".track").forEach(function (track) {
    var head = track.querySelector(".track-head");
    var body = track.querySelector(".track-body");
    if (head && body) {
      head.addEventListener("click", function () {
        var isOpen = track.getAttribute("data-open") === "true";
        track.setAttribute("data-open", isOpen ? "false" : "true");
        head.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    }
    var tabs = track.querySelectorAll(".track-tab");
    var panels = track.querySelectorAll(".track-panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function (e) {
        e.stopPropagation();
        var target = tab.getAttribute("data-panel");
        tabs.forEach(function (t) { t.classList.toggle("is-active", t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
        });
      });
    });
  });

  /* Back to top */
  var toTop = document.querySelector(".to-top");
  function toggleBackToTop() {
    if (!toTop) return;
    toTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Active nav link by page */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
    if (a.getAttribute("data-page") === here) a.classList.add("active");
  });
})();
