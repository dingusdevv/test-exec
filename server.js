const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let scriptQueue = [];
let consoleLogs = []; 

app.post('/api/send-script', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });
    
    scriptQueue.push(code);
    res.json({ success: true, message: 'Script queued' });
});

app.get('/api/poll', (req, res) => {
    if (scriptQueue.length > 0) {
        const scriptToExecute = scriptQueue.shift();
        return res.json({ hasScript: true, code: scriptToExecute });
    }
    res.json({ hasScript: false });
});

app.post('/api/logs', (req, res) => {
    const { player, type, message, timestamp } = req.body;
    if (message) {
        const logEntry = `[${timestamp || new Date().toLocaleTimeString()}] [${player || 'Client'}] [${type || 'INFO'}]: ${message}`;
        consoleLogs.push(logEntry);
        
        if (consoleLogs.length > 100) consoleLogs.shift();
    }
    res.json({ success: true });
});

app.get('/api/logs', (req, res) => {
    res.json({ logs: consoleLogs });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
