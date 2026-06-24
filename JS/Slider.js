// Wait until the HTML fully loads
document.addEventListener('DOMContentLoaded', () => {

    // Get all the slide images
    const slides = document.querySelectorAll('.SlideImg');
    const dotsContainer = document.getElementById('sliderDots');

    let currentIndex = 0; // First image
    const totalSlides = slides.length;

    // Creates one dot for each slide
    slides.forEach((slide, i) => {
        const dot = document.createElement('div');

        dot.classList.add('SliderDot');
        dot.dataset.index = i;

        dotsContainer.appendChild(dot);
    });

    // Get the dots after creating them
    const dots = document.querySelectorAll('.SliderDot');

    // Show one slide and hide the others
    function showSlide(index) {

        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');

        currentIndex = index;
    }

    // Next button
    document.getElementById('sliderNext').addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % totalSlides;
        showSlide(nextIndex);
    });

    // Previous button
    document.getElementById('sliderPrev').addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    });

    // Dot nav
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const clickedIndex = Number(dot.dataset.index);
            showSlide(clickedIndex);
        });
    });

    // Picture button
    document.getElementById('useImageButton').addEventListener('click', () => {

        const activeSlide = document.querySelector('.SlideImg.active');

        if (!activeSlide) return;

        const chosenImageSrc = activeSlide.src;

        // Call function from Puzzle.js
        if (typeof startPuzzleWithImage === 'function') {
            startPuzzleWithImage(chosenImageSrc);
        }
    });

    // Show first slide when page loads [INDEX = 0]
    showSlide(0);

});