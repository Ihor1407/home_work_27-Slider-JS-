export function initSlider(selector, initialSlide = 0) {
  const slider = document.querySelector(selector);

  // slider.classList.add("flex");
  slider.classList.add("flex", "relative");

  const dotStyle =
    "w-3 h-3 bg-brand-accent cursor-pointer text-transparent rounded-full";
  // const dotsContainerStyle = " flex justify-center gap-2 mt-4 list-none";
  const dotsContainerStyle =
    "absolute -bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 list-none ";

  const slides = Array.from(slider.children);

  let isDragging = false;
  let startX = 0;
  let endX = 0;

  let currentSlide = initialSlide;
  let autoPlayInterval;
  const changeSlide = () => {
    // clearInterval(autoPlayInterval);
    slides.forEach((slide, index) => {
      slide.classList.add("hidden");
      changeActiveDot(false, index);
      if (index === currentSlide) {
        slide.classList.remove("hidden");
        changeActiveDot(true, index);
      }
    });
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const changeActiveDot = (isActive, index) => {
    if (isActive) {
      slider.querySelector(`#dot-${index}`).classList.add("bg-brand-main");
      slider.querySelector(`#dot-${index}`).classList.remove("bg-brand-accent");
    } else {
      slider.querySelector(`#dot-${index}`).classList.add("bg-brand-accent");
      slider.querySelector(`#dot-${index}`).classList.remove("bg-brand-main");
    }
  };

  const nextSlide = () => {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    changeSlide();
  };

  const prevSlide = () => {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    changeSlide();
  };

  const createArrows = () => {
    const prevArrow = document.createElement("button");
    prevArrow.classList.add("material-symbols-outlined");
    prevArrow.innerText = "arrow_left";
    prevArrow.classList.add("-order-1");
    prevArrow.style.fontSize = "60px";
    prevArrow.style.color = "#6de1e3";
    prevArrow.style.cursor = "pointer";
    prevArrow.addEventListener("click", prevSlide);

    const nextArrow = document.createElement("button");
    nextArrow.classList.add("material-symbols-outlined");
    nextArrow.innerText = "arrow_right";
    nextArrow.style.fontSize = "60px";
    nextArrow.style.color = "#6de1e3";
    nextArrow.style.cursor = "pointer";
    nextArrow.addEventListener("click", nextSlide);

    slider.appendChild(prevArrow);
    slider.appendChild(nextArrow);

    return [prevArrow, nextArrow];
  };

  const createDots = () => {
    const dotsContainer = document.createElement("ul");
    dotsContainer.className = dotsContainerStyle;
    slides.forEach((_, index) => {
      const dotWrap = document.createElement("li");
      const dot = document.createElement("button");
      dot.id = `dot-${index}`;
      dot.className = dotStyle;
      dot.innerText = index + 1;

      if (index === currentSlide) {
        dot.classList.add("bg-brand-main");
      }

      dot.addEventListener("click", () => {
        currentSlide = index;
        changeSlide();
      });

      dotWrap.appendChild(dot);
      dotsContainer.appendChild(dotWrap);
    });

    slider.appendChild(dotsContainer);
    // slider.after(dotsContainer);
  };

  createArrows();
  createDots();
  changeSlide();

  slider.addEventListener("mouseenter", () => {
    clearInterval(autoPlayInterval);
  });
  slider.addEventListener("mouseleave", () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  });

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      prevSlide();
    }
  });

  slider.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  slider.addEventListener("touchmove", (event) => {
    event.preventDefault();
    endX = event.touches[0].clientX;
  });
  slider.addEventListener("touchend", (event) => {
    const diffx = startX - endX;
    if (diffx > 50) {
      nextSlide();
    } else if (diffx < -50) {
      prevSlide();
    }
  });

  slider.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.clientX;
  });

  slider.addEventListener("mousemove", (event) => {
    if (isDragging === true) {
      event.preventDefault();
      endX = event.clientX;
    }
  });

  slider.addEventListener("mouseup", (event) => {
    isDragging = false;
    const diffx = startX - endX;
    if (diffx > 50) {
      nextSlide();
    } else if (diffx < -50) {
      prevSlide();
    }
  });

  slider.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  return slider;
}

