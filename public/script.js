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

document.getElementById('interfaceSelect').addEventListener('change', () => {
  const selectedInterface = document.getElementById('interfaceSelect').value;
  console.log('Selected Interface:', selectedInterface);
});

document.getElementById('scanBtn').addEventListener('click', () => {
  const loading = document.getElementById('loading');
  loading.innerHTML = 'Scanning...'; // Show a loading message
  let network = document.getElementById('interfaceSelect').value;

  // Assuming the IP address is in the format xxx.xxx.xxx.xxx
  // Remove the last octet and replace it with '0' for the base network address
  network = network.substring(0, network.lastIndexOf('.')) + '.';
  
  fetch(`/scan?network=${encodeURIComponent(network)}`)
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
      loading.innerHTML = ''; // Clear the loading message
      sortedData.forEach(device => {
        const listItem = document.createElement('li');
        console.log(device);
        listItem.textContent = device;
        deviceList.appendChild(listItem);
      });
    });
});

fetchInterfaces();