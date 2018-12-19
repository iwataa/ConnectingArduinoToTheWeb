const int ledRed = 6;
const int ledGreen = 5;

char charRead;
String inputString = "";

void setup() {
  Serial.begin(9600);
  pinMode(ledRed, OUTPUT);
  pinMode(ledGreen, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    charRead = Serial.read();
    if (charRead != 'T') {
      inputString += charRead;
    } else {
      if (inputString == "true_red") {
        digitalWrite(ledRed, 1);
      } else if (inputString == "false_red") {
        digitalWrite(ledRed, 0);
      } else if (inputString == "true_green") {
        digitalWrite(ledGreen, 1);
      } else if (inputString == "false_green") {
        digitalWrite(ledGreen, 0);
      }
      inputString = "";
    }
    //Serial.println(inputString);
  }
}
