console.log('Hello from script.js');

async function fetchInterfaces() {
  const response = await fetch('/interfaces');
  const interfaces = await response.json();
  const select = document.getElementById('interfaceSelect');
  interfaces.forEach(iface => {
    const option = document.createElement('option');
    option.value = iface.address;
    option.textContent = `${iface.name} (${iface.address})`;
    select.appendChild(option);
  });
}

document.getElementById('scanBtn').addEventListener('click', () => {
  const network = document.getElementById('interfaceSelect').value;
  fetch(`/scan?network=${network}`)
    .then(response => response.json())
    .then(data => {
      // Sort the IP addresses
      const sortedData = data.sort((a, b) => {
        const aParts = a.split('.').map(num => parseInt(num, 10));
        const bParts = b.split('.').map(num => parseInt(num, 10));
        for (let i = 0; i < 4; i++) {
          if (aParts[i] < bParts[i]) return -1;
          if (aParts[i] > bParts[i]) return 1;
        }
        return 0;
      });

      const deviceList = document.getElementById('deviceList');
      deviceList.innerHTML = '';
      data.forEach(device => {
        const listItem = document.createElement('li');
        console.log(device);
        listItem.textContent = device;
        deviceList.appendChild(listItem);
      });
    });
});

fetchInterfaces();