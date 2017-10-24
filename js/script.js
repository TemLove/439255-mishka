var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
var contactsMap = document.querySelector('.contacts__map');
var links = document.querySelectorAll(".modal__link");
var popup = document.querySelector(".modal");
var close = document.querySelector(".modal__close");
if(popup) {
  var formInput = popup.querySelector("input");
}

navToggle.classList.remove('main-nav__toggle--no-js');
navMain.classList.add('main-nav--closed');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});

if(links) {
  for(var i=0; i < links.length; i++) {
    links[i].addEventListener("click", function (evt) {
      evt.preventDefault();
      popup.classList.add("modal--show");
      formInput.focus();
    });
  }

  if(close) {
    close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal--show");
    });
  }

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      if (popup.classList.contains("modal--show")) {
        popup.classList.remove("modal--show");
      }
    }
  });
}

if(contactsMap) {
  contactsMap.addEventListener("click", function (evt) {
    evt.preventDefault();
  });
}

function initMap() {
  var mishka = {lat: 59.938631, lng: 30.323055};
  var image = {
    url: "../img/icon-map-pin.svg",
    size: new google.maps.Size(66, 101),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(33, 101),
    scaledSize: new google.maps.Size(66, 101),
  };
  var shape = {
    coords: [32, 101, 66, 45, 66, 20, 46, 0, 20, 0, 0, 20, 0, 45],
    type: 'poly'
  };
  var map = new google.maps.Map(contactsMap, {
    zoom: 16,
    center: {lat: 59.938841, lng: 30.322855}
  });
  var marker = new google.maps.Marker({
    position: mishka,
    map: map,
    icon: image,
    shape: shape,
    optimized: false,
    title: "Магазин вязаных вещей «Мишка»"
  });
}
