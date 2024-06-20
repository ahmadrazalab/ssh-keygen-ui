const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const keysDirectory = path.join(__dirname, 'keys');
if (!fs.existsSync(keysDirectory)) {
    fs.mkdirSync(keysDirectory);
}

app.post('/generate-key', (req, res) => {
    const { keyName, keyType, keyLength } = req.body;

    if (!keyName || !keyType || !keyLength) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const keyPath = path.join(keysDirectory, keyName);
    const command = `ssh-keygen -t ${keyType} -b ${keyLength} -C "${keyName}" -f ${keyPath} -N ""`;

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

        const publicKeyPath = `${keyPath}.pub`;
        const privateKeyPath = keyPath;
        const zipPath = `${keyPath}.zip`;

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            res.status(200).json({
                message: `Key pair generated successfully:\n${stdout}`,
                zipPath: `/keys/${keyName}.zip`
            });
        });

        archive.on('error', (err) => {
            console.error(`Error: ${err.message}`);
            return res.status(500).json({ message: 'Error occurred while creating zip file.' });
        });

        archive.pipe(output);
        archive.file(publicKeyPath, { name: `${keyName}.pub` });
        archive.file(privateKeyPath, { name: keyName });
        archive.finalize();
    });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/keys', express.static(keysDirectory));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
