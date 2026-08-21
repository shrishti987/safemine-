#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>
#include <Wire.h>
#include <MPU6050.h>

// ================= WIFI =================
#define WIFI_SSID "Piyush"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// ================= FIREBASE =================
// Apne current working code wali API KEY yahan paste karo
#define API_KEY "YOUR_FIREBASE_API_KEY"

// Ye tumhara existing URL hai
#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"

// ================= PINS =================
#define DHT_PIN 4
#define DHT_TYPE DHT11

#define MQ2_PIN 34
#define BUZZER_PIN 25

// ================= OBJECTS =================
DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_BMP085 bmp;
MPU6050 mpu;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ================= THRESHOLDS =================
#define TEMP_LIMIT 36.0
#define GAS_LIMIT 1200

// Pressure safe range
#define PRESS_LOW 900
#define PRESS_HIGH 1100

// MPU motion
#define MOTION_THRESHOLD 0.15

// No motion = 10 minutes
#define NO_MOTION_TIME 600000UL

// ================= VARIABLES =================
unsigned long lastMotionTime = 0;
bool previousUncertain = false;

void setup() {

  Serial.begin(115200);
  delay(1000);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // ================= SENSOR START =================
  dht.begin();

  Wire.begin();

  if (!bmp.begin()) {
    Serial.println("BMP180 NOT FOUND!");
  } else {
    Serial.println("BMP180 OK");
  }

  mpu.initialize();

  if (mpu.testConnection()) {
    Serial.println("MPU6050 OK");
  } else {
    Serial.println("MPU6050 NOT FOUND!");
  }

  // ================= WIFI =================
  Serial.println("Connecting to WiFi...");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // ================= FIREBASE =================
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase Anonymous Login OK!");
  } else {
    Serial.print("Firebase Login ERROR: ");
    Serial.println(config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  delay(3000);

  lastMotionTime = millis();

  Serial.println("SafeMine System Started!");
}

// ================= LOOP =================
void loop() {

  // -------- TEMPERATURE / HUMIDITY --------
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // -------- GAS --------
  int gasValue = analogRead(MQ2_PIN);

  // -------- PRESSURE --------
  float pressure = 0;

  if (bmp.begin()) {
    pressure = bmp.readPressure() / 100.0;
  }

  // -------- MPU6050 --------
  int16_t ax, ay, az;
  int16_t gx, gy, gz;

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // Convert acceleration to g
  float axg = ax / 16384.0;
  float ayg = ay / 16384.0;
  float azg = az / 16384.0;

  // Total acceleration
  float totalAcceleration =
      sqrt((axg * axg) +
           (ayg * ayg) +
           (azg * azg));

  // Motion detection
  bool motion = abs(totalAcceleration - 1.0) > MOTION_THRESHOLD;

  if (motion) {
    lastMotionTime = millis();
  }

  bool noMotion =
      (millis() - lastMotionTime >= NO_MOTION_TIME);

  // Impact detection
  bool impact = totalAcceleration > 2.5;

  // -------- CONDITION --------
  bool danger = false;
  bool uncertain = false;

  // Danger conditions
  if (temperature >= TEMP_LIMIT) {
    danger = true;
  }

  if (gasValue >= GAS_LIMIT) {
    danger = true;
  }

  if (pressure < PRESS_LOW || pressure > PRESS_HIGH) {
    danger = true;
  }

  if (impact) {
    danger = true;
  }

  // Uncertain condition
  if (noMotion) {
    uncertain = true;
  }

  String condition;

  if (danger) {
    condition = "DANGER";
  }
  else if (uncertain) {
    condition = "UNCERTAIN";
  }
  else {
    condition = "NORMAL";
  }

  // ================= BUZZER =================
  // DANGER ya UNCERTAIN hone par 2 sec beep

bool alertCondition = (condition == "DANGER" || condition == "UNCERTAIN");

if (alertCondition && !previousUncertain) {

  Serial.println("ALERT -> BUZZER ON");

  digitalWrite(BUZZER_PIN, HIGH);
  delay(2000);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("BUZZER OFF");
}

previousUncertain = alertCondition;

  // ================= SERIAL =================
  Serial.println("--------------------------------");

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Gas Value: ");
  Serial.println(gasValue);

  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");

  Serial.print("AX: ");
  Serial.print(ax);
  Serial.print("  AY: ");
  Serial.print(ay);
  Serial.print("  AZ: ");
  Serial.println(az);

  Serial.print("GX: ");
  Serial.print(gx);
  Serial.print("  GY: ");
  Serial.print(gy);
  Serial.print("  GZ: ");
  Serial.println(gz);

  Serial.print("Motion: ");
  Serial.println(motion ? "TRUE" : "FALSE");

  Serial.print("Impact: ");
  Serial.println(impact ? "TRUE" : "FALSE");

  Serial.print("No Motion: ");
  Serial.println(noMotion ? "TRUE" : "FALSE");

  Serial.print("Condition: ");
  Serial.println(condition);

  // ================= FIREBASE =================
  if (Firebase.ready()) {

    Firebase.RTDB.setFloat(
      &fbdo, "/SafeMine/temperature", temperature);

    Firebase.RTDB.setFloat(
      &fbdo, "/SafeMine/humidity", humidity);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/gas", gasValue);

    Firebase.RTDB.setFloat(
      &fbdo, "/SafeMine/pressure", pressure);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/acceleration/AX", ax);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/acceleration/AY", ay);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/acceleration/AZ", az);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/gyro/GX", gx);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/gyro/GY", gy);

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/gyro/GZ", gz);

    Firebase.RTDB.setBool(
      &fbdo, "/SafeMine/motion", motion);

    Firebase.RTDB.setBool(
      &fbdo, "/SafeMine/impact", impact);

    Firebase.RTDB.setBool(
      &fbdo, "/SafeMine/noMotion", noMotion);

    Firebase.RTDB.setBool(
      &fbdo, "/SafeMine/mpuOK", mpu.testConnection());

    Firebase.RTDB.setBool(
      &fbdo, "/SafeMine/bmpOK", true);

    Firebase.RTDB.setString(
      &fbdo, "/SafeMine/condition", condition);

    Firebase.RTDB.setString(
      &fbdo, "/SafeMine/systemStatus", "ONLINE");

    Firebase.RTDB.setInt(
      &fbdo, "/SafeMine/lastUpdate", millis());

    Serial.println("Firebase Updated!");
  }

  delay(3000);
}