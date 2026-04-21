/* =====================================================================
   The Codex Reaches — campaign chronicle interactions.
   Small, dependency-free. Keeps the MUD feeling honest.
   ===================================================================== */

(function () {
  "use strict";

  // --- Typewriter reveal for .typed elements ---
  function revealTyped() {
    const els = document.querySelectorAll(".typed");
    els.forEach((el) => {
      const delay = parseInt(el.dataset.delay || "0", 10);
      setTimeout(() => el.classList.add("revealed"), delay);
    });
  }

  // --- Command bar: on click, echo the command into the footer prompt ---
  function wireCommandEcho() {
    const bar = document.querySelector(".command-bar");
    const prompt = document.querySelector(".prompt-line");
    if (!bar || !prompt) return;
    bar.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        const cmd = link.textContent.trim();
        const echo = document.createElement("span");
        echo.className = "prompt-echo";
        echo.textContent = " " + cmd;
        echo.style.cssText =
          "color: var(--fg); opacity: 0; transition: opacity 220ms ease;";
        const cursor = prompt.querySelector(".cursor");
        if (cursor) {
          prompt.insertBefore(echo, cursor);
        } else {
          prompt.appendChild(echo);
        }
        requestAnimationFrame(() => (echo.style.opacity = "1"));
        setTimeout(() => {
          echo.style.opacity = "0";
          setTimeout(() => echo.remove(), 240);
        }, 2200);
      });
    });
  }

  // --- Dice hover: reveal band description ---
  function wireDiceHover() {
    const bands = {
      1: "dark omen · critical",
      2: "dark omen",
      3: "dark omen",
      4: "dark omen",
      5: "dark omen",
      6: "uneasy passage",
      7: "uneasy passage",
      8: "uneasy passage",
      9: "uneasy passage",
      10: "uneasy passage",
      11: "steady footing",
      12: "steady footing",
      13: "steady footing",
      14: "steady footing",
      15: "steady footing",
      16: "favorable momentum",
      17: "favorable momentum",
      18: "favorable momentum",
      19: "favorable momentum",
      20: "legendary fortune · critical",
    };

    document.querySelectorAll("[data-dice]").forEach((el) => {
      const n = parseInt(el.dataset.dice, 10);
      if (!n || n < 1 || n > 20) return;
      const band = bands[n] || "";
      el.title = "🎲 " + n + " — " + band;
      el.setAttribute("aria-label", "dice roll " + n + ", " + band);
      el.tabIndex = 0;
      el.style.cursor = "help";
      el.style.borderBottom = "1px dotted currentColor";
    });
  }

  // --- Cursor keeps cadence across page lifecycle (handled by CSS);
  //     but on key press, emit a short flash to feel responsive. ---
  function wirePromptFlash() {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;
    document.addEventListener("keydown", () => {
      cursor.style.background = "var(--amber)";
      cursor.style.boxShadow = "0 0 8px rgba(245, 200, 66, 0.8)";
      setTimeout(() => {
        cursor.style.background = "";
        cursor.style.boxShadow = "";
      }, 160);
    });
  }

  // --- Smooth-scroll offset accounting for sticky command bar ---
  function wireStickyScroll() {
    const bar = document.querySelector(".command-bar");
    if (!bar) return;
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href").slice(1);
        const target = id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const y =
          target.getBoundingClientRect().top +
          window.scrollY -
          bar.offsetHeight -
          18;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.replaceState(null, "", "#" + id);
      });
    });
  }

  // --- Character card: double-click copies the github handle ---
  function wireHandleCopy() {
    document.querySelectorAll(".char-card").forEach((card) => {
      card.addEventListener("dblclick", () => {
        const handle = card.querySelector(".char-handle");
        if (!handle) return;
        const txt = handle.textContent.replace(/[\[\]]/g, "").trim();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(() => {
            handle.dataset.orig = handle.textContent;
            handle.textContent = "[ copied " + txt + " ]";
            handle.style.color = "var(--amber)";
            setTimeout(() => {
              handle.textContent = handle.dataset.orig;
              handle.style.color = "";
            }, 1400);
          });
        }
      });
    });
  }

  // --- Boot ---
  document.addEventListener("DOMContentLoaded", () => {
    revealTyped();
    wireCommandEcho();
    wireDiceHover();
    wirePromptFlash();
    wireStickyScroll();
    wireHandleCopy();
  });
})();
