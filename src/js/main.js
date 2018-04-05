var sectionActive;
var sectionInactive;

document.addEventListener("DOMContentLoaded", function (event) {
    sliderSections();
    changeHeight();
    changeWidth();
    content();
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

function toggleHover() {
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

    getSections();

    sectionActive.style.height = "100vh";

    var currentHeight = sectionActive.offsetHeight;
    sectionInactive.style.height = currentHeight + "px";
}
function content() {
    var contentful = require('contentful');

    var client = contentful.createClient({
        space: 'jszvpzje0cjl',
        accessToken: '7a535b5349a4dd26510674038fd0534ee139d172d34d6eb5fd6bdaf52e44915d'
    });


    client.getEntries({
        'content_type': 'expriences'
    })
        .then(function (entries) {
            entries.items.forEach(function (entry) {
                console.log(JSON.stringify(entry.fields.date))
                console.log(JSON.stringify(entry.fields.exprience))
            })
        })
}

function insertText(text, place) {
    document.querySelector(place).innerHTML = text;
}

// le height du body est le height de la section active