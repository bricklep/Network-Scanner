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
  console.log('Received network query parameter:', req.query.network); // Log the received network parameter

  // Check for invalid network parameter (including just a period)
  if (typeof req.query.network === 'undefined' || req.query.network === null || req.query.network.trim() === '' || req.query.network.trim() === '.') {
    console.log('Invalid or no network address provided');
    return res.send("Interface has no IP address");
  }

  // Basic validation for an IP address prefix
  const ipPrefixRegex = /^(?:[0-9]{1,3}\.){3}$/;
  if (!ipPrefixRegex.test(req.query.network)) {
    console.log('Invalid IP address prefix');
    return res.send("Invalid IP address prefix");
  }

  const session = ping.createSession();
  const devices = [];
  const baseNetwork = req.query.network; // Use provided network address directly
 
  const scanPromises = [];
  for (let i = 1; i <= 254; i++) {
    const ip = baseNetwork + i;
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
