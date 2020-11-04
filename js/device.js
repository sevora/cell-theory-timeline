/*
 * This script is for device check. Makes sure that the device is compatible
 * through a pseudo-reliable solution
 */
const mainContentDOM = document.getElementById('main-content');
const deviceWarningDOM = document.getElementById('device-warning');
const timelineWrapperDOM = document.getElementById('timeline-wrapper'); 

/*
 * This hides the main content and displays a message
 * if the device is not compatible.
 */
function mainGridOrientationCheck() {
    if (window.innerHeight >= window.innerWidth) {
        mainContentDOM.style.display = 'none';
        timelineWrapperDOM.style.display = 'none';
        deviceWarningDOM.style.display = 'block';
        return;
    } 
}

mainGridOrientationCheck();
