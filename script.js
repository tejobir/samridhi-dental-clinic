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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Highlight today's opening hours ---- */
  var today = new Date().getDay(); // 0 = Sunday
  var todayLi = document.querySelector('#hoursList li[data-day="' + today + '"]');
  if (todayLi) todayLi.classList.add("is-today");

  /* ---- Smooth-scroll with header offset for in-page links ---- */
  var headerH = function () { return header ? header.offsetHeight + 12 : 0; };
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

  /* ---- Scroll progress bar ---- */
  var progress = document.getElementById("scrollProgress");
  if (progress) {
    var ticking = false;
    var updateProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.transform = "scaleX(" + p + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    updateProgress();
  }

  /* ---- Count-up numbers when scrolled into view ---- */
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (prefersReduced) { el.textContent = target.toFixed(dec); return; }
    var dur = 1100, start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      el.textContent = (target * eased).toFixed(dec);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(function (el) { runCount(el); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---- Current year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Smooth FAQ open/close height ---- */
  document.querySelectorAll(".faq details").forEach(function (d) {
    var ans = d.querySelector(".faq__a");
    if (!ans || prefersReduced) return;
    d.addEventListener("toggle", function () {
      if (d.open) {
        ans.style.height = "auto";
        var h = ans.offsetHeight;
        ans.style.height = "0px";
        requestAnimationFrame(function () {
          ans.style.transition = "height .35s cubic-bezier(.22,1,.36,1)";
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
