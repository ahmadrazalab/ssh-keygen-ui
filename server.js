const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Example CORS setup (adjust as needed)
const cors = require('cors');
app.use(cors());

app.post('/generate-key', (req, res) => {
    const { keyName, keyType, keyLength } = req.body;

    if (!keyName || !keyType || !keyLength) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const command = `ssh-keygen -t ${keyType} -b ${keyLength} -C "${keyName}" -f ${keyName}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ message: 'Error occurred while generating key pair.' });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ message: 'Error occurred while generating key pair.' });
        }
        console.log(`stdout: ${stdout}`);

        const publicKeyPath = `${keyName}.pub`;
        const privateKeyPath = `${keyName}`;

        res.status(200).json({
            message: `Key pair generated successfully:\n${stdout}`,
            publicKeyPath,
            privateKeyPath
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
