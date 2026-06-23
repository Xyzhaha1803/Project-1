// ════════════════════════════════
//  jQuery IMAGE SLIDER
// ════════════════════════════════
// $(...) is jQuery's selector function — same job as document.querySelector(),
// but it returns a jQuery-wrapped object with extra built-in methods
// (.addClass, .removeClass, .css, .on, .each, etc) instead of a raw DOM node.

// $(document).ready() waits for the HTML to fully load before running any
// jQuery code — the jQuery equivalent of a DOMContentLoaded listener.
$(document).ready(function () {

    // $('.SlideImg') grabs ALL five <img> elements at once as a single
    // jQuery collection. No manual for-loop needed to act on every one.
    const $slides = $('.SlideImg')
    const $dotsContainer = $('#sliderDots')

    let currentIndex = 0
    const totalSlides = $slides.length // jQuery collections have .length like arrays

    // Build one dot per slide using jQuery's .each() looping helper
    $slides.each(function (i) {
        // $('<div>') creates a brand new jQuery-wrapped element in memory
        const $dot = $('<div></div>')
            .addClass('SliderDot')
            .attr('data-index', i)

        // .appendTo() inserts the new element into the page
        $dot.appendTo($dotsContainer)
    })

    const $dots = $('.SliderDot')

    // Shows whichever slide matches `index`, hides the rest
    function showSlide(index) {
        // .removeClass() / .addClass() are jQuery's way of toggling CSS classes
        // — same outcome as classList.remove()/add() in vanilla JS
        $slides.removeClass('active')
        $dots.removeClass('active')

        // .eq(index) picks the single element at that position in the collection
        $slides.eq(index).addClass('active')
        $dots.eq(index).addClass('active')

        currentIndex = index
    }

    // ── Arrow button clicks ──
    // .on('click', handler) attaches a click listener — jQuery's version of
    // addEventListener('click', handler)
    $('#sliderNext').on('click', function () {
        const nextIndex = (currentIndex + 1) % totalSlides
        showSlide(nextIndex)
    })

    $('#sliderPrev').on('click', function () {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides
        showSlide(prevIndex)
    })

    // ── Dot navigation ──
    // Event delegation isn't needed here since dots already exist by this point,
    // but .on() still works the same as a direct click binding
    $dots.on('click', function () {
        // `this` inside a jQuery .on() callback is the raw DOM element clicked.
        // $(this) re-wraps it so we can use jQuery methods on it again.
        const clickedIndex = $(this).attr('data-index')
        showSlide(parseInt(clickedIndex))
    })

    // ── "Use This Picture" button ──
    // Reads which slide is currently active and hands its image path to Puzzle.js
    $('#useImageButton').on('click', function () {
        const $activeSlide = $('.SlideImg.active')
        const chosenImageSrc = $activeSlide.attr('src')

        // Call the puzzle's own start function (defined in Puzzle.js),
        // passing in whichever image the user picked
        if (typeof startPuzzleWithImage === 'function') {
            startPuzzleWithImage(chosenImageSrc)
        }
    })

    // Show the first slide and its dot as soon as the page loads
    showSlide(0)
})