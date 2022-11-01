#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Wire.h>  // i2C Conection Library
#include <LiquidCrystal_I2C.h>  //i2C LCD Library
#include <WiFiClient.h> 
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <SimpleTimer.h> 
WiFiClient client;
HTTPClient http; 
SimpleTimer timer;
#include <Adafruit_Fingerprint.h>
SoftwareSerial mySerial(13, 15);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
uint8_t id;

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);
ESP8266WebServer server(81); //Menyatakan Webserver pada port 80

int FingerID = 0, t1, t2;                           // The Fingerprint ID from the scanner 
bool device_Mode = false;                           // Default Mode Enrollment
bool firstConnect = false;
String url = "http://10.10.10.7:4000";
String getData, Link;
unsigned long previousMillis = 0;


void setup(){
  wifi();
  lcd.init();
  enroll();
  finger.getTemplateCount();
  Serial.print("Sensor contains "); Serial.print(finger.templateCount); Serial.println(" templates");
  Serial.println("Waiting for valid finger...");
  lcd.backlight();
  lcd.setCursor(3,0);
  lcd.print("fingerprint");
  lcd.setCursor(3,1);
  lcd.print("telah aktif");
  delay(2000);

  //Timers---------------------------------------
  timer.setInterval(25000L,CheckMode);
  t1 = timer.setInterval(5000L,ChecktoAddID);
  t2 = timer.setInterval(15000L,ChecktoDeleteID);  
  CheckMode();

}

void loop(){
  lcd.init();

  delay(2000);
  timer.run();      //Keep the timer in the loop function in order to update the time as soon as possible
  //check if there's a connection to Wi-Fi or not
  if(!WiFi.isConnected()){
    if (millis() - previousMillis >= 10000) {
      previousMillis = millis();
      wifi();    //Retry to connect to Wi-Fi
    }
  }
  CheckFingerprint();   //Check the sensor if the there a finger.
  delay(10);
}
//================================Check Fingerprint========================================
void CheckFingerprint(){
  FingerID = getFingerprintID();
  DisplayFingerprintID();
}


//===================================Check Mode======================================
void CheckMode(){
  Serial.println("Check Mode");
  if(WiFi.isConnected()){
    getData ="/device/check/1";
    Link = url + getData;
    http.begin(client,Link);
    int httpCode = http.GET();
    String response = http.getString();
    Serial.println(Link);
    Serial.print("output:"); Serial.println(response);;
    DynamicJsonDocument doc(2048);
    if(httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY){ 
      Serial.println(response);
      Serial.println("Koneksi aktif");
      DeserializationError err = deserializeJson(doc,response);
      if (err) {
        Serial.print(F("deserializeJson() failed with code "));
        Serial.println(err.f_str());
      }
      JsonObject obj = doc.as<JsonObject>();
      Serial.println(obj);
      int result = obj[String("data")]["Mode"];
      //Serial.println(result);
      if(!firstConnect){
        device_Mode = result;
        firstConnect = true;
      }
      if(device_Mode && result){
        device_Mode = false;
        timer.disable(t1);
        timer.disable(t2);
        Serial.println("Device Mode: attendance");
        lcd.clear();
        lcd.setCursor(2,0);
        lcd.print("Device Mode:");
        lcd.setCursor(4,1);
        lcd.print("absensi");
        delay(1000);

      } 
      else if(!device_Mode && !result){
        device_Mode = true;
        timer.enable(t1);
        timer.enable(t2);
        Serial.println("Device Mode: Enrollment");
        lcd.clear();
        lcd.setCursor(2,0);
        lcd.print("Device Mode:");
        lcd.setCursor(5,1);
        lcd.print("daftar");
        delay(1000);
      }
      http.end();
    }
    http.end();

  }

}
//===========================check to add id=================================



