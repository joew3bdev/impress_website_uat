


document.addEventListener("DOMContentLoaded", function () {
  const toc = document.querySelector("#case-toc");
  const content = document.querySelector(".case-content");

  if (!toc || !content) return;

  if (toc.dataset.built === "true") return;
  toc.dataset.built = "true";

  toc.innerHTML = "";

  const headings = content.querySelectorAll("h2, h3, h4, h5, h6");
  if (!headings.length) return;

  let isAutoScrolling = false;

  headings.forEach((heading) => {
    const text = heading.innerText.trim();
    if (!text) return;

    if (!heading.id) {
      heading.id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const li = document.createElement("li");
    li.classList.add(`toc-${heading.tagName.toLowerCase()}`);

    const a = document.createElement("a");
    a.href = `#${heading.id}`;
    a.textContent = text;

    li.appendChild(a);
    toc.appendChild(li);
  });

  // ✅ CLICK HANDLING (smooth + stable)
  toc.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    isAutoScrolling = true;

    toc.querySelectorAll("a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    const offset = 120;
    const top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      offset;

    window.scrollTo({ top, behavior: "smooth" });

    // 🧠 Resume observer AFTER scroll settles
    setTimeout(() => {
      isAutoScrolling = false;
    }, 600); // matches smooth-scroll duration
  });

  // ✅ OBSERVER (paused during auto-scroll)
  const observer = new IntersectionObserver(
    (entries) => {
      if (isAutoScrolling) return;

      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const link = toc.querySelector(
          `a[href="#${entry.target.id}"]`
        );
        if (!link) return;

        toc.querySelectorAll("a").forEach(a =>
          a.classList.remove("active")
        );
        link.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -60% 0px" }
  );

  headings.forEach(h => observer.observe(h));
});









