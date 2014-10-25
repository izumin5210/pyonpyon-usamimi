$(function() {
  // k.showDebugLog();
  var $containerUnconnected = $('#container-unconnected');
  var $containerConnected = $('#container-connected');
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

  $containerConnected.hide();

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
    var currentLedState = 0;
    k.pwmMode(k.PIO1, k.KONASHI_PWM_ENABLE_LED_MODE);
    setInterval(function() {
      // currentLedState = (currentLedState === k.HIGH) ? k.LOW : k.HIGH;
      // k.digitalWrite(k.PIO1, currentLedState);
      currentLedState = (currentLedState < 100) ? (currentLedState+1): 0;
      k.pwmLedDrive(k.PIO1, currentLedState);
    }, 10);
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
