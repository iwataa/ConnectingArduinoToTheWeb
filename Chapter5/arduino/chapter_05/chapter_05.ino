#include <LiquidCrystal.h>

const int ledRed = 7;
const int ledGreen = 6;
const int lcdRs = 8;
const int lcdEna = 9;
const int lcdD4 = 2;
const int lcdD5 = 3;
const int lcdD6 = 4;
const int lcdD7 = 5;

LiquidCrystal lcd(lcdRs, lcdEna, lcdD4, lcdD5, lcdD6, lcdD7);

const char DELIMITER = '*';
const char MESSAGE_MARK = 'M';
char charRead;
String inputString = "";
String outputString = "";
String currentString = "";

bool needScroll = false;

void setup() {
  Serial.begin(9600);
  pinMode(ledRed, OUTPUT);
  pinMode(ledGreen, OUTPUT);
  lcd.begin(16, 2);
  lcd.clear();
}

void loop() {
  if (Serial.available()) {
    charRead = Serial.read();
    if (charRead != DELIMITER) {
      inputString += charRead;
    } else {
      if (inputString[0] == MESSAGE_MARK) {
        lcd.clear();
        outputString = inputString.substring(1);
      } else if (inputString == "true_red") {
        digitalWrite(ledRed, 1);
      } else if (inputString == "false_red") {
        digitalWrite(ledRed, 0);
      } else if (inputString == "true_green") {
        digitalWrite(ledGreen, 1);
      } else if (inputString == "false_green") {
        digitalWrite(ledGreen, 0);
      }
      Serial.println(inputString);
      
      inputString = "";
    }
    //Serial.println(inputString);
  }

  if (currentString != outputString) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(outputString);
    needScroll = outputString.length() > 16;
    currentString = outputString;
  }

  if (needScroll && ((millis() % 500) == 0)) lcd.scrollDisplayLeft();
}