//=============================================================================first of WIFI======================================================================
void wifi(){
  const char* ssid = "Cyberdesu";       // Nama SSID AP/Hotspot
  const char* password = "WibuNolep-21";       // Password Wifi
 
  Serial.begin(9600);
  delay(10);
 
// Connect to WiFi network ------------------------------------------------
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
// Mengatur WiFi ----------------------------------------------------------
  WiFi.mode(WIFI_STA);                      // Mode Station
  WiFi.begin(ssid, password);               // Mencocokan SSID dan Password
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
// Print status Connect ---------------------------------------------------
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//===============================Display fingerprint id===========================================
void DisplayFingerprintID(){
  //Fingerprint has been detected 
  if (FingerID > 0){
    SendFingerprintID( FingerID ); // Send the Fingerprint ID to the website.
    delay(2000);
  }
  //---------------------------------------------
  //No finger detected
  else if (FingerID == 0){
  }
  //---------------------------------------------
  //Didn't find a match
  else if (FingerID == -1){
  }
  //---------------------------------------------
  //Didn't find the scanner or there an error
  else if (FingerID == -2){
  }
}

void SendFingerprintID(int finger){
  Serial.println("Sending the Fingerprint ID");
  if(WiFi.isConnected()){
    getData = "/check/"+String(finger)+"/1";
    Link = url+getData;
    http.begin(client,Link);
    int httpCode = http.GET();
    String payload = http.getString();
    Serial.println(httpCode);   //Print HTTP return code
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY){
      Serial.print("ID finger yang akan didaftarkan: ");
      Serial.println(finger);
      Serial.println(payload);
      String test = payload.substring(0,5);
      Serial.println(test);     //Print request response payload

      if(payload.substring(0,14) == "selamat datang"){
        String nama = payload.substring(16);
        Serial.println(nama.length());
        if (nama.length() < 16){
          lcd.setCursor(0,0);
          lcd.print("Selamat datang,");
          lcd.setCursor(0,1);
          lcd.print(nama);
          delay(1000);
        } else {
          lcd.setCursor(0,0);
          lcd.print("Selamat datang,");
          delay(1000);
          lcd.clear();
          for (int i=0; i<50; i++){
          lcd.scrollDisplayRight();
          lcd.setCursor(0,0);
          lcd.print(nama);
          delay(200);}
        }
      } else if (payload.substring(0,5) == "telat"){
        //Serial.println("hayo");
        String nama = payload.substring(6);
        Serial.println(nama.length());
        if (nama.length() < 16){
          lcd.setCursor(0,0);
          lcd.print("Selamat datang,");
          lcd.setCursor(0,1);
          lcd.print(nama);
          delay(1000);
          lcd.clear();
          lcd.setCursor(1,0);
          lcd.print("Anda Terlambat");
          delay(1000);

        } else {
          lcd.setCursor(0,0);
          lcd.print("Selamat datang,");
          delay(1500);
          lcd.clear();
          for (int i=0; i<50; i++){
          lcd.scrollDisplayRight();
          lcd.setCursor(0,0);
          lcd.print(nama);
          delay(200);}
          lcd.clear();
          lcd.setCursor(1,0);
          lcd.print("Anda Terlambat");
          delay(1000);
        }

      } else if (payload.substring(0,5) == "sudah"){
          lcd.setCursor(0,0);
          lcd.print("Anda sudah absen");
          delay(1500);
      } else if (payload.substring(0,2) == "id"){
        lcd.setCursor(3,0);
        lcd.print("sidik jari");
        lcd.setCursor(1,1);
        lcd.print("sudah terdaftar");
        delay(1500);

      } else {
        lcd.setCursor(2,0);
        lcd.print("sedang dalam");
        lcd.setCursor(3,0);
        lcd.print("Mode Daftar");
        delay(1500);
      }

    }
    delay(10);
    http.end();
   

  }

}
//********************Get the Fingerprint ID******************
int getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken1");
      lcd.setCursor(0,0);
      lcd.print("Loading....");
      delay(1000);
      lcd.clear();
      break;
    case FINGERPRINT_NOFINGER:
      //Serial.println("No finger detected");
      return 0;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return -2;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return -2;
    default:
      Serial.println("Unknown error");
      return -2;
  }
  // OK success!
  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted1");
      break;
    case FINGERPRINT_IMAGEMESS:
      //Serial.println("Image too messy");
      return -1;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return -2;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return -2;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return -2;
    default:
      Serial.println("Unknown error");
      return -2;
  }
  // OK converted!
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");

  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return -2;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    lcd.setCursor(3,0);
    lcd.print("sidik jari");
    lcd.setCursor(2,1);
    lcd.print("tidak cocok!");
    delay(1000);
    return -1;
  } else {
    Serial.println("Unknown error");
    return -2;
  }   
  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID); 
  Serial.print(" with confidence of "); Serial.println(finger.confidence); 

  return finger.fingerID;
}

