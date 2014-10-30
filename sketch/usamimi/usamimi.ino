#include <Servo.h>
#define PIN_PULSE 0
#define PIN_SERVO 9
#define PIN_LED 13

// variables for servo
Servo myServo;
int pos = 0;

// variables for Pulsesensor
volatile int BPM;                 // Pulse rate
volatile int Signal;              // incoming raw data
volatile int IBI = 600;           // time between beats
volatile boolean Pulse = false;   // true when Pulse wave is high
volatile boolean QS = false;      // true when Arduino finds a beat
boolean state = true;
int cnt = 0;

// usamimi
boolean isMoving = false;

void setup() {
  myServo.attach(PIN_SERVO);
  interruptSetup();

  pinMode(PIN_LED, OUTPUT);
  Serial.begin(9600);  
}

void loop() {
  digitalWrite(PIN_LED, QS);
  if (QS) {
    Serial.print("BPM: ");
    Serial.println(BPM);
  }
  if (QS && BPM > 70) {
    pyonpyon();
  }
  if (state) {
    int _pin[4] = {3, 5, 6, 9};
    for (int i = 0; i < 4; i++) {
      digitalWrite(_pin[i], HIGH);
      delay(20);
      digitalWrite(_pin[i], LOW);
      delay(20);
    }
    if (++cnt > 5) {
      state = false;
    }
  } else {
    int _pin[4] = {9, 6, 5, 3};
    for (int i = 0; i < 4; i++) {
      digitalWrite(_pin[i], HIGH);
      delay(20);
      digitalWrite(_pin[i], LOW);
      delay(20);
    }
    if (--cnt <= 0) {
      state = true;
    }
  }

  delay(20);
}

void pyonpyon() {
  if (isMoving) {
    return;
  }
  isMoving = true;
  for (pos = 0; pos < 90; pos++) {
    myServo.write(pos);
    delay(15);
  }
  for (pos = 90; pos > 0; pos--) {
    myServo.write(pos);
    delay(15);
  }
  isMoving = false;
}
