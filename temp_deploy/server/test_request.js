
const http = require('http');

const data = JSON.stringify({
    partnerId: 1,
    partnerName: "Test Partner (Script)",
    userId: "script_user",
    userName: "Script Tester",
    scheduleId: "script_sched_1",
    scheduleTitle: "Script Schedule",
    scheduleDate: "2026-01-11",
    status: "pending",
    timestamp: new Date().toISOString()
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/partners/requests',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
