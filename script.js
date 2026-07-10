/* Samridhi Dental — interactions & motion */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".header");
  var onScroll = function () {
    if (window.scrollY > 24) header.classList.add("is-stuck");
    else header.classList.remove("is-stuck");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile drawer ---- */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("drawer");
  var setDrawer = function (open) {
    toggle.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setDrawer(toggle.getAttribute("aria-expanded") !== "true");
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setDrawer(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setDrawer(false);
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Hero image: subtle parallax drift ---- */
  var heroImg = document.getElementById("heroImg");
  if (heroImg && !prefersReduced) {
    var ticking = false;
    var drift = function () {
      var y = Math.min(window.scrollY, 900);
      heroImg.style.transform = "translateY(" + y * -0.05 + "px)";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(drift); ticking = true; }
    }, { passive: true });
  }

  /* ---- Treatment menu: sticky preview crossfade ---- */
  var menuRows = document.querySelectorAll(".menu__row[data-img]");
  var caption = document.getElementById("menuCaption");
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  if (menuRows.length && finePointer) {
    menuRows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        var target = document.getElementById(row.getAttribute("data-img"));
        if (!target || target.classList.contains("is-active")) return;
        document.querySelectorAll(".menu__frame img.is-active").forEach(function (img) {
          img.classList.remove("is-active");
        });
        target.classList.add("is-active");
        if (caption) {
          var name = row.querySelector("h3");
          caption.textContent = name ? name.textContent : "";
        }
      });
    });
  }

  /* ---- Video players: poster overlay -> play (clinic tour, wedding reel, etc.) ---- */
  document.querySelectorAll(".tour__player").forEach(function (player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector(".tour__overlay");
    if (!video || !overlay) return;
    overlay.addEventListener("click", function () {
      overlay.classList.add("is-hidden");
      video.play();
    });
    video.addEventListener("ended", function () {
      video.currentTime = 0;
      overlay.classList.remove("is-hidden");
    });
  });

  /* ---- Appointment form: build a WhatsApp message and hand off ---- */
  document.querySelectorAll(".appt-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").trim();
      var phone = (data.get("phone") || "").trim();
      var treatment = (data.get("treatment") || "").trim();
      var date = (data.get("date") || "").trim();
      var message = (data.get("message") || "").trim();
      var context = (data.get("context") || "").trim() || "an appointment";

      var dateParts = date.split("-");
      if (dateParts.length === 3) date = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];

      var lines = [
        "Hi, I'd like to book " + context + " at Samridhi Dental.",
        "",
        "Name: " + name,
        "Phone: " + phone
      ];
      if (treatment) lines.push("Treatment: " + treatment);
      lines.push("Preferred date: " + (date || "Flexible"));
      if (message) lines.push("Notes: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/918591141204?text=" + text, "_blank", "noopener");
    });
  });

  /* ---- Highlight today's opening hours ---- */
  var today = new Date().getDay(); // 0 = Sunday
  var todayLi = document.querySelector('#hoursList li[data-day="' + today + '"]');
  if (todayLi) todayLi.classList.add("is-today");

  /* ---- Smooth-scroll with header offset for in-page links ---- */
  var headerH = function () { return header ? header.offsetHeight + 16 : 0; };
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerH();
      window.scrollTo({ top: top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---- Current year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Smooth FAQ open ---- */
  document.querySelectorAll(".faq details").forEach(function (d) {
    var ans = d.querySelector(".faq__a");
    if (!ans || prefersReduced) return;
    d.addEventListener("toggle", function () {
      if (d.open) {
        ans.style.height = "auto";
        var h = ans.offsetHeight;
        ans.style.height = "0px";
        requestAnimationFrame(function () {
          ans.style.transition = "height .4s cubic-bezier(.22,1,.36,1)";
          ans.style.height = h + "px";
        });
        ans.addEventListener("transitionend", function te() {
          ans.style.height = "auto";
          ans.style.transition = "";
          ans.removeEventListener("transitionend", te);
        });
      }
    });
  });
})();
