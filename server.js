const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let scriptQueue = [];

app.post('/api/send-script', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }
    scriptQueue.push(code);
    console.log(`[+] Script queued (${code.length} chars)`);
    res.json({ success: true, message: 'Script queued successfully' });
});

app.get('/api/poll', (req, res) => {
    if (scriptQueue.length > 0) {
        const scriptToExecute = scriptQueue.shift();
        return res.json({ hasScript: true, code: scriptToExecute });
    }
    res.json({ hasScript: false });
});

app.get('/api/ping', (req, res) => {
    res.json({ status: 'online' });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://192.168.0.109:${PORT}`);
});