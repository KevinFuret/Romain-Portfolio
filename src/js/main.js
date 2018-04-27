var sectionActive;
var sectionInactive;

document.addEventListener("DOMContentLoaded", function(event) {
  sliderSections();
  changeHeight();
  changeWidth();
  content();
});

window.onresize = function(event) {
  changeHeight();
};

function getSections() {
  sectionActive = document.querySelector(".section-active");
  sectionInactive = document.querySelector(".section-inactive");
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
  //sectionInactive.classList.toggle("hover");
  //sectionActive.classList.toggle("hover");
}

function changeOrder() {
  getSections();

  sectionInactive.removeEventListener("mouseenter", toggleHover);
  sectionInactive.removeEventListener("mouseleave", toggleHover);

  toggleHover();

  var sections = document.querySelectorAll("section");
  sections.forEach(section => {
    section.classList.toggle("section-inactive");
    section.classList.toggle("section-active");
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
  var contentful = require("contentful");
  var showdown = require("showdown");
  var converter = new showdown.Converter();

  var client = contentful.createClient({
    space: "jszvpzje0cjl",
    accessToken:
      "7a535b5349a4dd26510674038fd0534ee139d172d34d6eb5fd6bdaf52e44915d"
  });

  // GET THE CONTENT
  /*client.getEntry('2lMA1fjNkQgA04KSSmS6iK')
        .then(function (entry) {

            // logs the field with ID title
            var description = converter.makeHtml(entry.fields.description);

            insertText(description, '.section__description', 'section__text')
        })*/

  client.getEntry("5X6o3OlWY8EWsgcKOUYCm6").then(function(entry) {
    // get the id
    var id = entry.fields.id;
    id = id.toLowerCase();
    addScript(id);
    addGTag(id);
  });

  client
    .getEntries({
      content_type: "expriences",
      order: "-fields.dateBegin"
    })
    .then(function(entries) {
      entries.items.forEach(function(entry) {
        var dateBeginBrut = entry.fields.dateBegin.split("-");
        var dateBeginString =
          dateBeginBrut[1] + "." + dateBeginBrut[0].substr(2);

        if (typeof entry.fields.dateEnd != "undefined") {
          var dateEndBrut = entry.fields.dateEnd.split("-");
          var dateEndString = dateEndBrut[1] + "." + dateEndBrut[0].substr(2);
          var dates = dateBeginString + " — " + dateEndString;
        } else {
          var dateEndString = "";
          var dates = dateBeginString;
        }

        var experience = converter.makeHtml(entry.fields.exprience);
        insertText(
          experience,
          ".section__experiences",
          "section__experience",
          dates
        );
      });
    });
}

function insertText(text, place, className, date) {
  date = date || 0;
  // récupérer le parent
  var div = document.querySelector(place);
  // créer une div (sans lui dire ou elle est dans le DOM)
  var experience = document.createElement("div");
  // ajouter la classe voulue a l'enfant
  if (place === ".section__experiences") {
    experience.classList.add(className);
    // ajouter le contenu à l'enfant
    experience.innerHTML =
      '<p class="section__experience-date">' + date + "</p>" + text;
  } else if (place === ".section__description") {
    experience.innerHTML = text;
  }

  // ajouter la div experience dans le DOM, a l'intérieur du parent div
  div.appendChild(experience);
  if (place === ".section__experiences") {
    var descriptions = document.querySelectorAll(
      ".section__experience p:not(:first-child)"
    );

    descriptions.forEach(function(description) {
      description.classList.add("section__experience-description");
    });
  } else {
    var descriptions = document.querySelectorAll(
      ".section__description > div > *"
    );
    descriptions.forEach(function(description) {
      description.classList.add(className);
    });
  }
}

function addScript(id) {
  var script = document.createElement("script");
  var value = "https://www.googletagmanager.com/gtag/js?id=" + id;
  script.setAttribute("src", value);
  document.head.appendChild(script);
}

function addGTag(id) {
  var config =
    "window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); }; gtag('js', new Date());gtag('config', '" +
    id.toUpperCase() +
    "');";
  var script = document.createElement("script");
  script.text = config;
  document.head.appendChild(script);
}
