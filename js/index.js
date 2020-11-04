/*
 * This is where the main thing happens.
 * All of it.
 */
const canvas = document.getElementById('timeline');
const context = canvas.getContext('2d');
const slides = Array.from(document.getElementsByClassName('slide'));

// Hyperparameters for the website
// functionality and design
const minimumYear = 1400;
const maximumYear = 2100;
const timeInterval = 5;
const timeIntervalWidth = 120;
const backgroundColor = '#000';
const foregroundColor = '#fff'
const font = '20px Roboto';
const inputLag = 1000; // in milliseconds, disables scroll detection for this amount of time after a scroll is detected

// Don't mess with this, variables assigned at runtime
canvas.width = innerWidth;
let { width, height } = canvas;
let currentSlide;
let currentYear, goalYear;
let doneSwitching = true;
let totalIntervals = (maximumYear - minimumYear)/timeInterval;
let years = [];

// Parses the years in the DOM
slides.forEach(function(slide) { years.push(parseInt(slide.dataset.year)); });
years.sort();

// Set the current year to the earliest year
// and the goal year to the current year as well
currentYear = parseInt(years[0]);
goalYear = parseInt(years[0]);

// This function automatically changes 
// the view to the specified year
// with a transition
function setViewTo(year) {
    slides.forEach(function(slide) {
        if(parseInt(slide.dataset.year) == year) {
            currentSlide = slide;
            currentDateDisplay = slide.querySelector('.date-display > span');
            slide.classList.add('active');
        } else if (slide.classList.contains('active')) {
            slide.classList.remove('active');
        }    
    });
    setTimelineTo(year);
}

// Simply sets the timeline to specified year
// The animation occurs because of the game loop
function setTimelineTo(year) {
    goalYear = parseInt(year);
}

// Returns an offset for the timeline 
// to show date properly
function offsetX() {
    return (currentYear-minimumYear)/timeInterval * timeIntervalWidth;
}

// This is the game loop
// but since it isn't a game,
// I'm calling it canvasRenderLoop
function canvasRenderLoop() {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    context.font = font;
    context.fillStyle = foregroundColor;
    context.strokeStyle = foregroundColor;
    
    // For the transition to different years
    if (currentYear !== goalYear) {
        currentYear -= Math.sign(currentYear-goalYear);
        if (Math.abs(currentYear - goalYear) <= 0.5) {
            currentYear = goalYear;
        }
        doneSwitching = false;
    } else {
        doneSwitching = true;
    }

    for (let index = 0; index <= totalIntervals; ++index) {
        let text = minimumYear + timeInterval * index;

        // This is required before the metrics
        // so that the context is able
        // to compute sizes correctly.
        if (text == currentYear) {
            context.font = '28px Roboto';
        } else {
            context.font = font;
        }

        let metrics = context.measureText(text);
        let textWidth = metrics.width;
        let textHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

        let x = timeIntervalWidth * index - offsetX() + width/2;
        let y = height/2 + textHeight/2;

        // This is a line on top of the middle
        // of the year on the timeline
        context.fillText(text, x, y);
        context.beginPath();
        context.moveTo(x + textWidth/2, y - textHeight * 1.1);
        context.lineTo(x + textWidth/2, 0);
        context.stroke();

        // This is the line in between the years
        // on the timeline
        for (let index2 = 0; index2 < timeInterval; ++index2) {
            context.beginPath();
            context.moveTo(x + textWidth/2 + timeIntervalWidth * (index2/timeInterval), y/4);
            context.lineTo(x + textWidth/2 + timeIntervalWidth * (index2/timeInterval), 0);
            context.stroke();           
        }
    }

    // There is a special element that may or may not be in
    // each slide. This changes dynamically to the current year.
    if (currentDateDisplay) currentDateDisplay.innerHTML = currentYear
    requestAnimationFrame(canvasRenderLoop);

}

// Event listener for scrolling
function wheelListener(event) {
    let { deltaY } = event;
    if (!doneSwitching) return;

    // Scroll down means next slide, or scroll up in a laptop pad
    // Scroll up means previous slide, or scroll down in a laptop pad
    let nextSlide = years[years.indexOf(currentYear) + Math.sign(deltaY)];
    if (nextSlide) {
        setViewTo(nextSlide);
    }

    // This is used to implement the input lag
    window.removeEventListener('wheel', wheelListener);
    setTimeout(function() {
        window.addEventListener('wheel', wheelListener);
    }, inputLag);

}

window.addEventListener('wheel', wheelListener);

// set the view to current year
// and start the animation loop
setViewTo(currentYear);
canvasRenderLoop();
