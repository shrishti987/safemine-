const sensors = [
  {
    id: "SNS-001",
    helmetId: "HLM-001",
    workerId: "SM-001",
    worker: "Arjun Singh",
    zone: "Zone A",

    gas: {
      value: 16.8,
      unit: "ppm",
      status: "Normal",
      threshold: 50,
    },

    temperature: {
      value: 31.2,
      unit: "°C",
      status: "Normal",
      threshold: 40,
    },

    motion: {
      value: 0.08,
      unit: "g",
      status: "Normal",
      threshold: 0.5,
    },

    battery: {
      value: 94,
      unit: "%",
      status: "Good",
      threshold: 30,
    },

    signal: {
      value: 96,
      unit: "%",
      status: "Excellent",
      threshold: 70,
    },
  },

  {
    id: "SNS-002",
    helmetId: "HLM-002",
    workerId: "SM-002",
    worker: "Rohit Kumar",
    zone: "Zone B",

    gas: {
      value: 19.4,
      unit: "ppm",
      status: "Normal",
      threshold: 50,
    },

    temperature: {
      value: 32.1,
      unit: "°C",
      status: "Normal",
      threshold: 40,
    },

    motion: {
      value: 0.11,
      unit: "g",
      status: "Normal",
      threshold: 0.5,
    },

    battery: {
      value: 88,
      unit: "%",
      status: "Good",
      threshold: 30,
    },

    signal: {
      value: 91,
      unit: "%",
      status: "Excellent",
      threshold: 70,
    },
  },

  {
    id: "SNS-003",
    helmetId: "HLM-003",
    workerId: "SM-003",
    worker: "Vikas Negi",
    zone: "Zone B",

    gas: {
      value: 31.2,
      unit: "ppm",
      status: "Warning",
      threshold: 50,
    },

    temperature: {
      value: 42.8,
      unit: "°C",
      status: "Warning",
      threshold: 40,
    },

    motion: {
      value: 0.42,
      unit: "g",
      status: "Warning",
      threshold: 0.5,
    },

    battery: {
      value: 76,
      unit: "%",
      status: "Good",
      threshold: 30,
    },

    signal: {
      value: 84,
      unit: "%",
      status: "Good",
      threshold: 70,
    },
  },

  {
    id: "SNS-004",
    helmetId: "HLM-004",
    workerId: "SM-004",
    worker: "Aman Rawat",
    zone: "Zone C",

    gas: {
      value: 78,
      unit: "ppm",
      status: "Critical",
      threshold: 50,
    },

    temperature: {
      value: 44.1,
      unit: "°C",
      status: "Warning",
      threshold: 40,
    },

    motion: {
      value: 0.82,
      unit: "g",
      status: "Critical",
      threshold: 0.5,
    },

    battery: {
      value: 61,
      unit: "%",
      status: "Good",
      threshold: 30,
    },

    signal: {
      value: 67,
      unit: "%",
      status: "Weak",
      threshold: 70,
    },
  },

  {
    id: "SNS-005",
    helmetId: "HLM-005",
    workerId: "SM-005",
    worker: "Deepak Joshi",
    zone: "Zone A",

    gas: {
      value: 17.1,
      unit: "ppm",
      status: "Normal",
      threshold: 50,
    },

    temperature: {
      value: 30.8,
      unit: "°C",
      status: "Normal",
      threshold: 40,
    },

    motion: {
      value: 0.06,
      unit: "g",
      status: "Normal",
      threshold: 0.5,
    },

    battery: {
      value: 91,
      unit: "%",
      status: "Good",
      threshold: 30,
    },

    signal: {
      value: 95,
      unit: "%",
      status: "Excellent",
      threshold: 70,
    },
  },

  {
    id: "SNS-006",
    helmetId: "HLM-006",
    workerId: "SM-006",
    worker: "Karan Bisht",
    zone: "Zone C",

    gas: {
      value: 22.3,
      unit: "ppm",
      status: "Normal",
      threshold: 50,
    },

    temperature: {
      value: 33.4,
      unit: "°C",
      status: "Normal",
      threshold: 40,
    },

    motion: {
      value: 0.13,
      unit: "g",
      status: "Normal",
      threshold: 0.5,
    },

    battery: {
      value: 82,
      unit: "%",
      status: "Good",
      threshold: 30,
    },

    signal: {
      value: 89,
      unit: "%",
      status: "Good",
      threshold: 70,
    },
  },
];

export default sensors;

export {
  sensors,
};