//=============================================================================end of WIFI======================================================================
//=============================================================================first of enroll======================================================================

void enroll(){
  Serial.begin(9600);
  while (!Serial);  // For Yun/Leo/Micro/Zero/...
  delay(100);
  Serial.println("\n\nAdafruit Fingerprint sensor enrollment");

  // set the data rate for the sensor serial port
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }

  Serial.println(F("Reading sensor parameters"));
  finger.getParameters();
  Serial.print(F("Status: 0x")); Serial.println(finger.status_reg, HEX);
  Serial.print(F("Sys ID: 0x")); Serial.println(finger.system_id, HEX);
  Serial.print(F("Capacity: ")); Serial.println(finger.capacity);
  Serial.print(F("Security level: ")); Serial.println(finger.security_level);
  Serial.print(F("Device address: ")); Serial.println(finger.device_addr, HEX);
  Serial.print(F("Packet len: ")); Serial.println(finger.packet_len);
  Serial.print(F("Baud rate: ")); Serial.println(finger.baud_rate);
}

uint8_t readnumber(void) {
  uint8_t num = 0;

  while (num == 0) {
    while (! Serial.available());
    num = Serial.parseInt();
  }
  return num;
}

void ChecktoAddID(){
  int httpcode = http.GET();
  if(WiFi.isConnected()){
    getData = "/getfingerid/get_id/1";
    Link = url + "/getfingerid/get_id/1";
    http.begin(client,Link);
    DynamicJsonDocument doc(2048);
    if(httpcode == HTTP_CODE_OK || httpcode == HTTP_CODE_MOVED_PERMANENTLY){
      Serial.println("Ready to enroll a fingerprint!");
      String payload = http.getString();
      DeserializationError err = deserializeJson(doc,payload);
      Serial.println("data addfinger:"+payload);
      if (err) {
        Serial.print(F("deserializeJson() failed with code "));
        Serial.println(err.f_str());
      }
      JsonObject obj = doc.as<JsonObject>();
      Serial.println(obj);
      id = obj[String("data")];
      Serial.println(id);
      if (id == 0) {// ID #0 not allowed, try again!
       return;
      }
      Serial.print("Enrolling ID #");
      Serial.println(id);
      lcd.setCursor(1,0);
      lcd.print("silahkan letak'kan");
      lcd.setCursor(3,1);
      lcd.print("sidik jari");
      delay(2000);
      lcd.clear();
      getFingerprintEnroll();
      http.end();
   }
    http.end();
  }
}

