var sectionActive;
var sectionInactive;

document.addEventListener("DOMContentLoaded", function(event) {
    sliderSections();
    changeHeight();
    changeWidth();
});

function getSections() {
    sectionActive = document.querySelector('.section-active');
    sectionInactive = document.querySelector('.section-inactive');
}

function sliderSections() {
    
    getSections();

    sectionActive.removeEventListener("click", changeOrder, false);
    sectionInactive.addEventListener("click", changeOrder, false);
}

function changeWidth() {
    getSections();
    
    sectionInactive.addEventListener("mouseenter", toggleHover);
    sectionInactive.addEventListener("mouseleave", toggleHover);
}

function toggleHover(){
    getSections();
    sectionInactive.classList.toggle('hover');
    sectionActive.classList.toggle('hover');
}

function changeOrder() {

    getSections();

    sectionInactive.removeEventListener("mouseenter", toggleHover);
    sectionInactive.removeEventListener("mouseleave", toggleHover);

    toggleHover();

    var sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.toggle('section-inactive');
        section.classList.toggle('section-active');
    });

    sliderSections();
    changeWidth();
    getSections();
}

function changeHeight() {
    console.log('change height');

    getSections();

    sectionActive.style.height = "100vh";

    var currentHeight = sectionActive.offsetHeight;
    sectionInactive.style.height = currentHeight + "px";
}

// le height du body est le height de la section active