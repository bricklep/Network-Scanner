document.getElementById('scanBtn').addEventListener('click', () => {
    fetch('/scan')
      .then(response => response.json())
      .then(data => {
        const deviceList = document.getElementById('deviceList');
        deviceList.innerHTML = '';
        data.forEach(device => {
          const listItem = document.createElement('li');
          listItem.textContent = device;
          deviceList.appendChild(listItem);
        });
      });
  });