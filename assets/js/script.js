'use strict';

const addEventOnElements = (elements, eventType, callback) => {
  elements.forEach(element => element.addEventListener(eventType, callback));
}

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", () => {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = () => {
  [navbar, overlay, document.body].forEach(el => el.classList.toggle("active"));
  document.body.classList.toggle("nav-active");
};

const closeNavbar = () => {
  [navbar, overlay, document.body].forEach(el => el.classList.remove("active"));
  document.body.classList.remove("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);
addEventOnElements(navLinks, "click", closeNavbar);

const header = document.querySelector("[data-header]");

let lastScrollY = window.scrollY;
let ticking = false;

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      header.classList.toggle("active", window.scrollY > 100);
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll);

const tiltElements = document.querySelectorAll("[data-tilt]");

const initTilt = function (event) {
  const { offsetWidth, offsetHeight } = this;
  const centerX = offsetWidth / 2;
  const centerY = offsetHeight / 2;

  const tiltPosY = ((event.offsetX - centerX) / centerX) * 10;
  const tiltPosX = ((event.offsetY - centerY) / centerY) * 10;

  this.style.transform = `perspective(1000px) rotateX(${tiltPosX}deg) rotateY(${tiltPosY - (tiltPosY * 2)}deg)`;
};

addEventOnElements(tiltElements, "mousemove", initTilt);
addEventOnElements(tiltElements, "mouseout", function () {
  this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});

const tabBtns = document.querySelectorAll("[data-tab-btn]");
const tabContents = document.querySelectorAll("[data-tab-content]");

let lastActiveTabBtn = tabBtns[0];
let lastActiveTabContent = tabContents[0];

const filterContent = function () {
  if (lastActiveTabBtn !== this) {
    [lastActiveTabBtn, lastActiveTabContent].forEach(el => el.classList.remove("active"));
    this.classList.add("active");
    lastActiveTabBtn = this;

    const currentTabContent = document.querySelector(`[data-tab-content="${this.dataset.tabBtn}"]`);
    currentTabContent.classList.add("active");
    lastActiveTabContent = currentTabContent;
  }
}

addEventOnElements(tabBtns, "click", filterContent);

const [cursorDot, cursorOutline] = document.querySelectorAll("[data-cursor]");
const hoveredElements = [...document.querySelectorAll("button"), ...document.querySelectorAll("a")];

window.addEventListener("mousemove", (event) => {
  const { clientX: posX, clientY: posY } = event;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  setTimeout(() => {
    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;
  }, 80);
});

const toggleHovered = (isHovered) => {
  [cursorDot, cursorOutline].forEach(cursor => {
    cursor.classList.toggle("hovered", isHovered);
  });
};

addEventOnElements(hoveredElements, "mouseover", () => toggleHovered(true));
addEventOnElements(hoveredElements, "mouseout", () => toggleHovered(false));

const scrollers = document.querySelectorAll(".scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

// To handle refresh happens after click on download button
document.getElementById('downloadCV').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default action (page refresh)

  var link = document.createElement('a');
  link.href = this.href;
  link.download = this.download || 'ASHVIN UPADHYAY Resume.pdf';

  // Append to the body and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
});
