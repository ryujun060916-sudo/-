document.addEventListener("DOMContentLoaded", () => {
  const includes = Array.from(document.querySelectorAll("[data-include]"));
  Promise.all(
    includes.map((el) => {
      const url = el.getAttribute("data-include");
      return fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
          return res.text();
        })
        .then((html) => {
          el.outerHTML = html;
        })
        .catch((err) => console.error(err));
    })
  ).then(highlightActiveNav);
});

function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll(".site-header__nav a[href]").forEach((a) => {
    if (a.getAttribute("href") === path) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
}
