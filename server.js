const express = require('express');
const ping = require('net-ping');

const app = express();
const port = 3000;

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
