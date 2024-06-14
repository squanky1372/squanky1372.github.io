// banner Slider
var bannerSlider = new Swiper('.bannerSlider', {
    init: false,
    speed: 0,
    spaceBetween: 0,
    lazy: {
        loadPrevNext: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    loop: false
})



// set google map style
var mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.government",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.medical",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]

function initMap() {
    // init Map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: {
            lat: 21.7679,
            lng: 78.8718
        },
        styles: mapStyle
    });

    // // Define the LatLng coordinates for the polygon's path.
    // const triangleCoords = [
    //     { lat: 25.774, lng: -80.19 },
    //     { lat: 18.466, lng: -66.118 },
    //     { lat: 32.321, lng: -64.757 },
    //     { lat: 25.774, lng: -80.19 },
    // ];

    // // Construct the polygon.
    // const bermudaTriangle = new google.maps.Polygon({
    //     paths: triangleCoords,
    //     strokeColor: "#FF0000",
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: "#FF0000",
    //     fillOpacity: 0.35,
    // });

    // bermudaTriangle.setMap(map);
    // bermudaTriangle.addListener("click", showArrays);


    // ask current locations
    $(".giveAccess").click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // set current locations
                map.setCenter(pos);
                map.setZoom(10);
            });
        }
        $(this).hide()
    });

    // InfoWindow
    infoWindow = new google.maps.InfoWindow();

    // marker
    var marker, count;
    var image = {
        url: 'logo.png',
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };
    map.data.loadGeoJson("NP.geojson");
    parks_visited_data = null
    $.getJSON("parks_visited.json", function(data){
      console.log(data)
      parks_visited_data = data
    })
    map.data.setStyle(function(feature) {
      console.log(feature.Gg)
      console.log(parks_visited_data[feature.Gg.PARKNAME])
      // var ascii = feature.getProperty('ascii');
      var color = parks_visited_data[feature.Gg.PARKNAME] ? 'green' : 'red';
      return {
        fillColor: color,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0.35,
      };
    });
    map.data.addListener('click', function(event) {
      console.log(event.feature.Gg.PARKNAME)
      document.getElementById("hover").innerHTML = event.feature.Gg.PARKNAME
      // console.log(parks_visited_data[feature.Gg.PARKNAME])
      // event.feature.setProperty('isColorful', true);
    });

    $.getJSON("locations.json", function(data) {
        var items = [];
        $.each(data, function(key, locations) {
            // set marker with infow window
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations.lat, locations.lng),
                map: map,
                icon: locations.icon,
                title: locations.title,
                id: locations.id
            });
            // open info window

            google.maps.event.addListener(marker, 'click', (function(marker, count) {
                return function() {
                    // get clicked id then init slider and slide to respective slider
                    var getImgNumber = locations.id
                    bannerSlider.init();
                    bannerSlider.slideTo(getImgNumber);
                    $("#popup").addClass("show");
                }
            })(marker, count));

            // click events
            document.getElementById("close").addEventListener("click", hidePopup);

            // hide pop up
            function hidePopup() {
                $("#popup").removeClass("show");
            }


            // generate slider
            var bannerSliderSwiper = $('.bannerSlider .swiper-wrapper');
            bannerSliderSwiper.append("<div class='swiper-slide'><img data-src='" + locations.img + "' class='swiper-lazy banner' /><h4>" + locations.title + "</h4><div class='swiper-lazy-preloader swiper-lazy-preloader-white'></div></div>");

        });
    });




}

function showArrays(event) {
    console.log("hi")
    // Since this polygon has only one path, we can call getPath() to return the
    // MVCArray of LatLngs.
    // @ts-ignore
    const polygon = this;
    const vertices = polygon.getPath();
    let contentString =
      "<b>Bermuda Triangle polygon</b><br>" +
      "Clicked location: <br>" +
      event.latLng.lat() +
      "," +
      event.latLng.lng() +
      "<br>";
  
    // Iterate over the vertices.
    for (let i = 0; i < vertices.getLength(); i++) {
      const xy = vertices.getAt(i);
  
      contentString +=
        "<br>" + "Coordinate " + i + ":<br>" + xy.lat() + "," + xy.lng();
    }
  
    // Replace the info window's content and position.
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
  }

