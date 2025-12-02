import { gsap } from "gsap";

const overlay = document.getElementById("nav-overlay");
const btnToggle = document.getElementById("menu-toggle");
const icon = document.getElementById("menu-icon") as HTMLImageElement | null;

if (overlay && btnToggle && icon) {
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: 0.3, ease: "power1.out" },
  });

  tl.set(overlay, { display: "flex" })
    .fromTo(overlay, { x: "-100%", opacity: 0 }, { x: "0%", opacity: 1 })
    .eventCallback("onReverseComplete", () => {
      overlay.style.display = "none";
    });

  let isOpen = false;

  const open = () => {
    isOpen = true;
    icon.src = "/svg/cerrar.svg";
    tl.play(0);
  };

  const close = () => {
    isOpen = false;
    icon.src = "/svg/menu.svg";
    tl.reverse();
  };

  btnToggle.addEventListener("click", () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });
} else {
  console.warn("Menú: faltan elementos en el DOM");
}
