import { gsap } from "gsap";

const overlay = document.getElementById("nav-overlay");
const btnOpen = document.getElementById("menu-toggle");
const btnClose = document.getElementById("menu-close");

if (overlay && btnOpen && btnClose) {
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: 0.25, ease: "power1.out" },
  });

  const links = overlay.querySelectorAll("nav a");

  tl.set(overlay, { display: "flex" })
    .fromTo(overlay, { opacity: 0 }, { opacity: 1 })
    .fromTo(links, { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04 }, "-=0.15")
    .eventCallback("onReverseComplete", () => {
      overlay.style.display = "none";
    });

  btnOpen.addEventListener("click", () => {
    tl.play(0);
  });
  btnClose.addEventListener("click", () => {
    tl.reverse();
  });
} else {
  console.warn("Menú: faltan elementos en el DOM");
}
