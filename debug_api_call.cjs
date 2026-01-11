
const http = require('http');

const data = JSON.stringify({
    id: 'admin',
    currentPassword: 'admin',
    newPassword: 'admin', // Keeping same for test
    name: 'Super Admin Test'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/admin/update',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('--- SENDING REQUEST ---');
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let body = '';
    res.on('data', (d) => {
        body += d;
    });

    res.on('end', () => {
        console.log('RESPONSE:', body);
    });
});

req.on('error', (error) => {
    console.error('ERROR:', error);
});

req.write(data);
req.end();
