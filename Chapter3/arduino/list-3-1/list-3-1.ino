int switchButton = 2;
void setup() {
  Serial.begin(9600);
  pinMode(switchButton, INPUT); 
}

void loop() {
  // put your main code here, to run repeatedly:
  int buttonState = digitalRead(switchButton);
  if (buttonState == HIGH) {
    Serial.println("1");
  } else {
    Serial.println("0");
  }
  delay(500);
}
