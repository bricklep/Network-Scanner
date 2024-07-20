const express = require('express');
const ping = require('net-ping');
const path = require('path');
const os = require('os');

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/interfaces', (req, res) => {
  const interfaces = os.networkInterfaces();
  const interfaceList = [];
  for (const [name, infos] of Object.entries(interfaces)) {
    for (const info of infos) {
      if (info.family === 'IPv4' && !info.internal) {
        interfaceList.push({ name, address: info.address });
      }
    }
  }
  res.json(interfaceList);
});

app.get('/scan', (req, res) => {
  const session = ping.createSession();
  const devices = [];
  const localNetwork = '192.168.1.'; // Adjust according to your local network

  const scanPromises = [];
  for (let i = 1; i <= 254; i++) {
    const ip = localNetwork + i;
    scanPromises.push(new Promise((resolve) => {
      session.pingHost(ip, (error, target) => {
        if (!error) {
          devices.push(target);
          console.log(target);
        }
        resolve();
      });
    }));
  }

  Promise.all(scanPromises).then(() => {
    res.json(devices);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
