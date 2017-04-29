/*  
 *  3G + GPS shield
 *  
 *  The code example and the connection diagram shown below are used to 
 *  originate a voice call and, pushing a button, end that voice call. 
 *  The button is connected between digital pin 12 an ground. A 10kΩ pull-up 
 *  resistor is needed 
 *  at this pin.

 *  Copyright (C) Libelium Comunicaciones Distribuidas S.L. 
 *  http://www.libelium.com 
 *  
 *  This program is free software: you can redistribute it and/or modify 
 *  it under the terms of the GNU General Public License as published by 
 *  the Free Software Foundation, either version 3 of the License, or 
 *  (at your option) any later version. 
 *  a
 *  This program is distributed in the hope that it will be useful, 
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License 
 *  along with this program.  If not, see http://www.gnu.org/licenses/. 
 *  
 *  Version:           2.0
 *  Design:            David Gascón 
 *  Implementation:    Alejandro Gallego & Victor Boria
 */


int8_t answer;
int onModulePin = 2;
int button = 12;
char aux_str[30];

//Change here your data
const char pin[] = "****";
const char phone_number[] = "*********";   // ********* is the number to call


void setup() {

  pinMode(onModulePin, OUTPUT);
  pinMode(button, INPUT);
  Serial.begin(115200);

  Serial.println("Starting...");
  power_on();

  delay(3000);

  //sets the PIN code
  sprintf(aux_str, "AT+CPIN=%s", pin);
  sendATcommand(aux_str, "OK", 2000);

  delay(3000);

  Serial.println("Connecting to the network...");

  //Enables the use of command ATH
  sendATcommand("AT+CVHU=0", "OK", 10000);

  while ( (sendATcommand("AT+CREG?", "+CREG: 0,1", 500) ||
           sendATcommand("AT+CREG?", "+CREG: 0,5", 500)) == 0 );
  
  Serial.print("Calling to ");
  Serial.print(phone_number);
  Serial.println("...Press button to hang");

  
  //Make the phone call
  sprintf(aux_str, "ATD%s;", phone_number);
  sendATcommand(aux_str, "OK", 10000);

  // press the button for hang the call
  while (digitalRead(button) == 1);
  
  // disconnects the existing call
  Serial.println("ATH");            
  Serial.println("Call disconnected");


}

void loop() {

}

void power_on() {

  uint8_t answer = 0;

  // checks if the module is started
  answer = sendATcommand("AT", "OK", 2000);
  if (answer == 0)
  {
    // power on pulse
    digitalWrite(onModulePin, HIGH);
    delay(3000);
    digitalWrite(onModulePin, LOW);

    // waits for an answer from the module
    while (answer == 0) {   // Send AT every two seconds and wait for the answer
      answer = sendATcommand("AT", "OK", 2000);
    }
  }

}

int8_t sendATcommand(char* ATcommand, char* expected_answer, unsigned int timeout) {

  uint8_t x = 0,  answer = 0;
  char response[100];
  unsigned long previous;

  memset(response, '\0', 100);    // Initialize the string

  delay(100);

  while ( Serial.available() > 0) Serial.read();   // Clean the input buffer

  Serial.println(ATcommand);    // Send the AT command


  x = 0;
  previous = millis();

  // this loop waits for the answer
  do {
    if (Serial.available() != 0) {
      // if there are data in the UART input buffer, reads it and checks for the answer
      response[x] = Serial.read();
      x++;
      // check if the desired answer  is in the response of the module
      if (strstr(response, expected_answer) != NULL)
      {
        answer = 1;
      }
    }
    // Waits for the answer with time out
  } while ((answer == 0) && ((millis() - previous) < timeout));

  return answer;
}

        