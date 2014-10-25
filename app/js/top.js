$(function() {
  // k.showDebugLog();
  var $containerUnconnected = $('#container-unconnected');
  var $containerConnected = $('#container-connected');
  // $containerConnected.hide();

  var map, latitude, longitude, myLatLng;
  var dest, destLat, destLng, distance;
  var blinkTimer, currentLedState = 0;

  // グラフ
  var graphX = new Graph('#graph-acc-x', {
    max: { y: 1300 },
    color: '#ff9999'
  });
  var graphY = new Graph('#graph-acc-y', {
    max: { y: 1300 },
    color: '#99ff99'
  });
  var graphZ = new Graph('#graph-acc-z', {
    max: { y: 1300 },
    color: '#9999ff'
  });

  function calcDistance() {
    destLat = dest.geometry.location.lat();
    destLng = dest.geometry.location.lng();
    distance = geolib.getDistance(
        { latitude: latitude, longitude: longitude },
        { latitude: destLat, longitude: destLng }
        );
    $('#distance').text(distance);

    if (blinkTimer != null) {
      clearInterval(blinkTimer);
      blinkTimer = null;
    }
    if (distance < 50) {
      blinkTimer = setInterval(function() {
        currentLedState = (currentLedState === 0) ? 100 : 0;
        k.pwmLedDrive(k.PIO1, currentLedState);
      }, 1000);
    } else if (distance < 100) {
      blinkTimer = setInterval(function() {
        currentLedState = (currentLedState === 0) ? 80 : 0;
        k.pwmLedDrive(k.PIO1, currentLedState);
      }, 2000);
    } else if (distance < 200) {
      blinkTimer = setInterval(function() {
        currentLedState = (currentLedState === 0) ? 70 : 0;
        k.pwmLedDrive(k.PIO1, currentLedState);
      }, 3000);
    } else if (distance < 500) {
      blinkTimer = setInterval(function() {
        currentLedState = (currentLedState === 0) ? 70 : 0;
        k.pwmLedDrive(k.PIO1, currentLedState);
      }, 5000);
    }
  }

  // 位置情報の監視
  navigator.geolocation.watchPosition(function(pos) {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    myLatLng = new google.maps.LatLng(latitude, longitude);
    $('#latitude').text(latitude);
    $('#longitude').text(longitude);
    if (map == null) initializeMap();
    if (dest != null) calcDistance();
  });

  var initializeMap = function() {
    var mapOpts = {
      center: myLatLng, zoom: 11, mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOpts);
  };

  // 目的地の設定
  $('#form-dest').on('submit', function() {
    var destName = $('#form-dest input[name=dest]').val();
    var service = new google.maps.places.PlacesService(map);
    service.textSearch({ query: destName }, function(result, status) {
      dest = result[0];
      $('#dest').text(result[0].name);
      calcDistance();
    });
    return false;
  });

  // konashiのコールバックたち
  var onBtnConnectClicked = function(e) {
    k.find();
  };

  var onKonashiConnected = function() {
    $containerUnconnected.hide()
    $containerConnected.show()
  };

  var onKonashiDisconnected = function() {
    $containerUnconnected.show()
    $containerConnected.hide()
  };

  var onKonashiReady = function() {
    var accPins = {};
    // var currentLedState = k.LOW;
    // k.pinMode(k.PIO1, k.OUTPUT);
    k.pwmMode(k.PIO1, k.KONASHI_PWM_ENABLE_LED_MODE);
    // setInterval(function() {
      // // currentLedState = (currentLedState === k.HIGH) ? k.LOW : k.HIGH;
      // // k.digitalWrite(k.PIO1, currentLedState);
      // currentLedState = (currentLedState < 100) ? (currentLedState+1): 0;
      // k.pwmLedDrive(k.PIO1, currentLedState);
    // }, 10);
    setInterval(function() {
      $.each([k.AIO0, k.AIO1, k.AIO2], function(pin) {
        k.analogReadRequest(pin);
      })
    }, 1000);
  };

  var onKonashiUpdateAccX = function(data) {
    $('#acc-x').text(data.value);
    graphX.add(data.value);
  };

  var onKonashiUpdateAccY = function(data) {
    $('#acc-y').text(data.value);
    graphY.add(data.value);
  };

  var onKonashiUpdateAccZ = function(data) {
    $('#acc-z').text(data.value);
    graphZ.add(data.value);
  };

  $('#btn-connect').on('click', onBtnConnectClicked);
  k.addObserver(k.KONASHI_EVENT_CONNECTED, onKonashiConnected);
  k.addObserver(k.KONASHI_EVENT_DISCONNECTED, onKonashiDisconnected);
  k.addObserver(k.KONASHI_EVENT_READY, onKonashiReady);
  k.addObserver(k.KONASHI_EVENT_UPDATE_ANALOG_VALUE_AIO0, onKonashiUpdateAccX);
  k.addObserver(k.KONASHI_EVENT_UPDATE_ANALOG_VALUE_AIO1, onKonashiUpdateAccY);
  k.addObserver(k.KONASHI_EVENT_UPDATE_ANALOG_VALUE_AIO2, onKonashiUpdateAccZ);
});
