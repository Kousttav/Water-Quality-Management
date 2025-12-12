Software Requirements Specification (SRS)
Water Quality Monitoring & Prediction System
Version 1.0
## 1. Introduction
### 1.1 Purpose

```
The purpose of this document is to describe the complete specifications for a Water Quality Monitoring & Prediction System.
The system collects water parameters using sensors connected to an STM32MP157F-DK2, sends data automatically to a machine-learning powered web server, predicts water quality, and displays the result on a web dashboard.
```
### 1.2 Scope

```
The system includes:

Hardware sensors: TDS, Turbidity, pH, Temperature

Microcontroller: STM32MP157F-DK2 (M4 core + A7 Linux)

Data transmission through RPMsg + HTTP (REST API)

A web-based backend with a trained ML model

A user-facing website showing real-time predictions

This SRS covers design, functional requirements, non-functional requirements, hardware/software specs, and constraints.
```

### 1.3 Definitions
```
Term	Definition
TDS	Total Dissolved Solids
pH	Acidity/alkalinity measurement
ML	Machine Learning
API	Application Programming Interface
RPMsg	Interprocessor communication channel (M4 ↔ A7)
```
## 2. Overall Description
### 2.1 Product Perspective

```
This project is a combination of embedded hardware and web software.
The system senses water quality parameters → preprocesses → sends to server → ML predicts quality → web app displays results.

System Block Diagram
Sensors → STM32MP1 M4 Core → RPMsg → Linux A7 → HTTP POST → ML Backend → Dashboard
```
### 2.2 Product Functions
```
Acquire analog sensor data

Convert raw values into meaningful units

Transmit sensor values to server

Run ML prediction on server

Display “Water Quality Status” on website

Store past records (optional)
```
###2.3 User Classes & Characteristics
```
General users: want to check instant water quality

Admin: manages backend and monitors logs

Developers: maintain firmware & ML model
```
###2.4 Operating Environment
```
STM32MP157F-DK2 (Linux + M4 firmware)

Python-based server (Flask/FastAPI)

Browser for UI (Chrome, Edge, Firefox)

Power supply: 5V for STM32 board

Sensors operate in water environment
```
## 3. System Features (Functional Requirements)
### 3.1 Sensor Data Acquisition
```
Description:
The system reads values from TDS, turbidity, pH, and temperature sensors.

Functional Requirements:

FR-1: STM32 M4 shall read ADC values from all sensors at 1-second intervals.

FR-2: The M4 firmware shall format data as comma-separated or JSON.

FR-3: Raw values shall be calibrated using predefined formulas.
```
### 3.2 Inter-Processor Communication
```
Description:
The M4 sends sensor data to the A7 Linux core.

Functional Requirements:

FR-4: The system shall use RPMsg to transmit data.

FR-5: A7 shall receive data from /dev/ttyRPMSG0.
```
### 3.3 Data Transmission to Web Server
```
Description:
The Linux script exports the data to the ML backend.

Functional Requirements:

FR-6: A7 shall convert sensor data to JSON format.

FR-7: Data shall be sent via HTTP POST to /predict.

FR-8: In case of network failure, the script shall retry after intervals.
```
### 3.4 Machine Learning Prediction
```
Description:
Server receives data and predicts water quality using ML.

Functional Requirements:

FR-9: Server shall load model.pkl at startup.

FR-10: Input features shall match training dimensions.

FR-11: Server shall compute the output within 1 second.

FR-12: Server shall return prediction in JSON format.
```
### 3.5 Web Dashboard
```
Description:
Frontend displays live data & prediction.

Functional Requirements:

FR-13: Website shall show latest sensor values.

FR-14: Website shall show "Good / Moderate / Bad" water quality.

FR-15: Website shall automatically refresh prediction.

FR-16: Optional: store history graph (TDS, pH, Temp, Turbidity).
```
## 4. Non-Functional Requirements
### 4.1 Performance Requirements
```
NFR-1: Data refresh rate ≤ 1 second.

NFR-2: Prediction latency ≤ 1 second.

NFR-3: Sensor reading accuracy ≥ 95% after calibration.
```
### 4.2 Reliability Requirements
```
NFR-4: System must auto-reconnect if server is unavailable.

NFR-5: Must handle invalid sensor values safely.
```
### 4.3 Security Requirements
```
NFR-6: API must accept only JSON POST requests.

NFR-7: API must validate sensor ranges.
```
### 4.4 Maintainability
```
NFR-8: Code must be modular: M4, A7, Backend, Frontend separated.

NFR-9: ML model should be updatable without changing API.
```
## 5. Hardware Requirements
### 5.1 Sensors
```
TDS sensor (0–3000 ppm)

Turbidity sensor (NTU-based)

Analog pH sensor

Temperature sensor (LM35 / DS18B20)
```
### 5.2 Microcontroller
```
STM32MP157F-DK2

ADC pins configured (0–3.3V)
```
### 5.3 Communication
```
Internet via WiFi dongle or Ethernet
```
## 6. Software Requirements
```
M4 Firmware

STM32CubeMP1 HAL

ADC configuration

RPMsg communication

A7 Linux Script

Python 3

requests and pyserial

Backend

Flask or FastAPI

sklearn / numpy

pickle model

Frontend

HTML, CSS, JS

AJAX / Fetch API
```
## 7. System Architecture Diagram
```
+---------------------+
|      Sensors        |
+----------+----------+
           |
    Analog Signals
           |
+----------v----------+
|  STM32MP1 M4 Core   |
|  (ADC + C firmware) |
+----------+----------+
           |
        RPMsg
           |
+----------v-----------+
|    STM32 A7 Linux    |
| Python Bridge Script |
+----------+-----------+
           |
        HTTP POST
           |
+----------v----------+
|    ML Backend API   |
|   model.pkl loaded  |
+----------+----------+
           |
         JSON
           |
+----------v----------+
|   Web Dashboard     |
+---------------------+
```
## 8. Constraints
```
All sensors must output within ADC acceptable range.

System depends on stable internet connectivity.

TDS and pH sensors require calibration for accuracy.

STM32MP157F-DK2 ADC input voltage limited to 3.3V.
```
## 9. Future Enhancements
```
Cloud data storage (Firebase / AWS)

Mobile app integration

Additional sensors (DO, ORP)

Automated water purification control
```
