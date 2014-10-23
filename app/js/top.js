$(function() {
  k.showDebugLog();

  var onBtnConnectClicked = function(e) {
    console.log("connect button clicked");
    k.find();
  };

  var onKonashiConnected = function() {
  };

  var onKonashiDisconnected = function() {
  };

  var onKonashiReady = function() {
    var accPins = {};
    k.pinMode(k.LED2, k.OUTPUT);
    k.digitalWrite(k.LED2, k.HIGH);
    setInterval(function() {
      $.each([k.AIO0, k.AIO1, k.AIO2], function(pin) {
        k.analogReadRequest(pin);
      })
    }, 1000);
  };

  var onKonashiUpdateAccX = function() {
    k.analogRead(k.AIO0, function(value) {
      $('#acc-x').text(value);
    });
  };

  var onKonashiUpdateAccY = function() {
    k.analogRead(k.AIO1, function(value) {
      $('#acc-y').text(value);
    });
  };

  var onKonashiUpdateAccZ = function() {
    k.analogRead(k.AIO2, function(value) {
      $('#acc-z').text(value);
    });
  };

  $('#btn-connect').on('click', onBtnConnectClicked);
  k.addObserver(k.KONASHI_EVENT_CONNECTED, onKonashiConnected);
  k.addObserver(k.KONASHI_EVENT_DISCONNECTED, onKonashiDisconnected);
  k.addObserver(k.KONASHI_EVENT_READY, onKonashiReady);
  k.addObserver(k.KONASHI_EVENT_UPDATE_ANALOG_VALUE_AIO0, onKonashiUpdateAccX);
  k.addObserver(k.KONASHI_EVENT_UPDATE_ANALOG_VALUE_AIO1, onKonashiUpdateAccY);
  k.addObserver(k.KONASHI_EVENT_UPDATE_ANALOG_VALUE_AIO2, onKonashiUpdateAccZ);
});
