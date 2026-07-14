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

  /* ============================================================
     Smile Journey timeline — reveal steps + fill the connector
     ============================================================ */
  (function () {
    var track = document.getElementById("journeyTrack");
    if (!track) return;
    var steps = Array.prototype.slice.call(track.querySelectorAll(".journey__step"));
    var fill = document.getElementById("journeyFill");
    var revealed = 0;

    var setFill = function () {
      if (fill) fill.style.setProperty("--fill", (revealed / steps.length).toFixed(3));
    };

    if (prefersReduced || !("IntersectionObserver" in window)) {
      steps.forEach(function (s) { s.classList.add("is-in"); });
      revealed = steps.length;
      setFill();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");   // fade the card up (once)
        io.unobserve(entry.target);
        revealed++;
        setFill();                              // grow the connector as cards appear
      });
    }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });

    steps.forEach(function (s) { io.observe(s); });
  })();

  /* ============================================================
     Modal helpers (native <dialog>): backdrop-click to close
     ============================================================ */
  var openModal = function (dialog) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (!dialog.open) dialog.showModal();
  };
  var wireModal = function (dialog) {
    if (!dialog) return;
    // Close on any [data-close-modal] inside
    dialog.querySelectorAll("[data-close-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () { dialog.close(); });
    });
    // Close when clicking the backdrop. Clicks on the ::backdrop pseudo report
    // the dialog itself as the target; clicks on the panel/children do not.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  };

  /* ============================================================
     Featured treatments popup — once per visitor, reopenable
     ============================================================ */
  (function () {
    var popup = document.getElementById("featuredPopup");
    var pill = document.getElementById("featuredPill");
    if (!popup) return;
    wireModal(popup);

    var SEEN_KEY = "samridhi_featured_seen";
    var seen;
    try { seen = localStorage.getItem(SEEN_KEY); } catch (e) { seen = null; }

    var showPill = function () { if (pill) pill.hidden = false; };

    popup.addEventListener("close", function () {
      try { localStorage.setItem(SEEN_KEY, "1"); } catch (e) {}
      showPill();
    });

    if (pill) pill.addEventListener("click", function () { openModal(popup); });

    if (seen) {
      showPill();                               // returning visitor: just offer the pill
    } else {
      window.setTimeout(function () { openModal(popup); }, 5000);
    }
  })();

  /* ============================================================
     Smile Assessment quiz
     ============================================================ */
  (function () {
    var dialog = document.getElementById("quizDialog");
    if (!dialog) return;
    wireModal(dialog);

    var quiz = document.getElementById("quiz");
    var result = document.getElementById("quizResult");
    var questions = Array.prototype.slice.call(dialog.querySelectorAll(".quiz__q"));
    var bar = document.getElementById("quizBar");
    var stepLabel = document.getElementById("quizStep");
    var backBtn = document.getElementById("quizBack");
    var total = questions.length;
    var current = 0;
    var answers = {};

    // Recommendation catalogue
    var TREATMENTS = {
      aligners:  { name: "Clear Aligners", href: "aligners.html", desc: "Straighten crowding, gaps and mild bite issues with near-invisible trays." },
      whitening: { name: "Teeth Whitening", href: "services.html#whitening", desc: "Safe, dentist-supervised brightening in a single visit." },
      rehab:     { name: "Full Mouth Rehabilitation", href: "full-mouth-rehab.html", desc: "Rebuild worn, broken or missing teeth in comfortable phases." },
      implants:  { name: "Dental Implants", href: "services.html#implants", desc: "Permanent, natural-feeling replacements for missing teeth." },
      rct:       { name: "Painless Root Canal", href: "services.html#root-canal", desc: "Relieve pain and save a badly affected tooth in a single sitting." },
      checkup:   { name: "Check-up & Cleaning", href: "services.html#checkups", desc: "A gentle exam and clean to find the real cause, conservatively." },
      wedding:   { name: "Wedding Smile Package", href: "wedding.html", desc: "Smile design and whitening timed around your big day." },
      kids:      { name: "Kids Dentistry", href: "services.html#kids", desc: "Friendly, fear-free care that helps children love the dentist." }
    };

    var showQuestion = function (i) {
      questions.forEach(function (q, idx) { q.classList.toggle("is-active", idx === i); });
      current = i;
      if (bar) bar.style.width = ((i + 1) / total * 100) + "%";
      if (stepLabel) stepLabel.textContent = String(i + 1);
      if (backBtn) backBtn.hidden = i === 0;
    };

    var reset = function () {
      answers = {};
      result.hidden = true;
      quiz.hidden = false;
      showQuestion(0);
    };

    // Build the recommendation from the collected answers
    var recommend = function () {
      var recs = [];
      var add = function (key) { if (TREATMENTS[key] && recs.indexOf(key) === -1) recs.push(key); };

      if (answers.who === "child") { add("kids"); add("checkup"); }
      else {
        switch (answers.concern) {
          case "crooked": add("aligners"); break;
          case "gaps": add("aligners"); break;
          case "stained": add("whitening"); break;
          case "pain": add("rct"); add("checkup"); break;
          case "missing":
            add(answers.extent === "most" ? "rehab" : "implants");
            break;
        }
        if (answers.extent === "most" && answers.concern !== "missing") add("rehab");
        if (answers.event === "yes") add("wedding");
      }
      if (!recs.length) add("checkup");
      if (answers.lastVisit === "long" && recs.indexOf("checkup") === -1) add("checkup");
      return recs.slice(0, 3).map(function (k) { return TREATMENTS[k]; });
    };

    var renderResult = function () {
      var recs = recommend();
      var cards = document.getElementById("quizResultCards");
      var lede = document.getElementById("quizResultLede");
      var book = document.getElementById("quizResultBook");

      lede.textContent = recs.length > 1
        ? "Based on your answers, here's where we'd suggest starting."
        : "Based on your answers, here's what we'd suggest.";

      cards.innerHTML = "";
      recs.forEach(function (r, i) {
        var div = document.createElement("div");
        div.className = "quiz-rec";
        div.innerHTML = '<span class="quiz-rec__num" aria-hidden="true">' + (i + 1) +
          '</span><div><h3><a href="' + r.href + '">' + r.name + '</a></h3><p>' + r.desc + "</p></div>";
        cards.appendChild(div);
      });

      // Prefill a WhatsApp message with the recommendation
      var names = recs.map(function (r) { return r.name; }).join(", ");
      var msg = "Hi, I took the smile assessment on your website. My suggested treatment(s): " +
        names + ". I'd like to book a consultation.";
      book.href = "https://wa.me/918591141204?text=" + encodeURIComponent(msg);

      quiz.hidden = true;
      result.hidden = false;
    };

    // Selecting an option records the answer and advances
    dialog.querySelectorAll(".quiz__opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        answers[opt.getAttribute("data-key")] = opt.getAttribute("data-val");
        if (current < total - 1) showQuestion(current + 1);
        else renderResult();
      });
    });

    if (backBtn) backBtn.addEventListener("click", function () {
      if (current > 0) showQuestion(current - 1);
    });

    var restart = document.getElementById("quizRestart");
    if (restart) restart.addEventListener("click", reset);

    // Any [data-open-quiz] trigger opens the quiz fresh
    document.querySelectorAll("[data-open-quiz]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        reset();
        openModal(dialog);
      });
    });
  })();
})();
