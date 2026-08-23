# ⛑️ SafeMine — Smart Mine Safety Monitoring Dashboard

> **Real-time mine safety monitoring system with worker tracking, smart helmet sensors, risk analysis, alerts, and evacuation management.**

SafeMine is a modern web-based mine safety monitoring dashboard designed to improve underground mining safety through **real-time sensor monitoring, worker tracking, risk assessment, and emergency alerts**.

The dashboard provides mine operators with a centralized **Command Center** to monitor workers, hazardous zones, environmental conditions, and safety alerts in real time.

---

## 🚀 Features

### 📊 Safety Command Center

* Real-time mine safety overview
* Overall mine risk score
* Critical safety statistics
* Active alerts monitoring
* Zone and worker risk analysis

### 👷 Worker Monitoring

* Live worker status
* Worker safety tracking
* Individual worker risk scores
* Critical worker identification
* Worker location monitoring

### 🗺️ Live Mine Map

* Visual representation of mine zones
* Zone-based risk monitoring
* Hazardous zone identification
* Worker location visualization

### ⛑️ Smart Helmet Monitoring

Monitor safety parameters from connected smart-helmet sensors, including:

* 🌡️ Temperature
* 💨 Gas / environmental readings
* ❤️ Worker safety parameters
* 📡 Sensor connectivity
* ⚠️ Abnormal sensor conditions

### 🚨 Intelligent Alerts

* Real-time safety alerts
* Critical hazard notifications
* Worker-specific alerts
* Zone-specific alerts
* Emergency condition monitoring

### 📈 Risk Analytics

* Mine-wide risk score
* Worker risk calculation
* Zone hazard analysis
* Risk-level classification
* Historical / simulated sensor trends

### 🚪 Evacuation Management

* Emergency situation monitoring
* Hazard zone identification
* Worker safety status
* Evacuation-oriented alerts

### 🎮 Simulation Mode

The dashboard supports simulation of changing mine conditions to demonstrate how the system responds to:

* Increasing temperature
* Sensor abnormalities
* Worker risk changes
* Zone hazards
* Emergency situations

---

## 🛠️ Tech Stack

| Technology          | Purpose                    |
| ------------------- | -------------------------- |
| React.js            | Frontend UI                |
| Vite                | Development & build tool   |
| Tailwind CSS        | Styling                    |
| JavaScript          | Application logic          |
| Lucide React        | Icons                      |
| Recharts            | Data visualization         |
| Firebase            | Real-time data integration |
| IoT / Smart Sensors | Mine monitoring            |

---

## 🏗️ Project Structure

```text
safemine/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── ...
│   │
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shrishti987/safemine-.git
```

### 2. Navigate to the project

```bash
cd safemine-
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🔥 Firebase Integration

SafeMine can be connected to Firebase for real-time sensor and safety data.

The system can receive live values from connected IoT devices and display them on the dashboard.

Example monitored parameters:

```text
Temperature
Gas Levels
Worker Status
Zone Risk
Sensor Status
Emergency Alerts
```

> **Security:** Firebase credentials and other sensitive environment variables should never be committed directly to GitHub.

---

## 🧠 Risk Monitoring

SafeMine classifies mine conditions into different safety levels.

```text
🟢 SAFE
🟡 AT RISK
🔴 CRITICAL
```

Risk levels can be calculated using multiple factors such as:

* Environmental sensor readings
* Worker condition
* Zone hazards
* Sensor abnormalities
* Emergency conditions

This allows mine operators to quickly identify areas requiring immediate attention.

---

## 🔄 System Workflow

```text
Smart Helmet / IoT Sensors
          │
          ▼
    Real-Time Data
          │
          ▼
       Firebase
          │
          ▼
     SafeMine App
          │
    ┌─────┴─────┐
    ▼           ▼
Risk Analysis  Alerts
    │           │
    └─────┬─────┘
          ▼
    Safety Dashboard
          │
          ▼
 Operator / Control Room
```

---

## 📱 Dashboard

The SafeMine dashboard provides a centralized view of:

* Total workers
* Safe workers
* At-risk workers
* Critical workers
* Active alerts
* Mine zones
* Overall mine risk
* Highest-risk worker
* Highest-risk zone
* Sensor readings
* Live mine map

---

## 🎯 Objectives

The primary objectives of SafeMine are:

1. **Improve underground worker safety**
2. **Detect hazardous conditions early**
3. **Provide real-time mine monitoring**
4. **Reduce response time during emergencies**
5. **Centralize worker and sensor information**
6. **Support data-driven safety decisions**

---

## 💡 Future Enhancements

Possible future improvements include:

* 🤖 AI-based hazard prediction
* 📍 GPS / indoor worker positioning
* 📱 Mobile application for supervisors
* 🔔 SMS / WhatsApp emergency notifications
* 🧠 Machine-learning-based risk prediction
* 📊 Advanced historical analytics
* 🗺️ 3D mine visualization
* 🎙️ Voice-based emergency alerts
* 🔋 Smart helmet battery monitoring
* 🛰️ Advanced IoT gateway integration

---

## 👥 Use Cases

SafeMine can be used by:

* Mining companies
* Mine control rooms
* Safety officers
* Mine supervisors
* Emergency response teams
* IoT-based mining safety systems
* Smart mining research projects

---

## 🌟 Why SafeMine?

Traditional mine monitoring systems often require operators to monitor multiple sources of information separately.

**SafeMine brings worker monitoring, sensor data, risk analysis, alerts, and mine-zone monitoring into a single command center.**

The goal is simple:

> **Detect risks early. Respond faster. Keep miners safer.**

---

## 📄 License

This project is developed for educational, research, and demonstration purposes.

---

## 👩‍💻 Author

**Shrishti Rawat**

BCA — Artificial Intelligence & Data Science

GitHub:
https://github.com/shrishti987

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**SafeMine — Technology for Safer Mining. ⛑️**
