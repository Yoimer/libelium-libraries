/*  
 *  3G + GPS shield
 *  
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

//Change here your data
const char pin[]="*******";
const char apn[]="*******";
const char user_name[]="*******";
const char password[]="*******";
const char ftp_server[]="*******";
const char ftp_user_name[]="*******";
const char ftp_password[]="*******";
const char ftp_server_port[]="990";

char file_name[]="test.txt";

int8_t answer;
int onModulePin= 2;
char aux_str[50];

void setup(){

  pinMode(onModulePin, OUTPUT);
  Serial.begin(115200);   

  Serial.println("Starting...");
  power_on();

  delay(3000);

  //sets the PIN code
  snprintf(aux_str, sizeof(aux_str), "AT+CPIN=%s", pin);
  sendATcommand(aux_str, "OK", 2000);

  delay(3000);

  // waits for signal
  while( (sendATcommand("AT+CREG?", "+CREG: 0,1", 500) || 
    sendATcommand("AT+CREG?", "+CREG: 0,5", 500)) == 0 );

  // sets APN, user name and password
  snprintf(aux_str, sizeof(aux_str), "AT+CGSOCKCONT=1,\"IP\",\"%s\"", apn);
  sendATcommand(aux_str, "OK", 2000);

  snprintf(aux_str, sizeof(aux_str), "AT+CSOCKAUTH=1,1,\"%s\",\"%s\"", user_name, password);
  sendATcommand(aux_str, "OK", 2000);

  //It's normal if this command return ERROR, we need to ensure it's stopped before starting it
  sendATcommand("AT+CFTPSSTOP", "OK", 5000); 

  // acquires FTPS protocol stack
  answer = sendATcommand("AT+CFTPSSTART", "OK", 5000);
  if (answer == 1)
  {     
    // login the FTPS server  
    snprintf(aux_str, sizeof(aux_str), "AT+CFTPSLOGIN=\"%s\",%s,\"%s\",\"%s\"", ftp_server, ftp_server_port, ftp_user_name, ftp_password);            
    answer = sendATcommand(aux_str, "OK", 2000);
    
    if (answer == 1)
    {    
      // the file must be in the current directory
      sprintf(aux_str, "AT+CFTPSPUTFILE=\"%s\",0", file_name);
      answer = sendATcommand(aux_str, "+CFTPSPUTFILE: 0", 60000);
      if (answer == 1)
      {
        Serial.println("Upload done");
      }
      else
      {
        Serial.println("Upload fail");        
      }

      sendATcommand("AT+CFTPSLOGOUT", "OK", 10000);
    }
    else
    {
      Serial.println("Login fail");
    }            
    sendATcommand("AT+CFTPSSTOP", "OK", 5000);        
  }
  else
  {
    Serial.println("Error acquiring the protocol stack");    
  }


}
void loop(){

}

void power_on(){

  uint8_t answer=0;

  // checks if the module is started
  answer = sendATcommand("AT", "OK", 2000);
  if (answer == 0)
  {
    // power on pulse
    digitalWrite(onModulePin,HIGH);
    delay(3000);
    digitalWrite(onModulePin,LOW);

    // waits for an answer from the module
    while(answer == 0){    
      // Send AT every two seconds and wait for the answer
      answer = sendATcommand("AT", "OK", 2000);    
    }
  }

}


int8_t sendATcommand(char* ATcommand, char* expected_answer1, unsigned int timeout)
{

  uint8_t x=0,  answer=0;
  char response[100];
  unsigned long previous;

  memset(response, '\0', 100);    // Initialize the string

  delay(100);

  while( Serial.available() > 0) Serial.read();    // Clean the input buffer

  Serial.println(ATcommand);    // Send the AT command 


    x = 0;
  previous = millis();

  // this loop waits for the answer
  do{

    if(Serial.available() != 0){    
      response[x] = Serial.read();
      x++;
      // check if the desired answer is in the response of the module
      if (strstr(response, expected_answer1) != NULL)    
      {
        answer = 1;
      }
    }
    // Waits for the answer with time out
  }
  while((answer == 0) && ((millis() - previous) < timeout));    

  return answer;
}

        