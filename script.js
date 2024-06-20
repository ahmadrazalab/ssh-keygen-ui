function generateSSHKey() {
    const keyName = document.getElementById('key-name').value.trim();
    const keyType = document.getElementById('key-type').value;
    const keyLength = document.getElementById('key-length').value;
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');
    const generateButton = document.getElementById('generate-button');

    if (!keyName) {
        alert('Please enter a key name.');
        return;
    }

    output.innerHTML = '';
    loading.style.display = 'block';
    generateButton.disabled = true;

    const formData = {
        keyName,
        keyType,
        keyLength
    };

    fetch('http://localhost:3000/generate-key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        generateButton.disabled = false;
        output.innerHTML = `<p>${data.message}</p>`;

        // Download link for zip file
        const zipPath = data.zipPath;
        const zipLink = document.createElement('a');
        zipLink.href = zipPath;
        zipLink.download = `${keyName}.zip`;
        zipLink.textContent = 'Download Key Pair (ZIP)';
        zipLink.className = 'download-link';
        output.appendChild(zipLink);
    })
    .catch(error => {
        console.error('Error:', error);
        loading.style.display = 'none';
        generateButton.disabled = false;
        output.innerHTML = '<p class="error">Error occurred while generating key pair.</p>';
    });
}