uint8_t getFingerprintEnroll() {
  int p = -1;
  while (p != FINGERPRINT_OK) {
          
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken2");
      lcd.setCursor(3,0);
      lcd.print("Sidik Jari");
      lcd.setCursor(3,1);
      lcd.print("terdeteksi");
      delay(2000);
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      //Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!
  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted2");
      lcd.setCursor(2,0);
      lcd.print("Sidik Jari");
      lcd.setCursor(2,1);
      lcd.print("valid");
      delay(2000);
      lcd.clear();
      break;
    case FINGERPRINT_IMAGEMESS:
      //Serial.println("Image too messy");
      lcd.setCursor(3,0);
      lcd.print("Sidik Jari");
      lcd.setCursor(2,1);
      lcd.print("tidak valid");
      delay(2000);
      lcd.clear();
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  Serial.println("Remove finger");
  lcd.setCursor(0,0);
  lcd.print("Lepaskan");
  lcd.setCursor(0,1);
  lcd.print("Sidik Jari");
  delay(2000);
  lcd.clear();
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID "); Serial.println(id);
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken3");
      break;
    case FINGERPRINT_NOFINGER:
      //Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      //Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted3");
      lcd.setCursor(3,0);
      lcd.print("Sidik Jari");
      lcd.setCursor(6,1);
      lcd.print("valid");
      delay(2000);
      lcd.clear();
      break;
    case FINGERPRINT_IMAGEMESS:
      //Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      //Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  
  // OK converted!
  Serial.print("Creating model for #");  Serial.println(id);
  
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
    lcd.setCursor(2,0);
    lcd.print("Sidik Jari");
    lcd.setCursor(2,1);
    lcd.print("cocok!");
    delay(2000);
    lcd.clear();
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    //Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    lcd.setCursor(3,0);
    lcd.print("Sidik Jari");
    lcd.setCursor(2,1);
    lcd.print("tidak cocok!");
    delay(2000);
    lcd.clear();
    return p;
  } else {
      Serial.println("Unknown error");
    return p;
  }   
  
  Serial.print("ID "); Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
      lcd.setCursor(3,0);
      lcd.print("Sidik Jari");
      lcd.setCursor(1,1);
      lcd.print("telah disimpan");
      delay(2000);
      lcd.clear();
    confirmAdding(id);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    //Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    //Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    //Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }   

}


//******************Check if there a Fingerprint ID to add******************
void confirmAdding(int id){
  Serial.println("confirm Adding");
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;    //Declare object of class HTTPClient
    //GET Data
    getData = "/confirm/1/" + String(id);// Add the Fingerprint ID to the Post array in order to send it
    //GET methode
    Link = url + getData;
    
    http.begin(client, Link); //initiate HTTP request,
    int httpCode = http.GET();   //Send the request
    String payload = http.getString();
    Serial.println(Link);  
    DynamicJsonDocument doc(2048);  //Get the response payload
    if(httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY){
      DeserializationError err = deserializeJson(doc,payload);
      if (err) {
        Serial.print(F("deserializeJson() failed with code "));
        Serial.println(err.f_str());
      }
      JsonObject obj = doc.as<JsonObject>();
      Serial.println(obj);
      delay(2000);
    }
    else{
      Serial.println("Error Confirm!!");      
    }
    http.end();  //Close connection
  }
}
//=============================================================================end of enroll=======================================================================
//=============================================================================first of delete====================================================================
void ChecktoDeleteID(){
  Serial.println("check to delete ID");
  if(WiFi.isConnected()){
    getData = "/deleteid/check/"+ String(device_Mode);
    Link = url + getData;
    http.begin(client,Link);
    int httpCode = http.GET();
    String payload = http.getString();
    DynamicJsonDocument doc(2048);
    if(httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY){
      String response = http.getString();
      Serial.println("check delete ID aktif");
      DeserializationError err = deserializeJson(doc,response);
      if (err) {
        Serial.print(F("deserializeJson() failed with code "));
        Serial.println(err.f_str());
      }
      JsonObject obj = doc.as<JsonObject>();
      uint8_t data = obj[String("data")];
      Serial.print("ID Data yg dihapus: ");
      Serial.println(data);
      deleteFingerprint(data);
      delay(1000);
    }
    http.end();
    
  }

}


uint8_t deleteFingerprint(uint8_t id) {
  uint8_t p = -1;
  
  p = finger.deleteModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Deleted!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    //Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not delete in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.print("Unknown error: 0x"); Serial.println(p, HEX);
    return p;
  }   
}

//=============================================================================end of delete====================================================================