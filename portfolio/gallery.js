(() => {
  const smoothBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector("[data-carousel-viewport]");
    const slides = Array.from(viewport.children);
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector("[data-carousel-status]");
    let activeIndex = 0;
    let scrollFrame;

    const positionFor = (slide) => (
      slide.getBoundingClientRect().left
      - viewport.getBoundingClientRect().left
      + viewport.scrollLeft
    );

    const update = () => {
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      activeIndex = slides.reduce((closestIndex, slide, index) => (
        Math.abs(positionFor(slide) + slide.clientWidth / 2 - viewportCenter)
        < Math.abs(positionFor(slides[closestIndex]) + slides[closestIndex].clientWidth / 2 - viewportCenter)
          ? index
          : closestIndex
      ), 0);

      status.value = `${activeIndex + 1} / ${slides.length}`;
      viewport.setAttribute("aria-label", `Экран ${activeIndex + 1} из ${slides.length}`);
    };

    const showSlide = (index) => {
      const nextIndex = (index + slides.length) % slides.length;
      viewport.scrollTo({ left: positionFor(slides[nextIndex]), behavior: smoothBehavior });
    };

    previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
    nextButton.addEventListener("click", () => showSlide(activeIndex + 1));
    viewport.addEventListener("scroll", () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(update);
    }, { passive: true });
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(activeIndex + 1);
      }
    });

    new ResizeObserver(update).observe(viewport);
    update();
  });
})();
