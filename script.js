function generateSSHKey() {
    const keyName = document.getElementById('key-name').value.trim();
    const keyType = document.getElementById('key-type').value;
    const keyLength = document.getElementById('key-length').value;

    if (!keyName) {
        alert('Please enter a key name.');
        return;
    }

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
        document.getElementById('output').innerText = data.message;

        // Download links for keys
        const publicKeyPath = data.publicKeyPath;
        const privateKeyPath = data.privateKeyPath;

        const publicKeyLink = document.createElement('a');
        publicKeyLink.href = publicKeyPath;
        publicKeyLink.textContent = 'Download Public Key';
        publicKeyLink.download = `${keyName}.pub`;
        publicKeyLink.style.display = 'block';
        publicKeyLink.style.marginTop = '10px';
        document.getElementById('output').appendChild(publicKeyLink);

        const privateKeyLink = document.createElement('a');
        privateKeyLink.href = privateKeyPath;
        privateKeyLink.textContent = 'Download Private Key';
        privateKeyLink.download = `${keyName}`;
        privateKeyLink.style.display = 'block';
        privateKeyLink.style.marginTop = '10px';
        document.getElementById('output').appendChild(privateKeyLink);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('output').innerText = 'Error occurred while generating key pair.';
    });
}
